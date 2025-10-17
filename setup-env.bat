@echo off
REM Environment Setup Script for Jobcy Application
REM Run this script from the project root directory

echo =====================================
echo   Jobcy Environment Setup Script
echo =====================================
echo.

REM Create Backend .env file
echo [1/2] Creating backend .env file...
(
echo # MongoDB Connection
echo MONGO_URI=mongodb://localhost:27017/jobcy_db
echo.
echo # JWT Secret Key ^(Change this in production!^)
echo JWT_SECRET=your_jwt_secret_key_here_change_this_in_production_12345
echo.
echo # Server Port
echo PORT=5000
echo.
echo # Node Environment
echo NODE_ENV=development
echo.
echo # Frontend URL ^(for CORS^)
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Socket.IO Settings
echo SOCKET_IO_PORT=5000
) > jobcy-backend-main\.env

if exist jobcy-backend-main\.env (
    echo [OK] Backend .env file created successfully
) else (
    echo [ERROR] Failed to create backend .env file
    pause
    exit /b 1
)

echo.

REM Create Frontend .env.local file
echo [2/2] Creating frontend .env.local file...
(
echo # Backend API URL
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api
echo.
echo # Backend Socket.IO URL ^(without /api path^)
echo NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
echo.
echo # Node Environment
echo NODE_ENV=development
) > jobcy-frontend-main\.env.local

if exist jobcy-frontend-main\.env.local (
    echo [OK] Frontend .env.local file created successfully
) else (
    echo [ERROR] Failed to create frontend .env.local file
    pause
    exit /b 1
)

echo.
echo =====================================
echo   Environment Setup Complete!
echo =====================================
echo.
echo Next Steps:
echo 1. Start MongoDB (if not running)
echo 2. Start Backend: cd jobcy-backend-main ^&^& npm run dev
echo 3. Start Frontend: cd jobcy-frontend-main ^&^& npm run dev
echo 4. Open browser: http://localhost:3000
echo.
echo =====================================
echo.
pause

