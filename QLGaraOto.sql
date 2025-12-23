/* ===============================
   DATABASE
================================ */
CREATE DATABASE IF NOT EXISTS QLGaraOto
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE QLGaraOto;

/* ===============================
   1. HIEUXE
   Quy định số hiệu xe tối đa
================================ */
CREATE TABLE HIEUXE (
    MaHX INT AUTO_INCREMENT PRIMARY KEY,
    TenHieuXe VARCHAR(100) NOT NULL
);

/* ===============================
   2. KHACHHANG
================================ */
CREATE TABLE KHACHHANG (
    MaKH INT AUTO_INCREMENT PRIMARY KEY,
    TenKH VARCHAR(100) NOT NULL,
    DienThoai VARCHAR(20),
    DiaChi VARCHAR(255),
    TienNo INT DEFAULT 0
);

/* ===============================
   3. XE
   Mỗi xe thuộc 1 khách hàng
================================ */
CREATE TABLE XE (
    BienSo VARCHAR(20) PRIMARY KEY,
    MaHX INT NOT NULL,
    MaKH INT NOT NULL,
    NgayTiepNhan DATE NOT NULL,
    TrangThai TINYINT DEFAULT 1, -- 1: đang sửa, 0: hoàn tất
    FOREIGN KEY (MaHX) REFERENCES HIEUXE(MaHX),
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

/* ===============================
   4. TIENCONG
   Quy định số loại tiền công tối đa
================================ */
CREATE TABLE TIENCONG (
    MaTC INT AUTO_INCREMENT PRIMARY KEY,
    TenTienCong VARCHAR(100) NOT NULL,
    ChiPhi INT NOT NULL
);

/* ===============================
   5. KHO (VẬT TƯ PHỤ TÙNG)
   Không cho tồn kho âm
================================ */
CREATE TABLE KHO (
    MaPhuTung INT AUTO_INCREMENT PRIMARY KEY,
    TenVatTuPhuTung VARCHAR(100) NOT NULL,
    SoLuong INT NOT NULL CHECK (SoLuong >= 0),
    DonGia INT NOT NULL
);

/* ===============================
   6. PHIEUSUACHUA
   Trung tâm nghiệp vụ
================================ */
CREATE TABLE PHIEUSUACHUA (
    MaPhieuSuaChua INT AUTO_INCREMENT PRIMARY KEY,
    BienSo VARCHAR(20) NOT NULL,
    MaKH INT NOT NULL,
    TienCong INT NOT NULL,
    TienPhuTung INT NOT NULL,
    TongTien INT NOT NULL,
    FOREIGN KEY (BienSo) REFERENCES XE(BienSo),
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

/* ===============================
   7. CHITIETPHIEUSUACHUA
   Liên kết tiền công + phụ tùng
================================ */
CREATE TABLE CHITIETPHIEUSUACHUA (
    MaPhieuSuaChua INT NOT NULL,
    MaTC INT NOT NULL,
    MaPhuTung INT NOT NULL,
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    PRIMARY KEY (MaPhieuSuaChua, MaTC, MaPhuTung),
    FOREIGN KEY (MaPhieuSuaChua) REFERENCES PHIEUSUACHUA(MaPhieuSuaChua),
    FOREIGN KEY (MaTC) REFERENCES TIENCONG(MaTC),
    FOREIGN KEY (MaPhuTung) REFERENCES KHO(MaPhuTung)
);

/* ===============================
   8. PHIEUTHUTIEN
   Ghi nhận thanh toán
================================ */
CREATE TABLE PHIEUTHUTIEN (
    MaPhieuThuTien INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    TienThu INT NOT NULL,
    NgayThuTien DATE NOT NULL,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

/* ===============================
   9. PHIEUNHAPVTPT
   Nhập kho phụ tùng
================================ */
CREATE TABLE PHIEUNHAPVTPT (
    MaPNVTPT INT AUTO_INCREMENT PRIMARY KEY,
    MaPhuTung INT NOT NULL,
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    ThoiDiem DATETIME NOT NULL,
    FOREIGN KEY (MaPhuTung) REFERENCES KHO(MaPhuTung)
);

/* ===============================
   10. THAMSO
   Các quy định trong tài liệu
================================ */
CREATE TABLE THAMSO (
    MaThamSo VARCHAR(50) PRIMARY KEY,
    TenThamSo VARCHAR(100),
    GiaTri INT NOT NULL
);

/* ===============================
   11. TAIKHOAN
   ADMIN / STAFF
================================ */
CREATE TABLE TAIKHOAN (
    MaTK INT AUTO_INCREMENT PRIMARY KEY,
    TenChuTaiKhoan VARCHAR(100),
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    QuyenHan VARCHAR(20) NOT NULL -- ADMIN / STAFF
);

/* ===============================
   12. BAOCAOTON
   Báo cáo tồn theo tháng
================================ */
CREATE TABLE BAOCAOTON (
    MaBCT INT AUTO_INCREMENT PRIMARY KEY,
    ThoiDiemBaoCao DATE NOT NULL
);

/* ===============================
   13. CT_BAOCAOTON
================================ */
CREATE TABLE CT_BAOCAOTON (
    MaBCT INT NOT NULL,
    MaPhuTung INT NOT NULL,
    TonDau INT NOT NULL,
    PhatSinh INT NOT NULL,
    TonCuoi INT NOT NULL,
    PRIMARY KEY (MaBCT, MaPhuTung),
    FOREIGN KEY (MaBCT) REFERENCES BAOCAOTON(MaBCT),
    FOREIGN KEY (MaPhuTung) REFERENCES KHO(MaPhuTung)
);

/* ===============================
   DỮ LIỆU TỐI THIỂU BẮT BUỘC
================================ */

-- Quy định (theo tài liệu)
INSERT INTO THAMSO VALUES
('SO_XE_NGAY', 'Số xe sửa tối đa trong ngày', 30),
('SO_HIEU_XE', 'Số hiệu xe tối đa', 10),
('SO_PHU_TUNG', 'Số loại phụ tùng tối đa', 200),
('SO_TIEN_CONG', 'Số loại tiền công tối đa', 100);

-- Tài khoản ADMIN mặc định
INSERT INTO TAIKHOAN (TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan)
VALUES ('Admin', 'admin', 'admin123', 'ADMIN');
