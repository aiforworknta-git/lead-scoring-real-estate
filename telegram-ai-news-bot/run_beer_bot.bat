@echo off
chcp 65001 >nul
title Beer Market Telegram Dispatcher
echo ================================================================
echo   BEER MARKET TELEGRAM DISPATCHER (AUTOMATION BOT)
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

echo [2] Dang cap nhat tin thi truong bia va gui vao Telegram...
"%PYTHON_EXE%" send_beer_news.py

echo.
echo ================================================================
pause
