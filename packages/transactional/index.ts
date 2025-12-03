import { render } from '@react-email/components';
import { VerificationEmail } from './emails/verification';
import * as React from 'react';
export { VerificationEmail };

export const renderVerificationEmail = async (props: { name: string; url: string }) => {
  const html = await render(React.createElement(VerificationEmail, props));
  return html;
};