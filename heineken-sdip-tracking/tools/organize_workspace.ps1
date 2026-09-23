$rootDir = "d:\NTAN\AI For work\Agentic"
$projectDir = Join-Path $rootDir "heineken-sdip-tracking"

Write-Host "Organizing files into: $projectDir"

# 1. Create directory structure
$subfolders = @(
    "docs",
    "scripts",
    "dist",
    "tools\audit",
    "tools\scratch"
)

foreach ($sub in $subfolders) {
    $targetPath = Join-Path $projectDir $sub
    if (-not (Test-Path -LiteralPath $targetPath)) {
        New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        Write-Host "Created: $targetPath"
    }
}

# 2. Define File Mappings
$mappings = @(
    # Docs
    @{ File = "DATA_CONNECTION_LOGIC.md"; Dest = "docs" },

    # Scripts
    @{ File = "build_september_data.ps1"; Dest = "scripts" },
    @{ File = "generate_dashboard_html.js"; Dest = "scripts" },
    @{ File = "Run_Update_September.bat"; Dest = "scripts" },

    # Dist
    @{ File = "dashboard_september_2026.html"; Dest = "dist" },
    @{ File = "sdip_data_202609.json"; Dest = "dist" },

    # Tools / Audit
    @{ File = "audit_excel_structure.ps1"; Dest = "tools\audit" },
    @{ File = "audit_targets.ps1"; Dest = "tools\audit" },
    @{ File = "audit_thang9_new.ps1"; Dest = "tools\audit" },
    @{ File = "check_overview_breakdown.ps1"; Dest = "tools\audit" },
    @{ File = "check_thang9_areas.ps1"; Dest = "tools\audit" },
    @{ File = "check_thang9_other_areas.ps1"; Dest = "tools\audit" },
    @{ File = "cross_check_subds.ps1"; Dest = "tools\audit" },
    @{ File = "inspect_overview_sample.ps1"; Dest = "tools\audit" },
    @{ File = "inspect_target_cols.ps1"; Dest = "tools\audit" },
    @{ File = "inspect_target_layout.ps1"; Dest = "tools\audit" },
    @{ File = "read_audit.js"; Dest = "tools\audit" },
    @{ File = "read_audit_targets.js"; Dest = "tools\audit" },
    @{ File = "excel_audit_results.json"; Dest = "tools\audit" },
    @{ File = "excel_audit_targets.json"; Dest = "tools\audit" },

    # Tools / Scratch
    @{ File = "scratch_analyze_scripts.js"; Dest = "tools\scratch" },
    @{ File = "scratch_breakdown_keys.js"; Dest = "tools\scratch" },
    @{ File = "scratch_check_handlers.js"; Dest = "tools\scratch" },
    @{ File = "scratch_check_listeners.js"; Dest = "tools\scratch" },
    @{ File = "scratch_check_payload.js"; Dest = "tools\scratch" },
    @{ File = "scratch_check_tabs.js"; Dest = "tools\scratch" },
    @{ File = "scratch_inspect.js"; Dest = "tools\scratch" },
    @{ File = "scratch_inspect.py"; Dest = "tools\scratch" },
    @{ File = "scratch_inspect_html.js"; Dest = "tools\scratch" },
    @{ File = "scratch_inspect_script5.js"; Dest = "tools\scratch" },
    @{ File = "scratch_inspect_subd.js"; Dest = "tools\scratch" }
)

foreach ($m in $mappings) {
    $src = Join-Path $rootDir $m.File
    $dst = Join-Path (Join-Path $projectDir $m.Dest) $m.File
    if (Test-Path -LiteralPath $src) {
        Move-Item -LiteralPath $src -Destination $dst -Force
        Write-Host "Moved: $($m.File) -> $($m.Dest)"
    }
}

Write-Host "`nAll files organized successfully!"
