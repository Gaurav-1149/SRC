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
  // Always send lead notifications to gauravtcbd8@gmail.com
  const caEmail = process.env.EMAIL_USER || 'gauravtcbd8@gmail.com';

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured in environment variables.');
  }

  const resend = new Resend(resendApiKey);

  // 1. Send form lead data to gauravtcbd8@gmail.com
  const leadResult = await resend.emails.send({
    from: 'NebulaCactus Leads <onboarding@resend.dev>',
    to: [caEmail],
    replyTo: data.email,
    subject: `🚨 New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-top: 0;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 130px; color: #475569;">Full Name:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Company:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.company || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Mobile:</td>
            <td style="padding: 8px 0; color: #0f172a;"><a href="tel:${data.mobile}" style="color: #2563eb; text-decoration: none;">${data.mobile}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email Address:</td>
            <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h4 style="margin-top: 0; color: #475569; margin-bottom: 8px;">Message / Inquiry:</h4>
          <p style="white-space: pre-wrap; margin: 0; color: #1e293b; line-height: 1.5;">${data.comment}</p>
        </div>
      </div>
    `,
  });

  if (leadResult.error) {
    console.error('Failed to send lead email to CA:', leadResult.error);
    throw new Error(`Failed to send email to ${caEmail}: ${leadResult.error.message}`);
  }

  // 2. Send auto-reply confirmation to client (gracefully handled if in Resend test mode)
  try {
    await resend.emails.send({
      from: 'NebulaCactus CA Firm <onboarding@resend.dev>',
      to: [data.email],
      replyTo: caEmail,
      subject: 'Thank you for contacting NebulaCactus CA Firm',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>Thank you for reaching out to NebulaCactus CA Firm. We have received your message and a member of our team will get back to you shortly.</p>
          <p>For your records, here is a copy of your submitted message:</p>
          <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #3b82f6; border-radius: 4px; color: #475569;">${data.comment}</blockquote>
          <br/>
          <p>Best Regards,<br/><strong>NebulaCactus CA Firm</strong></p>
        </div>
      `,
    });
  } catch (clientErr) {
    console.warn('Client auto-reply skipped (Resend sandbox testing restriction):', clientErr);
  }
};