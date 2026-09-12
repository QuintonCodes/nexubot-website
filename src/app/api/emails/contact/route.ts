import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Please provide a valid email address"),
  topic: z.string().min(1, "Topic is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.literal(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data provided." },
        { status: 400 },
      );
    }

    const { error, data } = await sendContactEmail(parsed.data);

    if (error) {
      console.error("Resend API failed to dispatch contact email:", error);
      return NextResponse.json(
        { error: "Failed to dispatch email. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Contact route exception:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
