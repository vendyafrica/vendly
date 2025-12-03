// src/lib/sendEmail.ts

import { resend } from "./resend";
import  VerificationEmail  from "@vendly/transactional/emails/verification";

interface EmailArgs {
  to: string;
  subject: string;
  verificationUrl: string;
  name?: string;
}

export default async function sendEmail({
  to,
  subject,
  verificationUrl,
  name,
}: EmailArgs) {
  try {
    const data = await resend.emails.send({
      from: "Vendly <noreply@vendly.dev>",
      to: [to],
      subject,
      react: VerificationEmail({ url: verificationUrl, name }),
    });

    return data;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}
