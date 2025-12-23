import bcrypt from 'bcryptjs';
import { executeQuery } from './utils/database.js';
import pool from './config/db.js';

async function setupAdminAccount() {
  try {
    console.log('🔧 Setting up admin account...');
    
    // Hash the default admin password
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // Check if admin account exists
    const existingAdmin = await executeQuery(
      'SELECT * FROM TAIKHOAN WHERE TenDangNhap = ?', 
      ['admin']
    );
    
    if (existingAdmin.length > 0) {
      // Update existing admin password
      await executeQuery(
        'UPDATE TAIKHOAN SET MatKhau = ? WHERE TenDangNhap = ?',
        [hashedPassword, 'admin']
      );
      console.log('✅ Updated existing admin account password');
    } else {
      // Create new admin account
      await executeQuery(
        'INSERT INTO TAIKHOAN (TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan) VALUES (?, ?, ?, ?)',
        ['Administrator', 'admin', hashedPassword, 'ADMIN']
      );
      console.log('✅ Created new admin account');
    }
    
    console.log('📋 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('🎯 You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error setting up admin account:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setupAdminAccount();