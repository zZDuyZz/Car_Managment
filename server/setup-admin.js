import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { executeQuery } from './utils/database.js';
import getDatabase from './config/db.js';

// Load environment variables explicitly
dotenv.config();

async function setupAdminAccount() {
  try {
    console.log('🔧 Setting up admin account...');
    
    // Wait for database to be ready
    await getDatabase();
    
    // Hash the default admin password
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // Check if admin account exists
    const existingAdmin = await executeQuery(
      'SELECT * FROM TAIKHOAN WHERE TenDangNhap = ?', 
      ['admin@gmail.com']
    );
    
    if (existingAdmin.length > 0) {
      // Update existing admin password
      await executeQuery(
        'UPDATE TAIKHOAN SET MatKhau = ? WHERE TenDangNhap = ?',
        [hashedPassword, 'admin@gmail.com']
      );
      console.log('✅ Updated existing admin account password');
    } else {
      // Create new admin account
      await executeQuery(
        'INSERT INTO TAIKHOAN (TenChuTaiKhoan, TenDangNhap, MatKhau, QuyenHan) VALUES (?, ?, ?, ?)',
        ['Administrator', 'admin@gmail.com', hashedPassword, 'ADMIN']
      );
      console.log('✅ Created new admin account');
    }
    
    console.log('📋 Admin credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🎯 You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error setting up admin account:', error.message);
  } finally {
    process.exit(0);
  }
}

setupAdminAccount();