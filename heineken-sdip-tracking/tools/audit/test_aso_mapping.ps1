$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Read OL YTD
    Write-Host "Reading OL YTD..."
    $wbOL = $excel.Workbooks.Open("$baseDir\DIM\OL YTD.xlsx", 0, $true)
    $wsOL = $wbOL.Worksheets.Item("Export")
    $arrOL = $wsOL.UsedRange.Value2
    $wbOL.Close($false)
    
    $olMap = @{}
    $olRows = $arrOL.GetLength(0)
    for ($r = 2; $r -le $olRows; $r++) {
        $code = [string]$arrOL[$r, 1]
        if (-not $code) { continue }
        $olMap[$code] = @{
            name = [string]$arrOL[$r, 2]
            status = [string]$arrOL[$r, 3]
            area = [string]$arrOL[$r, 32]
            sr = [string]$arrOL[$r, 35]
            ss = [string]$arrOL[$r, 38]
            asm = [string]$arrOL[$r, 40]
            subd = [string]$arrOL[$r, 29]
        }
    }
    Write-Host "Loaded $($olMap.Count) outlets from OL YTD"

    # 2. Read ASO detail
    Write-Host "Reading ASO detail..."
    $wbASO = $excel.Workbooks.Open("$baseDir\thang 9\ASO detail.xlsx", 0, $true)
    $wsASO = $wbASO.Worksheets.Item("Export")
    $arrASO = $wsASO.UsedRange.Value2
    $wbASO.Close($false)
    
    $asoRows = $arrASO.GetLength(0)
    $inactiveCount = 0
    $mappedWithSR = 0
    $ssSet = @{}
    $srSet = @{}
    $subdWithReps = @{}
    
    for ($r = 3; $r -le $asoRows; $r++) {
        $subdCode = [string]$arrASO[$r, 4]
        $olCode = [string]$arrASO[$r, 6]
        $valOrders = $arrASO[$r, 9]; $orders = 0; [int]::TryParse([string]$valOrders, [ref]$orders) | Out-Null
        
        if ($orders -eq 0) {
            $inactiveCount++
            if ($olMap.ContainsKey($olCode)) {
                $info = $olMap[$olCode]
                if ($info.sr) {
                    $mappedWithSR++
                    $srSet[$info.sr] = 1
                    $ssSet[$info.ss] = 1
                    if (-not $subdWithReps.ContainsKey($subdCode)) {
                        $subdWithReps[$subdCode] = @{ SS = $info.ss; SR = $info.sr }
                    }
                }
            }
        }
    }
    
    Write-Host "ASO Inactive Outlets (Orders = 0): $inactiveCount"
    Write-Host "Mapped with SR in OL YTD: $mappedWithSR"
    Write-Host "Distinct SS in inactive: $($ssSet.Count) -> $($ssSet.Keys -join ', ')"
    Write-Host "Distinct SR in inactive: $($srSet.Count) -> $($srSet.Keys -join ', ')"
    Write-Host "SubDs with Reps mapped: $($subdWithReps.Count)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
}
