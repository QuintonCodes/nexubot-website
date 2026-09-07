import { NextRequest, NextResponse } from "next/server";

import { findLicense } from "@/lib/license";

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
