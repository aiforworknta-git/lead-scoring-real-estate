$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$report = [System.Collections.ArrayList]::new()

function Test-File($path) {
    if (-not (Test-Path -LiteralPath $path)) { return }
    $item = Get-Item -LiteralPath $path
    $wb = $excel.Workbooks.Open($path, 0, $true)
    for ($i = 1; $i -le $wb.Worksheets.Count; $i++) {
        $ws = $wb.Worksheets.Item($i)
        $ur = $ws.UsedRange
        $headers = [System.Collections.Generic.List[string]]::new()
        for ($c = 1; $c -le [math]::Min($ur.Columns.Count, 15); $c++) {
            $t = [string]$ws.Cells.Item(1, $c).Text
            if ($t) { [void]$headers.Add($t.Trim()) }
        }
        [void]$report.Add([PSCustomObject]@{
            File = $item.Name
            Sheet = $ws.Name
            Rows = $ur.Rows.Count
            Cols = $ur.Columns.Count
            Headers = ($headers -join " | ")
        })
    }
    $wb.Close($false)
}

try {
    Test-File "$baseDir\OverView.xlsx"
    Test-File "$baseDir\SCD.xlsx"
    Test-File "$baseDir\ASO detail.xlsx"
    Test-File "$baseDir\target\Sub DistributorTarget-202609-[South 2]_A.xlsx"
    Test-File "$baseDir\target\Sub DistributorTarget-202609-[South 9]_F.xlsx"

    $report | Format-Table -AutoSize
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
