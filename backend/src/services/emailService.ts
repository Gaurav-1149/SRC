import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email service:', error);
  } else {
    console.log('Email service ready to send messages');
  }
});

// Define the data structure matching your frontend form
export interface ContactFormData {
  name: string;
  company: string;
  mobile: string;
  email: string;
  comment: string;
}

// Function to send both emails
export const sendContactEmails = async (data: ContactFormData) => {
  const caEmail = process.env.EMAIL_USER;

  // 1. Email to the CA Firm (You)
  const mailToCA = {
    from: caEmail, // Send from your authenticated email to avoid spam filters
    to: caEmail,
    replyTo: data.email, // So you can hit "Reply" and email the client directly
    subject: `New Web Lead: ${data.name} from ${data.company || 'N/A'}`,
    html: `
      New Contact Form Submission
      Name: ${data.name}
      Company: ${data.company || 'Not provided'}
      Mobile: ${data.mobile}
      Email: ${data.email}
      Message:
      ${data.comment}
    `,
  };

  // 2. Auto-reply to the Client
  const mailToClient = {
    from: caEmail,
    to: data.email,
    subject: 'Thank you for contacting NebulaCactus CA Firm',
    html: `
      Dear ${data.name},
      Thank you for reaching out. We have received your message and a member of our team will get back to you shortly.
      For your records, here is a copy of your message:
      
        ${data.comment}
      
      
      Best Regards,
      NebulaCactus CA Firm
    `,
  };

  // Send both emails simultaneously
  await Promise.all([
    transporter.sendMail(mailToCA),
    transporter.sendMail(mailToClient)
  ]);
};