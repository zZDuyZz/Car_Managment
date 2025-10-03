-- ==============================
-- 0. Xóa và tạo mới database
-- ==============================
DROP DATABASE IF EXISTS gara_db;
CREATE DATABASE gara_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gara_db;

-- ==============================
-- 1. Bảng Users (nhân viên)
-- ==============================
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- mật khẩu (hash sau này)
    fullname VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 2. Bảng Rules (quy định gara)
-- ==============================
CREATE TABLE Rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    max_cars_per_day INT NOT NULL DEFAULT 30,
    max_brands INT NOT NULL DEFAULT 10,
    max_parts INT NOT NULL DEFAULT 200,
    max_labors INT NOT NULL DEFAULT 100,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Rules (max_cars_per_day, max_brands, max_parts, max_labors)
VALUES (30, 10, 200, 100);

-- ==============================
-- 3. Bảng Vehicles (xe và chủ xe)
-- ==============================
CREATE TABLE Vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    brand VARCHAR(50),
    model VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 4. Bảng Receptions (phiếu tiếp nhận xe)
-- ==============================
CREATE TABLE Receptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    received_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    initial_description TEXT,
    status ENUM('Chờ xử lý', 'Đang làm', 'Hoàn thành') DEFAULT 'Chờ xử lý',
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id)
);

-- ==============================
-- 5. Bảng Parts (phụ tùng)
-- ==============================
CREATE TABLE Parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(12,2) NOT NULL DEFAULT 0
);

-- ==============================
-- 6. Bảng LaborCosts (công sửa chữa)
-- ==============================
CREATE TABLE LaborCosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    cost DECIMAL(12,2) NOT NULL
);

-- ==============================
-- 7. Bảng RepairOrders (phiếu sửa chữa)
-- ==============================
CREATE TABLE RepairOrders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reception_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reception_id) REFERENCES Receptions(id)
);

-- ==============================
-- 8. Bảng RepairDetails (chi tiết sửa chữa)
-- ==============================
CREATE TABLE RepairDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_order_id INT NOT NULL,
    part_id INT,
    labor_id INT,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(12,2) DEFAULT 0,
    labor_cost DECIMAL(12,2) DEFAULT 0,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (
        (IFNULL(quantity,0) * IFNULL(unit_price,0)) + IFNULL(labor_cost,0)
    ) STORED,
    FOREIGN KEY (repair_order_id) REFERENCES RepairOrders(id),
    FOREIGN KEY (part_id) REFERENCES Parts(id),
    FOREIGN KEY (labor_id) REFERENCES LaborCosts(id)
);

-- ==============================
-- 9. Bảng Receipts (phiếu thu tiền)
-- ==============================
CREATE TABLE Receipts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reception_id INT NOT NULL,
    payment_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    amount DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (reception_id) REFERENCES Receptions(id)
);

-- ==============================
-- 10. Dữ liệu mẫu
-- ==============================
INSERT INTO Users (username, password, fullname)
VALUES ('admin', '123456', 'Quản trị viên');

INSERT INTO Vehicles (license_plate, owner_name, phone, brand, model)
VALUES ('51A-12345', 'Nguyễn Văn A', '0909123456', 'Toyota', 'Vios'),
       ('59B-67890', 'Trần Thị B', '0912345678', 'Honda', 'Civic');

INSERT INTO Receptions (vehicle_id, initial_description, status)
VALUES (1, 'Xe bị trầy xước nhẹ', 'Chờ xử lý'),
       (2, 'Xe hỏng điều hòa', 'Đang làm');

INSERT INTO Parts (part_name, quantity, price)
VALUES ('Lốp xe', 20, 1500000),
       ('Ắc quy', 15, 2500000),
       ('Đèn pha', 10, 1200000),
       ('Bugi', 50, 200000),
       ('Lọc dầu', 30, 300000);

INSERT INTO LaborCosts (description, cost)
VALUES ('Sơn lại vỏ xe', 2000000),
       ('Thay dầu', 500000),
       ('Thay bugi', 300000),
       ('Cân bằng bánh xe', 700000);

INSERT INTO RepairOrders (reception_id) VALUES (1), (2);

INSERT INTO RepairDetails (repair_order_id, part_id, labor_id, quantity, unit_price, labor_cost)
VALUES (1, 1, 1, 2, 1500000, 2000000),
       (2, 2, 2, 1, 2500000, 500000);

INSERT INTO Receipts (reception_id, amount)
VALUES (1, 1000000);

-- ==============================
-- 11. Trigger kiểm tra trước khi thêm RepairDetails
-- ==============================
DELIMITER $$

CREATE TRIGGER trg_repairdetails_before_insert
BEFORE INSERT ON RepairDetails
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    DECLARE v_price DECIMAL(12,2);
    DECLARE v_cost DECIMAL(12,2);

    IF NEW.part_id IS NOT NULL AND NEW.quantity > 0 THEN
        SELECT quantity, price
        INTO v_stock, v_price
        FROM Parts
        WHERE id = NEW.part_id
        FOR UPDATE;

        IF v_stock IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Phụ tùng không tồn tại';
        END IF;

        IF v_stock < NEW.quantity THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Không đủ tồn kho phụ tùng';
        END IF;

        IF NEW.unit_price IS NULL OR NEW.unit_price = 0 THEN
            SET NEW.unit_price = v_price;
        END IF;
    END IF;

    IF NEW.labor_id IS NOT NULL AND (NEW.labor_cost IS NULL OR NEW.labor_cost = 0) THEN
        SELECT cost INTO v_cost
        FROM LaborCosts
        WHERE id = NEW.labor_id;
        SET NEW.labor_cost = v_cost;
    END IF;
END$$

DELIMITER ;

-- ==============================
-- 12. Trigger trừ tồn kho sau khi thêm RepairDetails
-- ==============================
DELIMITER $$

CREATE TRIGGER trg_repairdetails_after_insert
AFTER INSERT ON RepairDetails
FOR EACH ROW
BEGIN
    IF NEW.part_id IS NOT NULL AND NEW.quantity > 0 THEN
        UPDATE Parts
        SET quantity = quantity - NEW.quantity
        WHERE id = NEW.part_id;
    END IF;
END$$

DELIMITER ;

-- ==============================
-- 13. Trigger hoàn trả tồn kho khi xóa RepairDetails
-- ==============================
DELIMITER $$

CREATE TRIGGER trg_repairdetails_after_delete
AFTER DELETE ON RepairDetails
FOR EACH ROW
BEGIN
    IF OLD.part_id IS NOT NULL AND OLD.quantity > 0 THEN
        UPDATE Parts
        SET quantity = quantity + OLD.quantity
        WHERE id = OLD.part_id;
    END IF;
END$$

DELIMITER ;

-- ==============================
-- 14. Trigger cập nhật tồn kho khi UPDATE RepairDetails
-- ==============================
DELIMITER $$

CREATE TRIGGER trg_repairdetails_after_update
AFTER UPDATE ON RepairDetails
FOR EACH ROW
BEGIN
    IF OLD.part_id IS NOT NULL AND OLD.quantity > 0 THEN
        UPDATE Parts
        SET quantity = quantity + OLD.quantity
        WHERE id = OLD.part_id;
    END IF;

    IF NEW.part_id IS NOT NULL AND NEW.quantity > 0 THEN
        UPDATE Parts
        SET quantity = quantity - NEW.quantity
        WHERE id = NEW.part_id;
    END IF;
END$$

DELIMITER ;

-- ==============================
-- 15. VIEW báo cáo
-- ==============================

-- Doanh thu theo ngày
CREATE OR REPLACE VIEW v_BaoCaoDoanhThu AS
SELECT 
    payment_date AS ngay,
    SUM(amount) AS tong_doanh_thu,
    COUNT(*) AS so_phieu_thu
FROM Receipts
GROUP BY payment_date
ORDER BY payment_date DESC;

-- Báo cáo tồn kho phụ tùng
CREATE OR REPLACE VIEW v_BaoCaoTonKho AS
SELECT 
    id AS part_id,
    part_name,
    quantity AS so_luong_con_lai,
    price AS don_gia,
    (quantity * price) AS tong_gia_tri
FROM Parts
ORDER BY part_name;

-- Chi tiết sửa chữa từng phiếu
CREATE OR REPLACE VIEW v_ChiTietSuaChua AS
SELECT 
    ro.id AS repair_order_id,
    v.license_plate,
    v.owner_name,
    p.part_name,
    rd.quantity,
    rd.unit_price,
    l.description AS cong_sua,
    rd.labor_cost,
    rd.subtotal
FROM RepairOrders ro
JOIN Receptions r ON ro.reception_id = r.id
JOIN Vehicles v ON r.vehicle_id = v.id
LEFT JOIN RepairDetails rd ON ro.id = rd.repair_order_id
LEFT JOIN Parts p ON rd.part_id = p.id
LEFT JOIN LaborCosts l ON rd.labor_id = l.id;
