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

interface SellerMagicLinkEmailProps {
    url: string;
}

export const SellerMagicLinkEmail: React.FC<Readonly<SellerMagicLinkEmailProps>> = ({
    url,
}) => (
    <Html>
        <Head />
        <Body style={main}>
            <Preview>Finish setting up your Vendly store</Preview>
            <Container style={container}>
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

                <Section style={contentSection}>
                    <Heading style={h1}>Welcome aboard</Heading>
                    <Text style={text}>
                        You’re one step away from becoming a seller on Vendly. Click the button below to
                        continue your store setup.
                    </Text>

                    <Button href={appendDashboardRedirect(url)} style={button}>
                        Continue Seller Setup
                    </Button>

                    <Text style={subtext}>
                        This link expires in 5 minutes. If you didn’t request this email, you can safely ignore it.
                    </Text>
                </Section>

                <Hr style={divider} />

                <Section style={footer}>
                    <Text style={footerText}>
                        © {new Date().getFullYear()} Vendly Africa. All rights reserved.
                    </Text>
                    <Text style={footerSubtext}>Sell smarter. Grow faster.</Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default SellerMagicLinkEmail;

function appendDashboardRedirect(rawUrl: string) {
    try {
        const u = new URL(rawUrl);
        // Force redirect to dashboard app
        u.searchParams.set("redirect", "/a");
        return u.toString();
    } catch (err) {
        // Fallback: best-effort append
        const joiner = rawUrl.includes("?") ? "&" : "?";
        return `${rawUrl}${joiner}redirect=/a`;
    }
}

const main = {
    backgroundColor: "#f9fafb",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "48px 24px",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    marginTop: "40px",
    marginBottom: "40px",
};

const logoSection = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "24px",
};

const logo = {
    borderRadius: "8px",
};

const brandName = {
    color: "#0a0a0a",
    fontSize: "20px",
    fontWeight: "600",
    letterSpacing: "-0.5px",
    margin: "0",
    marginLeft: "8px",
};

const divider = {
    borderColor: "#e5e7eb",
    margin: "24px 0",
};

const contentSection = {
    textAlign: "center" as const,
};

const h1 = {
    color: "#0a0a0a",
    fontSize: "20px",
    fontWeight: "400",
    letterSpacing: "-0.5px",
    margin: "0 0 16px 0",
};

const text = {
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 32px 0",
};

const button = {
    backgroundColor: "#9336ea",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
};

const subtext = {
    color: "#9ca3af",
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: "32px",
    marginBottom: "0",
};

const footer = {
    textAlign: "center" as const,
};

const footerText = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0 0 4px 0",
};

const footerSubtext = {
    color: "#9ca3af",
    fontSize: "11px",
    fontStyle: "italic",
    margin: "0",
};
