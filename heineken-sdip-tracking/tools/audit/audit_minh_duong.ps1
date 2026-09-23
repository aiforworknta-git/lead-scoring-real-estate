$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$file = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx"
$wb = $excel.Workbooks.Open($file, 0, $true)
$ws = $wb.Worksheets.Item(1)
$arr = $ws.UsedRange.Value2
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

$rows = $arr.GetLength(0)
Write-Host "Total rows in DIS Volume: $rows"

$months = @{}
$siByMonth = @{}
$soByMonth = @{}

for ($r = 2; $r -le $rows; $r++) {
    $m = [string]$arr[$r, 11]
    if (-not $months.ContainsKey($m)) { 
        $months[$m] = 0 
        $siByMonth[$m] = 0
        $soByMonth[$m] = 0
    }
    $months[$m]++

    $toCust = [string]$arr[$r, 7]
    $fromCust = [string]$arr[$r, 5]
    $val = $arr[$r, 15]
    $uom = 0.0
    if ($val) { [double]::TryParse("$val", [ref]$uom) | Out-Null }

    if ($toCust -eq "66354490") {
        $siByMonth[$m] += $uom
    }
    if ($fromCust -eq "66354490") {
        $soByMonth[$m] += $uom
    }
}

Write-Host "Months distribution in DIS Volume:"
foreach ($k in ($months.Keys | Sort-Object)) {
    Write-Host ("  Month " + $k + " : " + $months[$k] + " rows | 66354490 SI: " + $siByMonth[$k] + " | SO: " + $soByMonth[$k])
}
