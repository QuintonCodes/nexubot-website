import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get("key");

  if (!licenseKey) {
    return NextResponse.json(
      { error: "License key is required" },
      { status: 401 },
    );
  }

  try {
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
        { error: "Unauthorized. Payment not verified." },
        { status: 403 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "djyh1j8bs";

    // Map to your exact Cloudinary upload URLs with the fl_attachment flag injected
    const isIct = license.productName.toLowerCase().includes("ict");
    const cleanUrl = isIct
      ? `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856981/nexubot-ict_dpv5ve.zip`
      : `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856982/nexubot-poi_hwauwo.zip`;

    return NextResponse.redirect(cleanUrl);
  } catch (error) {
    console.error("Secure download error:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 },
    );
  }
}
