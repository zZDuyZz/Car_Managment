import { queries } from '../database.js';

// Get current settings from database
const getSettings = () => {
  const settingsRows = queries.getSettings.all();
  
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
  
  return settings;
};

// Validate vehicle creation against daily limit
export const validateVehicleLimit = (req, res, next) => {
  try {
    const settings = getSettings();
    const todayCount = queries.countVehiclesToday.get();
    
    if (todayCount.count >= settings.maxCars) {
      return res.status(400).json({
        success: false,
        error: 'VEHICLE_LIMIT_EXCEEDED',
        message: `Đã đạt giới hạn ${settings.maxCars} xe/ngày. Không thể tiếp nhận thêm xe hôm nay.`,
        limit: settings.maxCars,
        current: todayCount.count
      });
    }
    
    next();
  } catch (error) {
    console.error('Error validating vehicle limit:', error);
    next(error);
  }
};

// Validate brand limit
export const validateBrandLimit = (req, res, next) => {
  try {
    const settings = getSettings();
    const brandCount = queries.countBrands.get();
    
    if (brandCount.count >= settings.maxBrands) {
      return res.status(400).json({
        success: false,
        error: 'BRAND_LIMIT_EXCEEDED',
        message: `Đã đạt giới hạn ${settings.maxBrands} hãng xe. Không thể thêm hãng xe mới.`,
        limit: settings.maxBrands,
        current: brandCount.count
      });
    }
    
    next();
  } catch (error) {
    console.error('Error validating brand limit:', error);
    next(error);
  }
};

// Validate parts limit
export const validatePartsLimit = (req, res, next) => {
  try {
    const settings = getSettings();
    const partsCount = queries.countParts.get();
    
    if (partsCount.count >= settings.maxParts) {
      return res.status(400).json({
        success: false,
        error: 'PARTS_LIMIT_EXCEEDED',
        message: `Đã đạt giới hạn ${settings.maxParts} loại phụ tùng. Không thể thêm phụ tùng mới.`,
        limit: settings.maxParts,
        current: partsCount.count
      });
    }
    
    next();
  } catch (error) {
    console.error('Error validating parts limit:', error);
    next(error);
  }
};

// Validate services limit
export const validateServicesLimit = (req, res, next) => {
  try {
    const settings = getSettings();
    const servicesCount = queries.countServices.get();
    
    if (servicesCount.count >= settings.maxLabors) {
      return res.status(400).json({
        success: false,
        error: 'SERVICES_LIMIT_EXCEEDED',
        message: `Đã đạt giới hạn ${settings.maxLabors} loại dịch vụ. Không thể thêm dịch vụ mới.`,
        limit: settings.maxLabors,
        current: servicesCount.count
      });
    }
    
    next();
  } catch (error) {
    console.error('Error validating services limit:', error);
    next(error);
  }
};

// Get current limits for frontend display
export const getCurrentLimits = (req, res) => {
  try {
    const settings = getSettings();
    const todayCount = queries.countVehiclesToday.get();
    const brandCount = queries.countBrands.get();
    const partsCount = queries.countParts.get();
    const servicesCount = queries.countServices.get();
    
    res.json({
      success: true,
      data: {
        vehicles: {
          limit: settings.maxCars,
          current: todayCount.count,
          remaining: settings.maxCars - todayCount.count,
          canAdd: todayCount.count < settings.maxCars
        },
        brands: {
          limit: settings.maxBrands,
          current: brandCount.count,
          remaining: settings.maxBrands - brandCount.count,
          canAdd: brandCount.count < settings.maxBrands
        },
        parts: {
          limit: settings.maxParts,
          current: partsCount.count,
          remaining: settings.maxParts - partsCount.count,
          canAdd: partsCount.count < settings.maxParts
        },
        services: {
          limit: settings.maxLabors,
          current: servicesCount.count,
          remaining: settings.maxLabors - servicesCount.count,
          canAdd: servicesCount.count < settings.maxLabors
        }
      }
    });
  } catch (error) {
    console.error('Error getting current limits:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};
