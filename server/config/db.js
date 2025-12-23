import mysql from 'mysql2/promise';
import 'dotenv/config';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'QLGaraOto',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  multipleStatements: false // Security: prevent multiple statements
};

const pool = mysql.createPool(dbConfig);

// Connection retry logic
let retryCount = 0;
const maxRetries = 5;
const retryDelay = 2000; // 2 seconds

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Test query
    await connection.execute('SELECT 1 as test');
    
    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    console.log(`👤 User: ${dbConfig.user}`);
    
    connection.release();
    retryCount = 0; // Reset retry count on success
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed (attempt ${retryCount + 1}/${maxRetries}):`, error.message);
    
    if (retryCount < maxRetries - 1) {
      retryCount++;
      console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`);
      setTimeout(testConnection, retryDelay);
    } else {
      console.error('💥 Max retries reached. Please check your database configuration:');
      console.error('1. Ensure MySQL server is running');
      console.error('2. Verify database credentials in .env file');
      console.error('3. Check if database exists');
      console.error('4. Verify network connectivity');
    }
    return false;
  }
};

// Initial connection test
testConnection();

// Handle pool errors
pool.on('connection', (connection) => {
  console.log('🔗 New database connection established');
});

pool.on('error', (err) => {
  console.error('💥 Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Attempting to reconnect...');
    testConnection();
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Closing database connections...');
  await pool.end();
});

export default pool;

// Export helper function for testing connection
export { testConnection };
