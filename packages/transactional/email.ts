import { resend } from './resend.js';
import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification.js';
import { MagicLinkEmail } from './emails/magic-link.js';
import * as React from 'react';

interface SendVerificationProps {
  to: string;
  subject: string;
  verificationUrl: string;
  name: string;
}

interface SendMagicLinkProps {
  to: string;
  url: string;
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

export const sendMagicLinkEmail = async ({ to, url }: SendMagicLinkProps) => {
  const emailHtml = await render(React.createElement(MagicLinkEmail, { url }));

  const data = await resend.emails.send({
    from: 'Vendly <noreply@vendlyafrica.store>',
    to,
    subject: 'Sign in to Vendly',
    html: emailHtml,
  });

  if (data.error) {
    throw new Error("Magic link email failed to send");
  }

  return data;
};

interface SendWelcomeEmailProps {
  to: string;
  name: string;
  dashboardUrl: string;
}

export const sendWelcomeEmail = async ({ to, name, dashboardUrl }: SendWelcomeEmailProps) => {
  // Dynamically import to avoid circular dependency issues if any, or just import at top if fine.
  // For now assuming we add import at top.
  const { WelcomeEmail } = await import('./emails/welcome.js');
  const emailHtml = await render(React.createElement(WelcomeEmail, { name, dashboardUrl }));

  const data = await resend.emails.send({
    from: 'Vendly <noreply@vendlyafrica.store>',
    to,
    subject: 'Welcome to Vendly!',
    html: emailHtml,
  });

  if (data.error) {
    console.error("Welcome email failed", data.error);
    // We don't throw here to avoid blocking the onboarding flow if email fails
  }

  return data;
};

export default sendEmail;