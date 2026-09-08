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
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "#f4f4f5",
        padding: "40px",
        color: "#09090b",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "32px",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            borderBottom: "1px solid #e4e4e7",
            paddingBottom: "16px",
          }}
        >
          New Contact Request: {topic}
        </h2>
        <div
          style={{ marginTop: "24px", fontSize: "14px", lineHeight: "24px" }}
        >
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Topic:</strong> {topic}
          </p>
          <br />
          <p>
            <strong>Message:</strong>
          </p>
          <p
            style={{
              backgroundColor: "#f4f4f5",
              padding: "16px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
