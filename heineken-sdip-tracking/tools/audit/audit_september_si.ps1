$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    Write-Host "Opening DIS Volume..."
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item(1)
    $arr = $ws.UsedRange.Value2
    $wb.Close($false)
    $rows = $arr.GetLength(0)

    # SKU Map
    $skuMap = @{}
    # SubD Sell-In for 202609
    $subdSI = @{}

    for ($r = 2; $r -le $rows; $r++) {
        $m = [string]($arr[$r, 11])
        if ($m -ne "202609") { continue }

        $buyFrom = [string]($arr[$r, 4])
        if ($buyFrom -ne "Distributor") { continue }

        $subdId = [string]($arr[$r, 7]) # To_Customer_ID
        $brand = [string]($arr[$r, 12])
        $line = [string]($arr[$r, 13])
        $shortCode = [string]($arr[$r, 14])

        $valUom = $arr[$r, 15]
        $uom = 0.0
        if ($valUom) { [double]::TryParse([string]$valUom, [ref]$uom) | Out-Null }

        $skuKey = "$shortCode|$brand|$line"
        if (-not $skuMap.ContainsKey($skuKey)) {
            $skuMap[$skuKey] = 0.0
        }
        $skuMap[$skuKey] += $uom

        # Check AA vs BB: Silver, Crystal, Smooth
        $isAA = ($line -like "*Silver*" -or $line -like "*Crystal*" -or $line -like "*Smooth*" -or 
                 $brand -like "*Silver*" -or $brand -like "*Crystal*" -or $brand -like "*Smooth*")

        if (-not $subdSI.ContainsKey($subdId)) {
            $subdSI[$subdId] = @{
                tot = 0.0
                aa  = 0.0
                bb  = 0.0
            }
        }
        $subdSI[$subdId].tot += $uom
        if ($isAA) {
            $subdSI[$subdId].aa += $uom
        } else {
            $subdSI[$subdId].bb += $uom
        }
    }

    Write-Host "`nTotal SubDs receiving Sell-In in 202609: $($subdSI.Count)"
    $grandTot = 0.0; $grandAA = 0.0; $grandBB = 0.0
    foreach ($k in $subdSI.Keys) {
        $grandTot += $subdSI[$k].tot
        $grandAA += $subdSI[$k].aa
        $grandBB += $subdSI[$k].bb
    }
    Write-Host "Month 202609 Grand Total Sell-In: $([math]::Round($grandTot, 1)) (AA: $([math]::Round($grandAA, 1)), BB: $([math]::Round($grandBB, 1)))"

    Write-Host "`nAll SKUs in 202609 Sell-In:"
    foreach ($k in ($skuMap.Keys | Sort-Object)) {
        $isAA = ($k -like "*Silver*" -or $k -like "*Crystal*" -or $k -like "*Smooth*")
        Write-Host "SKU: $k -> Vol: $([math]::Round($skuMap[$k], 1)) -> Group: $(if ($isAA) {'FOCUS AA'} else {'NORMAL BB'})"
    }

    # Sample top 5 SubDs
    Write-Host "`nSample 5 SubDs in 202609:"
    $count = 0
    foreach ($k in $subdSI.Keys) {
        Write-Host "SubD $k : Total=$([math]::Round($subdSI[$k].tot, 1)) | AA=$([math]::Round($subdSI[$k].aa, 1)) | BB=$([math]::Round($subdSI[$k].bb, 1))"
        $count++
        if ($count -ge 5) { break }
    }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
