@echo off
chcp 65001 >nul
title AI News Telegram Dispatcher (OIPO Model)
echo ================================================================
echo   AI NEWS TELEGRAM DISPATCHER (OIPO AUTOMATION BOT)
echo ================================================================
echo.

cd /d "%~dp0"

echo [1] Kiem tra moi truong Python...
"C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe" --version >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_EXE=C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo [2] Dang chay script gui tin...
"%PYTHON_EXE%" send_telegram.py

echo.
echo ================================================================
pause
