import { resend } from './resend.js';
import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification.js';
import * as React from 'react';

interface SendVerificationProps {
  to: string;
  subject: string;
  verificationUrl: string;
  name: string;
}

const sendEmail = async ({ to, subject, verificationUrl, name }: SendVerificationProps) => {
  const emailHtml = await render(React.createElement(VerificationEmail, {
    name,
    url: verificationUrl,
  }));


  const data = await resend.emails.send({
    from: 'onboarding@vendlyafrica.store',
    to,
    subject,
    html: emailHtml,
  });

  if (data.error) {
    throw new Error("Email sending failed");
  }

  return data;
};

export default sendEmail;