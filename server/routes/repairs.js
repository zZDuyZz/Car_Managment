import express from 'express';
import { executeQuery } from '../utils/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/repairs - Get all repair orders
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = `
      SELECT 
        p.MaPhieuSua,
        p.MaXe,
        p.NgayVao,
        p.NgayRa,
        p.TongTien,
        p.TrangThai,
        p.GhiChu,
        x.BienSoXe,
        x.TenChuXe,
        x.LoaiXe,
        k.TenKhachHang,
        k.SoDienThoai
      FROM PHIEUSUA p
      LEFT JOIN XE x ON p.MaXe = x.MaXe
      LEFT JOIN KHACHHANG k ON x.MaKhachHang = k.MaKhachHang
    `;
    
    let params = [];
    
    if (search) {
      query += ` WHERE x.BienSoXe LIKE ? OR x.TenChuXe LIKE ? OR k.TenKhachHang LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }
    
    query += ' ORDER BY p.NgayVao DESC';
    
    const repairs = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: repairs.map(repair => ({
        id: repair.MaPhieuSua,
        vehicleId: repair.MaXe,
        licensePlate: repair.BienSoXe,
        ownerName: repair.TenChuXe,
        vehicleType: repair.LoaiXe,
        customerName: repair.TenKhachHang,
        customerPhone: repair.SoDienThoai,
        dateIn: repair.NgayVao,
        dateOut: repair.NgayRa,
        totalAmount: repair.TongTien,
        status: repair.TrangThai,
        notes: repair.GhiChu
      })),
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
      [vehicleId, notes || '', req.user.id]
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

    // Get the created repair with vehicle info
    const newRepair = await executeQuery(`
      SELECT 
        p.MaPhieuSua,
        p.MaXe,
        p.NgayVao,
        p.NgayRa,
        p.TongTien,
        p.TrangThai,
        p.GhiChu,
        x.BienSoXe,
        x.TenChuXe,
        x.LoaiXe,
        k.TenKhachHang,
        k.SoDienThoai
      FROM PHIEUSUA p
      LEFT JOIN XE x ON p.MaXe = x.MaXe
      LEFT JOIN KHACHHANG k ON x.MaKhachHang = k.MaKhachHang
      WHERE p.MaPhieuSua = ?
    `, [repairId]);

    res.status(201).json({
      success: true,
      data: {
        id: newRepair[0].MaPhieuSua,
        vehicleId: newRepair[0].MaXe,
        licensePlate: newRepair[0].BienSoXe,
        ownerName: newRepair[0].TenChuXe,
        vehicleType: newRepair[0].LoaiXe,
        customerName: newRepair[0].TenKhachHang,
        customerPhone: newRepair[0].SoDienThoai,
        dateIn: newRepair[0].NgayVao,
        dateOut: newRepair[0].NgayRa,
        totalAmount: newRepair[0].TongTien,
        status: newRepair[0].TrangThai,
        notes: newRepair[0].GhiChu
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

// PUT /api/repairs/:id - Update repair order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, dateOut } = req.body;

    // Check if repair exists
    const existingRepair = await executeQuery(
      'SELECT * FROM PHIEUSUA WHERE MaPhieuSua = ?',
      [id]
    );

    if (existingRepair.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Không tìm thấy phiếu sửa chữa'
      });
    }

    // Update repair
    await executeQuery(
      'UPDATE PHIEUSUA SET TrangThai = ?, GhiChu = ?, NgayRa = ? WHERE MaPhieuSua = ?',
      [status || existingRepair[0].TrangThai, notes || existingRepair[0].GhiChu, dateOut || existingRepair[0].NgayRa, id]
    );

    // Get updated repair
    const updatedRepair = await executeQuery(`
      SELECT 
        p.MaPhieuSua,
        p.MaXe,
        p.NgayVao,
        p.NgayRa,
        p.TongTien,
        p.TrangThai,
        p.GhiChu,
        x.BienSoXe,
        x.TenChuXe,
        x.LoaiXe,
        k.TenKhachHang,
        k.SoDienThoai
      FROM PHIEUSUA p
      LEFT JOIN XE x ON p.MaXe = x.MaXe
      LEFT JOIN KHACHHANG k ON x.MaKhachHang = k.MaKhachHang
      WHERE p.MaPhieuSua = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        id: updatedRepair[0].MaPhieuSua,
        vehicleId: updatedRepair[0].MaXe,
        licensePlate: updatedRepair[0].BienSoXe,
        ownerName: updatedRepair[0].TenChuXe,
        vehicleType: updatedRepair[0].LoaiXe,
        customerName: updatedRepair[0].TenKhachHang,
        customerPhone: updatedRepair[0].SoDienThoai,
        dateIn: updatedRepair[0].NgayVao,
        dateOut: updatedRepair[0].NgayRa,
        totalAmount: updatedRepair[0].TongTien,
        status: updatedRepair[0].TrangThai,
        notes: updatedRepair[0].GhiChu
      },
      message: 'Cập nhật phiếu sửa chữa thành công'
    });
  } catch (error) {
    console.error('Error updating repair:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi cập nhật phiếu sửa chữa'
    });
  }
});

// GET /api/repairs/:id/details - Get repair details
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;

    const details = await executeQuery(
      'SELECT * FROM CHITIETPHIEUSUA WHERE MaPhieuSua = ? ORDER BY MaChiTiet',
      [id]
    );

    res.json({
      success: true,
      data: details.map(detail => ({
        id: detail.MaChiTiet,
        repairId: detail.MaPhieuSua,
        description: detail.NoiDungSua,
        cost: detail.ChiPhiSua
      })),
      message: 'Lấy chi tiết phiếu sửa chữa thành công'
    });
  } catch (error) {
    console.error('Error fetching repair details:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi lấy chi tiết phiếu sửa chữa'
    });
  }
});

export default router;