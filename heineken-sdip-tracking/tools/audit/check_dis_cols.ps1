$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$file = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$wb = $excel.Workbooks.Open($file, 0, $true)
$ws = $wb.Worksheets.Item(1)
$arr = $ws.Range("A1:R5").Value2
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

for ($c = 1; $c -le 18; $c++) {
    Write-Host ("Col " + $c + ": " + $arr[1, $c] + " | Sample: " + $arr[2, $c])
}
