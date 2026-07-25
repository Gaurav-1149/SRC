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

  // 1. Send complete form details to CA Firm (gauravtcbd8@gmail.com)
  const leadResult = await resend.emails.send({
    from: 'NebulaCactus Leads <onboarding@resend.dev>',
    to: [caEmail],
    replyTo: data.email,
    subject: `🚨 New Contact Lead: ${data.name} (${data.company || 'Individual'})`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0; font-size: 22px;">
          📩 New Contact Lead Submitted
        </h2>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #334155; font-size: 16px; margin-bottom: 12px;">Client Details:</h3>
          <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; width: 140px; color: #475569; border-bottom: 1px solid #e2e8f0;">Full Name:</td>
              <td style="padding: 10px 14px; color: #0f172a; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0;">Company Name:</td>
              <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0;">Mobile Number:</td>
              <td style="padding: 10px 14px; color: #2563eb; font-weight: 600; border-bottom: 1px solid #e2e8f0;"><a href="tel:${data.mobile}" style="color: #2563eb; text-decoration: none;">${data.mobile}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Email Address:</td>
              <td style="padding: 10px 14px; color: #2563eb; font-weight: 600;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 20px; padding: 16px; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 6px;">
          <h4 style="margin-top: 0; color: #1e40af; margin-bottom: 8px; font-size: 15px;">Inquiry / Message:</h4>
          <p style="white-space: pre-wrap; margin: 0; color: #1e293b; line-height: 1.6; font-size: 15px;">${data.comment}</p>
        </div>
      </div>
    `,
  });

  if (leadResult.error) {
    console.error('Failed to send lead email to CA:', leadResult.error);
    throw new Error(`Failed to send email to ${caEmail}: ${leadResult.error.message}`);
  }

  // 2. Send complete details in auto-reply confirmation to client
  try {
    await resend.emails.send({
      from: 'NebulaCactus CA Firm <onboarding@resend.dev>',
      to: [data.email],
      replyTo: caEmail,
      subject: 'Thank you for contacting NebulaCactus CA Firm',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0; font-size: 22px;">
            Thank You for Contacting NebulaCactus CA Firm
          </h2>
          
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">Dear <strong>${data.name}</strong>,</p>
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">Thank you for reaching out. We have received your inquiry and a member of our team will get back to you shortly.</p>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #334155; font-size: 15px; margin-bottom: 12px;">Summary of Your Submitted Details:</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; width: 140px; color: #475569; border-bottom: 1px solid #e2e8f0;">Full Name:</td>
                <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0;">Company:</td>
                <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0;">Mobile Number:</td>
                <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.mobile}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0;">Email Address:</td>
                <td style="padding: 10px 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
                <td style="padding: 10px 14px; color: #0f172a; white-space: pre-wrap;">${data.comment}</td>
              </tr>
            </table>
          </div>

          <br/>
          <p style="font-size: 15px; color: #334155; margin-bottom: 0;">Best Regards,<br/><strong>NebulaCactus CA Firm</strong></p>
        </div>
      `,
    });
  } catch (clientErr) {
    console.warn('Client auto-reply skipped (Resend sandbox testing restriction):', clientErr);
  }
};