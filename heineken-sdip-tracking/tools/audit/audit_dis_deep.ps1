$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $usedRows = $ws.UsedRange.Rows.Count
    Write-Host "Total rows in Export: $usedRows"
    
    # Read first 10,000 rows in bulk into memory to sample
    $sampleSize = [math]::Min($usedRows, 15000)
    $arr = $ws.Range($ws.Cells.Item(1, 1), $ws.Cells.Item($sampleSize, 15)).Value2
    $wb.Close($false)
    
    $buyFromSet = @{}
    $monthSet = @{}
    $areaSet = @{}
    $brandSet = @{}
    
    for ($r = 2; $r -le $sampleSize; $r++) {
        $area = [string]$arr[$r, 3]
        $buyFrom = [string]$arr[$r, 4]
        $fromId = [string]$arr[$r, 5]
        $toId = [string]$arr[$r, 7]
        $month = [string]$arr[$r, 11]
        $brand = [string]$arr[$r, 12]
        $line = [string]$arr[$r, 13]
        $shortCode = [string]$arr[$r, 14]
        $uom = [string]$arr[$r, 15]

        if ($buyFrom) { $buyFromSet[$buyFrom] = $true }
        if ($month) { $monthSet[$month] = $true }
        if ($area) { $areaSet[$area] = $true }
        if ($brand) { $brandSet[$brand] = $true }
    }
    
    Write-Host "`nDistinct BuyFrom in sample:"
    $buyFromSet.Keys | ForEach-Object { Write-Host "  - $_" }
    
    Write-Host "`nDistinct Calendar_Month in sample:"
    $monthSet.Keys | ForEach-Object { Write-Host "  - $_" }

    Write-Host "`nDistinct Area_Name in sample:"
    $areaSet.Keys | ForEach-Object { Write-Host "  - $_" }

    Write-Host "`nSample 5 rows (BuyFrom, From_ID, From_Name, To_ID, To_Name, Month, Brand, ShortCode, UOM):"
    for ($r = 2; $r -le 6; $r++) {
        Write-Host "Row ${r}: BuyFrom='$($arr[$r,4])' | From='$($arr[$r,5])' - '$($arr[$r,6])' | To='$($arr[$r,7])' - '$($arr[$r,8])' | Month='$($arr[$r,11])' | SKU='$($arr[$r,14])' | Qty='$($arr[$r,15])'"
    }

} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
