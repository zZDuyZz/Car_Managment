import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all imports
router.get('/', (req, res) => {
  try {
    const imports = queries.getAllImports.all();
    res.json({
      success: true,
      data: imports
    });
  } catch (error) {
    console.error('Error getting imports:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Create new import
router.post('/', (req, res) => {
  try {
    const { partId, quantity, note } = req.body;
    
    if (!partId || !quantity) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'partId and quantity are required' 
      });
    }

    const result = queries.createImport.run(partId, quantity, note || null);
    
    res.json({
      success: true,
      data: { id: result.lastInsertRowid },
      message: 'Import created successfully'
    });
  } catch (error) {
    console.error('Error creating import:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Delete import
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Get import details before deleting to restore stock
    const importData = queries.getImportById.get(id);
    if (!importData) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Import not found' 
      });
    }

    // Delete the import (this will trigger database triggers to update stock)
    const result = queries.deleteImport.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Import not found' 
      });
    }

    res.json({
      success: true,
      message: 'Import deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting import:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;