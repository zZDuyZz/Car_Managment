import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all vehicles
router.get('/', (req, res) => {
  try {
    const vehicles = queries.getAllVehicles.all();
    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vehicles' 
    });
  }
});

// Get brands
router.get('/brands', (req, res) => {
  try {
    const brands = queries.getAllBrands.all();
    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch brands' 
    });
  }
});

export default router;