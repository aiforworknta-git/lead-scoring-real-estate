$filePath = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\2. Master Data\3. OSR\OSR.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($filePath, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $rows = $ws.UsedRange.Rows.Count
    $cols = $ws.UsedRange.Columns.Count
    
    Write-Host "Columns 30 to $($cols):"
    for ($c = 30; $c -le $cols; $c++) {
        Write-Host "Col $c : $($ws.Cells.Item(1, $c).Text)"
    }

    # Analyze unique values of key categorical columns
    # Col 5: AreaID, Col 11: BrandID, Col 28: StatusName, Col 29: OutletContractStatus, Col 30: OutletType
    $areas = @{}
    $brands = @{}
    $statusNames = @{}
    $contractStatuses = @{}
    $uniqueOutlets = @{}
    $uniqueContracts = @{}
    $totalTarget = 0
    $totalCash = 0
    $totalSignage = 0
    $totalFee = 0

    for ($r = 2; $r -le $rows; $r++) {
        $area = [string]$ws.Cells.Item($r, 5).Text
        $brand = [string]$ws.Cells.Item($r, 11).Text
        $sName = [string]$ws.Cells.Item($r, 28).Text
        $cStatus = [string]$ws.Cells.Item($r, 29).Text
        $olId = [string]$ws.Cells.Item($r, 3).Text
        $cId = [string]$ws.Cells.Item($r, 2).Text

        if ($area) { $areas[$area] = ($areas[$area] + 1) }
        if ($brand) { $brands[$brand] = ($brands[$brand] + 1) }
        if ($sName) { $statusNames[$sName] = ($statusNames[$sName] + 1) }
        if ($cStatus) { $contractStatuses[$cStatus] = ($contractStatuses[$cStatus] + 1) }
        if ($olId) { $uniqueOutlets[$olId] = $true }
        if ($cId) { $uniqueContracts[$cId] = $true }

        $tVal = 0; [double]::TryParse([string]$ws.Cells.Item($r, 12).Value2, [ref]$tVal) | Out-Null
        $cVal = 0; [double]::TryParse([string]$ws.Cells.Item($r, 13).Value2, [ref]$cVal) | Out-Null
        $sVal = 0; [double]::TryParse([string]$ws.Cells.Item($r, 17).Value2, [ref]$sVal) | Out-Null
        $fVal = 0; [double]::TryParse([string]$ws.Cells.Item($r, 27).Value2, [ref]$fVal) | Out-Null

        $totalTarget += $tVal
        $totalCash += $cVal
        $totalSignage += $sVal
        $totalFee += $fVal
    }

    Write-Host "`n=== SUMMARY ANALYSIS ==="
    Write-Host "Total Rows: $rows"
    Write-Host "Unique Contracts: $($uniqueContracts.Count)"
    Write-Host "Unique Outlets: $($uniqueOutlets.Count)"
    Write-Host "`nArea Distribution:"
    $areas.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { Write-Host " - $($_.Key): $($_.Value) rows" }
    Write-Host "`nBrand Distribution:"
    $brands.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { Write-Host " - $($_.Key): $($_.Value) rows" }
    Write-Host "`nContract Status Distribution:"
    $contractStatuses.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { Write-Host " - $($_.Key): $($_.Value) rows" }
    Write-Host "`nStatusName Distribution:"
    $statusNames.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { Write-Host " - $($_.Key): $($_.Value) rows" }
    
    Write-Host "`nFinancial Totals in OSR:"
    Write-Host "Total Committed Target: $([Math]::Round($totalTarget)) crates"
    Write-Host "Total Cash Sponsorship: $([Math]::Round($totalCash).ToString('N0')) VND"
    Write-Host "Total Signage Grant: $([Math]::Round($totalSignage).ToString('N0')) VND"
    Write-Host "Total Contract Fee: $([Math]::Round($totalFee).ToString('N0')) VND"

    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
