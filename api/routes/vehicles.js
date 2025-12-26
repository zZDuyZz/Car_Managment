import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all vehicles
router.get('/', (req, res) => {
  try {
    const { search, customerId } = req.query;
    let vehicles;
    
    if (customerId) {
      vehicles = queries.getVehiclesByCustomer.all(customerId);
    } else if (search) {
      const searchTerm = `%${search}%`;
      vehicles = queries.searchVehicles.all(searchTerm, searchTerm);
    } else {
      vehicles = queries.getAllVehicles.all();
    }
    
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

// Get vehicle by license plate
router.get('/plate/:plate', (req, res) => {
  try {
    const { plate } = req.params;
    const vehicle = queries.getVehicleByPlate.get(plate);
    
    if (!vehicle) {
      return res.status(404).json({ 
        error: 'Vehicle not found' 
      });
    }
    
    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vehicle' 
    });
  }
});

// Create new vehicle
router.post('/', (req, res) => {
  try {
    const { licensePlate, brandId, customerId } = req.body;

    // Validation
    if (!licensePlate || !brandId || !customerId) {
      return res.status(400).json({ 
        error: 'License plate, brand ID, and customer ID are required' 
      });
    }

    // Check if license plate already exists
    const existingVehicle = queries.getVehicleByPlate.get(licensePlate);
    if (existingVehicle) {
      return res.status(409).json({ 
        error: 'License plate already exists' 
      });
    }

    // Create vehicle
    const result = queries.createVehicle.run(licensePlate, brandId, customerId);
    
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: {
        licensePlate,
        brandId,
        customerId
      }
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ 
      error: 'Failed to create vehicle' 
    });
  }
});

// Update vehicle status
router.patch('/:plate/status', (req, res) => {
  try {
    const { plate } = req.params;
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({ 
        error: 'Status is required' 
      });
    }

    const result = queries.updateVehicleStatus.run(status, plate);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Vehicle not found' 
      });
    }

    res.json({
      success: true,
      message: 'Vehicle status updated successfully'
    });
  } catch (error) {
    console.error('Update vehicle status error:', error);
    res.status(500).json({ 
      error: 'Failed to update vehicle status' 
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