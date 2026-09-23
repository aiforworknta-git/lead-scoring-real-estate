# ==============================================================================
# TÁC VỤ 1 & 2: TRÍCH XUẤT DỮ LIỆU EXCEL QUA COM SANG JSON (DATA EXTRACTION)
# ==============================================================================

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$dataMartDir = Join-Path $projectRoot "01_Data_Mart"
if (-not (Test-Path -LiteralPath $dataMartDir)) {
    New-Item -ItemType Directory -Path $dataMartDir -Force | Out-Null
}

$filePlan = "C:\Users\HP\OneDrive - Heineken International\AA SS SubD\2. Master Data\3. OSR\Plan Tie-up - Target tracking.xlsx"

Write-Host "Opening Excel Application..." -ForegroundColor Cyan
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $excel.Workbooks.Open($filePlan, 0, $true)

# -------------------------------------------------------------
# 1. TRÍCH XUẤT KẾ HOẠCH TÁI KÝ (PLAN_TIE_UP 2)
# -------------------------------------------------------------
Write-Host "Extracting SubD Plans from 'Plan_Tie_Up (2)'..."
$wsPlan = $wb.Worksheets.Item("Plan_Tie_Up (2)")
$planRows = $wsPlan.UsedRange.Rows.Count

$subdPlans = @()
# Real SubD records are rows 2 to 38 (37 SubDs)
for ($r = 2; $r -le [Math]::Min(38, $planRows); $r++) {
    $oid = [string]$wsPlan.Cells.Item($r, 1).Text.Trim()
    $name = [string]$wsPlan.Cells.Item($r, 2).Text.Trim()
    if (-not $oid) { continue }
    
    $oldStart = [string]$wsPlan.Cells.Item($r, 3).Text.Trim()
    $oldEnd = [string]$wsPlan.Cells.Item($r, 4).Text.Trim()
    
    $oldMonths = 0; [int]::TryParse([string]$wsPlan.Cells.Item($r, 5).Value2, [ref]$oldMonths) | Out-Null
    $oldTarget = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 6).Value2, [ref]$oldTarget) | Out-Null
    $oldOO = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 7).Value2, [ref]$oldOO) | Out-Null
    $oldPayCount = 0; [int]::TryParse([string]$wsPlan.Cells.Item($r, 8).Value2, [ref]$oldPayCount) | Out-Null
    
    $costPerCase = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 9).Value2, [ref]$costPerCase) | Out-Null
    if ($costPerCase -eq 0 -and $oldTarget -gt 0) { $costPerCase = [math]::Round($oldOO / $oldTarget, 0) }
    
    $newStart = [string]$wsPlan.Cells.Item($r, 10).Text.Trim()
    $newEnd = [string]$wsPlan.Cells.Item($r, 11).Text.Trim()
    $newMonths = 0; [int]::TryParse([string]$wsPlan.Cells.Item($r, 12).Value2, [ref]$newMonths) | Out-Null
    $newTarget = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 13).Value2, [ref]$newTarget) | Out-Null
    $payTimes = 0; [int]::TryParse([string]$wsPlan.Cells.Item($r, 14).Value2, [ref]$payTimes) | Out-Null
    $targetQtr = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 15).Value2, [ref]$targetQtr) | Out-Null
    $targetMth = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 16).Value2, [ref]$targetMth) | Out-Null
    $totalAmt = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 17).Value2, [ref]$totalAmt) | Out-Null
    
    $mthIn2026 = 0; [int]::TryParse([string]$wsPlan.Cells.Item($r, 18).Value2, [ref]$mthIn2026) | Out-Null
    $amtIn2026 = 0; [double]::TryParse([string]$wsPlan.Cells.Item($r, 19).Value2, [ref]$amtIn2026) | Out-Null
    
    $tpo = [string]$wsPlan.Cells.Item($r, 20).Text.Trim()
    $remark = [string]$wsPlan.Cells.Item($r, 21).Text.Trim()
    
    $item = [ordered]@{
        outlet_id      = $oid
        customer_name  = $name
        old_start      = $oldStart
        old_end        = $oldEnd
        old_months     = $oldMonths
        old_target     = $oldTarget
        old_oo_amount  = $oldOO
        old_pay_count  = $oldPayCount
        cost_per_case  = [math]::Round($costPerCase, 0)
        new_start      = $newStart
        new_end        = $newEnd
        new_months     = $newMonths
        new_target     = $newTarget
        pay_times      = $payTimes
        target_quarter = [math]::Round($targetQtr, 0)
        target_month   = [math]::Round($targetMth, 0)
        total_amount   = [math]::Round($totalAmt, 0)
        months_in_2026 = $mthIn2026
        amount_in_2026 = [math]::Round($amtIn2026, 0)
        tpo_status     = if ($tpo) { $tpo } else { "TPO" }
        remark         = $remark
    }
    $subdPlans += $item
}
Write-Host "   -> Successfully loaded $($subdPlans.Count) SubD Plans." -ForegroundColor Green

# -------------------------------------------------------------
# 2. TRÍCH XUẤT THANH TOÁN OSR (SHEET2)
# -------------------------------------------------------------
Write-Host "Extracting Payments from 'Sheet2'..."
$wsS2 = $wb.Worksheets.Item("Sheet2")
$payments = @()

# Rows 2 to 57 are real payment disbursements (56 payments)
for ($r = 2; $r -le 57; $r++) {
    $oid = [string]$wsS2.Cells.Item($r, 3).Text.Trim()
    $cname = [string]$wsS2.Cells.Item($r, 4).Text.Trim()
    if (-not $oid) { continue }
    
    $oaf = [string]$wsS2.Cells.Item($r, 1).Text.Trim()
    $contract = [string]$wsS2.Cells.Item($r, 2).Text.Trim()
    $areaId = [string]$wsS2.Cells.Item($r, 5).Text.Trim()
    $startD = [string]$wsS2.Cells.Item($r, 6).Text.Trim()
    $endD = [string]$wsS2.Cells.Item($r, 7).Text.Trim()
    $noMonths = 0; [int]::TryParse([string]$wsS2.Cells.Item($r, 10).Value2, [ref]$noMonths) | Out-Null
    $brand = [string]$wsS2.Cells.Item($r, 11).Text.Trim()
    $target = 0; [double]::TryParse([string]$wsS2.Cells.Item($r, 12).Value2, [ref]$target) | Out-Null
    $ooAmt = 0; [double]::TryParse([string]$wsS2.Cells.Item($r, 14).Value2, [ref]$ooAmt) | Out-Null
    $ooStatus = [string]$wsS2.Cells.Item($r, 15).Text.Trim()
    $beneficiary = [string]$wsS2.Cells.Item($r, 16).Text.Trim()
    $schedD = [string]$wsS2.Cells.Item($r, 17).Text.Trim()
    $actualD = [string]$wsS2.Cells.Item($r, 18).Text.Trim()
    $actualAmt = 0; [double]::TryParse([string]$wsS2.Cells.Item($r, 19).Value2, [ref]$actualAmt) | Out-Null
    $notes = [string]$wsS2.Cells.Item($r, 20).Text.Trim()
    $area = [string]$wsS2.Cells.Item($r, 21).Text.Trim()
    $ss = [string]$wsS2.Cells.Item($r, 22).Text.Trim()
    
    $disbursedPct = if ($ooAmt -gt 0) { [math]::Round(($actualAmt / $ooAmt) * 100, 1) } else { 0 }
    
    $pItem = [ordered]@{
        row_id         = $r
        oaf_number     = $oaf
        contract_no    = $contract
        outlet_id      = $oid
        customer_name  = $cname
        area           = if ($area) { $area } else { "South 9" }
        ss_name        = if ($ss) { $ss } else { "Chưa gán SS" }
        brand_id       = $brand
        target_vol     = $target
        oo_amount      = [math]::Round($ooAmt, 0)
        actual_amount  = [math]::Round($actualAmt, 0)
        disbursed_pct  = $disbursedPct
        oo_status      = $ooStatus
        schedule_date  = $schedD
        actual_date    = $actualD
        aging_days     = 0
        payment_status = $ooStatus
        payment_notes  = $notes
    }
    $payments += $pItem
}
Write-Host "   -> Successfully loaded $($payments.Count) Payment Records." -ForegroundColor Green

$wb.Close($false)
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null

$dataExport = [ordered]@{
    meta = [ordered]@{
        generated_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        total_subd_plans = $subdPlans.Count
        total_payments = $payments.Count
        source_file = $filePlan
    }
    plans = $subdPlans
    payments = $payments
}

$jsonPath = Join-Path $dataMartDir "plan_payment_data.json"
$jsonStr = $dataExport | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($jsonPath, $jsonStr, [System.Text.Encoding]::UTF8)
Write-Host "`nExported raw data successfully to: $jsonPath" -ForegroundColor Yellow
