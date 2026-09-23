$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$wb = $excel.Workbooks.Open("D:\NTAN\AI For work\Agentic\heineken-sdip-tracking\data\dim\OL YTD.xlsx", 0, $true)
$ws = $wb.Worksheets.Item("Export")
for ($c = 1; $c -le 45; $c++) {
    $v1 = $ws.Cells.Item(1, $c).Text
    if ($v1 -ne "") {
        Write-Host "Col $c : '$v1'"
    }
}
$wb.Close($false)
$excel.Quit()
