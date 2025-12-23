# Hướng dẫn cài đặt SQLite cho Garage Management System

## Bước 1: Mở Command Prompt từ thư mục home
1. Nhấn Windows + R
2. Gõ `cmd` và nhấn Enter
3. Chạy lệnh: `cd Documents\GitHub\Car_Managment`

## Bước 2: Cài đặt SQLite packages
```bash
npm install sqlite3 sqlite
```

## Bước 3: Test SQLite connection
```bash
npm run test:sqlite
```

## Bước 4: Setup admin account
```bash
npm run setup:admin
```

## Bước 5: Chạy ứng dụng
```bash
npm start
```

## Thông tin đăng nhập Admin
- **Username:** admin
- **Password:** admin123

## Lưu ý
- SQLite database sẽ được tạo tự động tại: `server/database/qlgaraoto.db`
- Không cần cài đặt MySQL server nữa
- Database sẽ được tạo các bảng tự động khi chạy lần đầu

## Nếu gặp lỗi
1. Đảm bảo bạn đang ở đúng thư mục dự án
2. Chạy `npm --version` để kiểm tra npm có hoạt động không
3. Nếu npm không hoạt động, restart Command Prompt và thử lại