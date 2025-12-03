import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  name?: string;
  url?: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  name,
  url,
}) => (
  <Html>
    <Head />
    <Preview>Thank you for joining vendly</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome</Heading>
        <Text style={text}>
          Thank you {name ?? "there"} for joining vendly. We are committed to
          providing you with the best experience possible when selling online.
          Please verify your email to get started.
        </Text>

        {url ? (
          <Text style={text}>
            Verify here: <a href={url}>{url}</a>
          </Text>
        ) : null}
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#000000",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "auto",
  padding: "96px 20px 64px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#aaaaaa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 40px",
};
