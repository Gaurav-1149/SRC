import nodemailer from 'nodemailer';
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

  // Option 1: Resend HTTP API (Recommended for Render cloud deployment)
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

  // Option 2: Gmail SMTP with Nodemailer
  const user = process.env.EMAIL_USER;
  // Remove all spaces from App Password (e.g. "yyax yqin ufnt wejw" -> "yyaxyqinufntwejw")
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('Email configuration error: EMAIL_USER and EMAIL_PASS (or RESEND_API_KEY) must be set in Render environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailToCA = {
    from: user,
    to: user,
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
    from: user,
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