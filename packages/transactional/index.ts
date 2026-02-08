import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification';
import { MagicLinkEmail } from './emails/magic-link';
import { SellerMagicLinkEmail } from './emails/seller-magic-link';
import * as React from 'react';
import sendEmail, { sendMagicLinkEmail, sendSellerMagicLinkEmail, sendWelcomeEmail, sendAdminVerificationEmail, sendSuperAdminInviteEmail } from './email';

export { VerificationEmail, MagicLinkEmail, SellerMagicLinkEmail, sendEmail, sendMagicLinkEmail, sendSellerMagicLinkEmail, sendWelcomeEmail, sendAdminVerificationEmail, sendSuperAdminInviteEmail };

export const renderVerificationEmail = async (props: { name: string; url: string }) => {
  const html = await render(React.createElement(VerificationEmail, props));
  return html;
};

export const renderMagicLinkEmail = async (props: { url: string }) => {
  const html = await render(React.createElement(MagicLinkEmail, props));
  return html;
};