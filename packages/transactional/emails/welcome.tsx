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

interface WelcomeEmailProps {
    name: string;
    dashboardUrl: string;
}

export const WelcomeEmail = ({
    name,
    dashboardUrl,
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to Vendly!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Welcome to Vendly ,{name}</Heading>
                <Text style={text}>
                    We're excited to have you on board. Your store is set up and ready to go.
                </Text>
                <Section style={btnContainer}>
                    <Link style={button} href={dashboardUrl}>
                        Go to Dashboard
                    </Link>
                </Section>
                <Text style={text}>
                    If you have any questions, feel free to reply to this email.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
};

const h1 = {
    fontSize: "24px",
    fontWeight: "400",
    lineHeight: "1.1",
    margin: "0 0 15px",
};

const text = {
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "24px 0",
};

const button = {
    backgroundColor: '#9336ea',
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "400",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "8px 12px",
};
