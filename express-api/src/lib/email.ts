import { Resend } from "resend";
import dotenv from "dotenv"; // Load environment variables from .env file

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY); // Use your Resend API key from environment variables

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string; // html
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  await resend.emails.send({
    from: "onboarding@resend.dev", // no-reply@furniture.com
    to,
    subject,
    text,
    html: html || text,  // html format accept lote nee
  });
}
