import express from 'express';
import db from '../database.js';

const router = express.Router();

// Load demo data for presentation
router.post('/load-demo-data', (req, res) => {
  try {
    // Clear existing data (optional)
    // db.prepare('DELETE FROM PHIEUTHUTIEN').run();
    // db.prepare('DELETE FROM CHITIETPHIEUSUACHUA').run();
    // db.prepare('DELETE FROM PHIEUSUACHUA').run();
    
    // Insert demo customers
    const insertCustomer = db.prepare(`
      INSERT OR REPLACE INTO KHACHHANG (MaKH, TenKH, DienThoai, DiaChi, TienNo) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertCustomer.run(1, 'Nguyễn Văn A', '0912345678', '123 Lê Lợi, Q1, HCM', 0);
    insertCustomer.run(2, 'Trần Thị B', '0987654321', '456 Nguyễn Huệ, Q1, HCM', 0);
    insertCustomer.run(3, 'Lê Văn C', '0909123456', '789 Điện Biên Phủ, Q3, HCM', 0);
    insertCustomer.run(4, 'Phạm Thị D', '0938765432', '321 Lý Tự Trọng, Q1, HCM', 0);

    // Insert demo vehicles
    const insertVehicle = db.prepare(`
      INSERT OR REPLACE INTO XE (BienSo, MaHX, MaKH, NgayTiepNhan, TrangThai) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertVehicle.run('51A-12345', 1, 1, '2025-12-26 08:00:00', 1);
    insertVehicle.run('59B-67890', 2, 2, '2025-12-26 09:30:00', 1);
    insertVehicle.run('60C-11111', 3, 3, '2025-12-26 10:15:00', 1);
    insertVehicle.run('61D-22222', 4, 4, '2025-12-26 11:00:00', 1);

    // Insert demo services
    const insertService = db.prepare(`
      INSERT OR REPLACE INTO TIENCONG (MaTC, TenTienCong, ChiPhi) 
      VALUES (?, ?, ?)
    `);
    
    insertService.run(1, 'Thay dầu máy', 150000);
    insertService.run(2, 'Kiểm tra phanh', 100000);
    insertService.run(3, 'Thay lọc gió', 80000);
    insertService.run(4, 'Cân bằng lốp', 120000);
    insertService.run(5, 'Thay nhớt hộp số', 200000);

    // Insert demo parts
    const insertPart = db.prepare(`
      INSERT OR REPLACE INTO KHO (MaPhuTung, TenVatTuPhuTung, SoLuong, DonGia) 
      VALUES (?, ?, ?, ?)
    `);
    
    insertPart.run(1, 'Dầu máy Shell', 20, 200000);
    insertPart.run(2, 'Má phanh Toyota', 15, 350000);
    insertPart.run(3, 'Lọc gió Honda', 25, 150000);
    insertPart.run(4, 'Lốp Michelin 185/65R15', 12, 1200000);
    insertPart.run(5, 'Nhớt hộp số Castrol', 18, 250000);

    // Insert demo repairs
    const insertRepair = db.prepare(`
      INSERT OR REPLACE INTO PHIEUSUACHUA (MaPhieuSuaChua, BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertRepair.run(1, '51A-12345', 1, 150000, 400000, 550000, '2025-12-26 08:30:00');
    insertRepair.run(2, '60C-11111', 3, 280000, 500000, 780000, '2025-12-26 10:45:00');

    // Insert repair details
    const insertRepairDetail = db.prepare(`
      INSERT OR REPLACE INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    // Repair 1 details
    insertRepairDetail.run(1, 1, null, 1, null);  // Service
    insertRepairDetail.run(1, null, 1, 2, 200000); // Parts
    
    // Repair 2 details  
    insertRepairDetail.run(2, 2, null, 1, null);   // Service 1
    insertRepairDetail.run(2, 3, null, 1, null);   // Service 2
    insertRepairDetail.run(2, 4, null, 1, null);   // Service 3
    insertRepairDetail.run(2, null, 2, 1, 350000); // Parts 1
    insertRepairDetail.run(2, null, 3, 1, 150000); // Parts 2

    // Insert demo payments
    const insertPayment = db.prepare(`
      INSERT OR REPLACE INTO PHIEUTHUTIEN (MaPhieuThuTien, MaKH, TienThu, GhiChu, NgayThuTien) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertPayment.run(1, 1, 400000, 'Thanh toán một phần phiếu sửa chữa #1', '2025-12-26 12:00:00');
    insertPayment.run(2, 3, 480000, 'Thanh toán một phần phiếu sửa chữa #2', '2025-12-26 13:30:00');

    res.json({
      success: true,
      message: 'Demo data loaded successfully',
      data: {
        customers: 4,
        vehicles: 4,
        services: 5,
        parts: 5,
        repairs: 2,
        payments: 2
      }
    });

  } catch (error) {
    console.error('Load demo data error:', error);
    res.status(500).json({ 
      error: 'Failed to load demo data',
      message: error.message 
    });
  }
});

// Reset demo data
router.post('/reset-demo', (req, res) => {
  try {
    // Clear all data
    db.prepare('DELETE FROM PHIEUTHUTIEN').run();
    db.prepare('DELETE FROM CHITIETPHIEUSUACHUA').run();
    db.prepare('DELETE FROM PHIEUSUACHUA').run();
    db.prepare('DELETE FROM XE').run();
    db.prepare('DELETE FROM KHACHHANG WHERE MaKH > 0').run();
    db.prepare('DELETE FROM TIENCONG WHERE MaTC > 0').run();
    db.prepare('DELETE FROM KHO WHERE MaPhuTung > 0').run();

    res.json({
      success: true,
      message: 'Demo data reset successfully'
    });

  } catch (error) {
    console.error('Reset demo data error:', error);
    res.status(500).json({ 
      error: 'Failed to reset demo data',
      message: error.message 
    });
  }
});

export default router;