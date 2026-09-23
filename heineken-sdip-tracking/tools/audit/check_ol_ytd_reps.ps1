$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open("$baseDir\DIM\OL YTD.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $rows = $ws.UsedRange.Rows.Count
    
    $ssMap = @{}
    $srMap = @{}
    $asmMap = @{}
    $subdWithRep = 0
    $sampleOutlets = @()
    
    for ($r = 2; $r -le [math]::Min($rows, 2000); $r++) {
        $area = $ws.Cells.Item($r, 32).Text.Trim()
        if ($area -eq "South 2" -or $area -eq "South 9") {
            $olCode = $ws.Cells.Item($r, 1).Text.Trim()
            $olName = $ws.Cells.Item($r, 2).Text.Trim()
            $subd = $ws.Cells.Item($r, 29).Text.Trim()
            $sr = $ws.Cells.Item($r, 35).Text.Trim()
            $ss = $ws.Cells.Item($r, 38).Text.Trim()
            $asm = $ws.Cells.Item($r, 40).Text.Trim()
            
            if ($ss) { $ssMap[$ss] = 1 }
            if ($sr) { $srMap[$sr] = 1 }
            if ($asm) { $asmMap[$asm] = 1 }
            if ($sampleOutlets.Count -lt 5 -and $sr -and $ss) {
                $sampleOutlets += "OL: $olCode ($olName) -> SubD: $subd | SR: $sr | SS: $ss | ASM: $asm | Area: $area"
            }
        }
    }
    $wb.Close($false)
    
    Write-Host "In first 2000 rows (South 2 & South 9):"
    Write-Host "Unique SS found: $($ssMap.Count) -> $($ssMap.Keys -join ', ')"
    Write-Host "Unique SR found: $($srMap.Count) -> $($srMap.Keys | Select-Object -First 5)"
    Write-Host "Unique ASM found: $($asmMap.Count) -> $($asmMap.Keys -join ', ')"
    Write-Host "`nSamples:"
    $sampleOutlets | ForEach-Object { Write-Host $_ }
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
}
