# ==============================================================================
# HEINEKEN SDIP DATA PIPELINE - END-TO-END TRACKING ENGINE (SEPTEMBER 2026)
# Author: AI4A Multi-Agent Orchestrator
# Inputs: OverView.xlsx, ASO detail.xlsx, SCD.xlsx, OL YTD.xlsx, Target files
# Output: sdip_data_202609.json & dashboard_september_2026.html
# ==============================================================================

param(
    [string]$BaseDataDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9",
    [string]$DimDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\DIM",
    [string]$OutputDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard",
    [string]$ProjectDistDir = ""
)

if (-not $ProjectDistDir) {
    $ProjectDistDir = Join-Path $PSScriptRoot "..\dist"
}

Write-Host "============================================================" -ForegroundColor Green
Write-Host "   HEINEKEN SDIP END-TO-END PIPELINE - BULK ULTRA-FAST" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

$swTotal = [System.Diagnostics.Stopwatch]::StartNew()
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$subdMap = [ordered]@{}
$areaSummary = @{
    "South 2" = @{ Target = 0; Target_AA = 0; Target_BB = 0; Actual_SI = 0; Actual_SO = 0; Actual_SI_AA = 0; Actual_SI_BB = 0; SubD_Count = 0; SDIP_Count = 0 }
    "South 9" = @{ Target = 0; Target_AA = 0; Target_BB = 0; Actual_SI = 0; Actual_SO = 0; Actual_SI_AA = 0; Actual_SI_BB = 0; SubD_Count = 0; SDIP_Count = 0 }
}

$olMasterMap = @{}
$inactiveOutletsList = [System.Collections.ArrayList]::new()
$supervisorsSet = [System.Collections.Generic.HashSet[string]]::new()
$salesRepsSet = [System.Collections.Generic.HashSet[string]]::new()

# Bulletproof UTF-8 constants (immune to shell encoding / ANSI codepage)
$VN_NGUYEN_THANH_AN = [System.Text.Encoding]::UTF8.GetString([byte[]]@(0x4E, 0x67, 0x75, 0x79, 0xE1, 0xBB, 0x85, 0x6E, 0x20, 0x54, 0x68, 0xC3, 0xA0, 0x6E, 0x68, 0x20, 0xC3, 0x82, 0x6E))
$VN_CHUA_PHAN_BO    = [System.Text.Encoding]::UTF8.GetString([byte[]]@(0x43, 0x68, 0xC6, 0xB0, 0x61, 0x20, 0x70, 0x68, 0xC3, 0xA2, 0x6E, 0x20, 0x62, 0xE1, 0xBB, 0x95))

try {
    # --------------------------------------------------------------------------
    # 1. READ DIM/OL YTD.XLSX (Master Outlets & SS/SR/ASM Mapping)
    # --------------------------------------------------------------------------
    $olYtdFile = Join-Path $DimDir "OL YTD.xlsx"
    if (Test-Path -LiteralPath $olYtdFile) {
        Write-Host "`n[1/5] Reading Master Outlets ($olYtdFile)..." -ForegroundColor Cyan
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $wbOL = $excel.Workbooks.Open($olYtdFile, 0, $true)
        $wsOL = $wbOL.Worksheets.Item("Export")
        $arrOL = $wsOL.UsedRange.Value2
        $wbOL.Close($false)
        $sw.Stop()

        $olRows = $arrOL.GetLength(0)
        for ($r = 2; $r -le $olRows; $r++) {
            $code = [string]$arrOL[$r, 1]
            if (-not $code) { continue }
            $sr = [string]$arrOL[$r, 35]
            $ss = [string]$arrOL[$r, 38]
            $asm = [string]$arrOL[$r, 40]
            $area = [string]$arrOL[$r, 32]
            $subd = [string]$arrOL[$r, 29]

            if ($ss) { [void]$supervisorsSet.Add($ss) }
            if ($sr) { [void]$salesRepsSet.Add($sr) }

            $olMasterMap[$code] = @{
                code = $code
                name = [string]$arrOL[$r, 2]
                sr   = $sr
                ss   = $ss
                asm  = $asm
                area = $area
                subd = $subd
            }
        }
        Write-Host "   -> Loaded $($olMasterMap.Count) Outlets ($($supervisorsSet.Count) SS, $($salesRepsSet.Count) SR) in $($sw.ElapsedMilliseconds) ms" -ForegroundColor Gray
    } else {
        Write-Host "   [!] Warning: OL YTD.xlsx not found at $olYtdFile" -ForegroundColor Yellow
    }

    # --------------------------------------------------------------------------
    # 2. READ OVERVIEW.XLSX (Doanh số, Chỉ tiêu AA - BB, Tồn kho SCD, %SDIP)
    # --------------------------------------------------------------------------
    $overviewFile = Join-Path $BaseDataDir "OverView.xlsx"
    if (-not (Test-Path -LiteralPath $overviewFile)) {
        $overviewFile = Join-Path $BaseDataDir "Overview.xlsx"
    }
    Write-Host "`n[2/5] Reading Overview file ($overviewFile)..." -ForegroundColor Cyan
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $wbOver = $excel.Workbooks.Open($overviewFile, 0, $true)
    $wsOver = $wbOver.Worksheets.Item("Export")
    $arrOver = $wsOver.UsedRange.Value2
    $wbOver.Close($false)
    $sw.Stop()

    $overRows = $arrOver.GetLength(0)
    for ($r = 2; $r -le $overRows; $r++) {
        $id = [string]$arrOver[$r, 1]
        $name = [string]$arrOver[$r, 2]
        $area = [string]$arrOver[$r, 3]

        if (-not $id -or ($area -ne "South 2" -and $area -ne "South 9")) {
            continue
        }

        $valSI = $arrOver[$r, 4]; $si = 0; [double]::TryParse([string]$valSI, [ref]$si) | Out-Null
        $valSO = $arrOver[$r, 5]; $so = 0; [double]::TryParse([string]$valSO, [ref]$so) | Out-Null
        $isSDIP = ([string]$arrOver[$r, 6] -eq "Yes")

        $valSCD = $arrOver[$r, 11]; $scd = 0; [double]::TryParse([string]$valSCD, [ref]$scd) | Out-Null
        $valSKU = $arrOver[$r, 13]; $sku_count = 0; [int]::TryParse([string]$valSKU, [ref]$sku_count) | Out-Null
        $valFill = $arrOver[$r, 14]; $fill_rate = 0; [double]::TryParse([string]$valFill, [ref]$fill_rate) | Out-Null
        $valASOAct = $arrOver[$r, 16]; $aso_active = 0; [int]::TryParse([string]$valASOAct, [ref]$aso_active) | Out-Null
        $valASOTot = $arrOver[$r, 17]; $aso_total = 0; [int]::TryParse([string]$valASOTot, [ref]$aso_total) | Out-Null

        # Targets for Month 2026-09
        $valAATarget = $arrOver[$r, 19]; $target_aa = 0; [double]::TryParse([string]$valAATarget, [ref]$target_aa) | Out-Null
        $valBBTarget = $arrOver[$r, 23]; $target_bb = 0; [double]::TryParse([string]$valBBTarget, [ref]$target_bb) | Out-Null
        $target_tot = $target_aa + $target_bb

        $fillRateVal = if ($fill_rate -le 1 -and $fill_rate -gt 0) { [math]::Round($fill_rate * 100, 1) } else { [math]::Round($fill_rate, 1) }
        $asoPctVal = if ($aso_total -gt 0) { [math]::Round(($aso_active / $aso_total) * 100, 1) } else { 0 }
        $scdStatus = if ($scd -gt 7) { "RED_HIGH" } elseif ($scd -lt 3 -and $scd -gt 0) { "YELLOW_LOW" } else { "GREEN_SAFE" }

        $ssDefault = if ($area -eq "South 2") { $VN_NGUYEN_THANH_AN } else { "" }

        $subdMap[$id] = [ordered]@{
            subd_id               = $id
            subd_name             = $name
            area_name             = $area
            ss_name               = $ssDefault
            sr_name               = ""
            asm_name              = ""
            npp_code              = ""
            is_sdip               = $isSDIP
            target_total          = [math]::Round($target_tot, 1)
            target_aa             = [math]::Round($target_aa, 1)
            target_bb             = [math]::Round($target_bb, 1)
            actual_si             = 0.0
            actual_so             = 0.0
            actual_si_aa          = 0.0
            actual_so_aa          = 0.0
            actual_si_bb          = 0.0
            actual_so_bb          = 0.0
            target_achieve_pct    = 0.0
            target_aa_pct         = 0.0
            target_bb_pct         = 0.0
            so_vs_si_pct          = 0.0
            scd                   = [math]::Round($scd, 1)
            fill_rate_pct         = $fillRateVal
            aso_active            = $aso_active
            aso_total             = $aso_total
            aso_pct               = $asoPctVal
            inactive_outlets_count= 0
            sku_count             = $sku_count
            scd_status            = $scdStatus
            sku_target_total      = 0.0
            sku_target_hs2        = 0.0
            sku_target_ts25       = 0.0
            sku_target_lmc        = 0.0
            sku_target_others     = 0.0
            sku_si_hs2            = 0.0
            sku_si_ts25           = 0.0
            sku_si_lmc            = 0.0
            sku_si_others         = 0.0
            sku_so_hs2            = 0.0
            sku_so_ts25           = 0.0
            sku_so_lmc            = 0.0
            sku_so_others         = 0.0
            sku_performance       = $null
            sku_targets           = @{}
            sku_si                = @{}
            sku_so                = @{}
            sku_list              = [System.Collections.ArrayList]::new()
            inactive_outlets      = [System.Collections.ArrayList]::new()
            zalo_phone            = ""
        }

        $areaSummary[$area].Target += $target_tot
        $areaSummary[$area].Target_AA += $target_aa
        $areaSummary[$area].Target_BB += $target_bb
        $areaSummary[$area].SubD_Count++
        if ($isSDIP) { $areaSummary[$area].SDIP_Count++ }
    }
    Write-Host "   -> Loaded $($subdMap.Count) SubDs with September Targets in $($sw.ElapsedMilliseconds) ms" -ForegroundColor Gray

    # --------------------------------------------------------------------------
    # 2a. READ TARGET FILES FOR SKU-LEVEL TARGETS (HS2, TS25, LMC, Others)
    # --------------------------------------------------------------------------
    $targetDir = Join-Path $BaseDataDir "target"
    if (Test-Path -LiteralPath $targetDir) {
        Write-Host "`n[2a/5] Reading SKU-level Targets from $targetDir..." -ForegroundColor Cyan
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $tFiles = Get-ChildItem -Path $targetDir -Filter "*.xlsx"
        $skuTargetLoaded = 0
        foreach ($tFile in $tFiles) {
            $wbT = $excel.Workbooks.Open($tFile.FullName, 0, $true)
            $wsT = $wbT.Worksheets.Item(1)
            $arrT = $wsT.UsedRange.Value2
            $wbT.Close($false)

            $colsT = $arrT.GetLength(1)
            $rowsT = $arrT.GetLength(0)

            $cHS2 = 0; $cTS25 = 0; $cLMC = 0; $cTot = 0
            $skuTargetCols = @{}
            for ($c = 1; $c -le $colsT; $c++) {
                $h = [string]($arrT[1, $c])
                $r2 = [string]($arrT[2, $c])
                if ($h -eq "HS2") { $cHS2 = $c }
                elseif ($h -eq "TS25") { $cTS25 = $c }
                elseif ($h -eq "LMC") { $cLMC = $c }
                elseif ($h -eq "Total") { $cTot = $c }
                
                if ($h -and $r2 -eq "Target" -and $h -ne "Total" -and $h -ne "AA" -and $h -ne "BB" -and $h -notlike "*Premium*" -and $h -notlike "*Good Value*" -and $h -notlike "*New Repertoire*") {
                    $skuTargetCols[$h] = $c
                }
            }

            for ($r = 3; $r -le $rowsT; $r++) {
                $code = [string]($arrT[$r, 3])
                if (-not $code -or -not $subdMap.Contains($code)) { continue }

                $subd = $subdMap[$code]
                $tTot = 0.0
                if ($cTot -gt 0 -and $arrT[$r, $cTot]) { 
                    $v = [string]($arrT[$r, $cTot])
                    [double]::TryParse($v, [ref]$tTot) | Out-Null 
                }
                $tHS2 = 0.0
                if ($cHS2 -gt 0 -and $arrT[$r, $cHS2]) { 
                    $v = [string]($arrT[$r, $cHS2])
                    [double]::TryParse($v, [ref]$tHS2) | Out-Null 
                }
                $tTS25 = 0.0
                if ($cTS25 -gt 0 -and $arrT[$r, $cTS25]) { 
                    $v = [string]($arrT[$r, $cTS25])
                    [double]::TryParse($v, [ref]$tTS25) | Out-Null 
                }
                $tLMC = 0.0
                if ($cLMC -gt 0 -and $arrT[$r, $cLMC]) { 
                    $v = [string]($arrT[$r, $cLMC])
                    [double]::TryParse($v, [ref]$tLMC) | Out-Null 
                }
                $tOthers = [Math]::Max(0.0, $tTot - ($tHS2 + $tTS25 + $tLMC))

                $subd.sku_target_total  = [math]::Round($tTot, 1)
                $subd.sku_target_hs2    = [math]::Round($tHS2, 1)
                $subd.sku_target_ts25   = [math]::Round($tTS25, 1)
                $subd.sku_target_lmc    = [math]::Round($tLMC, 1)
                $subd.sku_target_others = [math]::Round($tOthers, 1)

                # Store all SKU targets
                foreach ($skuName in $skuTargetCols.Keys) {
                    $cCol = $skuTargetCols[$skuName]
                    $tVal = 0.0
                    $rawVal = $arrT[$r, $cCol]
                    if ($rawVal) {
                        [double]::TryParse([string]$rawVal, [ref]$tVal) | Out-Null
                    }
                    if ($tVal -gt 0) {
                        $subd.sku_targets[$skuName] = [math]::Round($tVal, 1)
                    }
                }
                $skuTargetLoaded++
            }
        }
        $sw.Stop()
        Write-Host "   -> Loaded SKU targets for $skuTargetLoaded SubDs in $($sw.ElapsedMilliseconds) ms" -ForegroundColor Gray
    }

    # --------------------------------------------------------------------------
    # 2b. READ DIS VOLUME.XLSX (Actual Sell-In & Sell-Out MTD Month 202609)
    # --------------------------------------------------------------------------
    $disFile = Join-Path $BaseDataDir "DIS Volume.xlsx"
    if (Test-Path -LiteralPath $disFile) {
        Write-Host "`n[2b/5] Reading September MTD Sell-In & Sell-Out from DIS Volume ($disFile)..." -ForegroundColor Cyan
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $wbDis = $excel.Workbooks.Open($disFile, 0, $true)
        $wsDis = $wbDis.Worksheets.Item(1)
        $arrDis = $wsDis.UsedRange.Value2
        $wbDis.Close($false)
        $sw.Stop()

        $disRows = $arrDis.GetLength(0)
        $siMatchCount = 0
        $soMatchCount = 0
        $outletVolHistory = @{}

        for ($r = 2; $r -le $disRows; $r++) {
            $m = [string]($arrDis[$r, 11])
            $valUom = $arrDis[$r, 15]
            $uom = 0.0
            if ($valUom) { [double]::TryParse([string]$valUom, [ref]$uom) | Out-Null }

            # Track 3-month outlet volume history (Col 7: To_Customer_ID)
            $toCust = [string]($arrDis[$r, 7])
            if ($toCust -and $uom -gt 0) {
                if (-not $outletVolHistory.ContainsKey($toCust)) {
                    $outletVolHistory[$toCust] = @{ v7 = 0.0; v8 = 0.0; v9 = 0.0 }
                }
                if ($m -eq "202607") {
                    $outletVolHistory[$toCust].v7 += $uom
                } elseif ($m -eq "202608") {
                    $outletVolHistory[$toCust].v8 += $uom
                } elseif ($m -eq "202609") {
                    $outletVolHistory[$toCust].v9 += $uom
                }
            }

            # SubD Sell-In & Sell-Out only for current month 202609
            if ($m -ne "202609") { continue }

            $buyFrom = [string]($arrDis[$r, 4])

            $skuShort = [string]($arrDis[$r, 14])

            if ($buyFrom -eq "Distributor") {
                # Sell-In to SubD
                if ($subdMap.Contains($toCust)) {
                    $line = [string]($arrDis[$r, 13])
                    $brand = [string]($arrDis[$r, 12])
                    $isAA = ($line -like "*Silver*" -or $line -like "*Crystal*" -or $line -like "*Smooth*" -or 
                             $brand -like "*Silver*" -or $brand -like "*Crystal*" -or $brand -like "*Smooth*")

                    $subd = $subdMap[$toCust]
                    $subd.actual_si += $uom
                    if ($isAA) {
                        $subd.actual_si_aa += $uom
                    } else {
                        $subd.actual_si_bb += $uom
                    }

                    # SKU-level SI
                    if ($skuShort -eq "HS2") { $subd.sku_si_hs2 += $uom }
                    elseif ($skuShort -eq "TS25") { $subd.sku_si_ts25 += $uom }
                    elseif ($skuShort -eq "LMC") { $subd.sku_si_lmc += $uom }
                    else { $subd.sku_si_others += $uom }

                    if ($skuShort) {
                        if (-not $subd.sku_si.ContainsKey($skuShort)) { $subd.sku_si[$skuShort] = 0.0 }
                        $subd.sku_si[$skuShort] += $uom
                    }

                    $siMatchCount++
                }
            } elseif ($buyFrom -eq "Sub Distributor") {
                # Sell-Out from SubD
                $fromCust = [string]($arrDis[$r, 5])
                if ($subdMap.Contains($fromCust)) {
                    $line = [string]($arrDis[$r, 13])
                    $brand = [string]($arrDis[$r, 12])
                    $isAA = ($line -like "*Silver*" -or $line -like "*Crystal*" -or $line -like "*Smooth*" -or 
                             $brand -like "*Silver*" -or $brand -like "*Crystal*" -or $brand -like "*Smooth*")

                    $subd = $subdMap[$fromCust]
                    $subd.actual_so += $uom
                    if ($isAA) {
                        $subd.actual_so_aa += $uom
                    } else {
                        $subd.actual_so_bb += $uom
                    }

                    # SKU-level SO
                    if ($skuShort -eq "HS2") { $subd.sku_so_hs2 += $uom }
                    elseif ($skuShort -eq "TS25") { $subd.sku_so_ts25 += $uom }
                    elseif ($skuShort -eq "LMC") { $subd.sku_so_lmc += $uom }
                    else { $subd.sku_so_others += $uom }

                    if ($skuShort) {
                        if (-not $subd.sku_so.ContainsKey($skuShort)) { $subd.sku_so[$skuShort] = 0.0 }
                        $subd.sku_so[$skuShort] += $uom
                    }

                    $soMatchCount++
                }
            }
        }
        Write-Host "   -> Processed $disRows rows in $($sw.ElapsedMilliseconds) ms (SI matched: $siMatchCount, SO matched: $soMatchCount, Outlets tracked: $($outletVolHistory.Count))" -ForegroundColor Gray

        # Recalculate achievement percentages and area summaries with Month 202609 actuals
        foreach ($subd in $subdMap.Values) {
            $subd.actual_si = [math]::Round($subd.actual_si, 1)
            $subd.actual_so = [math]::Round($subd.actual_so, 1)
            $subd.actual_si_aa = [math]::Round($subd.actual_si_aa, 1)
            $subd.actual_so_aa = [math]::Round($subd.actual_so_aa, 1)
            $subd.actual_si_bb = [math]::Round($subd.actual_si_bb, 1)
            $subd.actual_so_bb = [math]::Round($subd.actual_so_bb, 1)

            $subd.target_achieve_pct = if ($subd.target_total -gt 0) { [math]::Round(($subd.actual_si / $subd.target_total) * 100, 1) } else { 0 }
            $subd.target_aa_pct = if ($subd.target_aa -gt 0) { [math]::Round(($subd.actual_si_aa / $subd.target_aa) * 100, 1) } else { 0 }
            $subd.target_bb_pct = if ($subd.target_bb -gt 0) { [math]::Round(($subd.actual_si_bb / $subd.target_bb) * 100, 1) } else { 0 }
            $subd.so_vs_si_pct = if ($subd.actual_si -gt 0) { [math]::Round(($subd.actual_so / $subd.actual_si) * 100, 1) } else { 0 }

            # SKU Level Rounding & Performance Object
            $subd.sku_si_hs2 = [math]::Round($subd.sku_si_hs2, 1)
            $subd.sku_si_ts25 = [math]::Round($subd.sku_si_ts25, 1)
            $subd.sku_si_lmc = [math]::Round($subd.sku_si_lmc, 1)
            $subd.sku_si_others = [math]::Round($subd.sku_si_others, 1)
            $subd.sku_so_hs2 = [math]::Round($subd.sku_so_hs2, 1)
            $subd.sku_so_ts25 = [math]::Round($subd.sku_so_ts25, 1)
            $subd.sku_so_lmc = [math]::Round($subd.sku_so_lmc, 1)
            $subd.sku_so_others = [math]::Round($subd.sku_so_others, 1)

            $pctSI_hs2 = if ($subd.sku_target_hs2 -gt 0) { [math]::Round(($subd.sku_si_hs2 / $subd.sku_target_hs2) * 100, 1) } else { 0.0 }
            $pctSOSI_hs2 = if ($subd.sku_si_hs2 -gt 0) { [math]::Round(($subd.sku_so_hs2 / $subd.sku_si_hs2) * 100, 1) } else { 0.0 }

            $pctSI_ts25 = if ($subd.sku_target_ts25 -gt 0) { [math]::Round(($subd.sku_si_ts25 / $subd.sku_target_ts25) * 100, 1) } else { 0.0 }
            $pctSOSI_ts25 = if ($subd.sku_si_ts25 -gt 0) { [math]::Round(($subd.sku_so_ts25 / $subd.sku_si_ts25) * 100, 1) } else { 0.0 }

            $pctSI_lmc = if ($subd.sku_target_lmc -gt 0) { [math]::Round(($subd.sku_si_lmc / $subd.sku_target_lmc) * 100, 1) } else { 0.0 }
            $pctSOSI_lmc = if ($subd.sku_si_lmc -gt 0) { [math]::Round(($subd.sku_so_lmc / $subd.sku_si_lmc) * 100, 1) } else { 0.0 }

            $pctSI_others = if ($subd.sku_target_others -gt 0) { [math]::Round(($subd.sku_si_others / $subd.sku_target_others) * 100, 1) } else { 0.0 }
            $pctSOSI_others = if ($subd.sku_si_others -gt 0) { [math]::Round(($subd.sku_so_others / $subd.sku_si_others) * 100, 1) } else { 0.0 }

            $subd.sku_performance = [ordered]@{
                hs2 = [ordered]@{
                    name      = "Heineken Silver (HS2)"
                    target    = $subd.sku_target_hs2
                    si        = $subd.sku_si_hs2
                    so        = $subd.sku_so_hs2
                    pct_si    = $pctSI_hs2
                    pct_so_si = $pctSOSI_hs2
                }
                ts25 = [ordered]@{
                    name      = "Tiger Crystal 250 (TS25)"
                    target    = $subd.sku_target_ts25
                    si        = $subd.sku_si_ts25
                    so        = $subd.sku_so_ts25
                    pct_si    = $pctSI_ts25
                    pct_so_si = $pctSOSI_ts25
                }
                lmc = [ordered]@{
                    name      = "Larue Smooth (LMC)"
                    target    = $subd.sku_target_lmc
                    si        = $subd.sku_si_lmc
                    so        = $subd.sku_so_lmc
                    pct_si    = $pctSI_lmc
                    pct_so_si = $pctSOSI_lmc
                }
                others = [ordered]@{
                    name      = "Others (Các Dòng Khác)"
                    target    = $subd.sku_target_others
                    si        = $subd.sku_si_others
                    so        = $subd.sku_so_others
                    pct_si    = $pctSI_others
                    pct_so_si = $pctSOSI_others
                }
            }

            $area = $subd.area_name
            $areaSummary[$area].Actual_SI += $subd.actual_si
            $areaSummary[$area].Actual_SO += $subd.actual_so
            $areaSummary[$area].Actual_SI_AA += $subd.actual_si_aa
            $areaSummary[$area].Actual_SI_BB += $subd.actual_si_bb
        }
    } else {
        Write-Host "   [!] Warning: DIS Volume.xlsx not found at $disFile" -ForegroundColor Yellow
    }

    # --------------------------------------------------------------------------
    # 3. READ SCD.XLSX (SKU-Level Stock & Days)
    # --------------------------------------------------------------------------
    $scdFile = Join-Path $BaseDataDir "SCD.xlsx"
    if (Test-Path -LiteralPath $scdFile) {
        Write-Host "`n[3/5] Reading SCD inventory ($scdFile)..." -ForegroundColor Cyan
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $wbSCD = $excel.Workbooks.Open($scdFile, 0, $true)
        $wsSCD = $wbSCD.Worksheets.Item("Export")
        $arrSCD = $wsSCD.UsedRange.Value2
        $wbSCD.Close($false)
        $sw.Stop()

        $scdRows = $arrSCD.GetLength(0)
        $scdCount = 0
        for ($r = 2; $r -le $scdRows; $r++) {
            $subdCode = [string]$arrSCD[$r, 3]
            if (-not $subdCode -or -not $subdMap.Contains($subdCode)) { continue }

            $subd = $subdMap[$subdCode]
            $brand = [string]$arrSCD[$r, 5]
            $shortCode = [string]$arrSCD[$r, 8]
            $salesName = [string]$arrSCD[$r, 9]

            $valStock = $arrSCD[$r, 12]; $stock = 0; [double]::TryParse([string]$valStock, [ref]$stock) | Out-Null
            $valScdVal = $arrSCD[$r, 13]; $scdVal = 0; [double]::TryParse([string]$valScdVal, [ref]$scdVal) | Out-Null
            $valSi30 = $arrSCD[$r, 10]; $si30 = 0; [double]::TryParse([string]$valSi30, [ref]$si30) | Out-Null
            $valSo30 = $arrSCD[$r, 11]; $so30 = 0; [double]::TryParse([string]$valSo30, [ref]$so30) | Out-Null

            $skuStatus = if ($scdVal -gt 7) { "RED_HIGH" } elseif ($scdVal -lt 3 -and $scdVal -gt 0) { "YELLOW_LOW" } else { "GREEN_SAFE" }

            $skuTarget = 0.0
            if ($subd.sku_targets.ContainsKey($shortCode)) { $skuTarget = $subd.sku_targets[$shortCode] }
            elseif ($shortCode -eq "HS2") { $skuTarget = $subd.sku_target_hs2 }
            elseif ($shortCode -eq "TS25") { $skuTarget = $subd.sku_target_ts25 }
            elseif ($shortCode -eq "LMC") { $skuTarget = $subd.sku_target_lmc }

            $skuSI = 0.0
            if ($subd.sku_si.ContainsKey($shortCode)) { $skuSI = [math]::Round($subd.sku_si[$shortCode], 1) }
            elseif ($shortCode -eq "HS2") { $skuSI = $subd.sku_si_hs2 }
            elseif ($shortCode -eq "TS25") { $skuSI = $subd.sku_si_ts25 }
            elseif ($shortCode -eq "LMC") { $skuSI = $subd.sku_si_lmc }

            $skuSO = 0.0
            if ($subd.sku_so.ContainsKey($shortCode)) { $skuSO = [math]::Round($subd.sku_so[$shortCode], 1) }
            elseif ($shortCode -eq "HS2") { $skuSO = $subd.sku_so_hs2 }
            elseif ($shortCode -eq "TS25") { $skuSO = $subd.sku_so_ts25 }
            elseif ($shortCode -eq "LMC") { $skuSO = $subd.sku_so_lmc }

            [void]$subd.sku_list.Add([ordered]@{
                brand      = $brand
                short_code = $shortCode
                sku_name   = $salesName
                target     = [math]::Round($skuTarget, 1)
                actual_si  = [math]::Round($skuSI, 1)
                actual_so  = [math]::Round($skuSO, 1)
                stock      = [math]::Round($stock, 1)
                scd        = [math]::Round($scdVal, 1)
                si_30d     = [math]::Round($si30, 1)
                so_30d     = [math]::Round($so30, 1)
                status     = $skuStatus
            })
            $scdCount++
        }

        # Ensure priority SKUs (HS2, TS25, LMC) exist in sku_list for each SubD
        foreach ($subd in $subdMap.Values) {
            $existingCodes = [System.Collections.Generic.HashSet[string]]::new()
            foreach ($sku in $subd.sku_list) { [void]$existingCodes.Add($sku.short_code) }
            
            $focusList = @(
                @{ code = "HS2";  brand = "HEINEKEN"; name = "Heineken Silver Sleek Can 24s (250)"; t = $subd.sku_target_hs2;  si = $subd.sku_si_hs2;  so = $subd.sku_so_hs2 },
                @{ code = "TS25"; brand = "TIGER";    name = "Tiger Crystal Sleek Can 24s (250)";    t = $subd.sku_target_ts25; si = $subd.sku_si_ts25; so = $subd.sku_so_ts25 },
                @{ code = "LMC";  brand = "LARUE";    name = "Larue Smooth Sleek Can 24s (330)";     t = $subd.sku_target_lmc;  si = $subd.sku_si_lmc;  so = $subd.sku_so_lmc }
            )
            foreach ($f in $focusList) {
                if (-not $existingCodes.Contains($f.code) -and ($f.t -gt 0 -or $f.si -gt 0 -or $f.so -gt 0)) {
                    [void]$subd.sku_list.Add([ordered]@{
                        brand      = $f.brand
                        short_code = $f.code
                        sku_name   = $f.name
                        target     = [math]::Round($f.t, 1)
                        actual_si  = [math]::Round($f.si, 1)
                        actual_so  = [math]::Round($f.so, 1)
                        stock      = 0.0
                        scd        = 0.0
                        si_30d     = 0.0
                        so_30d     = 0.0
                        status     = "GREEN_SAFE"
                    })
                }
            }
        }
        Write-Host "   -> Loaded $scdCount SKU records in $($sw.ElapsedMilliseconds) ms" -ForegroundColor Gray
    }

    # --------------------------------------------------------------------------
    # 4. READ ASO DETAIL.XLSX (Tracking ASO & Outlets Chưa Có Đơn)
    # --------------------------------------------------------------------------
    $asoFile = Join-Path $BaseDataDir "ASO detail.xlsx"
    if (Test-Path -LiteralPath $asoFile) {
        Write-Host "`n[4/5] Reading ASO Detail ($asoFile)..." -ForegroundColor Cyan
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $wbASO = $excel.Workbooks.Open($asoFile, 0, $true)
        $wsASO = $wbASO.Worksheets.Item("Export")
        $arrASO = $wsASO.UsedRange.Value2
        $wbASO.Close($false)
        $sw.Stop()

        $asoRows = $arrASO.GetLength(0)
        $inactiveTotal = 0
        for ($r = 3; $r -le $asoRows; $r++) {
            $subdCode = [string]$arrASO[$r, 4]
            $subdName = [string]$arrASO[$r, 5]
            $area = [string]$arrASO[$r, 1]
            $city = [string]$arrASO[$r, 2]
            $province = [string]$arrASO[$r, 3]
            $outletCode = [string]$arrASO[$r, 6]
            $outletName = [string]$arrASO[$r, 7]

            $valOrders = $arrASO[$r, 9]; $orders = 0; [int]::TryParse([string]$valOrders, [ref]$orders) | Out-Null
            $valQty = $arrASO[$r, 10]; $qty = 0; [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null

            if ($orders -eq 0) {
                # Look up rep & supervisor from master outlet mapping
                $srName = $VN_CHUA_PHAN_BO; $ssName = $VN_CHUA_PHAN_BO; $asmName = $VN_CHUA_PHAN_BO
                if ($olMasterMap.ContainsKey($outletCode)) {
                    $m = $olMasterMap[$outletCode]
                    if ($m.sr) { $srName = $m.sr }
                    if ($m.ss) { $ssName = $m.ss }
                    if ($m.asm) { $asmName = $m.asm }
                }

                # Link primary rep/supervisor to SubD if not yet assigned
                if ($subdMap.Contains($subdCode)) {
                    $subd = $subdMap[$subdCode]
                    $subd.inactive_outlets_count++
                    if ($subd.area_name -eq "South 2") {
                        $subd.ss_name = $VN_NGUYEN_THANH_AN
                    } elseif (-not $subd.ss_name -and $ssName -ne $VN_CHUA_PHAN_BO) {
                        $subd.ss_name = $ssName
                        $subd.sr_name = $srName
                        $subd.asm_name = $asmName
                    }
                }

                $v7 = 0.0; $v8 = 0.0; $v9 = 0.0
                if ($outletVolHistory -and $outletVolHistory.ContainsKey($outletCode)) {
                    $v7 = [math]::Round($outletVolHistory[$outletCode].v7, 1)
                    $v8 = [math]::Round($outletVolHistory[$outletCode].v8, 1)
                    $v9 = [math]::Round($outletVolHistory[$outletCode].v9, 1)
                }

                $warningLevel = if ($v7 -eq 0 -and $v8 -eq 0 -and $v9 -eq 0) {
                    "HIGH_3M"
                } elseif ($v7 -gt 0 -or $v8 -gt 0) {
                    "CHURN_RISK"
                } else {
                    "NORMAL"
                }

                [void]$inactiveOutletsList.Add([ordered]@{
                    outlet_code   = $outletCode
                    outlet_name   = $outletName
                    subd_code     = $subdCode
                    subd_name     = $subdName
                    area_name     = $area
                    city          = $city
                    province      = $province
                    sr_name       = $srName
                    ss_name       = $ssName
                    asm_name      = $asmName
                    vol_t7        = $v7
                    vol_t8        = $v8
                    vol_t9        = $v9
                    warning_level = $warningLevel
                })
                $inactiveTotal++
            }
        }
        Write-Host "   -> Identified $inactiveTotal Non-Ordering Outlets in $($sw.ElapsedMilliseconds) ms" -ForegroundColor Gray
    }

    # --------------------------------------------------------------------------
    # 5. PACKAGING PAYLOAD & EXPORT
    # --------------------------------------------------------------------------
    # Attach NPP Mapping
    $nppMapPath = Join-Path $PSScriptRoot "..\dist\subd_npp_map.json"
    if (Test-Path -LiteralPath $nppMapPath) {
        $nppJson = Get-Content -LiteralPath $nppMapPath -Raw -Encoding UTF8 | ConvertFrom-Json
        foreach ($sId in $subdMap.Keys) {
            if ($nppJson.PSObject.Properties[$sId]) {
                $subdMap[$sId].npp_code = [string]$nppJson.$sId
            }
        }
    }

    $finalSubDList = [System.Collections.ArrayList]::new($subdMap.Values)

    $totSI = $areaSummary["South 2"].Actual_SI + $areaSummary["South 9"].Actual_SI
    $totSO = $areaSummary["South 2"].Actual_SO + $areaSummary["South 9"].Actual_SO
    $totTarget = $areaSummary["South 2"].Target + $areaSummary["South 9"].Target
    $totAATarget = $areaSummary["South 2"].Target_AA + $areaSummary["South 9"].Target_AA
    $totAASI = $areaSummary["South 2"].Actual_SI_AA + $areaSummary["South 9"].Actual_SI_AA
    $totBBTarget = $areaSummary["South 2"].Target_BB + $areaSummary["South 9"].Target_BB
    $totBBSI = $areaSummary["South 2"].Actual_SI_BB + $areaSummary["South 9"].Actual_SI_BB

    $totAchieve = if ($totTarget -gt 0) { [math]::Round(($totSI / $totTarget) * 100, 1) } else { 0 }
    $totSoSi = if ($totSI -gt 0) { [math]::Round(($totSO / $totSI) * 100, 1) } else { 0 }
    $totAAAchieve = if ($totAATarget -gt 0) { [math]::Round(($totAASI / $totAATarget) * 100, 1) } else { 0 }
    $totBBAchieve = if ($totBBTarget -gt 0) { [math]::Round(($totBBSI / $totBBTarget) * 100, 1) } else { 0 }

    # Extract distinct list of Supervisors and Sales Reps from loaded data
    $distinctSS = [System.Collections.ArrayList]::new()
    $distinctSR = [System.Collections.ArrayList]::new()
    foreach ($item in $inactiveOutletsList) {
        if ($item.ss_name -and $item.ss_name -ne $VN_CHUA_PHAN_BO -and -not $distinctSS.Contains($item.ss_name)) {
            [void]$distinctSS.Add($item.ss_name)
        }
        if ($item.sr_name -and $item.sr_name -ne $VN_CHUA_PHAN_BO -and -not $distinctSR.Contains($item.sr_name)) {
            [void]$distinctSR.Add($item.sr_name)
        }
    }
    if (-not $distinctSS.Contains($VN_NGUYEN_THANH_AN)) {
        [void]$distinctSS.Add($VN_NGUYEN_THANH_AN)
    }
    $distinctSS.Sort()
    $distinctSR.Sort()

    $payload = [ordered]@{
        metadata = [ordered]@{
            report_month    = "2026-09"
            report_title    = "Heineken SDIP SubD & Sales Performance Tracking Dashboard"
            generated_at    = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            total_subds     = $finalSubDList.Count
            south2_subds    = $areaSummary["South 2"].SubD_Count
            south9_subds    = $areaSummary["South 9"].SubD_Count
            sdip_subds      = ($areaSummary["South 2"].SDIP_Count + $areaSummary["South 9"].SDIP_Count)
        }
        kpis = [ordered]@{
            total_target            = [math]::Round($totTarget, 0)
            total_actual_si         = [math]::Round($totSI, 0)
            total_actual_so         = [math]::Round($totSO, 0)
            achieve_pct             = $totAchieve
            so_vs_si_pct            = $totSoSi
            sdip_aa_target          = [math]::Round($totAATarget, 0)
            sdip_aa_si              = [math]::Round($totAASI, 0)
            sdip_aa_achieve_pct     = $totAAAchieve
            sdip_bb_target          = [math]::Round($totBBTarget, 0)
            sdip_bb_si              = [math]::Round($totBBSI, 0)
            sdip_bb_achieve_pct     = $totBBAchieve
            total_inactive_outlets  = $inactiveTotal
            south2                  = $areaSummary["South 2"]
            south9                  = $areaSummary["South 9"]
        }
        dimension_filters = [ordered]@{
            areas       = @("South 2", "South 9")
            supervisors = $distinctSS
            sales_reps  = $distinctSR
        }
        subd_list = $finalSubDList
        inactive_outlets_master = $inactiveOutletsList
    }

    $jsonOutPath = Join-Path $OutputDir "sdip_data_202609.json"
    $distJsonPath = Join-Path $ProjectDistDir "sdip_data_202609.json"
    
    $jsonContent = $payload | ConvertTo-Json -Compress -Depth 6
    [System.IO.File]::WriteAllText($jsonOutPath, $jsonContent, [System.Text.Encoding]::UTF8)
    if (Test-Path -LiteralPath (Split-Path -Parent $distJsonPath)) {
        [System.IO.File]::WriteAllText($distJsonPath, $jsonContent, [System.Text.Encoding]::UTF8)
    }

    $swTotal.Stop()
    $sizeKB = [math]::Round((Get-Item $jsonOutPath).Length / 1024, 1)

    Write-Host "`n============================================================" -ForegroundColor Green
    Write-Host "   PIPELINE COMPLETED IN $($swTotal.Elapsed.TotalSeconds.ToString('F2')) SECONDS!" -ForegroundColor Green
    Write-Host "   JSON Data File : $jsonOutPath ($sizeKB KB)" -ForegroundColor White
    Write-Host "   Total SubDs    : $($finalSubDList.Count) (SDIP: $($payload.metadata.sdip_subds))" -ForegroundColor White
    Write-Host "   Total Target   : $([string]::Format('{0:N0}', $totTarget))" -ForegroundColor White
    Write-Host "   Total SI       : $([string]::Format('{0:N0}', $totSI)) ($totAchieve%)" -ForegroundColor White
    Write-Host "   Focus AA SI    : $([string]::Format('{0:N0}', $totAASI)) / $([string]::Format('{0:N0}', $totAATarget)) ($totAAAchieve%)" -ForegroundColor White
    Write-Host "   Normal BB SI   : $([string]::Format('{0:N0}', $totBBSI)) / $([string]::Format('{0:N0}', $totBBTarget)) ($totBBAchieve%)" -ForegroundColor White
    Write-Host "   Inactive ASO   : $([string]::Format('{0:N0}', $inactiveTotal)) Outlets" -ForegroundColor White
    Write-Host "============================================================" -ForegroundColor Green

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
