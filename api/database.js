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
  
  // Vehicle queries
  getAllVehicles: db.prepare(`
    SELECT x.*, k.TenKH, k.DienThoai, h.TenHieuXe
    FROM XE x
    LEFT JOIN KHACHHANG k ON x.MaKH = k.MaKH
    LEFT JOIN HIEUXE h ON x.MaHX = h.MaHX
    ORDER BY x.NgayTiepNhan DESC
  `),
  getVehicleByPlate: db.prepare('SELECT * FROM XE WHERE BienSo = ?'),
  createVehicle: db.prepare(`
    INSERT INTO XE (BienSo, MaHX, MaKH, NgayTiepNhan, TrangThai) 
    VALUES (?, ?, ?, datetime('now', 'localtime'), 1)
  `),
  
  // Repair queries
  getAllRepairs: db.prepare(`
    SELECT p.*, x.BienSo, k.TenKH
    FROM PHIEUSUACHUA p
    LEFT JOIN XE x ON p.BienSo = x.BienSo
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    ORDER BY p.NgaySua DESC
  `),
  createRepair: db.prepare(`
    INSERT INTO PHIEUSUACHUA (BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) 
    VALUES (?, ?, 0, 0, 0, datetime('now', 'localtime'))
  `),
  
  // Brand queries
  getAllBrands: db.prepare('SELECT * FROM HIEUXE ORDER BY TenHieuXe'),
};

export default db;