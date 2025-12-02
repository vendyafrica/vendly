// waitlist-email.tsx
import { Html, Button, Text, Section } from "@react-email/components";

export default function WaitlistEmail({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Section style={{ padding: "20px" }}>
        <Text>Join the waitlist</Text>
        <Button
          href={url}
          style={{ background: "black", color: "white", padding: "12px 20px", borderRadius: "6px" }}
        >
          Join Waitlist
        </Button>
      </Section>
    </Html>
  );
}
