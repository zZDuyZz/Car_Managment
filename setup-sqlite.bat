@echo off
echo 🚀 Setting up SQLite for Garage Management System...
echo.

cd /d "C:\Users\Duy Tran\Documents\GitHub\Car_Managment"

echo 📦 Installing SQLite dependencies...
npm install sqlite3 sqlite

echo.
echo 🔧 Testing SQLite connection...
node server/test-sqlite.js

echo.
echo 👤 Setting up admin account...
node server/setup-admin.js

echo.
echo ✅ Setup complete! You can now run: npm start
pause