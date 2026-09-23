$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Read Overview.xlsx
    $overFile = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx"
    $wbOver = $excel.Workbooks.Open($overFile, 0, $true)
    $wsOver = $wbOver.Worksheets.Item(1)
    $rowsOver = $wsOver.UsedRange.Rows.Count
    
    $overviewMap = @{}
    $totOverviewSI = 0
    $totOverviewSO = 0
    
    for ($r = 2; $r -le $rowsOver; $r++) {
        $id = [string]$wsOver.Cells.Item($r, 1).Text.Trim()
        $area = [string]$wsOver.Cells.Item($r, 3).Text.Trim()
        if ($id -and ($area -eq "South 2" -or $area -eq "South 9")) {
            $name = [string]$wsOver.Cells.Item($r, 2).Text.Trim()
            $si = 0; [double]::TryParse([string]$wsOver.Cells.Item($r, 4).Value2, [ref]$si) | Out-Null
            $so = 0; [double]::TryParse([string]$wsOver.Cells.Item($r, 5).Value2, [ref]$so) | Out-Null
            
            $overviewMap[$id] = @{
                Name       = $name
                Area       = $area
                Over_SI    = [math]::Round($si, 1)
                Over_SO    = [math]::Round($so, 1)
                DIS_SI_08  = 0
                DIS_SO_08  = 0
                DIS_SI_09  = 0
                DIS_SO_09  = 0
            }
            $totOverviewSI += $si
            $totOverviewSO += $so
        }
    }
    $wbOver.Close($false)

    # 2. Read DIS Volume.xlsx
    $disFile = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
    $wbDIS = $excel.Workbooks.Open($disFile, 0, $true)
    $wsDIS = $wbDIS.Worksheets.Item("Export")
    $usedRows = $wsDIS.UsedRange.Rows.Count
    $chunkSize = 50000

    $totDisSI_08 = 0
    $totDisSO_08 = 0
    $totDisSI_09 = 0
    $totDisSO_09 = 0

    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $wsDIS.Range($wsDIS.Cells.Item($start, 1), $wsDIS.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $month = [string]$arr[$i, 11]
            $buyFrom = [string]$arr[$i, 4]
            $fromId = [string]$arr[$i, 5]
            $toId = [string]$arr[$i, 7]
            $valQty = $arr[$i, 15]
            $qty = 0; [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null
            
            # Sell-In: BuyFrom = Distributor and To_Customer_ID = SubD
            if ($buyFrom -eq "Distributor" -and $overviewMap.ContainsKey($toId)) {
                if ($month -eq "202608") {
                    $overviewMap[$toId].DIS_SI_08 += $qty
                    $totDisSI_08 += $qty
                } elseif ($month -eq "202609") {
                    $overviewMap[$toId].DIS_SI_09 += $qty
                    $totDisSI_09 += $qty
                }
            }
            
            # Sell-Out: BuyFrom = Sub Distributor and From_Customer_ID = SubD
            if ($buyFrom -eq "Sub Distributor" -and $overviewMap.ContainsKey($fromId)) {
                if ($month -eq "202608") {
                    $overviewMap[$fromId].DIS_SO_08 += $qty
                    $totDisSO_08 += $qty
                } elseif ($month -eq "202609") {
                    $overviewMap[$fromId].DIS_SO_09 += $qty
                    $totDisSO_09 += $qty
                }
            }
        }
    }
    $wbDIS.Close($false)

    Write-Host "============================================================"
    Write-Host "     RECONCILIATION RESULT ACROSS MONTHS (103 SUBDS)"
    Write-Host "============================================================"
    Write-Host ("Overview.xlsx Total SI: " + [math]::Round($totOverviewSI, 1) + " th")
    Write-Host ("Overview.xlsx Total SO: " + [math]::Round($totOverviewSO, 1) + " th")
    Write-Host ""
    Write-Host ("DIS Volume Month 202608 Total SI: " + [math]::Round($totDisSI_08, 1) + " th")
    Write-Host ("DIS Volume Month 202608 Total SO: " + [math]::Round($totDisSO_08, 1) + " th")
    Write-Host ""
    Write-Host ("DIS Volume Month 202609 Total SI: " + [math]::Round($totDisSI_09, 1) + " th")
    Write-Host ("DIS Volume Month 202609 Total SO: " + [math]::Round($totDisSO_09, 1) + " th")
    
    # Check how many SubDs match exactly in 202608
    $matchSI_08 = 0
    $matchSO_08 = 0
    foreach ($id in $overviewMap.Keys) {
        $s = $overviewMap[$id]
        if ([math]::Abs($s.Over_SI - $s.DIS_SI_08) -lt 0.01) { $matchSI_08++ }
        if ([math]::Abs($s.Over_SO - $s.DIS_SO_08) -lt 0.01) { $matchSO_08++ }
    }
    Write-Host ""
    Write-Host ("SubDs with SI EXACT MATCH in Month 202608: " + $matchSI_08 + " / " + $overviewMap.Count)
    Write-Host ("SubDs with SO EXACT MATCH in Month 202608: " + $matchSO_08 + " / " + $overviewMap.Count)

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
