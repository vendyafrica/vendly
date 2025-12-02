// verification-email.tsx
import { Html, Button, Text, Section } from "@react-email/components";

export default function VerificationEmail({
  url,
  userName,
}: {
  url: string;
  userName?: string;
}) {
  return (
    <Html lang="en">
      <Section style={{ padding: "20px" }}>
        <Text>Hi {userName || "there"}, verify your email address</Text>
        <Button
          href={url}
          style={{
            background: "black",
            color: "white",
            padding: "12px 20px",
            borderRadius: "6px",
          }}
        >
          Verify Email
        </Button>
      </Section>
    </Html>
  );
}
