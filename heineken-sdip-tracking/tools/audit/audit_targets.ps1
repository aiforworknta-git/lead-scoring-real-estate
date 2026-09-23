$baseDir = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$reportList = [System.Collections.ArrayList]::new()

function Test-Workbook($filePath, $category) {
    if (-not (Test-Path -LiteralPath $filePath)) { 
        Write-Host "File NOT found: $filePath"
        return 
    }
    $fileItem = Get-Item -LiteralPath $filePath
    Write-Host "Auditing: [$category] $($fileItem.Name) ($([math]::Round($fileItem.Length/1024, 1)) KB)..."
    
    $wb = $null
    try {
        $wb = $excel.Workbooks.Open($filePath, 0, $true) # read-only
        $sheetCount = $wb.Worksheets.Count
        
        for ($i = 1; $i -le $sheetCount; $i++) {
            $ws = $wb.Worksheets.Item($i)
            $sheetName = $ws.Name
            $usedRange = $ws.UsedRange
            $rowCount = $usedRange.Rows.Count
            $colCount = $usedRange.Columns.Count
            
            # Read first row as headers
            $headersList = [System.Collections.Generic.List[string]]::new()
            for ($c = 1; $c -le [math]::Min($colCount, 50); $c++) {
                $val = [string]$ws.Cells.Item(1, $c).Text
                if ($val) { [void]$headersList.Add($val.Trim()) }
            }
            
            # Read sample row 2
            $sampleList = [System.Collections.Generic.List[string]]::new()
            if ($rowCount -ge 2) {
                for ($c = 1; $c -le [math]::Min($colCount, 20); $c++) {
                    $val = [string]$ws.Cells.Item(2, $c).Text
                    [void]$sampleList.Add($val.Trim())
                }
            }
            
            $itemObj = [PSCustomObject]@{
                Category   = $category
                FileName   = $fileItem.Name
                SizeKB     = [math]::Round($fileItem.Length/1024, 1)
                Sheet      = $sheetName
                Rows       = $rowCount
                Cols       = $colCount
                Headers    = ($headersList -join " | ")
                Sample     = ($sampleList -join " | ")
            }
            [void]$reportList.Add($itemObj)
            Write-Host "   -> Sheet: '$sheetName' ($rowCount rows, $colCount cols)"
        }
    } catch {
        Write-Host "   Error on $filePath : $_"
        $errObj = [PSCustomObject]@{
            Category = $category
            FileName = $fileItem.Name
            SizeKB   = [math]::Round($fileItem.Length/1024, 1)
            Sheet    = "ERROR"
            Rows     = 0
            Cols     = 0
            Headers  = "ERROR: $_"
            Sample   = ""
        }
        [void]$reportList.Add($errObj)
    } finally {
        if ($null -ne $wb) {
            $wb.Close($false)
            [System.Runtime.Interopservices.Marshal]::ReleaseComObject($wb) | Out-Null
        }
    }
}

try {
    # Exact target files
    $files = @(
        @{ Path = "$baseDir\thang 8\target\Sub DistributorTarget-202608-[South 2]_A (2).xlsx"; Cat = "thang 8 Target South 2" },
        @{ Path = "$baseDir\thang 8\target\Sub DistributorTarget-202608-[South 9]_F (2).xlsx"; Cat = "thang 8 Target South 9" },
        @{ Path = "$baseDir\thang 9\Sub DistributorTarget-202609-[South 2]_A.xlsx"; Cat = "thang 9 Target South 2" },
        @{ Path = "$baseDir\thang 9\Sub DistributorTarget-202609-[South 9]_F.xlsx"; Cat = "thang 9 Target South 9" }
    )

    foreach ($f in $files) {
        Test-Workbook $f.Path $f.Cat
    }

    $jsonOut = $reportList | ConvertTo-Json -Depth 4
    [System.IO.File]::WriteAllText("d:\NTAN\AI For work\Agentic\excel_audit_targets.json", $jsonOut, [System.Text.Encoding]::UTF8)
    Write-Host "`nTargets audited successfully! Total entries: $($reportList.Count)"
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
