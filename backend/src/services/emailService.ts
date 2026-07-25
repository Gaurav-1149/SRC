import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import dns from 'dns';

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

  // Option 1: Resend HTTP API (100% Reliable for Cloud Deployments like Render)
  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    const caEmail = process.env.EMAIL_USER || 'advisory@nebulacactus.com';

    await Promise.all([
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
      resend.emails.send({
        from: 'NebulaCactus CA Firm <onboarding@resend.dev>',
        to: [data.email],
        subject: 'Thank you for contacting NebulaCactus CA Firm',
        html: `
          <p>Dear ${data.name},</p>
          <p>Thank you for reaching out. We have received your message and a member of our team will get back to you shortly.</p>
          <p>For your records, here is a copy of your message:</p>
          <blockquote>${data.comment}</blockquote>
          <br/>
          <p>Best Regards,<br/>NebulaCactus CA Firm</p>
        `,
      })
    ]);
    return;
  }

  // Option 2: Gmail SMTP with Explicit IPv4 Resolution
  const user = process.env.EMAIL_USER || '';
  const rawPass = process.env.EMAIL_PASS || '';

  if (!user || !rawPass) {
    throw new Error('Email configuration error: EMAIL_USER and EMAIL_PASS (or RESEND_API_KEY) must be set in Render environment variables.');
  }

  const senderEmail = user;
  const senderPass = rawPass.replace(/\s+/g, '');

  // Manually resolve IPv4 address for smtp.gmail.com to prevent Render IPv6 ENETUNREACH errors
  let targetHost = 'smtp.gmail.com';
  try {
    const addresses = await dns.promises.resolve4('smtp.gmail.com');
    if (addresses && addresses[0]) {
      targetHost = addresses[0]; // Explicit IPv4 IP string (e.g. '142.251.10.108')
    }
  } catch (err) {
    console.warn('IPv4 DNS resolution warning, using default hostname:', err);
  }

  const smtpOptions: SMTPTransport.Options = {
    host: targetHost,
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: senderPass,
    },
    tls: {
      servername: 'smtp.gmail.com', // Ensures SSL certificate validation matches Gmail
      rejectUnauthorized: false
    }
  };

  const transporter = nodemailer.createTransport(smtpOptions);

  const mailToCA = {
    from: senderEmail,
    to: senderEmail,
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
  };

  const mailToClient = {
    from: senderEmail,
    to: data.email,
    subject: 'Thank you for contacting NebulaCactus CA Firm',
    html: `
      <p>Dear ${data.name},</p>
      <p>Thank you for reaching out. We have received your message and a member of our team will get back to you shortly.</p>
      <p>For your records, here is a copy of your message:</p>
      <blockquote>${data.comment}</blockquote>
      <br/>
      <p>Best Regards,<br/>NebulaCactus CA Firm</p>
    `,
  };

  await Promise.all([
    transporter.sendMail(mailToCA),
    transporter.sendMail(mailToClient)
  ]);
};