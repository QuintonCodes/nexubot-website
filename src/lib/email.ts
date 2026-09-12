import * as React from "react";
import { Resend } from "resend";

import ContactEmail from "@/components/emails/contact-email";
import DeliveryEmail from "@/components/emails/delivery-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const isProd = process.env.CURRENT_ENV === "production";

  const recipientEmail = isProd
    ? process.env.SUPPORT_EMAIL || ""
    : "kagisojiyane28@gmail.com";
  const senderEmail = isProd
    ? `Nexubot Contact <${process.env.CONTACT_FROM_EMAIL}>`
    : "Nexubot Contact <onboarding@resend.dev>";

  return await resend.emails.send({
    from: senderEmail,
    to: recipientEmail,
    replyTo: data.email,
    subject: `New Support Inquiry: ${data.topic.charAt(0).toUpperCase() + data.topic.slice(1)} - ${data.name}`,
    react: React.createElement(ContactEmail, data),
  });
}

export async function sendDeliveryEmail(data: {
  email: string;
  productName: string;
  licenseKey: string;
}) {
  const isProd = process.env.CURRENT_ENV === "production";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "djyh1j8bs";
  const isIct = data.productName.toLowerCase().includes("ict");

  const downloadUrl = isIct
    ? `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856981/nexubot-ict_dpv5ve.zip`
    : `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v1788856982/nexubot-poi_hwauwo.zip`;

  const senderEmail = isProd
    ? `Nexubot Systems <${process.env.DELIVERY_FROM_EMAIL}>`
    : "Nexubot Systems <onboarding@resend.dev>";

  // Force recipient to your verified email in non-production environments
  const recipientEmail = isProd ? data.email : "kagisojiyane28@gmail.com";

  return await resend.emails.send({
    from: senderEmail,
    to: recipientEmail,
    subject: `Your Nexubot Systems EA: ${data.productName}`,
    react: React.createElement(DeliveryEmail, {
      productName: data.productName,
      licenseKey: data.licenseKey,
    }),
    attachments: [
      {
        filename: isIct ? "nexubot-ict.zip" : "nexubot-poi.zip",
        path: downloadUrl,
      },
    ],
  });
}
