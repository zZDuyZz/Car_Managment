import express from 'express';
import { queries } from '../database.js';
import { validateVehicleLimit } from '../middleware/validateSettings.js';

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
      success: false,
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
      success: false,
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
        success: false,
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
      success: false,
      error: 'Failed to fetch vehicle' 
    });
  }
});

// Create new vehicle (with validation middleware)
router.post('/', validateVehicleLimit, (req, res) => {
  try {
    const { BienSo, TenHieuXe, MaKH } = req.body;

    // Validation
    if (!BienSo || !TenHieuXe || !MaKH) {
      return res.status(400).json({ 
        success: false,
        error: 'Biển số, hiệu xe và mã khách hàng là bắt buộc' 
      });
    }

    // Check if license plate already exists
    const existingVehicle = queries.getVehicleByPlate.get(BienSo);
    if (existingVehicle) {
      return res.status(409).json({ 
        success: false,
        error: 'Biển số xe đã tồn tại' 
      });
    }

    // Find or create brand
    let brand = queries.getBrandByName.get(TenHieuXe);
    
    if (!brand) {
      // Check if we can add new brand
      const brandCount = queries.countBrands.get();
      const settings = queries.getSettings.all();
      const maxBrands = settings.find(s => s.MaThamSo === 'Q_NUM_BRANDS')?.GiaTri || 10;
      
      if (brandCount.count >= maxBrands) {
        return res.status(400).json({ 
          success: false,
          error: 'BRAND_LIMIT_EXCEEDED',
          message: `Đã đạt giới hạn ${maxBrands} hãng xe. Không thể thêm hãng xe mới "${TenHieuXe}".`
        });
      }
      
      // Create new brand
      queries.createBrand.run(TenHieuXe);
      brand = queries.getBrandByName.get(TenHieuXe);
    }

    // Create vehicle
    queries.createVehicle.run(BienSo, brand.MaHX, MaKH);
    
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
      success: false,
      error: 'Không thể tiếp nhận xe',
      message: error.message
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
        success: false,
        error: 'Status is required' 
      });
    }

    const result = queries.updateVehicleStatus.run(status, plate);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false,
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
      success: false,
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
      success: false,
      error: 'Failed to fetch brands' 
    });
  }
});

export default router;
