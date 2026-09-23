# Dự Án: Heineken SDIP SubD & Sales Performance Tracking Dashboard

Hệ thống xử lý dữ liệu và tự động sinh Dashboard theo dõi hiệu suất SubD và đội ngũ Sales Rep cho Heineken Việt Nam (Khu vực South 2 & South 9), tối ưu hóa tác chiến qua **Zalo**.

---

## 📁 Cấu Trúc Thư Mục Dự Án (`heineken-sdip-tracking/`)

```
heineken-sdip-tracking/
├── dist/                          # Thư mục thành phẩm đầu ra
│   ├── dashboard_september_2026.html   # File Dashboard HTML siêu nhẹ (< 450 KB)
│   └── sdip_data_202609.json           # Dữ liệu 102 SubDs đã chuẩn hóa
│
├── scripts/                       # Kịch bản vận hành chính
│   ├── build_september_data.ps1        # Pipeline ETL đọc & làm sạch 5 file PBI
│   ├── generate_dashboard_html.js      # Generator sinh mã HTML Dashboard
│   └── Run_Update_September.bat        # File 1-Click Update cho người dùng
│
├── docs/                          # Tài liệu kỹ thuật
│   └── DATA_CONNECTION_LOGIC.md        # Đặc tả ERD, khóa liên kết & công thức
│
└── tools/                         # Bộ công cụ hỗ trợ & kiểm toán
    ├── audit/                     # Script kiểm tra cấu trúc file Excel PBI
    │   ├── audit_excel_structure.ps1
    │   ├── audit_targets.ps1
    │   ├── audit_thang9_new.ps1
    │   ├── check_overview_breakdown.ps1
    │   ├── check_thang9_areas.ps1
    │   ├── check_thang9_other_areas.ps1
    │   ├── cross_check_subds.ps1
    │   ├── inspect_overview_sample.ps1
    │   ├── inspect_target_cols.ps1
    │   ├── inspect_target_layout.ps1
    │   ├── read_audit.js
    │   ├── read_audit_targets.js
    │   ├── excel_audit_results.json
    │   └── excel_audit_targets.json
    │
    └── scratch/                   # Các script phân tích mã nguồn cũ
        ├── scratch_analyze_scripts.js
        ├── scratch_breakdown_keys.js
        ├── scratch_check_handlers.js
        ├── scratch_check_listeners.js
        ├── scratch_check_payload.js
        ├── scratch_check_tabs.js
        ├── scratch_inspect.js
        ├── scratch_inspect.py
        ├── scratch_inspect_html.js
        ├── scratch_inspect_script5.js
        └── scratch_inspect_subd.js
```

---

## 🚀 Hướng Dẫn Vận Hành 1-Click

1. Kéo các file báo cáo mới từ Power BI vào thư mục:
   `C:\Users\HP\OneDrive - Heineken International\AA SS SubD\3. Tracking\Build Tool\Dashboard\thang 9`
2. Nhấp đúp chuột vào file:
   `scripts/Run_Update_September.bat` (hoặc file copy trên OneDrive).
3. Hệ thống sẽ tự động quét, kiểm toán số liệu, và mở Dashboard mới trên trình duyệt.
