import express from 'express';
import { queries } from '../database.js';
import { validateServicesLimit } from '../middleware/validateSettings.js';

const router = express.Router();

// Get all services
router.get('/', (req, res) => {
  try {
    const services = queries.getAllServices.all();
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch services' 
    });
  }
});

// Get service by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const service = queries.getServiceById.get(id);
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch service' 
    });
  }
});

// Create new service (with validation middleware)
router.post('/', validateServicesLimit, (req, res) => {
  try {
    const { name, price } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and price are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Price must be positive' 
      });
    }

    // Create service
    const result = queries.createService.run(name, price);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: result.lastInsertRowid,
        name,
        price
      }
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create service' 
    });
  }
});

// Update service
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and price are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Price must be positive' 
      });
    }

    const result = queries.updateService.run(name, price, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update service' 
    });
  }
});

// Delete service
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const result = queries.deleteService.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Service not found' 
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete service' 
    });
  }
});

export default router;
