$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$sw = [System.Diagnostics.Stopwatch]::StartNew()
try {
    Write-Host "Testing bulk array read on OL YTD.xlsx..."
    $wb = $excel.Workbooks.Open("$baseDir\DIM\OL YTD.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $usedRange = $ws.UsedRange
    $rows = $usedRange.Rows.Count
    $cols = $usedRange.Columns.Count
    
    # Bulk read entire table into a single 2D array in 1 COM call!
    $arr = $usedRange.Value2
    $wb.Close($false)
    $sw.Stop()
    
    Write-Host "Read $rows rows x $cols cols in $($sw.ElapsedMilliseconds) ms!"
    Write-Host "Row 2 Col 1: $($arr[2, 1]) | Col 2: $($arr[2, 2]) | Col 32 (Area): $($arr[2, 32]) | Col 35 (SR): $($arr[2, 35]) | Col 38 (SS): $($arr[2, 38])"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
}
