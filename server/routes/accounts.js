import express from 'express';
import bcrypt from 'bcryptjs';
import { executeQuery, countRecords } from '../utils/database.js';
import { successResponse, errorResponse, paginationInfo } from '../utils/response.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all accounts (admin only)
router.get('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT MaTK, TenDangNhap, TenChuTaiKhoan, QuyenHan, 
             DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') as createdAt
      FROM TAIKHOAN
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM TAIKHOAN';
    const params = [];
    
    // Add search filter
    if (search) {
      const searchCondition = ' WHERE TenDangNhap LIKE ? OR TenChuTaiKhoan LIKE ?';
      query += searchCondition;
      countQuery += searchCondition;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Add pagination
    query += ' ORDER BY MaTK DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Execute queries
    const [accounts, totalResult] = await Promise.all([
      executeQuery(query, params),
      executeQuery(countQuery, search ? [`%${search}%`, `%${search}%`] : [])
    ]);
    
    const total = totalResult[0].total;
    
    // Format response
    const formattedAccounts = accounts.map(acc => ({
      id: acc.MaTK,
      username: acc.TenDangNhap,
      fullName: acc.TenChuTaiKhoan,
      role: acc.QuyenHan.toLowerCase(),
      status: 'active', // Default status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    res.json(successResponse(
      formattedAccounts,
      'Lấy danh sách tài khoản thành công',
      paginationInfo(page, limit, total)
    ));
    
  } catch (error) {
    next(error);
  }
});

// Create new account (admin only)
router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { username, password, fullName, role = 'staff' } = req.body;
    
    // Validate input
    if (!username || !password || !fullName) {
      throw new ValidationError('Vui lòng điền đầy đủ thông tin');
    }
    
    if (password.length < 6) {
      throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    // Check if username exists
    const existingUser = await executeQuery(
      'SELECT MaTK FROM TAIKHOAN WHERE TenDangNhap = ?',
      [username]
    );
    
    if (existingUser.length > 0) {
      throw new ValidationError('Tên đăng nhập đã tồn tại');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new account
    const result = await executeQuery(
      'INSERT INTO TAIKHOAN (TenDangNhap, MatKhau, TenChuTaiKhoan, QuyenHan) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, fullName, role.toUpperCase()]
    );
    
    // Return created account (without password)
    const newAccount = {
      id: result.insertId,
      username,
      fullName,
      role: role.toLowerCase(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json(successResponse(newAccount, 'Tạo tài khoản thành công'));
    
  } catch (error) {
    next(error);
  }
});

// Update account (admin only)
router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, fullName, role, status } = req.body;
    
    // Check if account exists
    const existingAccount = await executeQuery(
      'SELECT * FROM TAIKHOAN WHERE MaTK = ?',
      [id]
    );
    
    if (existingAccount.length === 0) {
      throw new NotFoundError('Không tìm thấy tài khoản');
    }
    
    const updates = [];
    const params = [];
    
    // Update password if provided
    if (password) {
      if (password.length < 6) {
        throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('MatKhau = ?');
      params.push(hashedPassword);
    }
    
    // Update other fields
    if (fullName) {
      updates.push('TenChuTaiKhoan = ?');
      params.push(fullName);
    }
    
    if (role) {
      updates.push('QuyenHan = ?');
      params.push(role.toUpperCase());
    }
    
    if (updates.length === 0) {
      throw new ValidationError('Không có thông tin nào để cập nhật');
    }
    
    // Execute update
    params.push(id);
    await executeQuery(
      `UPDATE TAIKHOAN SET ${updates.join(', ')} WHERE MaTK = ?`,
      params
    );
    
    // Return updated account
    const updatedAccount = await executeQuery(
      'SELECT MaTK, TenDangNhap, TenChuTaiKhoan, QuyenHan FROM TAIKHOAN WHERE MaTK = ?',
      [id]
    );
    
    const account = updatedAccount[0];
    const formattedAccount = {
      id: account.MaTK,
      username: account.TenDangNhap,
      fullName: account.TenChuTaiKhoan,
      role: account.QuyenHan.toLowerCase(),
      status: status || 'active',
      updatedAt: new Date().toISOString()
    };
    
    res.json(successResponse(formattedAccount, 'Cập nhật tài khoản thành công'));
    
  } catch (error) {
    next(error);
  }
});

// Delete account (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if account exists
    const existingAccount = await executeQuery(
      'SELECT * FROM TAIKHOAN WHERE MaTK = ?',
      [id]
    );
    
    if (existingAccount.length === 0) {
      throw new NotFoundError('Không tìm thấy tài khoản');
    }
    
    // Prevent deleting admin account
    if (existingAccount[0].QuyenHan === 'ADMIN') {
      throw new ValidationError('Không thể xóa tài khoản admin');
    }
    
    // Delete account
    await executeQuery('DELETE FROM TAIKHOAN WHERE MaTK = ?', [id]);
    
    res.json(successResponse(null, 'Xóa tài khoản thành công'));
    
  } catch (error) {
    next(error);
  }
});

export default router;