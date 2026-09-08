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
  return (
    <div
      style={{
        fontFamily: "monospace, sans-serif",
        backgroundColor: "#09090b",
        color: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
      }}
    >
      <p
        style={{
          color: "#00ff00",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          margin: "0 0 10px 0",
        }}
      >
        License Activation
      </p>
      <h2 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 20px 0" }}>
        Your {productName} EA is ready.
      </h2>
      <p
        style={{
          fontSize: "14px",
          lineHeight: "24px",
          color: "#a1a1aa",
          marginBottom: "30px",
        }}
      >
        Thank you for purchasing {productName}. Your automated system and
        license key are attached below. Ensure you keep this key secure.
      </p>

      <div
        style={{
          backgroundColor: "#18181b",
          border: "1px solid rgba(0, 255, 0, 0.2)",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "0 0 8px 0" }}>
          LICENSE KEY
        </p>
        <code style={{ fontSize: "16px", color: "#00ff00" }}>{licenseKey}</code>
      </div>

      <a
        href={downloadUrl}
        style={{
          backgroundColor: "#00ff00",
          color: "#09090b",
          padding: "12px 24px",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "14px",
          display: "inline-block",
        }}
      >
        Download Package Now
      </a>

      <p style={{ fontSize: "12px", color: "#71717a", marginTop: "40px" }}>
        If you have deployment questions, reply directly to this email or visit
        our support dashboard.
      </p>
    </div>
  );
}
