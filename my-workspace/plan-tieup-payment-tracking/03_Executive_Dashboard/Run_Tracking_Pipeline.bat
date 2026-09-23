@echo off
title HEINEKEN Plan Tie-Up ^& OSR Payment Tracking Pipeline
color 0A

echo ========================================================================
echo   HEINEKEN COMMERCIAL INTELLIGENCE: PLAN TIE-UP ^& PAYMENT TRACKING
echo ========================================================================
echo Running automated extraction, aging calculation, dashboard compiler ^& Telegram alert...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0..\02_Pipeline_Scripts\full_pipeline.ps1"

echo.
echo ========================================================================
echo   Pipeline completed! The dashboard has been opened in your browser.
echo ========================================================================
pause
