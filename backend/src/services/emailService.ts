import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

export interface ContactFormData {
  name: string;
  company: string;
  mobile: string;
  email: string;
  comment: string;
}

export const sendContactEmails = async (data: ContactFormData) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const caEmail = process.env.EMAIL_USER || 'gauravtcbd8@gmail.com';

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured in environment variables.');
  }

  const resend = new Resend(resendApiKey);

  // Send lead notification to Gaurav (gauravtcbd8@gmail.com) and confirmation auto-reply to client simultaneously
  await Promise.all([
    // 1. Email to CA Firm (Gaurav)
    resend.emails.send({
      from: 'NebulaCactus CA Firm <onboarding@resend.dev>',
      to: [caEmail],
      replyTo: data.email,
      subject: `New Web Lead: ${data.name} from ${data.company || 'N/A'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Mobile:</strong> ${data.mobile}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.comment}</p>
      `,
    }),
    // 2. Auto-reply to Client
    resend.emails.send({
      from: 'NebulaCactus CA Firm <onboarding@resend.dev>',
      to: [data.email],
      replyTo: caEmail, // When client hits reply, it goes directly to gauravtcbd8@gmail.com
      subject: 'Thank you for contacting NebulaCactus CA Firm',
      html: `
        <p>Dear ${data.name},</p>
        <p>Thank you for reaching out to NebulaCactus CA Firm. We have received your message and a member of our team will get back to you shortly.</p>
        <p>For your records, here is a copy of your message:</p>
        <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #0070f3;">${data.comment}</blockquote>
        <br/>
        <p>Best Regards,<br/>NebulaCactus CA Firm</p>
      `,
    })
  ]);
};