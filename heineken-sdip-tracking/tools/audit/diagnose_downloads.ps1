$dl = "C:\Users\HP\Downloads"
Write-Host "=== CHẨN ĐOÁN THƯ MỤC DOWNLOADS (C:\Users\HP\Downloads) ===" -ForegroundColor Green

if (-not (Test-Path -LiteralPath $dl)) {
    Write-Host "Thư mục không tồn tại!" -ForegroundColor Red
    exit
}

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$items = Get-ChildItem -LiteralPath $dl -Force
$files = $items | Where-Object { -not $_.PSIsContainer }
$dirs = $items | Where-Object { $_.PSIsContainer }
$sw.Stop()

Write-Host "Thời gian quét danh sách Get-ChildItem: $($sw.ElapsedMilliseconds) ms"
Write-Host "Tổng số file trực tiếp trong Downloads: $($files.Count)"
Write-Host "Tổng số thư mục con trực tiếp: $($dirs.Count)"

$totalSize = ($files | Measure-Object -Property Length -Sum).Sum
Write-Host "Tổng dung lượng file trực tiếp: $([math]::Round($totalSize / 1GB, 2)) GB ($([math]::Round($totalSize / 1MB, 1)) MB)"

# 1. File đang tải dở hoặc file tạm bị treo
Write-Host "`n--- [1] FILE TẠM / TẢI DỞ (.crdownload, .part, .tmp) ---" -ForegroundColor Cyan
$incompletes = $files | Where-Object { $_.Extension -in @(".crdownload", ".part", ".tmp", ".downloading", ".opdownload") }
Write-Host "Số lượng file dở dang / lock: $($incompletes.Count)"
if ($incompletes.Count -gt 0) {
    $incompletes | Select-Object -First 15 Name, @{N="SizeMB";E={[math]::Round($_.Length/1MB, 2)}}, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Host
}

# 2. File dung lượng cực lớn (> 500MB)
Write-Host "`n--- [2] TOP 10 FILE NẶNG NHẤT ---" -ForegroundColor Cyan
$files | Sort-Object Length -Descending | Select-Object -First 10 Name, @{N="SizeMB";E={[math]::Round($_.Length/1MB, 1)}}, Extension, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Host

# 3. Phân bổ định dạng file
Write-Host "`n--- [3] THỐNG KÊ ĐỊNH DẠNG FILE (TOP 10 ĐỊNH DẠNG PHỔ BIẾN) ---" -ForegroundColor Cyan
$files | Group-Object Extension | Sort-Object Count -Descending | Select-Object -First 10 Count, Name | Format-Table -AutoSize | Out-String | Write-Host

# 4. Kiểm tra desktop.ini (Folder Template Optimization)
Write-Host "`n--- [4] CẤU HÌNH DESKTOP.INI & FOLDER TYPE OPTIMIZATION ---" -ForegroundColor Cyan
$desktopIni = Join-Path $dl "desktop.ini"
if (Test-Path -LiteralPath $desktopIni) {
    Write-Host "Tìm thấy desktop.ini:"
    Get-Content -LiteralPath $desktopIni -Force | Out-String | Write-Host
} else {
    Write-Host "Không có desktop.ini tùy biến."
}

# 5. Kiểm tra registry FolderType của Downloads trong Windows Explorer
Write-Host "`n--- [5] KIỂM TRA FOLDER TYPE TRONG REGISTRY ---" -ForegroundColor Cyan
$regKey = "HKCU:\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags"
Write-Host "Registry Bags path: $regKey"
