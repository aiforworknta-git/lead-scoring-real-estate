$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$disPath = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$jsonDist = "D:\NTAN\AI For work\Agentic\heineken-sdip-tracking\dist\sdip_data_202609.json"

try {
    $data = Get-Content -LiteralPath $jsonDist -Raw -Encoding UTF8 | ConvertFrom-Json
    $sampleOutlets = @{}
    # Pick first 10 inactive outlets
    for ($i = 0; $i -lt 15; $i++) {
        $o = $data.inactive_outlets_master[$i]
        $sampleOutlets[$o.outlet_code] = @{
            code = $o.outlet_code
            name = $o.outlet_name
            subd = $o.subd_code
            v7 = 0.0
            v8 = 0.0
            v9 = 0.0
            matched = $false
        }
    }

    Write-Host "Checking 15 sample inactive outlets in DIS Volume..."
    $wb = $excel.Workbooks.Open($disPath, 0, $true)
    $ws = $wb.Worksheets.Item(1)
    $arr = $ws.UsedRange.Value2
    $wb.Close($false)
    $rows = $arr.GetLength(0)

    Write-Host "DIS Volume rows: $rows"

    # Also count overall how many To_Customer_ID match inactive outlets
    $allInactiveSet = @{}
    foreach ($o in $data.inactive_outlets_master) {
        $allInactiveSet[$o.outlet_code] = @{ v7 = 0.0; v8 = 0.0; v9 = 0.0 }
    }

    $matchedRows = 0
    $buyFromStats = @{}

    for ($r = 2; $r -le $rows; $r++) {
        $toCust = [string]($arr[$r, 7])
        $buyFrom = [string]($arr[$r, 4])
        $m = [string]($arr[$r, 11])
        $valUom = $arr[$r, 15]
        $uom = 0.0
        if ($valUom) { [double]::TryParse([string]$valUom, [ref]$uom) | Out-Null }

        if ($allInactiveSet.ContainsKey($toCust)) {
            $matchedRows++
            if (-not $buyFromStats.ContainsKey($buyFrom)) { $buyFromStats[$buyFrom] = 0 }
            $buyFromStats[$buyFrom]++

            if ($m -eq "202607") { $allInactiveSet[$toCust].v7 += $uom }
            elseif ($m -eq "202608") { $allInactiveSet[$toCust].v8 += $uom }
            elseif ($m -eq "202609") { $allInactiveSet[$toCust].v9 += $uom }
        }

        if ($sampleOutlets.ContainsKey($toCust)) {
            $sampleOutlets[$toCust].matched = $true
            if ($m -eq "202607") { $sampleOutlets[$toCust].v7 += $uom }
            elseif ($m -eq "202608") { $sampleOutlets[$toCust].v8 += $uom }
            elseif ($m -eq "202609") { $sampleOutlets[$toCust].v9 += $uom }
        }
    }

    Write-Host "Total matched rows for all 3,093 inactive outlets: $matchedRows"
    Write-Host "BuyFrom distribution on matched rows:"
    foreach ($k in $buyFromStats.Keys) {
        Write-Host "  BuyFrom '$k': $($buyFromStats[$k]) rows"
    }

    Write-Host "`nSample 15 inactive outlets history:"
    foreach ($k in $sampleOutlets.Keys) {
        $s = $sampleOutlets[$k]
        Write-Host "Outlet $($s.code) ($($s.name)): T7=$($s.v7) | T8=$($s.v8) | T9=$($s.v9)"
    }

    # Summary of inactive outlets: 3 months no volume vs had volume
    $noVol3M = 0
    $hadVol7or8 = 0
    $hadVol9 = 0
    foreach ($k in $allInactiveSet.Keys) {
        $rec = $allInactiveSet[$k]
        if ($rec.v9 -gt 0) { $hadVol9++ }
        if ($rec.v7 -eq 0 -and $rec.v8 -eq 0 -and $rec.v9 -eq 0) {
            $noVol3M++
        } else {
            $hadVol7or8++
        }
    }
    Write-Host "`nOut of $($allInactiveSet.Count) inactive outlets in T9:"
    Write-Host "  - 3 consecutive months ZERO volume (Cao - Nguy cơ mất khách/Dead Outlet): $noVol3M"
    Write-Host "  - Had volume in T7 or T8 (Ngưng mua tháng 9/Churn risk): $hadVol7or8"
    Write-Host "  - Had volume in T9 (in DIS?): $hadVol9"

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
