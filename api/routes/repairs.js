import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all repairs
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

// Get repair by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const repair = queries.getRepairById.get(id);
    
    if (!repair) {
      return res.status(404).json({ 
        error: 'Repair not found' 
      });
    }

    // Get repair details
    const details = queries.getRepairDetails.all(id);
    
    res.json({
      success: true,
      data: {
        ...repair,
        details
      }
    });
  } catch (error) {
    console.error('Get repair error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch repair' 
    });
  }
});

// Create new repair
router.post('/', (req, res) => {
  try {
    const { licensePlate, customerId } = req.body;

    // Validation
    if (!licensePlate || !customerId) {
      return res.status(400).json({ 
        error: 'License plate and customer ID are required' 
      });
    }

    // Create repair
    const result = queries.createRepair.run(licensePlate, customerId);
    
    res.status(201).json({
      success: true,
      message: 'Repair created successfully',
      data: {
        id: result.lastInsertRowid,
        licensePlate,
        customerId
      }
    });
  } catch (error) {
    console.error('Create repair error:', error);
    res.status(500).json({ 
      error: 'Failed to create repair' 
    });
  }
});

// Add repair detail (service or part)
router.post('/:id/details', (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, partId, quantity, unitPrice } = req.body;

    // Validation
    if (!quantity) {
      return res.status(400).json({ 
        error: 'Quantity is required' 
      });
    }

    if (!serviceId && !partId) {
      return res.status(400).json({ 
        error: 'Either service ID or part ID is required' 
      });
    }

    // Add repair detail
    const result = queries.addRepairDetail.run(
      id, 
      serviceId || null, 
      partId || null, 
      quantity, 
      unitPrice || null
    );

    res.status(201).json({
      success: true,
      message: 'Repair detail added successfully',
      data: {
        id: result.lastInsertRowid
      }
    });
  } catch (error) {
    console.error('Add repair detail error:', error);
    res.status(500).json({ 
      error: 'Failed to add repair detail' 
    });
  }
});

// Update repair totals
router.put('/:id/totals', (req, res) => {
  try {
    const { id } = req.params;
    const { laborCost, partsCost, totalCost } = req.body;

    const result = queries.updateRepair.run(laborCost, partsCost, totalCost, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Repair not found' 
      });
    }

    res.json({
      success: true,
      message: 'Repair totals updated successfully'
    });
  } catch (error) {
    console.error('Update repair totals error:', error);
    res.status(500).json({ 
      error: 'Failed to update repair totals' 
    });
  }
});

// Delete repair
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const result = queries.deleteRepair.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Repair not found' 
      });
    }

    res.json({
      success: true,
      message: 'Repair deleted successfully'
    });
  } catch (error) {
    console.error('Delete repair error:', error);
    res.status(500).json({ 
      error: 'Failed to delete repair' 
    });
  }
});

export default router;