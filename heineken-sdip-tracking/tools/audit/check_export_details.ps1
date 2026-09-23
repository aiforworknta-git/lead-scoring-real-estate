$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # Check OverView Export Details
    $wbOver = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\OverView.xlsx", 0, $true)
    foreach ($ws in $wbOver.Worksheets) {
        Write-Host "OverView Sheet: $($ws.Name)"
        if ($ws.Name -like "*Detail*") {
            Write-Host "Details content: $($ws.Cells.Item(2, 1).Text)"
        }
    }
    $wbOver.Close($false)

    # Check DIS Volume Export Details
    $wbDIS = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx", 0, $true)
    $wsD = $wbDIS.Worksheets.Item("Export Details")
    Write-Host "`nDIS Volume Export Details content: $($wsD.Cells.Item(2, 1).Text)"
    $wbDIS.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
