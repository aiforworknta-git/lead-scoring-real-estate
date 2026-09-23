@echo off
chcp 65001 > NUL
title Cập Nhật Dữ Liệu Dashboard Heineken Tháng 09/2026
echo =======================================================================
echo HEINEKEN SDIP DASHBOARD - HE THONG CAP NHAT DU LIEU THANG 09/2026
echo =======================================================================
echo.
echo [1/2] Dang tien xu ly & lam sach du lieu tu 5 file Excel Power BI...
echo       Vui long cho trong giay lat...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_sdip_engine.ps1"

echo.
echo [2/2] Dang tao Dashboard HTML sieu nhe Zalo-First (< 1.5 MB)...
node "d:\NTAN\AI For work\Agentic\heineken-sdip-tracking\scripts\generate_dashboard_html.js"

echo.
echo =======================================================================
echo HOAN TAT! Dang mo Dashboard tren trinh duyet...
echo =======================================================================
start "" "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\dashboard_september_2026.html"

pause
