import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateLicenseKey } from "@/lib/license";
import {
  generatePayFastSignature,
  PAYFAST_MERCHANT_ID,
  PAYFAST_MERCHANT_KEY,
  PAYFAST_URL,
} from "@/lib/payfast";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, amount, productName, productId } =
      await req.json();

    // Strip currency symbols and formatting (e.g., "R2999.00" -> 2999.00)
    const numericAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.]/g, ""))
        : parseFloat(amount);

    if (isNaN(numericAmount)) {
      return NextResponse.json(
        { error: "Invalid amount format provided." },
        { status: 400 },
      );
    }

    const licenseKey = generateLicenseKey();

    const transaction = await db.transaction.create({
      data: {
        amount: numericAmount,
        itemName: productName,
        customerFirst: firstName,
        customerLast: lastName,
        customerEmail: email,
        status: "PENDING",
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
        license: {
          create: {
            licenseKey,
            productName,
            isActive: false, // Activated later by the ITN Webhook
            user: {
              connectOrCreate: {
                where: { email },
                create: { email },
              },
            },
          },
        },
      },
    });

    const rawAppUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const appUrl = rawAppUrl.replace(/\/+$/, "");

    const payload: Record<string, string> = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${appUrl}/checkout/success?product=${productId}&key=${licenseKey}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      notify_url: `${appUrl}/api/payfast/notify`,
      name_first: firstName,
      name_last: lastName,
      email_address: email,
      m_payment_id: transaction.m_payment_id,
      amount: numericAmount.toFixed(2),
      item_name: productName,
    };

    payload.signature = generatePayFastSignature(payload);

    return NextResponse.json({ url: PAYFAST_URL, payload });
  } catch (error) {
    console.error("Checkout Init Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 },
    );
  }
}
