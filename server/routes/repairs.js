import express from 'express';
import { executeQuery } from '../utils/database.js';

const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  console.log('🔥 REPAIRS TEST ROUTE HIT!');
  res.json({ success: true, message: 'Repairs route is working!' });
});

// GET /api/repairs - Get all repair orders
router.get('/', async (req, res) => {
  try {
    console.log('🔥 GET REPAIRS ROUTE HIT!');
    res.json({
      success: true,
      data: [],
      message: 'Lấy danh sách phiếu sửa chữa thành công'
    });
  } catch (error) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi lấy danh sách phiếu sửa chữa'
    });
  }
});

// POST /api/repairs - Create new repair order
router.post('/', async (req, res) => {
  try {
    console.log('🔥 POST REPAIRS ROUTE HIT!', req.body);
    
    const { vehicleId, notes, repairDetails } = req.body;

    // Validation
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Mã xe là bắt buộc'
      });
    }

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
        await executeQuery(
          'INSERT INTO CHITIETPHIEUSUA (MaPhieuSua, NoiDungSua, ChiPhiSua) VALUES (?, ?, ?)',
          [repairId, detail.description, detail.cost || 0]
        );
      }
    }

    // Calculate total amount
    const totalResult = await executeQuery(
      'SELECT SUM(ChiPhiSua) as total FROM CHITIETPHIEUSUA WHERE MaPhieuSua = ?',
      [repairId]
    );

    const totalAmount = totalResult[0].total || 0;

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
        notes: notes
      },
      message: 'Tạo phiếu sửa chữa thành công'
    });
  } catch (error) {
    console.error('Error creating repair:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi tạo phiếu sửa chữa'
    });
  }
});

export default router;