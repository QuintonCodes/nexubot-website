import {
  Body,
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

type ContactEmailProps = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export default function ContactEmail({
  name,
  email,
  topic,
  message,
}: ContactEmailProps) {
  // Ensure the topic is properly capitalized
  const capitalizedTopic = topic
    ? topic.charAt(0).toUpperCase() + topic.slice(1)
    : "";

  // For Resend/react-email, static assets like logos require absolute URLs in production.
  // This falls back gracefully during local development.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  return (
    <Html>
      <Head />
      <Preview>New Contact Request: {capitalizedTopic}</Preview>
      <Body style={main}>
        <Container style={container}>
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

          <Heading style={heading}>
            New Contact Request:{" "}
            <span style={brandGreen}>{capitalizedTopic}</span>
          </Heading>

          <Section style={detailsSection}>
            <Text style={fieldLabel}>Name</Text>
            <Text style={fieldValue}>{name}</Text>

            <Text style={fieldLabel}>Email</Text>
            <Text style={fieldValue}>{email}</Text>

            <Text style={fieldLabel}>Topic</Text>
            <Text style={fieldValue}>{capitalizedTopic}</Text>
          </Section>

          <Section style={messageSection}>
            <Text style={fieldLabel}>Message</Text>
            <Section style={messageCard}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles meticulously mapped from globals.css variables
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

const heading = {
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: "600",
  marginTop: "24px",
  marginBottom: "24px",
  color: "#ebebeb",
};

const detailsSection = {
  marginBottom: "12px",
};

const fieldLabel = {
  fontSize: "12px",
  color: "#8a8a8a",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  fontWeight: "600",
};

const fieldValue = {
  fontSize: "16px",
  color: "#ebebeb",
  margin: "0 0 16px 0",
};

const messageSection = {
  marginTop: "4px",
};

const messageCard = {
  backgroundColor: "#232323",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "16px",
  marginTop: "8px",
};

const messageText = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#ebebeb",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};
