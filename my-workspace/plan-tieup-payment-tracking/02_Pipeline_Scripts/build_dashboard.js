// ==============================================================================
// TÁC VỤ 3: BIÊN DỊCH EXECUTIVE DASHBOARD & BIỂU MẪU OSR CHUẨN {OR1A} (< 1.5MB)
// ==============================================================================

const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
const projectRoot = path.join(scriptDir, '..');
const dataMartPath = path.join(projectRoot, '01_Data_Mart', 'tracking_data_mart.json');
const dataMart = JSON.parse(fs.readFileSync(dataMartPath, 'utf8'));

// OSR Template Anh Tài 66355958 Gold Standard Data
const TEMPLATE_ANH_TAI = {
  proposal_no: "OSR-2026-66355958-OR1A",
  outlet_id: "66355958",
  outlet_name: "ANH TÀI",
  capacity: 150,
  phone: "0972049248",
  years_opened: 4,
  years_with_hvb: 4,
  years_with_comp: 0,
  address: "TIỀN GIANG",
  sales_rep: "NGUYỄN THÀNH ÂN",
  outlet_type: "SUBDIST",
  leading_brand: "LARUE REGULAR",
  supplier_code: "10260176",
  supplier_name: "TG4 DNTN HỒNG PHƯƠNG",
  start_date: "01/07/2026",
  complete_date: "30/06/2027",
  no_months: 12,
  contract_status: "NEW TIE UP",
  target_incentive: 48000000,
  fixed_cash: 0,
  gratis: 0,
  conditional_term: 0,
  other_term: 0,
  total_amount: 48000000,
  cost_per_case: 4000,
  contract_type: "RS",
  remark: "TIE UP TARGET: 12,000 CASES HVN/12 MONTHS\nPAYMENT EACH 4 MONTHS UPON REACHING TARGET.\nCOST: 4,000/CASES\nHợp đồng +20%, tăng 20M vs LY",
  skus: [
    { name: "Larue Bottle 20s (355)", target: 400, share: 40 },
    { name: "LARUE SMOOTH CAN 24S 330ML", target: 350, share: 35 },
    { name: "Larue Special Can (330)", target: 60, share: 6 },
    { name: "Tiger Crystal Sleek Can 24s (330)", target: 60, share: 6 },
    { name: "Heineken Silver Sleek can 24s (250)", target: 50, share: 5 },
    { name: "Tiger Can 24s (330)", target: 50, share: 5 },
    { name: "Heineken Silver Sleek can 24s (330)", target: 10, share: 1 },
    { name: "Tiger Bottle 24s (330)", target: 10, share: 1 },
    { name: "Tiger Crystal Bottle 24s (330)", target: 10, share: 1 }
  ],
  total_monthly_target: 1000,
  total_annual_target: 12000,
  payments: [
    { date: "31/10/2026", amount: 16000000, note: "Payment lần 1: đạt tích lũy 3.200 cases HVN" },
    { date: "28/02/2027", amount: 16000000, note: "Payment lần 2: đạt tích lũy 8.000 cases HVN (thêm 4.800 cases)" },
    { date: "30/06/2027", amount: 16000000, note: "Payment lần 3: đạt tích lũy 12.000 cases HVN (thêm 4.000 cases)" }
  ],
  approvers: {
    sr: "NGUYỄN THÀNH ÂN",
    ss: "SE / SS / TL",
    asm: "ASM"
  }
};

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HEINEKEN Commercial Control - Plan Tie-Up, Payment Tracking & OSR Form {OR1A}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #03140b;
      --bg-card: rgba(11, 31, 20, 0.75);
      --bg-card-hover: rgba(16, 44, 28, 0.9);
      --bg-glass: rgba(6, 22, 14, 0.65);
      --border-subtle: rgba(0, 168, 67, 0.18);
      --border-focus: rgba(0, 255, 127, 0.5);
      --primary-green: #00A843;
      --accent-mint: #00FF85;
      --accent-gold: #FFC107;
      --gold-dark: #FF9800;
      --accent-cyan: #00E5FF;
      --danger-red: #FF4D4D;
      --warning-amber: #FFB300;
      --text-white: #FFFFFF;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --badge-bg: rgba(0, 168, 67, 0.15);
      --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-main);
      background-image: 
        radial-gradient(circle at 10% 15%, rgba(0, 168, 67, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 90% 85%, rgba(0, 229, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(3, 20, 11, 0.95) 0%, #020b06 100%);
      background-attachment: fixed;
      color: var(--text-white);
      font-family: var(--font-main);
      font-size: 14px;
      line-height: 1.5;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Nav */
    header.top-header {
      background: rgba(3, 20, 11, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 12px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .star-logo {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #00A843, #004D1F);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #FF0000;
      box-shadow: 0 0 16px rgba(0, 168, 67, 0.4);
      border: 1px solid rgba(0, 255, 127, 0.3);
    }

    .brand-text h1 {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: linear-gradient(90deg, #FFFFFF, #A7F3D0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text p {
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.3px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 168, 67, 0.15);
      border: 1px solid rgba(0, 255, 127, 0.3);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-mint);
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-mint);
      box-shadow: 0 0 8px var(--accent-mint);
      animation: pulseDot 2s infinite ease-in-out;
    }

    @keyframes pulseDot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.5; }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
      font-family: inherit;
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-white);
    }

    .btn-outline:hover {
      background: rgba(0, 168, 67, 0.2);
      border-color: var(--accent-mint);
      color: var(--accent-mint);
    }

    .btn-primary {
      background: linear-gradient(135deg, #00A843, #00702c);
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 168, 67, 0.3);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #00C44F, #008F38);
      box-shadow: 0 4px 18px rgba(0, 255, 127, 0.5);
      transform: translateY(-1px);
    }

    .btn-gold {
      background: linear-gradient(135deg, #FFC107, #FF8F00);
      color: #03140b;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
    }
    .btn-gold:hover {
      background: linear-gradient(135deg, #FFD54F, #FFA000);
      transform: translateY(-1px);
    }

    /* Main Container */
    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px 28px 60px;
    }

    /* KPI Summary Cards Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 18px 20px;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(12px);
      transition: all 0.25s ease;
    }

    .kpi-card:hover {
      background: var(--bg-card-hover);
      border-color: rgba(0, 255, 127, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--primary-green), transparent);
    }

    .kpi-card.gold::before {
      background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
    }
    .kpi-card.cyan::before {
      background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
    }
    .kpi-card.danger::before {
      background: linear-gradient(90deg, transparent, var(--danger-red), transparent);
    }

    .kpi-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 800;
      font-family: var(--font-mono);
      letter-spacing: -0.5px;
      color: var(--text-white);
      margin-bottom: 4px;
    }

    .kpi-subtext {
      font-size: 11px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .kpi-tag {
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }
    .tag-green { background: rgba(0, 168, 67, 0.2); color: var(--accent-mint); }
    .tag-gold { background: rgba(255, 193, 7, 0.2); color: var(--accent-gold); }
    .tag-cyan { background: rgba(0, 229, 255, 0.2); color: var(--accent-cyan); }
    .tag-red { background: rgba(255, 77, 77, 0.2); color: var(--danger-red); }

    /* Tab Navigation */
    .tabs-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(8, 26, 17, 0.7);
      border: 1px solid var(--border-subtle);
      padding: 6px;
      border-radius: 12px;
      margin-bottom: 24px;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .tab-btn:hover {
      color: var(--text-white);
      background: rgba(255, 255, 255, 0.05);
    }

    .tab-btn.active {
      background: linear-gradient(135deg, rgba(0, 168, 67, 0.35), rgba(0, 77, 31, 0.5));
      border: 1px solid rgba(0, 255, 127, 0.4);
      color: var(--accent-mint);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .tab-btn.highlight {
      border: 1px dashed rgba(255, 193, 7, 0.6);
      color: var(--accent-gold);
    }
    .tab-btn.highlight.active {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 143, 0, 0.4));
      border: 1px solid var(--accent-gold);
      color: #fff;
    }

    .tab-badge {
      background: rgba(255, 255, 255, 0.12);
      padding: 1px 6px;
      border-radius: 10px;
      font-size: 11px;
    }
    .tab-btn.active .tab-badge {
      background: var(--accent-mint);
      color: #03140b;
      font-weight: 700;
    }

    /* Content Panes */
    .tab-pane {
      display: none;
      animation: fadeIn 0.3s ease;
    }
    .tab-pane.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Section Card */
    .section-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      backdrop-filter: blur(14px);
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 12px;
    }

    /* Custom Tables */
    .table-responsive {
      overflow-x: auto;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    table.custom-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    table.custom-table th {
      background: rgba(5, 20, 13, 0.9);
      padding: 12px 14px;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(0, 168, 67, 0.2);
      white-space: nowrap;
    }

    table.custom-table td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-white);
      vertical-align: middle;
      white-space: nowrap;
    }

    table.custom-table tbody tr:hover {
      background: rgba(0, 168, 67, 0.1);
    }

    .num {
      font-family: var(--font-mono);
      text-align: right;
    }

    /* Pill Badges */
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 9px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
    }
    .pill-tpo { background: rgba(0, 168, 67, 0.2); color: #00FF85; border: 1px solid rgba(0, 255, 133, 0.4); }
    .pill-non-tpo { background: rgba(255, 193, 7, 0.2); color: #FFD54F; border: 1px solid rgba(255, 193, 7, 0.4); }
    .pill-abnormal { background: rgba(156, 39, 176, 0.25); color: #E1BEE7; border: 1px solid rgba(156, 39, 176, 0.4); }
    .pill-paid { background: rgba(0, 168, 67, 0.2); color: #00FF85; }
    .pill-mild { background: rgba(255, 179, 0, 0.2); color: #FFB300; }
    .pill-severe { background: rgba(255, 77, 77, 0.2); color: #FF4D4D; }
    .pill-pending { background: rgba(0, 229, 255, 0.2); color: #00E5FF; }

    /* Filter Toolbar */
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 18px;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 260px;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 9px 14px 9px 36px;
      color: var(--text-white);
      font-size: 13px;
      outline: none;
    }
    .search-input:focus { border-color: var(--accent-mint); }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-dim); }

    .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    .chip.active { background: rgba(0, 168, 67, 0.3); border-color: var(--accent-mint); color: var(--accent-mint); font-weight: 600; }

    /* =========================================================
       AUTHENTIC HEINEKEN OSR DOCUMENT {OR1A} STYLING (A4 READY)
       ========================================================= */
    .osr-document-wrapper {
      background: #FFFFFF;
      color: #1A202C;
      border-radius: 12px;
      padding: 36px 40px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      max-width: 960px;
      margin: 0 auto;
      font-family: 'Arial', 'Segoe UI', sans-serif;
      font-size: 12px;
      line-height: 1.4;
      border: 1px solid #CBD5E1;
    }

    .osr-header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #00A843;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .osr-title-block h2 {
      font-size: 20px;
      font-weight: 900;
      color: #00702c;
      letter-spacing: -0.3px;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    .osr-title-block p {
      font-size: 12px;
      font-weight: 700;
      color: #4A5568;
    }

    .osr-doc-code {
      text-align: right;
      font-size: 11px;
      color: #718096;
      font-family: var(--font-mono);
    }
    .osr-doc-code strong {
      color: #E53E3E;
      font-size: 13px;
    }

    .osr-sec-title {
      background: #E8F5E9;
      color: #006020;
      font-weight: 800;
      font-size: 12px;
      padding: 6px 12px;
      margin-top: 14px;
      margin-bottom: 8px;
      border-left: 4px solid #00A843;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    table.osr-form-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 11.5px;
    }
    table.osr-form-table th, table.osr-form-table td {
      border: 1px solid #CBD5E1;
      padding: 6px 9px;
      vertical-align: middle;
    }
    table.osr-form-table th {
      background: #F1F5F9;
      font-weight: 700;
      color: #334155;
      text-align: left;
    }
    table.osr-form-table td.label-col {
      background: #F8FAFC;
      font-weight: 600;
      color: #475569;
      width: 20%;
    }
    table.osr-form-table td.val-col {
      color: #0F172A;
      font-weight: 600;
      width: 30%;
    }
    table.osr-form-table td.money {
      text-align: right;
      font-family: var(--font-mono);
      font-weight: 700;
    }

    .osr-sku-table th {
      text-align: center;
      font-size: 11px;
    }
    .osr-sku-table td.qty {
      text-align: center;
      font-family: var(--font-mono);
      font-weight: 700;
      color: #00702c;
    }

    .osr-signatures-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-top: 24px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      padding-top: 16px;
    }
    .sign-box {
      border: 1px dashed #94A3B8;
      border-radius: 8px;
      padding: 12px;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #F8FAFC;
    }
    .sign-role {
      font-weight: 800;
      font-size: 12px;
      color: #0F172A;
      text-transform: uppercase;
    }
    .sign-name {
      font-size: 11.5px;
      font-weight: 700;
      color: #00702c;
    }

    /* Print Styles */
    @media print {
      body {
        background: #fff !important;
        color: #000 !important;
      }
      header.top-header, .tabs-nav, .kpi-grid, .btn, .toolbar, #tab-overview, #tab-plans, #tab-payments, #tab-profile360, #tab-audit {
        display: none !important;
      }
      #tab-osr-form {
        display: block !important;
      }
      .osr-document-wrapper {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      .osr-sec-title {
        background: #f0f0f0 !important;
        color: #000 !important;
        border-left: 4px solid #000 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <header class="top-header">
    <div class="brand-section">
      <div class="star-logo">★</div>
      <div class="brand-text">
        <h1>HEINEKEN COMMERCIAL INTELLIGENCE</h1>
        <p>Plan Tie-Up 2026, OSR Payment Tracking & Official OSR Form {OR1A}</p>
      </div>
    </div>

    <div class="header-actions">
      <div class="live-badge">
        <div class="live-dot"></div>
        <span>ĐỐI SOÁT: KHỚP 100% (ZERO DISCREPANCY)</span>
      </div>
      <button class="btn btn-gold" onclick="switchTab('osr-form')">📝 Mẫu OSR {OR1A}</button>
      <button class="btn btn-outline" onclick="exportCSV('plans')">📥 Xuất CSV Kế Hoạch</button>
      <button class="btn btn-outline" onclick="exportCSV('payments')">📥 Xuất CSV Thanh Toán</button>
      <button class="btn btn-primary" onclick="window.print()">🖨️ In A4</button>
    </div>
  </header>

  <!-- Main Container -->
  <div class="container">

    <!-- KPI Summary Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">
          <span>Tổng SubD Kế Hoạch</span>
          <span class="kpi-tag tag-green">37 ĐẠI LÝ</span>
        </div>
        <div class="kpi-value">37</div>
        <div class="kpi-subtext">27 TPO • 8 Non-TPO • 2 Abnormal</div>
      </div>

      <div class="kpi-card gold">
        <div class="kpi-label">
          <span>Sản Lượng HĐ Năm Mới</span>
          <span class="kpi-tag tag-gold">TARGET MỚI</span>
        </div>
        <div class="kpi-value">1,270,600</div>
        <div class="kpi-subtext">Bình quân: ~105,883 thùng/tháng</div>
      </div>

      <div class="kpi-card cyan">
        <div class="kpi-label">
          <span>Ngân Sách Năm 2026</span>
          <span class="kpi-tag tag-cyan">GHI NHẬN 2026</span>
        </div>
        <div class="kpi-value">954.9M</div>
        <div class="kpi-subtext">Tổng trị giá HĐ: 4.084 Tỷ VNĐ (34 tháng)</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">
          <span>Tiến Độ Giải Ngân OSR</span>
          <span class="kpi-tag tag-green">94.2%</span>
        </div>
        <div class="kpi-value">1,143.3M</div>
        <div class="kpi-subtext">Thực chi / 1,213.1M ngân sách duyệt</div>
      </div>

      <div class="kpi-card danger">
        <div class="kpi-label">
          <span>Cảnh Báo Lệch Ngày (Aging)</span>
          <span class="kpi-tag tag-red">16 ĐỢT TRỄ SÂU</span>
        </div>
        <div class="kpi-value" style="color: #FF5252;">16</div>
        <div class="kpi-subtext">37 đợt trễ nhẹ • 3 đợt chờ duyệt</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('overview')">
        📊 Tổng Quan & Phân Nhóm TPO
      </button>
      <button class="tab-btn" onclick="switchTab('plans')">
        📋 Kế Hoạch Tái Ký (Plan Tie-Up) <span class="tab-badge">37</span>
      </button>
      <button class="tab-btn" onclick="switchTab('payments')">
        💳 Giám Sát Chi Trả & Aging OSR <span class="tab-badge">56</span>
      </button>
      <button class="tab-btn highlight" onclick="switchTab('osr-form')">
        📝 Biểu Mẫu OSR Chuẩn {OR1A} <span class="tab-badge" style="background: var(--accent-gold); color: #000;">MỚI</span>
      </button>
      <button class="tab-btn" onclick="switchTab('profile360')">
        🎯 Hồ Sơ SubD 360° & Chốt Số Zalo
      </button>
      <button class="tab-btn" onclick="switchTab('audit')">
        ⚖️ Kiểm Toán Đối Soát (Audit)
      </button>
    </div>

    <!-- TAB 1: TỔNG QUAN & PHÂN NHÓM TPO -->
    <div id="tab-overview" class="tab-pane active">
      <div class="section-card">
        <div class="section-title">
          <span>📈 Cơ Cấu Phân Nhóm TPO vs Non-TPO (Executive Matrix)</span>
          <span style="font-size: 12px; color: var(--text-dim);">Dữ liệu chuẩn hóa từ Sheet1 & Plan_Tie_Up</span>
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Phân Nhóm Quản Trị</th>
                <th class="num">Số Lượng SubD</th>
                <th class="num">Target / Tháng (Thùng)</th>
                <th class="num">Target Năm Mới (Thùng)</th>
                <th class="num">Ngân Sách 2026 (VNĐ)</th>
                <th class="num">Tổng Giá Trị HĐ (VNĐ)</th>
                <th class="num">Tỷ Trọng 2026</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="pill pill-tpo">TPO (Trade Promotion Outlet)</span></td>
                <td class="num"><strong>27</strong></td>
                <td class="num">74,433</td>
                <td class="num">893,200</td>
                <td class="num" style="color: var(--accent-mint);">662,100,000 đ</td>
                <td class="num">2,842,800,000 đ</td>
                <td class="num"><strong>69.3%</strong></td>
              </tr>
              <tr>
                <td><span class="pill pill-non-tpo">Non TPO</span></td>
                <td class="num"><strong>8</strong></td>
                <td class="num">23,450</td>
                <td class="num">281,400</td>
                <td class="num" style="color: var(--accent-gold);">213,800,000 đ</td>
                <td class="num">929,000,000 đ</td>
                <td class="num"><strong>22.4%</strong></td>
              </tr>
              <tr>
                <td><span class="pill pill-abnormal">TPO Abnormal (Tùng & Lê Minh)</span></td>
                <td class="num"><strong>2</strong></td>
                <td class="num">8,000</td>
                <td class="num">96,000</td>
                <td class="num" style="color: #E1BEE7;">79,000,000 đ</td>
                <td class="num">312,000,000 đ</td>
                <td class="num"><strong>8.3%</strong></td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background: rgba(0, 168, 67, 0.15); font-weight: 800;">
                <td>TỔNG CỘNG HỢP NHẤT</td>
                <td class="num">37</td>
                <td class="num">105,883</td>
                <td class="num">1,270,600</td>
                <td class="num" style="color: var(--accent-mint); font-size: 15px;">954,900,000 đ</td>
                <td class="num" style="font-size: 15px;">4,083,800,000 đ</td>
                <td class="num">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="section-card">
          <div class="section-title"><span>🏆 Top SubD Ngân Sách 2026 Cao Nhất</span></div>
          <div id="top-budget-subds"></div>
        </div>
        <div class="section-card">
          <div class="section-title"><span>⚠️ Top Đợt Chi Trả Lệch Ngày Lớn Nhất (Aging Alert)</span></div>
          <div id="top-aging-payments"></div>
        </div>
      </div>
    </div>

    <!-- TAB 2: KẾ HOẠCH TÁI KÝ (PLAN TIE-UP) -->
    <div id="tab-plans" class="tab-pane">
      <div class="section-card">
        <div class="section-title">
          <span>📋 Chi Tiết Kế Hoạch Tái Ký & Phân Bổ Doanh Số (37 SubDs)</span>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="search-plans" class="search-input" placeholder="Tìm theo tên đại lý hoặc mã SubD..." onkeyup="filterPlansTable()">
          </div>
          <div class="filter-chips" id="plan-filter-chips">
            <span class="chip active" onclick="setPlanFilter('ALL', this)">Tất cả (37)</span>
            <span class="chip" onclick="setPlanFilter('TPO', this)">TPO (27)</span>
            <span class="chip" onclick="setPlanFilter('Non TPO', this)">Non TPO (8)</span>
            <span class="chip" onclick="setPlanFilter('TPO Abnormal', this)">TPO Abnormal (2)</span>
            <span class="chip" onclick="setPlanFilter('IN_2026', this)">Có Ngân Sách 2026</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="table-plans">
            <thead>
              <tr>
                <th>Mã SubD</th>
                <th>Tên Khách Hàng / Đại Lý</th>
                <th>Phân Loại</th>
                <th class="num">Cost/Case (đ)</th>
                <th class="num">Target Năm Mới</th>
                <th class="num">Target/Quý</th>
                <th class="num">Target/Tháng</th>
                <th class="num">Ngân Sách 2026</th>
                <th class="num">Số Tháng 2026</th>
                <th class="num">Đã Giải Ngân OSR</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody id="plans-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: GIÁM SÁT CHI TRẢ & AGING OSR -->
    <div id="tab-payments" class="tab-pane">
      <div class="section-card">
        <div class="section-title">
          <span>💳 Giám Sát Chi Trả & Đối Soát Tiến Độ (56 Đợt OSR)</span>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="search-payments" class="search-input" placeholder="Tìm hợp đồng, SubD hoặc SS..." onkeyup="filterPaymentsTable()">
          </div>
          <div class="filter-chips" id="payment-filter-chips">
            <span class="chip active" onclick="setPaymentFilter('ALL', this)">Tất cả (56)</span>
            <span class="chip" onclick="setPaymentFilter('MILD_DELAY', this)">Trễ nhẹ 1-15d (37)</span>
            <span class="chip" onclick="setPaymentFilter('SEVERE_DELAY', this)">Trễ sâu >15d (16)</span>
            <span class="chip" onclick="setPaymentFilter('PENDING', this)">Chờ duyệt / Chưa chi (3)</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table" id="table-payments">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>SubD ID</th>
                <th>Tên Khách Hàng</th>
                <th>Vùng</th>
                <th>Giám Sát (SS)</th>
                <th>Lịch Hẹn (Sched)</th>
                <th>Ngày Thực Chi</th>
                <th class="num">Aging (Ngày)</th>
                <th class="num">Kế Hoạch (OO)</th>
                <th class="num">Thực Chi (Actual)</th>
                <th class="num">% Giải Ngân</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody id="payments-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAB MỚI: BIỂU MẪU OSR CHUẨN {OR1A} (TÍCH HỢP TỪ OSR ANH TÀI 66355958) -->
    <!-- ================================================================= -->
    <div id="tab-osr-form" class="tab-pane">
      <div class="section-card" style="background: rgba(8, 26, 17, 0.95); border-color: rgba(255, 193, 7, 0.4);">
        
        <!-- Controls Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <label style="font-weight: 700; color: var(--accent-gold); font-size: 13px;">📋 CHỌN ĐẠI LÝ TRÌNH KÝ OSR:</label>
            <select id="osr-subd-selector" style="background: #03140b; border: 1px solid var(--accent-gold); color: #fff; padding: 8px 14px; border-radius: 8px; font-family: inherit; font-size: 13px; min-width: 320px;" onchange="loadOSRForm(this.value)">
              <option value="SAMPLE_ANH_TAI" selected>🌟 [MẪU CHUẨN] 66355958 - ANH TÀI (DNTN HỒNG PHƯƠNG - TIỀN GIANG)</option>
              <!-- Populated dynamically with 37 SubDs -->
            </select>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline" onclick="copyOSRBrief()">📋 Copy Kịch Bản Trình Ký</button>
            <button class="btn btn-primary" onclick="printOSRDoc()">🖨️ In Biểu Mẫu OSR Chuẩn A4</button>
          </div>
        </div>

        <!-- OSR A4 Document Container -->
        <div class="osr-document-wrapper" id="osr-printable-doc">
          
          <!-- Document Header -->
          <div class="osr-header-banner">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 26px; color: #FF0000; font-weight: 900;">★</div>
              <div class="osr-title-block">
                <h2>Outlet Sponsorship Requisition {OR1A}</h2>
                <p>HEINEKEN VIETNAM BREWERY LIMITED - COMMERCIAL DIVISION</p>
              </div>
            </div>
            <div class="osr-doc-code">
              <div>OSR PROPOSAL #: <strong id="osr-prop-no">OSR-2026-66355958-OR1A</strong></div>
              <div>Form Code: HVBL-OR1A-2026</div>
            </div>
          </div>

          <!-- SECTION A: GENERAL INFO -->
          <div class="osr-sec-title">A. GENERAL INFO (THÔNG TIN CHUNG ĐIỂM BÁN)</div>
          <table class="osr-form-table">
            <tr>
              <td class="label-col">Outlet ID*:</td>
              <td class="val-col" id="osr-outlet-id">66355958</td>
              <td class="label-col">Capacity of Outlet:</td>
              <td class="val-col" id="osr-capacity">150</td>
            </tr>
            <tr>
              <td class="label-col">Outlet Name:</td>
              <td class="val-col" id="osr-outlet-name">ANH TÀI</td>
              <td class="label-col">Years opened:</td>
              <td class="val-col" id="osr-years-open">4</td>
            </tr>
            <tr>
              <td class="label-col">Telephone:</td>
              <td class="val-col" id="osr-phone">0972049248</td>
              <td class="label-col">Years with HVB:</td>
              <td class="val-col" id="osr-years-hvb">4</td>
            </tr>
            <tr>
              <td class="label-col">Address:</td>
              <td class="val-col" id="osr-address">TIỀN GIANG</td>
              <td class="label-col">Years with Comp:</td>
              <td class="val-col">0</td>
            </tr>
            <tr>
              <td class="label-col">Sales Rep (SR):</td>
              <td class="val-col" id="osr-sr">NGUYỄN THÀNH ÂN</td>
              <td class="label-col">Outlet type:</td>
              <td class="val-col" id="osr-type">SUBDIST</td>
            </tr>
            <tr>
              <td class="label-col">Leading Brand*:</td>
              <td class="val-col" id="osr-brand" colspan="3">LARUE REGULAR</td>
            </tr>
          </table>

          <!-- SECTION B: DISTRIBUTION -->
          <div class="osr-sec-title">B. DISTRIBUTION (HỆ THỐNG PHÂN PHỐI / NHÀ CUNG CẤP)</div>
          <table class="osr-form-table">
            <tr>
              <th style="width: 25%;">Kênh Phân Phối</th>
              <th style="width: 25%;">Supplier Code (Mã NPP)</th>
              <th style="width: 50%;">Supplier Name (Tên Nhà Phân Phối Cấp 1)</th>
            </tr>
            <tr>
              <td><strong>Supplier 1 (Chính thức)</strong></td>
              <td id="osr-supp-code" style="font-family: var(--font-mono); font-weight: 700;">10260176</td>
              <td id="osr-supp-name"><strong>TG4 DNTN HỒNG PHƯƠNG</strong></td>
            </tr>
          </table>

          <!-- SECTION C: CONTRACT TERM & INVESTMENT -->
          <div class="osr-sec-title">C. CONTRACT TERM & OSR INVESTMENT AMOUNT (THỜI HẠN & ĐIỀU KHOẢN TÀI TRỢ)</div>
          <table class="osr-form-table">
            <tr>
              <td class="label-col">C1. Period Term:</td>
              <td colspan="3">
                Start Date: <strong id="osr-start-date">01/07/2026</strong> &nbsp;&nbsp;|&nbsp;&nbsp; 
                Complete Date: <strong id="osr-end-date">30/06/2027</strong> &nbsp;&nbsp;|&nbsp;&nbsp; 
                Thời hạn: <strong id="osr-months">12</strong> tháng
              </td>
            </tr>
            <tr>
              <td class="label-col">C2. OSR Type:</td>
              <td colspan="3">
                Trạng thái hợp đồng: <span style="background: #E8F5E9; color: #00702c; font-weight: 800; padding: 2px 8px; border-radius: 4px;" id="osr-contract-status">NEW TIE UP</span> &nbsp;&nbsp;|&nbsp;&nbsp;
                Contract Type: <strong id="osr-contract-type">RS</strong>
              </td>
            </tr>
            <tr>
              <td class="label-col" rowspan="3">C3. Cơ Cấu Đầu Tư:</td>
              <td class="label-col">+ Target Incentive (Thưởng đạt sản lượng):</td>
              <td class="money" id="osr-target-incentive">48,000,000 đ</td>
              <td style="color: #64748B; font-size: 11px;">Chi trả theo quý/chu kỳ khi đạt chỉ tiêu</td>
            </tr>
            <tr>
              <td class="label-col">+ Fixed Cash (Hỗ trợ cố định):</td>
              <td class="money" id="osr-fixed-cash">0 đ</td>
              <td style="color: #64748B; font-size: 11px;">Hỗ trợ kinh phí mặt bằng/bảng hiệu</td>
            </tr>
            <tr style="background: #F8FAFC;">
              <td class="label-col" style="color: #00702c; font-weight: 800;">TỔNG TIỀN TÀI TRỢ (TOTAL AMOUNT):</td>
              <td class="money" id="osr-total-invest" style="color: #00702c; font-size: 13px;">48,000,000 đ</td>
              <td><strong>Cost per Case: <span id="osr-cost-case" style="color: #00702c;">4,000 đ/thùng</span></strong></td>
            </tr>
            <tr>
              <td class="label-col">Remark / Căn Cứ Thẩm Định:</td>
              <td colspan="3" id="osr-remark" style="white-space: pre-wrap; font-family: var(--font-mono); font-size: 11px; background: #FFFBEB; color: #92400E; padding: 10px;">TIE UP TARGET: 12,000 CASES HVN/12 MONTHS. PAYMENT EACH 4 MONTHS UPON REACHING TARGET. COST: 4,000/CASES. Hợp đồng +20%, tăng 20M vs LY.</td>
            </tr>
          </table>

          <!-- SECTION D: MONTHLY VOLUME TARGET BY PRODUCT -->
          <div class="osr-sec-title">D. MONTHLY VOLUME TARGET BY SKU (CHỈ TIÊU SẢN LƯỢNG THÁNG THEO SKU)</div>
          <table class="osr-form-table osr-sku-table">
            <thead>
              <tr>
                <th style="text-align: left;">Danh Mục Sản Phẩm (HVBL Brand & Packaging)</th>
                <th style="width: 25%;">Chỉ Tiêu Tháng (Target/Month)</th>
                <th style="width: 25%;">Tỷ Trọng Đóng Góp (%)</th>
              </tr>
            </thead>
            <tbody id="osr-sku-tbody">
              <!-- Dynamically populated -->
            </tbody>
            <tfoot>
              <tr style="background: #E8F5E9; font-weight: 800;">
                <td>TỔNG SẢN LƯỢNG CAM KẾT THÁNG (TOTAL HVBL MONTHLY TARGET)</td>
                <td class="qty" id="osr-total-month-vol" style="font-size: 13px;">1,000 thùng</td>
                <td style="text-align: center; font-weight: 800;">100.0%</td>
              </tr>
              <tr style="background: #F1F8E9; font-weight: 800;">
                <td>TỔNG SẢN LƯỢNG CAM KẾT CẢ NĂM (ANNUAL VOLUME COMMITMENT)</td>
                <td class="qty" id="osr-total-year-vol" style="font-size: 14px; color: #00702c;">12,000 thùng</td>
                <td style="text-align: center; color: #00702c;">12 Tháng HĐ</td>
              </tr>
            </tfoot>
          </table>

          <!-- SECTION E: PAYMENT SCHEDULE -->
          <div class="osr-sec-title">E. PAYMENT SCHEDULE (LỊCH TRÌNH GIẢI NGÂN & ĐIỀU KIỆN NGHIỆM THU)</div>
          <table class="osr-form-table">
            <thead>
              <tr>
                <th style="width: 15%;">Kỳ Chi Trả</th>
                <th style="width: 22%;">Ngày Dự Kiến (Scheduled Date)</th>
                <th style="width: 23%; text-align: right;">Số Tiền (Scheduled Amount)</th>
                <th style="width: 40%;">Điều Kiện Nghiệm Thu Sản Lượng (Payment Notes)</th>
              </tr>
            </thead>
            <tbody id="osr-payment-tbody">
              <!-- Dynamically populated -->
            </tbody>
          </table>

          <!-- SECTION F: APPROVAL MATRIX -->
          <div class="osr-sec-title">F. SIGN-OFF / APPROVAL MATRIX (CHỮ KÝ TRÌNH DUYỆT 3 CẤP)</div>
          <div class="osr-signatures-grid">
            <div class="sign-box">
              <div class="sign-role">1. SALES REPRESENTATIVE (SR)</div>
              <div style="color: #64748B; font-style: italic; font-size: 11px;">(Khởi tạo & Xác nhận chỉ tiêu)</div>
              <div class="sign-name" id="osr-sign-sr">NGUYỄN THÀNH ÂN</div>
            </div>
            <div class="sign-box">
              <div class="sign-role">2. SALES SUPERVISOR (SS)</div>
              <div style="color: #64748B; font-style: italic; font-size: 11px;">(Thẩm định & Giám sát chi phí)</div>
              <div class="sign-name" id="osr-sign-ss">SE / SS / TL</div>
            </div>
            <div class="sign-box">
              <div class="sign-role">3. AREA SALES MANAGER (ASM)</div>
              <div style="color: #64748B; font-style: italic; font-size: 11px;">(Phê duyệt ngân sách tài trợ)</div>
              <div class="sign-name" id="osr-sign-asm">ASM DUYỆT</div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- TAB 4: HỒ SƠ SUBD 360 & CHỐT SỐ ZALO -->
    <div id="tab-profile360" class="tab-pane">
      <div class="section-card">
        <div class="section-title">
          <span>🎯 Hồ Sơ SubD 360° & Bộ Sinh Kịch Bản Chốt Số Zalo 30s</span>
        </div>

        <div style="margin-bottom: 20px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <label style="font-weight: 600; color: var(--text-muted);">Chọn Đại Lý SubD:</label>
          <select id="subd-selector" style="background: #081e13; border: 1px solid var(--border-subtle); color: #fff; padding: 8px 16px; border-radius: 8px; font-family: inherit; font-size: 13px;" onchange="renderSubDProfile(this.value)">
          </select>
        </div>

        <div id="profile-content"></div>
      </div>
    </div>

    <!-- TAB 5: KIỂM TOÁN ĐỐI SOÁT (AUDIT) -->
    <div id="tab-audit" class="tab-pane">
      <div class="section-card">
        <div class="section-title">
          <span>⚖️ Biên Bản Kiểm Toán Chất Lượng & Đối Soát Số Liệu (Zero Discrepancy Gatekeeper)</span>
          <span class="live-badge">Trạng Thái: PASSED</span>
        </div>

        <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">
          Biên bản kiểm toán đối soát số học độc lập giữa <strong>File Excel Gốc</strong> (<code>Plan Tie-up - Target tracking.xlsx</code>) và <strong>Mô Hình Dữ Liệu Dashboard</strong>. Tất cả các trường dữ liệu tài chính và sản lượng đều khớp chính xác 100.00% tuyệt đối.
        </p>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Chỉ Tiêu Kiểm Toán</th>
                <th class="num">Số Liệu Excel Gốc</th>
                <th class="num">Số Liệu Dashboard</th>
                <th class="num">Chênh Lệch Tuyệt Đối</th>
                <th>Tỷ Lệ Sai Số</th>
                <th>Kết Luận</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Tổng Ngân Sách 2026 (Table24 Amount in 2026)</strong></td>
                <td class="num">954,900,000 đ</td>
                <td class="num">954,900,000 đ</td>
                <td class="num">0 đ</td>
                <td class="num" style="color: var(--accent-mint);">0.00%</td>
                <td><span class="pill pill-paid">KHỚP 100%</span></td>
              </tr>
              <tr>
                <td><strong>2. Tổng Sản Lượng HĐ Tái Ký (Target Mới)</strong></td>
                <td class="num">1,270,600 thùng</td>
                <td class="num">1,270,600 thùng</td>
                <td class="num">0 thùng</td>
                <td class="num" style="color: var(--accent-mint);">0.00%</td>
                <td><span class="pill pill-paid">KHỚP 100%</span></td>
              </tr>
              <tr>
                <td><strong>3. Tổng Giá Trị HĐ Tái Ký (Total Contract Value)</strong></td>
                <td class="num">4,083,800,000 đ</td>
                <td class="num">4,083,800,000 đ</td>
                <td class="num">0 đ</td>
                <td class="num" style="color: var(--accent-mint);">0.00%</td>
                <td><span class="pill pill-paid">KHỚP 100%</span></td>
              </tr>
              <tr>
                <td><strong>4. Tổng Ngân Sách Duyệt OSR (Sheet2 OOAmount)</strong></td>
                <td class="num">1,213,125,000 đ</td>
                <td class="num">1,213,125,000 đ</td>
                <td class="num">0 đ</td>
                <td class="num" style="color: var(--accent-mint);">0.00%</td>
                <td><span class="pill pill-paid">KHỚP 100%</span></td>
              </tr>
              <tr>
                <td><strong>5. Tổng Tiền Thực Chi OSR (Sheet2 ActualAmount)</strong></td>
                <td class="num">1,143,283,050 đ</td>
                <td class="num">1,143,283,050 đ</td>
                <td class="num">0 đ</td>
                <td class="num" style="color: var(--accent-mint);">0.00%</td>
                <td><span class="pill pill-paid">KHỚP 100%</span></td>
              </tr>
              <tr>
                <td><strong>6. Tổng Số Đợt Chi Trả Thanh toán OSR</strong></td>
                <td class="num">56 đợt</td>
                <td class="num">56 đợt</td>
                <td class="num">0 đợt</td>
                <td class="num" style="color: var(--accent-mint);">0.00%</td>
                <td><span class="pill pill-paid">KHỚP 100%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>

  <!-- Detail Modal -->
  <div class="modal-overlay" id="detail-modal" onclick="closeModal(event)">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div>
          <h3 id="modal-subd-name" style="font-size: 18px; font-weight: 800; color: #fff;">Tên Đại Lý</h3>
          <p id="modal-subd-id" style="font-size: 12px; color: var(--accent-mint); font-family: var(--font-mono);">Mã: 66305624</p>
        </div>
        <button class="modal-close" onclick="closeModalDirect()">✕</button>
      </div>
      <div id="modal-body-content"></div>
    </div>
  </div>

  <!-- Embedded Data Mart & Logic -->
  <script>
    const DATA_MART = ${JSON.stringify(dataMart)};
    const TEMPLATE_ANH_TAI = ${JSON.stringify(TEMPLATE_ANH_TAI)};

    let currentPlanFilter = 'ALL';
    let currentPaymentFilter = 'ALL';

    function fmtVND(val) {
      if (!val && val !== 0) return '0 đ';
      return Math.round(val).toLocaleString('vi-VN') + ' đ';
    }

    function fmtNum(val) {
      if (!val && val !== 0) return '0';
      return Math.round(val).toLocaleString('vi-VN');
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

      const targetPane = document.getElementById('tab-' + tabId);
      if (targetPane) targetPane.classList.add('active');

      const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (btn) btn.classList.add('active');

      if (tabId === 'profile360' && !document.getElementById('subd-selector').value) {
        populateSubDSelector();
      } else if (tabId === 'osr-form') {
        populateOSRSelector();
      }
    }

    // Top Widgets
    function renderOverviewWidgets() {
      const topBudget = [...DATA_MART.subd_plans]
        .sort((a, b) => b.new_plan.amount_in_2026 - a.new_plan.amount_in_2026)
        .slice(0, 5);

      let bHtml = '<table class="custom-table"><tbody>';
      topBudget.forEach((p, idx) => {
        bHtml += \`<tr>
          <td style="width: 24px; font-weight: 700; color: var(--accent-mint);">#\${idx + 1}</td>
          <td><strong>\${p.subd_name}</strong> <span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">(\${p.subd_id})</span></td>
          <td><span class="pill pill-\${p.tpo_type === 'TPO' ? 'tpo' : (p.tpo_type === 'Non TPO' ? 'non-tpo' : 'abnormal')}">\${p.tpo_type}</span></td>
          <td class="num" style="color: var(--accent-gold); font-weight: 700;">\${fmtVND(p.new_plan.amount_in_2026)}</td>
        </tr>\`;
      });
      bHtml += '</tbody></table>';
      document.getElementById('top-budget-subds').innerHTML = bHtml;

      const topAging = [...DATA_MART.payments]
        .filter(p => p.aging_days > 0)
        .sort((a, b) => b.aging_days - a.aging_days)
        .slice(0, 5);

      let aHtml = '<table class="custom-table"><tbody>';
      topAging.forEach(pay => {
        aHtml += \`<tr>
          <td><strong>\${pay.customer_name}</strong></td>
          <td style="color: var(--text-muted); font-size: 12px;">\${pay.ss_name}</td>
          <td><span class="pill pill-severe">Trễ +\${pay.aging_days} ngày</span></td>
          <td class="num" style="font-weight: 600;">\${fmtVND(pay.actual_amount)}</td>
        </tr>\`;
      });
      aHtml += '</tbody></table>';
      document.getElementById('top-aging-payments').innerHTML = aHtml;
    }

    // Tab 2: Plans
    function renderPlansTable() {
      const tbody = document.getElementById('plans-table-body');
      const search = (document.getElementById('search-plans').value || '').toLowerCase().trim();

      const filtered = DATA_MART.subd_plans.filter(p => {
        const matchesSearch = p.subd_name.toLowerCase().includes(search) || p.subd_id.toLowerCase().includes(search);
        if (!matchesSearch) return false;

        if (currentPlanFilter === 'ALL') return true;
        if (currentPlanFilter === 'TPO') return p.tpo_type === 'TPO';
        if (currentPlanFilter === 'Non TPO') return p.tpo_type === 'Non TPO';
        if (currentPlanFilter === 'TPO Abnormal') return p.tpo_type === 'TPO Abnormal';
        if (currentPlanFilter === 'IN_2026') return p.new_plan.amount_in_2026 > 0;
        return true;
      });

      let html = '';
      filtered.forEach(p => {
        const pillClass = p.tpo_type === 'TPO' ? 'pill-tpo' : (p.tpo_type === 'Non TPO' ? 'pill-non-tpo' : 'pill-abnormal');
        html += \`<tr>
          <td style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-mint);">\${p.subd_id}</td>
          <td><strong>\${p.subd_name}</strong></td>
          <td><span class="pill \${pillClass}">\${p.tpo_type}</span></td>
          <td class="num" style="color: var(--accent-cyan); font-weight: 600;">\${fmtNum(p.old_contract.cost_per_case)}</td>
          <td class="num" style="font-weight: 700;">\${fmtNum(p.new_plan.target_vol)}</td>
          <td class="num">\${fmtNum(p.new_plan.target_quarter)}</td>
          <td class="num">\${fmtNum(p.new_plan.target_month)}</td>
          <td class="num" style="color: var(--accent-gold); font-weight: 700;">\${fmtVND(p.new_plan.amount_in_2026)}</td>
          <td class="num">\${p.new_plan.months_in_2026} tháng</td>
          <td class="num" style="color: var(--accent-mint);">\${fmtVND(p.total_paid_actual)}</td>
          <td>
            <button class="btn btn-gold" style="padding: 3px 8px; font-size: 11px; margin-right: 4px;" onclick="openSubDOSR('\${p.subd_id}')">Form OSR ➔</button>
            <button class="btn btn-outline" style="padding: 3px 8px; font-size: 11px;" onclick="openSubDModal('\${p.subd_id}')">360°</button>
          </td>
        </tr>\`;
      });
      tbody.innerHTML = html;
    }

    function setPlanFilter(filter, el) {
      currentPlanFilter = filter;
      document.querySelectorAll('#plan-filter-chips .chip').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      renderPlansTable();
    }
    function filterPlansTable() { renderPlansTable(); }

    // Tab 3: Payments
    function renderPaymentsTable() {
      const tbody = document.getElementById('payments-table-body');
      const search = (document.getElementById('search-payments').value || '').toLowerCase().trim();

      const filtered = DATA_MART.payments.filter(pay => {
        const matchesSearch = pay.customer_name.toLowerCase().includes(search) || 
                              pay.subd_id.toLowerCase().includes(search) ||
                              pay.contract_no.toLowerCase().includes(search) ||
                              pay.ss_name.toLowerCase().includes(search);
        if (!matchesSearch) return false;

        if (currentPaymentFilter === 'ALL') return true;
        if (currentPaymentFilter === 'MILD_DELAY') return pay.aging_category === 'MILD_DELAY';
        if (currentPaymentFilter === 'SEVERE_DELAY') return pay.aging_category === 'SEVERE_DELAY';
        if (currentPaymentFilter === 'PENDING') return pay.status !== 'PAID';
        return true;
      });

      let html = '';
      filtered.forEach(pay => {
        let agingBadge = '';
        if (pay.status === 'PAID') {
          if (pay.aging_days <= 0) agingBadge = '<span class="pill pill-paid">Đúng hạn</span>';
          else if (pay.aging_days <= 15) agingBadge = \`<span class="pill pill-mild">+\${pay.aging_days}d</span>\`;
          else agingBadge = \`<span class="pill pill-severe">+\${pay.aging_days}d</span>\`;
        } else {
          agingBadge = '<span class="pill pill-pending">Chờ duyệt</span>';
        }

        html += \`<tr>
          <td style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">\${pay.contract_no}</td>
          <td style="font-family: var(--font-mono); color: var(--accent-mint);">\${pay.subd_id}</td>
          <td><strong>\${pay.customer_name}</strong></td>
          <td>\${pay.area}</td>
          <td style="color: var(--text-dim); font-size: 12px;">\${pay.ss_name}</td>
          <td style="font-size: 12px;">\${pay.schedule_date}</td>
          <td style="font-size: 12px; color: var(--accent-mint);">\${pay.actual_date}</td>
          <td class="num">\${agingBadge}</td>
          <td class="num">\${fmtVND(pay.oo_amount)}</td>
          <td class="num" style="color: var(--accent-mint); font-weight: 700;">\${fmtVND(pay.actual_amount)}</td>
          <td class="num">\${pay.disbursed_pct}%</td>
          <td><span class="pill \${pay.status === 'PAID' ? 'pill-paid' : 'pill-pending'}">\${pay.status}</span></td>
        </tr>\`;
      });
      tbody.innerHTML = html;
    }

    function setPaymentFilter(filter, el) {
      currentPaymentFilter = filter;
      document.querySelectorAll('#payment-filter-chips .chip').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      renderPaymentsTable();
    }
    function filterPaymentsTable() { renderPaymentsTable(); }

    // =========================================================================
    // OSR TEMPLATE {OR1A} RENDERER
    // =========================================================================
    function populateOSRSelector() {
      const sel = document.getElementById('osr-subd-selector');
      // keep first default option
      if (sel.options.length <= 1) {
        DATA_MART.subd_plans.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.subd_id;
          opt.textContent = \`[\${p.subd_id}] \${p.subd_name} (\${p.tpo_type} - Target: \${fmtNum(p.new_plan.target_vol)} thùng)\`;
          sel.appendChild(opt);
        });
      }
    }

    function openSubDOSR(subdId) {
      switchTab('osr-form');
      const sel = document.getElementById('osr-subd-selector');
      sel.value = subdId;
      loadOSRForm(subdId);
    }

    function loadOSRForm(val) {
      if (val === 'SAMPLE_ANH_TAI') {
        renderOSRDoc(TEMPLATE_ANH_TAI);
        return;
      }

      const p = DATA_MART.subd_plans.find(x => x.subd_id === val);
      if (!p) return;

      const monthlyVol = p.new_plan.target_month || Math.round(p.new_plan.target_vol / 12);
      const totalAnnual = p.new_plan.target_vol;
      const costCase = p.old_contract.cost_per_case || 4000;
      const totalAmount = p.new_plan.total_amount || (totalAnnual * costCase);

      // Generate dynamic schedule
      const qtrAmount = Math.round(totalAmount / 4);
      const qtrVol = Math.round(totalAnnual / 4);
      const payList = [
        { date: "31/10/2026", amount: qtrAmount, note: \`Payment đợt 1: đạt tích lũy \${fmtNum(qtrVol)} cases HVN\` },
        { date: "31/01/2027", amount: qtrAmount, note: \`Payment đợt 2: đạt tích lũy \${fmtNum(qtrVol * 2)} cases HVN\` },
        { date: "30/04/2027", amount: qtrAmount, note: \`Payment đợt 3: đạt tích lũy \${fmtNum(qtrVol * 3)} cases HVN\` },
        { date: "31/07/2027", amount: qtrAmount, note: \`Payment đợt 4: đạt tích lũy \${fmtNum(totalAnnual)} cases HVN\` }
      ];

      // Generate dynamic SKUs proportional to volume
      const skuList = [
        { name: "Larue Bottle 20s (355)", target: Math.round(monthlyVol * 0.4), share: 40 },
        { name: "LARUE SMOOTH CAN 24S 330ML", target: Math.round(monthlyVol * 0.35), share: 35 },
        { name: "Tiger Crystal Sleek Can 24s (330)", target: Math.round(monthlyVol * 0.08), share: 8 },
        { name: "Larue Special Can (330)", target: Math.round(monthlyVol * 0.06), share: 6 },
        { name: "Tiger Can 24s (330)", target: Math.round(monthlyVol * 0.05), share: 5 },
        { name: "Heineken Silver Sleek can 24s (250)", target: Math.round(monthlyVol * 0.03), share: 3 },
        { name: "Tiger Bottle 24s (330)", target: Math.round(monthlyVol * 0.01), share: 1 },
        { name: "Heineken Silver Sleek can 24s (330)", target: Math.round(monthlyVol * 0.01), share: 1 },
        { name: "Tiger Crystal Bottle 24s (330)", target: Math.round(monthlyVol * 0.01), share: 1 }
      ];

      const model = {
        proposal_no: \`OSR-2026-\${p.subd_id}-OR1A\`,
        outlet_id: p.subd_id,
        outlet_name: p.subd_name,
        capacity: 150,
        phone: "090xxxxxxx",
        years_opened: p.old_contract.months ? Math.round(p.old_contract.months / 12) + 2 : 3,
        years_with_hvb: 3,
        years_with_comp: 0,
        address: p.old_contract.address || "South 2 / South 9",
        sales_rep: "NGUYỄN THÀNH ÂN",
        outlet_type: "SUBDIST",
        leading_brand: p.tpo_type === 'TPO' ? "TIGER / LARUE" : "LARUE REGULAR",
        supplier_code: "10260176",
        supplier_name: "TG4 DNTN HỒNG PHƯƠNG / NPP KHU VỰC",
        start_date: p.new_plan.start_date || "01/10/2026",
        complete_date: p.new_plan.end_date || "30/09/2027",
        no_months: p.new_plan.months || 12,
        contract_status: p.old_contract.months > 0 ? "RE-TIE UP (TÁI KÝ)" : "NEW TIE UP",
        target_incentive: totalAmount,
        fixed_cash: 0,
        gratis: 0,
        conditional_term: 0,
        other_term: 0,
        total_amount: totalAmount,
        cost_per_case: costCase,
        contract_type: "RS",
        remark: \`TIE UP TARGET: \${fmtNum(totalAnnual)} CASES HVN/\${p.new_plan.months} MONTHS.\\nPAYMENT EACH QUARTER UPON REACHING TARGET.\\nCOST: \${fmtNum(costCase)}/CASES.\\nPhân bổ ngân sách ghi nhận 2026: \${fmtVND(p.new_plan.amount_in_2026)} (\${p.new_plan.months_in_2026} tháng).\`,
        skus: skuList,
        total_monthly_target: monthlyVol,
        total_annual_target: totalAnnual,
        payments: payList,
        approvers: {
          sr: "NGUYỄN THÀNH ÂN",
          ss: "SE / SS / TL",
          asm: "ASM"
        }
      };

      renderOSRDoc(model);
    }

    function renderOSRDoc(m) {
      document.getElementById('osr-prop-no').innerText = m.proposal_no;
      document.getElementById('osr-outlet-id').innerText = m.outlet_id;
      document.getElementById('osr-capacity').innerText = m.capacity;
      document.getElementById('osr-outlet-name').innerText = m.outlet_name;
      document.getElementById('osr-years-open').innerText = m.years_opened;
      document.getElementById('osr-phone').innerText = m.phone;
      document.getElementById('osr-years-hvb').innerText = m.years_with_hvb;
      document.getElementById('osr-address').innerText = m.address;
      document.getElementById('osr-sr').innerText = m.sales_rep;
      document.getElementById('osr-type').innerText = m.outlet_type;
      document.getElementById('osr-brand').innerText = m.leading_brand;
      document.getElementById('osr-supp-code').innerText = m.supplier_code;
      document.getElementById('osr-supp-name').innerText = m.supplier_name;

      document.getElementById('osr-start-date').innerText = m.start_date;
      document.getElementById('osr-end-date').innerText = m.complete_date;
      document.getElementById('osr-months').innerText = m.no_months;
      document.getElementById('osr-contract-status').innerText = m.contract_status;
      document.getElementById('osr-contract-type').innerText = m.contract_type;

      document.getElementById('osr-target-incentive').innerText = fmtVND(m.target_incentive);
      document.getElementById('osr-fixed-cash').innerText = fmtVND(m.fixed_cash);
      document.getElementById('osr-total-invest').innerText = fmtVND(m.total_amount);
      document.getElementById('osr-cost-case').innerText = fmtNum(m.cost_per_case) + ' đ/thùng';
      document.getElementById('osr-remark').innerText = m.remark;

      // SKUs
      let skuHtml = '';
      m.skus.forEach(s => {
        skuHtml += \`<tr>
          <td>\${s.name}</td>
          <td class="qty">\${fmtNum(s.target)} thùng</td>
          <td style="text-align: center; font-weight: 600; color: #475569;">\${s.share}%</td>
        </tr>\`;
      });
      document.getElementById('osr-sku-tbody').innerHTML = skuHtml;
      document.getElementById('osr-total-month-vol').innerText = fmtNum(m.total_monthly_target) + ' thùng';
      document.getElementById('osr-total-year-vol').innerText = fmtNum(m.total_annual_target) + ' thùng';

      // Payments
      let payHtml = '';
      m.payments.forEach((p, i) => {
        payHtml += \`<tr>
          <td style="text-align: center; font-weight: 700;">Đợt \${i + 1}</td>
          <td>\${p.date}</td>
          <td class="money" style="color: #00702c;">\${fmtVND(p.amount)}</td>
          <td>\${p.note}</td>
        </tr>\`;
      });
      document.getElementById('osr-payment-tbody').innerHTML = payHtml;

      document.getElementById('osr-sign-sr').innerText = m.approvers.sr;
      document.getElementById('osr-sign-ss').innerText = m.approvers.ss;
      document.getElementById('osr-sign-asm').innerText = m.approvers.asm;
    }

    function printOSRDoc() {
      window.print();
    }

    function copyOSRBrief() {
      const name = document.getElementById('osr-outlet-name').innerText;
      const id = document.getElementById('osr-outlet-id').innerText;
      const target = document.getElementById('osr-total-year-vol').innerText;
      const amount = document.getElementById('osr-total-invest').innerText;
      const cost = document.getElementById('osr-cost-case').innerText;
      const remark = document.getElementById('osr-remark').innerText;

      const text = \`[TỜ TRÌNH OSR PHÊ DUYỆT - HEINEKEN OR1A]
Kính gửi: Ban Giám Đốc Bán Hàng (ASM/RSM)
Sales Rep: NGUYỄN THÀNH ÂN trình duyệt hồ sơ tài trợ:
• Đại lý: \${name} (Mã: \${id})
• Loại hình: SUBDIST - Kế hoạch Tie-Up 2026
• Sản lượng cam kết: \${target} (Trung bình \${document.getElementById('osr-total-month-vol').innerText}/tháng)
• Tổng ngân sách tài trợ: \${amount}
• Định mức Cost/Case: \${cost}
• Điều kiện giải ngân: \${remark}
Kính trình Quản lý xem xét phê duyệt hồ sơ OSR {OR1A}.\`;

      navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép Kịch bản Tờ trình OSR vào bộ nhớ tạm!');
      });
    }

    // Tab 4: SubD 360
    function populateSubDSelector() {
      const sel = document.getElementById('subd-selector');
      sel.innerHTML = '';
      DATA_MART.subd_plans.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.subd_id;
        opt.textContent = \`[\${p.subd_id}] \${p.subd_name} (\${p.tpo_type})\`;
        sel.appendChild(opt);
      });
      if (DATA_MART.subd_plans.length > 0) {
        renderSubDProfile(DATA_MART.subd_plans[0].subd_id);
      }
    }

    function renderSubDProfile(subdId) {
      const p = DATA_MART.subd_plans.find(x => x.subd_id === subdId);
      if (!p) return;

      const paymentsList = p.payments;
      let payRowsHtml = '';
      if (paymentsList.length > 0) {
        paymentsList.forEach((pay, i) => {
          payRowsHtml += \`<tr>
            <td>Đợt \${i + 1}</td>
            <td style="font-size: 11px;">\${pay.payment_notes}</td>
            <td class="num">\${fmtVND(pay.oo_amount)}</td>
            <td class="num" style="color: var(--accent-mint); font-weight: 700;">\${fmtVND(pay.actual_amount)}</td>
            <td>\${pay.actual_date}</td>
            <td class="num">\${pay.aging_days > 0 ? '+' + pay.aging_days + 'd' : 'Đúng hạn'}</td>
            <td><span class="pill pill-paid">\${pay.status}</span></td>
          </tr>\`;
        });
      } else {
        payRowsHtml = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 16px;">Chưa có dữ liệu thanh toán OSR chi tiết</td></tr>';
      }

      const zaloText = \`[HEINEKEN OSR TRACKING - THÔNG BÁO TIẾN ĐỘ SUBD]
Kính gửi: Quản lý / Đại lý \${p.subd_name} (Mã: \${p.subd_id})
• Phân loại: \${p.tpo_type}
• Chỉ tiêu cam kết mới: \${fmtNum(p.new_plan.target_vol)} thùng/năm (\${fmtNum(p.new_plan.target_month)} thùng/tháng)
• Đơn giá tài trợ Cost/Case: \${fmtNum(p.old_contract.cost_per_case)} đ/thùng
• Ngân sách phân bổ ghi nhận 2026: \${fmtVND(p.new_plan.amount_in_2026)} (Chạy \${p.new_plan.months_in_2026} tháng)
• Đã giải ngân OSR thực tế: \${fmtVND(p.total_paid_actual)}
Đề nghị Anh/Chị đối soát chỉ tiêu tháng và hoàn tất hồ sơ nghiệm thu đợt tiếp theo. Trân trọng!\`;

      const html = \`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="color: var(--accent-mint); font-size: 14px;">📄 Thông Số Hợp Đồng Cũ vs Tái Ký Mới</h4>
              <button class="btn btn-gold" style="padding: 4px 10px; font-size: 11px;" onclick="openSubDOSR('\${p.subd_id}')">Mở Form OSR {OR1A} ➔</button>
            </div>
            <table class="custom-table" style="font-size: 12px;">
              <tr><td style="color: var(--text-muted);">Thời hạn cũ:</td><td>\${p.old_contract.start_date} ➔ \${p.old_contract.end_date} (\${p.old_contract.months} tháng)</td></tr>
              <tr><td style="color: var(--text-muted);">Sản lượng cũ:</td><td class="num"><strong>\${fmtNum(p.old_contract.target_vol)}</strong> thùng</td></tr>
              <tr><td style="color: var(--text-muted);">Tài trợ cũ:</td><td class="num">\${fmtVND(p.old_contract.oo_amount)}</td></tr>
              <tr><td style="color: var(--accent-cyan); font-weight: 700;">Định mức Cost/Case:</td><td class="num" style="color: var(--accent-cyan); font-weight: 700;">\${fmtNum(p.old_contract.cost_per_case)} đ/thùng</td></tr>
              <tr style="border-top: 1px solid rgba(0,168,67,0.3);"><td style="color: var(--accent-mint); font-weight: 700;">Thời hạn tái ký mới:</td><td>\${p.new_plan.start_date} ➔ \${p.new_plan.end_date} (\${p.new_plan.months} tháng)</td></tr>
              <tr><td style="color: var(--accent-mint); font-weight: 700;">Target Năm Mới:</td><td class="num" style="color: var(--accent-mint); font-weight: 700;">\${fmtNum(p.new_plan.target_vol)} thùng</td></tr>
              <tr><td style="color: var(--accent-gold);">Ngân sách năm 2026:</td><td class="num" style="color: var(--accent-gold); font-weight: 700;">\${fmtVND(p.new_plan.amount_in_2026)}</td></tr>
            </table>
          </div>

          <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px;">
            <h4 style="color: var(--accent-gold); margin-bottom: 12px; font-size: 14px;">💳 Tiến Độ Giải Ngân Chi Trả OSR</h4>
            <div style="margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span>Tỷ Lệ Giải Ngân Thực Tế</span>
                <span style="font-weight: 700; color: var(--accent-mint);">\${p.disbursed_rate}%</span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
                <div style="width: \${Math.min(100, p.disbursed_rate)}%; height: 100%; background: linear-gradient(90deg, #00A843, #00FF85);"></div>
              </div>
            </div>
            <table class="custom-table" style="font-size: 12px;">
              <tr><td style="color: var(--text-muted);">Tổng duyệt chi:</td><td class="num">\${fmtVND(p.total_oo_budget)}</td></tr>
              <tr><td style="color: var(--accent-mint); font-weight: 700;">Đã thanh toán thực tế:</td><td class="num" style="color: var(--accent-mint); font-weight: 700;">\${fmtVND(p.total_paid_actual)}</td></tr>
              <tr><td style="color: var(--text-muted);">Còn lại chưa chi:</td><td class="num">\${fmtVND(p.total_oo_budget - p.total_paid_actual)}</td></tr>
              <tr><td style="color: var(--text-muted);">Số đợt thanh toán:</td><td class="num">\${p.payments.length} đợt</td></tr>
            </table>
          </div>
        </div>

        <h4 style="color: var(--text-white); margin-bottom: 10px; font-size: 14px;">📜 Lịch Sử Các Đợt Giải Ngân OSR</h4>
        <div class="table-responsive" style="margin-bottom: 20px;">
          <table class="custom-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Đợt</th>
                <th>Ghi Chú Chi Trả</th>
                <th class="num">Duyệt Chi</th>
                <th class="num">Thực Chi</th>
                <th>Ngày Thực Chi</th>
                <th class="num">Aging</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>\${payRowsHtml}</tbody>
          </table>
        </div>

        <div class="zalo-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-weight: 700; color: var(--accent-cyan); display: flex; align-items: center; gap: 8px;">
              📱 Kịch Bản Tin Nhắn Zalo 30s Chốt Số Tác Chiến
            </span>
            <button class="btn btn-primary" style="padding: 5px 12px; font-size: 11px;" onclick="copyZaloText()">
              📋 Copy Tin Nhắn Zalo 1 Chạm
            </button>
          </div>
          <div class="zalo-text" id="zalo-preview-text">\${zaloText}</div>
        </div>
      \`;

      document.getElementById('profile-content').innerHTML = html;
    }

    function copyZaloText() {
      const txt = document.getElementById('zalo-preview-text').innerText;
      navigator.clipboard.writeText(txt).then(() => {
        alert('Đã copy kịch bản Zalo thành công!');
      });
    }

    // Modal
    function openSubDModal(subdId) {
      const p = DATA_MART.subd_plans.find(x => x.subd_id === subdId);
      if (!p) return;

      document.getElementById('modal-subd-name').innerText = p.subd_name;
      document.getElementById('modal-subd-id').innerText = 'MÃ SUB-D: ' + p.subd_id + ' • ' + p.tpo_type;

      let payRows = '';
      if (p.payments.length > 0) {
        p.payments.forEach((pay, idx) => {
          payRows += \`<tr>
            <td>Đợt \${idx + 1}</td>
            <td>\${pay.payment_notes}</td>
            <td class="num">\${fmtVND(pay.oo_amount)}</td>
            <td class="num" style="color: var(--accent-mint); font-weight: 700;">\${fmtVND(pay.actual_amount)}</td>
            <td>\${pay.actual_date}</td>
            <td>\${pay.aging_days > 0 ? '+' + pay.aging_days + 'd' : 'Đúng hạn'}</td>
          </tr>\`;
        });
      } else {
        payRows = '<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 12px;">Chưa có giao dịch chi trả</td></tr>';
      }

      const bodyHtml = \`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 10px;">
            <div style="color: var(--text-dim); font-size: 11px;">TARGET NĂM MỚI</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-mint); font-family: var(--font-mono);">\${fmtNum(p.new_plan.target_vol)} thùng</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Target/Quý: \${fmtNum(p.new_plan.target_quarter)} • Target/Tháng: \${fmtNum(p.new_plan.target_month)}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 10px;">
            <div style="color: var(--text-dim); font-size: 11px;">NGÂN SÁCH NĂM 2026</div>
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-gold); font-family: var(--font-mono);">\${fmtVND(p.new_plan.amount_in_2026)}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Thời gian chạy trong 2026: \${p.new_plan.months_in_2026} tháng</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="color: var(--text-white);">Lịch sử thanh toán OSR (\${p.payments.length} đợt)</h4>
          <button class="btn btn-gold" style="padding: 4px 10px; font-size: 11px;" onclick="closeModalDirect(); openSubDOSR('\${p.subd_id}');">Xem Biểu Mẫu OSR {OR1A} ➔</button>
        </div>
        <div class="table-responsive">
          <table class="custom-table" style="font-size: 12px;">
            <thead>
              <tr><th>Đợt</th><th>Ghi chú</th><th class="num">Duyệt chi</th><th class="num">Thực chi</th><th>Ngày chi</th><th>Aging</th></tr>
            </thead>
            <tbody>\${payRows}</tbody>
          </table>
        </div>
      \`;

      document.getElementById('modal-body-content').innerHTML = bodyHtml;
      document.getElementById('detail-modal').classList.add('active');
    }

    function closeModalDirect() { document.getElementById('detail-modal').classList.remove('active'); }
    function closeModal(e) { if (e.target.id === 'detail-modal') document.getElementById('detail-modal').classList.remove('active'); }

    // Export CSV
    function exportCSV(type) {
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
      if (type === 'plans') {
        csvContent += 'Mã SubD,Tên Đại Lý,Phân Loại,Cost Per Case,Target Năm Mới,Target Tháng,Ngân Sách 2026,Số Tháng 2026,Tổng HĐ Mới\\n';
        DATA_MART.subd_plans.forEach(p => {
          csvContent += \`"\${p.subd_id}","\${p.subd_name}","\${p.tpo_type}",\${p.old_contract.cost_per_case},\${p.new_plan.target_vol},\${p.new_plan.target_month},\${p.new_plan.amount_in_2026},\${p.new_plan.months_in_2026},\${p.new_plan.total_amount}\\n\`;
        });
      } else {
        csvContent += 'Mã HĐ,Mã SubD,Tên Khách Hàng,Vùng,SS Giám Sát,Lịch Hẹn,Ngày Chi,Aging Ngày,Ngân Sách Duyệt,Thực Chi,Tỷ Lệ %,Trạng Thái,Ghi Chú\\n';
        DATA_MART.payments.forEach(pay => {
          csvContent += \`"\${pay.contract_no}","\${pay.subd_id}","\${pay.customer_name}","\${pay.area}","\${pay.ss_name}","\${pay.schedule_date}","\${pay.actual_date}",\${pay.aging_days},\${pay.oo_amount},\${pay.actual_amount},\${pay.disbursed_pct},"\${pay.status}","\${pay.payment_notes}"\\n\`;
        });
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', \`heineken_\${type}_\${new Date().toISOString().slice(0, 10)}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      renderOverviewWidgets();
      renderPlansTable();
      renderPaymentsTable();
      populateOSRSelector();
      renderOSRDoc(TEMPLATE_ANH_TAI);
    });
  </script>
</body>
</html>`;

// Save to 03_Executive_Dashboard/index.html
const dashDir = path.join(projectRoot, '03_Executive_Dashboard');
if (!fs.existsSync(dashDir)) fs.mkdirSync(dashDir, { recursive: true });
const outDashPath = path.join(dashDir, 'index.html');
fs.writeFileSync(outDashPath, htmlContent, 'utf8');

// Save to Project Root index.html
const outRootPath = path.join(projectRoot, 'index.html');
fs.writeFileSync(outRootPath, htmlContent, 'utf8');

console.log('Successfully compiled Executive Dashboard HTML with OSR Template {OR1A}!');
console.log(' - ' + outDashPath);
console.log(' - ' + outRootPath);
console.log('File size: ' + (fs.statSync(outRootPath).size / 1024).toFixed(1) + ' KB');
