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

// Get vehicles by customer ID
router.get('/by-customer/:customerId', (req, res) => {
  try {
    const { customerId } = req.params;
    const vehicles = queries.getVehiclesByCustomer.all(customerId);
    
    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Get customer vehicles error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch customer vehicles' 
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
    const { BienSo, TenHieuXe, MaKH } = req.body;

    // Validation
    if (!BienSo || !TenHieuXe || !MaKH) {
      return res.status(400).json({ 
        error: 'Biển số, hiệu xe và mã khách hàng là bắt buộc' 
      });
    }

    // Check if license plate already exists
    const existingVehicle = queries.getVehicleByPlate.get(BienSo);
    if (existingVehicle) {
      return res.status(409).json({ 
        error: 'Biển số xe đã tồn tại' 
      });
    }

    // Find brand ID by brand name
    const brands = queries.getAllBrands.all();
    const brand = brands.find(b => b.TenHieuXe === TenHieuXe);
    
    if (!brand) {
      return res.status(400).json({ 
        error: 'Hiệu xe không hợp lệ' 
      });
    }

    // Create vehicle
    const result = queries.createVehicle.run(BienSo, brand.MaHX, MaKH);
    
    res.status(201).json({
      success: true,
      message: 'Tiếp nhận xe thành công',
      data: {
        id: BienSo,
        BienSo,
        TenHieuXe,
        MaKH
      }
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ 
      error: 'Không thể tiếp nhận xe' 
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