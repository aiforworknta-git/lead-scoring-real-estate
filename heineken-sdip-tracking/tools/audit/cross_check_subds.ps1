$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Read SubDs from Overview.xlsx
    $wbOver = $excel.Workbooks.Open("$baseDir\thang 8\Overview.xlsx", 0, $true)
    $wsOver = $wbOver.Worksheets.Item("Export")
    $rowsOver = $wsOver.UsedRange.Rows.Count
    $subdOverview = @{}
    for ($r = 2; $r -le $rowsOver; $r++) {
        $id = [string]$wsOver.Cells.Item($r, 1).Text.Trim()
        $name = [string]$wsOver.Cells.Item($r, 2).Text.Trim()
        $area = [string]$wsOver.Cells.Item($r, 3).Text.Trim()
        if ($id) {
            $subdOverview[$id] = @{ Name = $name; Area = $area }
        }
    }
    $wbOver.Close($false)
    Write-Host "Overview.xlsx: Found $($subdOverview.Count) unique SubDs"

    # 2. Read SubDs from SCD.xlsx
    $wbSCD = $excel.Workbooks.Open("$baseDir\thang 8\SCD.xlsx", 0, $true)
    $wsSCD = $wbSCD.Worksheets.Item("Export")
    $rowsSCD = $wsSCD.UsedRange.Rows.Count
    $subdSCD = @{}
    for ($r = 2; $r -le $rowsSCD; $r++) {
        $id = [string]$wsSCD.Cells.Item($r, 3).Text.Trim()
        $name = [string]$wsSCD.Cells.Item($r, 4).Text.Trim()
        if ($id) { $subdSCD[$id] = $name }
    }
    $wbSCD.Close($false)
    Write-Host "SCD.xlsx: Found $($subdSCD.Count) unique SubDs"

    # 3. Read SubDs from ASO detail.xlsx
    $wbASO = $excel.Workbooks.Open("$baseDir\thang 8\ASO detail.xlsx", 0, $true)
    $wsASO = $wbASO.Worksheets.Item("Export")
    $rowsASO = $wsASO.UsedRange.Rows.Count
    $subdASO = @{}
    for ($r = 3; $r -le $rowsASO; $r++) { # row 1,2 might be header
        $id = [string]$wsASO.Cells.Item($r, 4).Text.Trim()
        $name = [string]$wsASO.Cells.Item($r, 5).Text.Trim()
        if ($id -and $id -ne "SubDCode") { $subdASO[$id] = $name }
    }
    $wbASO.Close($false)
    Write-Host "ASO detail.xlsx: Found $($subdASO.Count) unique SubDs"

    # 4. Check overlap
    $missingInSCD = @()
    $missingInASO = @()
    foreach ($k in $subdOverview.Keys) {
        if (-not $subdSCD.ContainsKey($k)) { $missingInSCD += "$k ($($subdOverview[$k].Name))" }
        if (-not $subdASO.ContainsKey($k)) { $missingInASO += "$k ($($subdOverview[$k].Name))" }
    }

    Write-Host "`n--- Cross-Check Results ---"
    Write-Host "SubDs in Overview but NOT in SCD: $($missingInSCD.Count)"
    if ($missingInSCD.Count -gt 0) {
        Write-Host "  Missing in SCD sample: $($missingInSCD[0..[math]::Min(5, $missingInSCD.Count-1)] -join ', ')"
    }
    Write-Host "SubDs in Overview but NOT in ASO: $($missingInASO.Count)"
    if ($missingInASO.Count -gt 0) {
        Write-Host "  Missing in ASO sample: $($missingInASO[0..[math]::Min(5, $missingInASO.Count-1)] -join ', ')"
    }

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
