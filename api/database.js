import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to SQLite database
const dbPath = path.join(__dirname, '../src/database/Nhom16QLGO (1).sqlite');

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Test connection
try {
  const result = db.prepare('SELECT COUNT(*) as count FROM TAIKHOAN').get();
  console.log('✅ Database connected successfully');
  console.log(`📊 Found ${result.count} accounts in database`);
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// Prepared statements for common operations
export const queries = {
  // Auth queries
  getUserByUsername: db.prepare('SELECT * FROM TAIKHOAN WHERE TenDangNhap = ?'),
  getAllAccounts: db.prepare('SELECT * FROM TAIKHOAN ORDER BY MaTK DESC'),
  createAccount: db.prepare(`
    INSERT INTO TAIKHOAN (TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan) 
    VALUES (?, ?, ?, ?)
  `),
  updateAccount: db.prepare(`
    UPDATE TAIKHOAN 
    SET TenChuTaiKhoan = ?, TenDangNhap = ?, QuyenHan = ? 
    WHERE MaTK = ?
  `),
  updateAccountWithPassword: db.prepare(`
    UPDATE TAIKHOAN 
    SET TenChuTaiKhoan = ?, TenDangNhap = ?, MatKhau = ?, QuyenHan = ? 
    WHERE MaTK = ?
  `),
  deleteAccount: db.prepare('DELETE FROM TAIKHOAN WHERE MaTK = ?'),
  
  // Customer queries
  getAllCustomers: db.prepare('SELECT * FROM KHACHHANG ORDER BY MaKH DESC'),
  getCustomerById: db.prepare('SELECT * FROM KHACHHANG WHERE MaKH = ?'),
  getCustomerByPhone: db.prepare('SELECT * FROM KHACHHANG WHERE DienThoai = ?'),
  createCustomer: db.prepare(`
    INSERT INTO KHACHHANG (TenKH, DienThoai, DiaChi, TienNo) 
    VALUES (?, ?, ?, 0)
  `),
  updateCustomer: db.prepare(`
    UPDATE KHACHHANG 
    SET TenKH = ?, DienThoai = ?, DiaChi = ? 
    WHERE MaKH = ?
  `),
  deleteCustomer: db.prepare('DELETE FROM KHACHHANG WHERE MaKH = ?'),
  searchCustomers: db.prepare(`
    SELECT * FROM KHACHHANG 
    WHERE TenKH LIKE ? OR DienThoai LIKE ? OR MaKH LIKE ?
    ORDER BY MaKH DESC
  `),
  
  // Vehicle queries
  getAllVehicles: db.prepare(`
    SELECT x.*, k.TenKH, k.DienThoai, h.TenHieuXe
    FROM XE x
    LEFT JOIN KHACHHANG k ON x.MaKH = k.MaKH
    LEFT JOIN HIEUXE h ON x.MaHX = h.MaHX
    ORDER BY x.NgayTiepNhan DESC
  `),
  getVehicleByPlate: db.prepare(`
    SELECT x.*, k.TenKH, k.DienThoai, h.TenHieuXe
    FROM XE x
    LEFT JOIN KHACHHANG k ON x.MaKH = k.MaKH
    LEFT JOIN HIEUXE h ON x.MaHX = h.MaHX
    WHERE x.BienSo = ?
  `),
  getVehiclesByCustomer: db.prepare(`
    SELECT x.*, h.TenHieuXe
    FROM XE x
    LEFT JOIN HIEUXE h ON x.MaHX = h.MaHX
    WHERE x.MaKH = ?
    ORDER BY x.NgayTiepNhan DESC
  `),
  createVehicle: db.prepare(`
    INSERT INTO XE (BienSo, MaHX, MaKH, NgayTiepNhan, TrangThai) 
    VALUES (?, ?, ?, datetime('now', 'localtime'), 1)
  `),
  updateVehicleStatus: db.prepare(`
    UPDATE XE SET TrangThai = ? WHERE BienSo = ?
  `),
  searchVehicles: db.prepare(`
    SELECT x.*, k.TenKH, k.DienThoai, h.TenHieuXe
    FROM XE x
    LEFT JOIN KHACHHANG k ON x.MaKH = k.MaKH
    LEFT JOIN HIEUXE h ON x.MaHX = h.MaHX
    WHERE x.BienSo LIKE ? OR k.TenKH LIKE ?
    ORDER BY x.NgayTiepNhan DESC
  `),
  
  // Repair queries
  getAllRepairs: db.prepare(`
    SELECT p.*, x.BienSo, k.TenKH, k.DienThoai
    FROM PHIEUSUACHUA p
    LEFT JOIN XE x ON p.BienSo = x.BienSo
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    ORDER BY p.NgaySua DESC
  `),
  getRepairById: db.prepare(`
    SELECT p.*, x.BienSo, k.TenKH, k.DienThoai
    FROM PHIEUSUACHUA p
    LEFT JOIN XE x ON p.BienSo = x.BienSo
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    WHERE p.MaPhieuSuaChua = ?
  `),
  createRepair: db.prepare(`
    INSERT INTO PHIEUSUACHUA (BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) 
    VALUES (?, ?, 0, 0, 0, datetime('now', 'localtime'))
  `),
  updateRepair: db.prepare(`
    UPDATE PHIEUSUACHUA 
    SET TienCong = ?, TienPhuTung = ?, TongTien = ?
    WHERE MaPhieuSuaChua = ?
  `),
  deleteRepair: db.prepare('DELETE FROM PHIEUSUACHUA WHERE MaPhieuSuaChua = ?'),
  
  // Repair detail queries
  getRepairDetails: db.prepare(`
    SELECT ct.*, tc.TenTienCong, k.TenVatTuPhuTung
    FROM CHITIETPHIEUSUACHUA ct
    LEFT JOIN TIENCONG tc ON ct.MaTC = tc.MaTC
    LEFT JOIN KHO k ON ct.MaPhuTung = k.MaPhuTung
    WHERE ct.MaPhieuSuaChua = ?
  `),
  addRepairDetail: db.prepare(`
    INSERT INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung)
    VALUES (?, ?, ?, ?, ?)
  `),
  deleteRepairDetail: db.prepare('DELETE FROM CHITIETPHIEUSUACHUA WHERE MaPhieuSuaChua = ? AND MaTC = ? AND MaPhuTung = ?'),
  
  // Brand queries
  getAllBrands: db.prepare('SELECT * FROM HIEUXE ORDER BY TenHieuXe'),
  
  // Service queries (using TIENCONG table)
  getAllServices: db.prepare('SELECT * FROM TIENCONG ORDER BY TenTienCong'),
  getServiceById: db.prepare('SELECT * FROM TIENCONG WHERE MaTC = ?'),
  createService: db.prepare(`
    INSERT INTO TIENCONG (TenTienCong, ChiPhi) 
    VALUES (?, ?)
  `),
  updateService: db.prepare(`
    UPDATE TIENCONG SET TenTienCong = ?, ChiPhi = ? WHERE MaTC = ?
  `),
  deleteService: db.prepare('DELETE FROM TIENCONG WHERE MaTC = ?'),
  
  // Parts queries (using KHO table)
  getAllParts: db.prepare('SELECT * FROM KHO ORDER BY TenVatTuPhuTung'),
  getPartById: db.prepare('SELECT * FROM KHO WHERE MaPhuTung = ?'),
  createPart: db.prepare(`
    INSERT INTO KHO (TenVatTuPhuTung, DonGia, SoLuong) 
    VALUES (?, ?, ?)
  `),
  updatePart: db.prepare(`
    UPDATE KHO SET TenVatTuPhuTung = ?, DonGia = ?, SoLuong = ? WHERE MaPhuTung = ?
  `),
  updatePartStock: db.prepare(`
    UPDATE KHO SET SoLuong = SoLuong - ? WHERE MaPhuTung = ?
  `),
  deletePart: db.prepare('DELETE FROM KHO WHERE MaPhuTung = ?'),
};

export default db;