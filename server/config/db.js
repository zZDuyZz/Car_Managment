import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  charset: 'utf8mb4',
  multipleStatements: true
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('Please check your .env configuration and MySQL server status.');
  });

export default pool;
