import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  name: string;
  url: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  name,
  url,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Verify your email address</Preview>
      <Container style={container}>
        <Heading style={h1}>Welcome to Vendly</Heading>
        <Text style={text}>
          Hi {name}, please verify your email address by clicking the button below.
        </Text>
        {/* [!code ++] Add the button component */}
        <Button href={url} style={button}> 
          Verify Email
        </Button>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

// Styles
const main = {
  backgroundColor: '#000000',
  fontFamily: "system-ui, sans-serif",
};
const container = { margin: 'auto', padding: '40px 20px' };
const h1 = { color: '#ffffff', fontSize: '24px', fontWeight: '600' };
const text = { color: '#aaaaaa', fontSize: '14px', marginBottom: '24px' };
const button = { // [!code ++]
  backgroundColor: '#ffffff',
  color: '#000000',
  padding: '12px 20px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
};