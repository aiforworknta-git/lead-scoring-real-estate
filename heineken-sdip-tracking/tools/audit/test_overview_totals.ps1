$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open("$baseDir\thang 9\OverView.xlsx", 0, $true)
    $ws = $wb.Worksheets.Item("Export")
    $arr = $ws.UsedRange.Value2
    $wb.Close($false)
    
    $rows = $arr.GetLength(0)
    $cols = $arr.GetLength(1)
    Write-Host "Overview rows: $rows, cols: $cols"
    
    $south2Count = 0; $south9Count = 0; $sdipCount = 0
    $totSI = 0; $totSO = 0; $totAATarget = 0; $totAASI = 0; $totBBTarget = 0; $totBBSI = 0
    
    for ($r = 2; $r -le $rows; $r++) {
        $id = [string]$arr[$r, 1]
        $name = [string]$arr[$r, 2]
        $area = [string]$arr[$r, 3]
        if (-not $id -or ($area -ne "South 2" -and $area -ne "South 9")) { continue }
        
        if ($area -eq "South 2") { $south2Count++ } else { $south9Count++ }
        $isSDIP = ([string]$arr[$r, 6] -eq "Yes")
        if ($isSDIP) { $sdipCount++ }
        
        $valSI = $arr[$r, 4]; $si = 0; [double]::TryParse([string]$valSI, [ref]$si) | Out-Null
        $valSO = $arr[$r, 5]; $so = 0; [double]::TryParse([string]$valSO, [ref]$so) | Out-Null
        $valAAT = $arr[$r, 19]; $aaTarget = 0; [double]::TryParse([string]$valAAT, [ref]$aaTarget) | Out-Null
        $valAASI = $arr[$r, 20]; $aaSI = 0; [double]::TryParse([string]$valAASI, [ref]$aaSI) | Out-Null
        $valBBT = $arr[$r, 23]; $bbTarget = 0; [double]::TryParse([string]$valBBT, [ref]$bbTarget) | Out-Null
        $valBBSI = $arr[$r, 24]; $bbSI = 0; [double]::TryParse([string]$valBBSI, [ref]$bbSI) | Out-Null
        
        $totSI += $si
        $totSO += $so
        $totAATarget += $aaTarget
        $totAASI += $aaSI
        $totBBTarget += $bbTarget
        $totBBSI += $bbSI
        
        if ($r -le 6) {
            Write-Host "Row $r -> SubD: $id ($name) | Area: $area | SDIP: $isSDIP | SI: $si | SO: $so | AA Target: $aaTarget | AA SI: $aaSI | BB Target: $bbTarget | BB SI: $bbSI"
        }
    }
    Write-Host "`nOverview Summary (South 2 & South 9):"
    Write-Host "Total SubDs: $($south2Count + $south9Count) (South 2: $south2Count, South 9: $south9Count, SDIP: $sdipCount)"
    Write-Host "Total SI: $totSI | Total SO: $totSO"
    Write-Host "Total AA Target: $totAATarget | Total AA SI: $totAASI"
    Write-Host "Total BB Target: $totBBTarget | Total BB SI: $totBBSI"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
}
