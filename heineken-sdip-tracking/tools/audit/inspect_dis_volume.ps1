$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($path, 0, $true)
    Write-Host "Sheets count: $($wb.Worksheets.Count)"
    for ($i = 1; $i -le $wb.Worksheets.Count; $i++) {
        Write-Host "Sheet $i : $($wb.Worksheets.Item($i).Name)"
    }
    $ws = $wb.Worksheets.Item(1)
    $used = $ws.UsedRange
    Write-Host "Rows: $($used.Rows.Count) Cols: $($used.Columns.Count)"
    for ($c = 1; $c -le $used.Columns.Count; $c++) {
        Write-Host "Col $c : $($used.Cells.Item(1, $c).Text)"
    }
    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
