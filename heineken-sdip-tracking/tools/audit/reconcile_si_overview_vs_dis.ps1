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
    $totOverviewAA = 0
    $totOverviewBB = 0
    
    for ($r = 2; $r -le $rowsOver; $r++) {
        $id = [string]$wsOver.Cells.Item($r, 1).Text.Trim()
        $area = [string]$wsOver.Cells.Item($r, 3).Text.Trim()
        if ($id -and ($area -eq "South 2" -or $area -eq "South 9")) {
            $name = [string]$wsOver.Cells.Item($r, 2).Text.Trim()
            $si = 0; [double]::TryParse([string]$wsOver.Cells.Item($r, 4).Value2, [ref]$si) | Out-Null
            $si_aa = 0; [double]::TryParse([string]$wsOver.Cells.Item($r, 20).Value2, [ref]$si_aa) | Out-Null
            $si_bb = 0; [double]::TryParse([string]$wsOver.Cells.Item($r, 24).Value2, [ref]$si_bb) | Out-Null
            
            $overviewMap[$id] = [ordered]@{
                Name    = $name
                Area    = $area
                SI      = [math]::Round($si, 1)
                SI_AA   = [math]::Round($si_aa, 1)
                SI_BB   = [math]::Round($si_bb, 1)
                DIS_SI  = 0
                DIS_AA  = 0
                DIS_BB  = 0
            }
            $totOverviewSI += $si
            $totOverviewAA += $si_aa
            $totOverviewBB += $si_bb
        }
    }
    $wbOver.Close($false)

    # 2. Read DIS Volume.xlsx
    $disFile = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
    $wbDIS = $excel.Workbooks.Open($disFile, 0, $true)
    $wsDIS = $wbDIS.Worksheets.Item("Export")
    $usedRows = $wsDIS.UsedRange.Rows.Count
    $chunkSize = 50000

    $totDisSI = 0
    $totDisAA = 0
    $totDisBB = 0

    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $wsDIS.Range($wsDIS.Cells.Item($start, 1), $wsDIS.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $month = [string]$arr[$i, 11]
            if ($month -ne "202609") { continue }
            
            $buyFrom = [string]$arr[$i, 4]
            if ($buyFrom -ne "Distributor") { continue }
            
            $toId = [string]$arr[$i, 7]
            if ($overviewMap.ContainsKey($toId)) {
                $valQty = $arr[$i, 15]
                $qty = 0; [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null
                
                $line = [string]$arr[$i, 13]
                $isAA = ($line -match "Silver" -or $line -match "Crystal" -or $line -match "Smooth")
                
                $overviewMap[$toId].DIS_SI += $qty
                $totDisSI += $qty
                if ($isAA) {
                    $overviewMap[$toId].DIS_AA += $qty
                    $totDisAA += $qty
                } else {
                    $overviewMap[$toId].DIS_BB += $qty
                    $totDisBB += $qty
                }
            }
        }
    }
    $wbDIS.Close($false)

    # 3. Output results
    $diffSI = $totDisSI - $totOverviewSI
    $pctDiff = if ($totOverviewSI -gt 0) { ($diffSI / $totOverviewSI) * 100 } else { 0 }

    Write-Host "============================================================"
    Write-Host "         RECONCILIATION AUDIT: OVERVIEW VS DIS VOLUME"
    Write-Host "============================================================"
    Write-Host ("SubD Count: " + $overviewMap.Count)
    Write-Host ("Overview Total SI : " + [math]::Round($totOverviewSI, 1))
    Write-Host ("DIS Total SI      : " + [math]::Round($totDisSI, 1))
    Write-Host ("Difference SI     : " + [math]::Round($diffSI, 1) + " (" + [math]::Round($pctDiff, 2) + " percent)")
    Write-Host ""
    Write-Host ("Overview AA : " + [math]::Round($totOverviewAA, 1))
    Write-Host ("DIS AA      : " + [math]::Round($totDisAA, 1))
    Write-Host ("Diff AA     : " + [math]::Round($totDisAA - $totOverviewAA, 1))
    Write-Host ""
    Write-Host ("Overview BB : " + [math]::Round($totOverviewBB, 1))
    Write-Host ("DIS BB      : " + [math]::Round($totDisBB, 1))
    Write-Host ("Diff BB     : " + [math]::Round($totDisBB - $totOverviewBB, 1))

    $diffList = [System.Collections.ArrayList]::new()
    foreach ($id in $overviewMap.Keys) {
        $s = $overviewMap[$id]
        $diff = [math]::Abs($s.DIS_SI - $s.SI)
        [void]$diffList.Add([ordered]@{
            Id       = $id
            Name     = $s.Name
            Area     = $s.Area
            Over_SI  = $s.SI
            DIS_SI   = [math]::Round($s.DIS_SI, 1)
            Diff     = [math]::Round($s.DIS_SI - $s.SI, 1)
            AbsDiff  = $diff
        })
    }
    
    $sortedDiff = $diffList | Sort-Object AbsDiff -Descending
    Write-Host ""
    Write-Host "Top 10 Discrepancies by SubD:"
    $count = 0
    foreach ($item in $sortedDiff) {
        if ($count -ge 10) { break }
        Write-Host ("  SubD " + $item.Id + " (" + $item.Name + ") [" + $item.Area + "]: Over=" + $item.Over_SI + " | DIS=" + $item.DIS_SI + " | Diff=" + $item.Diff)
        $count++
    }

    $exactMatch = ($diffList | Where-Object { $_.Diff -eq 0 }).Count
    Write-Host ""
    Write-Host ("SubDs Exactly Matching (Diff = 0): " + $exactMatch + " / " + $overviewMap.Count)

} catch {
    Write-Host ("Error: " + $_.Exception.Message)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
