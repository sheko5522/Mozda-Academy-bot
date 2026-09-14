@echo off
title UzChat Server
cd /d "%~dp0"
echo.
echo ========================================
echo   UzChat Server ishga tushmoqda...
echo ========================================
echo.
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
node server.js
pause
