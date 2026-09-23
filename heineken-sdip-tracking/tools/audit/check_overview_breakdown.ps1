$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open("$baseDir\thang 8\Overview.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $rows = $ws.UsedRange.Rows.Count
    
    $areaCount = @{}
    $sdipCount = @{}
    
    for ($r = 2; $r -le $rows; $r++) {
        $id = [string]$ws.Cells.Item($r, 1).Text.Trim()
        $area = [string]$ws.Cells.Item($r, 3).Text.Trim()
        $sdip = [string]$ws.Cells.Item($r, 6).Text.Trim()
        
        if (-not $areaCount.ContainsKey($area)) { $areaCount[$area] = 0 }
        $areaCount[$area]++
        
        if (-not $sdipCount.ContainsKey($sdip)) { $sdipCount[$sdip] = 0 }
        $sdipCount[$sdip]++
    }
    $wb.Close($false)
    
    Write-Host "Overview.xlsx breakdown by Area:"
    foreach ($k in $areaCount.Keys) {
        Write-Host "   '$k' : $($areaCount[$k]) rows"
    }
    Write-Host "`nOverview.xlsx breakdown by SDIP status:"
    foreach ($k in $sdipCount.Keys) {
        Write-Host "   '$k' : $($sdipCount[$k]) rows"
    }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
