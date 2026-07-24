import mongoose, { Schema, Document } from 'mongoose';

export interface IInsight extends Document {
  title: string;
  type: string; // Now a flexible string
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
}

const InsightSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    // Removed the enum restriction. Any string is now valid.
    default: 'General Insight' 
  },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'NebulaCactus Advisory' },
  publishedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Insight', InsightSchema);