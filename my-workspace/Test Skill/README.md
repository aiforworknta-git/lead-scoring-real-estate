# BỘ HƯỚNG DẪN KIẾN TRÚC DASHBOARD LỚN & ĐIỀU PHỐI MULTI-AGENT TRÊN GOOGLE DRIVE
> **Sản phẩm đóng gói bởi:** Chuyên gia `ai4a-ppt-architect` (AI4A - Agentic AI with Google Antigravity)  
> **Thư mục lưu trữ:** `D:\NTAN\AI For work\Agentic\my-workspace\Test Skill`

---

## 📌 1. Danh Mục Tệp Trong Thư Mục

| Tên Tệp | Định Dạng | Mô Tả Chi Tiết |
| :--- | :--- | :--- |
| **`huong-dan-dashboard-multi-agent.pptx`** | File PowerPoint (.pptx) | Slide thuyết trình 8 trang chuẩn **16:9 Widescreen**, thiết kế Executive McKinsey/BCG, bố cục thẻ card, typography phân cấp, phối màu Brand Palette. |
| **`index.html`** | Web Slide Deck tương tác | Bản trình chiếu HTML độc lập, mở ngay trên mọi trình duyệt, hỗ trợ phím mũi tên `←`/`→`, `Space`, phím `F` (Fullscreen), phím `S` (Speaker Notes) và in ấn PDF chuẩn 16:9. |
| **`slide-deck-blueprint.md`** | Tài liệu Đặc Tả (Markdown) | Bản thiết kế chi tiết SCR (Situation - Complication - Resolution), Action Titles, kịch bản thuyết trình (Speaker Notes) từng trang và sơ đồ thư mục Google Drive. |
| **`generate_pptx.ps1`** | Script PowerShell COM | Mã nguồn tự động hóa sinh file PowerPoint qua COM API (`PowerPoint.Application`), đảm bảo tính lặp lại (reproducible). |

---

## 🎯 2. Tóm Tắt 3 Trụ Cột Kiến Trúc Multi-Agent Trên Google Drive

```
📁 Google Drive Root: /DASHBOARD_ENTERPRISE_PROJECT/
├── 📁 00_RAW_INGESTION/             # [READ-ONLY] Input ERP/CRM thô (Không agent nào sửa)
├── 📁 01_CLEANSED_DATA/             # [OWNER: ai4a-data-cleaner] Dữ liệu chuẩn UTF-8
├── 📁 02_PRE_AGGREGATED/            # [OWNER: ai4a-dashboard-architect] Cubes nén < 1.5MB
├── 📁 03_DASHBOARD_CORE/            # [OWNER: ai4a-dashboard-architect] Single HTML UI & CSS
├── 📁 04_RELEASE_AUDIT/             # [OWNER: ai4a-qa-auditor] Chốt chặn sai số = 0
└── 📁 _SYNC_CONTROL/                # [ALL AGENTS] task_manifest.json & .pipeline.lock
```

1. **Kiến trúc 5 tầng thư mục phân lập:**  
   Tách bạch hoàn toàn ranh giới Đọc - Ghi. Đầu ra của Agent trước là đầu vào Chỉ Đọc (Read-only) của Agent sau. Tuyệt đối không cho phép 2 Agent cùng ghi lên 1 file.
2. **Giao thức State-Lock & Bàn giao bất biến (Hand-off Protocol):**  
   Agent nhận việc tạo file `.pipeline.lock`. Khi xử lý thì ghi ra file nháp `.tmp`. QA Auditor kiểm toán đối soát sai số $= 0.00\%$ và đóng dấu `audit_status = PASSED` trước khi thăng hạng file chính thức.
3. **Pre-aggregation Engine giảm tải 97%:**  
   Tuyệt đối không đẩy file dữ liệu thô 50MB lên giao diện. Tiền tổng hợp dữ liệu theo Fact/Dim (Chi nhánh, Quản lý, Tuần, SKU) giúp file dashboard $< 1.5\text{MB}$, mở tức thì $< 0.5\text{s}$ trên mobile và tích hợp bộ công cụ gửi ảnh thẻ Zalo 30s.

---

## 🚀 3. Hướng Dẫn Sử Dụng

### Cách 1: Mở Trực Tiếp Trình Chiếu HTML
- Nhấp đúp chuột vào file `index.html` hoặc mở bằng Google Chrome / Microsoft Edge.
- Bấm **`F`** để phóng to Toàn màn hình.
- Dùng **Mũi tên Trái / Phải** hoặc phím **Cách (Space)** để chuyển slide.
- Bấm **`S`** để xem kịch bản lời thoại diễn giả (Speaker Notes).

### Cách 2: Mở & Trình Chiếu File PowerPoint (.pptx)
- Mở file `huong-dan-dashboard-multi-agent.pptx` bằng Microsoft PowerPoint.
- Bấm **`F5`** để bắt đầu buổi thuyết trình với Ban Giám Đốc.
