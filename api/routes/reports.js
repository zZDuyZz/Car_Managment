import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get revenue report by month
router.get('/revenue', (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    
    if (!fromDate || !toDate) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'fromDate and toDate are required' 
      });
    }

    console.log('Getting revenue report for:', fromDate, 'to', toDate);
    
    // Revenue query needs 2 parameters: fromDate, toDate
    const revenueData = queries.getRevenueReport.all(fromDate, toDate);
    
    console.log('Revenue data:', revenueData);
    
    res.json({
      success: true,
      data: revenueData,
      period: { fromDate, toDate }
    });
  } catch (error) {
    console.error('Error getting revenue report:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Get inventory report by month
router.get('/inventory', (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    
    if (!fromDate || !toDate) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'fromDate and toDate are required' 
      });
    }

    console.log('Getting inventory report for:', fromDate, 'to', toDate);
    
    // Inventory query needs 4 parameters: fromDate, toDate for imports, fromDate, toDate for usage
    const inventoryData = queries.getInventoryReport.all(fromDate, toDate, fromDate, toDate);
    
    console.log('Inventory data:', inventoryData);
    
    res.json({
      success: true,
      data: inventoryData,
      period: { fromDate, toDate }
    });
  } catch (error) {
    console.error('Error getting inventory report:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;