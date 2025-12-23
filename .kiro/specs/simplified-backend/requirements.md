# Requirements Document

## Introduction

Hệ thống backend đơn giản cho ứng dụng quản lý garage ô tô, cung cấp các API REST endpoints cơ bản để kết nối frontend React với database MySQL hiện có. Backend được thiết kế tối giản, dễ hiểu và dễ bảo trì.

## Glossary

- **API_Server**: Server Express.js cung cấp REST endpoints
- **Database_Connection**: Kết nối MySQL sử dụng pool connection
- **Authentication_Middleware**: Middleware xác thực người dùng
- **CRUD_Operations**: Create, Read, Update, Delete operations
- **Error_Handler**: Middleware xử lý lỗi tập trung
- **Response_Format**: Định dạng phản hồi JSON chuẩn

## Requirements

### Requirement 1: API Server Setup

**User Story:** Là một developer, tôi muốn có một API server đơn giản, để frontend có thể giao tiếp với database.

#### Acceptance Criteria

1. THE API_Server SHALL run on Express.js framework
2. WHEN the server starts, THE API_Server SHALL connect to MySQL database successfully
3. THE API_Server SHALL use JSON for all request and response data
4. THE API_Server SHALL enable CORS for frontend communication
5. THE API_Server SHALL log all incoming requests for debugging

### Requirement 2: Authentication System

**User Story:** Là một user, tôi muốn đăng nhập an toàn, để truy cập vào hệ thống theo đúng quyền hạn.

#### Acceptance Criteria

1. WHEN a user provides valid credentials, THE Authentication_Middleware SHALL return a JWT token
2. THE Authentication_Middleware SHALL verify JWT tokens for protected routes
3. WHEN authentication fails, THE API_Server SHALL return 401 status code
4. THE Authentication_Middleware SHALL extract user role from token
5. THE API_Server SHALL protect admin routes from staff users

### Requirement 3: Customer Management API

**User Story:** Là một staff member, tôi muốn quản lý thông tin khách hàng qua API, để thực hiện các thao tác CRUD.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/customers, THE API_Server SHALL return all customers list
2. WHEN a POST request is made to /api/customers, THE API_Server SHALL create a new customer
3. WHEN a PUT request is made to /api/customers/:id, THE API_Server SHALL update customer information
4. WHEN a DELETE request is made to /api/customers/:id, THE API_Server SHALL remove customer (admin only)
5. THE API_Server SHALL validate customer data before database operations

### Requirement 4: Vehicle Management API

**User Story:** Là một staff member, tôi muốn quản lý thông tin xe qua API, để theo dõi xe của khách hàng.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/vehicles, THE API_Server SHALL return vehicles with customer info
2. WHEN a POST request is made to /api/vehicles, THE API_Server SHALL register a new vehicle
3. WHEN a PUT request is made to /api/vehicles/:bienso, THE API_Server SHALL update vehicle status
4. THE API_Server SHALL validate license plate format before saving
5. THE API_Server SHALL link vehicles to existing customers only

### Requirement 5: Repair Service API

**User Story:** Là một staff member, tôi muốn quản lý phiếu sửa chữa qua API, để theo dõi công việc sửa chữa.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/repairs, THE API_Server SHALL return repair tickets with details
2. WHEN a POST request is made to /api/repairs, THE API_Server SHALL create repair ticket
3. WHEN a PUT request is made to /api/repairs/:id, THE API_Server SHALL update repair status
4. THE API_Server SHALL calculate total cost automatically
5. THE API_Server SHALL update inventory when parts are used

### Requirement 6: Inventory Management API

**User Story:** Là một admin, tôi muốn quản lý kho phụ tùng qua API, để theo dõi tồn kho.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/inventory, THE API_Server SHALL return parts with stock levels
2. WHEN a POST request is made to /api/inventory, THE API_Server SHALL add new parts
3. WHEN a PUT request is made to /api/inventory/:id, THE API_Server SHALL update part information
4. THE API_Server SHALL prevent negative stock levels
5. WHEN stock is low, THE API_Server SHALL include warning in response

### Requirement 7: Error Handling and Validation

**User Story:** Là một developer, tôi muốn có xử lý lỗi nhất quán, để dễ debug và user experience tốt.

#### Acceptance Criteria

1. WHEN validation fails, THE Error_Handler SHALL return 400 with specific error messages
2. WHEN database errors occur, THE Error_Handler SHALL return 500 with generic message
3. WHEN resources not found, THE Error_Handler SHALL return 404 status
4. THE Error_Handler SHALL log all errors for debugging
5. THE Response_Format SHALL be consistent across all endpoints

### Requirement 8: Database Operations

**User Story:** Là một system, tôi muốn thao tác database hiệu quả, để đảm bảo hiệu suất và tính nhất quán.

#### Acceptance Criteria

1. THE Database_Connection SHALL use connection pooling for efficiency
2. WHEN multiple operations are related, THE API_Server SHALL use database transactions
3. THE API_Server SHALL sanitize all SQL inputs to prevent injection
4. WHEN database connection fails, THE API_Server SHALL retry connection
5. THE API_Server SHALL close connections properly to prevent leaks