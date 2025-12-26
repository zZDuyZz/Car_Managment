import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all parts
router.get('/', (req, res) => {
  try {
    const parts = queries.getAllParts.all();
    res.json({
      success: true,
      data: parts
    });
  } catch (error) {
    console.error('Get parts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch parts' 
    });
  }
});

// Get part by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const part = queries.getPartById.get(id);
    
    if (!part) {
      return res.status(404).json({ 
        error: 'Part not found' 
      });
    }
    
    res.json({
      success: true,
      data: part
    });
  } catch (error) {
    console.error('Get part error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch part' 
    });
  }
});

// Create new part
router.post('/', (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ 
        error: 'Name, price, and stock are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        error: 'Price must be positive' 
      });
    }

    if (stock < 0) {
      return res.status(400).json({ 
        error: 'Stock must be non-negative' 
      });
    }

    // Create part
    const result = queries.createPart.run(name, price, stock);
    
    res.status(201).json({
      success: true,
      message: 'Part created successfully',
      data: {
        id: result.lastInsertRowid,
        name,
        price,
        stock
      }
    });
  } catch (error) {
    console.error('Create part error:', error);
    res.status(500).json({ 
      error: 'Failed to create part' 
    });
  }
});

// Update part
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ 
        error: 'Name, price, and stock are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        error: 'Price must be positive' 
      });
    }

    if (stock < 0) {
      return res.status(400).json({ 
        error: 'Stock must be non-negative' 
      });
    }

    const result = queries.updatePart.run(name, price, stock, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Part not found' 
      });
    }

    res.json({
      success: true,
      message: 'Part updated successfully'
    });
  } catch (error) {
    console.error('Update part error:', error);
    res.status(500).json({ 
      error: 'Failed to update part' 
    });
  }
});

// Delete part
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const result = queries.deletePart.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Part not found' 
      });
    }

    res.json({
      success: true,
      message: 'Part deleted successfully'
    });
  } catch (error) {
    console.error('Delete part error:', error);
    res.status(500).json({ 
      error: 'Failed to delete part' 
    });
  }
});

export default router;