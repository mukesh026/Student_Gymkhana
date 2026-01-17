@echo off
echo ========================================
echo Student Gymkhana - Starting Backend
echo ========================================
echo.

cd /d "%~dp0backend"

echo Checking if Node.js is installed...
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

echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server on port 3300...
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm start

pause
