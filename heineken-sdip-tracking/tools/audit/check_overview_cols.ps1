$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$file = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx"
$wb = $excel.Workbooks.Open($file, 0, $true)
$ws = $wb.Worksheets.Item(1)
$lastCol = $ws.UsedRange.Columns.Count
$lastRow = $ws.UsedRange.Rows.Count
Write-Host ("Rows: $lastRow | Cols: $lastCol")
for ($c = 1; $c -le $lastCol; $c++) {
    Write-Host ("Col $c : " + $ws.Cells.Item(1, $c).Value2 + " | Sample: " + $ws.Cells.Item(2, $c).Value2)
}
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
