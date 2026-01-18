@echo off
echo ========================================
echo Student Gymkhana Management System
echo Starting Both Backend and Frontend
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.

REM Get the directory where this batch file is located
set "PROJECT_DIR=%~dp0"

echo Starting Backend Server...
start "Student Gymkhana - Backend" cmd /k "cd /d "%PROJECT_DIR%backend" && (if not exist node_modules\ npm install) && npm start"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Student Gymkhana - Frontend" cmd /k "cd /d "%PROJECT_DIR%frontend" && (if not exist node_modules\ npm install) && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:3300
echo Frontend: http://localhost:3000
echo.
echo Two new windows have opened:
echo   1. Backend Server (Port 3300)
echo   2. Frontend Server (Port 3000)
echo.
echo Your browser will open automatically.
echo.
echo To stop the servers:
echo   - Close both terminal windows
echo   - Or press Ctrl+C in each window
echo.
echo ========================================
echo.
pause
