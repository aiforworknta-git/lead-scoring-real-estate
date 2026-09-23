$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$wb = $excel.Workbooks.Open("D:\NTAN\AI For work\Agentic\heineken-sdip-tracking\data\ASO detail.xlsx", 0, $true)
$ws = $wb.Worksheets.Item("Export")
for ($c = 1; $c -le 30; $c++) {
    $v1 = $ws.Cells.Item(1, $c).Text
    $v2 = $ws.Cells.Item(2, $c).Text
    if ($v1 -ne "" -or $v2 -ne "") {
        Write-Host "Col $c : R1='$v1' | R2='$v2'"
    }
}
$wb.Close($false)
$excel.Quit()
