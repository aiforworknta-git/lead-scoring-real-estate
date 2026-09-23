$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9"
$outDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"

Write-Host "============================================================"
Write-Host "   HEINEKEN SDIP DATA PIPELINE - SEPTEMBER 2026 (ROBUST)"
Write-Host "============================================================"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$subdMap = [System.Collections.Generic.Dictionary[string, object]]::new()
$areaSummary = @{
    "South 2" = @{ Target = 0; Actual_SI = 0; Actual_SO = 0; SubD_Count = 0; SDIP_Count = 0 }
    "South 9" = @{ Target = 0; Actual_SI = 0; Actual_SO = 0; SubD_Count = 0; SDIP_Count = 0 }
}

try {
    # ---------------------------------------------------------
    # 1. READ OVERVIEW.XLSX (Actuals)
    # ---------------------------------------------------------
    Write-Host "`n[1/4] Reading OverView.xlsx..."
    $wbOver = $excel.Workbooks.Open("$baseDir\OverView.xlsx", 0, $true)
    $wsOver = $wbOver.Worksheets.Item("Export")
    $rowsOver = $wsOver.UsedRange.Rows.Count
    
    $loadedSubDCount = 0
    for ($r = 2; $r -le $rowsOver; $r++) {
        $id = [string]$wsOver.Cells.Item($r, 1).Text.Trim()
        $name = [string]$wsOver.Cells.Item($r, 2).Text.Trim()
        $area = [string]$wsOver.Cells.Item($r, 3).Text.Trim()
        
        # Filter: Only South 2 and South 9
        if (-not $id -or ($area -ne "South 2" -and $area -ne "South 9")) {
            continue
        }
        
        $si = [double]0; [double]::TryParse([string]$wsOver.Cells.Item($r, 4).Value2, [ref]$si) | Out-Null
        $so = [double]0; [double]::TryParse([string]$wsOver.Cells.Item($r, 5).Value2, [ref]$so) | Out-Null
        
        $sdip = [string]$wsOver.Cells.Item($r, 6).Text.Trim()
        $isSDIP = ($sdip -eq "Yes")
        
        $scd = [double]0; [double]::TryParse([string]$wsOver.Cells.Item($r, 11).Value2, [ref]$scd) | Out-Null
        $sku_count = [int]0; [int]::TryParse([string]$wsOver.Cells.Item($r, 13).Value2, [ref]$sku_count) | Out-Null
        $fill_rate = [double]0; [double]::TryParse([string]$wsOver.Cells.Item($r, 14).Value2, [ref]$fill_rate) | Out-Null
        $aso_active = [int]0; [int]::TryParse([string]$wsOver.Cells.Item($r, 16).Value2, [ref]$aso_active) | Out-Null
        $aso_total = [int]0; [int]::TryParse([string]$wsOver.Cells.Item($r, 17).Value2, [ref]$aso_total) | Out-Null
        
        $soVsSiVal = if ($si -gt 0) { [math]::Round(($so / $si) * 100, 1) } else { 0 }
        $fillRateVal = if ($fill_rate -le 1 -and $fill_rate -gt 0) { [math]::Round($fill_rate * 100, 1) } else { [math]::Round($fill_rate, 1) }
        $asoPctVal = if ($aso_total -gt 0) { [math]::Round(($aso_active / $aso_total) * 100, 1) } else { 0 }
        $scdStatus = if ($scd -gt 7) { "RED_HIGH" } elseif ($scd -lt 3 -and $scd -gt 0) { "YELLOW_LOW" } else { "GREEN_SAFE" }

        $subdMap[$id] = [ordered]@{
            subd_id               = $id
            subd_name             = $name
            area_name             = $area
            is_sdip               = $isSDIP
            target_total          = 0
            target_aa             = 0
            target_bb             = 0
            actual_si             = [math]::Round($si, 1)
            actual_so             = [math]::Round($so, 1)
            target_achieve_pct    = 0
            so_vs_si_pct          = $soVsSiVal
            scd                   = [math]::Round($scd, 1)
            fill_rate_pct         = $fillRateVal
            aso_active            = $aso_active
            aso_total             = $aso_total
            aso_pct               = $asoPctVal
            inactive_outlets_count= 0
            sku_count             = $sku_count
            scd_status            = $scdStatus
            sku_list              = [System.Collections.ArrayList]::new()
            inactive_outlets      = [System.Collections.ArrayList]::new()
            zalo_phone            = ""
        }
        
        $areaSummary[$area].Actual_SI += $si
        $areaSummary[$area].Actual_SO += $so
        $areaSummary[$area].SubD_Count++
        if ($isSDIP) { $areaSummary[$area].SDIP_Count++ }
        $loadedSubDCount++
    }
    $wbOver.Close($false)
    Write-Host "   -> Successfully loaded $loadedSubDCount SubDs from OverView.xlsx (South 2: $($areaSummary['South 2'].SubD_Count))"

    # ---------------------------------------------------------
    # 2. READ TARGET FILES (South 2 and South 9)
    # ---------------------------------------------------------
    Write-Host "`n[2/4] Reading Target Files..."
    
    function Process-Target-File($targetPath, $areaName) {
        if (-not (Test-Path -LiteralPath $targetPath)) { return }
        $wbT = $excel.Workbooks.Open($targetPath, 0, $true)
        $wsT = $wbT.Worksheets.Item("Data")
        $cols = $wsT.UsedRange.Columns.Count
        $rows = $wsT.UsedRange.Rows.Count
        
        $colRefCode = 0; $colName = 0; $colTotalTarget = 0; $colAATarget = 0; $colBBTarget = 0
        $currentGroup = ""
        for ($c = 1; $c -le $cols; $c++) {
            $r1 = [string]$wsT.Cells.Item(1, $c).Text.Trim()
            $r2 = [string]$wsT.Cells.Item(2, $c).Text.Trim()
            if ($r1) { $currentGroup = $r1 }
            
            if ($r1 -eq "RefCode" -or $r2 -eq "RefCode") { $colRefCode = $c }
            elseif ($r1 -eq "Name" -or $r2 -eq "Name") { $colName = $c }
            elseif ($currentGroup -eq "Total" -and $r2 -eq "Target") { $colTotalTarget = $c }
            elseif ($currentGroup -eq "AA" -and $r2 -eq "Target") { $colAATarget = $c }
            elseif ($currentGroup -eq "BB" -and $r2 -eq "Target") { $colBBTarget = $c }
        }
        
        Write-Host "   $areaName Target Columns: RefCode=$colRefCode, Name=$colName, TotalTarget=$colTotalTarget, AA=$colAATarget, BB=$colBBTarget"
        
        for ($r = 4; $r -le $rows; $r++) {
            $ref = [string]$wsT.Cells.Item($r, $colRefCode).Text.Trim()
            $subdName = [string]$wsT.Cells.Item($r, $colName).Text.Trim()
            if (-not $ref) { continue }
            
            $targetTot = 0; if ($colTotalTarget -gt 0) { [double]::TryParse([string]$wsT.Cells.Item($r, $colTotalTarget).Value2, [ref]$targetTot) | Out-Null }
            $targetAA = 0; if ($colAATarget -gt 0) { [double]::TryParse([string]$wsT.Cells.Item($r, $colAATarget).Value2, [ref]$targetAA) | Out-Null }
            $targetBB = 0; if ($colBBTarget -gt 0) { [double]::TryParse([string]$wsT.Cells.Item($r, $colBBTarget).Value2, [ref]$targetBB) | Out-Null }
            
            if (-not $subdMap.ContainsKey($ref)) {
                # Add SubD if not present in Overview
                $subdMap[$ref] = [ordered]@{
                    subd_id               = $ref
                    subd_name             = $subdName
                    area_name             = $areaName
                    is_sdip               = $false
                    target_total          = [math]::Round($targetTot, 1)
                    target_aa             = [math]::Round($targetAA, 1)
                    target_bb             = [math]::Round($targetBB, 1)
                    actual_si             = 0
                    actual_so             = 0
                    target_achieve_pct    = 0
                    so_vs_si_pct          = 0
                    scd                   = 0
                    fill_rate_pct         = 0
                    aso_active            = 0
                    aso_total             = 0
                    aso_pct               = 0
                    inactive_outlets_count= 0
                    sku_count             = 0
                    scd_status            = "GREEN_SAFE"
                    sku_list              = [System.Collections.ArrayList]::new()
                    inactive_outlets      = [System.Collections.ArrayList]::new()
                    zalo_phone            = ""
                }
                $areaSummary[$areaName].SubD_Count++
            } else {
                $subd = $subdMap[$ref]
                $subd.target_total = [math]::Round($targetTot, 1)
                $subd.target_aa = [math]::Round($targetAA, 1)
                $subd.target_bb = [math]::Round($targetBB, 1)
                $subd.target_achieve_pct = if ($targetTot -gt 0) { [math]::Round(($subd.actual_si / $targetTot) * 100, 1) } else { 0 }
            }
            
            $areaSummary[$areaName].Target += $targetTot
        }
        $wbT.Close($false)
    }

    Process-Target-File "$baseDir\target\Sub DistributorTarget-202609-[South 2]_A.xlsx" "South 2"
    Process-Target-File "$baseDir\target\Sub DistributorTarget-202609-[South 9]_F.xlsx" "South 9"
    Write-Host "   -> Total SubDs after Target merge: $($subdMap.Count) (South 2: $($areaSummary['South 2'].SubD_Count), South 9: $($areaSummary['South 9'].SubD_Count))"

    # ---------------------------------------------------------
    # 3. READ SCD.XLSX (Stock & Stock Cover Days per SKU)
    # ---------------------------------------------------------
    Write-Host "`n[3/4] Reading SCD.xlsx..."
    $wbSCD = $excel.Workbooks.Open("$baseDir\SCD.xlsx", 0, $true)
    $wsSCD = $wbSCD.Worksheets.Item("Export")
    $rowsSCD = $wsSCD.UsedRange.Rows.Count
    
    $scdCount = 0
    for ($r = 2; $r -le $rowsSCD; $r++) {
        $subdCode = [string]$wsSCD.Cells.Item($r, 3).Text.Trim()
        if (-not $subdCode -or -not $subdMap.ContainsKey($subdCode)) { continue }
        
        $subd = $subdMap[$subdCode]
        $brand = [string]$wsSCD.Cells.Item($r, 5).Text.Trim()
        $shortCode = [string]$wsSCD.Cells.Item($r, 8).Text.Trim()
        $salesName = [string]$wsSCD.Cells.Item($r, 9).Text.Trim()
        
        $si30 = 0; [double]::TryParse([string]$wsSCD.Cells.Item($r, 10).Value2, [ref]$si30) | Out-Null
        $so30 = 0; [double]::TryParse([string]$wsSCD.Cells.Item($r, 11).Value2, [ref]$so30) | Out-Null
        $stock = 0; [double]::TryParse([string]$wsSCD.Cells.Item($r, 12).Value2, [ref]$stock) | Out-Null
        $scdVal = 0; [double]::TryParse([string]$wsSCD.Cells.Item($r, 13).Value2, [ref]$scdVal) | Out-Null
        
        # If South 9 didn't have Overview actuals, accumulate from SCD 30-day volumes
        if ($subd.actual_si -eq 0 -and $si30 -gt 0) {
            $subd.actual_si += [math]::Round($si30, 1)
            $areaSummary[$subd.area_name].Actual_SI += $si30
        }
        if ($subd.actual_so -eq 0 -and $so30 -gt 0) {
            $subd.actual_so += [math]::Round($so30, 1)
            $areaSummary[$subd.area_name].Actual_SO += $so30
        }

        $skuStatus = if ($scdVal -gt 7) { "RED_HIGH" } elseif ($scdVal -lt 3 -and $scdVal -gt 0) { "YELLOW_LOW" } else { "GREEN_SAFE" }
        
        [void]$subd.sku_list.Add([ordered]@{
            brand      = $brand
            short_code = $shortCode
            sku_name   = $salesName
            stock      = [math]::Round($stock, 1)
            scd        = [math]::Round($scdVal, 1)
            si_30d     = [math]::Round($si30, 1)
            so_30d     = [math]::Round($so30, 1)
            status     = $skuStatus
        })
        $scdCount++
    }
    
    # Recalculate achievement & scd for all SubDs
    foreach ($s in $subdMap.Values) {
        if ($s.target_total -gt 0) {
            $s.target_achieve_pct = [math]::Round(($s.actual_si / $s.target_total) * 100, 1)
        }
        if ($s.actual_si -gt 0) {
            $s.so_vs_si_pct = [math]::Round(($s.actual_so / $s.actual_si) * 100, 1)
        }
        # If SCD overall is 0, take average of SKUs
        if ($s.scd -eq 0 -and $s.sku_list.Count -gt 0) {
            $sumScd = 0
            foreach ($sku in $s.sku_list) { $sumScd += $sku.scd }
            $s.scd = [math]::Round($sumScd / $s.sku_list.Count, 1)
            $s.scd_status = if ($s.scd -gt 7) { "RED_HIGH" } elseif ($s.scd -lt 3 -and $s.scd -gt 0) { "YELLOW_LOW" } else { "GREEN_SAFE" }
        }
    }
    $wbSCD.Close($false)
    Write-Host "   -> Loaded $scdCount SKU records across $($subdMap.Count) SubDs"

    # ---------------------------------------------------------
    # 4. READ ASO DETAIL.XLSX (Active Outlets & Non-Ordering Alert)
    # ---------------------------------------------------------
    Write-Host "`n[4/4] Reading ASO detail.xlsx..."
    $wbASO = $excel.Workbooks.Open("$baseDir\ASO detail.xlsx", 0, $true)
    $wsASO = $wbASO.Worksheets.Item("Export")
    $rowsASO = $wsASO.UsedRange.Rows.Count
    
    $inactiveTotal = 0
    for ($r = 3; $r -le $rowsASO; $r++) {
        $subdCode = [string]$wsASO.Cells.Item($r, 4).Text.Trim()
        if (-not $subdCode -or -not $subdMap.ContainsKey($subdCode)) { continue }
        
        $subd = $subdMap[$subdCode]
        $outletCode = [string]$wsASO.Cells.Item($r, 6).Text.Trim()
        $outletName = [string]$wsASO.Cells.Item($r, 7).Text.Trim()
        $city = [string]$wsASO.Cells.Item($r, 2).Text.Trim()
        $province = [string]$wsASO.Cells.Item($r, 3).Text.Trim()
        
        $orders = 0; [int]::TryParse([string]$wsASO.Cells.Item($r, 9).Value2, [ref]$orders) | Out-Null
        $qty = 0; [double]::TryParse([string]$wsASO.Cells.Item($r, 10).Value2, [ref]$qty) | Out-Null
        
        # If orders == 0, this is an Active Outlet that hasn't ordered yet!
        if ($orders -eq 0) {
            $subd.inactive_outlets_count++
            if ($subd.inactive_outlets.Count -lt 15) {
                [void]$subd.inactive_outlets.Add([ordered]@{
                    outlet_code = $outletCode
                    outlet_name = $outletName
                    city        = $city
                    province    = $province
                    orders      = $orders
                    qty         = $qty
                })
            }
            $inactiveTotal++
        }
    }
    $wbASO.Close($false)
    Write-Host "   -> Identified $inactiveTotal active non-ordering outlets across $($subdMap.Count) SubDs"

    # ---------------------------------------------------------
    # 5. PACKAGING AND SUMMARY OUTPUT
    # ---------------------------------------------------------
    $finalSubDList = [System.Collections.ArrayList]::new($subdMap.Values)
    
    $totSI = $areaSummary["South 2"].Actual_SI + $areaSummary["South 9"].Actual_SI
    $totSO = $areaSummary["South 2"].Actual_SO + $areaSummary["South 9"].Actual_SO
    $totTarget = $areaSummary["South 2"].Target + $areaSummary["South 9"].Target
    
    $totAchieve = if ($totTarget -gt 0) { [math]::Round(($totSI / $totTarget) * 100, 1) } else { 0 }
    $totSoSi = if ($totSI -gt 0) { [math]::Round(($totSO / $totSI) * 100, 1) } else { 0 }

    $payload = [ordered]@{
        metadata = [ordered]@{
            report_month    = "2026-09"
            report_title    = "Heineken SDIP SubD Tracking Dashboard"
            generated_at    = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            total_subds     = $finalSubDList.Count
            south2_subds    = $areaSummary["South 2"].SubD_Count
            south9_subds    = $areaSummary["South 9"].SubD_Count
        }
        kpis = [ordered]@{
            total_target        = [math]::Round($totTarget, 0)
            total_actual_si     = [math]::Round($totSI, 0)
            total_actual_so     = [math]::Round($totSO, 0)
            achieve_pct         = $totAchieve
            so_vs_si_pct        = $totSoSi
            south2              = $areaSummary["South 2"]
            south9              = $areaSummary["South 9"]
            total_inactive_outlets = $inactiveTotal
        }
        subd_list = $finalSubDList
    }
    
    $jsonOutPath = "$outDir\sdip_data_202609.json"
    $distPath = Join-Path $PSScriptRoot "..\dist\sdip_data_202609.json"
    $jsonContent = $payload | ConvertTo-Json -Depth 6
    [System.IO.File]::WriteAllText($jsonOutPath, $jsonContent, [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($distPath, $jsonContent, [System.Text.Encoding]::UTF8)

    $jsonSizeKB = [math]::Round((Get-Item $jsonOutPath).Length / 1024, 1)
    Write-Host "`n============================================================"
    Write-Host "   DATA EXTRACTION COMPLETED SUCCESSFULLY!"
    Write-Host "   Output JSON : $jsonOutPath ($jsonSizeKB KB)"
    Write-Host "   Total SubDs : $($finalSubDList.Count) (South 2: $($areaSummary['South 2'].SubD_Count), South 9: $($areaSummary['South 9'].SubD_Count))"
    Write-Host "   Total Target: $([string]::Format('{0:N0}', $totTarget))"
    Write-Host "   Total SI    : $([string]::Format('{0:N0}', $totSI)) ($totAchieve%)"
    Write-Host "   Total SO    : $([string]::Format('{0:N0}', $totSO)) (SO/SI: $totSoSi%)"
    Write-Host "============================================================"

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
