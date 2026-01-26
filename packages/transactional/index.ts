import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification';
import { MagicLinkEmail } from './emails/magic-link';
import * as React from 'react';
import sendEmail, { sendMagicLinkEmail, sendWelcomeEmail } from './email';

export { VerificationEmail, MagicLinkEmail, sendEmail, sendMagicLinkEmail, sendWelcomeEmail };

export const renderVerificationEmail = async (props: { name: string; url: string }) => {
  const html = await render(React.createElement(VerificationEmail, props));
  return html;
};

export const renderMagicLinkEmail = async (props: { url: string }) => {
  const html = await render(React.createElement(MagicLinkEmail, props));
  return html;
};