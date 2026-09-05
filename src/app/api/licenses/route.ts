import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createLicense, findLicense } from "@/lib/db";

const createLicenseSchema = z.object({
  email: z.email({ message: "A valid email address is required." }),
  productName: z
    .string()
    .trim()
    .min(1, { message: "Product name is required." })
    .max(120),
  maxTerminals: z.number().int().min(1).max(100).default(1),
  amount: z.number().positive({ message: "Amount must be a positive number." }),
  peachPaymentId: z.string().optional(),
  expiresAt: z.iso.datetime().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key || key.trim() === "" || key.length > 64) {
      return NextResponse.json(
        { error: "A valid license key parameter is required." },
        { status: 400 },
      );
    }

    const license = await findLicense(key);
    if (!license) {
      return NextResponse.json(
        { error: "License not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ license }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/licenses]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLicenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const licenseData = {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    };

    const license = await createLicense(licenseData);

    return NextResponse.json({ license }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/licenses]", error);
    return NextResponse.json(
      { error: "Unable to process license creation." },
      { status: 500 },
    );
  }
}
