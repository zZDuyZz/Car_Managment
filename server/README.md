# Backend API Server

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
- Đảm bảo MySQL đang chạy
- Import file `QLGaraOto.sql` vào MySQL
- Cập nhật thông tin database trong `.env`

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run server:dev

# Production mode
npm run server
```

### 4. Test API
- Health check: http://localhost:3001/api/health
- API Base URL: http://localhost:3001/api

## 📁 Project Structure

```
server/
├── app.js              # Main Express app
├── server.js           # Server startup
├── config/
│   └── db.js          # Database connection
├── middleware/
│   ├── auth.js        # Authentication (coming soon)
│   ├── errorHandler.js # Error handling
│   └── logger.js      # Request logging
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── accounts.js    # Account management
│   ├── customers.js   # Customer management
│   ├── vehicles.js    # Vehicle management
│   └── inventory.js   # Inventory management
└── utils/
    ├── database.js    # Database helpers
    └── response.js    # Response formatting
```

## 🔧 Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=QLGaraOto

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Frontend
FRONTEND_URL=http://localhost:5173
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Account Management
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Customer Management
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Vehicle Management
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Register vehicle
- `PUT /api/vehicles/:bienso` - Update vehicle

### Inventory Management
- `GET /api/inventory` - List inventory
- `POST /api/inventory` - Add inventory
- `PUT /api/inventory/:id` - Update inventory

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test with browser
# Visit: http://localhost:3001/api/health
```

## 🔄 Development Workflow

1. **Frontend**: `npm run dev` (port 5173)
2. **Backend**: `npm run server:dev` (port 3001)
3. Frontend sẽ gọi API tại `http://localhost:3001/api`

## ⚠️ Current Status

- ✅ Server infrastructure setup
- ✅ Database connection
- ✅ Error handling
- ✅ Request logging
- 🚧 Authentication (Task 3)
- 🚧 Account management (Task 4)
- 🚧 Other APIs (Tasks 6-10)