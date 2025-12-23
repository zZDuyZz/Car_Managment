/* ===============================
   GARAGE MANAGEMENT SYSTEM - SQLite VERSION
   Hệ thống quản lý garage ô tô
================================ */

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

/* ===============================
   1. TAIKHOAN (Accounts)
   Quản lý tài khoản admin và staff
================================ */
CREATE TABLE IF NOT EXISTS TAIKHOAN (
    MaTaiKhoan INTEGER PRIMARY KEY AUTOINCREMENT,
    TenChuTaiKhoan TEXT NOT NULL,
    TenDangNhap TEXT UNIQUE NOT NULL,
    MatKhau TEXT NOT NULL,
    QuyenHan TEXT NOT NULL CHECK (QuyenHan IN ('ADMIN', 'STAFF')),
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    TrangThai TEXT DEFAULT 'ACTIVE' CHECK (TrangThai IN ('ACTIVE', 'INACTIVE'))
);

/* ===============================
   2. KHACHHANG (Customers)
   Thông tin khách hàng
================================ */
CREATE TABLE IF NOT EXISTS KHACHHANG (
    MaKhachHang INTEGER PRIMARY KEY AUTOINCREMENT,
    TenKhachHang TEXT NOT NULL,
    SoDienThoai TEXT,
    DiaChi TEXT,
    Email TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* ===============================
   3. XE (Vehicles)
   Thông tin xe của khách hàng
================================ */
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
);

/* ===============================
   4. PHIEUSUA (Repair Orders)
   Phiếu sửa chữa xe
================================ */
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
);

/* ===============================
   5. CHITIETPHIEUSUA (Repair Details)
   Chi tiết công việc sửa chữa
================================ */
CREATE TABLE IF NOT EXISTS CHITIETPHIEUSUA (
    MaChiTiet INTEGER PRIMARY KEY AUTOINCREMENT,
    MaPhieuSua INTEGER NOT NULL,
    NoiDungSua TEXT NOT NULL,
    ChiPhiSua DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (MaPhieuSua) REFERENCES PHIEUSUA(MaPhieuSua)
);

/* ===============================
   6. HIEUXE (Car Models)
   Danh sách hiệu xe
================================ */
CREATE TABLE IF NOT EXISTS HIEUXE (
    MaHX INTEGER PRIMARY KEY AUTOINCREMENT,
    TenHieuXe TEXT NOT NULL
);

/* ===============================
   7. TIENCONG (Labor Costs)
   Bảng giá tiền công
================================ */
CREATE TABLE IF NOT EXISTS TIENCONG (
    MaTC INTEGER PRIMARY KEY AUTOINCREMENT,
    TenTienCong TEXT NOT NULL,
    ChiPhi DECIMAL(10,2) NOT NULL
);

/* ===============================
   8. KHO (Inventory)
   Kho phụ tùng
================================ */
CREATE TABLE IF NOT EXISTS KHO (
    MaPhuTung INTEGER PRIMARY KEY AUTOINCREMENT,
    TenVatTuPhuTung TEXT NOT NULL,
    SoLuong INTEGER NOT NULL CHECK (SoLuong >= 0),
    DonGia DECIMAL(10,2) NOT NULL
);

/* ===============================
   9. THAMSO (System Parameters)
   Các tham số hệ thống
================================ */
CREATE TABLE IF NOT EXISTS THAMSO (
    MaThamSo TEXT PRIMARY KEY,
    TenThamSo TEXT,
    GiaTri INTEGER NOT NULL
);

/* ===============================
   DỮ LIỆU MẶC ĐỊNH
================================ */

-- Tài khoản Admin mặc định với email
INSERT OR REPLACE INTO TAIKHOAN (TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan)
VALUES ('Administrator', 'admin@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');
-- Password hash for 'admin123'

-- Tham số hệ thống
INSERT OR REPLACE INTO THAMSO VALUES
('SO_XE_NGAY', 'Số xe sửa tối đa trong ngày', 30),
('SO_HIEU_XE', 'Số hiệu xe tối đa', 10),
('SO_PHU_TUNG', 'Số loại phụ tùng tối đa', 200),
('SO_TIEN_CONG', 'Số loại tiền công tối đa', 100);

-- Dữ liệu mẫu hiệu xe
INSERT OR REPLACE INTO HIEUXE (TenHieuXe) VALUES
('Toyota'),
('Honda'),
('Mazda'),
('Hyundai'),
('Kia'),
('Ford'),
('Chevrolet'),
('Nissan'),
('Mitsubishi'),
('Suzuki');

-- Dữ liệu mẫu tiền công
INSERT OR REPLACE INTO TIENCONG (TenTienCong, ChiPhi) VALUES
('Thay dầu máy', 150000),
('Kiểm tra phanh', 200000),
('Thay lốp xe', 100000),
('Sửa chữa động cơ', 500000),
('Bảo dưỡng định kỳ', 300000),
('Thay ắc quy', 80000),
('Sửa hệ thống điện', 250000),
('Thay dây curoa', 120000),
('Kiểm tra hệ thống làm mát', 180000),
('Thay bộ lọc gió', 60000);

-- Dữ liệu mẫu phụ tùng
INSERT OR REPLACE INTO KHO (TenVatTuPhuTung, SoLuong, DonGia) VALUES
('Dầu máy 5W-30', 50, 180000),
('Lốp xe 185/65R15', 20, 1200000),
('Ắc quy 12V 60Ah', 15, 1500000),
('Bộ lọc gió', 30, 150000),
('Dây curoa', 25, 200000),
('Má phanh trước', 40, 300000),
('Má phanh sau', 35, 250000),
('Nước làm mát', 60, 80000),
('Bugi', 100, 50000),
('Dầu phanh', 45, 120000);

/* ===============================
   THÔNG TIN ĐĂNG NHẬP
================================ */
-- Tài khoản Admin:
-- Email: admin@gmail.com
-- Password: admin123

/* ===============================
   GHI CHÚ
================================ */
-- File này tương thích với SQLite
-- Sử dụng cho hệ thống quản lý garage ô tô
-- Tạo ngày: 23/12/2024
-- Phiên bản: 1.0