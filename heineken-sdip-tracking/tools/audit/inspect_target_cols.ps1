$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9\target"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

function Inspect-Cols($fileName, $startCol, $endCol) {
    Write-Host "`n=== Inspecting: $fileName ($startCol - $endCol) ==="
    $path = Join-Path $baseDir $fileName
    $wb = $excel.Workbooks.Open($path, 0, $true)
    $ws = $wb.Worksheets.Item("Data")
    
    for ($c = $startCol; $c -le $endCol; $c++) {
        $r1 = [string]$ws.Cells.Item(1, $c).Text.Trim()
        $r2 = [string]$ws.Cells.Item(2, $c).Text.Trim()
        if ($r1 -or $r2) {
            Write-Host "Col ${c}: R1='$r1' | R2='$r2'"
        }
    }
    
    # Print sample row 4 and 5
    Write-Host "`nRows 3, 4, 5 (Cols 1-10):"
    for ($r = 3; $r -le 5; $r++) {
        $vals = @()
        for ($c = 1; $c -le 10; $c++) {
            $vals += [string]$ws.Cells.Item($r, $c).Text.Trim()
        }
        Write-Host "Row ${r}: $($vals -join ' | ')"
    }
    
    $wb.Close($false)
}

try {
    Inspect-Cols "Sub DistributorTarget-202609-[South 9]_F.xlsx" 30 50
    Inspect-Cols "Sub DistributorTarget-202609-[South 2]_A.xlsx" 1 15
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
