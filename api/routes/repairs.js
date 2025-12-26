import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all repairs (đơn giản)
router.get('/', (req, res) => {
  try {
    const repairs = queries.getAllRepairs.all();
    res.json({
      success: true,
      data: repairs
    });
  } catch (error) {
    console.error('Get repairs error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch repairs' 
    });
  }
});

export default router;