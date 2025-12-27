import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get current settings
router.get('/', (req, res) => {
  try {
    const settingsRows = queries.getSettings.all();
    
    // Convert rows to settings object with default values
    const defaultSettings = {
      maxCars: 30,
      maxBrands: 10,
      maxParts: 200,
      maxLabors: 100
    };
    
    const settings = { ...defaultSettings };
    
    settingsRows.forEach(row => {
      switch (row.MaThamSo) {
        case 'Q_MAX_VEHICLE_PER_DAY':
          settings.maxCars = row.GiaTri;
          break;
        case 'Q_NUM_BRANDS':
          settings.maxBrands = row.GiaTri;
          break;
        case 'Q_MAX_PARTS':
          settings.maxParts = row.GiaTri;
          break;
        case 'Q_MAX_LABORS':
          settings.maxLabors = row.GiaTri;
          break;
      }
    });
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Update settings
router.put('/', (req, res) => {
  try {
    const { maxCars, maxBrands, maxParts, maxLabors } = req.body;
    
    if (!maxCars || !maxBrands || !maxParts || !maxLabors) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'All settings fields are required' 
      });
    }

    // Update each setting
    const settingsToUpdate = [
      { key: 'Q_MAX_VEHICLE_PER_DAY', name: 'Số xe sửa tối đa trong ngày', value: maxCars },
      { key: 'Q_NUM_BRANDS', name: 'Số lượng hiệu xe', value: maxBrands },
      { key: 'Q_MAX_PARTS', name: 'Số loại phụ tùng tối đa', value: maxParts },
      { key: 'Q_MAX_LABORS', name: 'Số loại dịch vụ tối đa', value: maxLabors }
    ];
    
    settingsToUpdate.forEach(setting => {
      queries.createOrUpdateSetting.run(
        setting.key, 
        setting.name, 
        setting.value, 
        'Cập nhật từ giao diện admin'
      );
    });
    
    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

export default router;