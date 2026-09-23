$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    Write-Host "=== THANG 9 OVERVIEW.XLSX ==="
    $wb = $excel.Workbooks.Open("$baseDir\thang 9\OverView.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $cols = $ws.UsedRange.Columns.Count
    Write-Host "Cols count: $cols, Rows count: $($ws.UsedRange.Rows.Count)"
    for ($c = 1; $c -le $cols; $c++) {
        $h = $ws.Cells.Item(1, $c).Text
        $v = $ws.Cells.Item(2, $c).Text
        Write-Host "Col $($c): '$h' | Val: '$v'"
    }
    $wb.Close($false)

    Write-Host "`n=== THANG 9 ASO DETAIL.XLSX ==="
    $wb = $excel.Workbooks.Open("$baseDir\thang 9\ASO detail.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $cols = $ws.UsedRange.Columns.Count
    Write-Host "Cols count: $cols, Rows count: $($ws.UsedRange.Rows.Count)"
    for ($c = 1; $c -le $cols; $c++) {
        $r1 = $ws.Cells.Item(1, $c).Text
        $r2 = $ws.Cells.Item(2, $c).Text
        $r3 = $ws.Cells.Item(3, $c).Text
        Write-Host "Col $($c): R1='$r1' | R2='$r2' | R3='$r3'"
    }
    $wb.Close($false)

    Write-Host "`n=== DIM OL YTD.XLSX ==="
    $wb = $excel.Workbooks.Open("$baseDir\DIM\OL YTD.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $cols = $ws.UsedRange.Columns.Count
    Write-Host "Cols count: $cols, Rows count: $($ws.UsedRange.Rows.Count)"
    for ($c = 1; $c -le [math]::Min($cols, 45); $c++) {
        $h = $ws.Cells.Item(1, $c).Text
        $v = $ws.Cells.Item(2, $c).Text
        Write-Host "Col $($c): '$h' | Val: '$v'"
    }
    $wb.Close($false)

} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
}
