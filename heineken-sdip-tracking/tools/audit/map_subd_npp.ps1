$subdCodes = @{}
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Read 103 SubDs
    $wbOver = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx", 0, $true)
    $wsOver = $wbOver.Worksheets.Item(1)
    $rowsOver = $wsOver.UsedRange.Rows.Count
    for ($r = 2; $r -le $rowsOver; $r++) {
        $id = [string]$wsOver.Cells.Item($r, 1).Text.Trim()
        $area = [string]$wsOver.Cells.Item($r, 3).Text.Trim()
        if ($id -and ($area -eq "South 2" -or $area -eq "South 9")) {
            $subdCodes[$id] = [ordered]@{ 
                Name = [string]$wsOver.Cells.Item($r, 2).Text.Trim(); 
                Area = $area;
                NPP_DIS = @{};
                NPP_OL = ""
            }
        }
    }
    $wbOver.Close($false)
    Write-Host "Loaded $($subdCodes.Count) SubDs."

    # 2. Check OL YTD for SubDs
    $olYtdFile = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\DIM\OL YTD.xlsx"
    if (Test-Path -LiteralPath $olYtdFile) {
        $wbOL = $excel.Workbooks.Open($olYtdFile, 0, $true)
        $wsOL = $wbOL.Worksheets.Item("Export")
        $arrOL = $wsOL.UsedRange.Value2
        $wbOL.Close($false)
        $olRows = $arrOL.GetLength(0)
        for ($r = 2; $r -le $olRows; $r++) {
            $code = [string]$arrOL[$r, 1]
            if ($subdCodes.ContainsKey($code)) {
                $supplier = [string]$arrOL[$r, 30] # PrimarySupplierName
                if ($supplier) {
                    $short = ($supplier -split "-")[0].Trim()
                    $subdCodes[$code].NPP_OL = $short
                }
            }
        }
    }

    # 3. Check DIS Volume
    $disFile = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
    $wbDIS = $excel.Workbooks.Open($disFile, 0, $true)
    $wsDIS = $wbDIS.Worksheets.Item("Export")
    $usedRows = $wsDIS.UsedRange.Rows.Count
    $chunkSize = 50000

    for ($start = 2; $start -le $usedRows; $start += $chunkSize) {
        $end = [math]::Min($start + $chunkSize - 1, $usedRows)
        $len = $end - $start + 1
        $arr = $wsDIS.Range($wsDIS.Cells.Item($start, 1), $wsDIS.Cells.Item($end, 15)).Value2
        
        for ($i = 1; $i -le $len; $i++) {
            $buyFrom = [string]$arr[$i, 4]
            if ($buyFrom -ne "Distributor") { continue }
            
            $toId = [string]$arr[$i, 7]
            if ($subdCodes.ContainsKey($toId)) {
                $sellerName = [string]$arr[$i, 6]
                if ($sellerName) {
                    $short = ($sellerName -split "-")[0].Trim()
                    $valQty = $arr[$i, 15]
                    $qty = 0; [double]::TryParse([string]$valQty, [ref]$qty) | Out-Null
                    if (-not $subdCodes[$toId].NPP_DIS.ContainsKey($short)) {
                        $subdCodes[$toId].NPP_DIS[$short] = 0
                    }
                    $subdCodes[$toId].NPP_DIS[$short] += $qty
                }
            }
        }
    }
    $wbDIS.Close($false)

    # 4. Summarize results
    $mappedCount = 0
    Write-Host "`nSample SubDs and their NPP ShortCode:"
    $count = 0
    foreach ($id in $subdCodes.Keys) {
        $s = $subdCodes[$id]
        $nppDis = ""
        if ($s.NPP_DIS.Count -gt 0) {
            # Pick the NPP with max volume
            $nppDis = ($s.NPP_DIS.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key
        }
        $finalNPP = if ($nppDis) { $nppDis } else { $s.NPP_OL }
        if ($finalNPP) { $mappedCount++ }
        
        if ($count -lt 15) {
            Write-Host "SubD $id ($($s.Name)) [$($s.Area)] -> NPP DIS: '$nppDis' | NPP OL: '$($s.NPP_OL)' => Final: '$finalNPP'"
            $count++
        }
    }
    Write-Host "`nTotal SubDs mapped with NPP: $mappedCount / $($subdCodes.Count)"

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
