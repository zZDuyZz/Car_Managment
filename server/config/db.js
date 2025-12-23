import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const dbPath = join(__dirname, '..', 'database', 'qlgaraoto.db');

let db = null;

// Initialize database connection
const initDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ SQLite database connection successful!');
    console.log(`📊 Database file: ${dbPath}`);
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    
    // Create tables if they don't exist
    await createTables();
    
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Create tables based on MySQL schema
const createTables = async () => {
  try {
    // TAIKHOAN table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS TAIKHOAN (
        MaTaiKhoan INTEGER PRIMARY KEY AUTOINCREMENT,
        TenChuTaiKhoan TEXT NOT NULL,
        TenDangNhap TEXT UNIQUE NOT NULL,
        MatKhau TEXT NOT NULL,
        QuyenHan TEXT NOT NULL CHECK (QuyenHan IN ('ADMIN', 'STAFF')),
        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
        TrangThai TEXT DEFAULT 'ACTIVE' CHECK (TrangThai IN ('ACTIVE', 'INACTIVE'))
      )
    `);

    // KHACHHANG table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS KHACHHANG (
        MaKhachHang INTEGER PRIMARY KEY AUTOINCREMENT,
        TenKhachHang TEXT NOT NULL,
        SoDienThoai TEXT,
        DiaChi TEXT,
        Email TEXT,
        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // XE table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS XE (
        MaXe INTEGER PRIMARY KEY AUTOINCREMENT,
        BienSoXe TEXT UNIQUE NOT NULL,
        TenChuXe TEXT NOT NULL,
        LoaiXe TEXT,
        MauXe TEXT,
        NamSanXuat INTEGER,
        MaKhachHang INTEGER,
        NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG(MaKhachHang)
      )
    `);

    // PHIEUSUA table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS PHIEUSUA (
        MaPhieuSua INTEGER PRIMARY KEY AUTOINCREMENT,
        MaXe INTEGER NOT NULL,
        NgayVao DATETIME DEFAULT CURRENT_TIMESTAMP,
        NgayRa DATETIME,
        TongTien DECIMAL(10,2) DEFAULT 0,
        TrangThai TEXT DEFAULT 'DANG_SUA' CHECK (TrangThai IN ('DANG_SUA', 'HOAN_THANH', 'HUY')),
        GhiChu TEXT,
        MaTaiKhoan INTEGER,
        FOREIGN KEY (MaXe) REFERENCES XE(MaXe),
        FOREIGN KEY (MaTaiKhoan) REFERENCES TAIKHOAN(MaTaiKhoan)
      )
    `);

    // CHITIETPHIEUSUA table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS CHITIETPHIEUSUA (
        MaChiTiet INTEGER PRIMARY KEY AUTOINCREMENT,
        MaPhieuSua INTEGER NOT NULL,
        NoiDungSua TEXT NOT NULL,
        ChiPhiSua DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (MaPhieuSua) REFERENCES PHIEUSUA(MaPhieuSua)
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
};

// Get database instance
const getDatabase = async () => {
  if (!db) {
    await initDatabase();
  }
  return db;
};

// Initialize database on import
initDatabase().catch(console.error);

export default getDatabase;
export { initDatabase };
