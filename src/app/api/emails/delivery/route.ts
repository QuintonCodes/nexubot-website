import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import DeliveryEmail from "@/components/emails/delivery-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, productName, licenseKey } = await request.json();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "djyh1j8bs";
    const isIct = productName.toLowerCase().includes("ict");

    // Explicitly use the discovered URLs
    const downloadUrl = isIct
      ? `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856981/nexubot-ict_dpv5ve.zip`
      : `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856982/nexubot-poi_hwauwo.zip`;

    const senderEmail =
      process.env.CURRENT_ENV === "production"
        ? `Nexubot Systems <${process.env.DELIVERY_FROM_EMAIL}>`
        : "Nexubot Systems <onboarding@resend.dev>";

    // Resend email pipeline
    const data = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: `Your Nexubot Systems EA: ${productName}`,
      react: DeliveryEmail({ productName, licenseKey, downloadUrl }),
      attachments: [
        {
          filename: isIct ? "nexubot-ict.zip" : "nexubot-poi.zip",
          path: downloadUrl, // Resend automatically streams and attaches the file from Cloudinary
        },
      ],
    });

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delivery email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
