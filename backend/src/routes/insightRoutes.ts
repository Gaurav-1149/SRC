import express, { Request, Response } from 'express';
import Insight from '../models/Insight';

const router = express.Router();

// GET all insights
router.get('/', async (req: Request, res: Response) => {
  try {
    const insights = await Insight.find().sort({ publishedAt: -1 }); // Newest first
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching insights' });
  }
});

// POST a new insight
router.post('/', async (req: Request, res: Response) => {
  try {
    const newInsight = new Insight(req.body);
    const savedInsight = await newInsight.save();
    res.status(201).json(savedInsight);
  } catch (error) {
    res.status(400).json({ message: 'Error creating insight' });
  }
});

// GET a single insight by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
      const insight = await Insight.findById(req.params.id);
      if (!insight) {
        res.status(404).json({ message: 'Insight not found' });
        return;
      }
      res.json(insight);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching the insight' });
    }
  });

  // DELETE an insight by ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deletedInsight = await Insight.findByIdAndDelete(req.params.id);
      if (!deletedInsight) {
        res.status(404).json({ message: 'Insight not found' });
        return;
      }
      res.json({ message: 'Insight deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting the insight' });
    }
  });

export default router;