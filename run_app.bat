@echo off
echo Starting Healthcare Document Automation System...

:: Ensure frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

:: Ensure root dependencies are installed
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)

:: Start the application (Frontend Dev + Backend Node)
echo.
echo Starting Application...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8001
echo.

:: We run both in parallel for development
start cmd /k "npm run dev"
start cmd /k "npm run backend"

echo.
echo Please wait for the windows to initialize.
echo.
pause
