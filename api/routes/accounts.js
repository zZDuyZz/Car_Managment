import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all accounts (chỉ admin)
router.get('/', (req, res) => {
  try {
    const accounts = queries.getAllAccounts.all();
    
    // Không trả về mật khẩu
    const safeAccounts = accounts.map(acc => ({
      id: acc.MaTK,
      username: acc.TenDangNhap,
      fullName: acc.TenChuTaiKhoan,
      role: acc.QuyenHan,
      createdAt: acc.NgayTao || new Date().toISOString()
    }));

    res.json({
      success: true,
      data: safeAccounts
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch accounts' 
    });
  }
});

// Create new account (chỉ admin)
router.post('/', (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;

    // Validation
    if (!username || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Username, password, and full name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({ 
        error: 'Role must be admin or staff' 
      });
    }

    // Check if username exists
    const existingUser = queries.getUserByUsername.get(username);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    // Create account
    const result = queries.createAccount.run(fullName, username, password, role);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: result.lastInsertRowid,
        username,
        fullName,
        role
      }
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ 
      error: 'Failed to create account' 
    });
  }
});

// Update account
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, fullName, role } = req.body;

    if (!username || !fullName) {
      return res.status(400).json({ 
        error: 'Username and full name are required' 
      });
    }

    if (password && password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Update with or without password
    let result;
    if (password) {
      result = queries.updateAccountWithPassword.run(fullName, username, password, role, id);
    } else {
      result = queries.updateAccount.run(fullName, username, role, id);
    }
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Account not found' 
      });
    }

    res.json({
      success: true,
      message: 'Account updated successfully'
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ 
      error: 'Failed to update account' 
    });
  }
});

// Delete account
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Không cho xóa tài khoản admin chính (id = 1)
    if (id === '1') {
      return res.status(403).json({ 
        error: 'Cannot delete main admin account' 
      });
    }

    const result = queries.deleteAccount.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Account not found' 
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      error: 'Failed to delete account' 
    });
  }
});

export default router;