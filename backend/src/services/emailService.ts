import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the API client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  company: string;
  mobile: string;
  email: string;
  comment: string;
}

export const sendContactEmails = async (data: ContactFormData) => {
  const caEmail = process.env.EMAIL_USER as string;

  // 1. Email to the CA Firm (You)
  const mailToCA = {
    from: 'onboarding@resend.dev', // Resend's default free testing domain
    to: caEmail, // MUST be the email address you use to sign up for Resend
    replyTo: data.email,
    subject: `New Web Lead: ${data.name} from ${data.company || 'N/A'}`,
    html: `
      New Contact Form Submission
      Name: ${data.name}
      Company: ${data.company || 'Not provided'}
      Mobile: ${data.mobile}
      Email: ${data.email}
      Message:${data.comment}
    `,
  };

  // 2. Auto-reply to the Client (See important note below)
  const mailToClient = {
    from: 'onboarding@resend.dev', // You must change this to a verified domain later
    to: data.email,
    subject: 'Thank you for contacting NebulaCactus CA Firm',
    html: `
      Dear ${data.name},
      Thank you for reaching out. We have received your message and will get back to you shortly.
    `,
  };

  // Send both emails concurrently
  const [caResult, clientResult] = await Promise.all([
    resend.emails.send(mailToCA),
    // resend.emails.send(mailToClient) // UNCOMMENT THIS LATER
  ]);

  // Resend returns an error object if it fails, so we throw it to trigger your catch block
  if (caResult.error) {
    throw new Error(caResult.error.message);
  }
};