$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\target"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

function Inspect-Target($fileName) {
    Write-Host "`n=== Inspecting: $fileName ==="
    $path = Join-Path $baseDir $fileName
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Data")
    
    # Print row 1 and row 2 for first 30 cols
    for ($c = 1; $c -le 30; $c++) {
        $r1 = [string]$ws.Cells.Item(1, $c).Text.Trim()
        $r2 = [string]$ws.Cells.Item(2, $c).Text.Trim()
        Write-Host "Col ${c}: R1='$r1' | R2='$r2'"
    }
    
    # Print sample row 3
    Write-Host "`nSample Row 3:"
    $r3 = @()
    for ($c = 1; $c -le 15; $c++) {
        $r3 += [string]$ws.Cells.Item(3, $c).Text.Trim()
    }
    Write-Host ($r3 -join " | ")
    
    $wb.Close($false)
}

try {
    Inspect-Target "Sub DistributorTarget-202609-[South 2]_A.xlsx"
    Inspect-Target "Sub DistributorTarget-202609-[South 9]_F.xlsx"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
