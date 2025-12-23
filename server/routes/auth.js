import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/auth.js';
import { executeQuery } from '../utils/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { UnauthorizedError } from '../middleware/errorHandler.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json(errorResponse('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'));
    }
    
    // Find user in database
    const query = 'SELECT * FROM TAIKHOAN WHERE TenDangNhap = ? LIMIT 1';
    const users = await executeQuery(query, [username]);
    
    if (users.length === 0) {
      return res.status(401).json(errorResponse('Tên đăng nhập hoặc mật khẩu không chính xác'));
    }
    
    const user = users[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.MatKhau);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Tên đăng nhập hoặc mật khẩu không chính xác'));
    }
    
    // Generate JWT token
    const tokenPayload = {
      id: user.MaTK,
      username: user.TenDangNhap,
      role: user.QuyenHan,
      fullName: user.TenChuTaiKhoan
    };
    
    const token = generateToken(tokenPayload);
    
    // Return success response
    res.json(successResponse({
      token,
      user: {
        id: user.MaTK,
        username: user.TenDangNhap,
        fullName: user.TenChuTaiKhoan,
        role: user.QuyenHan
      }
    }, 'Đăng nhập thành công'));
    
  } catch (error) {
    next(error);
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
  res.json(successResponse(null, 'Đăng xuất thành công'));
});

// Verify token endpoint (for frontend to check if token is still valid)
router.get('/verify', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json(errorResponse('No token provided'));
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    const { verifyToken } = await import('../config/auth.js');
    const decoded = verifyToken(token);
    
    // Get fresh user data
    const query = 'SELECT MaTK, TenDangNhap, TenChuTaiKhoan, QuyenHan FROM TAIKHOAN WHERE MaTK = ? LIMIT 1';
    const users = await executeQuery(query, [decoded.id]);
    
    if (users.length === 0) {
      return res.status(401).json(errorResponse('User not found'));
    }
    
    const user = users[0];
    res.json(successResponse({
      user: {
        id: user.MaTK,
        username: user.TenDangNhap,
        fullName: user.TenChuTaiKhoan,
        role: user.QuyenHan
      }
    }, 'Token valid'));
    
  } catch (error) {
    res.status(401).json(errorResponse('Invalid token'));
  }
});

export default router;