import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing MySQL connection...');
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'QLGaraOto',
  port: parseInt(process.env.DB_PORT) || 3306
};

console.log('\n📋 Connection config:');
console.log('Host:', config.host);
console.log('User:', config.user);
console.log('Password:', config.password ? '***' : 'EMPTY');
console.log('Database:', config.database);
console.log('Port:', config.port);

async function testConnection() {
  try {
    console.log('\n🔌 Attempting to connect...');
    const connection = await mysql.createConnection(config);
    
    console.log('✅ Connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test query successful:', rows);
    
    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📊 Available databases:', databases.map(db => db.Database));
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Suggestions:');
      console.log('1. Check if MySQL server is running');
      console.log('2. Verify username and password');
      console.log('3. Try connecting without password first');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 MySQL server is not running or not accessible');
      console.log('1. Start MySQL service');
      console.log('2. Check if port 3306 is correct');
    }
  }
}

testConnection();