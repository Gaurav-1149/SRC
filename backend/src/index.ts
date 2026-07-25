import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendContactEmails } from './services/emailService';
import mongoose from 'mongoose';
import insightRoutes from './routes/insightRoutes';
import adminRoutes from './routes/adminRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/insights', insightRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'active', message: 'CA Portfolio API is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, company, mobile, email, comment } = req.body;

    // Basic validation to ensure required fields are present
    if (!name || !email || !comment || !mobile) {
      res.status(400).json({ success: false, message: 'Name, email, mobile, and comment are required.' });
      return;
    }

    // Call our separated email service
    await sendContactEmails({ name, company, mobile, email, comment });

    res.status(200).json({ success: true, message: 'Emails sent successfully.' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});