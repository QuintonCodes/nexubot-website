import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { findLicense } from "@/lib/license";

const licenseSchema = z.object({
  key: z.string().min(1, "A valid license key parameter is required.").max(64),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = licenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message, valid: false },
        { status: 400 },
      );
    }

    const license = await findLicense(parsed.data.key);

    // Ensure the license exists and is actively authorized
    if (!license || !license.isActive) {
      return NextResponse.json(
        { error: "License not found or inactive.", valid: false },
        { status: 404 },
      );
    }

    return NextResponse.json({ license, valid: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching license:", error);
    return NextResponse.json(
      { error: "Internal Server Error.", valid: false },
      { status: 500 },
    );
  }
}
