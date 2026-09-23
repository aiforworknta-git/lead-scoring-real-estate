$subdCodes = @{}
# Get the 103 SubDs from OverView.xlsx
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wbOver = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx", 0, $true)
    $wsOver = $wbOver.Worksheets.Item(1)
    $rowsOver = $wsOver.UsedRange.Rows.Count
    for ($r = 2; $r -le $rowsOver; $r++) {
        $id = [string]$wsOver.Cells.Item($r, 1).Text.Trim()
        $area = [string]$wsOver.Cells.Item($r, 3).Text.Trim()
        if ($id -and ($area -eq "South 2" -or $area -eq "South 9")) {
            $subdCodes[$id] = [ordered]@{ Name = [string]$wsOver.Cells.Item($r, 2).Text; Area = $area }
        }
    }
    $wbOver.Close($false)
    Write-Host "Found $($subdCodes.Count) SubDs in South 2 and South 9."

    # Now inspect DIS Volume for month 202609
    $wbDIS = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx", 0, $true)
    $wsDIS = $wbDIS.Worksheets.Item("Export")
    $usedRows = $wsDIS.UsedRange.Rows.Count

    $chunkSize = 50000
    $subdAsSeller = @{}
    $subdAsBuyer = @{}
    
    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $wsDIS.Range($wsDIS.Cells.Item($start, 1), $wsDIS.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $month = [string]$arr[$i, 11]
            if ($month -ne "202609") { continue }
            
            $fromId = [string]$arr[$i, 5]
            $toId = [string]$arr[$i, 7]
            $valQty = $arr[$i, 15]
            $qty = 0
            [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null
            
            if ($subdCodes.ContainsKey($fromId)) {
                if (-not $subdAsSeller.ContainsKey($fromId)) { $subdAsSeller[$fromId] = 0 }
                $subdAsSeller[$fromId] += $qty
            }
            if ($subdCodes.ContainsKey($toId)) {
                if (-not $subdAsBuyer.ContainsKey($toId)) { $subdAsBuyer[$toId] = 0 }
                $subdAsBuyer[$toId] += $qty
            }
        }
    }
    $wbDIS.Close($false)

    Write-Host "`nMonth 202609 Analysis in DIS Volume:"
    Write-Host "SubDs appearing as From_Customer_ID (Seller): $($subdAsSeller.Count) / $($subdCodes.Count)"
    Write-Host "SubDs appearing as To_Customer_ID (Buyer): $($subdAsBuyer.Count) / $($subdCodes.Count)"
    
    # Show sample totals for first 5 SubDs
    $first5 = $subdCodes.Keys | Select-Object -First 5
    foreach ($id in $first5) {
        $sName = $subdCodes[$id].Name
        $sellQty = if ($subdAsSeller.ContainsKey($id)) { $subdAsSeller[$id] } else { 0 }
        $buyQty = if ($subdAsBuyer.ContainsKey($id)) { $subdAsBuyer[$id] } else { 0 }
        Write-Host "SubD $id ($sName): Sold (Seller) = $sellQty th | Bought (Buyer) = $buyQty th"
    }

} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
