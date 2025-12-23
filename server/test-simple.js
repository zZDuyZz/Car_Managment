import mysql from 'mysql2/promise';

console.log('🔍 Testing MySQL connection with hardcoded values...');

// Test different password combinations
const passwords = ['', 'root', 'root1234', 'password', 'admin'];

async function testPasswords() {
  for (const password of passwords) {
    try {
      console.log(`\n🔑 Testing password: "${password || 'EMPTY'}"`);
      
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        port: 3306
      });
      
      console.log('✅ Connection successful!');
      
      // Test query
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('✅ Test query successful');
      
      // Check databases
      const [databases] = await connection.execute('SHOW DATABASES');
      const dbNames = databases.map(db => db.Database);
      console.log('📊 Available databases:', dbNames);
      
      // Check if our database exists
      if (dbNames.includes('QLGaraOto')) {
        console.log('✅ QLGaraOto database found!');
        
        // Connect to our database
        await connection.changeUser({ database: 'QLGaraOto' });
        
        // Check tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Tables in QLGaraOto:', tables.map(t => Object.values(t)[0]));
      } else {
        console.log('⚠️ QLGaraOto database not found');
      }
      
      await connection.end();
      console.log(`🎯 SUCCESS! Use password: "${password}"`);
      break;
      
    } catch (error) {
      console.log(`❌ Failed with password "${password || 'EMPTY'}": ${error.message}`);
    }
  }
}

testPasswords();