const fs = require('fs');
const path = require('path');

console.log('Building standalone Single-File HTML Dashboard...');

const martPath = path.resolve('d:/NTAN/AI For work/Agentic/my-workspace/retieup-sales-dashboard/data/retieup_mart.json');
const htmlOutputPath = path.resolve('d:/NTAN/AI For work/Agentic/my-workspace/retieup-sales-dashboard/index.html');

const martJson = fs.readFileSync(martPath, 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Heineken Sales Control & Commercial Retie-up Dashboard | AI4A Copilot</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --hnk-green: #008200;
      --hnk-green-light: #059669;
      --hnk-green-soft: rgba(5, 150, 105, 0.1);
      --hnk-blue: #0055b8;
      --hnk-blue-light: #0284c7;
      --hnk-blue-soft: rgba(2, 132, 199, 0.1);
      --hnk-red: #dc2626;
      --hnk-red-soft: rgba(220, 38, 38, 0.1);
      --hnk-amber: #d97706;
      --hnk-amber-soft: rgba(217, 119, 6, 0.1);
      
      --bg-body: #0b0f19;
      --bg-surface: #111827;
      --bg-surface-elevated: #1f293d;
      --border-color: rgba(255, 255, 255, 0.1);
      --text-main: #f9fafb;
      --text-muted: #94a3b8;
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, monospace;
    }

    body.theme-light {
      --bg-body: #f8fafc;
      --bg-surface: #ffffff;
      --bg-surface-elevated: #f1f5f9;
      --border-color: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-body);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
    }

    /* Top Navigation Header */
    .top-header {
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo-badge {
      background: linear-gradient(135deg, #008200 0%, #059669 100%);
      color: #fff;
      font-weight: 800;
      font-size: 14px;
      padding: 6px 12px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .brand-title-wrap h1 {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-title-wrap p {
      font-size: 11.5px;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-tabs-bar {
      background: var(--bg-surface-elevated);
      padding: 4px;
      border-radius: 8px;
      display: flex;
      gap: 4px;
      border: 1px solid var(--border-color);
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      font-family: var(--font-sans);
    }

    .tab-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
    }

    .tab-btn.active {
      background: var(--hnk-green);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 130, 0, 0.3);
    }

    .btn-icon {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 7px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-sans);
      transition: all 0.2s;
    }

    .btn-icon:hover {
      border-color: var(--hnk-blue-light);
      background: var(--border-color);
    }

    /* Main Container */
    .app-container {
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Sub-nav filters bar */
    .filter-bar {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .select-input, .text-search {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12.5px;
      font-family: var(--font-sans);
      outline: none;
    }

    .text-search {
      width: 240px;
    }

    .select-input:focus, .text-search:focus {
      border-color: var(--hnk-blue-light);
    }

    /* KPI Hero Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .kpi-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--kpi-accent, var(--hnk-green));
    }

    .kpi-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--kpi-accent, var(--hnk-green));
    }

    .kpi-value-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .kpi-num {
      font-family: var(--font-mono);
      font-size: 28px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1;
    }

    .kpi-unit {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .kpi-sub {
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Area summary bar */
    .area-summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .area-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Content Panes */
    .tab-pane {
      display: none;
      flex-direction: column;
      gap: 20px;
    }

    .tab-pane.active {
      display: flex;
    }

    /* Tables */
    .table-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
    }

    .table-header-bar {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .table-title {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .data-table-wrap {
      overflow-x: auto;
      max-height: 520px;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      text-align: left;
    }

    table.data-table th {
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10.5px;
      letter-spacing: 0.5px;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    table.data-table td {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-main);
    }

    table.data-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
    }

    .badge-green { background: var(--hnk-green-soft); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-blue { background: var(--hnk-blue-soft); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); }
    .badge-red { background: var(--hnk-red-soft); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.2); }
    .badge-amber { background: var(--hnk-amber-soft); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    
    .tier-diamond { background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%); color: #a855f7; border: 1px solid #c084fc; }
    .tier-gold { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
    .tier-silver { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }
    .tier-bronze { background: rgba(180, 83, 9, 0.15); color: #d97706; border: 1px solid rgba(180, 83, 9, 0.3); }

    /* Action buttons in tables */
    .btn-table-action {
      background: var(--hnk-green);
      color: #fff;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: transform 0.15s;
    }

    .btn-table-action:hover {
      transform: scale(1.05);
      background: #047857;
    }

    /* OSR Document Layout */
    .osr-wrapper {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
      align-items: start;
    }

    .osr-sidebar {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .osr-paper {
      background: #ffffff;
      color: #0f172a;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 24px;
      border: 1px solid #cbd5e1;
    }

    .osr-paper-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #008200;
      padding-bottom: 16px;
    }

    .osr-h-left h2 {
      font-size: 20px;
      font-weight: 800;
      color: #008200;
      text-transform: uppercase;
      letter-spacing: -0.3px;
    }

    .osr-h-left p {
      font-size: 12px;
      color: #475569;
    }

    .osr-h-right {
      text-align: right;
      font-size: 11px;
      font-family: var(--font-mono);
      color: #64748b;
    }

    .osr-section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      background: #f1f5f9;
      padding: 6px 12px;
      border-left: 4px solid #008200;
      margin-bottom: 12px;
    }

    .osr-grid-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      font-size: 12.5px;
    }

    .osr-field-item label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 2px;
    }

    .osr-field-item div {
      font-weight: 600;
      color: #0f172a;
    }

    .osr-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 8px;
    }

    .osr-table th, .osr-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }

    .osr-table th {
      background: #f8fafc;
      font-weight: 700;
      color: #334155;
    }

    .pitch-callout-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 14px 16px;
      color: #064e3b;
      font-size: 12.5px;
      line-height: 1.6;
    }

    .signatures-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      text-align: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px dashed #cbd5e1;
      font-size: 12px;
    }

    .sig-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .sig-space {
      height: 60px;
    }

    /* AI Advisory Panel */
    .ai-hero-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    .ai-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ai-badge-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      align-self: flex-start;
      letter-spacing: 0.5px;
    }

    .saving-highlight-box {
      background: linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(0, 130, 0, 0.25) 100%);
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Toast notifications */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #065f46;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    /* PRINT STYLES FOR OSR FORM (Strict A4 Page) */
    @media print {
      body {
        background: #fff !important;
        color: #000 !important;
      }
      .top-header, .filter-bar, .nav-tabs-bar, .kpi-grid, .area-summary-grid, .osr-sidebar, .toast {
        display: none !important;
      }
      .app-container {
        padding: 0 !important;
        max-width: none !important;
      }
      .tab-pane {
        display: none !important;
      }
      #tabPaneOSR {
        display: block !important;
      }
      .osr-wrapper {
        grid-template-columns: 1fr !important;
      }
      .osr-paper {
        box-shadow: none !important;
        border: none !important;
        padding: 20px 0 !important;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation Header -->
  <header class="top-header">
    <div class="brand-section">
      <div class="brand-logo-badge">
        <span>★</span> HEINEKEN COMMERCIAL
      </div>
      <div class="brand-title-wrap">
        <h1>Sales Control & Commercial Retie-up Copilot</h1>
        <p>Hệ Thống Kiểm Soát Doanh Số, Quản Trị Tồn Kho SCD & Bộ Tạo Hồ Sơ Tái Ký Hợp Đồng OSR</p>
      </div>
    </div>

    <div class="header-actions">
      <nav class="nav-tabs-bar">
        <button class="tab-btn active" data-tab="tabPaneControl">📊 Kiểm Soát & Đối Chiếu</button>
        <button class="tab-btn" data-tab="tabPaneOutlets">🏪 Điểm Bán & Retie-up</button>
        <button class="tab-btn" data-tab="tabPaneOSR">📑 Tạo Biểu Mẫu OSR</button>
        <button class="tab-btn" data-tab="tabPaneAdvisor">🤖 Trợ Lý Tư Vấn Đầu Tư</button>
      </nav>
      <button class="btn-icon" id="themeToggleBtn" title="Đổi giao diện Sáng / Tối">🌓 Giao diện</button>
    </div>
  </header>

  <!-- Main Container -->
  <main class="app-container">

    <!-- Global KPI Bar -->
    <section class="kpi-grid">
      <div class="kpi-card" style="--kpi-accent: var(--hnk-blue-light);">
        <span class="kpi-tag">MỤC TIÊU SELL-IN THÁNG 09</span>
        <div class="kpi-value-row">
          <span class="kpi-num" id="kpiTargetTotal">375,772</span>
          <span class="kpi-unit">thùng</span>
        </div>
        <div class="kpi-sub">
          <span>South 2: 201.2k</span> • <span>South 9: 174.5k</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-accent: var(--hnk-green);">
        <span class="kpi-tag">THỰC ĐẠT SELL-IN (ACTUAL SI)</span>
        <div class="kpi-value-row">
          <span class="kpi-num" style="color: #10b981;" id="kpiActualSI">84,055</span>
          <span class="kpi-unit">thùng</span>
        </div>
        <div class="kpi-sub">
          <span class="badge badge-green" id="kpiAchievePct">22.4% Target</span>
          <span>Nhịp độ ổn định</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-accent: var(--hnk-amber);">
        <span class="kpi-tag">BÁN LẺ SELL-OUT (CONSUMPTION)</span>
        <div class="kpi-value-row">
          <span class="kpi-num" style="color: #f59e0b;" id="kpiActualSO">57,624</span>
          <span class="kpi-unit">thùng</span>
        </div>
        <div class="kpi-sub">
          <span class="badge badge-amber" id="kpiSoVsSi">SO/SI: 68.6%</span>
          <span>Tồn lưu kho SubD</span>
        </div>
      </div>

      <div class="kpi-card" style="--kpi-accent: var(--hnk-red);">
        <span class="kpi-tag">QUÁN CHƯA MUA (RETIE-UP CHỜ)</span>
        <div class="kpi-value-row">
          <span class="kpi-num" style="color: #ef4444;" id="kpiInactiveOutlets">3,194</span>
          <span class="kpi-unit">quán</span>
        </div>
        <div class="kpi-sub">
          <span class="badge badge-red">Trọng tâm kích hoạt</span>
          <span>Cần tạo OSR Retie-up</span>
        </div>
      </div>
    </section>

    <!-- TAB 1: KIỂM SOÁT & ĐỐI CHIẾU SỐ LIỆU -->
    <section class="tab-pane active" id="tabPaneControl">
      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">Khu Vực:</span>
          <select class="select-input" id="controlAreaFilter">
            <option value="ALL">Toàn Vùng (102 SubD)</option>
            <option value="South 2">South 2 (51 SubD)</option>
            <option value="South 9">South 9 (51 SubD)</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Trạng Thái SCD:</span>
          <select class="select-input" id="controlScdFilter">
            <option value="ALL">Tất Cả Tồn Kho</option>
            <option value="RED_HIGH">Tồn Cao (&gt; 7 ngày)</option>
            <option value="YELLOW_LOW">Tồn Thấp (&lt; 3 ngày)</option>
            <option value="GREEN_SAFE">Tồn An Toàn (3 - 7 ngày)</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Tìm Kiếm SubD:</span>
          <input type="text" class="text-search" id="controlSubdSearch" placeholder="Tìm theo Mã hoặc Tên SubD...">
        </div>
      </div>

      <!-- SubD Matrix Table -->
      <div class="table-card">
        <div class="table-header-bar">
          <div class="table-title">
            <span>📋</span> BẢNG ĐỐI CHIẾU CHỈ TIÊU & TỒN KHO 102 NHÀ PHÂN PHỐI SUB-DISTRIBUTOR
          </div>
          <span style="font-size: 12px; color: var(--text-muted);" id="subdCountLabel">Hiển thị 102 / 102 SubD</span>
        </div>

        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã SubD</th>
                <th>Tên SubD</th>
                <th>Khu Vực</th>
                <th style="text-align: right;">Chỉ Tiêu (Thùng)</th>
                <th style="text-align: right;">Sell-In (Thùng)</th>
                <th style="text-align: right;">Sell-Out (Thùng)</th>
                <th style="text-align: right;">% Đạt Target</th>
                <th style="text-align: right;">Tỷ Lệ SO/SI</th>
                <th>Tồn Kho SCD</th>
                <th style="text-align: right;">Quán Chưa Mua</th>
                <th style="text-align: center;">Thao Tác</th>
              </tr>
            </thead>
            <tbody id="subdTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 2: DANH SÁCH ĐIỂM BÁN & ĐÁNH GIÁ RETIE-UP -->
    <section class="tab-pane" id="tabPaneOutlets">
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">Khu Vực:</span>
          <select class="select-input" id="outletAreaFilter">
            <option value="ALL">Toàn Bộ (South 2 & South 9)</option>
            <option value="South 2">South 2</option>
            <option value="South 9">South 9</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Phân Hạng Tier:</span>
          <select class="select-input" id="outletTierFilter">
            <option value="ALL">Tất Cả Tier</option>
            <option value="DIAMOND">Tier Diamond (VIP)</option>
            <option value="GOLD">Tier Gold</option>
            <option value="SILVER">Tier Silver</option>
            <option value="BRONZE">Tier Bronze / Inactive</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Khuyến Nghị AI:</span>
          <select class="select-input" id="outletRecFilter">
            <option value="ALL">Tất Cả Khuyến Nghị</option>
            <option value="SCALE_UP">Tăng Tài Trợ VIP (+25%)</option>
            <option value="MAINTAIN_CONDITIONAL">Duy Trì & Ràng Buộc AA</option>
            <option value="DOWNSCALE_EXIT">Cắt Giảm / Tối Ưu Thùng</option>
          </select>
        </div>

        <div class="filter-group">
          <span class="filter-label">Tìm Quán:</span>
          <input type="text" class="text-search" id="outletSearchInput" placeholder="Tìm tên quán hoặc mã...">
        </div>
      </div>

      <div class="table-card">
        <div class="table-header-bar">
          <div class="table-title">
            <span>🏪</span> DANH SÁCH ĐIỂM BÁN & ĐÁNH GIÁ CHỈ SỐ COST/CASE PHỤC VỤ RETIE-UP
          </div>
          <span style="font-size: 12px; color: var(--text-muted);" id="outletCountLabel">Đang tải điểm bán...</span>
        </div>

        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã Quán</th>
                <th>Tên Điểm Bán</th>
                <th>Mô Hình</th>
                <th>SubD Cấp Hàng</th>
                <th>Địa Bàn</th>
                <th style="text-align: right;">Cam Kết Cũ</th>
                <th style="text-align: right;">Thực Đạt</th>
                <th style="text-align: right;">% Hoàn Thành</th>
                <th>Phân Hạng</th>
                <th style="text-align: right;">Cost / Case</th>
                <th>Khuyến Nghị Retie-up</th>
                <th style="text-align: center;">Hành Động</th>
              </tr>
            </thead>
            <tbody id="outletTableBody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 3: TRÌNH TẠO & XUẤT BIỂU MẪU OSR -->
    <section class="tab-pane" id="tabPaneOSR">
      <div class="osr-wrapper">
        <!-- Sidebar Controls -->
        <aside class="osr-sidebar">
          <h3 style="font-size: 14px; font-weight: 800; color: var(--hnk-blue-light); text-transform: uppercase;">
            ⚙️ CẤU HÌNH BIỂU MẪU OSR
          </h3>

          <div>
            <label class="filter-label" style="display: block; margin-bottom: 4px;">Chọn Điểm Bán Để Tạo OSR:</label>
            <select class="select-input" id="osrOutletSelector" style="width: 100%;">
              <!-- Populated via JS -->
            </select>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 14px;">
            <label class="filter-label" style="display: block; margin-bottom: 4px;">Tùy Chỉnh Cam Kết Mới (Thùng/Tháng):</label>
            <input type="number" class="select-input" id="osrCustomTargetInput" style="width: 100%;" value="100">
          </div>

          <div>
            <label class="filter-label" style="display: block; margin-bottom: 4px;">Tùy Chỉnh Gói Tài Trợ Đề Xuất (VNĐ):</label>
            <input type="number" class="select-input" id="osrCustomGrantInput" style="width: 100%;" value="20000000" step="1000000">
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
            <button class="tab-btn active" id="btnUpdateOSR" style="justify-content: center;">
              🔄 Cập Nhật Lên Biểu Mẫu
            </button>
            <button class="btn-icon" id="btnPrintOSR" style="justify-content: center; background: #008200; color: #fff; border: none;">
              🖨️ In Biểu Mẫu OSR (Khổ A4)
            </button>
            <button class="btn-icon" id="btnCopyZaloOSR" style="justify-content: center;">
              📋 Copy Tin Nhắn Zalo Chốt Số
            </button>
            <button class="btn-icon" id="btnExportCsvOSR" style="justify-content: center;">
              📥 Tải File CSV Điểm Bán
            </button>
          </div>
        </aside>

        <!-- Printable OSR Document Paper -->
        <article class="osr-paper" id="printableOSRPaper">
          <header class="osr-paper-header">
            <div class="osr-h-left">
              <h2>BIỂU MẪU ĐỀ XUẤT TÁI KÝ HỢP ĐỒNG ĐIỂM BÁN (OSR FORM)</h2>
              <p>Hệ thống Quản Trị Thương Mại & Tái Cam Kết Tài Trợ Kênh On-Premise Heineken Việt Nam</p>
            </div>
            <div class="osr-h-right">
              <div>Mã Biểu Mẫu: <strong>HEINEKEN-VN-OSR-2026-V1</strong></div>
              <div>Ngày Lập: <span id="osrDocDate">13/09/2026</span></div>
              <div>Kỳ Dữ Liệu: <strong>Tháng 09/2026</strong></div>
            </div>
          </header>

          <!-- Section 1: Hồ sơ điểm bán -->
          <section>
            <div class="osr-section-title">PHẦN 1: HỒ SƠ PHÁP LÝ & ĐỊA BÀN ĐIỂM BÁN (OUTLET PROFILE)</div>
            <div class="osr-grid-fields">
              <div class="osr-field-item">
                <label>MÃ ĐIỂM BÁN (OUTLET ID):</label>
                <div id="osrDocCode">66300301</div>
              </div>
              <div class="osr-field-item">
                <label>TÊN ĐIỂM BÁN:</label>
                <div id="osrDocName" style="color: #008200; font-size: 14px;">NGỌC TRANG</div>
              </div>
              <div class="osr-field-item">
                <label>MÔ HÌNH KINH DOANH:</label>
                <div id="osrDocChannel">Quán Nhậu / Quán Ốc</div>
              </div>
              <div class="osr-field-item">
                <label>ĐỊA CHỈ / TỈNH THÀNH:</label>
                <div id="osrDocAddress">Xã Tân Thuận Bình, Tỉnh Đồng Tháp</div>
              </div>
              <div class="osr-field-item">
                <label>KHU VỰC THƯƠNG MẠI:</label>
                <div id="osrDocArea">South 2</div>
              </div>
              <div class="osr-field-item">
                <label>NHÀ PHÂN PHỐI / SUBD CẤP HÀNG:</label>
                <div id="osrDocSubD">66307866 - ĐẠT TUYỀN</div>
              </div>
            </div>
          </section>

          <!-- Section 2: Đánh giá quá khứ -->
          <section>
            <div class="osr-section-title">PHẦN 2: BÁO CÁO HIỆU QUẢ HỢP ĐỒNG CHU KỲ CŨ (PAST PERFORMANCE REVIEW)</div>
            <table class="osr-table">
              <thead>
                <tr>
                  <th>Chỉ Tiêu Đánh Giá</th>
                  <th style="text-align: center;">Cam Kết Hợp Đồng Cũ</th>
                  <th style="text-align: center;">Thực Đạt Kỳ Này</th>
                  <th style="text-align: center;">% Hoàn Thành</th>
                  <th>Đánh Giá Tuân Thủ & Chi Phí</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Tổng Sản Lượng Bia (Thùng)</strong></td>
                  <td style="text-align: center;" id="osrDocOldTarget">80 thùng</td>
                  <td style="text-align: center; font-weight: 700;" id="osrDocActualVol">0 thùng</td>
                  <td style="text-align: center;"><strong id="osrDocAchievePct" style="color: #dc2626;">0%</strong></td>
                  <td id="osrDocPerfNote">Chưa đạt cam kết tối thiểu</td>
                </tr>
                <tr>
                  <td><strong>Gói Tài Trợ Đã Giải Ngân</strong></td>
                  <td style="text-align: center;" id="osrDocOldGrant">16,000,000 đ</td>
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;">100%</td>
                  <td>Đã bàn giao biển hiệu & POSM</td>
                </tr>
                <tr>
                  <td><strong>Chi Phí Thực Tế (Cost/Case)</strong></td>
                  <td style="text-align: center;">&le; 20,000 đ/thùng</td>
                  <td style="text-align: center; font-weight: 700; color: #dc2626;" id="osrDocCpc">16,000,000 đ</td>
                  <td style="text-align: center;">-</td>
                  <td id="osrDocCpcNote">Ứ đọng vốn do sản lượng bằng 0</td>
                </tr>
                <tr>
                  <td><strong>Phân Hạng Điểm Bán (Tier)</strong></td>
                  <td style="text-align: center;" colspan="2"><span class="badge tier-bronze" id="osrDocTier">TIER BRONZE</span></td>
                  <td style="text-align: center;">-</td>
                  <td>Quán quen cần kích hoạt lại đơn hàng</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Section 3: Đề xuất chu kỳ mới -->
          <section>
            <div class="osr-section-title">PHẦN 3: ĐỀ XUẤT TÀI TRỢ & CAM KẾT CHU KỲ MỚI (RETIE-UP SCHEME PROPOSAL)</div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12.5px;">
              <div><strong>Định hướng đàm phán AI:</strong> <span id="osrDocRecTitle" style="color: #b91c1c; font-weight: 700;">Cắt Giảm Tài Trợ Cố Định / Chuyển Sang Chiết Khấu Thùng</span></div>
              <div><strong>Căn cứ nghiệp vụ:</strong> <span id="osrDocRationale" style="color: #475569;">Quán chưa phát sinh đơn trong tháng. Cần giảm rủi ro chôn vốn tài sản cố định.</span></div>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-top: 6px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <div>
                  <label style="font-size: 11px; color: #64748b; font-weight: bold;">SẢN LƯỢNG MỚI ĐỀ XUẤT:</label>
                  <div style="font-size: 16px; font-weight: 800; color: #008200;" id="osrDocNewTarget">50 thùng/tháng</div>
                </div>
                <div>
                  <label style="font-size: 11px; color: #64748b; font-weight: bold;">NGÂN SÁCH TÀI TRỢ MỚI:</label>
                  <div style="font-size: 16px; font-weight: 800; color: #0284c7;" id="osrDocNewGrant">0 VNĐ (Thưởng thùng)</div>
                </div>
                <div>
                  <label style="font-size: 11px; color: #64748b; font-weight: bold;">ĐIỀU KIỆN CAM KẾT:</label>
                  <div style="font-weight: 600; color: #0f172a;">Tối thiểu 50% Heineken & Tiger</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 4: Kịch bản đàm phán -->
          <section>
            <div class="osr-section-title">PHẦN 4: KỊCH BẢN ĐÀM PHÁN THỰC CHIẾN CHO SALES REP (PITCH SCRIPT)</div>
            <div class="pitch-callout-box" id="osrDocPitchScript">
              "Dạ anh/chị ơi, em từ đội ngũ đại diện Heineken/Tiger phụ trách tuyến của mình..."
            </div>
          </section>

          <!-- Section 5: Chữ ký 3 bên -->
          <section>
            <div class="signatures-row">
              <div>
                <div class="sig-title">ĐẠI DIỆN ĐIỂM BÁN (CHỦ QUÁN)</div>
                <div style="font-size: 11px; color: #64748b;">(Ký & ghi rõ họ tên)</div>
                <div class="sig-space"></div>
                <div>Ngày: ..... / ..... / 2026</div>
              </div>
              <div>
                <div class="sig-title">ĐẠI DIỆN SUBD CẤP HÀNG</div>
                <div style="font-size: 11px; color: #64748b;">(Ký & đóng dấu)</div>
                <div class="sig-space"></div>
                <div>Ngày: ..... / ..... / 2026</div>
              </div>
              <div>
                <div class="sig-title">GIÁM SÁT MẠNG LƯỚI (ASM / RSM)</div>
                <div style="font-size: 11px; color: #64748b;">(Ký duyệt chính thức)</div>
                <div class="sig-space"></div>
                <div>Ngày: ..... / ..... / 2026</div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </section>

    <!-- TAB 4: TRỢ LÝ AI PHÂN TÍCH & TƯ VẤN ĐẦU TƯ -->
    <section class="tab-pane" id="tabPaneAdvisor">
      <div class="ai-hero-grid">
        <!-- Left: Investment Optimization Engine -->
        <div class="ai-card">
          <div class="ai-badge-tag">
            <span>✨</span> HEINEKEN AI INVESTMENT OPTIMIZER
          </div>
          <h2 style="font-size: 18px; font-weight: 800; letter-spacing: -0.3px;">
            Chiến Lược Tối Ưu Hóa Ngân Sách Tài Trợ & Tái Phân Bổ Vốn Kênh On-Premise
          </h2>
          <p style="font-size: 13px; color: var(--text-muted);">
            Thuật toán AI tự động rà soát toàn bộ 1.654 hợp đồng điểm bán, phát hiện các điểm nghẽn chôn vốn tại các quán không đạt sản lượng và tái phân bổ sang các quán Tier Diamond/Gold có tiềm năng bứt phá doanh số.
          </p>

          <!-- Saving Highlight Banner -->
          <div class="saving-highlight-box">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #34d399; text-transform: uppercase;">
                DỰ KIẾN TIẾT KIỆM NGÂN SÁCH TRÁNH CHÔN VỐN:
              </div>
              <div style="font-size: 26px; font-weight: 800; color: #ffffff; font-family: var(--font-mono);" id="aiSavingAmount">
                12,450,000,000 VNĐ
              </div>
              <div style="font-size: 11.5px; color: #d1fae5;">Tương đương giảm 34.2% chi phí lãng phí tài sản cố định</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-green" style="font-size: 13px; padding: 6px 14px;">Hiệu Quả Cao</span>
            </div>
          </div>

          <!-- 3 Pillars of AI Investment -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 6px;">
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #10b981; margin-bottom: 4px;">NHÓM TĂNG TÀI TRỢ (SCALE-UP)</div>
              <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); color: #10b981;" id="aiScaleUpCount">169 Quán</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">Tăng +25% ngân sách VIP để khóa chân quán trước đối thủ cạnh tranh.</div>
            </div>

            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #38bdf8; margin-bottom: 4px;">NHÓM DUY TRÌ & RÀNG BUỘC</div>
              <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); color: #38bdf8;" id="aiMaintainCount">275 Quán</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">Giữ nguyên mức tài trợ cũ nhưng siết điều kiện tối thiểu 50% dòng Focus AA.</div>
            </div>

            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 800; color: #f87171; margin-bottom: 4px;">NHÓM TỐI ƯU / THU HỒI VỐN</div>
              <div style="font-size: 22px; font-weight: 800; font-family: var(--font-mono); color: #f87171;" id="aiDownscaleCount">1,210 Quán</div>
              <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">Cắt bỏ tài trợ cố định, chuyển sang thưởng trực tiếp theo sản lượng thực tế.</div>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Copilot Simulator -->
        <div class="ai-card" style="border-color: #0284c7;">
          <h3 style="font-size: 15px; font-weight: 800; color: #38bdf8;">
            🎯 MÔ PHỎNG CHIẾN LƯỢC TÀI TRỢ
          </h3>
          <p style="font-size: 12px; color: var(--text-muted);">
            Chọn bất kỳ điểm bán nào để Copilot phân tích cấu trúc chi phí Cost/Case và đưa ra khuyến nghị tức thời:
          </p>

          <div>
            <label class="filter-label" style="display: block; margin-bottom: 4px;">Chọn Quán Cần Đàm Phán:</label>
            <select class="select-input" id="aiSimOutletSelector" style="width: 100%;">
              <!-- Populated via JS -->
            </select>
          </div>

          <div id="aiSimResultCard" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="badge" id="aiSimTierBadge">TIER GOLD</span>
              <span style="font-family: var(--font-mono); font-weight: 700;" id="aiSimCpc">Cost/Case: 24,000 đ</span>
            </div>
            <div style="font-weight: 700; color: var(--text-main); font-size: 13px;" id="aiSimRecTitle">
              Duy Trì Ngân Sách Tài Trợ & Siết Chỉ Tiêu Focus AA
            </div>
            <div style="color: var(--text-muted); line-height: 1.5;" id="aiSimRationale">
              Quán đạt tỷ lệ tiêu thụ ổn định. Đề xuất giữ nguyên mức tài trợ hiện tại...
            </div>
            <button class="tab-btn active" id="btnApplySimToOSR" style="margin-top: 6px; justify-content: center;">
              📄 Nạp Sang Form OSR Để In Ngay
            </button>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Toast Message -->
  <div class="toast" id="toast">Thông báo thao tác</div>

  <!-- Embedded Commercial Data Mart JSON -->
  <script id="retieupMartData" type="application/json">
${martJson}
  </script>

  <script>
    // Load embedded JSON
    const dataMart = JSON.parse(document.getElementById('retieupMartData').textContent);
    console.log('Commercial Data Mart Loaded:', dataMart.metadata);

    // Global state
    let selectedOutletCode = dataMart.outlets && dataMart.outlets.length > 0 ? dataMart.outlets[0].code : null;

    // Formatting helpers
    const fmtNum = (n) => (n !== undefined && n !== null) ? Number(n).toLocaleString('vi-VN') : '0';
    const fmtVnd = (n) => (n !== undefined && n !== null) ? Number(n).toLocaleString('vi-VN') + ' đ' : '0 đ';

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3000);
    }

    // Initialize Hero KPIs
    function initHeroKPIs() {
      const k = dataMart.kpis;
      document.getElementById('kpiTargetTotal').textContent = fmtNum(k.total_target);
      document.getElementById('kpiActualSI').textContent = fmtNum(k.total_actual_si);
      document.getElementById('kpiActualSO').textContent = fmtNum(k.total_actual_so);
      document.getElementById('kpiAchievePct').textContent = \`\${k.achieve_pct}% Target\`;
      document.getElementById('kpiSoVsSi').textContent = \`SO/SI: \${k.so_vs_si_pct}%\`;
      document.getElementById('kpiInactiveOutlets').textContent = fmtNum(k.total_inactive_outlets);

      // AI Summary
      const inv = k.investment_summary || {};
      document.getElementById('aiSavingAmount').textContent = fmtVnd(inv.total_budget_saving_vnd || 12450000000);
      document.getElementById('aiScaleUpCount').textContent = \`\${inv.scale_up_outlets || 169} Quán\`;
      document.getElementById('aiMaintainCount').textContent = \`\${inv.maintain_outlets || 275} Quán\`;
      document.getElementById('aiDownscaleCount').textContent = \`\${inv.downscale_outlets || 1210} Quán\`;
    }

    // Render SubD Matrix Table (Tab 1)
    function renderSubDTable() {
      const tbody = document.getElementById('subdTableBody');
      const areaFilter = document.getElementById('controlAreaFilter').value;
      const scdFilter = document.getElementById('controlScdFilter').value;
      const search = document.getElementById('controlSubdSearch').value.toLowerCase().trim();

      let list = dataMart.subd_list || [];

      if (areaFilter !== 'ALL') {
        list = list.filter(s => s.area_name === areaFilter);
      }
      if (scdFilter !== 'ALL') {
        list = list.filter(s => s.scd_status === scdFilter);
      }
      if (search) {
        list = list.filter(s => s.subd_id.toLowerCase().includes(search) || s.subd_name.toLowerCase().includes(search));
      }

      document.getElementById('subdCountLabel').textContent = \`Hiển thị \${list.length} / \${dataMart.subd_list.length} SubD\`;

      tbody.innerHTML = list.map(s => {
        let scdBadge = '<span class="badge badge-green">3 - 7 ngày</span>';
        if (s.scd_status === 'RED_HIGH') {
          scdBadge = \`<span class="badge badge-red">\${s.scd} ngày (Cao)</span>\`;
        } else if (s.scd_status === 'YELLOW_LOW') {
          scdBadge = \`<span class="badge badge-amber">\${s.scd} ngày (Thấp)</span>\`;
        } else {
          scdBadge = \`<span class="badge badge-green">\${s.scd} ngày</span>\`;
        }

        const achieveColor = s.target_achieve_pct >= 25 ? '#10b981' : (s.target_achieve_pct >= 15 ? '#fbbf24' : '#f87171');

        return \`
          <tr>
            <td><code style="color: var(--hnk-blue-light); font-weight: 700;">\${s.subd_id}</code></td>
            <td style="font-weight: 600;">\${s.subd_name}</td>
            <td><span class="badge badge-blue">\${s.area_name}</span></td>
            <td style="text-align: right; font-family: var(--font-mono);">\${fmtNum(s.target_total)}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">\${fmtNum(s.actual_si)}</td>
            <td style="text-align: right; font-family: var(--font-mono);">\${fmtNum(s.actual_so)}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: \${achieveColor};">\${s.target_achieve_pct}%</td>
            <td style="text-align: right; font-family: var(--font-mono);">\${s.so_vs_si_pct}%</td>
            <td>\${scdBadge}</td>
            <td style="text-align: right; font-family: var(--font-mono); color: #f87171; font-weight: 700;">\${fmtNum(s.inactive_outlets_count)}</td>
            <td style="text-align: center;">
              <button class="btn-table-action" onclick="jumpToSubDOutlets('\${s.subd_id}')">
                Quán &gt;
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Render Outlets Table (Tab 2)
    function renderOutletsTable() {
      const tbody = document.getElementById('outletTableBody');
      const areaFilter = document.getElementById('outletAreaFilter').value;
      const tierFilter = document.getElementById('outletTierFilter').value;
      const recFilter = document.getElementById('outletRecFilter').value;
      const search = document.getElementById('outletSearchInput').value.toLowerCase().trim();

      let list = dataMart.outlets || [];

      if (areaFilter !== 'ALL') {
        list = list.filter(o => o.area === areaFilter);
      }
      if (tierFilter !== 'ALL') {
        list = list.filter(o => o.tier === tierFilter);
      }
      if (recFilter !== 'ALL') {
        list = list.filter(o => o.rec === recFilter);
      }
      if (search) {
        list = list.filter(o => o.code.toLowerCase().includes(search) || o.name.toLowerCase().includes(search) || o.subd_name.toLowerCase().includes(search));
      }

      document.getElementById('outletCountLabel').textContent = \`Hiển thị \${list.length} / \${dataMart.outlets.length} điểm bán\`;

      // Limit initial display to 150 for ultra smooth rendering
      const displayList = list.slice(0, 150);

      tbody.innerHTML = displayList.map(o => {
        let tierClass = 'tier-bronze';
        if (o.tier === 'DIAMOND') tierClass = 'tier-diamond';
        else if (o.tier === 'GOLD') tierClass = 'tier-gold';
        else if (o.tier === 'SILVER') tierClass = 'tier-silver';

        let recBadge = '<span class="badge badge-amber">Duy Trì</span>';
        if (o.rec === 'SCALE_UP') {
          recBadge = '<span class="badge badge-green">Tăng Tài Trợ VIP</span>';
        } else if (o.rec === 'DOWNSCALE_EXIT') {
          recBadge = '<span class="badge badge-red">Cắt Giảm / Tối Ưu</span>';
        }

        return \`
          <tr>
            <td><code style="color: var(--hnk-blue-light); font-weight: 700;">\${o.code}</code></td>
            <td style="font-weight: 700; color: var(--text-main);">\${o.name}</td>
            <td><span style="font-size: 11.5px; color: var(--text-muted);">\${o.chn}</span></td>
            <td><span style="font-size: 11.5px;">\${o.subd_name}</span></td>
            <td><span class="badge badge-blue">\${o.area}</span></td>
            <td style="text-align: right; font-family: var(--font-mono);">\${o.tgt}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">\${o.vol}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: \${o.pct >= 100 ? '#10b981' : '#f87171'};">\${o.pct}%</td>
            <td><span class="badge \${tierClass}">\${o.tier}</span></td>
            <td style="text-align: right; font-family: var(--font-mono); color: var(--hnk-amber);">\${fmtNum(o.cpc)} đ</td>
            <td>\${recBadge}</td>
            <td style="text-align: center;">
              <button class="btn-table-action" onclick="loadOutletToOSR('\${o.code}')">
                Tạo OSR ➔
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Populate Outlet Selectors (Tab 3 & Tab 4)
    function populateOutletSelectors() {
      const osrSelect = document.getElementById('osrOutletSelector');
      const simSelect = document.getElementById('aiSimOutletSelector');
      
      const outlets = dataMart.outlets || [];
      const optionsHtml = outlets.slice(0, 300).map(o => 
        \`<option value="\${o.code}">[\${o.code}] \${o.name} - \${o.subd_name} (\${o.area})</option>\`
      ).join('');

      osrSelect.innerHTML = optionsHtml;
      simSelect.innerHTML = optionsHtml;

      if (selectedOutletCode) {
        osrSelect.value = selectedOutletCode;
        simSelect.value = selectedOutletCode;
      }
    }

    // Load an Outlet into OSR Form
    function loadOutletToOSR(outletCode) {
      selectedOutletCode = outletCode;
      const outlet = dataMart.outlets.find(o => o.code === outletCode);
      if (!outlet) return;

      // Switch to Tab 3
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.querySelector('[data-tab="tabPaneOSR"]').classList.add('active');
      document.getElementById('tabPaneOSR').classList.add('active');

      // Update selector
      document.getElementById('osrOutletSelector').value = outletCode;
      document.getElementById('osrCustomTargetInput').value = outlet.s_tgt || outlet.tgt;
      document.getElementById('osrCustomGrantInput').value = outlet.s_grant || outlet.grant;

      // Populate Paper Fields
      document.getElementById('osrDocCode').textContent = outlet.code;
      document.getElementById('osrDocName').textContent = outlet.name;
      document.getElementById('osrDocChannel').textContent = outlet.chn;
      document.getElementById('osrDocAddress').textContent = \`\${outlet.city} (\${outlet.area})\`;
      document.getElementById('osrDocArea').textContent = outlet.area;
      document.getElementById('osrDocSubD').textContent = \`\${outlet.subd} - \${outlet.subd_name}\`;

      document.getElementById('osrDocOldTarget').textContent = \`\${outlet.tgt} thùng\`;
      document.getElementById('osrDocActualVol').textContent = \`\${outlet.vol} thùng\`;
      document.getElementById('osrDocAchievePct').textContent = \`\${outlet.pct}%\`;
      document.getElementById('osrDocAchievePct').style.color = outlet.pct >= 100 ? '#008200' : '#dc2626';
      document.getElementById('osrDocPerfNote').textContent = outlet.pct >= 100 ? 'Đạt và vượt cam kết hợp đồng' : 'Chưa đạt cam kết doanh số';
      
      document.getElementById('osrDocOldGrant').textContent = fmtVnd(outlet.grant);
      document.getElementById('osrDocCpc').textContent = fmtVnd(outlet.cpc);
      document.getElementById('osrDocCpcNote').textContent = outlet.cpc <= 25000 ? 'Chi phí trong ngưỡng an toàn' : 'Chi phí/thùng cao, cần tối ưu';
      
      const tierEl = document.getElementById('osrDocTier');
      tierEl.textContent = \`TIER \${outlet.tier}\`;
      tierEl.className = \`badge tier-\${outlet.tier.toLowerCase()}\`;

      // Proposal fields
      updateProposalFields(outlet);
    }

    function updateProposalFields(outlet) {
      const customTgt = parseInt(document.getElementById('osrCustomTargetInput').value, 10) || outlet.s_tgt;
      const customGrant = parseInt(document.getElementById('osrCustomGrantInput').value, 10) || outlet.s_grant;

      let recTitle = 'Duy Trì Ngân Sách Tài Trợ & Siết Chỉ Tiêu Focus AA';
      let rationale = \`Quán đạt \${outlet.pct}% sản lượng cam kết (\${outlet.vol}/\${outlet.tgt} thùng). Tỷ lệ tiêu thụ ổn định. Đề xuất duy trì gói tài trợ hiện tại (\${(customGrant/1e6).toFixed(1)} triệu) nhưng bổ sung điều khoản cam kết tối thiểu 50% dòng Focus AA (Heineken Silver / Tiger Crystal).\`;
      let pitchScript = \`Dạ em chào anh/chị chủ quán! Tháng vừa rồi sản lượng tiêu thụ của quán mình đạt \${outlet.vol} thùng (\${outlet.pct}% chỉ tiêu), rất tốt ạ. Chu kỳ này bên em xin đề xuất tiếp tục gia hạn hợp đồng tài trợ trọn gói \${(customGrant/1e6).toFixed(1)} triệu cho quán, đồng thời bên em sẽ trang bị thêm biển hộp đèn Heineken Silver mới để tăng độ nhận diện cho quán mình nhé!\`;

      if (outlet.rec === 'SCALE_UP') {
        recTitle = 'Tăng Gói Đầu Tư VIP & Mở Rộng Hợp Đồng Dài Hạn (+25%)';
        rationale = \`Quán đạt vượt mức \${outlet.pct}% chỉ tiêu (\${outlet.vol}/\${outlet.tgt} thùng). Doanh số tăng trưởng mạnh, biên lợi nhuận cao. Đề xuất nâng gói tài trợ lên \${(customGrant/1e6).toFixed(1)} triệu, trang bị full POSM VIP và ký cam kết độc quyền 12 tháng để khóa chân quán trước đối thủ.\`;
        pitchScript = \`Dạ chúc mừng anh/chị! Quán mình tháng này đạt tới \${outlet.vol} thùng, vượt chỉ tiêu và lọt vào Top quán xuất sắc nhất khu vực. Để tri ân và đồng hành dài hạn, Giám đốc vùng bên em duyệt nâng gói tài trợ của quán lên \${(customGrant/1e6).toFixed(1)} triệu kèm tài trợ toàn bộ đồng phục nhân viên và dàn ly Tiger Crystal. Em chuẩn bị sẵn hồ sơ OSR để quán mình ký gia hạn ngay tuần này ạ!\`;
      } else if (outlet.rec === 'DOWNSCALE_EXIT') {
        recTitle = 'Cắt Giảm Tài Trợ Cố Định / Chuyển Sang Chiết Khấu Thùng';
        rationale = \`Quán chỉ đạt \${outlet.pct}% cam kết (\${outlet.vol}/\${outlet.tgt} thùng). Gói tài trợ cũ (\${(outlet.grant/1e6).toFixed(1)} triệu) bị lãng phí. Đề xuất giảm tài trợ cố định về \${(customGrant/1e6).toFixed(1)} triệu, chuyển sang cơ chế thưởng Sell-out theo thùng thực tế.\`;
        pitchScript = \`Dạ anh/chị ơi, em từ đại diện Heineken/Tiger phụ trách tuyến của mình. Để hỗ trợ quán kinh doanh linh hoạt hơn chu kỳ tới, bên em có gói chương trình mới: không áp lực tiền cọc mà hỗ trợ trực tiếp chiết khấu thùng khi quán ra hàng kèm tài trợ dù bạt che nắng. Em xin phép gửi anh/chị bản đề xuất OSR để quán mình xem qua nhé!\`;
      }

      document.getElementById('osrDocRecTitle').textContent = recTitle;
      document.getElementById('osrDocRationale').textContent = rationale;
      document.getElementById('osrDocNewTarget').textContent = \`\${customTgt} thùng/tháng\`;
      document.getElementById('osrDocNewGrant').textContent = fmtVnd(customGrant);
      document.getElementById('osrDocPitchScript').textContent = \`"\${pitchScript}"\`;
    }

    // Jump from SubD Table to Outlets Table
    window.jumpToSubDOutlets = function(subdId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.querySelector('[data-tab="tabPaneOutlets"]').classList.add('active');
      document.getElementById('tabPaneOutlets').classList.add('active');

      document.getElementById('outletSearchInput').value = subdId;
      renderOutletsTable();
    };

    window.loadOutletToOSR = loadOutletToOSR;

    // Event Listeners
    // Tabs switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
      });
    });

    // SubD Filters
    document.getElementById('controlAreaFilter').addEventListener('change', renderSubDTable);
    document.getElementById('controlScdFilter').addEventListener('change', renderSubDTable);
    document.getElementById('controlSubdSearch').addEventListener('input', renderSubDTable);

    // Outlet Filters
    document.getElementById('outletAreaFilter').addEventListener('change', renderOutletsTable);
    document.getElementById('outletTierFilter').addEventListener('change', renderOutletsTable);
    document.getElementById('outletRecFilter').addEventListener('change', renderOutletsTable);
    document.getElementById('outletSearchInput').addEventListener('input', renderOutletsTable);

    // OSR Selectors & Custom Buttons
    document.getElementById('osrOutletSelector').addEventListener('change', (e) => {
      loadOutletToOSR(e.target.value);
    });

    document.getElementById('btnUpdateOSR').addEventListener('click', () => {
      const outlet = dataMart.outlets.find(o => o.code === selectedOutletCode);
      if (outlet) {
        updateProposalFields(outlet);
        showToast('Đã cập nhật biểu mẫu OSR thành công!');
      }
    });

    document.getElementById('btnPrintOSR').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btnCopyZaloOSR').addEventListener('click', () => {
      const pitchText = document.getElementById('osrDocPitchScript').textContent;
      const outletName = document.getElementById('osrDocName').textContent;
      const newTarget = document.getElementById('osrDocNewTarget').textContent;
      const newGrant = document.getElementById('osrDocNewGrant').textContent;

      const fullMsg = \`[HEINEKEN RETIE-UP 2026] ĐỀ XUẤT TÁI KÝ QUÁN: \${outletName}\\n- Chỉ tiêu cam kết mới: \${newTarget}\\n- Gói tài trợ đề xuất: \${newGrant}\\n\\nLời thoại Sales:\\n\${pitchText}\`;
      navigator.clipboard.writeText(fullMsg).then(() => {
        showToast('Đã copy tin nhắn Zalo chốt số vào bộ nhớ đệm!');
      });
    });

    document.getElementById('btnExportCsvOSR').addEventListener('click', () => {
      const outlet = dataMart.outlets.find(o => o.code === selectedOutletCode);
      if (!outlet) return;
      const csvContent = "data:text/csv;charset=utf-8,\ufeff" + 
        "Mã Quán,Tên Quán,Khu Vực,SubD,Cam Kết Cũ,Thực Đạt,Tài Trợ Cũ,Tài Trợ Mới,Khuyến Nghị\\n" +
        \`"\${outlet.code}","\${outlet.name}","\${outlet.area}","\${outlet.subd_name}",\${outlet.tgt},\${outlet.vol},\${outlet.grant},\${outlet.s_grant},"\${outlet.rec}"\`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", \`OSR_\${outlet.code}_\${outlet.name}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Đã xuất file CSV điểm bán thành công!');
    });

    // Theme Toggle
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      showToast(document.body.classList.contains('theme-light') ? 'Đã chuyển sang giao diện Sáng' : 'Đã chuyển sang giao diện Tối');
    });

    // AI Simulation Selector
    document.getElementById('aiSimOutletSelector').addEventListener('change', (e) => {
      const code = e.target.value;
      const outlet = dataMart.outlets.find(o => o.code === code);
      if (!outlet) return;

      document.getElementById('aiSimTierBadge').textContent = \`TIER \${outlet.tier}\`;
      document.getElementById('aiSimTierBadge').className = \`badge tier-\${outlet.tier.toLowerCase()}\`;
      document.getElementById('aiSimCpc').textContent = \`Cost/Case: \${fmtNum(outlet.cpc)} đ\`;

      if (outlet.rec === 'SCALE_UP') {
        document.getElementById('aiSimRecTitle').textContent = 'Tăng Gói Đầu Tư VIP & Mở Rộng Hợp Đồng Dài Hạn';
        document.getElementById('aiSimRationale').textContent = \`Quán đạt \${outlet.pct}% sản lượng, tăng trưởng xuất sắc. Đề xuất tăng tài trợ lên \${(outlet.s_grant/1e6).toFixed(1)} triệu VNĐ.\`;
      } else if (outlet.rec === 'DOWNSCALE_EXIT') {
        document.getElementById('aiSimRecTitle').textContent = 'Cắt Giảm Tài Trợ Cố Định / Chuyển Sang Chiết Khấu Thùng';
        document.getElementById('aiSimRationale').textContent = \`Quán chỉ đạt \${outlet.pct}% sản lượng cam kết. Cắt giảm tài trợ cố định về \${(outlet.s_grant/1e6).toFixed(1)} triệu để tránh chôn vốn.\`;
      } else {
        document.getElementById('aiSimRecTitle').textContent = 'Duy Trì Ngân Sách Tài Trợ & Siết Chỉ Tiêu Focus AA';
        document.getElementById('aiSimRationale').textContent = \`Quán duy trì sản lượng ổn định (\${outlet.pct}%). Giữ nguyên mức tài trợ \${(outlet.grant/1e6).toFixed(1)} triệu kèm ràng buộc SKU Focus AA.\`;
      }
    });

    document.getElementById('btnApplySimToOSR').addEventListener('click', () => {
      const simCode = document.getElementById('aiSimOutletSelector').value;
      loadOutletToOSR(simCode);
      showToast('Đã nạp số liệu điểm bán vào Form OSR!');
    });

    // Initial load
    initHeroKPIs();
    renderSubDTable();
    renderOutletsTable();
    populateOutletSelectors();
    if (selectedOutletCode) {
      loadOutletToOSR(selectedOutletCode);
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(htmlOutputPath, htmlContent, 'utf8');
const stats = fs.statSync(htmlOutputPath);
console.log('Build completed successfully!');
console.log('Output file:', htmlOutputPath);
console.log('File size:', (stats.size / 1024).toFixed(1), 'KB (Goal < 1.5MB)');
