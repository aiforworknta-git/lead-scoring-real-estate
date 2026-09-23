# PowerShell Script: Đăng ký tác vụ tự động gửi tin 8h30 sáng vào Windows Task Scheduler
# Chạy script này một lần để Windows tự động kích hoạt bot mỗi ngày lúc 08:30 AM

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$TaskName = "Telegram_Executive_AI_Digest"
$BatPath = "d:\NTAN\AI For work\Agentic\telegram-ai-news-bot\run_executive_digest.bat"
$Time = "08:30"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  CẤU HÌNH TỰ ĐỘNG GỬI BẢN TIN VÀO 8H30 SÁNG HÀNG NGÀY" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

try {
    $Action = New-ScheduledTaskAction -Execute $BatPath
    $Trigger = New-ScheduledTaskTrigger -Daily -At $Time
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Force | Out-Null

    Write-Host ""
    Write-Host "✅ ĐÃ ĐĂNG KÝ THÀNH CÔNG VÀO WINDOWS TASK SCHEDULER!" -ForegroundColor Green
    Write-Host "🎯 Tên tác vụ: $TaskName" -ForegroundColor White
    Write-Host "⏰ Thời gian chạy: Mỗi ngày vào lúc $Time sáng" -ForegroundColor White
    Write-Host "📂 File thực thi: $BatPath" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Kể cả khi bạn tắt VSCode, Windows vẫn sẽ tự động chạy file này mỗi sáng!" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Có lỗi xảy ra: $_" -ForegroundColor Red
}

Write-Host "================================================================" -ForegroundColor Cyan
