$filePath = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\2. Master Data\3. OSR\OSR.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($filePath, 0, $true)
    Write-Host "Worksheets count: $($wb.Worksheets.Count)"
    
    foreach ($ws in $wb.Worksheets) {
        Write-Host "`n----------------------------------------"
        Write-Host "Sheet Name: $($ws.Name)"
        $usedRange = $ws.UsedRange
        $rows = $usedRange.Rows.Count
        $cols = $usedRange.Columns.Count
        Write-Host "Dimensions: $rows rows x $cols cols"
        
        # Read headers
        $headers = @()
        for ($c = 1; $c -le [Math]::Min($cols, 30); $c++) {
            $val = [string]$ws.Cells.Item(1, $c).Text
            $headers += "[$c] $val"
        }
        Write-Host "Headers (First 30):"
        Write-Host ($headers -join ", ")
        
        # Read 3 sample rows
        Write-Host "`nSample Data (Rows 2 to 4):"
        for ($r = 2; $r -le [Math]::Min($rows, 4); $r++) {
            $rowVals = @()
            for ($c = 1; $c -le [Math]::Min($cols, 10); $c++) {
                $rowVals += [string]$ws.Cells.Item($r, $c).Text
            }
            Write-Host "Row $r : " ($rowVals -join " | ")
        }
    }
    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
