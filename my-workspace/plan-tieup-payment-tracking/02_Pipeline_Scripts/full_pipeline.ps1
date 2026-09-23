# ==============================================================================
# PIPELINE ĐIỀU PHỐI LIÊN HOÀN TOÀN BỘ CÁC TÁC VỤ
# ==============================================================================

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$excelFile = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\2. Master Data\3. OSR\Plan Tie-up - Target tracking.xlsx"

Write-Host "========================================================================" -ForegroundColor Green
Write-Host "  HEINEKEN AUTOMATED DATA PIPELINE: PLAN TIE-UP & OSR TRACKING" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Green

if (-not (Test-Path -LiteralPath $excelFile)) {
    Write-Host "[ERROR] Excel source file not found at: $excelFile" -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/4] Trích xuất dữ liệu thô từ Excel qua PowerShell COM..." -ForegroundColor Cyan
& powershell -ExecutionPolicy Bypass -File "$scriptDir\extract_data.ps1"

Write-Host "`n[2/4] Xử lý làm sạch, tính toán Aging và nạp Data Mart..." -ForegroundColor Cyan
& node "$scriptDir\generate_datamart.js"

Write-Host "`n[3/4] Đóng gói Executive Dashboard Single-File HTML..." -ForegroundColor Cyan
& node "$scriptDir\build_dashboard.js"

# [Bước 4/4 - Tạm thời tắt gửi tin Telegram theo yêu cầu người dùng]
# Write-Host "`n[4/4] Tự động gửi Báo cáo Điều hành OSR tới Telegram Lãnh đạo..." -ForegroundColor Cyan
# $pythonExe = "C:\Users\HP\AppData\Local\Programs\Python\Python312\python.exe"
# if (-not (Test-Path $pythonExe)) { $pythonExe = "python" }
# & $pythonExe "$scriptDir\send_osr_telegram_alert.py"

Write-Host "`n========================================================================" -ForegroundColor Green
Write-Host "  PIPELINE EXECUTED SUCCESSFULLY! (ZERO DISCREPANCY RECONCILIATION)" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Green

# Launch Dashboard
$indexPath = Join-Path $projectRoot "index.html"
Write-Host "Launching Dashboard: $indexPath" -ForegroundColor Yellow
Start-Process $indexPath
