$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\DIM\Product Name.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("data")
    $arr = $ws.Range($ws.Cells.Item(1, 1), $ws.Cells.Item(50, 5)).Value2
    $wb.Close($false)
    for ($r = 1; $r -le 40; $r++) {
        Write-Host "Row ${r}: Name='$($arr[$r,1])' | Company='$($arr[$r,2])' | Group='$($arr[$r,5])'"
    }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
