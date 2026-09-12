import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendDeliveryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const isDevMode = process.env.CURRENT_ENV === "development";
    let event;

    if (isDevMode) {
      event = JSON.parse(rawBody);
    } else {
      const webhookId = req.headers.get("webhook-id");
      const webhookTimestamp = req.headers.get("webhook-timestamp");
      const webhookSignatureHeader = req.headers.get("webhook-signature");

      if (!webhookId || !webhookTimestamp || !webhookSignatureHeader) {
        return NextResponse.json(
          { error: "Missing required webhook headers" },
          { status: 400 },
        );
      }

      // Replay Attack Prevention (Reject if > 5 minutes old)
      const timestampMs =
        webhookTimestamp.length <= 10
          ? parseInt(webhookTimestamp, 10) * 1000
          : parseInt(webhookTimestamp, 10);

      if (Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
        return NextResponse.json(
          { error: "Timestamp expired" },
          { status: 401 },
        );
      }

      // 2. Signature Verification (HMAC-SHA256 constant-time comparison)
      const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
      const secret = process.env.WHOP_WEBHOOK_SECRET || "";

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(signedPayload)
        .digest("base64");

      const signatureParts = webhookSignatureHeader.split(",");
      const actualSignature =
        signatureParts.length > 1 ? signatureParts[1] : signatureParts[0];

      const expectedBuffer = Buffer.from(expectedSignature, "base64");
      const actualBuffer = Buffer.from(actualSignature, "base64");

      if (
        expectedBuffer.length !== actualBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      event = JSON.parse(rawBody);
    }

    if (
      event.type === "payment.succeeded" ||
      event.type === "membership.went_valid"
    ) {
      // Traverse possible email locations in Whop payloads
      const customerEmail =
        event.data?.user?.email ||
        event.data?.email ||
        event.data?.customer?.email;

      if (!customerEmail) {
        return NextResponse.json(
          { error: "Unprocessable Entity" },
          { status: 422 },
        );
      }

      // Match against the most recent PENDING transaction for this user
      const pendingTransaction = await db.transaction.findFirst({
        where: {
          user: { email: customerEmail },
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
        include: { license: true, user: true },
      });

      if (!pendingTransaction) {
        return NextResponse.json({
          success: true,
          note: "No pending transaction found",
        });
      }

      // 4. Commit Database State
      const updatedTransaction = await db.transaction.update({
        where: { id: pendingTransaction.id },
        data: {
          status: "COMPLETE",
          whopPaymentId: event.data?.id,
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

      // 5. Trigger Delivery Email Asynchronously
      if (updatedTransaction.license) {
        try {
          const emailResponse = await sendDeliveryEmail({
            email: updatedTransaction.user.email,
            productName: updatedTransaction.productName,
            licenseKey: updatedTransaction.license.licenseKey,
          });

          // Only log critical delivery failures in production
          if (emailResponse.error) {
            console.error("Delivery email failed:", emailResponse.error);
          }
        } catch (emailError) {
          console.error("Delivery email exception:", emailError);
        }
      }
    } else if (event.type === "payment.failed") {
      const customerEmail = event.data?.user?.email || event.data?.email;

      if (customerEmail) {
        const pendingTransaction = await db.transaction.findFirst({
          where: { user: { email: customerEmail }, status: "PENDING" },
          orderBy: { createdAt: "desc" },
        });

        if (pendingTransaction) {
          await db.transaction.update({
            where: { id: pendingTransaction.id },
            data: {
              status: "FAILED",
              whopPaymentId: event.data?.id,
            },
          });
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
