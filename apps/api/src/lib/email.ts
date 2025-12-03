import { resend } from './resend';
import { VerificationEmail } from '@vendly/transactional/emails/verification'; 
import { render } from '@react-email/components';

interface SendVerificationProps {
  to: string;
  subject: string;
  verificationUrl: string;
  name: string;
}

const sendEmail = async ({ to, subject, verificationUrl, name }: SendVerificationProps) => {
  // 1. Render React component to HTML string
  const emailHtml = await render(
    VerificationEmail({ 
      name, 
      url: verificationUrl 
    })
  );

  // 2. Send via Resend
  const data = await resend.emails.send({
    from: 'onboarding@resend.dev', // ⚠️ Change this to your verified domain
    to,
    subject,
    html: emailHtml,
  });

  if (data.error) {
    console.error("Failed to send email:", data.error);
    throw new Error("Email sending failed");
  }

  return data;
};

export default sendEmail;