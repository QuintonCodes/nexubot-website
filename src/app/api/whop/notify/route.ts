import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendDeliveryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const isDevMode = process.env.CURRENT_ENV === "development";

    const webhookId = req.headers.get("webhook-id");
    const webhookTimestamp = req.headers.get("webhook-timestamp");
    const webhookSignatureHeader = req.headers.get("webhook-signature");

    if (!webhookId || !webhookTimestamp || !webhookSignatureHeader) {
      return NextResponse.json(
        { error: "Missing required webhook headers" },
        { status: 400 },
      );
    }

    // 1. Replay Attack Prevention (Relaxed to 15 mins for potential Whop queue delays)
    const timestampMs =
      webhookTimestamp.length <= 10
        ? parseInt(webhookTimestamp, 10) * 1000
        : parseInt(webhookTimestamp, 10);

    if (Math.abs(Date.now() - timestampMs) > 15 * 60 * 1000) {
      return NextResponse.json({ error: "Timestamp expired" }, { status: 401 });
    }

    const secret = isDevMode
      ? process.env.WHOP_SANDBOX_WEBHOOK_SECRET || ""
      : process.env.WHOP_WEBHOOK_SECRET || "";

    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret unconfigured" },
        { status: 500 },
      );
    }

    const hmacKey = secret.startsWith("whsec_")
      ? Buffer.from(secret.replace("whsec_", ""), "base64")
      : secret;

    // 2. Verify Signature
    const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", hmacKey)
      .update(signedPayload, "utf8")
      .digest("base64");

    const expectedBuffer = Buffer.from(expectedSignature, "base64");

    const passedSignatures = webhookSignatureHeader
      .split(" ")
      .map((item) => {
        const parts = item.split(",");
        return parts.length > 1 ? parts[1] : parts[0];
      })
      .filter(Boolean);

    const isValid = passedSignatures.some((actualSignature) => {
      const actualBuffer = Buffer.from(actualSignature, "base64");
      return (
        expectedBuffer.length === actualBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, actualBuffer)
      );
    });

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    const safePaymentId =
      event.data?.payment_id || event.data?.receipt_id || event.data?.id;

    const customerEmail =
      event.data?.user?.email ||
      event.data?.email ||
      event.data?.customer?.email ||
      event.data?.buyer?.email;

    console.log(
      `[WHOP WEBHOOK] Type: ${event.type} | ID: ${safePaymentId} | Email: ${customerEmail}`,
    );

    const successEvents = [
      "payment.succeeded",
      "payment.captured",
      "membership.went_valid",
      "order.created",
    ];

    // 3. Process Successful Transaction
    if (successEvents.includes(event.type)) {
      let targetTransaction = await db.transaction.findFirst({
        where: { whopPaymentId: safePaymentId },
        include: { license: true, user: true },
      });

      // Edge Case Handler: Aggressive Case-Insensitive Fallback
      // Ignores current status so a transaction marked FAILED from a prior decline
      // can be successfully recovered if the user immediately retries.
      if (!targetTransaction && customerEmail) {
        targetTransaction = await db.transaction.findFirst({
          where: {
            user: {
              email: {
                equals: customerEmail,
                mode: "insensitive",
              },
            },
          },
          orderBy: { createdAt: "desc" },
          include: { license: true, user: true },
        });
      }

      if (targetTransaction) {
        const updatedTransaction = await db.transaction.update({
          where: { id: targetTransaction.id },
          data: {
            status: "COMPLETE",
            whopPaymentId: safePaymentId, // Ensure DB tracks the final successful ID
            license: {
              update: {
                isActive: true,
              },
            },
          },
          include: {
            license: true,
            user: true,
          },
        });

        console.log(
          `[WHOP WEBHOOK] Successfully verified transaction: ${updatedTransaction.id}`,
        );

        if (
          updatedTransaction.license &&
          targetTransaction.status !== "COMPLETE"
        ) {
          try {
            await sendDeliveryEmail({
              email: updatedTransaction.user.email,
              productName: updatedTransaction.productName,
              licenseKey: updatedTransaction.license.licenseKey,
            });
          } catch (emailError) {
            console.error("Email exception:", emailError);
          }
        }
      } else {
        console.warn(
          `[WHOP WEBHOOK] Success ignored - No matching transaction found for email: ${customerEmail}`,
        );
      }
    } else if (
      event.type === "payment.failed" ||
      event.type === "payment.declined"
    ) {
      if (customerEmail) {
        // Strict Guard: ONLY update if PENDING.
        // This ensures a delayed Sandbox fail webhook never overwrites a success.
        const pendingTransaction = await db.transaction.findFirst({
          where: {
            user: {
              email: {
                equals: customerEmail,
                mode: "insensitive",
              },
            },
            status: "PENDING",
          },
          orderBy: { createdAt: "desc" },
        });

        if (pendingTransaction) {
          await db.transaction.update({
            where: { id: pendingTransaction.id },
            data: {
              status: "FAILED",
              whopPaymentId: safePaymentId,
            },
          });
          console.log(
            `[WHOP WEBHOOK] Marked transaction ${pendingTransaction.id} as FAILED`,
          );
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Whop Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
