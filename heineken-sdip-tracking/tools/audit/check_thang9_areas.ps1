$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open("$baseDir\OverView.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $rows = $ws.UsedRange.Rows.Count
    
    $areas = @{}
    for ($r = 2; $r -le $rows; $r++) {
        $a = [string]$ws.Cells.Item($r, 3).Text
        if ($a) {
            if (-not $areas.ContainsKey($a)) { $areas[$a] = 0 }
            $areas[$a]++
        }
    }
    $wb.Close($false)
    Write-Host "Areas found in thang 9 OverView.xlsx:"
    foreach ($k in $areas.Keys) {
        Write-Host "  '$k' (Len: $($k.Length)) : $($areas[$k]) rows"
    }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
