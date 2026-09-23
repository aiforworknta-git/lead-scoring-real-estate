$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wbDIS = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx", 0, $true)
    $wsDIS = $wbDIS.Worksheets.Item("Export")
    $usedRows = $wsDIS.UsedRange.Rows.Count
    $chunkSize = 50000

    $grouped = @{}

    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $wsDIS.Range($wsDIS.Cells.Item($start, 1), $wsDIS.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $fromId = [string]$arr[$i, 5]
            $toId = [string]$arr[$i, 7]
            if ($fromId -eq "66354490" -or $toId -eq "66354490") {
                $month = [string]$arr[$i, 11]
                $valQty = $arr[$i, 15]
                $qty = 0; [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null
                $role = if ($toId -eq "66354490") { "Buyer (Sell-In)" } else { "Seller (Sell-Out)" }
                $key = "$month | $role"
                
                if (-not $grouped.ContainsKey($key)) {
                    $grouped[$key] = @{ Qty = 0; Rows = 0 }
                }
                $grouped[$key].Qty += $qty
                $grouped[$key].Rows++
            }
        }
    }
    $wbDIS.Close($false)
    
    Write-Host "Breakdown for Minh Duong (66354490) in DIS Volume:"
    foreach ($k in ($grouped.Keys | Sort-Object)) {
        $v = $grouped[$k]
        Write-Host "  $k : $($v.Qty) th ($($v.Rows) rows)"
    }

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
