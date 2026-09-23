const fs = require('fs');
const path = require('path');

function generateDashboardHtml(dataPath, outputPath) {
    console.log(`Reading clean data from: ${dataPath}`);
    let raw = fs.readFileSync(dataPath, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) {
        raw = raw.slice(1);
    }
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    console.log(`Loaded ${data.subd_list.length} SubDs, ${data.inactive_outlets_master?.length || 0} Inactive Outlets for Month: ${data.metadata.report_month}`);

    // Embed clean, lightweight data payload directly (< 1.5MB total file size)
    const embeddedData = JSON.parse(JSON.stringify(data));
    embeddedData.subd_list.forEach(s => {
        delete s.sku_targets;
        delete s.sku_si;
        delete s.sku_so;
        delete s.inactive_outlets;
        if (s.sku_list) {
            s.sku_list.forEach(k => {
                delete k.si_30d;
                delete k.so_30d;
            });
        }
    });
    if (embeddedData.inactive_outlets_master) {
        embeddedData.inactive_outlets_master.forEach(o => {
            delete o.subd_name;
            delete o.area_name;
        });
    }
    const embeddedDataJson = JSON.stringify(embeddedData);

    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heineken SDIP - End-to-End Tracking Dashboard (${data.metadata.report_month})</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

    <style>
        :root {
            --hnk-green: #008200;
            --hnk-green-dark: #005200;
            --hnk-green-light: #e8f5e9;
            --hnk-red: #dc2626;
            --hnk-red-light: #fee2e2;
            --hnk-amber: #d97706;
            --hnk-amber-light: #fef3c7;
            --hnk-silver: #64748b;
            --tiger-blue: #0055b8;
            --tiger-blue-light: #eff6ff;
            --tiger-orange: #ea580c;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06);
            --shadow-lg: 0 10px 20px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.06);
            --radius-md: 12px;
            --radius-lg: 16px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3, h4, h5, .brand-font { font-family: 'Outfit', sans-serif; }

        body {
            background-color: var(--bg-body);
            color: var(--text-main);
            line-height: 1.5;
        }

        /* 2-Column Enterprise App Layout */
        .app-layout {
            display: flex;
            min-height: 100vh;
            background: #f8fafc;
        }

        /* Left Sidebar (Heineken Luxury Emerald) */
        .app-sidebar {
            width: 290px;
            min-width: 290px;
            background: linear-gradient(180deg, #051b0d 0%, #082914 45%, #03140a 100%);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.16);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: sticky;
            top: 0;
            height: 100vh;
            padding: 24px 18px;
            box-sizing: border-box;
            z-index: 100;
            user-select: none;
            overflow-y: auto;
        }

        /* Sidebar Brand Section */
        .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 20px;
        }
        .sidebar-brand-star {
            font-size: 28px;
            line-height: 1;
            filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.6));
        }
        .sidebar-brand-name {
            font-size: 19px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: -0.3px;
            font-family: 'Outfit', sans-serif;
            line-height: 1.1;
        }
        .sidebar-brand-sub {
            font-size: 10.5px;
            font-weight: 700;
            color: #86efac;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-top: 3px;
        }

        /* Sidebar Section Header */
        .sidebar-menu-label {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            padding: 0 8px;
            margin-bottom: 10px;
        }

        /* Vertical Navigation Tabs */
        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1;
        }
        .tab-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border-radius: var(--radius-md);
            border: 1px solid transparent;
            background: transparent;
            color: #cbd5e1;
            cursor: pointer;
            transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: left;
            position: relative;
            width: 100%;
            box-sizing: border-box;
        }
        .tab-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.12);
            transform: translateX(3px);
        }
        .tab-btn.active {
            background: linear-gradient(135deg, #008200 0%, #005a00 100%);
            color: #ffffff;
            border-color: #15803d;
            box-shadow: 0 6px 18px rgba(0, 130, 0, 0.45);
        }
        .tab-btn-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.08);
            color: #94a3b8;
            flex-shrink: 0;
            transition: all 0.2s;
        }
        .tab-btn:hover .tab-btn-icon {
            background: rgba(255, 255, 255, 0.16);
            color: #86efac;
        }
        .tab-btn.active .tab-btn-icon {
            background: rgba(255, 255, 255, 0.22);
            color: #ffffff;
        }
        .tab-btn-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
        }
        .tab-btn-title {
            font-size: 13.5px;
            font-weight: 700;
            line-height: 1.3;
            color: inherit;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tab-btn-desc {
            font-size: 10.5px;
            color: #94a3b8;
            font-weight: 500;
            margin-top: 1px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tab-btn.active .tab-btn-desc {
            color: #dcfce7;
        }
        .tab-badge {
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.15);
            color: #f1f5f9;
            flex-shrink: 0;
        }
        .tab-btn.active .tab-badge {
            background: #ffffff;
            color: #008200;
        }
        .tab-badge.warning {
            background: rgba(239, 68, 68, 0.25);
            color: #fca5a5;
        }
        .tab-btn.active .tab-badge.warning {
            background: #fecaca;
            color: #b91c1c;
        }

        /* Sidebar Footer / Meta Section */
        .sidebar-footer {
            padding-top: 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .sidebar-month-badge {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 8px;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .sidebar-month-text {
            font-size: 12px;
            font-weight: 700;
            color: #f8fafc;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .sidebar-month-tag {
            font-size: 10px;
            font-weight: 800;
            background: #008200;
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .btn-sidebar-export {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 10px;
            border-radius: var(--radius-md);
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .btn-sidebar-export:hover {
            background: #ffffff;
            color: #013801;
        }
        .sidebar-creds {
            font-size: 10px;
            color: #64748b;
            text-align: center;
            line-height: 1.4;
        }

        /* Main Content Wrapper */
        .main-wrapper {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            background: #f8fafc;
            height: 100vh;
            overflow-y: auto;
        }

        /* Main Topbar */
        .main-topbar {
            background: #ffffff;
            border-bottom: 1px solid var(--border-color);
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 90;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .topbar-page-info {
            display: flex;
            flex-direction: column;
        }
        .topbar-breadcrumb {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .topbar-page-title {
            font-size: 20px;
            font-weight: 800;
            color: var(--text-main);
            letter-spacing: -0.3px;
            margin-top: 2px;
            font-family: 'Outfit', sans-serif;
        }
        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        /* Container Layout inside Main */
        .container {
            width: 100%;
            max-width: 1540px;
            margin: 0 auto;
            padding: 24px 32px;
            box-sizing: border-box;
            padding-bottom: 60px;
        }

        /* Master Cascading Filter Bar */
        .filter-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 16px 20px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            margin-bottom: 24px;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 12px;
            align-items: center;
        }
        .filter-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }
        .filter-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .filter-select, .search-input {
            width: 100%;
            padding: 9px 10px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            background: #f8fafc;
            font-size: 12.5px;
            font-weight: 600;
            color: var(--text-main);
            outline: none;
            transition: all 0.2s;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .filter-select:focus, .search-input:focus {
            border-color: var(--hnk-green);
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(0, 130, 0, 0.12);
        }

        /* KPI Banner Grid */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 18px;
            margin-bottom: 24px;
        }
        .kpi-card {
            background: #ffffff;
            padding: 20px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            position: relative;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .kpi-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        .kpi-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: var(--hnk-green);
        }
        .kpi-card.blue::before { background: var(--tiger-blue); }
        .kpi-card.amber::before { background: var(--hnk-amber); }
        .kpi-card.red::before { background: var(--hnk-red); }
        .kpi-card.purple::before { background: #8b5cf6; }

        .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .kpi-title {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .kpi-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f5f9;
        }
        .kpi-value {
            font-size: 26px;
            font-weight: 900;
            color: var(--text-main);
            letter-spacing: -0.5px;
            line-height: 1.2;
            margin-bottom: 6px;
        }
        .kpi-footer {
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .text-green { color: var(--hnk-green); }
        .text-blue { color: var(--tiger-blue); }
        .text-amber { color: var(--hnk-amber); }
        .text-red { color: var(--hnk-red); }

        /* Card Component */
        .dashboard-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 24px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            margin-bottom: 24px;
        }
        .card-header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 12px;
        }
        .card-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--text-main);
        }
        .card-subtitle {
            font-size: 13px;
            color: var(--text-muted);
            margin-top: 2px;
        }

        /* SubD Grid & Cards */
        .subd-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
            gap: 20px;
        }
        .subd-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .subd-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
            border-color: #cbd5e1;
        }
        .subd-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
            background: #fafbfc;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
        }
        .subd-name {
            font-size: 16px;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 4px;
        }
        .subd-meta {
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }
        .badge-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
        }
        .badge-sdip {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }
        .badge-area {
            background: #e0f2fe;
            color: #0369a1;
        }
        .badge-rep {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }

        .subd-body {
            padding: 20px;
        }

        /* Dual Progress Bars */
        .progress-group {
            margin-bottom: 16px;
        }
        .progress-row {
            margin-bottom: 10px;
        }
        .progress-label-flex {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        .progress-track {
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .progress-green { background: linear-gradient(90deg, #10b981 0%, #008200 100%); }
        .progress-gold { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
        .progress-blue { background: linear-gradient(90deg, #38bdf8 0%, #0055b8 100%); }

        /* Metric Matrix in Cards (All 4 KPIs in 1 Row) */
        .subd-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            margin-bottom: 10px;
        }
        @media (max-width: 440px) {
            .subd-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        .stat-card-box {
            background: #f8fafc;
            padding: 8px 6px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 56px;
            transition: all 0.2s;
        }
        .stat-card-box:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
        }
        .stat-item-title {
            font-size: 10px;
            color: var(--text-muted);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 3px;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .stat-item-value {
            font-size: 13.5px;
            font-weight: 800;
            color: var(--text-main);
            line-height: 1.2;
            white-space: nowrap;
        }
        .stat-item-sub {
            font-size: 9.5px;
            font-weight: 600;
            color: var(--text-muted);
        }
        .stat-item-foot {
            font-size: 9.5px;
            font-weight: 700;
            margin-top: 2px;
            display: flex;
            align-items: center;
            gap: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* SCD Alert Pills */
        .scd-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
        }
        .scd-red { background: var(--hnk-red-light); color: var(--hnk-red); border: 1px solid #fecaca; }
        .scd-yellow { background: var(--hnk-amber-light); color: var(--hnk-amber); border: 1px solid #fde68a; }
        .scd-green { background: var(--hnk-green-light); color: var(--hnk-green); border: 1px solid #bbf7d0; }

        /* Action Footer */
        .subd-footer {
            padding: 12px 18px;
            background: #fafbfc;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 8px;
        }
        .btn-action {
            flex: 1;
            padding: 9px 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            background: #ffffff;
            font-size: 12px;
            font-weight: 700;
            color: var(--text-main);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .btn-action:hover {
            background: #f1f5f9;
        }
        .btn-zalo {
            background: #0068ff;
            color: #ffffff;
            border-color: #0068ff;
        }
        .btn-zalo:hover {
            background: #0052cc;
        }
        .btn-copy {
            background: var(--hnk-green-light);
            color: var(--hnk-green);
            border-color: #bbf7d0;
        }
        .btn-copy:hover {
            background: #bbf7d0;
        }
        .btn-export {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
        }
        .btn-export:hover {
            background: #1e293b;
        }
        .filter-warn-btn {
            background: #ffffff;
            color: var(--text-muted);
            border: 1px solid var(--border-color);
            transition: all 0.2s;
            cursor: pointer;
        }
        .filter-warn-btn:hover {
            background: #f1f5f9;
        }
        .filter-warn-btn.active {
            background: #0f172a !important;
            color: #ffffff !important;
            border-color: #0f172a !important;
        }

        /* Modern Data Tables */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        .data-table th {
            background: #f8fafc;
            padding: 12px 16px;
            text-align: left;
            font-weight: 700;
            color: var(--text-muted);
            border-bottom: 2px solid var(--border-color);
            white-space: nowrap;
        }
        .data-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: var(--text-main);
            white-space: nowrap;
            vertical-align: middle;
        }
        .data-table tr:hover td {
            background: #f8fafc;
        }

        /* Modal Popup */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.25s ease;
            padding: 20px;
        }
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .modal-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 900px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            animation: modalScale 0.25s ease;
        }
        @keyframes modalScale {
            from { transform: scale(0.95); }
            to { transform: scale(1); }
        }
        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-body {
            padding: 24px;
            overflow-y: auto;
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #0f172a;
            color: #ffffff;
            padding: 14px 22px;
            border-radius: var(--radius-md);
            font-size: 13px;
            font-weight: 600;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2000;
        }
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }

        /* Hidden Zalo Flash Card For Export */
        #zaloCaptureCard {
            position: absolute;
            left: -9999px;
            top: -9999px;
            width: 560px;
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            border: 2px solid #008200;
        }

        /* Hidden Full Report Card for Zalo Image Export */
        #zaloAABBReportCaptureCard {
            position: fixed;
            left: 0;
            top: 0;
            width: 1280px;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid #008200;
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            z-index: -9999;
            pointer-events: none;
        }

        /* Responsive Layout */
        @media (max-width: 1024px) {
            .app-layout {
                flex-direction: column;
            }
            .app-sidebar {
                width: 100%;
                min-width: 100%;
                height: auto;
                position: relative;
                top: auto;
                border-right: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding: 16px 20px;
            }
            .sidebar-nav {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            .main-wrapper {
                height: auto;
                overflow-y: visible;
            }
            .main-topbar {
                padding: 14px 20px;
            }
            .container {
                padding: 16px 20px;
            }
            .kpi-grid { grid-template-columns: repeat(2, 1fr); }
            .filter-card { grid-template-columns: 1fr; }
            .subd-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
            .sidebar-nav {
                grid-template-columns: 1fr;
            }
            .main-topbar {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            .kpi-grid { grid-template-columns: 1fr; }
        }
        /* ============================================================
           BEER BOTTLES & SKU HORIZONTAL MATRIX (ONE-PAGE VISUALIZATION)
           ============================================================ */
        .bottles-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            background: #f8fafc;
            border-radius: 10px;
            padding: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 14px;
        }
        .bottle-item {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #ffffff;
            border-radius: 8px;
            padding: 10px 12px;
            border: 1px solid #edf2f7;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .bottle-svg-wrap {
            width: 58px;
            height: 150px;
            flex-shrink: 0;
        }
        .bottle-info-col {
            flex: 1;
            min-width: 0;
        }
        .bottle-badge-lbl {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 4px;
        }
        .badge-lbl-aa { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .badge-lbl-bb { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

        .bottle-pct-num {
            font-size: 22px;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 4px;
        }
        .pct-num-aa { color: #d97706; }
        .pct-num-bb { color: #8b5cf6; }

        .bottle-stat-details {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            line-height: 1.35;
        }
        .bottle-stat-details strong { color: #0f172a; }

        /* SKU MATRIX STYLES */
        .sku-matrix-container {
            background: #ffffff;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            padding: 10px 12px;
            margin-bottom: 14px;
        }
        .sku-matrix-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .sku-matrix-title {
            font-size: 11.5px;
            font-weight: 800;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .sku-chart-toggle-link {
            font-size: 11px;
            font-weight: 700;
            color: #0284c7;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            padding: 2.5px 8px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .sku-chart-toggle-link:hover {
            background: #e0f2fe;
            color: #0369a1;
        }
        .sku-chart-collapsible {
            display: none;
            margin-bottom: 10px;
            padding: 10px 12px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            animation: fadeIn 0.2s ease;
        }
        .sku-chart-collapsible.open {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .sku-legend-row {
            display: flex;
            gap: 12px;
            font-size: 10px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
            flex-wrap: wrap;
            align-items: center;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .legend-box {
            width: 14px;
            height: 9px;
            border-radius: 2px;
        }
        .leg-target {
            background: rgba(241, 245, 249, 0.6);
            border: 1.5px solid #94a3b8;
        }
        .leg-si {
            background: #86efac;
            border: 1px solid #4ade80;
        }
        .leg-so {
            background: #008200;
        }

        .sku-bar-row {
            margin-bottom: 8px;
        }
        .sku-bar-row:last-child { margin-bottom: 0; }
        .sku-meta-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 3px;
        }
        .sku-badge {
            padding: 1.5px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 800;
            color: #ffffff;
            display: inline-block;
        }
        .bg-hs2 { background: #008200; }
        .bg-ts25 { background: #0284c7; }
        .bg-lmc { background: #ea580c; }
        .bg-others { background: #7c3aed; }

        /* Transparent Target Bar with Crisp Border */
        .sku-target-track {
            width: 100%;
            height: 12px;
            background: rgba(241, 245, 249, 0.5); border: 1.5px solid #cbd5e1;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
        }
        .sku-actual-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.4s ease;
        }
        .sku-fill-si {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 4px;
            z-index: 1;
            transition: width 0.3s ease;
        }
        .sku-fill-so {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 4px;
            z-index: 2;
            transition: width 0.3s ease;
        }

        /* Backward compatibility fills */
        .fill-hs2, .si-hs2 { background: #86efac; }
        .fill-ts25, .si-ts25 { background: #7dd3fc; }
        .fill-lmc, .si-lmc { background: #fdba74; }
        .fill-others, .si-others { background: #d8b4fe; }

        /* Sell-Out Fills (Darker tone) */
        .so-hs2 { background: #008200; }
        .so-ts25 { background: #0284c7; }
        .so-lmc { background: #ea580c; }
        .so-others { background: #7c3aed; }

        /* Mini SKU Table */
        .sku-mini-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            font-size: 11px;
        }
        .sku-mini-table th {
            background: #f8fafc;
            color: #475569;
            font-weight: 800;
            padding: 5px 4px;
            border-bottom: 1.5px solid #e2e8f0;
            text-align: right;
            white-space: nowrap;
            font-size: 10.5px;
        }
        .sku-mini-table td {
            padding: 4.5px 4px;
            border-bottom: 1px solid #f1f5f9;
            text-align: right;
            font-weight: 600;
            white-space: nowrap;
            font-size: 11px;
        }
        .sku-mini-table tr.total-row td {
            background: #f8fafc;
            font-weight: 800;
            border-top: 1.5px solid #cbd5e1;
        }
        .val-rem-si { color: #dc2626; font-weight: 700; }
        .val-rem-so { color: #d97706; font-weight: 700; }
        .val-done { color: #008200; font-weight: 800; }
    </style>
</head>
<body>

    <div class="app-layout">
        <!-- Left Sidebar (Vertical Navigation) -->
        <aside class="app-sidebar">
            <div>
                <!-- Brand Section -->
                <div class="sidebar-brand">
                    <div class="sidebar-brand-star">⭐</div>
                    <div>
                        <div class="sidebar-brand-name">HEINEKEN</div>
                        <div class="sidebar-brand-sub">SDIP TRACKING • ${data.metadata.report_month}</div>
                    </div>
                </div>

                <!-- Menu Category Title -->
                <div class="sidebar-menu-label">DANH MỤC ĐIỀU HÀNH</div>

                <!-- Vertical Navigation Tabs -->
                <nav class="sidebar-nav">
                    <button class="tab-btn active" onclick="switchTab('tabOverview')">
                        <div class="tab-btn-icon"><i data-lucide="layout-dashboard"></i></div>
                        <div class="tab-btn-content">
                            <span class="tab-btn-title">1. Tổng Quan Vùng</span>
                            <span class="tab-btn-desc">South 2 & South 9</span>
                        </div>
                    </button>

                    <button class="tab-btn" onclick="switchTab('tabAABB')">
                        <div class="tab-btn-icon"><i data-lucide="award"></i></div>
                        <div class="tab-btn-content">
                            <span class="tab-btn-title">2. Chi Tiết Nhóm AA – BB</span>
                            <span class="tab-btn-desc">Chỉ tiêu trọng tâm SDIP</span>
                        </div>
                        <span class="tab-badge">SDIP</span>
                    </button>

                    <button class="tab-btn" onclick="switchTab('tabSubDs')">
                        <div class="tab-btn-icon"><i data-lucide="store"></i></div>
                        <div class="tab-btn-content">
                            <span class="tab-btn-title">3. Trạm Tác Chiến 103 SubD</span>
                            <span class="tab-btn-desc">Tác chiến mạng lưới đại lý</span>
                        </div>
                        <span class="tab-badge">103 SubD</span>
                    </button>

                    <button class="tab-btn" onclick="switchTab('tabASO')">
                        <div class="tab-btn-icon"><i data-lucide="users"></i></div>
                        <div class="tab-btn-content">
                            <span class="tab-btn-title">4. Điều Tuyến ASO</span>
                            <span class="tab-btn-desc">SS / SR / DSM điều tuyến</span>
                        </div>
                        <span class="tab-badge warning">Cảnh Báo</span>
                    </button>
                </nav>
            </div>

            <!-- Sidebar Footer -->
            <div class="sidebar-footer">
                <div class="sidebar-month-badge">
                    <div class="sidebar-month-text">
                        <i data-lucide="calendar" style="width: 14px; height: 14px; color: #86efac;"></i>
                        <span>Kỳ: Tháng ${data.metadata.report_month}</span>
                    </div>
                    <span class="sidebar-month-tag">MTD</span>
                </div>
                <button class="btn-sidebar-export" onclick="exportNPPExcelReport()" style="background: #10b981; color: #ffffff; margin-bottom: 8px; font-weight: 700; border: none; box-shadow: 0 2px 4px rgba(16,185,129,0.3);" title="Xuất file Excel chỉ tiêu và thực mua SKU SubD theo NPP">
                    <i data-lucide="file-spreadsheet" style="width: 15px; height: 15px;"></i> Xuất Excel Chi Tiết (NPP)
                </button>
                <button class="btn-sidebar-export" onclick="exportCurrentViewCSV()" title="Xuất dữ liệu đang lọc sang file CSV">
                    <i data-lucide="download" style="width: 15px; height: 15px;"></i> Xuất Dữ Liệu CSV
                </button>
                <div class="sidebar-creds">
                    HEINEKEN VIỆT NAM<br>
                    Customer First • Win Together
                </div>
            </div>
        </aside>

        <!-- Main Content Wrapper -->
        <div class="main-wrapper">
            <!-- Main Topbar -->
            <header class="main-topbar">
                <div class="topbar-page-info">
                    <div class="topbar-breadcrumb">
                        <span>HEINEKEN SDIP</span>
                        <span>/</span>
                        <span id="breadcrumbCurrent" style="color: var(--hnk-green); font-weight: 800;">1. TỔNG QUAN VÙNG</span>
                    </div>
                    <h1 class="topbar-page-title" id="pageTitleCurrent">1. Báo Cáo Tổng Quan Toàn Vùng (South 2 & South 9)</h1>
                </div>
                <div class="topbar-actions">
                    <button class="btn-action btn-export" onclick="exportNPPExcelReport()" style="background: #10b981; color: #ffffff; border-color: #059669; font-weight: 700;" title="Xuất file Excel chỉ tiêu & thực mua theo từng SKU cho SubD theo NPP">
                        <i data-lucide="file-spreadsheet"></i> Xuất Excel Theo NPP (SKU)
                    </button>
                    <button class="btn-action btn-export" onclick="exportCurrentViewCSV()" title="Xuất dữ liệu đang lọc sang file CSV">
                        <i data-lucide="download"></i> Xuất CSV
                    </button>
                    <button class="btn-action" onclick="window.print()" title="In trang hiện tại">
                        <i data-lucide="printer"></i> In Trang
                    </button>
                    <div class="badge-pill" style="background: #e8f5e9; color: #008200; font-weight: 800; padding: 8px 14px; border: 1px solid #bbf7d0;">
                        <i data-lucide="calendar" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i> Tháng ${data.metadata.report_month}
                    </div>
                </div>
            </header>

            <main class="container">

        <!-- Global Cascading Filter Bar -->
        <section class="filter-card">
            <div class="filter-item">
                <label class="filter-label">1. Khu Vực</label>
                <select id="filterArea" class="filter-select" onchange="onAreaChange()">
                    <option value="ALL">Tất Cả</option>
                    <option value="South 2">South 2</option>
                    <option value="South 9">South 9</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">2. SE/SS</label>
                <select id="filterSS" class="filter-select" onchange="onSSChange()">
                    <option value="ALL">Tất Cả</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">3. SR/DSM</label>
                <select id="filterSR" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">Tất Cả</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">4. Nhà Phân Phối</label>
                <select id="filterNPP" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">Tất Cả NPP (10 NPP)</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">5. Tồn kho</label>
                <select id="filterSCD" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">Tất Cả</option>
                    <option value="RED_HIGH">🔴 Tồn Cao (> 7 Ngày)</option>
                    <option value="YELLOW_LOW">🟡 Tồn Thấp (< 3 Ngày)</option>
                    <option value="GREEN_SAFE">🟢 An Toàn (3 - 7 Ngày)</option>
                </select>
            </div>
        </section>

        <!-- Dynamic KPI Banner -->
        <section class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-title">Tổng Sell-In</span>
                    <div class="kpi-icon"><i data-lucide="truck" style="color: var(--hnk-green);"></i></div>
                </div>
                <div class="kpi-value text-green" id="kpiSI">${data.kpis.total_actual_si.toLocaleString()}</div>
                <div class="kpi-footer">
                    <span>Target: <strong id="kpiTarget">${data.kpis.total_target.toLocaleString()}</strong></span>
                    <span class="badge-pill" style="background:#e8f5e9; color:#008200;" id="kpiAchievePct">${data.kpis.achieve_pct}% Target</span>
                </div>
            </div>

            <div class="kpi-card blue">
                <div class="kpi-header">
                    <span class="kpi-title">Tổng Sell-Out (SO)</span>
                    <div class="kpi-icon"><i data-lucide="shopping-cart" style="color: var(--tiger-blue);"></i></div>
                </div>
                <div class="kpi-value text-blue" id="kpiSO">${data.kpis.total_actual_so.toLocaleString()}</div>
                <div class="kpi-footer">
                    <span>Tỷ lệ SO / SI:</span>
                    <strong class="text-blue" id="kpiSoSiPct">${data.kpis.so_vs_si_pct}%</strong>
                </div>
            </div>

            <div class="kpi-card amber">
                <div class="kpi-header">
                    <span class="kpi-title">Focus Nhóm AA (SDIP)</span>
                    <div class="kpi-icon"><i data-lucide="star" style="color: var(--hnk-amber);"></i></div>
                </div>
                <div class="kpi-value text-amber" id="kpiAASI">${data.kpis.sdip_aa_si.toLocaleString()}</div>
                <div class="kpi-footer">
                    <span>Target: <strong id="kpiAATarget">${data.kpis.sdip_aa_target.toLocaleString()}</strong></span>
                    <span class="badge-pill" style="background:#fef3c7; color:#92400e;" id="kpiAAPct">${data.kpis.sdip_aa_achieve_pct}%</span>
                </div>
            </div>

            <div class="kpi-card purple">
                <div class="kpi-header">
                    <span class="kpi-title">Normal Nhóm BB (SDIP)</span>
                    <div class="kpi-icon"><i data-lucide="package" style="color: #8b5cf6;"></i></div>
                </div>
                <div class="kpi-value" style="color: #8b5cf6;" id="kpiBBSI">${data.kpis.sdip_bb_si.toLocaleString()}</div>
                <div class="kpi-footer">
                    <span>Target: <strong id="kpiBBTarget">${data.kpis.sdip_bb_target.toLocaleString()}</strong></span>
                    <span class="badge-pill" style="background:#f3e8ff; color:#6b21a8;" id="kpiBBPct">${data.kpis.sdip_bb_achieve_pct}%</span>
                </div>
            </div>

            <div class="kpi-card red">
                <div class="kpi-header">
                    <span class="kpi-title">Quán Chưa Phát Sinh Đơn</span>
                    <div class="kpi-icon"><i data-lucide="map-pin-off" style="color: var(--hnk-red);"></i></div>
                </div>
                <div class="kpi-value text-red" id="kpiInactiveOutlets">${data.kpis.total_inactive_outlets.toLocaleString()}</div>
                <div class="kpi-footer text-red">
                    <span>Từ ASO Detail • Cần Sales đi tuyến</span>
                </div>
            </div>

            <div class="kpi-card" style="border-left: 4px solid var(--hnk-green);">
                <div class="kpi-header">
                    <span class="kpi-title">Fill Rate 24h Toàn Vùng</span>
                    <div class="kpi-icon"><i data-lucide="zap" style="color: var(--hnk-green);"></i></div>
                </div>
                <div class="kpi-value" style="color: var(--hnk-green);" id="kpiAvgFill">83.3%</div>
                <div class="kpi-footer">
                    <span>TB toàn mạng lưới • Chuẩn ≥95%</span>
                </div>
            </div>

            <div class="kpi-card" style="border-left: 4px solid var(--tiger-blue);">
                <div class="kpi-header">
                    <span class="kpi-title">Độ Phủ Điểm Bán (ASO)</span>
                    <div class="kpi-icon"><i data-lucide="store" style="color: var(--tiger-blue);"></i></div>
                </div>
                <div class="kpi-value text-blue" id="kpiAsoCoverage">5,455 <span style="font-size:14px;color:var(--text-muted);font-weight:600;">/ 5,784</span></div>
                <div class="kpi-footer">
                    <span id="kpiAsoFooter">94.3% Active • TB 9.1 SKU/SubD</span>
                </div>
            </div>
        </section>


        <!-- TAB 1: REGIONAL OVERVIEW -->
        <section id="tabOverview" class="tab-content">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 20px; margin-bottom: 24px;">
                <div class="dashboard-card" style="margin-bottom:0;">
                    <div class="card-header-flex">
                        <div>
                            <h3 class="card-title">Tiến Độ Target Sell-In vs Sell-Out Theo Vùng</h3>
                            <p class="card-subtitle">So sánh giữa South 2 và South 9</p>
                        </div>
                    </div>
                    <div id="chartAreaProgress"></div>
                </div>

                <div class="dashboard-card" style="margin-bottom:0;">
                    <div class="card-header-flex">
                        <div>
                            <h3 class="card-title">Tình Trạng Tồn Kho SCD (Toàn Mạng Lưới)</h3>
                            <p class="card-subtitle">Tỷ lệ SubD Tồn cao (>7d), Tồn thấp (<3d), An toàn (3-7d)</p>
                        </div>
                    </div>
                    <div id="chartSCDDistribution"></div>
                </div>
            </div>

            <!-- Regional Area Breakdown Table -->
            <div class="dashboard-card">
                <h3 class="card-title" style="margin-bottom: 16px;">Bảng Tổng Hợp Chi Tiêu & Chỉ Tiêu Theo Khu Vực</h3>
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Khu Vực</th>
                                <th style="text-align: right;">Số SubD</th>
                                <th style="text-align: right;">Target Tổng</th>
                                <th style="text-align: right;">Thực Đạt SI</th>
                                <th style="text-align: right;">% Đạt SI</th>
                                <th style="text-align: right;">Thực Đạt SO</th>
                                <th style="text-align: right;">Tỷ Lệ SO/SI</th>
                                <th style="text-align: right;">Fill Rate 24h</th>
                                <th style="text-align: right;">ASO Active</th>
                                <th style="text-align: right;">Tổng Điểm Bán</th>
                                <th style="text-align: right;">% ASO</th>
                                <th style="text-align: right;">SKU TB</th>
                            </tr>
                        </thead>
                        <tbody id="areaTableBody">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- TAB 2: AA - BB FOCUS DETAIL -->
        <section id="tabAABB" class="tab-content" style="display: none;">
            <div class="dashboard-card">
                <div class="card-header-flex">
                    <div>
                        <h3 class="card-title">Theo Dõi Chi Tiêu & Chỉ Tiêu Nhóm Focus AA vs Normal BB (SDIP)</h3>
                        <p class="card-subtitle">Đánh giá tiến độ hoàn thành các mã chiến lược (Heineken Silver, Tiger Crystal, v.v.)</p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn-action" onclick="exportNPPExcelReport()" style="background: #10b981; color: #ffffff; border-color: #059669; font-weight: 700;" title="Xuất file Excel chỉ tiêu & thực mua SubD theo từng SKU để gửi cho NPP theo dõi">
                            <i data-lucide="file-spreadsheet"></i> Xuất Excel Chi Tiết SKU (Gửi NPP)
                        </button>
                        <button class="btn-action btn-copy" onclick="copyAABBSummaryZalo()" title="Copy tóm tắt văn bản gửi Zalo">
                            <i data-lucide="copy"></i> Copy Báo Cáo Zalo
                        </button>
                        <button class="btn-action btn-zalo" onclick="exportAABBReportImage()" style="background: #008200; color: #ffffff; border-color: #008200; font-weight: 700;" title="Xuất toàn bộ danh sách SubD/outlet đang filter dạng ảnh Full HD gửi Zalo">
                            <i data-lucide="image"></i> Xuất Ảnh Báo Cáo Zalo (Full)
                        </button>
                    </div>
                </div>

                <div style="overflow-x: auto;">
                    <table class="data-table" id="tableAABB">
                        <thead>
                            <tr>
                                <th style="text-align: center; white-space: nowrap;">Mã SubD</th>
                                <th style="white-space: nowrap;">Tên SubD</th>
                                <th style="text-align: center; white-space: nowrap;">Khu Vực</th>
                                <th style="text-align: center; white-space: nowrap;">NPP</th>
                                <th style="white-space: nowrap;">SS Phụ Trách</th>
                                <th style="text-align: center; white-space: nowrap;">Nhóm</th>
                                <th style="text-align: right; white-space: nowrap;">Chỉ Tiêu</th>
                                <th style="text-align: right; white-space: nowrap;">Thực Bán</th>
                                <th style="text-align: right; white-space: nowrap;">% Đạt Được</th>
                                <th style="text-align: center; white-space: nowrap;">Tác Vụ Zalo</th>
                            </tr>
                        </thead>
                        <tbody id="aabbTableBody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- TAB 3: 103 SUBD HUB -->
        <section id="tabSubDs" class="tab-content" style="display: none;">
            <!-- SubD Search Input -->
            <div style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center;">
                <div style="position: relative; flex: 1;">
                    <i data-lucide="search" style="position: absolute; left: 14px; top: 12px; width: 18px; height: 18px; color: var(--text-muted);"></i>
                    <input type="text" id="subdSearchInput" class="search-input" style="padding-left: 42px;" placeholder="Tìm nhanh theo tên đại lý SubD, mã số 663xxxxx..." oninput="onFilterChange()">
                </div>
                <div style="font-size: 13px; font-weight: 700; color: var(--text-muted); white-space: nowrap;" id="subdCountBadge">
                    Hiển thị 103 SubD
                </div>
            </div>

            <!-- SubD Cards Container -->
            <div id="subdCardsContainer" class="subd-grid">
                <!-- Populated dynamically -->
            </div>
        </section>

        <!-- TAB 4: ASO OUTLETS & ROUTE DISPATCH -->
        <section id="tabASO" class="tab-content" style="display: none;">
            <div class="dashboard-card">
                <div class="card-header-flex">
                    <div>
                        <h3 class="card-title">Danh Sách Điểm Bán Chưa Mua Hàng Trong Tháng (${data.metadata.report_month})</h3>
                        <p class="card-subtitle">Trích xuất từ file ASO Detail (Orders = 0) • Đối chiếu Volume 3 tháng từ DIS Volume • Cảnh báo nguy cơ mất điểm bán</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-action btn-copy" onclick="copyCurrentRepsZaloMessage()">
                            <i data-lucide="send"></i> Copy Tin Nhắn Điều Tuyến Gửi Zalo SS/SR
                        </button>
                        <button class="btn-action btn-export" onclick="exportInactiveOutletsCSV()">
                            <i data-lucide="file-spreadsheet"></i> Xuất Danh Sách Điểm Bán (CSV)
                        </button>
                    </div>
                </div>

                <!-- Quick Warning Level Filter Pills -->
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; padding-top: 4px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); margin-right: 4px;">Mức Độ Cảnh Báo:</span>
                    <button class="btn-action filter-warn-btn active" id="btnWarnAll" style="padding: 6px 14px; font-size: 11.5px; border-radius: 20px;" onclick="filterASOWarning('ALL')">
                        Tất Cả Điểm Bán (<span id="countWarnAll">0</span>)
                    </button>
                    <button class="btn-action filter-warn-btn" id="btnWarnHigh" style="padding: 6px 14px; font-size: 11.5px; border-radius: 20px; border-color: #fecaca; color: #b91c1c; background: #fef2f2;" onclick="filterASOWarning('HIGH_3M')">
                        🔴 Cảnh Báo Cao: 3 Tháng Không Mua (<span id="countWarnHigh">0</span>)
                    </button>
                    <button class="btn-action filter-warn-btn" id="btnWarnChurn" style="padding: 6px 14px; font-size: 11.5px; border-radius: 20px; border-color: #fde68a; color: #92400e; background: #fffbeb;" onclick="filterASOWarning('CHURN_RISK')">
                        🟡 Chưa Mua T9: T7/T8 Có Mua (<span id="countWarnChurn">0</span>)
                    </button>
                    <button class="btn-action" onclick="exportInactiveOutletsCSV()" style="padding: 6px 16px; font-size: 11.5px; border-radius: 20px; border: 1px solid #10b981; color: #ffffff; background: #10b981; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(16,185,129,0.2); margin-left: auto;">
                        <i data-lucide="file-spreadsheet" style="width: 14px; height: 14px;"></i> Xuất Excel Danh Sách Đang Lọc
                    </button>
                </div>

                <div style="overflow-x: auto;">
                    <table class="data-table" id="tableASO">
                        <thead>
                            <tr>
                                <th style="white-space: nowrap;">Mã Outlet</th>
                                <th style="white-space: nowrap;">Tên Điểm Bán</th>
                                <th style="white-space: nowrap;">Địa Bàn / Tỉnh</th>
                                <th style="white-space: nowrap;">SubD Cung Ứng</th>
                                <th style="text-align: center; white-space: nowrap;">Khu Vực</th>
                                <th style="white-space: nowrap;">SR / DSM</th>
                                <th style="white-space: nowrap;">SE / SS</th>
                                <th style="text-align: right; white-space: nowrap;">Vol T7 (thùng)</th>
                                <th style="text-align: right; white-space: nowrap;">Vol T8 (thùng)</th>
                                <th style="text-align: right; white-space: nowrap;">Vol T9 (thùng)</th>
                                <th style="text-align: center; white-space: nowrap;">Mức Độ Cảnh Báo</th>
                            </tr>
                        </thead>
                        <tbody id="asoTableBody">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

    </main>
        </div><!-- /.main-wrapper -->
    </div><!-- /.app-layout -->

    <!-- SubD Detail Modal -->
    <div id="subdModal" class="modal-overlay" onclick="closeModalOnBg(event)">
        <div class="modal-card">
            <div class="modal-header">
                <div>
                    <h3 id="modalSubDName" style="font-size: 18px; font-weight: 800;">Tên SubD</h3>
                    <div id="modalSubDMeta" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Mã: 66300000 | Khu Vực: South 2</div>
                </div>
                <button onclick="closeModal()" style="border: none; background: #f1f5f9; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Injected via JS -->
            </div>
        </div>
    </div>

    <!-- SDIP Target Notification Modal (Thư Báo Chỉ Tiêu Chuẩn Heineken) -->
    <div id="sdipNoticeModal" class="modal-overlay" onclick="closeSdipNoticeOnBg(event)">
        <div class="modal-card" style="max-width: 840px; padding: 0; overflow: hidden; border-radius: 18px; border: 1px solid #cbd5e1; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            <!-- Modal Actions Bar -->
            <div style="background: #ffffff; padding: 12px 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge-pill" style="background: #dcfce7; color: #15803d; font-weight: 800;">
                        <i data-lucide="award" style="width:14px;height:14px;display:inline;"></i> BIỂU MẪU CHỈ TIÊU SDIP
                    </span>
                    <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">Tháng 09/2026</span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn-action btn-copy" style="padding: 6px 14px; font-size: 12px;" onclick="copySdipNoticeZalo()" title="Copy tin nhắn Zalo gửi SubD">
                        <i data-lucide="copy" style="width:14px;height:14px;"></i> Copy Zalo
                    </button>
                    <button class="btn-action btn-zalo" style="padding: 6px 14px; font-size: 12px;" onclick="exportSdipNoticeImage()" title="Tải ảnh Thư Báo 30s">
                        <i data-lucide="download" style="width:14px;height:14px;"></i> Tải Ảnh HD
                    </button>
                    <button class="btn-action" style="padding: 6px 12px; font-size: 12px;" onclick="window.print()" title="In thư báo">
                        <i data-lucide="printer" style="width:14px;height:14px;"></i> In
                    </button>
                    <button onclick="closeSdipNoticeModal()" style="border: none; background: #f1f5f9; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>

            <!-- Letterhead Container to Capture / Print -->
            <div id="sdipNoticePrintCard" style="background: #ffffff; padding: 32px 36px; font-family: 'Plus Jakarta Sans', sans-serif;">
                <!-- Brand Top Banner -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #008200; padding-bottom: 16px; margin-bottom: 20px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 24px; color: #dc2626;">★</span>
                            <span style="font-size: 22px; font-weight: 900; letter-spacing: 1px; color: #008200; font-family: 'Outfit', sans-serif;">HEINEKEN VIETNAM</span>
                        </div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; margin-top: 2px;">CÔNG TY TNHH NHÀ MÁY BIA HEINEKEN VIỆT NAM</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; font-weight: 700; color: #008200; background: #e8f5e9; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                            HEINEKEN SUB DISTRIBUTOR INCENTIVE PROGRAM
                        </div>
                        <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 4px;">Thời gian: 01/09/2026 – 30/09/2026</div>
                    </div>
                </div>

                <!-- Title -->
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="font-size: 22px; font-weight: 900; color: #013801; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px; margin-bottom: 4px;">
                        THÔNG BÁO CHỈ TIÊU DOANH SỐ SDIP
                    </h2>
                    <div style="font-size: 15px; font-weight: 800; color: #dc2626; letter-spacing: 0.5px;">THÁNG 09/2026</div>
                </div>

                <!-- Intro Notice -->
                <div style="font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 18px; text-align: justify;">
                    <p style="margin-bottom: 8px;"><strong>Kính gửi:</strong> Quý Đại Lý <strong id="sdipNoticeSubDName" style="color: #008200;">[Tên Đại Lý]</strong>,</p>
                    <p>HEINEKEN Việt Nam trân trọng cảm ơn Quý Đại Lý đã luôn đồng hành và hợp tác cùng chúng tôi trong thời gian qua. Sau khi xem xét đề xuất doanh số từ Quý Đại Lý và căn cứ vào lịch sử bán hàng <strong>tháng 08/2026</strong> và kế hoạch kinh doanh <strong>tháng 09/2026</strong> của Công ty, chúng tôi trân trọng thông báo chỉ tiêu doanh số SDIP tháng 09/2026 của Quý Đại Lý như sau:</p>
                </div>

                <!-- SubD Information Table -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; font-size: 13px;">
                    <div>
                        <span style="color: #64748b;">ĐẠI LÝ:</span> <strong id="sdipNoticeName" style="color: #0f172a; font-size: 14px;">THANH VŨ</strong>
                    </div>
                    <div>
                        <span style="color: #64748b;">MÃ SỐ ĐẠI LÝ:</span> <strong id="sdipNoticeCode" style="color: #0f172a; font-family: monospace; font-size: 14px;">66300269</strong>
                    </div>
                    <div>
                        <span style="color: #64748b;">NHÀ PHÂN PHỐI:</span> <strong id="sdipNoticeNPP" style="color: #0f172a;">TG17-CTY TNHH Lộc Lộc Tiền Giang</strong>
                    </div>
                    <div>
                        <span style="color: #64748b;">KHU VỰC:</span> <strong id="sdipNoticeArea" style="color: #008200;">South 2</strong>
                    </div>
                </div>

                <!-- 3 Big Metric Highlight Cards -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 14px; margin-bottom: 22px;">
                    <div style="background: #fffbeb; border: 2px solid #fde68a; border-radius: 12px; padding: 16px; text-align: center;">
                        <div style="font-size: 12px; font-weight: 800; color: #b45309; text-transform: uppercase; margin-bottom: 4px;">CHỈ TIÊU AA (FOCUS)</div>
                        <div id="sdipNoticeAA" style="font-size: 26px; font-weight: 900; color: #92400e; font-family: 'Outfit', sans-serif;">8.284</div>
                        <div style="font-size: 11px; font-weight: 600; color: #b45309; margin-top: 2px;">Sản Lượng (Thùng/Két)</div>
                    </div>

                    <div style="background: #faf5ff; border: 2px solid #e9d5ff; border-radius: 12px; padding: 16px; text-align: center;">
                        <div style="font-size: 12px; font-weight: 800; color: #7e22ce; text-transform: uppercase; margin-bottom: 4px;">CHỈ TIÊU BB (NORMAL)</div>
                        <div id="sdipNoticeBB" style="font-size: 26px; font-weight: 900; color: #6b21a8; font-family: 'Outfit', sans-serif;">2.886</div>
                        <div style="font-size: 11px; font-weight: 600; color: #7e22ce; margin-top: 2px;">Sản Lượng (Thùng/Két)</div>
                    </div>

                    <div style="background: linear-gradient(135deg, #013801 0%, #008200 100%); border-radius: 12px; padding: 16px; text-align: center; color: #ffffff; box-shadow: 0 4px 12px rgba(0, 130, 0, 0.25);">
                        <div style="font-size: 12px; font-weight: 800; color: #bbf7d0; text-transform: uppercase; margin-bottom: 4px;">TỔNG CHỈ TIÊU SDIP</div>
                        <div id="sdipNoticeTotal" style="font-size: 28px; font-weight: 900; color: #ffffff; font-family: 'Outfit', sans-serif;">11.170</div>
                        <div style="font-size: 11px; font-weight: 600; color: #dcfce7; margin-top: 2px;">Tổng Doanh Số (Thùng/Két)</div>
                    </div>
                </div>

                <!-- Period & Commitment -->
                <div style="background: #f1f5f9; border-radius: 8px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 20px;">
                    <div>
                        <strong style="color: #0f172a;">THỜI GIAN ÁP DỤNG:</strong>
                        <span style="color: #475569; font-weight: 600;"> Từ 01/09/2026 đến 30/09/2026</span>
                    </div>
                    <div style="color: #008200; font-weight: 700;">
                        Cùng nhau chinh phục mục tiêu!
                    </div>
                </div>

                <!-- 5 Core Values -->
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; padding: 12px 6px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 24px; text-align: center;">
                    <div style="font-size: 9px; font-weight: 800; color: #008200; text-transform: uppercase;">CUSTOMER FIRST</div>
                    <div style="font-size: 9px; font-weight: 800; color: #008200; text-transform: uppercase;">PASSION FOR QUALITY</div>
                    <div style="font-size: 9px; font-weight: 800; color: #008200; text-transform: uppercase;">BRAND BUILDING</div>
                    <div style="font-size: 9px; font-weight: 800; color: #008200; text-transform: uppercase;">WIN TOGETHER</div>
                    <div style="font-size: 9px; font-weight: 800; color: #008200; text-transform: uppercase;">ENJOY RESPONSIBLY</div>
                </div>

                <!-- Footer Sign-off -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #475569;">
                    <div style="max-width: 380px; line-height: 1.5;">
                        <p style="margin-bottom: 4px;"><strong>MỌI THÔNG TIN HỖ TRỢ:</strong> Vui lòng liên hệ nhân viên phụ trách địa bàn (SR/SS).</p>
                        <p>Trân trọng cảm ơn sự hợp tác và cam kết của Quý Đại Lý!</p>
                        <p style="font-weight: 700; color: #008200; margin-top: 4px;">HEINEKEN Việt Nam luôn đồng hành và phát triển cùng Quý Đại Lý!</p>
                    </div>
                    <div style="text-align: center; width: 200px;">
                        <div style="font-weight: 700; color: #0f172a; margin-bottom: 40px;">ĐẠI DIỆN HEINEKEN VIỆT NAM</div>
                        <div style="font-size: 11px; color: #94a3b8; font-style: italic;">(Ký và ghi rõ họ tên)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Hidden Zalo Card for html2canvas Capture -->
    <div id="zaloCaptureCard">
        <div style="background: linear-gradient(135deg, #013801 0%, #008200 100%); color: #ffffff; padding: 22px; text-align: center;">
            <div style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">HEINEKEN VIỆT NAM</div>
            <div style="font-size: 13px; opacity: 0.95; font-weight: 600; margin-top: 2px;">BẢN TIN TIẾN ĐỘ THÁNG ${data.metadata.report_month} (30S BRIEF)</div>
        </div>
        <div style="padding: 24px;" id="zaloCaptureBody">
            <!-- Dynamic Capture Content -->
        </div>
        <div style="background: #f8fafc; padding: 14px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Hệ thống Theo dõi Phân phối Heineken SDIP • Chúc Anh/Chị Đạt Thưởng Xuất Sắc!
        </div>
    </div>

    <!-- Hidden Full Filtered Report Card for Zalo Image Export -->
    <div id="zaloAABBReportCaptureCard"></div>

    <!-- Toast Component -->
    <div id="toast" class="toast">
        <i data-lucide="check-circle" style="color: #10b981; width: 18px; height: 18px;"></i>
        <span id="toastMsg">Đã sao chép tin nhắn Zalo thành công!</span>
    </div>

    <!-- Script Engine -->
    <script>
        const HEINEKEN_DATA = ${embeddedDataJson};

        // Application Global State
        let activeTab = 'tabOverview';
        let currentSubDList = HEINEKEN_DATA.subd_list || [];
        let allInactiveOutlets = HEINEKEN_DATA.inactive_outlets_master || [];

        // Fast hydration: map SubD Name & Area Name into inactive outlets
        const subdLookupMap = {};
        currentSubDList.forEach(s => {
            subdLookupMap[s.subd_id] = { name: s.subd_name, area: s.area_name };
        });
        allInactiveOutlets.forEach(o => {
            if (!o.subd_name && subdLookupMap[o.subd_code]) {
                o.subd_name = subdLookupMap[o.subd_code].name;
                o.area_name = subdLookupMap[o.subd_code].area;
            }
        });

        // Initialize Filter Dropdowns
        function initFilters() {
            const ssSelect = document.getElementById('filterSS');
            const srSelect = document.getElementById('filterSR');
            const nppSelect = document.getElementById('filterNPP');

            // Unique Supervisors & Reps
            const supervisors = HEINEKEN_DATA.dimension_filters?.supervisors || [];
            const reps = HEINEKEN_DATA.dimension_filters?.sales_reps || [];

            supervisors.forEach(ss => {
                const opt = document.createElement('option');
                opt.value = ss;
                opt.textContent = ss;
                ssSelect.appendChild(opt);
            });

            reps.forEach(sr => {
                const opt = document.createElement('option');
                opt.value = sr;
                opt.textContent = sr;
                srSelect.appendChild(opt);
            });

            // Populate NPP list dynamically from SubD data
            if (nppSelect) {
                const nppCounts = {};
                (HEINEKEN_DATA.subd_list || []).forEach(s => {
                    const npp = s.npp_code || 'Khác';
                    nppCounts[npp] = (nppCounts[npp] || 0) + 1;
                });
                const sortedNPPs = Object.keys(nppCounts).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
                sortedNPPs.forEach(npp => {
                    const opt = document.createElement('option');
                    opt.value = npp;
                    opt.textContent = npp + ' (' + nppCounts[npp] + ' SubD)';
                    nppSelect.appendChild(opt);
                });
            }
        }

        // On Area Change: Filter SS & SR options
        function onAreaChange() {
            const selectedArea = document.getElementById('filterArea').value;
            const ssSelect = document.getElementById('filterSS');
            const currentSS = ssSelect.value;

            // Find SS belonging to selected area
            const validSS = new Set();
            allInactiveOutlets.forEach(o => {
                if (selectedArea === 'ALL' || o.area_name === selectedArea) {
                    if (o.ss_name && o.ss_name !== 'Chưa phân bổ') validSS.add(o.ss_name);
                }
            });

            // Rebuild SS select options
            ssSelect.innerHTML = '<option value="ALL">Tất Cả</option>';
            Array.from(validSS).sort().forEach(ss => {
                const opt = document.createElement('option');
                opt.value = ss;
                opt.textContent = ss;
                if (ss === currentSS) opt.selected = true;
                ssSelect.appendChild(opt);
            });

            onSSChange();
        }

        // On SS Change: Filter SR options
        function onSSChange() {
            const selectedArea = document.getElementById('filterArea').value;
            const selectedSS = document.getElementById('filterSS').value;
            const srSelect = document.getElementById('filterSR');
            const currentSR = srSelect.value;

            const validSR = new Set();
            allInactiveOutlets.forEach(o => {
                const matchArea = (selectedArea === 'ALL' || o.area_name === selectedArea);
                const matchSS = (selectedSS === 'ALL' || o.ss_name === selectedSS);
                if (matchArea && matchSS) {
                    if (o.sr_name && o.sr_name !== 'Chưa phân bổ') validSR.add(o.sr_name);
                }
            });

            srSelect.innerHTML = '<option value="ALL">Tất Cả</option>';
            Array.from(validSR).sort().forEach(sr => {
                const opt = document.createElement('option');
                opt.value = sr;
                opt.textContent = sr;
                if (sr === currentSR) opt.selected = true;
                srSelect.appendChild(opt);
            });

            onFilterChange();
        }

        // Master Filter Dispatcher
        function onFilterChange() {
            const areaVal = document.getElementById('filterArea')?.value || 'ALL';
            const ssVal = document.getElementById('filterSS')?.value || 'ALL';
            const srVal = document.getElementById('filterSR')?.value || 'ALL';
            const nppVal = (document.getElementById('filterNPP')?.value || document.getElementById('filterSDIP')?.value || 'ALL');
            const scdVal = document.getElementById('filterSCD')?.value || 'ALL';
            const searchVal = (document.getElementById('subdSearchInput')?.value || '').toLowerCase().trim();

            // Filter SubDs
            currentSubDList = (HEINEKEN_DATA.subd_list || []).filter(s => {
                const matchArea = (areaVal === 'ALL' || s.area_name === areaVal);
                const matchSS = (ssVal === 'ALL' || s.ss_name === ssVal);
                const matchSR = (srVal === 'ALL' || s.sr_name === srVal);
                const matchNPP = (nppVal === 'ALL' || s.npp_code === nppVal || (nppVal === 'SDIP' && s.is_sdip) || (nppVal === 'NORMAL' && !s.is_sdip));
                const matchSCD = (scdVal === 'ALL' || s.scd_status === scdVal);
                const matchSearch = !searchVal || s.subd_name.toLowerCase().includes(searchVal) || s.subd_id.toLowerCase().includes(searchVal);
                return matchArea && matchSS && matchSR && matchNPP && matchSCD && matchSearch;
            });

            // Recalculate KPIs based on filtered SubDs
            updateKPIBanner();

            // Re-render active view
            if (activeTab === 'tabOverview') {
                renderAreaTable();
            } else if (activeTab === 'tabAABB') {
                renderAABBTable();
            } else if (activeTab === 'tabSubDs') {
                renderSubDCards();
            } else if (activeTab === 'tabASO') {
                renderASOTable();
            }

            document.getElementById('subdCountBadge').innerText = \`Hiển thị \${currentSubDList.length} / \${HEINEKEN_DATA.subd_list.length} SubD\`;
        }

        // Update Dynamic Top KPIs
        function updateKPIBanner() {
            let totTarget = 0, totSI = 0, totSO = 0;
            let totAATarget = 0, totAASI = 0, totBBTarget = 0, totBBSI = 0;
            let inactiveCount = 0;
            let totFill = 0, totASO = 0, totOutlets = 0, totSKU = 0;

            currentSubDList.forEach(s => {
                totTarget += s.target_total || 0;
                totSI += s.actual_si || 0;
                totSO += s.actual_so || 0;
                totAATarget += s.target_aa || 0;
                totAASI += s.actual_si_aa || 0;
                totBBTarget += s.target_bb || 0;
                totBBSI += s.actual_si_bb || 0;
                inactiveCount += s.inactive_outlets_count || 0;
                totFill += (s.fill_rate_pct || 0);
                totASO += (s.aso_active || 0);
                totOutlets += (s.aso_total || 0);
                totSKU += (s.sku_count || 0);
            });

            const achievePct = totTarget > 0 ? ((totSI / totTarget) * 100).toFixed(1) : 0;
            const soSiPct = totSI > 0 ? ((totSO / totSI) * 100).toFixed(1) : 0;
            const aaPct = totAATarget > 0 ? ((totAASI / totAATarget) * 100).toFixed(1) : 0;
            const bbPct = totBBTarget > 0 ? ((totBBSI / totBBTarget) * 100).toFixed(1) : 0;
            const avgFill = currentSubDList.length > 0 ? (totFill / currentSubDList.length).toFixed(1) : 0;
            const asoPct = totOutlets > 0 ? ((totASO / totOutlets) * 100).toFixed(1) : 0;
            const avgSKU = currentSubDList.length > 0 ? (totSKU / currentSubDList.length).toFixed(1) : 0;

            document.getElementById('kpiSI').innerText = Math.round(totSI).toLocaleString();
            document.getElementById('kpiTarget').innerText = Math.round(totTarget).toLocaleString();
            document.getElementById('kpiAchievePct').innerText = \`\${achievePct}% Target\`;

            document.getElementById('kpiSO').innerText = Math.round(totSO).toLocaleString();
            document.getElementById('kpiSoSiPct').innerText = \`\${soSiPct}%\`;

            document.getElementById('kpiAASI').innerText = Math.round(totAASI).toLocaleString();
            document.getElementById('kpiAATarget').innerText = Math.round(totAATarget).toLocaleString();
            document.getElementById('kpiAAPct').innerText = \`\${aaPct}%\`;

            document.getElementById('kpiBBSI').innerText = Math.round(totBBSI).toLocaleString();
            document.getElementById('kpiBBTarget').innerText = Math.round(totBBTarget).toLocaleString();
            document.getElementById('kpiBBPct').innerText = \`\${bbPct}%\`;

            document.getElementById('kpiInactiveOutlets').innerText = inactiveCount.toLocaleString();

            const elAvgFill = document.getElementById('kpiAvgFill');
            if (elAvgFill) elAvgFill.innerText = \`\${avgFill}%\`;
            const elAsoCov = document.getElementById('kpiAsoCoverage');
            if (elAsoCov) elAsoCov.innerHTML = \`\${totASO.toLocaleString()} <span style="font-size:14px;color:var(--text-muted);font-weight:600;">/ \${totOutlets.toLocaleString()}</span>\`;
            const elAsoFoot = document.getElementById('kpiAsoFooter');
            if (elAsoFoot) elAsoFoot.innerText = \`\${asoPct}% Active • TB \${avgSKU} SKU/SubD\`;
        }

        const tabInfoMap = {
            'tabOverview': {
                title: '1. Báo Cáo Tổng Quan Toàn Vùng (South 2 & South 9)',
                breadcrumb: '1. TỔNG QUAN VÙNG'
            },
            'tabAABB': {
                title: '2. Chi Tiết Tiến Độ Nhóm AA – BB (SDIP Focus)',
                breadcrumb: '2. BÁO CÁO NHÓM AA – BB'
            },
            'tabSubDs': {
                title: '3. Trạm Tác Chiến Mạng Lưới 103 SubD',
                breadcrumb: '3. TRẠM TÁC CHIẾN 103 SUBD'
            },
            'tabASO': {
                title: '4. Điều Tuyến Điểm Bán ASO (SS / SR / DSM)',
                breadcrumb: '4. ĐIỀU TUYẾN ASO'
            }
        };

        // Tab Switching
        function switchTab(tabId) {
            activeTab = tabId;
            document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

            const target = document.getElementById(tabId);
            if (target) target.style.display = 'block';

            const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId));
            if (activeBtn) activeBtn.classList.add('active');

            const info = tabInfoMap[tabId];
            if (info) {
                const elTitle = document.getElementById('pageTitleCurrent');
                const elBreadcrumb = document.getElementById('breadcrumbCurrent');
                if (elTitle) elTitle.innerText = info.title;
                if (elBreadcrumb) elBreadcrumb.innerText = info.breadcrumb;
            }

            if (tabId === 'tabOverview') {
                renderAreaTable();
            } else if (tabId === 'tabAABB') {
                renderAABBTable();
            } else if (tabId === 'tabSubDs') {
                renderSubDCards();
            } else if (tabId === 'tabASO') {
                renderASOTable();
            }
            lucide.createIcons();
        }

        // TAB 1: Render Area Summary Table
        function renderAreaTable() {
            const tbody = document.getElementById('areaTableBody');
            if (!tbody) return;

            const areas = ['South 2', 'South 9'];
            const rows = areas.map(areaName => {
                const subds = currentSubDList.filter(s => s.area_name === areaName);
                if (subds.length === 0) return '';

                let target = 0, si = 0, so = 0;
                let totFill = 0, totASO = 0, totOutlets = 0, totSKU = 0;
                subds.forEach(s => {
                    target += s.target_total;
                    si += s.actual_si;
                    so += s.actual_so;
                    totFill += (s.fill_rate_pct || 0);
                    totASO += (s.aso_active || 0);
                    totOutlets += (s.aso_total || 0);
                    totSKU += (s.sku_count || 0);
                });

                const pctSI = target > 0 ? ((si / target) * 100).toFixed(1) : 0;
                const soSi = si > 0 ? ((so / si) * 100).toFixed(1) : 0;
                const avgFill = subds.length > 0 ? (totFill / subds.length).toFixed(1) : 0;
                const asoPct = totOutlets > 0 ? ((totASO / totOutlets) * 100).toFixed(1) : 0;
                const avgSKU = subds.length > 0 ? (totSKU / subds.length).toFixed(1) : 0;

                return \`
                    <tr>
                        <td style="font-weight: 800; color: var(--hnk-green);"><i data-lucide="map-pin" style="width:14px;height:14px;display:inline;"></i> \${areaName}</td>
                        <td style="text-align: right; font-weight: 700;">\${subds.length}</td>
                        <td style="text-align: right;">\${Math.round(target).toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 800; color: var(--hnk-green);">\${Math.round(si).toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 700;">\${pctSI}%</td>
                        <td style="text-align: right; font-weight: 800; color: var(--tiger-blue);">\${Math.round(so).toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 700;">\${soSi}%</td>
                        <td style="text-align: right; font-weight: 800; color: \${avgFill >= 90 ? 'var(--hnk-green)' : 'var(--hnk-amber)'};">\${avgFill}%</td>
                        <td style="text-align: right; font-weight: 700; color: var(--tiger-blue);">\${totASO.toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 600;">\${totOutlets.toLocaleString()}</td>
                        <td style="text-align: right; font-weight: 800; color: \${asoPct >= 90 ? 'var(--hnk-green)' : 'var(--hnk-amber)'};">\${asoPct}%</td>
                        <td style="text-align: right; font-weight: 700;">\${avgSKU}</td>
                    </tr>
                \`;
            }).join('');

            tbody.innerHTML = rows;
            lucide.createIcons();
        }

        
        // TAB 2: Render AA-BB Table
        function renderAABBTable() {
            const tbody = document.getElementById('aabbTableBody');
            if (!tbody) return;

            const nppVal = (document.getElementById('filterNPP')?.value || 'ALL');
            let sdipList = currentSubDList.filter(s => s.is_sdip);
            if (nppVal !== 'ALL') {
                sdipList = currentSubDList;
            }

            if (sdipList.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">Không tìm thấy SubD nào phù hợp với bộ lọc hiện tại.</td></tr>';
                return;
            }

            tbody.innerHTML = sdipList.map((s, idx) => {
                const isAAPass = (s.target_aa_pct || 0) >= 100;
                const isBBPass = (s.target_bb_pct || 0) >= 100;
                const areaShort = s.area_name === 'South 2' ? 'S2' : (s.area_name === 'South 9' ? 'S9' : s.area_name);
                const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

                return \`
                    <tr style="border-bottom: 1px solid var(--border-color); background: \${rowBg};">
                        <td style="font-weight: 700; color: var(--text-muted); vertical-align: middle; text-align: center; white-space: nowrap; padding: 12px 10px;">\${s.subd_id}</td>
                        <td style="font-weight: 800; vertical-align: middle; white-space: nowrap; padding: 12px 14px; font-size: 13.5px;">\${s.subd_name}</td>
                        <td style="text-align: center; vertical-align: middle; white-space: nowrap; padding: 12px 10px;">
                            <span class="badge-pill badge-area" style="white-space: nowrap; font-weight: 800;" title="\${s.area_name}">\${areaShort}</span>
                        </td>
                        <td style="text-align: center; vertical-align: middle; white-space: nowrap; padding: 12px 10px;">
                            <span class="badge-pill" style="background: #f1f5f9; color: #0f172a; font-weight: 800; border: 1px solid #cbd5e1; white-space: nowrap;">\${s.npp_code || 'N/A'}</span>
                        </td>
                        <td style="font-weight: 700; color: #1e293b; vertical-align: middle; white-space: nowrap; padding: 12px 12px; font-size: 12.5px;">\${s.ss_name || 'N/A'}</td>
                        <td style="text-align: center; vertical-align: middle; padding: 8px 8px;">
                            <div style="display: flex; flex-direction: column; gap: 5px; align-items: center;">
                                <span class="badge-pill" style="background:#fef3c7; color:#92400e; font-weight:800; width:34px; text-align:center;">AA</span>
                                <span class="badge-pill" style="background:#f3e8ff; color:#6b21a8; font-weight:800; width:34px; text-align:center;">BB</span>
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle; white-space: nowrap; padding: 8px 14px;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <div style="font-weight: 600; line-height: 20px;">\${(s.target_aa || 0).toLocaleString()}</div>
                                <div style="font-weight: 600; line-height: 20px; color: var(--text-muted);">\${(s.target_bb || 0).toLocaleString()}</div>
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle; white-space: nowrap; padding: 8px 14px;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <div style="font-weight: 800; line-height: 20px; color: var(--hnk-amber);">\${(s.actual_si_aa || 0).toLocaleString()}</div>
                                <div style="font-weight: 800; line-height: 20px; color: #8b5cf6;">\${(s.actual_si_bb || 0).toLocaleString()}</div>
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle; white-space: nowrap; padding: 8px 14px;">
                            <div style="display: flex; flex-direction: column; gap: 5px;">
                                <div style="font-weight: 800; line-height: 20px; color: \${isAAPass ? 'var(--hnk-green)' : 'var(--hnk-red)'};">\${s.target_aa_pct || 0}%</div>
                                <div style="font-weight: 800; line-height: 20px; color: \${isBBPass ? 'var(--hnk-green)' : 'var(--hnk-red)'};">\${s.target_bb_pct || 0}%</div>
                            </div>
                        </td>
                        <td style="text-align: center; vertical-align: middle; white-space: nowrap; padding: 12px 10px;">
                            <div style="display: flex; gap: 6px; justify-content: center;">
                                <button class="btn-action btn-copy" style="padding: 5px 10px; font-size: 11px;" onclick="copyZaloMessage('\${s.subd_id}')" title="Copy tiến độ Zalo">
                                    <i data-lucide="copy" style="width:12px;height:12px;"></i> Copy Zalo
                                </button>
                                <button class="btn-action" style="padding: 5px 10px; font-size: 11px; background: #e8f5e9; color: #008200; border-color: #a7f3d0;" onclick="openSdipNoticeModal('\${s.subd_id}')" title="Xem & Xuất Thư Báo Chỉ Tiêu SDIP">
                                    <i data-lucide="file-text" style="width:12px;height:12px;"></i> Thư Báo
                                </button>
                            </div>
                        </td>
                    </tr>
                \`;
            }).join('');

            lucide.createIcons();
        }


        // HELPER: Generate SVG Beer Bottle (Heineken Silver Sleek Translucent Bottle)
        function getBeerBottleSVG(pct, isAA, actual, target, uid) {
            var p = Math.min(100, Math.max(0, parseFloat(pct) || 0));
            var isOverflow = (parseFloat(pct) || 0) >= 100;
            
            // Liquid calculation:
            // Cylinder body: y=72 to y=154 (82px)
            // Shoulder: y=48 to y=72 (24px)
            // 0% = y=156, 100% = y=50. Total fill range = 106px
            var liquidHeight = (p / 100) * 106;
            var liquidY = 156 - liquidHeight;

            var gradId = 'liquidGrad_' + uid;
            var clipId = 'bottleInnerClip_' + uid;
            var sheenId = 'silverSheen_' + uid;
            var glareId = 'glassGlare_' + uid;

            // Liquid colors: Emerald Green for AA, Golden Amber for BB
            var colStart = isAA ? '#006622' : '#b45309';
            var colMid = isAA ? '#00a83e' : '#f59e0b';
            var colEnd = isAA ? '#004718' : '#92400e';

            // Bottle contour path (Heineken Silver Sleek Alu Bottle matching reference image)
            var bottlePath = "M 22,5 " +
                             "L 38,5 " +
                             "Q 39,5 39,8 L 39,12 " +
                             "L 38,48 " +
                             "Q 38,58 48,68 Q 52,72 52,78 " +
                             "L 52,154 " +
                             "Q 52,160 46,160 " +
                             "L 14,160 " +
                             "Q 8,160 8,154 " +
                             "L 8,78 " +
                             "Q 8,72 12,68 Q 22,58 22,48 " +
                             "L 21,12 " +
                             "L 21,8 Q 21,5 22,5 Z";

            // Overflow bubbles if >= 100%
            var bubbles = '';
            if (isOverflow) {
                bubbles = 
                    '<circle cx="26" cy="20" r="3.2" fill="#ffffff" stroke="#fef08a" stroke-width="0.6"/>' +
                    '<circle cx="34" cy="23" r="4.2" fill="#ffffff" stroke="#fef08a" stroke-width="0.6"/>' +
                    '<circle cx="29" cy="15" r="2.5" fill="#ffffff" stroke="#fef08a" stroke-width="0.6"/>' +
                    '<circle cx="22" cy="26" r="2.2" fill="#ffffff" stroke="#fef08a" stroke-width="0.5"/>';
            }

            // Dynamic foam radius based on height in bottle
            var foamRx = 19;
            if (liquidY < 72) {
                foamRx = Math.max(8, 8 + (liquidY - 48) * 0.45);
            }

            return '<svg viewBox="0 0 60 165" width="100%" height="100%" style="overflow:visible; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.06));">' +
                '<defs>' +
                    // Liquid Gradient with rich translucency
                    '<linearGradient id="' + gradId + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
                        '<stop offset="0%" stop-color="' + colStart + '" stop-opacity="0.92"/>' +
                        '<stop offset="45%" stop-color="' + colMid + '" stop-opacity="0.88"/>' +
                        '<stop offset="100%" stop-color="' + colEnd + '" stop-opacity="0.95"/>' +
                    '</linearGradient>' +
                    // Translucent Silver metallic sheen
                    '<linearGradient id="' + sheenId + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
                        '<stop offset="0%" stop-color="#cbd5e1" stop-opacity="0.32"/>' +
                        '<stop offset="25%" stop-color="#ffffff" stop-opacity="0.55"/>' +
                        '<stop offset="50%" stop-color="#e2e8f0" stop-opacity="0.22"/>' +
                        '<stop offset="80%" stop-color="#ffffff" stop-opacity="0.5"/>' +
                        '<stop offset="100%" stop-color="#94a3b8" stop-opacity="0.35"/>' +
                    '</linearGradient>' +
                    // Glass high-gloss glare
                    '<linearGradient id="' + glareId + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
                        '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>' +
                        '<stop offset="60%" stop-color="#ffffff" stop-opacity="0.15"/>' +
                        '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
                    '</linearGradient>' +
                    // Clip Path for bottle interior
                    '<clipPath id="' + clipId + '">' +
                        '<path d="' + bottlePath + '"/>' +
                    '</clipPath>' +
                '</defs>' +

                // 1. BASE: Translucent Silver Bottle Silhouette (You can see through it!)
                '<path d="' + bottlePath + '" fill="url(#' + sheenId + ')" stroke="#94a3b8" stroke-width="1.2"/>' +

                // 2. LIQUID LAYER (INSIDE BOTTLE VIA CLIP-PATH)
                '<g clip-path="url(#' + clipId + ')">' +
                    // Rising Beer Liquid
                    '<rect x="0" y="' + liquidY + '" width="60" height="' + (165 - liquidY) + '" fill="url(#' + gradId + ')"/>' +
                    // Rising micro-bubbles inside beer
                    '<circle cx="18" cy="' + (liquidY + 22) + '" r="1" fill="#ffffff" opacity="0.65"/>' +
                    '<circle cx="34" cy="' + (liquidY + 36) + '" r="1.4" fill="#ffffff" opacity="0.55"/>' +
                    '<circle cx="26" cy="' + (liquidY + 58) + '" r="1.1" fill="#ffffff" opacity="0.6"/>' +
                    '<circle cx="42" cy="' + (liquidY + 16) + '" r="0.8" fill="#ffffff" opacity="0.7"/>' +
                    // Foam Head on top of beer liquid (Mực bia)
                    '<ellipse cx="30" cy="' + liquidY + '" rx="' + foamRx + '" ry="3.6" fill="#fef08a" opacity="0.95"/>' +
                    '<ellipse cx="30" cy="' + (liquidY - 1) + '" rx="' + (foamRx * 0.88) + '" ry="2.4" fill="#ffffff"/>' +
                '</g>' +

                bubbles +

                // 3. ICONIC BRANDING & DESIGN DETAILS (LAYERED ON TOP SO ALWAYS VISIBLE!)
                // A. Sleek Crown Cap at top
                '<rect x="21" y="2" width="18" height="5" rx="1.5" fill="#e2e8f0" stroke="#64748b" stroke-width="0.8"/>' +
                '<line x1="22" y1="4.5" x2="38" y2="4.5" stroke="#94a3b8" stroke-width="0.8"/>' +
                '<line x1="22" y1="12" x2="38" y2="12" stroke="#cbd5e1" stroke-width="1"/>' +

                // B. Vertical "Heineken" wordmark + Red Star on Neck (Reference Image)
                '<polygon points="30,16 31.2,19.2 34.5,19.2 31.8,21 32.8,24 30,22.2 27.2,24 28.2,21 25.5,19.2 28.8,19.2" fill="#dc2626"/>' +
                '<text x="30" y="38" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="4.8" font-weight="900" fill="#008200" letter-spacing="0.7" transform="rotate(-90 30 38)">HEINEKEN</text>' +

                // C. Fireworks / Starburst lines on Shoulder
                '<path d="M 21,55 Q 30,50 39,55" fill="none" stroke="#38bdf8" stroke-width="0.8" opacity="0.85"/>' +
                '<line x1="16" y1="62" x2="21" y2="58" stroke="#38bdf8" stroke-width="0.7" opacity="0.8"/>' +
                '<line x1="44" y1="62" x2="39" y2="58" stroke="#38bdf8" stroke-width="0.7" opacity="0.8"/>' +

                // D. CENTERPIECE: Iconic Heineken RED STAR (★) with Halo
                // Cyan fireworks orbit ring
                '<circle cx="30" cy="84" r="14" fill="none" stroke="#38bdf8" stroke-width="1.1" stroke-dasharray="2,2" opacity="0.9"/>' +
                // Translucent white contrast disc (makes star pop whether filled with beer or empty!)
                '<circle cx="30" cy="84" r="10.5" fill="rgba(255,255,255,0.88)" stroke="#ffffff" stroke-width="0.5"/>' +
                // 5-Point Heineken Red Star
                '<polygon points="30,74 32.8,81 40.2,81 34.3,85.2 36.5,92.2 30,88.2 23.5,92.2 25.7,85.2 19.8,81 27.2,81" ' +
                    'fill="#dc2626" stroke="#ffffff" stroke-width="0.7" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.25));"/>' +
                // 3D Facet highlight
                '<polygon points="30,74 30,88.2 32.8,81" fill="#b91c1c" opacity="0.6"/>' +
                '<polygon points="30,88.2 23.5,92.2 25.7,85.2" fill="#ef4444" opacity="0.5"/>' +

                // E. Bold Green "inek" / Heineken across body
                '<text x="30" y="112" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="11" font-weight="900" fill="#008200" stroke="#ffffff" stroke-width="0.6" style="paint-order:stroke fill; letter-spacing:0.5px;">inek</text>' +

                // F. Sub-Brand Banner: SILVER • AA or NORMAL • BB
                '<rect x="13" y="120" width="34" height="12" rx="2.5" fill="rgba(255,255,255,0.92)" stroke="' + (isAA ? '#008200' : '#b45309') + '" stroke-width="1"/>' +
                '<text x="30" y="128.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" font-weight="900" fill="' + (isAA ? '#006622' : '#92400e') + '" letter-spacing="0.4">' + (isAA ? 'SILVER • AA' : 'NORMAL • BB') + '</text>' +

                // G. Sparkle icons and Percentage at base
                '<text x="17" y="145" font-size="5.5" fill="#38bdf8">❄</text>' +
                '<text x="30" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="' + (isAA ? '#008200' : '#b45309') + '">' + pct + '%</text>' +
                '<text x="41" y="145" font-size="5.5" fill="#38bdf8">❄</text>' +

                // 4. GLASS SPECULAR GLARE (Running down the sides for realistic bottle feel)
                '<path d="M 12,74 L 12,152" stroke="url(#' + glareId + ')" stroke-width="2.5" stroke-linecap="round"/>' +
                '<path d="M 48,74 L 48,152" stroke="url(#' + glareId + ')" stroke-width="1.2" stroke-linecap="round"/>' +

                // 5. OUTER BOTTLE RIM
                '<path d="' + bottlePath + '" fill="none" stroke="#475569" stroke-width="1.3" stroke-linejoin="round"/>' +
            '</svg>';
        }

        // HELPER: Toggle SKU 3-Color Chart
        function toggleSkuChart(uid) {
            var el = document.getElementById('skuChart_' + uid);
            var btn = document.getElementById('btnToggleSkuChart_' + uid);
            if (!el) return;
            if (el.classList.contains('open')) {
                el.classList.remove('open');
                if (btn) btn.innerHTML = '📈 Xem Biểu Đồ 3 Màu ▾';
            } else {
                el.classList.add('open');
                if (btn) btn.innerHTML = '✕ Thu Gọn Biểu Đồ ▴';
            }
        }

        // HELPER: Generate SKU Horizontal Matrix (Compact with Toggle Link & Remaining SI/SO)
        function getSkuHorizontalMatrix(skuPerf, uid, defaultOpen) {
            if (!skuPerf) return '';
            var safeUid = uid ? String(uid).replace(/[^a-zA-Z0-9_-]/g, '_') : ('sku_' + Math.random().toString(36).substr(2, 6));
            var isOpen = !!defaultOpen;

            var skus = [
                { key: 'hs2', label: 'HS2', name: 'Heineken Silver 250', badgeClass: 'bg-hs2', siClass: 'si-hs2', soClass: 'so-hs2', textColor: '#008200' },
                { key: 'ts25', label: 'TS25', name: 'Tiger Crystal 250', badgeClass: 'bg-ts25', siClass: 'si-ts25', soClass: 'so-ts25', textColor: '#0284c7' },
                { key: 'lmc', label: 'LMC', name: 'Larue Smooth Can', badgeClass: 'bg-lmc', siClass: 'si-lmc', soClass: 'so-lmc', textColor: '#ea580c' },
                { key: 'others', label: 'Khác', name: 'Các Dòng Sản Phẩm Khác', badgeClass: 'bg-others', siClass: 'si-others', soClass: 'so-others', textColor: '#7c3aed' }
            ];

            var barsHtml = '';
            var rowsHtml = '';
            var totT = 0, totSI = 0, totSO = 0, totRemSI = 0, totRemSO = 0;

            for (var i = 0; i < skus.length; i++) {
                var item = skus[i];
                var p = skuPerf[item.key] || { target: 0, si: 0, so: 0, pct_si: 0, pct_so_si: 0 };
                var t = Math.round(p.target || 0);
                var si = Math.round(p.si || 0);
                var so = Math.round(p.so || 0);
                
                var remSI = Math.max(0, t - si);
                var remSO = Math.max(0, t - so);
                
                totT += t;
                totSI += si;
                totSO += so;
                totRemSI += remSI;
                totRemSO += remSO;

                var pctSI = t > 0 ? (si / t * 100) : 0;
                var pctSO = t > 0 ? (so / t * 100) : 0;
                var fillWidthSI = Math.min(100, Math.max(0, pctSI));
                var fillWidthSO = Math.min(100, Math.max(0, pctSO));

                // 3-Color Dual Bar: Track (Transparent with border), Sell-In (Light tone), Sell-Out (Dark tone)
                barsHtml += '<div class="sku-bar-row">' +
                    '<div class="sku-meta-flex">' +
                        '<div style="display:flex; align-items:center; gap:5px;">' +
                            '<span class="sku-badge ' + item.badgeClass + '">' + item.label + '</span>' +
                            '<span style="font-size: 11px; font-weight: 700; color: #1e293b;">' + item.name + '</span>' +
                        '</div>' +
                        '<div style="font-size: 10.5px; font-weight: 700; color: #475569;">' +
                            'SI: <span style="color:' + item.textColor + ';">' + si.toLocaleString() + '</span> | ' +
                            'SO: <span style="color:var(--tiger-blue);">' + so.toLocaleString() + '</span> / ' +
                            'T: ' + t.toLocaleString() + ' th' +
                        '</div>' +
                    '</div>' +
                    '<div class="sku-target-track" title="Chỉ tiêu: ' + t.toLocaleString() + ' th | Sell-In: ' + si.toLocaleString() + ' th (' + pctSI.toFixed(1) + '%) | Sell-Out: ' + so.toLocaleString() + ' th (' + pctSO.toFixed(1) + '%)">' +
                        '<div class="sku-fill-si ' + item.siClass + '" style="width: ' + fillWidthSI + '%;"></div>' +
                        '<div class="sku-fill-so ' + item.soClass + '" style="width: ' + fillWidthSO + '%;"></div>' +
                    '</div>' +
                '</div>';

                // Table row with Còn Lại SI and Còn Lại SO
                var remSiText = remSI > 0 ? remSI.toLocaleString() : '<span class="val-done">✓ 0</span>';
                var remSoText = remSO > 0 ? remSO.toLocaleString() : '<span class="val-done">✓ 0</span>';

                rowsHtml += '<tr>' +
                    '<td><span class="sku-badge ' + item.badgeClass + '" style="font-size:9.5px;padding:1px 5px;">' + item.label + '</span></td>' +
                    '<td>' + t.toLocaleString() + '</td>' +
                    '<td style="color:' + item.textColor + '; font-weight:700;">' + si.toLocaleString() + '</td>' +
                    '<td class="' + (remSI > 0 ? 'val-rem-si' : '') + '">' + remSiText + '</td>' +
                    '<td style="color:' + item.textColor + '; font-weight:800;">' + (t > 0 ? pctSI.toFixed(1) + '%' : '-') + '</td>' +
                    '<td style="color:var(--tiger-blue); font-weight:700;">' + so.toLocaleString() + '</td>' +
                    '<td class="' + (remSO > 0 ? 'val-rem-so' : '') + '">' + remSoText + '</td>' +
                    '<td style="font-weight:700;">' + (si > 0 ? (so / si * 100).toFixed(1) + '%' : '-') + '</td>' +
                '</tr>';
            }

            var totPctSI = totT > 0 ? (totSI / totT * 100).toFixed(1) : 0;
            var totPctSO = totSI > 0 ? (totSO / totSI * 100).toFixed(1) : 0;
            var totRemSiText = totRemSI > 0 ? totRemSI.toLocaleString() : '<span class="val-done">✓ 0</span>';
            var totRemSoText = totRemSO > 0 ? totRemSO.toLocaleString() : '<span class="val-done">✓ 0</span>';

            return '<div class="sku-matrix-container">' +
                // Header with Compact Link
                '<div class="sku-matrix-header">' +
                    '<span class="sku-matrix-title">📊 Tiến Độ 3 SKU & Khác</span>' +
                    '<a class="sku-chart-toggle-link" id="btnToggleSkuChart_' + safeUid + '" data-subd="' + safeUid + '" onclick="toggleSkuChart(this.dataset.subd)">' +
                        (isOpen ? '✕ Thu Gọn Biểu Đồ ▴' : '📈 Xem Biểu Đồ 3 Màu ▾') +
                    '</a>' +
                '</div>' +

                // Collapsible 3-Color Chart Section (Left-aligned & compact)
                '<div class="sku-chart-collapsible ' + (isOpen ? 'open' : '') + '" id="skuChart_' + safeUid + '">' +
                    // Left-aligned 3-color legend
                    '<div class="sku-legend-row">' +
                        '<div class="legend-item"><div class="legend-box leg-target"></div><span>Chỉ tiêu: Trong suốt viền</span></div>' +
                        '<div class="legend-item"><div class="legend-box leg-si"></div><span>Thực đạt Sell-In: Xanh nhạt</span></div>' +
                        '<div class="legend-item"><div class="legend-box leg-so"></div><span>Thực đạt Sell-Out: Màu đậm</span></div>' +
                    '</div>' +
                    '<div class="sku-bars-wrap">' + barsHtml + '</div>' +
                '</div>' +

                // Extended Mini Table with Còn Lại SI and Còn Lại SO
                '<div style="overflow-x: auto;">' +
                    '<table class="sku-mini-table">' +
                        '<thead>' +
                            '<tr>' +
                                '<th style="text-align:left;">SKU</th>' +
                                '<th>Target</th>' +
                                '<th>Sell-In</th>' +
                                '<th style="color:#dc2626;" title="Số lượng thùng còn thiếu để đạt Target Sell-In">Còn lại SI</th>' +
                                '<th>% Đạt</th>' +
                                '<th>Sell-Out</th>' +
                                '<th style="color:#d97706;" title="Số lượng thùng còn thiếu để đạt Target Sell-Out">Còn lại SO</th>' +
                                '<th>SO/SI</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            rowsHtml +
                            '<tr class="total-row">' +
                                '<td style="text-align:left;">TỔNG</td>' +
                                '<td>' + totT.toLocaleString() + '</td>' +
                                '<td style="color:var(--hnk-green); font-weight:900;">' + totSI.toLocaleString() + '</td>' +
                                '<td class="' + (totRemSI > 0 ? 'val-rem-si' : '') + '" style="font-weight:900;">' + totRemSiText + '</td>' +
                                '<td style="color:var(--hnk-green); font-weight:900;">' + totPctSI + '%</td>' +
                                '<td style="color:var(--tiger-blue); font-weight:900;">' + totSO.toLocaleString() + '</td>' +
                                '<td class="' + (totRemSO > 0 ? 'val-rem-so' : '') + '" style="font-weight:900;">' + totRemSoText + '</td>' +
                                '<td style="font-weight:900;">' + totPctSO + '%</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
                '</div>' +
            '</div>';
        }

        // TAB 3: Render SubD Cards
        function renderSubDCards() {
            const grid = document.getElementById('subdCardsContainer');
            if (!grid) return;

            if (currentSubDList.length === 0) {
                grid.innerHTML = \`<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted); background: #ffffff; border-radius: var(--radius-lg);">
                    <i data-lucide="store" style="width: 48px; height: 48px; margin: 0 auto 12px; opacity: 0.3;"></i>
                    <p style="font-size: 16px; font-weight: 700;">Không có SubD nào thỏa mãn bộ lọc hiện tại</p>
                </div>\`;
                lucide.createIcons();
                return;
            }

            grid.innerHTML = currentSubDList.map(s => {
                const scdClass = s.scd_status === 'RED_HIGH' ? 'scd-red' : (s.scd_status === 'YELLOW_LOW' ? 'scd-yellow' : 'scd-green');
                const scdText = s.scd_status === 'RED_HIGH' ? '🔴 Tồn Cao (>7d)' : (s.scd_status === 'YELLOW_LOW' ? '🟡 Tồn Thấp (<3d)' : '🟢 An Toàn');

                return \`
                    <div class="subd-card">
                        <div>
                            <div class="subd-header">
                                <div>
                                    <div class="subd-name">\${s.subd_name}</div>
                                    <div class="subd-meta">
                                        <span>ID: \${s.subd_id}</span>
                                        <span class="badge-pill badge-area" style="white-space: nowrap; font-weight: 800;">\${s.area_name === 'South 2' ? 'S2' : (s.area_name === 'South 9' ? 'S9' : s.area_name)}</span>
                                        <span class="badge-pill" style="background: #f1f5f9; color: #0f172a; font-weight: 800; border: 1px solid #cbd5e1; white-space: nowrap;">NPP: \${s.npp_code || 'N/A'}</span>
                                        \${s.is_sdip ? '<span class="badge-pill badge-sdip">SDIP ⭐</span>' : ''}
                                        \${s.ss_name ? \`<span class="badge-pill badge-rep" style="white-space: nowrap;">SS: \${s.ss_name}</span>\` : ''}
                                    </div>
                                </div>
                                <div>
                                    <span class="scd-pill \${scdClass}">\${s.scd}d</span>
                                </div>
                            </div>

                            <div class="subd-body">
                                <!-- Progress Bar: Target Total -->
                                <div class="progress-group" style="margin-bottom: 12px;">
                                    <div class="progress-row" style="margin-bottom: 0;">
                                        <div class="progress-label-flex">
                                            <span>Tiến Độ Target Tổng Sell-In</span>
                                            <span style="color: \${s.target_achieve_pct >= 100 ? 'var(--hnk-green)' : (s.target_achieve_pct >= 50 ? 'var(--hnk-amber)' : 'var(--hnk-red)')}">
                                                \${s.target_achieve_pct}%
                                            </span>
                                        </div>
                                        <div class="progress-track">
                                            <div class="progress-fill progress-green" style="width: \${Math.min(s.target_achieve_pct, 100)}%;"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 1. BEER BOTTLES ROW: AA vs BB (Mực bia theo % Actual) -->
                                \${s.is_sdip ? \`
                                <div class="bottles-row">
                                    <div class="bottle-item">
                                        <div class="bottle-svg-wrap">
                                            \${getBeerBottleSVG(s.target_aa_pct, true, s.actual_si_aa, s.target_aa, s.subd_id + '_aa')}
                                        </div>
                                        <div class="bottle-info-col">
                                            <span class="bottle-badge-lbl badge-lbl-aa">Focus AA</span>
                                            <div class="bottle-pct-num pct-num-aa">\${s.target_aa_pct}%</div>
                                            <div class="bottle-stat-details">
                                                Đạt: <strong>\${(s.actual_si_aa || 0).toLocaleString()}</strong> th<br>
                                                Mục tiêu: <strong>\${(s.target_aa || 0).toLocaleString()}</strong> th
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bottle-item">
                                        <div class="bottle-svg-wrap">
                                            \${getBeerBottleSVG(s.target_bb_pct, false, s.actual_si_bb, s.target_bb, s.subd_id + '_bb')}
                                        </div>
                                        <div class="bottle-info-col">
                                            <span class="bottle-badge-lbl badge-lbl-bb">Normal BB</span>
                                            <div class="bottle-pct-num pct-num-bb">\${s.target_bb_pct}%</div>
                                            <div class="bottle-stat-details">
                                                Đạt: <strong>\${(s.actual_si_bb || 0).toLocaleString()}</strong> th<br>
                                                Mục tiêu: <strong>\${(s.target_bb || 0).toLocaleString()}</strong> th
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                \` : ''}

                                <!-- 2. HORIZONTAL SKU MATRIX: HS2, TS25, LMC, Others -->
                                \${getSkuHorizontalMatrix(s.sku_performance, s.subd_id, false)}

                                <!-- Key Metrics Matrix: 2x2 Grid -->
                                <div class="subd-stats-grid">
                                    <div class="stat-card-box">
                                        <div class="stat-item-title">
                                            <i data-lucide="trending-up" style="width:12px;height:12px;color:var(--hnk-green);"></i> Sell-In / Target
                                        </div>
                                        <div class="stat-item-value">
                                            \${s.actual_si.toLocaleString()} <span class="stat-item-sub">/ \${s.target_total.toLocaleString()}</span>
                                        </div>
                                        <div class="stat-item-foot" style="color: \${s.target_achieve_pct >= 100 ? 'var(--hnk-green)' : (s.target_achieve_pct >= 50 ? 'var(--hnk-amber)' : 'var(--hnk-red)')};">
                                            Đạt \${s.target_achieve_pct}%
                                        </div>
                                    </div>

                                    <div class="stat-card-box">
                                        <div class="stat-item-title">
                                            <i data-lucide="shopping-bag" style="width:12px;height:12px;color:var(--tiger-blue);"></i> Sell-Out (SO/SI)
                                        </div>
                                        <div class="stat-item-value text-blue">
                                            \${s.actual_so.toLocaleString()} <span class="stat-item-sub">th</span>
                                        </div>
                                        <div class="stat-item-foot text-blue">
                                            SO/SI: <strong>\${s.so_vs_si_pct}%</strong>
                                        </div>
                                    </div>

                                    <div class="stat-card-box">
                                        <div class="stat-item-title">
                                            <i data-lucide="zap" style="width:12px;height:12px;color:\${s.fill_rate_pct >= 95 ? 'var(--hnk-green)' : (s.fill_rate_pct >= 85 ? 'var(--hnk-amber)' : 'var(--hnk-red)')};"></i> Fill Rate 24h
                                        </div>
                                        <div class="stat-item-value" style="color: \${s.fill_rate_pct >= 95 ? 'var(--hnk-green)' : (s.fill_rate_pct >= 85 ? 'var(--hnk-amber)' : 'var(--hnk-red)')};">
                                            \${s.fill_rate_pct}%
                                        </div>
                                        <div class="stat-item-foot" style="color: var(--text-muted); font-size: 10px;">
                                            \${s.fill_rate_pct >= 95 ? '🟢 Duyệt chuẩn' : (s.fill_rate_pct >= 85 ? '🟡 Cần cải thiện' : '🔴 Trễ hạn đơn')}
                                        </div>
                                    </div>

                                    <div class="stat-card-box">
                                        <div class="stat-item-title">
                                            <i data-lucide="store" style="width:12px;height:12px;color:var(--tiger-blue);"></i> ASO / Điểm Bán
                                        </div>
                                        <div class="stat-item-value" style="color: #0f172a;">
                                            \${s.aso_active} <span class="stat-item-sub">/ \${s.aso_total}</span>
                                        </div>
                                        <div class="stat-item-foot" style="color: \${s.aso_pct >= 90 ? 'var(--hnk-green)' : 'var(--hnk-amber)'};">
                                            Phủ: <strong>\${s.aso_pct}%</strong> Active
                                        </div>
                                    </div>
                                </div>

                                <!-- Status & Outlets Alert -->
                                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; padding: 7px 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span style="color: var(--text-muted); font-weight: 600;">Tồn kho:</span>
                                        <span class="scd-pill \${scdClass}" style="padding: 2px 7px; font-size: 10.5px;">\${scdText}</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span class="badge-pill" style="background: #eff6ff; color: #1d4ed8; font-weight: 800; border: 1px solid #bfdbfe; font-size: 11px; padding: 2px 7px;" title="Số lượng mã SKU đại lý phân phối">
                                            <i data-lucide="layers" style="width: 11px; height: 11px; display: inline-block; vertical-align: -1px;"></i> \${s.sku_count} SKU
                                        </span>
                                    </div>
                                    <div>
                                        <span style="color: var(--text-muted); font-weight: 600;">Chưa mua:</span>
                                        <strong style="color: \${s.inactive_outlets_count > 0 ? 'var(--hnk-red)' : 'var(--hnk-green)'}; font-size: 12px; font-weight: 800;">\${s.inactive_outlets_count}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="subd-footer">
                            <button class="btn-action btn-copy" onclick="copyZaloMessage('\${s.subd_id}')" title="Copy tin nhắn Zalo gửi SubD">
                                <i data-lucide="copy" style="width:13px;height:13px;"></i> Copy Zalo
                            </button>
                            \${s.is_sdip || s.target_aa_revised ? \`
                            <button class="btn-action" style="background: #e8f5e9; color: #008200; border-color: #a7f3d0;" onclick="openSdipNoticeModal('\${s.subd_id}')" title="Xem Thư Báo Chỉ Tiêu SDIP">
                                <i data-lucide="file-text" style="width:13px;height:13px;"></i> Thư Báo
                            </button>
                            \` : ''}
                            <button class="btn-action btn-zalo" onclick="exportZaloCard('\${s.subd_id}')" title="Xuất thẻ ảnh 30s gửi Zalo">
                                <i data-lucide="image" style="width:13px;height:13px;"></i> Thẻ Ảnh 30s
                            </button>
                            <button class="btn-action" onclick="openSubDDetails('\${s.subd_id}')" title="Xem chi tiết SKU & Điểm bán">
                                <i data-lucide="eye" style="width:13px;height:13px;"></i> Chi Tiết
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');

            lucide.createIcons();
        }

        let currentASOWarnFilter = 'ALL';

        function filterASOWarning(filterType) {
            currentASOWarnFilter = filterType;
            document.querySelectorAll('.filter-warn-btn').forEach(btn => btn.classList.remove('active'));
            if (filterType === 'ALL') {
                const b = document.getElementById('btnWarnAll');
                if (b) b.classList.add('active');
            } else if (filterType === 'HIGH_3M') {
                const b = document.getElementById('btnWarnHigh');
                if (b) b.classList.add('active');
            } else if (filterType === 'CHURN_RISK') {
                const b = document.getElementById('btnWarnChurn');
                if (b) b.classList.add('active');
            }
            renderASOTable();
        }

        // TAB 4: Render ASO Table
        function renderASOTable() {
            const tbody = document.getElementById('asoTableBody');
            if (!tbody) return;

            const areaVal = document.getElementById('filterArea').value;
            const ssVal = document.getElementById('filterSS').value;
            const srVal = document.getElementById('filterSR').value;

            // Base filtered inactive outlets by cascading filters
            const baseFiltered = allInactiveOutlets.filter(o => {
                const matchArea = (areaVal === 'ALL' || o.area_name === areaVal);
                const matchSS = (ssVal === 'ALL' || o.ss_name === ssVal);
                const matchSR = (srVal === 'ALL' || o.sr_name === srVal);
                return matchArea && matchSS && matchSR;
            });

            // Update warning counter badges
            const countAll = baseFiltered.length;
            const countHigh = baseFiltered.filter(o => o.warning_level === 'HIGH_3M' || (!o.vol_t7 && !o.vol_t8 && !o.vol_t9)).length;
            const countChurn = baseFiltered.filter(o => o.warning_level === 'CHURN_RISK' || (o.vol_t7 > 0 || o.vol_t8 > 0)).length;

            const elCntAll = document.getElementById('countWarnAll');
            const elCntHigh = document.getElementById('countWarnHigh');
            const elCntChurn = document.getElementById('countWarnChurn');
            if (elCntAll) elCntAll.innerText = countAll.toLocaleString();
            if (elCntHigh) elCntHigh.innerText = countHigh.toLocaleString();
            if (elCntChurn) elCntChurn.innerText = countChurn.toLocaleString();

            // Filter by selected warning level
            const filteredOutlets = baseFiltered.filter(o => {
                if (currentASOWarnFilter === 'HIGH_3M') {
                    return o.warning_level === 'HIGH_3M' || (!o.vol_t7 && !o.vol_t8 && !o.vol_t9);
                } else if (currentASOWarnFilter === 'CHURN_RISK') {
                    return o.warning_level === 'CHURN_RISK' || (o.vol_t7 > 0 || o.vol_t8 > 0);
                }
                return true;
            });

            if (filteredOutlets.length === 0) {
                tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 24px; color: var(--hnk-green); font-weight: 700;">Không có điểm bán nào trong bộ lọc hiện tại.</td></tr>';
                return;
            }

            // Display top 100 outlets for smooth performance
            tbody.innerHTML = filteredOutlets.slice(0, 100).map(o => {
                const areaShort = o.area_name === 'South 2' ? 'S2' : (o.area_name === 'South 9' ? 'S9' : o.area_name);
                const v7 = o.vol_t7 || 0;
                const v8 = o.vol_t8 || 0;
                const v9 = o.vol_t9 || 0;

                let warnBadgeHtml = '';
                if (v7 === 0 && v8 === 0 && v9 === 0) {
                    warnBadgeHtml = '<span class="badge-pill" style="background:#fee2e2; color:#dc2626; font-weight:800; border:1px solid #fecaca; white-space:nowrap;">🔴 3T Không Mua (Cảnh Báo Cao)</span>';
                } else if (v7 > 0 || v8 > 0) {
                    warnBadgeHtml = '<span class="badge-pill" style="background:#fef3c7; color:#92400e; font-weight:800; border:1px solid #fde68a; white-space:nowrap;">🟡 Chưa Mua T9 (T7-T8 Có)</span>';
                } else {
                    warnBadgeHtml = '<span class="badge-pill" style="background:#f1f5f9; color:#475569; font-weight:700; white-space:nowrap;">⚪ Điểm Mới Chưa Mua</span>';
                }

                return \`
                <tr>
                    <td style="font-weight: 700; color: var(--text-muted); white-space: nowrap; vertical-align: middle;">\${o.outlet_code}</td>
                    <td style="font-weight: 800; white-space: nowrap; vertical-align: middle;">\${o.outlet_name}</td>
                    <td style="white-space: nowrap; vertical-align: middle;">\${o.city || o.province || 'N/A'}</td>
                    <td style="white-space: nowrap; vertical-align: middle;"><strong>\${o.subd_name}</strong> <span style="font-size: 11px; color: var(--text-muted);">(\${o.subd_code})</span></td>
                    <td style="text-align: center; white-space: nowrap; vertical-align: middle;">
                        <span class="badge-pill badge-area" style="white-space: nowrap; font-weight: 800;" title="\${o.area_name}">\${areaShort}</span>
                    </td>
                    <td style="font-weight: 700; color: var(--tiger-blue); white-space: nowrap; vertical-align: middle;">
                        <i data-lucide="user" style="width:12px;height:12px;display:inline-block;vertical-align:-1px;"></i> \${o.sr_name || 'Chưa phân bổ'}
                    </td>
                    <td style="font-weight: 600; color: #1e293b; white-space: nowrap; vertical-align: middle;">
                        \${o.ss_name || 'Chưa phân bổ'}
                    </td>
                    <td style="text-align: right; font-weight: 700; color: #334155; white-space: nowrap; vertical-align: middle;">\${v7.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 700; color: #334155; white-space: nowrap; vertical-align: middle;">\${v8.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 800; color: \${v9 > 0 ? 'var(--hnk-green)' : 'var(--hnk-red)'}; white-space: nowrap; vertical-align: middle;">\${v9.toLocaleString()}</td>
                    <td style="text-align: center; white-space: nowrap; vertical-align: middle;">\${warnBadgeHtml}</td>
                </tr>
            \`;
            }).join('');

            lucide.createIcons();
        }

        // Copy Zalo Message Template For SubD Owner
        function copyZaloMessage(subdId) {
            const s = (HEINEKEN_DATA.subd_list || []).find(x => x.subd_id === subdId);
            if (!s) return;

            const scdWarning = s.scd_status === 'RED_HIGH'
                ? '⚠️ TỒN KHO CAO (>7 ngày): Em gửi anh/chị cơ chế khuyến mãi combo tuần này để tăng tốc đẩy Sell-Out ra các quán quen nhé!'
                : (s.scd_status === 'YELLOW_LOW' ? '⚠️ TỒN KHO THẤP (<3 ngày): Anh/chị cần lên đơn Sell-In bổ sung gấp để tránh đứt hàng cuối tuần ạ ạ!' : '✅ Tồn kho đang ở mức an toàn tiêu chuẩn.');

            const aaLine = s.is_sdip 
                ? \`- Focus Nhóm AA: \${s.actual_si_aa.toLocaleString()} / \${s.target_aa.toLocaleString()} thùng (Đạt \${s.target_aa_pct}%)\` 
                : '';
            const bbLine = s.is_sdip 
                ? \`- Normal Nhóm BB: \${s.actual_si_bb.toLocaleString()} / \${s.target_bb.toLocaleString()} thùng (Đạt \${s.target_bb_pct}%)\` 
                : '';

            const msg = \`⭐ [HEINEKEN VIỆT NAM] CẬP NHẬT TIẾN ĐỘ THÁNG \${HEINEKEN_DATA.metadata.report_month}
Kính gửi: \${s.subd_name} (Mã: \${s.subd_id} - Khu vực: \${s.area_name})

📊 TIẾN ĐỘ CHỈ TIÊU SELL-IN:
- Tổng Target: \${s.target_total.toLocaleString()} thùng
- Đã nhập (SI): \${s.actual_si.toLocaleString()} thùng (Đạt \${s.target_achieve_pct}%)
\${aaLine ? aaLine + '\\n' : ''}\${bbLine ? bbLine + '\\n' : ''}- Tiêu thụ lẻ (SO): \${s.actual_so.toLocaleString()} thùng (Tỷ lệ SO/SI: \${s.so_vs_si_pct}%)

📦 TÌNH TRẠNG KHO & ĐIỂM BÁN:
- Tồn kho trung bình: \${s.scd} ngày
- \${scdWarning}
- Hiện có: \${s.inactive_outlets_count} điểm bán quen chưa có đơn hàng trong tháng.

👉 Đội ngũ Sales (\${s.sr_name || 'Sales Rep'} - \${s.ss_name || 'SS'}) sẵn sàng hỗ trợ đại lý đi tuyến kích hoạt ngay hôm nay. Chúc anh/chị bứt phá doanh số!\`;

            navigator.clipboard.writeText(msg).then(() => {
                showToast(\`Đã sao chép tin nhắn Zalo của \${s.subd_name}!\`);
            });
        }

        // Copy Route Message to Dispatch SS / SR
        function copyCurrentRepsZaloMessage() {
            const areaVal = document.getElementById('filterArea').value;
            const ssVal = document.getElementById('filterSS').value;
            const srVal = document.getElementById('filterSR').value;

            const list = allInactiveOutlets.filter(o => {
                const matchArea = (areaVal === 'ALL' || o.area_name === areaVal);
                const matchSS = (ssVal === 'ALL' || o.ss_name === ssVal);
                const matchSR = (srVal === 'ALL' || o.sr_name === srVal);
                return matchArea && matchSS && matchSR;
            });

            if (list.length === 0) {
                showToast('Không có điểm bán nào cần kích hoạt trong bộ lọc hiện tại.');
                return;
            }

            const topList = list.slice(0, 15).map((o, idx) => 
                \`\${idx + 1}. \${o.outlet_name} (\${o.outlet_code}) - SubD: \${o.subd_name} - Đ/C: \${o.city || o.province}\`
            ).join('\\n');

            const msg = \`🚨 [HEINEKEN] ĐIỀU TUYẾN KÍCH HOẠT ĐIỂM BÁN CHƯA CÓ ĐƠN (ASO)
Kính gửi: SS \${ssVal !== 'ALL' ? ssVal : 'Toàn Vùng'} / SR \${srVal !== 'ALL' ? srVal : 'Đội Ngũ Sales'}
Khu vực: \${areaVal}

Hiện có tổng cộng \${list.length} điểm bán Active chưa phát sinh đơn tháng này.
Danh sách các quán cần ưu tiên ghé thăm hôm nay:
\${topList}
\${list.length > 15 ? \`... và \${list.length - 15} quán khác (Xem trên Dashboard).\` : ''}

👉 Đề nghị Sales Rep lên lịch ghé thăm trực tiếp, hỗ trợ đặt đơn và cập nhật tiến độ trước 17h00 hôm nay!\`;

            navigator.clipboard.writeText(msg).then(() => {
                showToast(\`Đã sao chép danh sách \${list.length} quán gửi nhóm Zalo Sales!\`);
            });
        }

        // Copy AA-BB Summary
        function copyAABBSummaryZalo() {
            let totAATarget = 0, totAASI = 0, totBBTarget = 0, totBBSI = 0;
            currentSubDList.filter(s => s.is_sdip).forEach(s => {
                totAATarget += s.target_aa;
                totAASI += s.actual_si_aa;
                totBBTarget += s.target_bb;
                totBBSI += s.actual_si_bb;
            });

            const pctAA = totAATarget > 0 ? ((totAASI / totAATarget) * 100).toFixed(1) : 0;
            const pctBB = totBBTarget > 0 ? ((totBBSI / totBBTarget) * 100).toFixed(1) : 0;

            const msg = \`⭐ [HEINEKEN SDIP] BẢN TIN NHÓM CHIẾN LƯỢC AA - BB THÁNG \${HEINEKEN_DATA.metadata.report_month}
Khu vực: \${document.getElementById('filterArea').value}

1. FOCUS NHÓM AA (Heineken Silver, Tiger Crystal...):
- Target: \${Math.round(totAATarget).toLocaleString()} thùng
- Thực Đạt SI: \${Math.round(totAASI).toLocaleString()} thùng (\${pctAA}%)

2. NORMAL NHÓM BB (Bia Việt, Larue...):
- Target: \${Math.round(totBBTarget).toLocaleString()} thùng
- Thực Đạt SI: \${Math.round(totBBSI).toLocaleString()} thùng (\${pctBB}%)

👉 Đề nghị các Quản lý SS bám sát tiến độ từng đại lý để chốt thưởng cuối tháng!\`;

            navigator.clipboard.writeText(msg).then(() => {
                showToast('Đã sao chép tổng kết nhóm AA - BB!');
            });
        }

        // Full-screen / High-Res Filtered Report Image Exporter for Zalo
        function exportAABBReportImage() {
            const areaVal = document.getElementById('filterArea').value;
            const ssVal = document.getElementById('filterSS').value;
            const srVal = document.getElementById('filterSR').value;
            const nppVal = (document.getElementById('filterNPP')?.value || 'ALL');

            // Get filtered list for NPP or SDIP
            const sdipList = (nppVal !== 'ALL') ? currentSubDList : currentSubDList.filter(s => s.is_sdip || s.target_total > 0);

            if (sdipList.length === 0) {
                showToast('Không có đại lý SubD nào trong bộ lọc hiện tại để xuất ảnh.');
                return;
            }

            // Calculate totals for filtered subset
            let totTarget = 0, totSI = 0;
            let totAATarget = 0, totAASI = 0;
            let totBBTarget = 0, totBBSI = 0;
            let passBothCount = 0;

            sdipList.forEach(s => {
                totTarget += (s.target_total || 0);
                totSI += (s.actual_si || 0);
                totAATarget += (s.target_aa || 0);
                totAASI += (s.actual_si_aa || 0);
                totBBTarget += (s.target_bb || 0);
                totBBSI += (s.actual_si_bb || 0);

                const isAAPass = (s.target_aa_pct || 0) >= 100;
                const isBBPass = (s.target_bb_pct || 0) >= 100;
                if (isAAPass && isBBPass) passBothCount++;
            });

            const pctTotal = totTarget > 0 ? ((totSI / totTarget) * 100).toFixed(1) : 0;
            const pctAA = totAATarget > 0 ? ((totAASI / totAATarget) * 100).toFixed(1) : 0;
            const pctBB = totBBTarget > 0 ? ((totBBSI / totBBTarget) * 100).toFixed(1) : 0;

            // Labels
            const areaText = areaVal === 'ALL' ? 'Toàn Vùng (S2 & S9)' : (areaVal === 'South 2' ? 'Khu Vực S2' : (areaVal === 'South 9' ? 'Khu Vực S9' : areaVal));
            const ssText = ssVal === 'ALL' ? 'Tất cả Quản lý SS' : ('SS: ' + ssVal);
            const srText = srVal === 'ALL' ? '' : (' • SR: ' + srVal);

            // Build dynamic table rows
            const tableRows = sdipList.map((s, idx) => {
                const isAAPass = (s.target_aa_pct || 0) >= 100;
                const isBBPass = (s.target_bb_pct || 0) >= 100;
                const areaShort = s.area_name === 'South 2' ? 'S2' : (s.area_name === 'South 9' ? 'S9' : s.area_name);
                const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

                return \`
                    <tr style="border-bottom: 1px solid #cbd5e1; background: \${rowBg};">
                        <td style="text-align: center; font-weight: 700; color: #64748b; vertical-align: middle; padding: 10px 8px; font-size: 12px;">\${idx + 1}</td>
                        <td style="text-align: center; font-weight: 700; color: #475569; vertical-align: middle; padding: 10px 8px; white-space: nowrap; font-size: 12.5px;">\${s.subd_id}</td>
                        <td style="font-weight: 800; color: #0f172a; vertical-align: middle; padding: 10px 14px; white-space: nowrap; font-size: 13px;">\${s.subd_name}</td>
                        <td style="text-align: center; vertical-align: middle; padding: 10px 8px; white-space: nowrap;">
                            <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 11px; background: #e0f2fe; color: #0369a1;">\${areaShort}</span>
                        </td>
                        <td style="text-align: center; vertical-align: middle; padding: 10px 8px; white-space: nowrap;">
                            <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 11px; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1;">\${s.npp_code || 'N/A'}</span>
                        </td>
                        <td style="font-weight: 700; color: #1e293b; vertical-align: middle; padding: 10px 12px; white-space: nowrap; font-size: 12.5px;">\${s.ss_name || 'N/A'}</td>
                        <td style="text-align: center; vertical-align: middle; padding: 8px 6px;">
                            <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; width: 34px; text-align: center;">AA</span>
                                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: #f3e8ff; color: #6b21a8; font-weight: 800; font-size: 11px; width: 34px; text-align: center;">BB</span>
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle; padding: 8px 12px; white-space: nowrap;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="font-weight: 600; font-size: 13px; line-height: 20px; color: #1e293b;">\${(s.target_aa || 0).toLocaleString()}</div>
                                <div style="font-weight: 600; font-size: 13px; line-height: 20px; color: #64748b;">\${(s.target_bb || 0).toLocaleString()}</div>
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle; padding: 8px 12px; white-space: nowrap;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="font-weight: 800; font-size: 13px; line-height: 20px; color: #d97706;">\${(s.actual_si_aa || 0).toLocaleString()}</div>
                                <div style="font-weight: 800; font-size: 13px; line-height: 20px; color: #8b5cf6;">\${(s.actual_si_bb || 0).toLocaleString()}</div>
                            </div>
                        </td>
                        <td style="text-align: right; vertical-align: middle; padding: 8px 12px; white-space: nowrap;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="font-weight: 800; font-size: 13px; line-height: 20px; color: \${isAAPass ? '#008200' : '#dc2626'};">\${s.target_aa_pct || 0}%</div>
                                <div style="font-weight: 800; font-size: 13px; line-height: 20px; color: \${isBBPass ? '#008200' : '#dc2626'};">\${s.target_bb_pct || 0}%</div>
                            </div>
                        </td>
                    </tr>
                \`;
            }).join('');

            const now = new Date();
            const dateFormatted = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + now.getFullYear() + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

            const captureCard = document.getElementById('zaloAABBReportCaptureCard');
            captureCard.innerHTML = \`
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #013801 0%, #008200 100%); color: #ffffff; padding: 20px 28px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="font-size: 32px; color: #ef4444; line-height: 1;">★</div>
                        <div>
                            <div style="font-size: 20px; font-weight: 900; letter-spacing: 0.5px; font-family: 'Outfit', sans-serif;">HEINEKEN VIETNAM</div>
                            <div style="font-size: 14px; font-weight: 700; color: #bbf7d0; margin-top: 2px;">BÁO CÁO TIẾN ĐỘ CHỈ TIÊU SDIP (AA - BB) THÁNG \${HEINEKEN_DATA.metadata.report_month}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-bottom: 6px; flex-wrap: wrap;">
                            <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">📍 \${areaText}</span>
                            <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">👤 \${ssText}\${srText}</span>
                            <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700;">🏢 \${sdipList.length} SubD</span>
                        </div>
                        <div style="font-size: 11px; opacity: 0.85; font-style: italic;">Thời gian trích xuất: \${dateFormatted}</div>
                    </div>
                </div>

                <!-- KPI Summary Highlights -->
                <div style="background: #f1f5f9; padding: 16px 28px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; border-bottom: 2px solid #e2e8f0;">
                    <div style="background: #ffffff; padding: 12px 16px; border-radius: 10px; border: 1px solid #cbd5e1;">
                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Tổng Sell-In (SI)</div>
                        <div style="font-size: 18px; font-weight: 900; color: #008200; margin-top: 2px;">\${Math.round(totSI).toLocaleString()} <span style="font-size: 12px; font-weight: 600; color: #64748b;">th</span></div>
                        <div style="font-size: 12px; font-weight: 700; color: #475569; margin-top: 2px;">Chỉ tiêu: \${Math.round(totTarget).toLocaleString()} th (\${pctTotal}%)</div>
                    </div>
                    <div style="background: #ffffff; padding: 12px 16px; border-radius: 10px; border: 1px solid #fef08a;">
                        <div style="font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase;">Focus Nhóm AA</div>
                        <div style="font-size: 18px; font-weight: 900; color: #d97706; margin-top: 2px;">\${Math.round(totAASI).toLocaleString()} <span style="font-size: 12px; font-weight: 600; color: #64748b;">th</span></div>
                        <div style="font-size: 12px; font-weight: 700; color: #475569; margin-top: 2px;">Chỉ tiêu: \${Math.round(totAATarget).toLocaleString()} th (\${pctAA}%)</div>
                    </div>
                    <div style="background: #ffffff; padding: 12px 16px; border-radius: 10px; border: 1px solid #f3e8ff;">
                        <div style="font-size: 11px; font-weight: 700; color: #6b21a8; text-transform: uppercase;">Normal Nhóm BB</div>
                        <div style="font-size: 18px; font-weight: 900; color: #8b5cf6; margin-top: 2px;">\${Math.round(totBBSI).toLocaleString()} <span style="font-size: 12px; font-weight: 600; color: #64748b;">th</span></div>
                        <div style="font-size: 12px; font-weight: 700; color: #475569; margin-top: 2px;">Chỉ tiêu: \${Math.round(totBBTarget).toLocaleString()} th (\${pctBB}%)</div>
                    </div>
                    <div style="background: #ffffff; padding: 12px 16px; border-radius: 10px; border: 1px solid #bbf7d0;">
                        <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">Đạt Chuẩn Cả 2 Nhóm</div>
                        <div style="font-size: 18px; font-weight: 900; color: #15803d; margin-top: 2px;">\${passBothCount} / \${sdipList.length} <span style="font-size: 12px; font-weight: 600; color: #64748b;">đại lý</span></div>
                        <div style="font-size: 12px; font-weight: 700; color: #15803d; margin-top: 2px;">Tỷ lệ: \${sdipList.length > 0 ? ((passBothCount / sdipList.length) * 100).toFixed(1) : 0}% đạt thưởng SDIP</div>
                    </div>
                </div>

                <!-- Table Content -->
                <div style="padding: 20px 28px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="background: #f8fafc; border-bottom: 2px solid #94a3b8;">
                                <th style="padding: 10px; text-align: center; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">STT</th>
                                <th style="padding: 10px; text-align: center; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">Mã SubD</th>
                                <th style="padding: 10px 14px; text-align: left; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">Tên SubD</th>
                                <th style="padding: 10px; text-align: center; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">Khu Vực</th>
                                <th style="padding: 10px; text-align: center; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">NPP</th>
                                <th style="padding: 10px 12px; text-align: left; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">SS Phụ Trách</th>
                                <th style="padding: 10px; text-align: center; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">Nhóm</th>
                                <th style="padding: 10px 12px; text-align: right; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">Chỉ Tiêu</th>
                                <th style="padding: 10px 12px; text-align: right; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">Thực Bán</th>
                                <th style="padding: 10px 12px; text-align: right; color: #475569; font-weight: 800; font-size: 12px; white-space: nowrap;">% Đạt Được</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${tableRows}
                        </tbody>
                    </table>
                </div>

                <!-- Footer Sign-off -->
                <div style="background: #f8fafc; padding: 14px 28px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b;">
                    <div>★ <strong>HEINEKEN VIỆT NAM</strong> • Hệ thống Giám sát Phân phối & Động lực SDIP • Dữ liệu chuẩn xác 100% Zero-Discrepancy</div>
                    <div style="font-weight: 700; color: #008200;">ENJOY RESPONSIBLY</div>
                </div>
            \`;

            showToast(\`Đang kết xuất ảnh Báo Cáo Zalo (\${sdipList.length} đại lý)... Hãy đợi trong giây lát!\`);

            html2canvas(captureCard, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1300
            }).then(canvas => {
                const areaCode = areaVal === 'South 2' ? 'S2' : (areaVal === 'South 9' ? 'S9' : 'ToanVung');
                const ssCode = ssVal === 'ALL' ? 'AllSS' : ssVal.replace(/[^a-zA-Z0-9]/g, '_');
                const filename = \`Heineken_BaoCao_AABB_\${areaCode}_\${ssCode}_Thang09_2026.png\`;

                // 1. Download File
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();

                // 2. Also Copy to Clipboard if supported
                try {
                    canvas.toBlob(blob => {
                        if (navigator.clipboard && navigator.clipboard.write) {
                            navigator.clipboard.write([
                                new ClipboardItem({ 'image/png': blob })
                            ]).then(() => {
                                showToast(\`Đã tải ảnh HD & Copy vào Clipboard! Bạn có thể dán ngay vào Zalo (Ctrl+V).\`);
                            }).catch(() => {
                                showToast(\`Đã tải ảnh Báo Cáo Zalo (\${sdipList.length} đại lý) thành công!\`);
                            });
                        } else {
                            showToast(\`Đã tải ảnh Báo Cáo Zalo (\${sdipList.length} đại lý) thành công!\`);
                        }
                    }, 'image/png');
                } catch (e) {
                    showToast(\`Đã tải ảnh Báo Cáo Zalo (\${sdipList.length} đại lý) thành công!\`);
                }
            }).catch(err => {
                console.error(err);
                showToast('Có lỗi khi tạo ảnh báo cáo. Vui lòng thử lại.');
            });
        }

        // Export Zalo Flash Card via html2canvas
        function exportZaloCard(subdId) {
            const s = (HEINEKEN_DATA.subd_list || []).find(x => x.subd_id === subdId);
            if (!s) return;

            const card = document.getElementById('zaloCaptureCard');
            const body = document.getElementById('zaloCaptureBody');

            body.innerHTML = \`
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 4px;">\${s.subd_name}</h2>
                    <div style="font-size: 13px; color: #64748b; font-weight: 700;">Mã SubD: \${s.subd_id} • Khu vực: \${s.area_name} \${s.is_sdip ? '• SDIP ⭐' : ''}</div>
                </div>

                <div style="background: #f8fafc; border-radius: 12px; padding: 18px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; font-weight: 700;">Tiến Độ Chỉ Tiêu Tổng</span>
                        <span style="font-size: 18px; font-weight: 900; color: #008200;">\${s.target_achieve_pct}%</span>
                    </div>
                    <div style="height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; margin-bottom: 6px;">
                        <div style="width: \${Math.min(s.target_achieve_pct, 100)}%; height: 100%; background: #008200;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; font-weight: 600;">
                        <span>Đã nhập SI: \${s.actual_si.toLocaleString()} th</span>
                        <span>Target: \${s.target_total.toLocaleString()} th</span>
                    </div>
                </div>

                \${s.is_sdip ? \`
                <!-- Beer Bottles AA vs BB -->
                <div class="bottles-row" style="margin-bottom: 16px;">
                    <div class="bottle-item">
                        <div class="bottle-svg-wrap">
                            \${getBeerBottleSVG(s.target_aa_pct, true, s.actual_si_aa, s.target_aa, 'zalo_' + s.subd_id + '_aa')}
                        </div>
                        <div class="bottle-info-col">
                            <span class="bottle-badge-lbl badge-lbl-aa">Focus AA</span>
                            <div class="bottle-pct-num pct-num-aa">\${s.target_aa_pct}%</div>
                            <div class="bottle-stat-details">
                                Đạt: <strong>\${(s.actual_si_aa || 0).toLocaleString()}</strong> th<br>
                                Target: <strong>\${(s.target_aa || 0).toLocaleString()}</strong> th
                            </div>
                        </div>
                    </div>
                    <div class="bottle-item">
                        <div class="bottle-svg-wrap">
                            \${getBeerBottleSVG(s.target_bb_pct, false, s.actual_si_bb, s.target_bb, 'zalo_' + s.subd_id + '_bb')}
                        </div>
                        <div class="bottle-info-col">
                            <span class="bottle-badge-lbl badge-lbl-bb">Normal BB</span>
                            <div class="bottle-pct-num pct-num-bb">\${s.target_bb_pct}%</div>
                            <div class="bottle-stat-details">
                                Đạt: <strong>\${(s.actual_si_bb || 0).toLocaleString()}</strong> th<br>
                                Target: <strong>\${(s.target_bb || 0).toLocaleString()}</strong> th
                            </div>
                        </div>
                    </div>
                </div>
                \` : ''}

                <!-- SKU Horizontal Matrix -->
                \${getSkuHorizontalMatrix(s.sku_performance, "zalo_" + s.subd_id, false)}

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div style="background: #f1f5f9; padding: 12px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: #64748b; font-weight: 600;">Sell-Out Thực Tế</div>
                        <div style="font-size: 18px; font-weight: 900; color: #0055b8;">\${s.actual_so.toLocaleString()} th</div>
                        <div style="font-size: 11px; color: #0284c7; font-weight: 700;">SO/SI: \${s.so_vs_si_pct}%</div>
                    </div>
                    <div style="background: #f1f5f9; padding: 12px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 12px; color: #64748b; font-weight: 600;">Tồn Kho SCD</div>
                        <div style="font-size: 18px; font-weight: 900; color: \${s.scd > 7 ? '#dc2626' : (s.scd < 3 ? '#d97706' : '#008200')}">\${s.scd} ngày</div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748b;">\${s.scd_status === 'RED_HIGH' ? '🔴 Tồn Cao' : (s.scd_status === 'YELLOW_LOW' ? '🟡 Tồn Thấp' : '🟢 An Toàn')}</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div style="background: #f0fdf4; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid #bbf7d0;">
                        <div style="font-size: 12px; color: #166534; font-weight: 700;">⚡ Fill Rate 24h</div>
                        <div style="font-size: 18px; font-weight: 900; color: #008200;">\${s.fill_rate_pct}%</div>
                        <div style="font-size: 11px; color: #15803d; font-weight: 600;">\${s.fill_rate_pct >= 95 ? 'Duyệt chuẩn 24h' : (s.fill_rate_pct >= 85 ? 'Cần cải thiện' : 'Trễ hạn đơn')}</div>
                    </div>
                    <div style="background: #eff6ff; padding: 12px; border-radius: 10px; text-align: center; border: 1px solid #bfdbfe;">
                        <div style="font-size: 12px; color: #1e40af; font-weight: 700;">🏪 Độ Phủ ASO & SKU</div>
                        <div style="font-size: 18px; font-weight: 900; color: #1d4ed8;">\${s.aso_active} / \${s.aso_total}</div>
                        <div style="font-size: 11px; color: #2563eb; font-weight: 700;">\${s.aso_pct}% Active • \${s.sku_count} SKU</div>
                    </div>
                </div>

                <div style="padding: 14px; background: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7; font-size: 13px; color: #92400e;">
                    <strong>🎯 HÀNH ĐỘNG ĐỀ XUẤT:</strong><br>
                    - Điểm bán chưa mua hàng: <strong>\${s.inactive_outlets_count} quán</strong> cần Sales (\${s.sr_name || 'SR'}) hỗ trợ.<br>
                    \${s.scd > 7 ? '- Cần tập trung combo khuyến mãi đẩy hàng tồn các mã SCD cao.' : '- Duy trì nhập hàng đều đặn để giữ chuẩn phục vụ quán.'}
                </div>
            \`;

            showToast('Đang tạo ảnh Thẻ Zalo 30s...');
            html2canvas(card, { scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.download = \`Heineken_Zalo_Card_\${s.subd_id}_\${s.subd_name}.png\`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                showToast(\`Đã tải Thẻ Ảnh của \${s.subd_name} thành công!\`);
            });
        }

        // SubD Detail Modal
        function openSubDDetails(subdId) {
            const s = (HEINEKEN_DATA.subd_list || []).find(x => x.subd_id === subdId);
            if (!s) return;

            document.getElementById('modalSubDName').innerText = s.subd_name;
            document.getElementById('modalSubDMeta').innerText = \`Mã SubD: \${s.subd_id} | Khu vực: \${s.area_name} | SE/SS: \${s.ss_name || 'N/A'} | SR/DSM: \${s.sr_name || 'N/A'}\`;

            // Unified SKU Rows: Target - Sell-In - % SI - Còn lại SI - Sell-Out - Còn lại SO - Tồn kho - SCD - Trạng thái
            let totStock = 0;
            const skuRows = (s.sku_list || []).map(sku => {
                const target = sku.target || 0;
                const si = sku.actual_si || 0;
                const so = sku.actual_so || 0;
                const stock = sku.stock || 0;
                const scd = sku.scd || 0;
                totStock += stock;

                const pctSI = target > 0 ? ((si / target) * 100).toFixed(1) + '%' : '-';
                const remSI = target > 0 ? Math.max(0, target - si) : 0;
                const remSO = target > 0 ? Math.max(0, target - so) : 0;

                return \`
                <tr>
                    <td style="font-weight: 800; color: #0f172a; white-space: nowrap; vertical-align: middle;">\${sku.short_code}</td>
                    <td style="font-weight: 600; vertical-align: middle;">\${sku.sku_name}</td>
                    <td style="text-align: right; font-weight: 700; color: #475569; vertical-align: middle;">\${target > 0 ? target.toLocaleString() : '-'}</td>
                    <td style="text-align: right; font-weight: 800; color: var(--hnk-green); vertical-align: middle;">\${si.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 800; color: \${target > 0 && si >= target ? '#008200' : (target > 0 && si/target >= 0.8 ? '#d97706' : '#64748b')}; vertical-align: middle;">\${pctSI}</td>
                    <td style="text-align: right; font-weight: 700; color: \${remSI > 0 ? '#dc2626' : '#008200'}; vertical-align: middle;">\${target > 0 ? (remSI > 0 ? remSI.toLocaleString() : '✓ Đạt') : '-'}</td>
                    <td style="text-align: right; font-weight: 800; color: var(--tiger-blue); vertical-align: middle;">\${so.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 700; color: #64748b; vertical-align: middle;">\${target > 0 ? (remSO > 0 ? remSO.toLocaleString() : '✓ Đạt') : '-'}</td>
                    <td style="text-align: right; font-weight: 800; color: #0f172a; vertical-align: middle;">\${stock.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 700; color: #475569; vertical-align: middle;">\${scd}</td>
                    <td style="text-align: center; vertical-align: middle;">
                        <span class="scd-pill \${sku.status === 'RED_HIGH' ? 'scd-red' : (sku.status === 'YELLOW_LOW' ? 'scd-yellow' : 'scd-green')}">
                            \${sku.status === 'RED_HIGH' ? 'Tồn cao' : (sku.status === 'YELLOW_LOW' ? 'Thiếu hàng' : 'Chuẩn')}
                        </span>
                    </td>
                </tr>
                \`;
            }).join('');

            // Outlets of this SubD from inactive master list with SE/SS and SR/DSM
            const subdOutlets = allInactiveOutlets.filter(o => o.subd_code === subdId);
            const outletRows = subdOutlets.slice(0, 50).map(o => {
                const v7 = o.vol_t7 || 0;
                const v8 = o.vol_t8 || 0;
                const v9 = o.vol_t9 || 0;
                let warnBadgeHtml = '';
                if (v7 === 0 && v8 === 0 && v9 === 0) {
                    warnBadgeHtml = '<span class="badge-pill" style="background:#fee2e2; color:#dc2626; font-weight:800; border:1px solid #fecaca; white-space:nowrap;">🔴 3T Không Mua</span>';
                } else if (v7 > 0 || v8 > 0) {
                    warnBadgeHtml = '<span class="badge-pill" style="background:#fef3c7; color:#92400e; font-weight:800; border:1px solid #fde68a; white-space:nowrap;">🟡 Chưa Mua T9</span>';
                } else {
                    warnBadgeHtml = '<span class="badge-pill" style="background:#f1f5f9; color:#475569; font-weight:700; white-space:nowrap;">⚪ Chưa Có Đơn</span>';
                }

                return \`
                <tr>
                    <td style="font-weight: 700; white-space: nowrap; vertical-align: middle; color: #475569;">\${o.outlet_code}</td>
                    <td style="font-weight: 800; white-space: nowrap; vertical-align: middle; color: #0f172a;">\${o.outlet_name}</td>
                    <td style="white-space: nowrap; vertical-align: middle; font-size: 11.5px;">\${o.city || o.province || 'N/A'}</td>
                    <td style="color: var(--tiger-blue); font-weight: 700; white-space: nowrap; vertical-align: middle;">
                        <i data-lucide="user" style="width:12px;height:12px;display:inline-block;vertical-align:-1px;"></i> \${o.sr_name || 'Chưa phân bổ'}
                    </td>
                    <td style="font-weight: 600; white-space: nowrap; vertical-align: middle;">
                        \${o.ss_name || 'Chưa phân bổ'}
                    </td>
                    <td style="text-align: right; font-weight: 700; color: #475569; white-space: nowrap; vertical-align: middle;">\${v7.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 700; color: #475569; white-space: nowrap; vertical-align: middle;">\${v8.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: 800; color: \${v9 > 0 ? 'var(--hnk-green)' : '#dc2626'}; white-space: nowrap; vertical-align: middle;">\${v9.toLocaleString()}</td>
                    <td style="text-align: center; white-space: nowrap; vertical-align: middle;">\${warnBadgeHtml}</td>
                </tr>
                \`;
            }).join('');

            document.getElementById('modalBody').innerHTML = \`
                <!-- 4 Operational KPI Highlights -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 20px;">
                    <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Sell-In / Target</div>
                        <div style="font-size: 16px; font-weight: 900; color: var(--hnk-green);">\${s.actual_si.toLocaleString()} <span style="font-size:11px;color:var(--text-muted);font-weight:600;">/ \${s.target_total.toLocaleString()}</span></div>
                        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted);">Đạt \${s.target_achieve_pct}% Target</div>
                    </div>
                    <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Sell-Out Thực Tế</div>
                        <div style="font-size: 16px; font-weight: 900; color: var(--tiger-blue);">\${s.actual_so.toLocaleString()} <span style="font-size:11px;color:var(--text-muted);font-weight:600;">th</span></div>
                        <div style="font-size: 11px; font-weight: 700; color: var(--tiger-blue);">SO/SI: \${s.so_vs_si_pct}%</div>
                    </div>
                    <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0;">
                        <div style="font-size: 11px; color: #166534; font-weight: 700;">⚡ Fill Rate 24h</div>
                        <div style="font-size: 16px; font-weight: 900; color: \${s.fill_rate_pct >= 95 ? '#008200' : (s.fill_rate_pct >= 85 ? '#d97706' : '#dc2626')};">\${s.fill_rate_pct}%</div>
                        <div style="font-size: 11px; font-weight: 700; color: #15803d;">\${s.fill_rate_pct >= 95 ? 'Duyệt chuẩn 24h' : 'Cần cải thiện'}</div>
                    </div>
                    <div style="background: #eff6ff; padding: 12px; border-radius: 8px; border: 1px solid #bfdbfe;">
                        <div style="font-size: 11px; color: #1e40af; font-weight: 700;">🏪 Điểm Bán & Danh Mục</div>
                        <div style="font-size: 16px; font-weight: 900; color: #1d4ed8;">\${s.aso_active} <span style="font-size:11px;color:var(--text-muted);font-weight:600;">/ \${s.aso_total} ASO</span></div>
                        <div style="font-size: 11px; font-weight: 700; color: #1e40af;">\${s.aso_pct}% Active • \${s.sku_count} SKU</div>
                    </div>
                </div>

                \${s.is_sdip ? \`
                <div class="bottles-row" style="margin-bottom: 16px;">
                    <div class="bottle-item">
                        <div class="bottle-svg-wrap">
                            \${getBeerBottleSVG(s.target_aa_pct, true, s.actual_si_aa, s.target_aa, 'modal_' + s.subd_id + '_aa')}
                        </div>
                        <div class="bottle-info-col">
                            <span class="bottle-badge-lbl badge-lbl-aa">Focus AA</span>
                            <div class="bottle-pct-num pct-num-aa">\${s.target_aa_pct}%</div>
                            <div class="bottle-stat-details">
                                Đạt: <strong>\${(s.actual_si_aa || 0).toLocaleString()}</strong> th<br>
                                Target: <strong>\${(s.target_aa || 0).toLocaleString()}</strong> th
                            </div>
                        </div>
                    </div>
                    <div class="bottle-item">
                        <div class="bottle-svg-wrap">
                            \${getBeerBottleSVG(s.target_bb_pct, false, s.actual_si_bb, s.target_bb, 'modal_' + s.subd_id + '_bb')}
                        </div>
                        <div class="bottle-info-col">
                            <span class="bottle-badge-lbl badge-lbl-bb">Normal BB</span>
                            <div class="bottle-pct-num pct-num-bb">\${s.target_bb_pct}%</div>
                            <div class="bottle-stat-details">
                                Đạt: <strong>\${(s.actual_si_bb || 0).toLocaleString()}</strong> th<br>
                                Target: <strong>\${(s.target_bb || 0).toLocaleString()}</strong> th
                            </div>
                        </div>
                    </div>
                </div>
                \` : ''}

                <!-- 1. Unified Master Table for SKU Targets, SI, SO, Stock, SCD -->
                <h4 style="font-size: 15px; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                    <span>📊 1. Bảng Chi Tiết Chỉ Tiêu - Thực Mua (SI) - Tiêu Thụ (SO) - Tồn Kho Từng SKU</span>
                    <span style="font-size: 11.5px; font-weight: 600; color: var(--text-muted);">Tổng hợp theo mã sản phẩm MTD</span>
                </h4>
                <div style="max-height: 280px; overflow-y: auto; margin-bottom: 24px; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <table class="data-table" style="font-size: 12px;">
                        <thead style="position: sticky; top: 0; z-index: 2;">
                            <tr>
                                <th style="white-space: nowrap;">Mã SKU</th>
                                <th style="white-space: nowrap; min-width: 170px;">Tên Sản Phẩm</th>
                                <th style="text-align: right; white-space: nowrap;">Chỉ Tiêu</th>
                                <th style="text-align: right; white-space: nowrap;">Thực Mua (SI)</th>
                                <th style="text-align: right; white-space: nowrap;">% Đạt SI</th>
                                <th style="text-align: right; white-space: nowrap;">Còn Lại SI</th>
                                <th style="text-align: right; white-space: nowrap;">Tiêu Thụ (SO)</th>
                                <th style="text-align: right; white-space: nowrap;">Còn Lại SO</th>
                                <th style="text-align: right; white-space: nowrap;">Tồn Kho</th>
                                <th style="text-align: right; white-space: nowrap;">SCD (ngày)</th>
                                <th style="text-align: center; white-space: nowrap;">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>\${skuRows || '<tr><td colspan="11" style="text-align:center;padding:16px;">Không có dữ liệu SKU</td></tr>'}</tbody>
                        <tfoot style="position: sticky; bottom: 0; background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1; z-index: 2;">
                            <tr style="background: #f1f5f9;">
                                <td colspan="2" style="font-weight: 900; color: #0f172a; padding: 10px 12px;">TỔNG CỘNG (\${(s.sku_list || []).length} SKU)</td>
                                <td style="text-align: right; font-weight: 900; color: #0f172a;">\${s.target_total.toLocaleString()}</td>
                                <td style="text-align: right; font-weight: 900; color: var(--hnk-green);">\${s.actual_si.toLocaleString()}</td>
                                <td style="text-align: right; font-weight: 900; color: \${s.target_achieve_pct >= 100 ? '#008200' : '#d97706'};">\${s.target_achieve_pct}%</td>
                                <td style="text-align: right; font-weight: 900; color: \${s.target_total > s.actual_si ? '#dc2626' : '#008200'};">\${s.target_total > s.actual_si ? (s.target_total - s.actual_si).toLocaleString() : '✓ Đạt'}</td>
                                <td style="text-align: right; font-weight: 900; color: var(--tiger-blue);">\${s.actual_so.toLocaleString()}</td>
                                <td style="text-align: right; font-weight: 900; color: #475569;">\${s.target_total > s.actual_so ? (s.target_total - s.actual_so).toLocaleString() : '✓ Đạt'}</td>
                                <td style="text-align: right; font-weight: 900; color: #0f172a;">\${totStock.toLocaleString()}</td>
                                <td style="text-align: right; font-weight: 900; color: #475569;">\${s.scd}</td>
                                <td style="text-align: center;">
                                    <span class="scd-pill \${s.scd_status === 'RED_HIGH' ? 'scd-red' : (s.scd_status === 'YELLOW_LOW' ? 'scd-yellow' : 'scd-green')}">
                                        \${s.scd_status === 'RED_HIGH' ? 'Tồn cao' : (s.scd_status === 'YELLOW_LOW' ? 'Thiếu hàng' : 'Chuẩn')}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- 2. Non-Ordering Outlets with SE/SS and SR/DSM + Excel Export Button -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <h4 style="font-size: 15px; font-weight: 800; margin: 0;">2. Danh Sách Quán Active Chưa Có Đơn (\${subdOutlets.length} quán)</h4>
                    <button class="btn-action" onclick="exportSubDASOExcel('\${s.subd_id}')" style="background: #10b981; color: #ffffff; font-weight: 700; border: none; padding: 7px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; box-shadow: 0 2px 4px rgba(16,185,129,0.2);">
                        <i data-lucide="file-spreadsheet" style="width: 14px; height: 14px;"></i> Xuất Excel Gửi SubD (\${subdOutlets.length} quán)
                    </button>
                </div>
                <div style="max-height: 240px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px;">
                    <table class="data-table" style="font-size: 12px;">
                        <thead style="position: sticky; top: 0; z-index: 2;">
                            <tr>
                                <th style="white-space: nowrap;">Mã Quán</th>
                                <th style="white-space: nowrap; min-width: 140px;">Tên Quán</th>
                                <th style="white-space: nowrap;">Địa Bàn</th>
                                <th style="white-space: nowrap;">SR / DSM</th>
                                <th style="white-space: nowrap;">SE / SS</th>
                                <th style="text-align: right; white-space: nowrap;">Doanh Số T7 (thùng)</th>
                                <th style="text-align: right; white-space: nowrap;">Doanh Số T8 (thùng)</th>
                                <th style="text-align: right; white-space: nowrap;">Doanh Số T9 (thùng)</th>
                                <th style="text-align: center; white-space: nowrap;">Trạng Thái Cảnh Báo</th>
                            </tr>
                        </thead>
                        <tbody>\${outletRows || '<tr><td colspan="9" style="text-align:center;padding:16px;color:var(--hnk-green);font-weight:700;">100% Điểm bán đã có đơn hàng!</td></tr>'}</tbody>
                    </table>
                </div>
            \`;

            document.getElementById('subdModal').classList.add('active');
            lucide.createIcons();
        }

        function closeModal() {
            document.getElementById('subdModal').classList.remove('active');
        }

        function closeModalOnBg(e) {
            if (e.target.id === 'subdModal') closeModal();
        }

        // SDIP Target Notification Modal Handlers
        let currentNoticeSubD = null;

        function openSdipNoticeModal(subdId) {
            const s = (HEINEKEN_DATA.subd_list || []).find(x => x.subd_id === subdId);
            if (!s) return;
            currentNoticeSubD = s;

            const aaTarget = s.target_aa_revised ? s.target_aa_revised.toLocaleString() : (s.target_aa ? s.target_aa.toLocaleString() : '0');
            const bbTarget = s.target_bb_revised ? s.target_bb_revised.toLocaleString() : (s.target_bb ? s.target_bb.toLocaleString() : '0');
            const totTarget = s.target_total_revised ? s.target_total_revised.toLocaleString() : (s.target_total ? s.target_total.toLocaleString() : '0');
            const npp = s.npp_name || 'TG-NPP Chủ Quản';

            document.getElementById('sdipNoticeSubDName').innerText = s.subd_name;
            document.getElementById('sdipNoticeName').innerText = s.subd_name;
            document.getElementById('sdipNoticeCode').innerText = s.subd_id;
            document.getElementById('sdipNoticeNPP').innerText = npp;
            document.getElementById('sdipNoticeArea').innerText = s.area_name;

            document.getElementById('sdipNoticeAA').innerText = aaTarget;
            document.getElementById('sdipNoticeBB').innerText = bbTarget;
            document.getElementById('sdipNoticeTotal').innerText = totTarget;

            document.getElementById('sdipNoticeModal').classList.add('active');
            lucide.createIcons();
        }

        function closeSdipNoticeModal() {
            document.getElementById('sdipNoticeModal').classList.remove('active');
        }

        function closeSdipNoticeOnBg(e) {
            if (e.target.id === 'sdipNoticeModal') closeSdipNoticeModal();
        }

        function copySdipNoticeZalo() {
            if (!currentNoticeSubD) return;
            const s = currentNoticeSubD;
            const aaTarget = s.target_aa_revised ? s.target_aa_revised.toLocaleString() : (s.target_aa ? s.target_aa.toLocaleString() : '0');
            const bbTarget = s.target_bb_revised ? s.target_bb_revised.toLocaleString() : (s.target_bb ? s.target_bb.toLocaleString() : '0');
            const totTarget = s.target_total_revised ? s.target_total_revised.toLocaleString() : (s.target_total ? s.target_total.toLocaleString() : '0');
            const npp = s.npp_name || 'NPP Chủ Quản';

            const msg = '[HEINEKEN VIỆT NAM] THÔNG BÁO CHỈ TIÊU DOANH SỐ SDIP THÁNG 09/2026\\n' +
'Kính gửi: Quý Đại Lý ' + s.subd_name + ' (Mã: ' + s.subd_id + ')\\n' +
'Nhà Phân Phối: ' + npp + ' - Khu Vực: ' + s.area_name + '\\n\\n' +
'Căn cứ vào lịch sử bán hàng tháng 08/2026 và kế hoạch kinh doanh tháng 09/2026 của Công ty, HEINEKEN Việt Nam trân trọng thông báo chỉ tiêu doanh số SDIP tháng 09/2026:\\n' +
'🎯 CHỈ TIÊU AA (Focus): ' + aaTarget + ' thùng\\n' +
'🎯 CHỈ TIÊU BB (Normal): ' + bbTarget + ' thùng\\n' +
'👉 TỔNG CHỈ TIÊU: ' + totTarget + ' thùng\\n\\n' +
'📅 Thời gian áp dụng: Từ 01/09/2026 đến 30/09/2026\\n' +
'Trân trọng cảm ơn sự hợp tác và cam kết của Quý Đại Lý. HEINEKEN Việt Nam luôn đồng hành và phát triển cùng Quý Đại Lý!';

            navigator.clipboard.writeText(msg).then(() => {
                showToast('Đã sao chép Thư Báo Chỉ Tiêu Zalo của ' + s.subd_name + '!');
            });
        }

        function exportSdipNoticeImage() {
            if (!currentNoticeSubD) return;
            const s = currentNoticeSubD;
            const card = document.getElementById('sdipNoticePrintCard');
            showToast('Đang tạo ảnh Thư Báo HD cho ' + s.subd_name + '...');
            html2canvas(card, { scale: 2, useCORS: true }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'Heineken_SDIP_ThongBao_ChiTieu_' + s.subd_id + '_' + s.subd_name + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                showToast('Đã xuất ảnh Thư Báo thành công!');
            });
        }


        // CSV Exporter for Active View
        function exportCurrentViewCSV() {
            if (activeTab === 'tabASO') {
                exportInactiveOutletsCSV();
            } else {
                exportSubDListCSV();
            }
        }

        function exportSubDListCSV() {
            const headers = ['SubD_ID', 'SubD_Name', 'Area', 'SS_Name', 'SR_Name', 'SDIP', 'Target_Total', 'Actual_SI', 'Achieve_SI_Pct', 'Actual_SO', 'SO_SI_Pct', 'Target_AA', 'Actual_SI_AA', 'Achieve_AA_Pct', 'Target_BB', 'Actual_SI_BB', 'Achieve_BB_Pct', 'SCD_Days', 'Inactive_Outlets'];
            const rows = currentSubDList.map(s => [
                s.subd_id,
                \`"\${s.subd_name.replace(/"/g, '""')}"\`,
                s.area_name,
                \`"\${(s.ss_name || '').replace(/"/g, '""')}"\`,
                \`"\${(s.sr_name || '').replace(/"/g, '""')}"\`,
                s.is_sdip ? 'Yes' : 'No',
                s.target_total,
                s.actual_si,
                s.target_achieve_pct,
                s.actual_so,
                s.so_vs_si_pct,
                s.target_aa,
                s.actual_si_aa,
                s.target_aa_pct,
                s.target_bb,
                s.actual_si_bb,
                s.target_bb_pct,
                s.scd,
                s.inactive_outlets_count
            ].join(','));

            const csvContent = "\\uFEFF" + [headers.join(','), ...rows].join('\\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = \`Heineken_SDIP_SubD_List_\${HEINEKEN_DATA.metadata.report_month}.csv\`;
            link.click();
            showToast('Đã xuất file CSV danh sách SubD thành công!');
        }

        function exportInactiveOutletsCSV() {
            const areaVal = document.getElementById('filterArea').value;
            const ssVal = document.getElementById('filterSS').value;
            const srVal = document.getElementById('filterSR').value;

            const list = allInactiveOutlets.filter(o => {
                const matchArea = (areaVal === 'ALL' || o.area_name === areaVal);
                const matchSS = (ssVal === 'ALL' || o.ss_name === ssVal);
                const matchSR = (srVal === 'ALL' || o.sr_name === srVal);
                const matchWarn = (currentASOWarnFilter === 'ALL') ||
                    (currentASOWarnFilter === 'HIGH_3M' && (o.warning_level === 'HIGH_3M' || (!o.vol_t7 && !o.vol_t8 && !o.vol_t9))) ||
                    (currentASOWarnFilter === 'CHURN_RISK' && (o.warning_level === 'CHURN_RISK' || (o.vol_t7 > 0 || o.vol_t8 > 0)));
                return matchArea && matchSS && matchSR && matchWarn;
            });

            if (list.length === 0) {
                showToast('Không có điểm bán nào trong bộ lọc hiện tại để xuất Excel!');
                return;
            }

            const headers = ['Outlet_Code', 'Outlet_Name', 'SubD_Code', 'SubD_Name', 'Area', 'City', 'Province', 'SR_DSM', 'SE_SS', 'Vol_T7', 'Vol_T8', 'Vol_T9', 'Warning_Level', 'Hanh_Dong_De_Xuat'];

            const rows = list.map(o => {
                const v7 = o.vol_t7 || 0;
                const v8 = o.vol_t8 || 0;
                const v9 = o.vol_t9 || 0;
                const warnText = (v7 === 0 && v8 === 0 && v9 === 0)
                    ? '3 Tháng Không Mua (Cảnh Báo Cao)'
                    : ((v7 > 0 || v8 > 0) ? 'Chưa Mua T9 (T7-T8 Có Mua)' : 'Chưa Mua T9');
                const actionText = (v7 === 0 && v8 === 0 && v9 === 0)
                    ? 'SR/DSM khảo sát thực địa xác minh tình trạng quán'
                    : 'Gặp chủ quán tư vấn combo bia kèm chương trình khuyến mãi';

                return [
                    \`"\${o.outlet_code}"\`,
                    \`"\${(o.outlet_name || '').replace(/"/g, '""')}"\`,
                    \`"\${o.subd_code}"\`,
                    \`"\${(o.subd_name || '').replace(/"/g, '""')}"\`,
                    \`"\${o.area_name}"\`,
                    \`"\${(o.city || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.province || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.sr_name || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.ss_name || '').replace(/"/g, '""')}"\`,
                    v7,
                    v8,
                    v9,
                    \`"\${warnText}"\`,
                    \`"\${actionText}"\`
                ].join(',');
            });

            const csvContent = "\\uFEFF" + [headers.join(','), ...rows].join('\\r\\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = \`Danh_Sach_Quan_ASO_Chua_Mua_\${HEINEKEN_DATA.metadata.report_month}.csv\`;
            link.click();
            showToast(\`Đã xuất file Excel \${list.length} điểm bán chưa mua hàng!\`);
        }

        // Dedicated Excel Exporter for a Specific SubD to send to SubD owner
        function exportSubDASOExcel(subdId) {
            const s = (HEINEKEN_DATA.subd_list || []).find(x => x.subd_id === subdId);
            if (!s) return;
            const outlets = allInactiveOutlets.filter(o => o.subd_code === subdId);
            if (outlets.length === 0) {
                showToast(\`SubD \${s.subd_name} hiện 100% điểm bán đã có đơn hàng!\`);
                return;
            }

            const headers = [
                'Mã SubD', 'Tên SubD', 'Mã Quán (Outlet Code)', 'Tên Quán (Outlet Name)',
                'Tỉnh / Thành Phố', 'Phường / Xã', 'Khu Vực',
                'SR / DSM', 'SE / SS',
                'Sản Lượng T7 (thùng)', 'Sản Lượng T8 (thùng)', 'Sản Lượng T9 (thùng)',
                'Mức Độ Cảnh Báo', 'Hành Động Khuyến Nghị Gửi SubD'
            ];

            const rows = outlets.map(o => {
                const v7 = o.vol_t7 || 0;
                const v8 = o.vol_t8 || 0;
                const v9 = o.vol_t9 || 0;
                const warnText = (v7 === 0 && v8 === 0 && v9 === 0) 
                    ? '3 Tháng Không Mua (Cảnh Báo Cao)' 
                    : ((v7 > 0 || v8 > 0) ? 'Chưa Mua T9 (T7-T8 Có Mua)' : 'Chưa Mua T9');
                const actionText = (v7 === 0 && v8 === 0 && v9 === 0)
                    ? 'Cần SR/DSM đi cùng đại diện SubD ghé quán kiểm tra tình trạng quán'
                    : 'SubD chủ động liên hệ chủ quán chào combo bia kèm ưu đãi để mở lại đơn';

                return [
                    \`"\${o.subd_code}"\`,
                    \`"\${(o.subd_name || '').replace(/"/g, '""')}"\`,
                    \`"\${o.outlet_code}"\`,
                    \`"\${(o.outlet_name || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.city || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.province || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.area_name || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.sr_name || '').replace(/"/g, '""')}"\`,
                    \`"\${(o.ss_name || '').replace(/"/g, '""')}"\`,
                    v7,
                    v8,
                    v9,
                    \`"\${warnText}"\`,
                    \`"\${actionText}"\`
                ].join(',');
            });

            const csvContent = "\\uFEFF" + [headers.join(','), ...rows].join('\\r\\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const safeName = (s.subd_name || 'SubD').replace(/[\\\\/:*?"<>|]/g, '').replace(/\\s+/g, '_');
            link.download = \`Danh_Sach_Quan_Chua_Mua_T9_\${s.subd_id}_\${safeName}.csv\`;
            link.click();
            showToast(\`Đã xuất file Excel cho SubD \${s.subd_name} (\${outlets.length} quán)!\`);
        }

        // Toast Helper
        function showToast(msg) {
            const t = document.getElementById('toast');
            document.getElementById('toastMsg').innerText = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3500);
        }

        // ApexCharts Initialization
        window.addEventListener('DOMContentLoaded', () => {
            initFilters();
            lucide.createIcons();
            renderAreaTable();

            // Chart 1: Progress by Area
            const areaOptions = {
                series: [{
                    name: 'Target Sell-In',
                    data: [${data.kpis.south2.Target}, ${data.kpis.south9.Target}]
                }, {
                    name: 'Thực Đạt Sell-In',
                    data: [${data.kpis.south2.Actual_SI}, ${data.kpis.south9.Actual_SI}]
                }, {
                    name: 'Thực Đạt Sell-Out',
                    data: [${data.kpis.south2.Actual_SO}, ${data.kpis.south9.Actual_SO}]
                }],
                chart: { type: 'bar', height: 280, toolbar: { show: false } },
                colors: ['#cbd5e1', '#008200', '#0055b8'],
                plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 6 } },
                dataLabels: { enabled: false },
                xaxis: { categories: ['South 2', 'South 9'] },
                legend: { position: 'top' },
                grid: { borderColor: '#f1f5f9' }
            };
            new ApexCharts(document.querySelector("#chartAreaProgress"), areaOptions).render();

            // Chart 2: SCD Donut
            let redCount = 0, yellowCount = 0, greenCount = 0;
            currentSubDList.forEach(s => {
                if (s.scd_status === 'RED_HIGH') redCount++;
                else if (s.scd_status === 'YELLOW_LOW') yellowCount++;
                else greenCount++;
            });

            const scdOptions = {
                series: [redCount, yellowCount, greenCount],
                labels: ['🔴 Tồn Cao (> 7 ngày)', '🟡 Tồn Thấp (< 3 ngày)', '🟢 An Toàn (3 - 7 ngày)'],
                chart: { type: 'donut', height: 280 },
                colors: ['#dc2626', '#d97706', '#008200'],
                legend: { position: 'bottom' },
                dataLabels: { enabled: true }
            };
            new ApexCharts(document.querySelector("#chartSCDDistribution"), scdOptions).render();
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    const stats = fs.statSync(outputPath);
    console.log(`\n============================================================`);
    console.log(`DASHBOARD HTML GENERATED SUCCESSFULLY!`);
    console.log(`Output File : ${outputPath}`);
    console.log(`File Size   : ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`============================================================\n`);
}

// Auto run if called directly
const cleanJsonDist = path.join(__dirname, '..', 'dist', 'sdip_data_202609.json');
const oneDriveJson = 'C:\\Users\\HP\\OneDrive - Heineken International\\AA SS SubD\\3. Tracking\\Build Tool\\Dashboard\\sdip_data_202609.json';
const targetHtmlDist = path.join(__dirname, '..', 'dist', 'dashboard_september_2026.html');
const oneDriveHtml = 'C:\\Users\\HP\\OneDrive - Heineken International\\AA SS SubD\\3. Tracking\\Build Tool\\Dashboard\\dashboard_september_2026.html';

const jsonPath = fs.existsSync(cleanJsonDist) ? cleanJsonDist : oneDriveJson;

if (fs.existsSync(jsonPath)) {
    generateDashboardHtml(jsonPath, targetHtmlDist);
    try {
        fs.copyFileSync(targetHtmlDist, oneDriveHtml);
        console.log(`Synced to OneDrive: ${oneDriveHtml}`);
    } catch(e) {
        console.log(`OneDrive sync skipped: ${e.message}`);
    }
} else {
    console.log(`Waiting for ${jsonPath} to be generated...`);
}

module.exports = { generateDashboardHtml };
