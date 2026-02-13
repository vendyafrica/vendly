import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface SellerWelcomeEmailProps {
    name: string;
    storefrontUrl: string;
    dashboardUrl: string;
    connectInstagramUrl: string;
}

export const SellerWelcomeEmail = ({
    name,
    storefrontUrl,
    dashboardUrl,
    connectInstagramUrl,
}: SellerWelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to Vendly — your store is ready</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoRow}>
                    <Img
                        src="https://vendlyafrica.store/vendly.png"
                        width="36"
                        height="36"
                        alt="Vendly"
                        style={logo}
                    />
                    <Text style={brandName}>vendly</Text>
                </Section>
                <Heading style={h1}>Welcome, {name}</Heading>
                <Text style={text}>
                    Your store is ready. Verify your email and choose your next step below.
                </Text>
                <Section style={card}>
                    <Text style={label}>Storefront</Text>
                    <Link style={link} href={storefrontUrl}>
                        {storefrontUrl}
                    </Link>
                    <Text style={label}>Dashboard</Text>
                    <Link style={link} href={dashboardUrl}>
                        {dashboardUrl}
                    </Link>
                </Section>
                <Section style={buttonRow}>
                    <Link style={primaryButton} href={connectInstagramUrl}>
                        Connect Instagram
                    </Link>
                    <Link style={secondaryButton} href={dashboardUrl}>
                        Go to Dashboard
                    </Link>
                </Section>
                <Text style={footnote}>
                    This email verifies your account. The links expire in 24 hours and can only be used once.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default SellerWelcomeEmail;

const main = {
    backgroundColor: "#F7F7FB",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "32px auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    maxWidth: "560px",
    boxShadow: "0 10px 30px rgba(24, 24, 27, 0.08)",
};

const logoRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
};

const logo = {
    borderRadius: "8px",
};

const brandName = {
    fontWeight: "700",
    fontSize: "18px",
    color: "#2B2B33",
    margin: 0,
};

const h1 = {
    fontSize: "26px",
    fontWeight: "700",
    lineHeight: "1.2",
    color: "#1F1F26",
    margin: "0 0 12px",
};

const text = {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#51515E",
    margin: "0 0 20px",
};

const card = {
    backgroundColor: "#F4F1FF",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "22px",
};

const label = {
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#6C6C7A",
    margin: "0 0 4px",
};

const link = {
    display: "block",
    color: "#6D28D9",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "12px",
    textDecoration: "none",
};

const buttonRow = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
    marginBottom: "16px",
};

const primaryButton = {
    backgroundColor: "#6D28D9",
    borderRadius: "10px",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 18px",
};

const secondaryButton = {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    color: "#6D28D9",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 18px",
    border: "1px solid #D6CCFF",
};

const footnote = {
    fontSize: "12px",
    color: "#7B7B86",
    margin: 0,
};
