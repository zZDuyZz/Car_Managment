import { executeQuery } from './utils/database.js';
import getDatabase from './config/db.js';

async function cleanupAdminAccounts() {
  try {
    console.log('🧹 Cleaning up duplicate admin accounts...');
    
    // Wait for database to be ready
    await getDatabase();
    
    // Get all admin accounts
    const adminAccounts = await executeQuery(
      'SELECT * FROM TAIKHOAN WHERE QuyenHan = ?', 
      ['ADMIN']
    );
    
    console.log('📋 Found admin accounts:');
    adminAccounts.forEach(acc => {
      console.log(`   - ID: ${acc.MaTaiKhoan}, Username: ${acc.TenDangNhap}`);
    });
    
    // Delete the old 'admin' account, keep 'admin@gmail.com'
    const deleteResult = await executeQuery(
      'DELETE FROM TAIKHOAN WHERE TenDangNhap = ? AND QuyenHan = ?',
      ['admin', 'ADMIN']
    );
    
    if (deleteResult.changes > 0) {
      console.log('✅ Deleted old admin account');
    } else {
      console.log('ℹ️ No old admin account found to delete');
    }
    
    // Verify remaining accounts
    const remainingAdmins = await executeQuery(
      'SELECT * FROM TAIKHOAN WHERE QuyenHan = ?', 
      ['ADMIN']
    );
    
    console.log('📋 Remaining admin accounts:');
    remainingAdmins.forEach(acc => {
      console.log(`   - ID: ${acc.MaTaiKhoan}, Username: ${acc.TenDangNhap}`);
    });
    
    console.log('🎯 Cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    process.exit(0);
  }
}

cleanupAdminAccounts();