$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Check DIS Volume for To_Customer_ID = SubD
    $wbDIS = $excel.Workbooks.Open("C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\DIS Volume.xlsx", 0, $true)
    $wsDIS = $wbDIS.Worksheets.Item("Export")
    $usedRows = $wsDIS.UsedRange.Rows.Count
    
    # Read first 30,000 rows
    $arr = $wsDIS.Range($wsDIS.Cells.Item(1, 1), $wsDIS.Cells.Item(30000, 15)).Value2
    $wbDIS.Close($false)
    
    Write-Host "Checking DIS Volume rows where BuyFrom = 'Distributor':"
    $samples = 0
    for ($r = 2; $r -le 30000; $r++) {
        $buyFrom = [string]$arr[$r, 4]
        if ($buyFrom -eq "Distributor") {
            $fromId = [string]$arr[$r, 5]
            $fromName = [string]$arr[$r, 6]
            $toId = [string]$arr[$r, 7]
            $toName = [string]$arr[$r, 8]
            Write-Host "From: '$fromId' - '$fromName' | To: '$toId' - '$toName'"
            $samples++
            if ($samples -ge 10) { break }
        }
    }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
