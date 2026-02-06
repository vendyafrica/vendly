import { resend } from './resend';
import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification';
import { MagicLinkEmail } from './emails/magic-link';
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
  const { WelcomeEmail } = await import('./emails/welcome');
  const emailHtml = await render(React.createElement(WelcomeEmail, { name, dashboardUrl }));

  const data = await resend.emails.send({
    from: 'Vendly <noreply@vendlyafrica.store>',
    to,
    subject: 'Welcome to Vendly!',
    html: emailHtml,
  });

  if (data.error) {
    console.error("Welcome email failed", data.error);
  }

  return data;
};

interface SendAdminVerificationProps {
  to: string;
  name: string;
  verificationUrl: string;
}

export const sendAdminVerificationEmail = async ({ to, name, verificationUrl }: SendAdminVerificationProps) => {
  const { AdminVerificationEmail } = await import('./emails/admin-verification');
  const emailHtml = await render(React.createElement(AdminVerificationEmail, {
    name,
    url: verificationUrl,
  }));

  const data = await resend.emails.send({
    from: 'Vendly Admin <admin@vendlyafrica.store>',
    to,
    subject: 'Verify your Vendly Admin account',
    html: emailHtml,
  });

  if (data.error) {
    console.error("Admin verification email failed", data.error);
    throw new Error("Admin verification email failed to send");
  }

  return data;
};

interface SendSuperAdminInviteProps {
  to: string;
  invitedByName: string;
  inviteUrl: string;
}

export const sendSuperAdminInviteEmail = async ({ to, invitedByName, inviteUrl }: SendSuperAdminInviteProps) => {
  const { SuperAdminInviteEmail } = await import('./emails/super-admin-invite');
  const emailHtml = await render(React.createElement(SuperAdminInviteEmail, {
    invitedByName,
    url: inviteUrl,
  }));

  const data = await resend.emails.send({
    from: 'Vendly Admin <admin@vendlyafrica.store>',
    to,
    subject: 'You have been invited to become a Vendly Super Admin',
    html: emailHtml,
  });

  if (data.error) {
    console.error("Super admin invite email failed", data.error);
    throw new Error("Super admin invite email failed to send");
  }

  return data;
};

export default sendEmail;