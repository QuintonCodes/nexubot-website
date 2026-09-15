import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
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

    const isDevMode = process.env.CURRENT_ENV === "development";

    // 1. Fetch existing transaction states for this product & email
    const existingTransactions = await db.transaction.findMany({
      where: {
        user: { email },
        productName,
        status: {
          in: ["COMPLETE", "PENDING"],
        },
      },
    });

    // 2. Prevent double purchases if they already own it
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

    // 3. Cleanup orphaned checkouts
    const pendingTxIds = existingTransactions
      .filter((tx) => tx.status === "PENDING")
      .map((tx) => tx.id);

    if (pendingTxIds.length > 0) {
      await db.transaction.updateMany({
        where: { id: { in: pendingTxIds } },
        data: { status: "CANCELLED" },
      });
    }

    const licenseKey = generateLicenseKey();

    // 4. Register transaction as PENDING to await webhook fulfillment
    const transaction = await db.transaction.create({
      data: {
        amount: numericAmount,
        productName,
        status: "PENDING",
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
            isActive: false,
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

    // 5. Configure Plan IDs dynamically based on CURRENT_ENV
    const configuredPlans: Record<string, string | undefined> = isDevMode
      ? {
          "nexubot-ict":
            process.env.WHOP_SANDBOX_PRODUCT_ID_NEXUBOT_ICT ||
            "plan_776HiYv4jdbhv",
          "nexubot-poi":
            process.env.WHOP_SANDBOX_PRODUCT_ID_NEXUBOT_POI ||
            "plan_5tfjgHEuSK46T",
        }
      : {
          "nexubot-ict":
            process.env.WHOP_PRODUCT_ID_NEXUBOT_ICT || "plan_3PZUYjHK2f8wT",
          "nexubot-poi":
            process.env.WHOP_PRODUCT_ID_NEXUBOT_POI || "plan_Gv1jeJPjX5xFj",
        };

    const planValue = configuredPlans[productId];
    if (!planValue) {
      return NextResponse.json(
        { error: "Invalid product ID configured" },
        { status: 400 },
      );
    }

    const checkoutHost = isDevMode
      ? "https://sandbox.whop.com"
      : "https://whop.com";

    // 6. Build the Whop checkout URL with dynamic tracking
    const checkoutUrl = new URL(`${checkoutHost}/checkout/${planValue}`);
    checkoutUrl.searchParams.set("first_name", firstName);
    checkoutUrl.searchParams.set("last_name", lastName);
    checkoutUrl.searchParams.set("email", email);

    // Inject transaction id into Whop payload tracking
    checkoutUrl.searchParams.set("custom_transaction_id", transaction.id);

    const returnUrl = new URL(`${req.nextUrl.origin}/checkout/success`);
    returnUrl.searchParams.set("product", productId);
    returnUrl.searchParams.set("key", licenseKey);

    const cancelUrl = new URL(`${req.nextUrl.origin}/checkout/cancel`);

    checkoutUrl.searchParams.set("return_url", returnUrl.toString());
    checkoutUrl.searchParams.set("cancel_url", cancelUrl.toString());

    const response = NextResponse.json({
      checkoutUrl: checkoutUrl.toString(),
      transactionId: transaction.id,
    });

    // 7. Set a secure HTTP cookie to track this specific transaction ID.
    // This entirely bypasses Whop aggressively stripping query parameters on redirect.
    response.cookies.set("pending_tx_id", transaction.id, {
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
      httpOnly: true,
      secure: !isDevMode,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Whop checkout error:", error);
    return NextResponse.json(
      { error: "Checkout Creation Failed." },
      { status: 500 },
    );
  }
}
