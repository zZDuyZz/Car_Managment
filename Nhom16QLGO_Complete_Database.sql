-- =====================================================
-- GARAGE MANAGEMENT SYSTEM - COMPLETE DATABASE DUMP
-- Generated: 15:02:23 26/12/2025
-- Team: Nhom16QLGO
-- =====================================================

-- =====================================================
-- TABLE SCHEMAS
-- =====================================================

-- Table: THAMSO
CREATE TABLE THAMSO (
  MaThamSo TEXT PRIMARY KEY,
  TenThamSo TEXT NOT NULL,
  GiaTri INTEGER NOT NULL,
  GhiChu TEXT
);

-- Table: HIEUXE
CREATE TABLE HIEUXE (
  MaHX INTEGER PRIMARY KEY AUTOINCREMENT,
  TenHieuXe TEXT NOT NULL UNIQUE
);

-- Table: KHACHHANG
CREATE TABLE KHACHHANG (
  MaKH INTEGER PRIMARY KEY AUTOINCREMENT,
  TenKH TEXT NOT NULL,
  DienThoai TEXT,
  DiaChi TEXT,
  TienNo REAL DEFAULT 0 CHECK (TienNo >= 0)
);

-- Table: XE
CREATE TABLE XE (
  BienSo TEXT PRIMARY KEY,
  MaHX INTEGER NOT NULL,
  MaKH INTEGER NOT NULL,
  NgayTiepNhan TEXT,
  TrangThai INTEGER DEFAULT 1,
  FOREIGN KEY (MaHX) REFERENCES HIEUXE(MaHX),
  FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

-- Table: TIENCONG
CREATE TABLE TIENCONG (
  MaTC INTEGER PRIMARY KEY AUTOINCREMENT,
  TenTienCong TEXT NOT NULL,
  ChiPhi REAL NOT NULL
);

-- Table: KHO
CREATE TABLE KHO (
  MaPhuTung INTEGER PRIMARY KEY AUTOINCREMENT,
  TenVatTuPhuTung TEXT NOT NULL,
  SoLuong INTEGER NOT NULL DEFAULT 0,
  DonGia REAL NOT NULL DEFAULT 0
);

-- Table: PHIEUNHAPVTPT
CREATE TABLE PHIEUNHAPVTPT (
  MaPNVTPT INTEGER PRIMARY KEY AUTOINCREMENT,
  MaPhuTung INTEGER NOT NULL,
  SoLuong INTEGER NOT NULL,
  ThoiDiem TEXT DEFAULT CURRENT_TIMESTAMP,
  GhiChu TEXT,
  FOREIGN KEY (MaPhuTung) REFERENCES KHO(MaPhuTung)
);

-- Table: PHIEUSUACHUA
CREATE TABLE PHIEUSUACHUA (
  MaPhieuSuaChua INTEGER PRIMARY KEY AUTOINCREMENT,
  BienSo TEXT NOT NULL,
  MaKH INTEGER NOT NULL,
  TienCong REAL DEFAULT 0,
  TienPhuTung REAL DEFAULT 0,
  TongTien REAL,
  NgaySua TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (BienSo) REFERENCES XE(BienSo),
  FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

-- Table: CHITIETPHIEUSUACHUA
CREATE TABLE CHITIETPHIEUSUACHUA (
  MaPhieuSuaChua INTEGER NOT NULL,
  MaTC INTEGER,
  MaPhuTung INTEGER,
  SoLuong INTEGER DEFAULT 1,
  DonGiaPhuTung REAL,
  PRIMARY KEY (MaPhieuSuaChua, MaTC, MaPhuTung),
  FOREIGN KEY (MaPhieuSuaChua) REFERENCES PHIEUSUACHUA(MaPhieuSuaChua) ON DELETE CASCADE,
  FOREIGN KEY (MaTC) REFERENCES TIENCONG(MaTC),
  FOREIGN KEY (MaPhuTung) REFERENCES KHO(MaPhuTung)
);

-- Table: PHIEUTHUTIEN
CREATE TABLE PHIEUTHUTIEN (
  MaPhieuThuTien INTEGER PRIMARY KEY AUTOINCREMENT,
  MaKH INTEGER NOT NULL,
  TienThu REAL NOT NULL CHECK (TienThu >= 0),
  NgayThuTien TEXT DEFAULT CURRENT_TIMESTAMP,
  GhiChu TEXT,
  FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

-- Table: BAOCAOTON
CREATE TABLE BAOCAOTON (
  MaBCT INTEGER PRIMARY KEY AUTOINCREMENT,
  ThoiDiemBaoCao TEXT NOT NULL,
  GhiChu TEXT
);

-- Table: CT_BAOCAOTON
CREATE TABLE CT_BAOCAOTON (
  MaBCT INTEGER NOT NULL,
  MaPhuTung INTEGER NOT NULL,
  TonDau INTEGER DEFAULT 0,
  PhatSinh INTEGER DEFAULT 0,
  TonCuoi INTEGER DEFAULT 0,
  PRIMARY KEY (MaBCT, MaPhuTung),
  FOREIGN KEY (MaBCT) REFERENCES BAOCAOTON(MaBCT) ON DELETE CASCADE,
  FOREIGN KEY (MaPhuTung) REFERENCES KHO(MaPhuTung)
);

-- Table: TAIKHOAN
CREATE TABLE TAIKHOAN (
  MaTK INTEGER PRIMARY KEY AUTOINCREMENT,
  TenChuTaiKhoan TEXT,
  TenDangNhap TEXT NOT NULL UNIQUE,
  MatKhau TEXT NOT NULL,
  QuyenHan TEXT DEFAULT 'staff'
);

-- =====================================================
-- TABLE DATA
-- =====================================================

-- Data for table: THAMSO
INSERT INTO THAMSO (MaThamSo, TenThamSo, GiaTri, GhiChu) VALUES ('Q_MAX_VEHICLE_PER_DAY', 'Số xe sửa tối đa trong ngày', 30, 'Mặc định');
INSERT INTO THAMSO (MaThamSo, TenThamSo, GiaTri, GhiChu) VALUES ('Q_NUM_BRANDS', 'Số lượng hiệu xe', 10, 'Tham khảo');

-- Data for table: HIEUXE
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (1, 'Toyota');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (2, 'Honda');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (3, 'Suzuki');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (4, 'Ford');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (5, 'Kia');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (6, 'Hyundai');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (7, 'Mazda');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (8, 'Mitsubishi');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (9, 'Isuzu');
INSERT INTO HIEUXE (MaHX, TenHieuXe) VALUES (10, 'Nissan');

-- Data for table: KHACHHANG
INSERT INTO KHACHHANG (MaKH, TenKH, DienThoai, DiaChi, TienNo) VALUES (1, 'Nguyễn Văn A', '0912345678', '123 Lê Lợi, Q1, HCM', 150000);

-- Data for table: XE
INSERT INTO XE (BienSo, MaHX, MaKH, NgayTiepNhan, TrangThai) VALUES ('51A-12345', 1, 1, '2024-01-15', 1);

-- Data for table: TIENCONG
INSERT INTO TIENCONG (MaTC, TenTienCong, ChiPhi) VALUES (1, 'Thay dầu máy', 150000);

-- Data for table: KHO
INSERT INTO KHO (MaPhuTung, TenVatTuPhuTung, SoLuong, DonGia) VALUES (1, 'Dầu máy Shell', 8, 200000);

-- Data for table: PHIEUSUACHUA
INSERT INTO PHIEUSUACHUA (MaPhieuSuaChua, BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) VALUES (1, '51A-12345', 1, 150000, 400000, 550000, '2025-12-26 08:00:12');

-- Data for table: CHITIETPHIEUSUACHUA
INSERT INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) VALUES (1, 1, NULL, NULL, NULL);
INSERT INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) VALUES (1, NULL, 1, 2, 200000);

-- Data for table: TAIKHOAN
INSERT INTO TAIKHOAN (MaTK, TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan) VALUES (1, 'Quản trị viên', 'admin', 'admin123', 'admin');

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: update_phieu_sua_chua_total_insert
CREATE TRIGGER update_phieu_sua_chua_total_insert
AFTER INSERT ON CHITIETPHIEUSUACHUA
BEGIN
    -- Tính tổng tiền phụ tùng
    UPDATE PHIEUSUACHUA 
    SET TienPhuTung = (
        SELECT COALESCE(SUM(SoLuong * DonGiaPhuTung), 0)
        FROM CHITIETPHIEUSUACHUA 
        WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua
    )
    WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua;
    
    -- Tính tổng tiền công
    UPDATE PHIEUSUACHUA 
    SET TienCong = (
        SELECT COALESCE(SUM(tc.ChiPhi), 0)
        FROM CHITIETPHIEUSUACHUA ct
        JOIN TIENCONG tc ON ct.MaTC = tc.MaTC
        WHERE ct.MaPhieuSuaChua = NEW.MaPhieuSuaChua
    )
    WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua;
    
    -- Cập nhật tổng tiền
    UPDATE PHIEUSUACHUA 
    SET TongTien = COALESCE(TienCong, 0) + COALESCE(TienPhuTung, 0)
    WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua;
END;

-- Trigger: update_phieu_sua_chua_total_update
CREATE TRIGGER update_phieu_sua_chua_total_update
AFTER UPDATE ON CHITIETPHIEUSUACHUA
BEGIN
    -- Tính tổng tiền phụ tùng
    UPDATE PHIEUSUACHUA 
    SET TienPhuTung = (
        SELECT COALESCE(SUM(SoLuong * DonGiaPhuTung), 0)
        FROM CHITIETPHIEUSUACHUA 
        WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua
    )
    WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua;
    
    -- Tính tổng tiền công
    UPDATE PHIEUSUACHUA 
    SET TienCong = (
        SELECT COALESCE(SUM(tc.ChiPhi), 0)
        FROM CHITIETPHIEUSUACHUA ct
        JOIN TIENCONG tc ON ct.MaTC = tc.MaTC
        WHERE ct.MaPhieuSuaChua = NEW.MaPhieuSuaChua
    )
    WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua;
    
    -- Cập nhật tổng tiền
    UPDATE PHIEUSUACHUA 
    SET TongTien = COALESCE(TienCong, 0) + COALESCE(TienPhuTung, 0)
    WHERE MaPhieuSuaChua = NEW.MaPhieuSuaChua;
END;

-- Trigger: update_phieu_sua_chua_total_delete
CREATE TRIGGER update_phieu_sua_chua_total_delete
AFTER DELETE ON CHITIETPHIEUSUACHUA
BEGIN
    -- Tính tổng tiền phụ tùng
    UPDATE PHIEUSUACHUA 
    SET TienPhuTung = (
        SELECT COALESCE(SUM(SoLuong * DonGiaPhuTung), 0)
        FROM CHITIETPHIEUSUACHUA 
        WHERE MaPhieuSuaChua = OLD.MaPhieuSuaChua
    )
    WHERE MaPhieuSuaChua = OLD.MaPhieuSuaChua;
    
    -- Tính tổng tiền công
    UPDATE PHIEUSUACHUA 
    SET TienCong = (
        SELECT COALESCE(SUM(tc.ChiPhi), 0)
        FROM CHITIETPHIEUSUACHUA ct
        JOIN TIENCONG tc ON ct.MaTC = tc.MaTC
        WHERE ct.MaPhieuSuaChua = OLD.MaPhieuSuaChua
    )
    WHERE MaPhieuSuaChua = OLD.MaPhieuSuaChua;
    
    -- Cập nhật tổng tiền
    UPDATE PHIEUSUACHUA 
    SET TongTien = COALESCE(TienCong, 0) + COALESCE(TienPhuTung, 0)
    WHERE MaPhieuSuaChua = OLD.MaPhieuSuaChua;
END;

-- Trigger: update_kho_on_repair_insert
CREATE TRIGGER update_kho_on_repair_insert
AFTER INSERT ON CHITIETPHIEUSUACHUA
WHEN NEW.MaPhuTung IS NOT NULL AND NEW.SoLuong > 0
BEGIN
    UPDATE KHO 
    SET SoLuong = SoLuong - NEW.SoLuong
    WHERE MaPhuTung = NEW.MaPhuTung;
    
    -- Đảm bảo số lượng không âm (có thể cảnh báo thay vì set = 0)
    UPDATE KHO 
    SET SoLuong = 0 
    WHERE MaPhuTung = NEW.MaPhuTung AND SoLuong < 0;
END;

-- Trigger: restore_kho_on_repair_delete
CREATE TRIGGER restore_kho_on_repair_delete
AFTER DELETE ON CHITIETPHIEUSUACHUA
WHEN OLD.MaPhuTung IS NOT NULL AND OLD.SoLuong > 0
BEGIN
    UPDATE KHO 
    SET SoLuong = SoLuong + OLD.SoLuong
    WHERE MaPhuTung = OLD.MaPhuTung;
END;

-- Trigger: update_kho_on_repair_update
CREATE TRIGGER update_kho_on_repair_update
AFTER UPDATE ON CHITIETPHIEUSUACHUA
WHEN NEW.MaPhuTung IS NOT NULL AND (NEW.SoLuong != OLD.SoLuong)
BEGIN
    -- Hoàn trả số lượng cũ
    UPDATE KHO 
    SET SoLuong = SoLuong + OLD.SoLuong
    WHERE MaPhuTung = OLD.MaPhuTung;
    
    -- Trừ số lượng mới
    UPDATE KHO 
    SET SoLuong = SoLuong - NEW.SoLuong
    WHERE MaPhuTung = NEW.MaPhuTung;
    
    -- Đảm bảo số lượng không âm
    UPDATE KHO 
    SET SoLuong = 0 
    WHERE MaPhuTung = NEW.MaPhuTung AND SoLuong < 0;
END;

-- Trigger: update_kho_on_import
CREATE TRIGGER update_kho_on_import
AFTER INSERT ON PHIEUNHAPVTPT
WHEN NEW.SoLuong > 0
BEGIN
    UPDATE KHO 
    SET SoLuong = SoLuong + NEW.SoLuong
    WHERE MaPhuTung = NEW.MaPhuTung;
END;

-- Trigger: update_debt_on_repair_complete
CREATE TRIGGER update_debt_on_repair_complete
AFTER UPDATE ON PHIEUSUACHUA
WHEN NEW.TongTien IS NOT NULL AND NEW.TongTien > 0 
     AND (OLD.TongTien IS NULL OR OLD.TongTien = 0)
BEGIN
    UPDATE KHACHHANG 
    SET TienNo = COALESCE(TienNo, 0) + NEW.TongTien
    WHERE MaKH = NEW.MaKH;
END;

-- Trigger: update_debt_on_payment
CREATE TRIGGER update_debt_on_payment
AFTER INSERT ON PHIEUTHUTIEN
WHEN NEW.TienThu > 0
BEGIN
    UPDATE KHACHHANG 
    SET TienNo = COALESCE(TienNo, 0) - NEW.TienThu
    WHERE MaKH = NEW.MaKH;
    
    -- Đảm bảo tiền nợ không âm
    UPDATE KHACHHANG 
    SET TienNo = 0 
    WHERE MaKH = NEW.MaKH AND TienNo < 0;
END;

-- Trigger: update_debt_on_payment_update
CREATE TRIGGER update_debt_on_payment_update
AFTER UPDATE ON PHIEUTHUTIEN
WHEN NEW.TienThu != OLD.TienThu
BEGIN
    -- Hoàn trả số tiền cũ
    UPDATE KHACHHANG 
    SET TienNo = COALESCE(TienNo, 0) + OLD.TienThu
    WHERE MaKH = NEW.MaKH;
    
    -- Trừ số tiền mới
    UPDATE KHACHHANG 
    SET TienNo = COALESCE(TienNo, 0) - NEW.TienThu
    WHERE MaKH = NEW.MaKH;
    
    -- Đảm bảo tiền nợ không âm
    UPDATE KHACHHANG 
    SET TienNo = 0 
    WHERE MaKH = NEW.MaKH AND TienNo < 0;
END;

-- Trigger: check_kho_availability
CREATE TRIGGER check_kho_availability
BEFORE INSERT ON CHITIETPHIEUSUACHUA
WHEN NEW.MaPhuTung IS NOT NULL AND NEW.SoLuong > 0
BEGIN
    SELECT CASE 
        WHEN (SELECT SoLuong FROM KHO WHERE MaPhuTung = NEW.MaPhuTung) < NEW.SoLuong 
        THEN RAISE(ABORT, 'Không đủ số lượng phụ tùng trong kho')
    END;
END;

-- Trigger: check_kho_availability_update
CREATE TRIGGER check_kho_availability_update
BEFORE UPDATE ON CHITIETPHIEUSUACHUA
WHEN NEW.MaPhuTung IS NOT NULL AND NEW.SoLuong > 0
BEGIN
    SELECT CASE 
        WHEN (SELECT SoLuong FROM KHO WHERE MaPhuTung = NEW.MaPhuTung) + OLD.SoLuong < NEW.SoLuong 
        THEN RAISE(ABORT, 'Không đủ số lượng phụ tùng trong kho')
    END;
END;

-- Trigger: set_ngay_sua_auto
CREATE TRIGGER set_ngay_sua_auto
BEFORE INSERT ON PHIEUSUACHUA
WHEN NEW.NgaySua IS NULL
BEGIN
    UPDATE PHIEUSUACHUA SET NgaySua = datetime('now', 'localtime') WHERE rowid = NEW.rowid;
END;

-- Trigger: set_thoi_diem_nhap_auto
CREATE TRIGGER set_thoi_diem_nhap_auto
BEFORE INSERT ON PHIEUNHAPVTPT
WHEN NEW.ThoiDiem IS NULL
BEGIN
    UPDATE PHIEUNHAPVTPT SET ThoiDiem = datetime('now', 'localtime') WHERE rowid = NEW.rowid;
END;

-- Trigger: set_ngay_thu_tien_auto
CREATE TRIGGER set_ngay_thu_tien_auto
BEFORE INSERT ON PHIEUTHUTIEN
WHEN NEW.NgayThuTien IS NULL
BEGIN
    UPDATE PHIEUTHUTIEN SET NgayThuTien = datetime('now', 'localtime') WHERE rowid = NEW.rowid;
END;

-- Trigger: create_baocao_detail
CREATE TRIGGER create_baocao_detail
AFTER INSERT ON BAOCAOTON
BEGIN
    INSERT INTO CT_BAOCAOTON (MaBCT, MaPhuTung, TonDau, PhatSinh, TonCuoi)
    SELECT 
        NEW.MaBCT,
        MaPhuTung,
        SoLuong as TonDau,
        0 as PhatSinh,
        SoLuong as TonCuoi
    FROM KHO;
END;

-- =====================================================
-- END OF DATABASE DUMP
-- =====================================================
