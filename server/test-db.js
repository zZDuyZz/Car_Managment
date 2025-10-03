import 'dotenv/config';
import pool from './config/db.js';

async function testConnection() {
  let connection;
  try {
    console.log('🔍 Testing database connection...');
    connection = await pool.getConnection();
    
    // Check database info
    const [dbInfo] = await connection.query('SELECT DATABASE() as db, USER() as user');
    console.log('✅ Connection successful!');
    console.log('📊 Database Info:');
    console.log(`- Database: ${dbInfo[0].db}`);
    console.log(`- User: ${dbInfo[0].user}`);

    // List all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Tables in database:');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.table(tableNames);

    // Show sample data
    if (tableNames.includes('Users')) {
      const [users] = await connection.query('SELECT * FROM Users LIMIT 2');
      console.log('\n👥 Sample user data:');
      console.table(users);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Check if MySQL server is running');
    console.log('2. Verify database credentials in .env file');
    console.log('3. Make sure the database exists');
  } finally {
    if (connection) await connection.release();
    console.log('\n🔌 Closing connection...');
    process.exit();
  }
}

testConnection();
