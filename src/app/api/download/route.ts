import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

const downloadSchema = z.object({
  key: z
    .string()
    .min(1, "License key is required.")
    .max(64, "Invalid key format."),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = downloadSchema.safeParse({ key: searchParams.get("key") });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const licenseKey = parsed.data.key;

    const license = await db.license.findUnique({
      where: { licenseKey },
      include: { transaction: true },
    });

    if (
      !license ||
      !license.isActive ||
      license.transaction?.status !== "COMPLETE"
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Payment not verified or license inactive." },
        { status: 403 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "djyh1j8bs";

    // Map to your exact Cloudinary upload URLs with the fl_attachment flag injected
    const isIct = license.productName.toLowerCase().includes("ict");
    const cleanUrl = isIct
      ? `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856981/nexubot-ict_dpv5ve.zip`
      : `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856982/nexubot-poi_hwauwo.zip`;

    // Prevent caching of this endpoint so revoked keys instantly lose access
    const response = NextResponse.redirect(cleanUrl);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0",
    );

    return response;
  } catch (error) {
    console.error("Secure download route exception:", error);
    return NextResponse.json(
      { error: "Failed to process download." },
      { status: 500 },
    );
  }
}
