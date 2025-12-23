# Implementation Plan: Simplified Backend

## Overview

Tạo backend API đơn giản với Express.js để kết nối frontend React với MySQL database. Ưu tiên các chức năng cốt lõi trước, sau đó mở rộng dần.

## Tasks

- [x] 1. Setup Backend Infrastructure
  - Tạo cấu trúc thư mục server
  - Cài đặt dependencies cần thiết
  - Cấu hình Express.js server cơ bản
  - _Requirements: 1.1, 1.2, 1.4_

- [-] 2. Database Connection & Basic Setup
  - [x] 2.1 Cấu hình database connection pool
    - Sử dụng lại config/db.js hiện có
    - Thêm error handling và retry logic
    - _Requirements: 8.1, 8.4_

  - [ ]* 2.2 Write property test for database connection
    - **Property 19: Database Connection Resilience**
    - **Validates: Requirements 8.4**

  - [ ] 2.3 Tạo database helper functions
    - Implement executeQuery, findById, insertRecord, updateRecord
    - Thêm transaction support
    - _Requirements: 8.2, 8.3_

- [ ] 3. Authentication System (Ưu tiên cao)
  - [ ] 3.1 Implement JWT authentication middleware
    - Tạo middleware/auth.js
    - Generate và verify JWT tokens
    - Extract user role từ token
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ]* 3.2 Write property tests for authentication
    - **Property 2: JWT Token Verification**
    - **Property 4: User Role Extraction**
    - **Validates: Requirements 2.2, 2.4**

  - [ ] 3.3 Create login endpoint
    - POST /api/auth/login
    - Verify credentials với TAIKHOAN table
    - Return JWT token và user info
    - _Requirements: 2.1, 2.3_

  - [ ]* 3.4 Write unit tests for login functionality
    - Test valid/invalid credentials
    - Test error responses
    - _Requirements: 2.1, 2.3_

- [ ] 4. Fix Account Management (Giải quyết vấn đề hiện tại)
  - [ ] 4.1 Create accounts API endpoints
    - GET /api/accounts (list accounts)
    - POST /api/accounts (create account)
    - PUT /api/accounts/:id (update account)
    - DELETE /api/accounts/:id (delete account - admin only)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 4.2 Write property tests for account management
    - **Property 3: Role-Based Authorization**
    - **Property 6: Customer CRUD Operations**
    - **Validates: Requirements 2.5, 3.2, 3.3, 3.4**

  - [ ] 4.3 Update frontend to use real API
    - Thay thế localStorage bằng API calls
    - Update login logic để check database
    - Handle JWT token storage
    - _Requirements: 2.1, 3.1_

- [ ] 5. Checkpoint - Test Authentication Flow
  - Ensure admin can create staff accounts
  - Ensure staff can login with created accounts
  - Ensure role-based access works
  - Ask user if questions arise

- [ ] 6. Customer Management API
  - [ ] 6.1 Create customer endpoints
    - GET /api/customers (with search & pagination)
    - POST /api/customers (create customer)
    - PUT /api/customers/:id (update customer)
    - DELETE /api/customers/:id (admin only)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 6.2 Write property tests for customer management
    - **Property 5: Customer Data Validation**
    - **Property 6: Customer CRUD Operations**
    - **Validates: Requirements 3.2, 3.3, 3.5**

  - [ ] 6.3 Update frontend customer component
    - Replace mock data với API calls
    - Add proper error handling
    - _Requirements: 3.1, 3.5_

- [ ] 7. Vehicle Management API
  - [ ] 7.1 Create vehicle endpoints
    - GET /api/vehicles (with customer info join)
    - POST /api/vehicles (register vehicle)
    - PUT /api/vehicles/:bienso (update status)
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [ ]* 7.2 Write property tests for vehicle management
    - **Property 7: Vehicle Creation with Referential Integrity**
    - **Property 8: Vehicle Data Management**
    - **Property 9: License Plate Format Validation**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**

  - [ ] 7.3 Update frontend vehicle component
    - Connect to real API
    - Add vehicle brand (HIEUXE) dropdown
    - _Requirements: 4.1, 4.2_

- [ ] 8. Basic Inventory Management
  - [ ] 8.1 Create inventory endpoints
    - GET /api/inventory (with low stock warnings)
    - POST /api/inventory (add parts - admin only)
    - PUT /api/inventory/:id (update parts)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 8.2 Write property tests for inventory
    - **Property 13: Inventory Stock Management**
    - **Property 14: Inventory CRUD Operations**
    - **Property 15: Low Stock Warning System**
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**

- [ ] 9. Error Handling & Validation
  - [ ] 9.1 Implement global error handler
    - Create middleware/errorHandler.js
    - Standardize error responses
    - Add request logging
    - _Requirements: 7.1, 7.2, 7.3, 1.5_

  - [ ]* 9.2 Write property tests for error handling
    - **Property 1: JSON Response Format Consistency**
    - **Property 16: Error Status Code Consistency**
    - **Validates: Requirements 1.3, 7.1, 7.2, 7.3, 7.5**

  - [ ] 9.3 Add input validation middleware
    - Use express-validator
    - Validate all input data
    - _Requirements: 3.5, 7.1_

- [ ] 10. Repair Management (Advanced)
  - [ ] 10.1 Create repair endpoints
    - GET /api/repairs (with details)
    - POST /api/repairs (create repair ticket)
    - PUT /api/repairs/:id (update repair)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 10.2 Write property tests for repairs
    - **Property 10: Repair Cost Calculation**
    - **Property 11: Inventory Update on Parts Usage**
    - **Property 12: Repair Ticket Management**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**

- [ ] 11. Security & Performance
  - [ ] 11.1 Add security middleware
    - CORS configuration
    - Helmet for security headers
    - Rate limiting
    - _Requirements: 1.4, 8.3_

  - [ ]* 11.2 Write property tests for security
    - **Property 17: Database Transaction Atomicity**
    - **Property 18: SQL Injection Prevention**
    - **Validates: Requirements 8.2, 8.3**

- [ ] 12. Final Integration & Testing
  - [ ] 12.1 Integration testing
    - Test complete user flows
    - Test admin → staff account creation → login
    - Test all CRUD operations
    - _Requirements: All_

  - [ ] 12.2 Performance optimization
    - Add database indexes
    - Optimize queries
    - Add caching where needed
    - _Requirements: 8.1_

- [ ] 13. Final checkpoint - Complete system test
  - Ensure all features work end-to-end
  - Verify staff accounts created by admin work
  - Test all role-based permissions
  - Ask user if questions arise

## Priority Recommendations

### 🚀 **Bắt đầu ngay (Giải quyết vấn đề hiện tại):**
1. **Task 1-3**: Setup backend + Authentication (Giải quyết vấn đề staff không đăng nhập được)
2. **Task 4**: Fix Account Management (Kết nối admin tạo account với login)

### 📈 **Tiếp theo:**
3. **Task 6**: Customer Management (Chức năng đã có UI)
4. **Task 7**: Vehicle Management (Chức năng đã có UI)

### 🔧 **Sau đó:**
5. **Task 8-9**: Inventory + Error Handling
6. **Task 10-12**: Advanced features

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Focus on fixing the current authentication issue first