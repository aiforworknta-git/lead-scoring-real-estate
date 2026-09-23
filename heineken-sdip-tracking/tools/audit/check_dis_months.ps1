$path = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    Write-Host "Opening workbook..."
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item(1)
    $arr = $ws.UsedRange.Value2
    $wb.Close($false)
    $rows = $arr.GetLength(0)
    Write-Host "Total rows: $rows"

    $months = @{}
    $siByMonth = @{}
    $soByMonth = @{}

    for ($r = 2; $r -le $rows; $r++) {
        $m = [string]($arr[$r, 11])
        $buyFrom = [string]($arr[$r, 4])
        $valUom = $arr[$r, 15]
        $uom = 0.0
        if ($valUom) {
            [double]::TryParse([string]$valUom, [ref]$uom) | Out-Null
        }

        if (-not $months.ContainsKey($m)) {
            $months[$m] = 0
            $siByMonth[$m] = 0.0
            $soByMonth[$m] = 0.0
        }
        $months[$m]++
        if ($buyFrom -eq "Distributor") {
            $siByMonth[$m] += $uom
        } elseif ($buyFrom -eq "Sub Distributor") {
            $soByMonth[$m] += $uom
        }
    }

    Write-Host "`nMonth breakdown:"
    foreach ($k in ($months.Keys | Sort-Object)) {
        Write-Host "Month $k : Rows=$($months[$k]) | SI=$([math]::Round($siByMonth[$k], 1)) | SO=$([math]::Round($soByMonth[$k], 1))"
    }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
