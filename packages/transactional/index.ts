import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification.js';
import * as React from 'react';
import sendEmail from './email.js';

export { VerificationEmail, sendEmail };

export const renderVerificationEmail = async (props: { name: string; url: string }) => {
  const html = await render(React.createElement(VerificationEmail, props));
  return html;
};