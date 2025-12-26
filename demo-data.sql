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

-- Cập nhật tiền nợ thủ công (triggers sẽ tự động tính toán)
-- Khách hàng 1: Nợ 550000 - Thu 400000 = 150000
-- Khách hàng 3: Nợ 780000 - Thu 480000 = 300000
UPDATE KHACHHANG SET TienNo = 150000 WHERE MaKH = 1;
UPDATE KHACHHANG SET TienNo = 300000 WHERE MaKH = 3;