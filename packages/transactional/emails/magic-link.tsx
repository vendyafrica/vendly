import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Button,
    Section,
    Hr,
    Img,
} from '@react-email/components';
import * as React from 'react';

interface MagicLinkEmailProps {
    url: string;
}

export const MagicLinkEmail: React.FC<Readonly<MagicLinkEmailProps>> = ({
    url,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Preview>Sign in to Vendly</Preview>
            <Container style={container}>
                {/* Logo Section */}
                <Section style={logoSection}>
                    <Img
                        src="https://vendlyafrica.store/vendly.png"
                        width="40"
                        height="40"
                        alt="Vendly"
                        style={logo}
                    />
                    <Text style={brandName}>vendly</Text>
                </Section>

                <Hr style={divider} />

                {/* Main Content */}
                <Section style={contentSection}>
                    <Heading style={h1}>Sign in to Vendly</Heading>
                    <Text style={text}>
                        Click the button below to securely sign in to your Vendly account.
                        This link will expire in 5 minutes.
                    </Text>

                    <Button href={url} style={button}>
                        Sign in to Vendly
                    </Button>

                    <Text style={subtext}>
                        If you didn't request this email, you can safely ignore it.
                    </Text>
                </Section>

                <Hr style={divider} />

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        © {new Date().getFullYear()} Vendly Africa. All rights reserved.
                    </Text>
                    <Text style={footerSubtext}>
                        Sell smarter. Grow faster.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default MagicLinkEmail;

// Styles
const main = {
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '48px 24px',
    maxWidth: '480px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginTop: '40px',
    marginBottom: '40px',
};

const logoSection = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
};

const logo = {
    borderRadius: '8px',
};

const brandName = {
    color: '#0a0a0a',
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
    margin: '0',
    marginLeft: '8px',
};

const divider = {
    borderColor: '#e5e7eb',
    margin: '24px 0',
};

const contentSection = {
    textAlign: 'center' as const,
};

const h1 = {
    color: '#0a0a0a',
    fontSize: '20px',
    fontWeight: '400',
    letterSpacing: '-0.5px',
    margin: '0 0 16px 0',
};

const text = {
    color: '#6b7280',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 32px 0',
};

const button = {
    backgroundColor: '#9336ea',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
};

const subtext = {
    color: '#9ca3af',
    fontSize: '13px',
    lineHeight: '20px',
    marginTop: '32px',
    marginBottom: '0',
};

const footer = {
    textAlign: 'center' as const,
};

const footerText = {
    color: '#9ca3af',
    fontSize: '12px',
    margin: '0 0 4px 0',
};

const footerSubtext = {
    color: '#9ca3af',
    fontSize: '11px',
    fontStyle: 'italic',
    margin: '0',
};
