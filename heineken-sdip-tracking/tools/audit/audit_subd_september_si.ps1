$disPath = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$overPath = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Read 103 SubDs and Targets from OverView.xlsx
    $wbOver = $excel.Workbooks.Open($overPath, 0, $true)
    $wsOver = $wbOver.Worksheets.Item("Export")
    $arrOver = $wsOver.UsedRange.Value2
    $wbOver.Close($false)
    $overRows = $arrOver.GetLength(0)

    $subdMap = [ordered]@{}
    for ($r = 2; $r -le $overRows; $r++) {
        $id = [string]($arrOver[$r, 1])
        $name = [string]($arrOver[$r, 2])
        $area = [string]($arrOver[$r, 3])
        if (-not $id -or ($area -ne "South 2" -and $area -ne "South 9")) { continue }

        $valAATarget = $arrOver[$r, 19]; $target_aa = 0.0; [double]::TryParse([string]$valAATarget, [ref]$target_aa) | Out-Null
        $valBBTarget = $arrOver[$r, 23]; $target_bb = 0.0; [double]::TryParse([string]$valBBTarget, [ref]$target_bb) | Out-Null
        $valTotTarget = $target_aa + $target_bb
        $isSDIP = ([string]($arrOver[$r, 6]) -eq "Yes")

        $subdMap[$id] = @{
            id           = $id
            name         = $name
            area         = $area
            is_sdip      = $isSDIP
            target_aa    = $target_aa
            target_bb    = $target_bb
            target_tot   = $valTotTarget
            si_202609_tot = 0.0
            si_202609_aa  = 0.0
            si_202609_bb  = 0.0
            so_202609_tot = 0.0
        }
    }
    Write-Host "Loaded $($subdMap.Count) SubDs from OverView."

    # 2. Read Month 202609 SI & SO from DIS Volume.xlsx
    $wbDis = $excel.Workbooks.Open($disPath, 0, $true)
    $wsDis = $wbDis.Worksheets.Item(1)
    $arrDis = $wsDis.UsedRange.Value2
    $wbDis.Close($false)
    $disRows = $arrDis.GetLength(0)

    for ($r = 2; $r -le $disRows; $r++) {
        $m = [string]($arrDis[$r, 11])
        if ($m -ne "202609") { continue }

        $buyFrom = [string]($arrDis[$r, 4])
        $valUom = $arrDis[$r, 15]
        $uom = 0.0
        if ($valUom) { [double]::TryParse([string]$valUom, [ref]$uom) | Out-Null }

        if ($buyFrom -eq "Distributor") {
            # Sell-In to SubD
            $toCust = [string]($arrDis[$r, 7])
            if ($subdMap.Contains($toCust)) {
                $line = [string]($arrDis[$r, 13])
                $brand = [string]($arrDis[$r, 12])
                $isAA = ($line -like "*Silver*" -or $line -like "*Crystal*" -or $line -like "*Smooth*" -or 
                         $brand -like "*Silver*" -or $brand -like "*Crystal*" -or $brand -like "*Smooth*")

                $subdMap[$toCust].si_202609_tot += $uom
                if ($isAA) {
                    $subdMap[$toCust].si_202609_aa += $uom
                } else {
                    $subdMap[$toCust].si_202609_bb += $uom
                }
            }
        } elseif ($buyFrom -eq "Sub Distributor") {
            # Sell-Out from SubD
            $fromCust = [string]($arrDis[$r, 5])
            if ($subdMap.Contains($fromCust)) {
                $subdMap[$fromCust].so_202609_tot += $uom
            }
        }
    }

    # Summary by Area
    $s2_si = 0.0; $s2_aa = 0.0; $s2_bb = 0.0; $s2_tgt = 0.0; $s2_tgtaa = 0.0; $s2_tgtbb = 0.0
    $s9_si = 0.0; $s9_aa = 0.0; $s9_bb = 0.0; $s9_tgt = 0.0; $s9_tgtaa = 0.0; $s9_tgtbb = 0.0

    foreach ($id in $subdMap.Keys) {
        $s = $subdMap[$id]
        if ($s.area -eq "South 2") {
            $s2_si += $s.si_202609_tot
            $s2_aa += $s.si_202609_aa
            $s2_bb += $s.si_202609_bb
            $s2_tgt += $s.target_tot
            $s2_tgtaa += $s.target_aa
            $s2_tgtbb += $s.target_bb
        } else {
            $s9_si += $s.si_202609_tot
            $s9_aa += $s.si_202609_aa
            $s9_bb += $s.si_202609_bb
            $s9_tgt += $s.target_tot
            $s9_tgtaa += $s.target_aa
            $s9_tgtbb += $s.target_bb
        }
    }

    Write-Host "`n=== SOUTH 2 (Thang 9 MTD from DIS Volume) ==="
    Write-Host "Target Total : $([math]::Round($s2_tgt, 1)) | Target AA : $([math]::Round($s2_tgtaa, 1)) | Target BB : $([math]::Round($s2_tgtbb, 1))"
    Write-Host "Actual SI    : $([math]::Round($s2_si, 1)) | Actual AA : $([math]::Round($s2_aa, 1)) | Actual BB : $([math]::Round($s2_bb, 1))"
    Write-Host "% Achieve    : $([math]::Round(($s2_si/$s2_tgt)*100, 1))% | % AA : $([math]::Round(($s2_aa/$s2_tgtaa)*100, 1))% | % BB : $([math]::Round(($s2_bb/$s2_tgtbb)*100, 1))%"

    Write-Host "`n=== SOUTH 9 (Thang 9 MTD from DIS Volume) ==="
    Write-Host "Target Total : $([math]::Round($s9_tgt, 1)) | Target AA : $([math]::Round($s9_tgtaa, 1)) | Target BB : $([math]::Round($s9_tgtbb, 1))"
    Write-Host "Actual SI    : $([math]::Round($s9_si, 1)) | Actual AA : $([math]::Round($s9_aa, 1)) | Actual BB : $([math]::Round($s9_bb, 1))"
    Write-Host "% Achieve    : $([math]::Round(($s9_si/$s9_tgt)*100, 1))% | % AA : $([math]::Round(($s9_aa/$s9_tgtaa)*100, 1))% | % BB : $([math]::Round(($s9_bb/$s9_tgtbb)*100, 1))%"

    Write-Host "`nTop 10 SDIP SubDs in South 2 (Thang 9 MTD):"
    foreach ($id in $subdMap.Keys) {
        $s = $subdMap[$id]
        if ($s.area -eq "South 2" -and $s.is_sdip) {
            $pctAA = if ($s.target_aa -gt 0) { [math]::Round(($s.si_202609_aa / $s.target_aa) * 100, 1) } else { 0 }
            $pctBB = if ($s.target_bb -gt 0) { [math]::Round(($s.si_202609_bb / $s.target_bb) * 100, 1) } else { 0 }
            Write-Host "$id | $($s.name) | TgtAA=$($s.target_aa) SI_AA=$([math]::Round($s.si_202609_aa, 1)) ($pctAA%) | TgtBB=$($s.target_bb) SI_BB=$([math]::Round($s.si_202609_bb, 1)) ($pctBB%)"
        }
    }

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
