import axios from "axios";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendDeliveryEmail } from "@/lib/email";
import { PAYFAST_PASSPHRASE, PAYFAST_VALIDATION_URL } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const data = Object.fromEntries(params.entries());

    // 1. Reconstruct string exactly as received for ITN signature matching
    let pfOutput = "";
    for (const [key, value] of params.entries()) {
      if (key !== "signature") {
        pfOutput += `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, "+")}&`;
      }
    }

    const signatureString =
      pfOutput.slice(0, -1) +
      (PAYFAST_PASSPHRASE
        ? `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE.trim()).replace(/%20/g, "+")}`
        : "");

    const generatedSignature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    if (data.signature !== generatedSignature) {
      console.error("ITN Signature mismatch");
      return NextResponse.json(
        { error: "Signature mismatch" },
        { status: 400 },
      );
    }

    // 2. PayFast Server-to-Server Validation
    const validationResponse = await axios.post(
      PAYFAST_VALIDATION_URL,
      bodyText,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const validationResult = await validationResponse.data;

    if (validationResult !== "VALID") {
      console.error("ITN Validation failed with PayFast:", validationResult);
      return NextResponse.json({ error: "Invalid ITN" }, { status: 400 });
    }

    // 3. Commit Database State
    const paymentStatus = data.payment_status;
    const mPaymentId = data.m_payment_id;

    if (paymentStatus === "COMPLETE") {
      // Capture the updated transaction and include the license to retrieve the licenseKey
      const updatedTransaction = await db.transaction.update({
        where: { m_payment_id: mPaymentId },
        data: {
          status: "COMPLETE",
          pf_payment_id: data.pf_payment_id,
          paymentMethod: data.payment_method,
          license: {
            update: {
              isActive: true, // Activates the pre-generated license
            },
          },
        },
        include: {
          license: true,
        },
      });

      // 4. Trigger Delivery Email Asynchronously
      if (updatedTransaction.license) {
        try {
          const emailResponse = await sendDeliveryEmail({
            email: updatedTransaction.customerEmail,
            productName: updatedTransaction.itemName,
            licenseKey: updatedTransaction.license.licenseKey,
          });

          // Log specific API errors returned by Resend
          if (emailResponse.error) {
            console.error("Resend API Error:", emailResponse.error);
          }
        } catch (emailError) {
          console.error(
            "Critical: DB updated, but delivery email failed:",
            emailError,
          );
        }
      }
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      await db.transaction.update({
        where: { m_payment_id: mPaymentId },
        data: {
          status: paymentStatus as "FAILED" | "CANCELLED",
          pf_payment_id: data.pf_payment_id,
        },
      });
    }

    // Acknowledge receipt to PayFast so they stop retrying the webhook
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("ITN Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
