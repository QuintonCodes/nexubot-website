import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type DeliveryEmailProps = {
  productName: string;
  licenseKey: string;
  downloadUrl: string;
};

export default function DeliveryEmail({
  productName,
  licenseKey,
  downloadUrl,
}: DeliveryEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  return (
    <Html>
      <Head />
      <Preview>Your {productName} EA is ready.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Section */}
          <Section style={headerSection}>
            <Img
              src={`${baseUrl}/nexubot-logo.svg`}
              width="48"
              height="48"
              alt="Nexubot Systems Logo"
              style={logo}
            />
            <Text style={brandText}>
              <span>
                <span style={brandBlue}>Nexu</span>
                <span style={brandGreen}>bot</span>
              </span>{" "}
              <span>Systems</span>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Title & Intro */}
          <Text style={preHeader}>License Activation</Text>
          <Heading style={heading}>
            Your <span style={brandGreen}>{productName}</span> EA is ready.
          </Heading>
          <Text style={bodyText}>
            Thank you for purchasing {productName}. Your automated system and
            license key are attached below. Ensure you keep this key secure.
          </Text>

          {/* License Key Card */}
          <Section style={licenseCard}>
            <Text style={fieldLabel}>License Key</Text>
            <Text style={licenseCode}>{licenseKey}</Text>
          </Section>

          {/* Action Button */}
          <Section style={buttonSection}>
            <Button href={downloadUrl} style={button}>
              Download Package Now
            </Button>
          </Section>

          {/* Footer */}
          <Text style={footerText}>
            If you have deployment questions, reply directly to this email or
            visit our support dashboard.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles mapped from contact-email_4.tsx and globals.css
const main = {
  backgroundColor: "#181818",
  fontFamily: "Arial, sans-serif",
  color: "#ebebeb",
  padding: "20px",
};

const container = {
  backgroundColor: "#1e1e1e",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "20px",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "700px",
};

const headerSection = {
  paddingBottom: "16px",
  display: "inline-block",
  alignItems: "center",
  marginRight: "12px",
};

const logo = {
  display: "inline-block",
  verticalAlign: "middle",
};

const brandText = {
  display: "inline-block",
  verticalAlign: "middle",
  gap: "8px",
  fontSize: "22px",
  fontWeight: "bold",
  margin: "0",
  color: "#ebebeb",
  letterSpacing: "-0.025em",
};

const brandBlue = {
  color: "#2a9bc7",
};

const brandGreen = {
  color: "#03c963",
};

const divider = {
  borderColor: "rgba(255, 255, 255, 0.08)",
  margin: "0",
};

const preHeader = {
  fontSize: "12px",
  color: "#03c963",
  textTransform: "uppercase" as const,
  letterSpacing: "0.2em",
  fontWeight: "600",
  marginTop: "24px",
  marginBottom: "8px",
};

const heading = {
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: "600",
  marginTop: "0",
  marginBottom: "20px",
  color: "#ebebeb",
};

const bodyText = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#8a8a8a",
  marginBottom: "24px",
};

const licenseCard = {
  backgroundColor: "#232323",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "20px",
  marginBottom: "24px",
};

const fieldLabel = {
  fontSize: "12px",
  color: "#8a8a8a",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  fontWeight: "600",
};

const licenseCode = {
  fontSize: "18px",
  color: "#03c963",
  fontFamily: "ui-monospace, 'SFMono-Regular', 'Menlo', monospace",
  margin: "0",
  wordBreak: "break-all" as const,
};

const buttonSection = {
  marginTop: "12px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#03c963",
  color: "#06180d",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#8a8a8a",
  marginTop: "24px",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  paddingTop: "24px",
};
