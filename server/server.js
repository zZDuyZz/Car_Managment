import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3001;

// Test database connection before starting server
async function startServer() {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('Please check your database configuration and try again.');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();