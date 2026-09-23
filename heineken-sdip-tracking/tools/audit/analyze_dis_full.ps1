$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $usedRows = $ws.UsedRange.Rows.Count
    
    # Read in chunks of 50,000 rows
    $chunkSize = 50000
    $buyFromCounts = @{}
    $areaCounts = @{}
    $monthCounts = @{}
    
    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $ws.Range($ws.Cells.Item($start, 1), $ws.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $area = [string]$arr[$i, 3]
            $buyFrom = [string]$arr[$i, 4]
            $month = [string]$arr[$i, 11]
            
            if ($buyFrom) {
                if (-not $buyFromCounts.ContainsKey($buyFrom)) { $buyFromCounts[$buyFrom] = 0 }
                $buyFromCounts[$buyFrom]++
            }
            if ($area) {
                if (-not $areaCounts.ContainsKey($area)) { $areaCounts[$area] = 0 }
                $areaCounts[$area]++
            }
            if ($month) {
                if (-not $monthCounts.ContainsKey($month)) { $monthCounts[$month] = 0 }
                $monthCounts[$month]++
            }
        }
    }
    $wb.Close($false)
    
    Write-Host "=== BUY FROM COUNTS ==="
    $buyFromCounts.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }

    Write-Host "`n=== AREA COUNTS ==="
    $areaCounts.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }

    Write-Host "`n=== MONTH COUNTS ==="
    $monthCounts.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }

} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
