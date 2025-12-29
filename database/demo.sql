-- =====================================================
-- DEMO DATA FOR PRESENTATION
-- Dữ liệu demo để trình bày với giảng viên
-- =====================================================

-- Thêm khách hàng demo
INSERT OR REPLACE INTO KHACHHANG (MaKH, TenKH, DienThoai, DiaChi, TienNo) VALUES 
(1, 'Nguyễn Văn A', '0912345678', '123 Lê Lợi, Q1, HCM', 150000),
(2, 'Trần Thị B', '0987654321', '456 Nguyễn Huệ, Q1, HCM', 0),
(3, 'Lê Văn C', '0909123456', '789 Điện Biên Phủ, Q3, HCM', 300000),
(4, 'Phạm Thị D', '0938765432', '321 Lý Tự Trọng, Q1, HCM', 0);

-- Thêm xe demo
INSERT OR REPLACE INTO XE (BienSo, MaHX, MaKH, NgayTiepNhan, TrangThai) VALUES 
('51A-12345', 1, 1, '2025-12-26 08:00:00', 1),
('59B-67890', 2, 2, '2025-12-26 09:30:00', 1),
('60C-11111', 3, 3, '2025-12-26 10:15:00', 1),
('61D-22222', 4, 4, '2025-12-26 11:00:00', 1);

-- Thêm dịch vụ demo
INSERT OR REPLACE INTO TIENCONG (MaTC, TenTienCong, ChiPhi) VALUES 
(1, 'Thay dầu máy', 150000),
(2, 'Kiểm tra phanh', 100000),
(3, 'Thay lọc gió', 80000),
(4, 'Cân bằng lốp', 120000),
(5, 'Thay nhớt hộp số', 200000);

-- Thêm phụ tùng demo
INSERT OR REPLACE INTO KHO (MaPhuTung, TenVatTuPhuTung, SoLuong, DonGia) VALUES 
(1, 'Dầu máy Shell', 20, 200000),
(2, 'Má phanh Toyota', 15, 350000),
(3, 'Lọc gió Honda', 25, 150000),
(4, 'Lốp Michelin 185/65R15', 12, 1200000),
(5, 'Nhớt hộp số Castrol', 18, 250000);

-- Tạo phiếu sửa chữa demo (đã hoàn thành)
INSERT OR REPLACE INTO PHIEUSUACHUA (MaPhieuSuaChua, BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) VALUES 
(1, '51A-12345', 1, 150000, 400000, 550000, '2025-12-26 08:30:00'),
(2, '60C-11111', 3, 280000, 500000, 780000, '2025-12-26 10:45:00');

-- Chi tiết phiếu sửa chữa 1 (Nguyễn Văn A)
INSERT OR REPLACE INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) VALUES 
(1, 1, NULL, 1, NULL),  -- Thay dầu máy
(1, NULL, 1, 2, 200000); -- 2 chai dầu máy

-- Chi tiết phiếu sửa chữa 2 (Lê Văn C)
INSERT OR REPLACE INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) VALUES 
(2, 2, NULL, 1, NULL),  -- Kiểm tra phanh
(2, 3, NULL, 1, NULL),  -- Thay lọc gió
(2, 4, NULL, 1, NULL),  -- Cân bằng lốp
(2, NULL, 2, 1, 350000), -- 1 bộ má phanh
(2, NULL, 3, 1, 150000); -- 1 lọc gió

-- Tạo một số phiếu thu tiền demo
INSERT OR REPLACE INTO PHIEUTHUTIEN (MaPhieuThuTien, MaKH, TienThu, GhiChu, NgayThuTien) VALUES 
(1, 1, 400000, 'Thanh toán một phần phiếu sửa chữa #1', '2025-12-26 12:00:00'),
(2, 3, 480000, 'Thanh toán một phần phiếu sửa chữa #2', '2025-12-26 13:30:00');

-- =====================================================
-- THÊM DỮ LIỆU DEMO CHO THÁNG 10 VÀ 11
-- =====================================================

-- Thêm xe demo cho tháng 10-11
INSERT OR REPLACE INTO XE (BienSo, MaHX, MaKH, NgayTiepNhan, TrangThai) VALUES 
('50A-99999', 5, 2, '2025-10-15 08:00:00', 1),
('51B-88888', 6, 4, '2025-10-20 09:30:00', 1),
('52C-77777', 7, 1, '2025-11-05 10:15:00', 1),
('53D-66666', 8, 3, '2025-11-18 11:00:00', 1);

-- Phiếu sửa chữa tháng 10
INSERT OR REPLACE INTO PHIEUSUACHUA (MaPhieuSuaChua, BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) VALUES 
(10, '50A-99999', 2, 200000, 250000, 450000, '2025-10-15 14:30:00'),
(11, '51B-88888', 4, 320000, 1200000, 1520000, '2025-10-20 16:45:00');

-- Chi tiết phiếu sửa chữa tháng 10
INSERT OR REPLACE INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) VALUES 
-- Phiếu 10: Thay nhớt hộp số
(10, 5, NULL, 1, NULL),  -- Thay nhớt hộp số
(10, NULL, 5, 1, 250000), -- 1 chai nhớt hộp số
-- Phiếu 11: Thay lốp và cân bằng
(11, 4, NULL, 1, NULL),  -- Cân bằng lốp
(11, 2, NULL, 1, NULL),  -- Kiểm tra phanh
(11, 1, NULL, 1, NULL),  -- Thay dầu máy
(11, NULL, 4, 1, 1200000); -- 1 lốp Michelin

-- Phiếu sửa chữa tháng 11
INSERT OR REPLACE INTO PHIEUSUACHUA (MaPhieuSuaChua, BienSo, MaKH, TienCong, TienPhuTung, TongTien, NgaySua) VALUES 
(12, '52C-77777', 1, 150000, 200000, 350000, '2025-11-05 09:20:00'),
(13, '53D-66666', 3, 380000, 700000, 1080000, '2025-11-18 15:10:00');

-- Chi tiết phiếu sửa chữa tháng 11
INSERT OR REPLACE INTO CHITIETPHIEUSUACHUA (MaPhieuSuaChua, MaTC, MaPhuTung, SoLuong, DonGiaPhuTung) VALUES 
-- Phiếu 12: Thay dầu máy đơn giản
(12, 1, NULL, 1, NULL),  -- Thay dầu máy
(12, NULL, 1, 1, 200000), -- 1 chai dầu máy
-- Phiếu 13: Sửa chữa tổng hợp
(13, 2, NULL, 1, NULL),  -- Kiểm tra phanh
(13, 3, NULL, 1, NULL),  -- Thay lọc gió
(13, 5, NULL, 1, NULL),  -- Thay nhớt hộp số
(13, NULL, 2, 2, 350000), -- 2 bộ má phanh
(13, NULL, 3, 1, 150000); -- 1 lọc gió

-- Phiếu thu tiền tháng 10
INSERT OR REPLACE INTO PHIEUTHUTIEN (MaPhieuThuTien, MaKH, TienThu, GhiChu, NgayThuTien) VALUES 
(10, 2, 450000, 'Thanh toán đầy đủ phiếu sửa chữa #10', '2025-10-15 17:00:00'),
(11, 4, 1000000, 'Thanh toán một phần phiếu sửa chữa #11', '2025-10-21 10:30:00');

-- Phiếu thu tiền tháng 11
INSERT OR REPLACE INTO PHIEUTHUTIEN (MaPhieuThuTien, MaKH, TienThu, GhiChu, NgayThuTien) VALUES 
(12, 1, 350000, 'Thanh toán đầy đủ phiếu sửa chữa #12', '2025-11-05 16:45:00'),
(13, 3, 800000, 'Thanh toán một phần phiếu sửa chữa #13', '2025-11-19 14:20:00');

-- Cập nhật tiền nợ thủ công (triggers sẽ tự động tính toán)
-- Khách hàng 1: Nợ 550000 - Thu 400000 = 150000
-- Khách hàng 3: Nợ 780000 - Thu 480000 = 300000
UPDATE KHACHHANG SET TienNo = 150000 WHERE MaKH = 1;
UPDATE KHACHHANG SET TienNo = 300000 WHERE MaKH = 3;