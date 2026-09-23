$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $usedRows = $ws.UsedRange.Rows.Count
    
    $chunkSize = 50000
    $sampleDis = [System.Collections.ArrayList]::new()
    $sampleSubD = [System.Collections.ArrayList]::new()
    
    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        if ($sampleDis.Count -ge 3 -and $sampleSubD.Count -ge 3) { break }
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $ws.Range($ws.Cells.Item($start, 1), $ws.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $area = [string]$arr[$i, 3]
            $buyFrom = [string]$arr[$i, 4]
            $month = [string]$arr[$i, 11]
            
            if (($area -eq "South 2" -or $area -eq "South 9") -and $month -eq "202609") {
                $rowInfo = "Area: $area | BuyFrom: '$buyFrom' | From: '$($arr[$i,5])' - '$($arr[$i,6])' | To: '$($arr[$i,7])' - '$($arr[$i,8])' | Type: '$($arr[$i,10])' | SKU: '$($arr[$i,14])' | Brand: '$($arr[$i,12])' | Line: '$($arr[$i,13])' | Qty: $($arr[$i,15])"
                if ($buyFrom -eq "Distributor" -and $sampleDis.Count -lt 3) {
                    [void]$sampleDis.Add($rowInfo)
                } elseif ($buyFrom -eq "Sub Distributor" -and $sampleSubD.Count -lt 3) {
                    [void]$sampleSubD.Add($rowInfo)
                }
            }
        }
    }
    $wb.Close($false)
    
    Write-Host "=== SAMPLE BUYFROM = 'Distributor' (Area S2/S9, Month 202609) ==="
    $sampleDis | ForEach-Object { Write-Host $_ }

    Write-Host "`n=== SAMPLE BUYFROM = 'Sub Distributor' (Area S2/S9, Month 202609) ==="
    $sampleSubD | ForEach-Object { Write-Host $_ }

} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
