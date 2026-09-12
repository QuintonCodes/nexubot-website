import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { sendDeliveryEmail } from "@/lib/email";
import { generateLicenseKey } from "@/lib/license";

const checkoutRequestSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required."),
  productName: z.string().trim().min(1, "Product name is required."),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) =>
      typeof val === "string" ? parseFloat(val.replace(/[^0-9.]/g, "")) : val,
    )
    .refine((val) => !isNaN(val), {
      message: "Invalid amount format provided.",
    }),
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  email: z.string().trim().email("Enter a valid billing email."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      productId,
      productName,
      amount: numericAmount,
      firstName,
      lastName,
      email,
    } = parsed.data;

    // Fetch existing transaction states for this product & email
    const existingTransactions = await db.transaction.findMany({
      where: {
        user: { email },
        productName,
        status: {
          in: ["COMPLETE", "PENDING"],
        },
      },
    });

    // 1. Prevent double purchases if they already own it
    const hasCompleted = existingTransactions.some(
      (tx) => tx.status === "COMPLETE",
    );
    if (hasCompleted) {
      return NextResponse.json(
        {
          error:
            "You already own this EA. Please check your email for the delivery details and license key.",
        },
        { status: 409 },
      );
    }

    // 2. Cleanup orphaned checkouts (e.g., user clicked back button on Whop)
    const pendingTxIds = existingTransactions
      .filter((tx) => tx.status === "PENDING")
      .map((tx) => tx.id);

    if (pendingTxIds.length > 0) {
      await db.transaction.updateMany({
        where: { id: { in: pendingTxIds } },
        data: { status: "CANCELLED" },
      });
    }

    const isDevMode = process.env.CURRENT_ENV === "development";
    const licenseKey = generateLicenseKey();

    // Register transaction (Auto-complete if in dev mode)
    const transaction = await db.transaction.create({
      data: {
        amount: numericAmount,
        productName,
        status: isDevMode ? "COMPLETE" : "PENDING",
        whopPaymentId: isDevMode ? `dev_mock_${Date.now()}` : undefined,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email, firstName, lastName },
          },
        },
        license: {
          create: {
            licenseKey,
            productName,
            isActive: isDevMode,
            user: {
              connectOrCreate: {
                where: { email },
                create: { email, firstName, lastName },
              },
            },
          },
        },
      },
    });

    // Pass transaction ID directly into return URLs for state continuity
    const returnUrl = new URL(`${req.nextUrl.origin}/checkout/success`);
    returnUrl.searchParams.set("product", productId);
    returnUrl.searchParams.set("key", licenseKey);

    // Short-circuit to success page and trigger email in Dev Mode
    if (isDevMode) {
      const emailResponse = await sendDeliveryEmail({
        email,
        productName,
        licenseKey,
      });

      if (emailResponse.error) {
        console.error("Dev mode email simulation failed:", emailResponse.error);
      }

      return NextResponse.json({
        checkoutUrl: returnUrl.toString(),
        transactionId: transaction.id,
      });
    }

    // Map plans via environment variables, defaulting to known plan IDs
    const configuredPlans: Record<string, string> = {
      "nexubot-ict":
        process.env.WHOP_PRODUCT_ID_NEXUBOT_ICT || "plan_3PZUYjHK2f8wT",
      "nexubot-poi":
        process.env.WHOP_PRODUCT_ID_NEXUBOT_POI || "plan_Gv1jeJPjX5xFj",
    };

    const planValue = configuredPlans[productId];
    if (!planValue) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    // Build the Whop checkout URL with dynamic tracking
    const checkoutUrl = new URL(`https://whop.com/checkout/${planValue}`);
    checkoutUrl.searchParams.set("first_name", firstName);
    checkoutUrl.searchParams.set("last_name", lastName);
    checkoutUrl.searchParams.set("email", email);

    const cancelUrl = new URL(`${req.nextUrl.origin}/checkout/cancel`);

    checkoutUrl.searchParams.set("return_url", returnUrl.toString());
    checkoutUrl.searchParams.set("cancel_url", cancelUrl.toString());

    return NextResponse.json({
      checkoutUrl: checkoutUrl.toString(),
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Whop checkout error:", error);
    return NextResponse.json(
      { error: "Checkout Creation Failed." },
      { status: 500 },
    );
  }
}
