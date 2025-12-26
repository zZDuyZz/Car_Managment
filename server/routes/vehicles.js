import express from 'express';
import { executeQuery } from '../utils/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Special route without authentication for repair creation (testing)
const repairRouter = express.Router();

// POST /api/vehicles/:id/repairs - Create repair for specific vehicle (NO AUTH for testing)
repairRouter.post('/:id/repairs', async (req, res) => {
  try {
    console.log('🔥 CREATE REPAIR FOR VEHICLE (NO AUTH):', req.params.id, req.body);
    
    const vehicleId = req.params.id;
    const { notes, repairDetails } = req.body;

    // Check if vehicle exists
    const vehicle = await executeQuery(
      'SELECT * FROM XE WHERE MaXe = ?',
      [vehicleId]
    );

    if (vehicle.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Xe không tồn tại'
      });
    }

    // Insert new repair order
    const result = await executeQuery(
      'INSERT INTO PHIEUSUA (MaXe, NgayVao, TongTien, TrangThai, GhiChu, MaTaiKhoan) VALUES (?, datetime("now"), 0, "DANG_SUA", ?, ?)',
      [vehicleId, notes || '', 1] // Tạm thời dùng user ID = 1
    );

    const repairId = result.lastID;

    // Insert repair details if provided
    if (repairDetails && repairDetails.length > 0) {
      for (const detail of repairDetails) {
        if (detail.description && detail.description.trim() !== ' - ') {
          await executeQuery(
            'INSERT INTO CHITIETPHIEUSUA (MaPhieuSua, NoiDungSua, ChiPhiSua) VALUES (?, ?, ?)',
            [repairId, detail.description, detail.cost || 0]
          );
        }
      }
    }

    // Calculate total amount
    const totalResult = await executeQuery(
      'SELECT SUM(ChiPhiSua) as total FROM CHITIETPHIEUSUA WHERE MaPhieuSua = ?',
      [repairId]
    );

    const totalAmount = totalResult[0]?.total || 0;

    // Update total amount
    await executeQuery(
      'UPDATE PHIEUSUA SET TongTien = ? WHERE MaPhieuSua = ?',
      [totalAmount, repairId]
    );

    res.status(201).json({
      success: true,
      data: {
        id: repairId,
        vehicleId: vehicleId,
        totalAmount: totalAmount,
        status: 'DANG_SUA',
        notes: notes,
        dateIn: new Date().toISOString()
      },
      message: 'Tạo phiếu sửa chữa thành công'
    });
  } catch (error) {
    console.error('Error creating repair:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi tạo phiếu sửa chữa: ' + error.message
    });
  }
});

// Apply authentication to all other routes
router.use(authenticate);

// GET /api/vehicles - Get all vehicles with customer info
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = `
      SELECT 
        x.MaXe,
        x.BienSoXe,
        x.TenChuXe,
        x.LoaiXe,
        x.MauXe,
        x.NamSanXuat,
        x.MaKhachHang,
        x.NgayTao,
        k.TenKhachHang,
        k.SoDienThoai
      FROM XE x
      LEFT JOIN KHACHHANG k ON x.MaKhachHang = k.MaKhachHang
    `;
    
    let params = [];
    
    if (search) {
      query += ` WHERE x.BienSoXe LIKE ? OR x.TenChuXe LIKE ? OR x.LoaiXe LIKE ? OR x.MauXe LIKE ? OR k.TenKhachHang LIKE ? OR k.SoDienThoai LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }
    
    query += ' ORDER BY x.NgayTao DESC';
    
    const vehicles = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: vehicles.map(vehicle => ({
        id: vehicle.MaXe,
        licensePlate: vehicle.BienSoXe,
        ownerName: vehicle.TenChuXe,
        vehicleType: vehicle.LoaiXe,
        color: vehicle.MauXe,
        year: vehicle.NamSanXuat,
        customerId: vehicle.MaKhachHang,
        customerName: vehicle.TenKhachHang,
        customerPhone: vehicle.SoDienThoai,
        createdAt: vehicle.NgayTao
      })),
      message: 'Lấy danh sách xe thành công'
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi lấy danh sách xe'
    });
  }
});

// POST /api/vehicles - Create new vehicle
router.post('/', async (req, res) => {
  try {
    const { licensePlate, ownerName, vehicleType, color, year, customerId } = req.body;

    // Validation
    if (!licensePlate || !ownerName) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Biển số xe và tên chủ xe là bắt buộc'
      });
    }

    // Check if license plate already exists
    const existingVehicle = await executeQuery(
      'SELECT * FROM XE WHERE BienSoXe = ?',
      [licensePlate]
    );

    if (existingVehicle.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Biển số xe đã tồn tại'
      });
    }

    // Check if customer exists (if customerId provided)
    if (customerId) {
      const customer = await executeQuery(
        'SELECT * FROM KHACHHANG WHERE MaKhachHang = ?',
        [customerId]
      );

      if (customer.length === 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Khách hàng không tồn tại'
        });
      }
    }

    // Insert new vehicle
    const result = await executeQuery(
      'INSERT INTO XE (BienSoXe, TenChuXe, LoaiXe, MauXe, NamSanXuat, MaKhachHang, NgayTao) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))',
      [licensePlate, ownerName, vehicleType || '', color || '', year || null, customerId || null]
    );

    // Get the created vehicle with customer info
    const newVehicle = await executeQuery(`
      SELECT 
        x.MaXe,
        x.BienSoXe,
        x.TenChuXe,
        x.LoaiXe,
        x.MauXe,
        x.NamSanXuat,
        x.MaKhachHang,
        x.NgayTao,
        k.TenKhachHang,
        k.SoDienThoai
      FROM XE x
      LEFT JOIN KHACHHANG k ON x.MaKhachHang = k.MaKhachHang
      WHERE x.MaXe = ?
    `, [result.lastID]);

    res.status(201).json({
      success: true,
      data: {
        id: newVehicle[0].MaXe,
        licensePlate: newVehicle[0].BienSoXe,
        ownerName: newVehicle[0].TenChuXe,
        vehicleType: newVehicle[0].LoaiXe,
        color: newVehicle[0].MauXe,
        year: newVehicle[0].NamSanXuat,
        customerId: newVehicle[0].MaKhachHang,
        customerName: newVehicle[0].TenKhachHang,
        customerPhone: newVehicle[0].SoDienThoai,
        createdAt: newVehicle[0].NgayTao
      },
      message: 'Tạo xe thành công'
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi tạo xe'
    });
  }
});

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { licensePlate, ownerName, vehicleType, color, year, customerId } = req.body;

    // Validation
    if (!licensePlate || !ownerName) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Biển số xe và tên chủ xe là bắt buộc'
      });
    }

    // Check if vehicle exists
    const existingVehicle = await executeQuery(
      'SELECT * FROM XE WHERE MaXe = ?',
      [id]
    );

    if (existingVehicle.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Không tìm thấy xe'
      });
    }

    // Check if license plate already exists (excluding current vehicle)
    const plateCheck = await executeQuery(
      'SELECT * FROM XE WHERE BienSoXe = ? AND MaXe != ?',
      [licensePlate, id]
    );

    if (plateCheck.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Biển số xe đã tồn tại'
      });
    }

    // Check if customer exists (if customerId provided)
    if (customerId) {
      const customer = await executeQuery(
        'SELECT * FROM KHACHHANG WHERE MaKhachHang = ?',
        [customerId]
      );

      if (customer.length === 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Khách hàng không tồn tại'
        });
      }
    }

    // Update vehicle
    await executeQuery(
      'UPDATE XE SET BienSoXe = ?, TenChuXe = ?, LoaiXe = ?, MauXe = ?, NamSanXuat = ?, MaKhachHang = ? WHERE MaXe = ?',
      [licensePlate, ownerName, vehicleType || '', color || '', year || null, customerId || null, id]
    );

    // Get updated vehicle with customer info
    const updatedVehicle = await executeQuery(`
      SELECT 
        x.MaXe,
        x.BienSoXe,
        x.TenChuXe,
        x.LoaiXe,
        x.MauXe,
        x.NamSanXuat,
        x.MaKhachHang,
        x.NgayTao,
        k.TenKhachHang,
        k.SoDienThoai
      FROM XE x
      LEFT JOIN KHACHHANG k ON x.MaKhachHang = k.MaKhachHang
      WHERE x.MaXe = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        id: updatedVehicle[0].MaXe,
        licensePlate: updatedVehicle[0].BienSoXe,
        ownerName: updatedVehicle[0].TenChuXe,
        vehicleType: updatedVehicle[0].LoaiXe,
        color: updatedVehicle[0].MauXe,
        year: updatedVehicle[0].NamSanXuat,
        customerId: updatedVehicle[0].MaKhachHang,
        customerName: updatedVehicle[0].TenKhachHang,
        customerPhone: updatedVehicle[0].SoDienThoai,
        createdAt: updatedVehicle[0].NgayTao
      },
      message: 'Cập nhật xe thành công'
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi cập nhật xe'
    });
  }
});

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle exists
    const existingVehicle = await executeQuery(
      'SELECT * FROM XE WHERE MaXe = ?',
      [id]
    );

    if (existingVehicle.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Không tìm thấy xe'
      });
    }

    // Check if vehicle has repair orders
    const repairs = await executeQuery(
      'SELECT * FROM PHIEUSUA WHERE MaXe = ?',
      [id]
    );

    if (repairs.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Không thể xóa xe đã có phiếu sửa chữa'
      });
    }

    // Delete vehicle
    await executeQuery('DELETE FROM XE WHERE MaXe = ?', [id]);

    res.json({
      success: true,
      data: null,
      message: 'Xóa xe thành công'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi xóa xe'
    });
  }
});

export default router;
export { repairRouter };