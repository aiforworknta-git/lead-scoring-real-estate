@echo off
chcp 65001 >nul
title Executive AI Digest - Telegram Automation
echo ======================================================================
echo   EXECUTIVE AI & INDUSTRY DIGEST (TELEGRAM DISPATCHER)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1] Kiem tra moi truong Python...
"C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe" --version >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_EXE=C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo [2] Dang thu thap 5 tin tuc (Bia, Dien May, Hot Girl AI) va gui...
"%PYTHON_EXE%" send_executive_digest.py

echo.
echo ======================================================================
pause
