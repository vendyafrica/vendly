import { Resend } from "resend";
import VerificationEmail from "./verification-email";
import WaitlistEmail from "./waitlist-email";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail({ to, url }: { to: string; url: string }) {
  await resend.emails.send({
    from: "no-reply@yourapp.com",
    to,
    subject: "Verify your email",
    react: <VerificationEmail url={url} />,
  });
}

export async function sendWaitlistEmail({ to, url }: { to: string; url: string }) {
  await resend.emails.send({
    from: "no-reply@yourapp.com",
    to,
    subject: "Join the waitlist",
    react: <WaitlistEmail url={url} />,
  });
}
