@echo off
REM WhatsApp Clone Quick Start Script for Windows

echo 🚀 WhatsApp Clone - Setup Script
echo ================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js found: %NODE_VERSION%
echo ✅ npm found: %NPM_VERSION%

REM Setup Server
echo.
echo 📦 Setting up Backend Server...
cd server

if not exist "node_modules" (
    echo 📥 Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please update server\.env with your MongoDB URI and secrets
)

cd ..

REM Setup Client
echo.
echo 📦 Setting up Frontend Client...
cd client

if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ Frontend .env created with default values
)

cd ..

REM Summary
echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo 📋 Next Steps:
echo 1. Update MongoDB URI in server\.env
echo 2. Start MongoDB (local or ensure Atlas connection works)
echo 3. Open two Command Prompts or PowerShell windows:
echo.
echo Window 1 - Start Backend Server:
echo   cd server
echo   npm run dev
echo.
echo Window 2 - Start Frontend Client:
echo   cd client
echo   npm start
echo.
echo 🌐 Frontend will open at http://localhost:3000
echo 🔌 Backend API at http://localhost:5000
echo.
echo 📚 Documentation:
echo   - Setup Guide: SETUP.md
echo   - Features: FEATURES.md
echo   - Architecture: ARCHITECTURE.md
echo   - README: README.md
echo.
echo Happy coding! 🎉
echo.
pause
