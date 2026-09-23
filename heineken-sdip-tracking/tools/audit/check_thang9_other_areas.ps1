$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

function Check-Areas-In-File($path, $colIdx) {
    if (-not (Test-Path -LiteralPath $path)) { return }
    $item = Get-Item -LiteralPath $path
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $rows = $ws.UsedRange.Rows.Count
    $areas = @{}
    for ($r = 2; $r -le $rows; $r++) {
        $a = [string]$ws.Cells.Item($r, $colIdx).Text.Trim()
        if ($a -and $a -ne "Area_Name" -and $a -ne "AreaName") {
            if (-not $areas.ContainsKey($a)) { $areas[$a] = 0 }
            $areas[$a]++
        }
    }
    $wb.Close($false)
    Write-Host "`nAreas in $($item.Name):"
    foreach ($k in $areas.Keys) {
        Write-Host "  '$k' : $($areas[$k]) rows"
    }
}

try {
    Check-Areas-In-File "$baseDir\SCD.xlsx" 1
    Check-Areas-In-File "$baseDir\ASO detail.xlsx" 1
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
