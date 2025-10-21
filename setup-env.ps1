# Environment Setup Script for Jobcy Application
# Run this script from the project root directory

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Jobcy Environment Setup Script   " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$projectRoot = Get-Location

# Create Backend .env file
Write-Host "[1/2] Creating backend .env file..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "jobcy-backend-main"
$backendEnvPath = Join-Path $backendPath ".env"

$backendEnvContent = @"
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/jobcy_db

# JWT Secret Key (Change this in production!)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production_12345

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Socket.IO Settings
SOCKET_IO_PORT=5000
"@

try {
    $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding UTF8 -Force
    Write-Host "✓ Backend .env file created successfully at: $backendEnvPath" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create backend .env file: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Create Frontend .env.local file
Write-Host "[2/2] Creating frontend .env.local file..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "jobcy-frontend-main"
$frontendEnvPath = Join-Path $frontendPath ".env.local"

$frontendEnvContent = @"
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend Socket.IO URL (without /api path)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Node Environment
NODE_ENV=development
"@

try {
    $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding UTF8 -Force
    Write-Host "✓ Frontend .env.local file created successfully at: $frontendEnvPath" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create frontend .env.local file: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Environment Setup Complete! ✓    " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Verify files
Write-Host "Verifying created files..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path $backendEnvPath) {
    Write-Host "Backend .env content:" -ForegroundColor Yellow
    Write-Host "---------------------" -ForegroundColor Gray
    Get-Content $backendEnvPath | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
    Write-Host ""
} else {
    Write-Host "⚠ Backend .env file not found!" -ForegroundColor Red
}

if (Test-Path $frontendEnvPath) {
    Write-Host "Frontend .env.local content:" -ForegroundColor Yellow
    Write-Host "---------------------------" -ForegroundColor Gray
    Get-Content $frontendEnvPath | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
    Write-Host ""
} else {
    Write-Host "⚠ Frontend .env.local file not found!" -ForegroundColor Red
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Next Steps:                       " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start MongoDB (if not running)" -ForegroundColor White
Write-Host "2. Start Backend:" -ForegroundColor White
Write-Host "   cd jobcy-backend-main" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Frontend:" -ForegroundColor White
Write-Host "   cd jobcy-frontend-main" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""




