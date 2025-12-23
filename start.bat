@echo off
echo 🚀 Starting Garage Management System...
echo.
echo 📦 Installing dependencies...
call npm install
echo.
echo 🔧 Starting Frontend + Backend...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend API: http://localhost:3001/api
echo.
call npm start