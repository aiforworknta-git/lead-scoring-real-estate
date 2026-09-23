$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open("$baseDir\thang 8\Overview.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $rows = $ws.UsedRange.Rows.Count
    
    $areaMap = @{}
    $validCount = 0
    $blankSubD = 0
    
    for ($r = 2; $r -le [math]::Min($rows, 200); $r++) {
        $id = [string]$ws.Cells.Item($r, 1).Text.Trim()
        $name = [string]$ws.Cells.Item($r, 2).Text.Trim()
        $area = [string]$ws.Cells.Item($r, 3).Text.Trim()
        $si = [string]$ws.Cells.Item($r, 4).Text.Trim()
        $so = [string]$ws.Cells.Item($r, 5).Text.Trim()
        $sdip = [string]$ws.Cells.Item($r, 6).Text.Trim()
        
        if ($id) {
            $validCount++
            if (-not $areaMap.ContainsKey($area)) { $areaMap[$area] = 0 }
            $areaMap[$area]++
            if ($r -le 10) {
                Write-Host "Row ${r} -> ID='${id}', Name='${name}', Area='${area}', SI='${si}', SO='${so}', SDIP='${sdip}'"
            }
        } else {
            $blankSubD++
        }
    }
    $wb.Close($false)
    Write-Host "`nSample 200 rows stats:"
    Write-Host "Valid ID rows: $validCount | Blank ID rows: $blankSubD"
    Write-Host "Areas found in sample: $($areaMap.Keys -join ', ')"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
