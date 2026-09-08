import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import ContactEmail from "@/components/emails/contact-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, topic, message } = body;

    // Use .env to determine inbox routing. Defaults to your registered Resend email during development.
    const recipientEmail =
      process.env.CURRENT_ENV === "production"
        ? process.env.SUPPORT_EMAIL || ""
        : "kagisojiyane28@gmail.com";

    const senderEmail =
      process.env.CURRENT_ENV === "production"
        ? `Nexubot Contact <${process.env.CONTACT_FROM_EMAIL}>`
        : "Nexubot Contact <onboarding@resend.dev>";

    const data = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      replyTo: email,
      subject: `New Support Inquiry: ${topic} - ${name}`,
      react: ContactEmail({ name, email, topic, message }),
    });

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
