import pool, { testConnection } from './config/db.js';
import { executeQuery, findAll, countRecords } from './utils/database.js';

async function testDatabaseSetup() {
  console.log('🧪 Testing database setup...\n');
  
  try {
    // Test 1: Connection
    console.log('1️⃣ Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Test 2: Check if tables exist
    console.log('\n2️⃣ Checking database tables...');
    const tables = await executeQuery('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    console.log('📋 Found tables:', tableNames);
    
    const requiredTables = ['TAIKHOAN', 'KHACHHANG', 'XE', 'HIEUXE', 'KHO', 'TIENCONG'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables);
      console.log('💡 Please import QLGaraOto.sql file');
    } else {
      console.log('✅ All required tables found');
    }
    
    // Test 3: Check sample data
    console.log('\n3️⃣ Checking sample data...');
    
    // Check TAIKHOAN table
    const accountCount = await countRecords('TAIKHOAN');
    console.log(`👥 TAIKHOAN records: ${accountCount}`);
    
    if (accountCount > 0) {
      const accounts = await findAll('TAIKHOAN', {}, 'MaTK', 3);
      console.log('📄 Sample accounts:');
      accounts.forEach(acc => {
        console.log(`   - ${acc.TenDangNhap} (${acc.QuyenHan})`);
      });
    }
    
    // Check THAMSO table
    const paramCount = await countRecords('THAMSO');
    console.log(`⚙️  THAMSO records: ${paramCount}`);
    
    // Test 4: Test database helpers
    console.log('\n4️⃣ Testing database helper functions...');
    
    // Test executeQuery
    const testQuery = await executeQuery('SELECT COUNT(*) as total FROM TAIKHOAN');
    console.log('✅ executeQuery works:', testQuery[0].total, 'accounts');
    
    // Test findAll
    const allAccounts = await findAll('TAIKHOAN', {}, 'MaTK', 2);
    console.log('✅ findAll works:', allAccounts.length, 'accounts returned');
    
    console.log('\n🎉 Database setup test completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Database setup test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testDatabaseSetup();