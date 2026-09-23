$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $usedRows = $ws.UsedRange.Rows.Count
    
    $chunkSize = 50000
    $skuMap = @{}
    
    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $ws.Range($ws.Cells.Item($start, 1), $ws.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $brand = [string]$arr[$i, 12]
            $line = [string]$arr[$i, 13]
            $shortCode = [string]$arr[$i, 14]
            $key = "$shortCode | $brand | $line"
            if (-not $skuMap.ContainsKey($key)) {
                $skuMap[$key] = 0
            }
            $valQty = $arr[$i, 15]
            $qty = 0; [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null
            $skuMap[$key] += $qty
        }
    }
    $wb.Close($false)
    
    Write-Host "Total unique SKUs in DIS Volume: $($skuMap.Count)`n"
    Write-Host "=== CLASSIFICATION TEST (Silver, Crystal, Smooth -> AA, Rest -> BB) ==="
    
    $aaList = [System.Collections.ArrayList]::new()
    $bbList = [System.Collections.ArrayList]::new()
    
    foreach ($k in $skuMap.Keys | Sort-Object) {
        $isAA = ($k -match "Silver" -or $k -match "Crystal" -or $k -match "Smooth")
        $entry = "$k (Total Qty: $($skuMap[$k]))"
        if ($isAA) {
            [void]$aaList.Add($entry)
        } else {
            [void]$bbList.Add($entry)
        }
    }
    
    Write-Host ""
    Write-Host '--- NHÓM AA (Silver, Crystal, Smooth) ---'
    $aaList | ForEach-Object { Write-Host "  [AA] $_" }
    
    Write-Host ""
    Write-Host '--- NHÓM BB (Cac SKU con lai) ---'
    $bbList | ForEach-Object { Write-Host "  [BB] $_" }

} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
