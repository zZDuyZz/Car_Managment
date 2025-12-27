import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all accounts (chỉ admin)
router.get('/', (req, res) => {
  try {
    const accounts = queries.getAllAccounts.all();
    
    // Chỉ lấy 2 tài khoản: admin và staff
    const safeAccounts = accounts
      .filter(acc => ['admin', 'staff'].includes(acc.QuyenHan))
      .filter(acc => ['admin', 'staff'].includes(acc.TenDangNhap)) // Đảm bảo chỉ lấy đúng 2 tài khoản
      .slice(0, 2) // Chỉ lấy 2 tài khoản đầu tiên
      .map(acc => ({
        id: acc.MaTK,
        username: acc.TenDangNhap,
        fullName: acc.TenChuTaiKhoan,
        role: acc.QuyenHan,
        status: acc.TrangThai || 'active',
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

// Change password
router.put('/:id/password', (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters' 
      });
    }

    // Get current account
    const account = queries.getAllAccounts.all().find(acc => acc.MaTK == id);
    if (!account) {
      return res.status(404).json({ 
        error: 'Account not found' 
      });
    }

    // Verify current password
    if (account.MatKhau !== currentPassword) {
      return res.status(400).json({ 
        error: 'Current password is incorrect' 
      });
    }

    // Update password
    const result = queries.updateAccountWithPassword.run(
      account.TenChuTaiKhoan, 
      account.TenDangNhap, 
      newPassword, 
      account.QuyenHan, 
      id
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Failed to update password' 
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      error: 'Failed to change password' 
    });
  }
});

// Toggle account status (lock/unlock) - MUST BE BEFORE /:id route
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Toggle status request:', { id, status }); // Debug log

    // Validation
    if (!['active', 'locked'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status must be active or locked' 
      });
    }

    // Get current account
    const account = queries.getAllAccounts.all().find(acc => acc.MaTK == id);
    if (!account) {
      return res.status(404).json({ 
        error: 'Account not found' 
      });
    }

    console.log('Found account:', account); // Debug log

    // Không cho khóa tài khoản admin
    if (account.QuyenHan === 'admin' && status === 'locked') {
      return res.status(403).json({ 
        error: 'Cannot lock admin account' 
      });
    }

    // Update status using the new query
    const result = queries.updateAccountStatus.run(status, id);
    console.log('Update result:', result); // Debug log
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Failed to update status' 
      });
    }

    res.json({
      success: true,
      message: `Account ${status === 'active' ? 'unlocked' : 'locked'} successfully`
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle account status' 
    });
  }
});

// Create new account (DISABLED - chỉ có 2 tài khoản cố định)
router.post('/', (req, res) => {
  res.status(403).json({ 
    error: 'Account creation is disabled. System only supports 2 fixed accounts: admin and staff.' 
  });
});

// Update account (DISABLED - chỉ cho phép đổi mật khẩu)
router.put('/:id', (req, res) => {
  res.status(403).json({ 
    error: 'Account editing is disabled. Use password change endpoint instead.' 
  });
});

// Delete account (DISABLED - không cho xóa tài khoản hệ thống)
router.delete('/:id', (req, res) => {
  res.status(403).json({ 
    error: 'Account deletion is disabled. System accounts cannot be deleted.' 
  });
});

export default router;