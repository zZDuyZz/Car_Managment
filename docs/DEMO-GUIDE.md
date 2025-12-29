# 🎯 HƯỚNG DẪN DEMO CHO GIẢNG VIÊN

## 📋 Chuẩn Bị Demo

### 1. Khởi động hệ thống
```bash
# Terminal 1: Chạy cả frontend và backend
npm run dev:full

# Hoặc chạy riêng lẻ:
# Terminal 1: Backend
cd api && node server.js

# Terminal 2: Frontend  
npm run dev
```

### 2. Đăng nhập hệ thống
- **URL**: http://localhost:5173
- **Admin**: `admin` / `admin123`
- **Staff**: Tạo tài khoản staff từ trang Admin > Accounts

---

## 🎬 FLOW DEMO CHO GIẢNG VIÊN

### **BƯỚC 1: Xem Tình Trạng Ban Đầu**

#### 📊 **Trang Customers** (Quản lý khách hàng)
- Vào menu **"Khách hàng"**
- Xem danh sách khách hàng và **cột "Tiền nợ"**:
  - **Nguyễn Văn A**: 150,000 đ (màu đỏ - có nợ)
  - **Trần Thị B**: 0 đ (màu xanh - không nợ)  
  - **Lê Văn C**: 300,000 đ (màu đỏ - có nợ)
  - **Phạm Thị D**: 0 đ (màu xanh - không nợ)

#### 💰 **Trang Invoices** (Hóa đơn & Thanh toán)
- Vào menu **"Hóa đơn và thanh toán"**
- **Cột trái**: Danh sách phiếu sửa chữa đã hoàn thành
- **Cột phải**: Danh sách phiếu thu tiền đã tạo

---

### **BƯỚC 2: Tạo Phiếu Sửa Chữa Mới**

#### 🚗 **Trang Vehicles** (Tiếp nhận xe)
1. Vào menu **"Tiếp nhận xe"**
2. Click **"Thêm phiếu sửa chữa"**
3. Nhập thông tin:
   - **Biển số**: `59B-67890` (xe của Trần Thị B)
   - **Khách hàng**: Chọn "Trần Thị B"
4. **Thêm dịch vụ**:
   - Chọn "Thay dầu máy" (150,000 đ)
   - Chọn "Kiểm tra phanh" (100,000 đ)
5. **Thêm phụ tùng**:
   - "Dầu máy Shell" x2 (200,000 đ/chai)
6. **Tổng tiền tự động**: 650,000 đ
7. Click **"Lưu phiếu sửa chữa"**

#### ✅ **Kết quả tự động**:
- Hệ thống tự động cộng 650,000 đ vào nợ của Trần Thị B
- Trừ phụ tùng trong kho (Dầu máy: 20 → 18 chai)

---

### **BƯỚC 3: Kiểm Tra Cập Nhật Tự Động**

#### 📊 **Quay lại trang Customers**
- **Trần Thị B**: Tiền nợ từ 0 đ → **650,000 đ** (màu đỏ)
- Trigger database đã tự động cập nhật!

#### 💰 **Quay lại trang Invoices**
- **Cột trái**: Xuất hiện phiếu sửa chữa mới của Trần Thị B
- Hiển thị đầy đủ thông tin: biển số, khách hàng, tổng tiền

---

### **BƯỚC 4: Thu Tiền Khách Hàng**

#### 💳 **Tạo phiếu thu tiền**
1. Ở trang **Invoices**, cột trái
2. Tìm phiếu sửa chữa của Trần Thị B
3. Click nút **"Thu tiền"** (màu xanh)
4. Modal hiện ra với:
   - Thông tin khách hàng
   - Tổng tiền cần thu: 650,000 đ
5. **Nhập số tiền thu**: `400,000` (thu một phần)
6. **Ghi chú**: "Thanh toán một phần"
7. Click **"Tạo phiếu thu"**

#### ✅ **Kết quả tự động**:
- Hệ thống tự động trừ 400,000 đ từ nợ của Trần Thị B
- Tạo phiếu thu tiền mới

---

### **BƯỚC 5: Kiểm Tra Kết Quả Cuối**

#### 📊 **Trang Customers**
- **Trần Thị B**: Tiền nợ từ 650,000 đ → **250,000 đ**
- Trigger đã tự động tính: 650,000 - 400,000 = 250,000

#### 💰 **Trang Invoices**
- **Cột phải**: Xuất hiện phiếu thu tiền mới
- Hiển thị: Trần Thị B, 400,000 đ, thời gian thu

#### 🖨️ **In hóa đơn**
- Click **"In hóa đơn"** ở phiếu sửa chữa
- Mở cửa sổ in với format đẹp, đầy đủ thông tin

---

## 🎯 ĐIỂM NHẤN DEMO

### ✨ **Tự Động Hóa Hoàn Toàn**
1. **Tính tổng tiền** sửa chữa tự động
2. **Cộng nợ** khi hoàn thành sửa chữa  
3. **Trừ nợ** khi thu tiền
4. **Quản lý kho** tự động trừ phụ tùng
5. **Cập nhật real-time** trên tất cả trang

### 🔧 **Database Triggers**
- **16 triggers** tự động xử lý business logic
- Không cần code phức tạp, database tự quản lý
- Đảm bảo tính nhất quán dữ liệu

### 💻 **Giao Diện Thân Thiện**
- **Responsive design** đẹp mắt
- **Search & filter** mạnh mẽ
- **Modal popup** tiện lợi
- **Format tiền tệ** chuẩn VN

### 🚀 **Kiến Trúc Modern**
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + SQLite
- **API RESTful** chuẩn
- **JWT Authentication**

---

## 📝 **Câu Hỏi Giảng Viên Có Thể Hỏi**

### ❓ **"Tiền nợ được tính như thế nào?"**
**Trả lời**: Hệ thống dùng Database Triggers tự động:
- Khi hoàn thành sửa chữa → Cộng vào nợ
- Khi thu tiền → Trừ khỏi nợ  
- Đảm bảo không bao giờ sai số

### ❓ **"Nếu xóa phiếu thu tiền thì sao?"**
**Trả lời**: Trigger tự động cộng lại tiền vào nợ khách hàng

### ❓ **"Kho hàng được quản lý ra sao?"**
**Trả lời**: Khi sử dụng phụ tùng → Tự động trừ kho
Khi hủy phiếu → Tự động cộng lại kho

### ❓ **"Có thể mở rộng không?"**
**Trả lời**: 
- Dễ dàng thêm tính năng mới
- API RESTful chuẩn
- Database có thể scale
- Frontend component-based

---

## 🎉 **KẾT LUẬN DEMO**

Hệ thống quản lý garage đã hoàn thiện với:
- ✅ **Tự động hóa** hoàn toàn quy trình
- ✅ **Giao diện** đẹp và dễ sử dụng  
- ✅ **Database** thiết kế chuyên nghiệp
- ✅ **Kiến trúc** modern và scalable
- ✅ **Tính năng** đầy đủ cho garage thực tế