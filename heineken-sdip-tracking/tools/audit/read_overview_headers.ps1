$p = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx"
$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false
try {
    $wb = $xl.Workbooks.Open($p, 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $cols = $ws.UsedRange.Columns.Count
    for ($c = 1; $c -le $cols; $c++) {
        $val = $ws.Cells.Item(1, $c).Text
        Write-Host "Col $c : '$val'"
    }
    $wb.Close($false)
} finally {
    $xl.Quit()
}
