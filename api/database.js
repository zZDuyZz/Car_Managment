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
    INSERT INTO TAIKHOAN (TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan, TrangThai) 
    VALUES (?, ?, ?, ?, 'active')
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
  updateAccountStatus: db.prepare(`
    UPDATE TAIKHOAN 
    SET TrangThai = ? 
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
    SELECT p.*, x.BienSo, k.TenKH, k.DienThoai,
           COALESCE(SUM(pt.TienThu), 0) as TotalPaid
    FROM PHIEUSUACHUA p
    LEFT JOIN XE x ON p.BienSo = x.BienSo
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    LEFT JOIN PHIEUTHUTIEN pt ON p.MaKH = pt.MaKH
    GROUP BY p.MaPhieuSuaChua
    ORDER BY p.NgaySua DESC
  `),
  getRepairById: db.prepare(`
    SELECT p.*, x.BienSo, k.TenKH, k.DienThoai,
           COALESCE(SUM(pt.TienThu), 0) as TotalPaid
    FROM PHIEUSUACHUA p
    LEFT JOIN XE x ON p.BienSo = x.BienSo
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    LEFT JOIN PHIEUTHUTIEN pt ON p.MaKH = pt.MaKH
    WHERE p.MaPhieuSuaChua = ?
    GROUP BY p.MaPhieuSuaChua
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
    SELECT ct.*, tc.TenTienCong, tc.ChiPhi as TienCong, k.TenVatTuPhuTung
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
  
  // Payment queries
  getAllPayments: db.prepare(`
    SELECT p.*, k.TenKH, k.DienThoai
    FROM PHIEUTHUTIEN p
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    ORDER BY p.NgayThuTien DESC
  `),
  getPaymentById: db.prepare(`
    SELECT p.*, k.TenKH, k.DienThoai
    FROM PHIEUTHUTIEN p
    LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
    WHERE p.MaPhieuThuTien = ?
  `),
  createPayment: db.prepare(`
    INSERT INTO PHIEUTHUTIEN (MaKH, TienThu, GhiChu, NgayThuTien) 
    VALUES (?, ?, ?, datetime('now', 'localtime'))
  `),
  deletePayment: db.prepare('DELETE FROM PHIEUTHUTIEN WHERE MaPhieuThuTien = ?'),
  
  // Import queries
  getAllImports: db.prepare(`
    SELECT pn.*, k.TenVatTuPhuTung
    FROM PHIEUNHAPVTPT pn
    LEFT JOIN KHO k ON pn.MaPhuTung = k.MaPhuTung
    ORDER BY pn.ThoiDiem DESC
  `),
  getImportById: db.prepare(`
    SELECT pn.*, k.TenVatTuPhuTung
    FROM PHIEUNHAPVTPT pn
    LEFT JOIN KHO k ON pn.MaPhuTung = k.MaPhuTung
    WHERE pn.MaPNVTPT = ?
  `),
  createImport: db.prepare(`
    INSERT INTO PHIEUNHAPVTPT (MaPhuTung, SoLuong, GhiChu, ThoiDiem) 
    VALUES (?, ?, ?, datetime('now', 'localtime'))
  `),
  deleteImport: db.prepare('DELETE FROM PHIEUNHAPVTPT WHERE MaPNVTPT = ?'),
  
  // Report queries
  getRevenueReport: db.prepare(`
    SELECT 
      date(p.NgaySua) as Date,
      strftime('%Y-%m', p.NgaySua) as Month,
      COUNT(DISTINCT p.MaPhieuSuaChua) as CarsRepaired,
      COALESCE(SUM(p.TienCong), 0) as TotalLaborCost,
      COALESCE(SUM(p.TienPhuTung), 0) as TotalPartsCost,
      COALESCE(SUM(p.TongTien), 0) as TotalRevenue
    FROM PHIEUSUACHUA p
    WHERE date(p.NgaySua) BETWEEN date(?) AND date(?)
    GROUP BY date(p.NgaySua)
    ORDER BY Date
  `),
  
  getInventoryReport: db.prepare(`
    SELECT 
      k.MaPhuTung,
      k.TenVatTuPhuTung,
      k.SoLuong as CurrentStock,
      COALESCE(imports.TotalImported, 0) as TotalImported,
      COALESCE(usage.TotalUsed, 0) as TotalUsed,
      (k.SoLuong + COALESCE(usage.TotalUsed, 0) - COALESCE(imports.TotalImported, 0)) as BeginningBalance
    FROM KHO k
    LEFT JOIN (
      SELECT 
        pn.MaPhuTung,
        SUM(pn.SoLuong) as TotalImported
      FROM PHIEUNHAPVTPT pn
      WHERE date(pn.ThoiDiem) BETWEEN date(?) AND date(?)
      GROUP BY pn.MaPhuTung
    ) imports ON k.MaPhuTung = imports.MaPhuTung
    LEFT JOIN (
      SELECT 
        ct.MaPhuTung,
        SUM(ct.SoLuong) as TotalUsed
      FROM CHITIETPHIEUSUACHUA ct
      JOIN PHIEUSUACHUA p ON ct.MaPhieuSuaChua = p.MaPhieuSuaChua
      WHERE date(p.NgaySua) BETWEEN date(?) AND date(?)
        AND ct.MaPhuTung IS NOT NULL
      GROUP BY ct.MaPhuTung
    ) usage ON k.MaPhuTung = usage.MaPhuTung
    ORDER BY k.TenVatTuPhuTung
  `),
  
  // Settings queries
  getSettings: db.prepare(`
    SELECT MaThamSo, GiaTri 
    FROM THAMSO 
    WHERE MaThamSo IN ('Q_MAX_VEHICLE_PER_DAY', 'Q_NUM_BRANDS', 'Q_MAX_PARTS', 'Q_MAX_LABORS')
  `),
  createOrUpdateSetting: db.prepare(`
    INSERT OR REPLACE INTO THAMSO (MaThamSo, TenThamSo, GiaTri, GhiChu) 
    VALUES (?, ?, ?, ?)
  `),
  
  // Validation queries for settings enforcement
  countVehiclesToday: db.prepare(`
    SELECT COUNT(*) as count 
    FROM XE 
    WHERE date(NgayTiepNhan) = date('now', 'localtime')
  `),
  countBrands: db.prepare(`
    SELECT COUNT(DISTINCT MaHX) as count FROM HIEUXE
  `),
  countParts: db.prepare(`
    SELECT COUNT(*) as count FROM KHO
  `),
  countServices: db.prepare(`
    SELECT COUNT(*) as count FROM TIENCONG
  `),
  getBrandByName: db.prepare(`
    SELECT * FROM HIEUXE WHERE TenHieuXe = ?
  `),
  createBrand: db.prepare(`
    INSERT INTO HIEUXE (TenHieuXe) VALUES (?)
  `),
};

export default db;