import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

// Configure Cloudinary instance securely
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const fileKey = license.productName.toLowerCase().includes("ict")
      ? "nexubot-ict"
      : "nexubot-poi";

    const publicId = `nexubot-systems/${fileKey}.zip`;
    const url = cloudinary.url(publicId, {
      resource_type: "raw",
      flags: "attachment",
    });

    // 302 Redirect forces the browser to hit the secure CDN URL and start downloading
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Secure download error:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 },
    );
  }
}
