import getDatabase, { initDatabase } from './config/db.js';

async function testSQLite() {
  try {
    console.log('🔍 Testing SQLite connection...');
    
    // Initialize database
    await initDatabase();
    
    // Get database instance
    const db = await getDatabase();
    
    // Test query
    const result = await db.get('SELECT 1 as test');
    console.log('✅ Test query successful:', result);
    
    // Check tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Available tables:', tables.map(t => t.name));
    
    console.log('🎯 SQLite is working perfectly!');
    
  } catch (error) {
    console.error('❌ SQLite test failed:', error.message);
  }
}

testSQLite();