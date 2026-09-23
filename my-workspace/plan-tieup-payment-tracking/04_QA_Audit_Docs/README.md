# HEINEKEN PLAN TIE-UP 2026 & OSR PAYMENT TRACKING COPILOT
> **Thư mục dự án:** `D:\NTAN\AI For work\Agentic\my-workspace\plan-tieup-payment-tracking\`  
> **Điều phối Multi-Agent:** Chuẩn tác tử `ai4a-orchestrator`  
> **Phân nhóm tác vụ:** Chia thành 4 cụm chuyên biệt theo đúng quy trình nghiệp vụ

---

## 🗂️ 1. Cấu Trúc Phân Nhóm Tác Vụ (Task-based Directory Structure)

Hệ thống được tổ chức khoa học thành 4 cụm thư mục tác vụ:

```text
my-workspace/plan-tieup-payment-tracking/
│
├── index.html                                # [EXECUTIVE DASHBOARD] Giao diện điều hành mở ngay (111 KB)
├── Run_Tracking_Pipeline.bat                 # [1-CLICK RUNNER] Cập nhật toàn bộ và tự mở Dashboard
├── README.md                                 # Tài liệu tổng quan dự án
│
├── 📁 01_Data_Mart/                          # [TÁC VỤ 1: NẠP & CHUẨN HÓA DỮ LIỆU]
│   ├── tracking_data_mart.json               # Data Mart hợp nhất SubD - Payment (73 KB)
│   └── plan_payment_data.json                # Dữ liệu trích xuất trung gian từ Excel
│
├── 📁 02_Pipeline_Scripts/                   # [TÁC VỤ 2: KỊCH BẢN XỬ LÝ & MÔ HÌNH HÓA]
│   ├── extract_data.ps1                      # Trích xuất dữ liệu Excel gốc qua PowerShell COM
│   ├── generate_datamart.js                  # Làm sạch, tính Aging lệch ngày & tổng hợp KPIs
│   ├── build_dashboard.js                    # Biên dịch Single-File HTML Dashboard
│   └── full_pipeline.ps1                     # Pipeline điều phối tự động toàn trình
│
├── 📁 03_Executive_Dashboard/                # [TÁC VỤ 3: GIAO DIỆN ĐIỀU HÀNH & TÁC CHIẾN]
│   ├── index.html                            # Dashboard độc lập dự phòng
│   └── Run_Tracking_Pipeline.bat             # Runner dự phòng trong folder tác vụ
│
└── 📁 04_QA_Audit_Docs/                      # [TÁC VỤ 4: KIỂM TOÁN ĐỐI SOÁT & TÀI LIỆU]
    ├── reconciliation_audit.md               # Biên bản kiểm toán đối soát sai số 0.00%
    └── README.md                             # Bản sao tài liệu kỹ thuật
```

---

## 🎯 2. Tổng Quan 4 Tác Vụ Cốt Lõi

### Tác Vụ 1: Nạp & Chuẩn Hóa Dữ Liệu (`01_Data_Mart/`)
- Lưu trữ bộ dữ liệu sạch đã được chuẩn hóa UTF-8 tiếng Việt.
- Dữ liệu liên kết 2 chiều giữa **37 Đại lý SubD** (Plan Tie-Up) và **56 Đợt Chi Trả** (OSR Payment Tracking).

### Tác Vụ 2: Kịch Bản Tự Động Hóa Pipeline (`02_Pipeline_Scripts/`)
- `extract_data.ps1`: Đọc trực tiếp từ file `Plan Tie-up - Target tracking.xlsx` của anh.
- `generate_datamart.js`: Tính toán chỉ số $Cost/Case$, số tháng chạy trong 2026, phân bổ Quý/Tháng và tính toán độ lệch ngày thanh toán (Aging Days: Trễ nhẹ, Trễ sâu).
- `build_dashboard.js`: Biên dịch file HTML duy nhất nhúng toàn bộ logic và dữ liệu.

### Tác Vụ 3: Giao Diện Điều Hành & Tác Chiến Zalo 30s (`03_Executive_Dashboard/`)
- Mở xem Dashboard trực tiếp không cần mạng, không cần web server.
- Tích hợp công cụ **"Copy Tin Nhắn Zalo 1 Chạm"** định dạng sẵn thông số hợp đồng và số tiền chi trả để gửi cho Quản lý / Đại lý.

### Tác Vụ 4: Kiểm Toán Đối Soát Chất Lượng (`04_QA_Audit_Docs/`)
- Biên bản kiểm toán đối soát chất lượng độc lập của `ai4a-qa-auditor`.
- Cam kết độ lệch số học tuyệt đối = **$0.00\%$** trên cả 9 trường chỉ tiêu tài chính và sản lượng.

---

## 🚀 3. Hướng Dẫn Sử Dụng 1 Chạm

1. **Xem Dashboard ngay:** Nhấp đúp chuột vào [`index.html`](file:///d:/NTAN/AI%20For%20work/Agentic/my-workspace/plan-tieup-payment-tracking/index.html) ở thư mục gốc.
2. **Cập nhật dữ liệu từ Excel mới:** Nhấp đúp chuột vào [`Run_Tracking_Pipeline.bat`](file:///d:/NTAN/AI%20For%20work/Agentic/my-workspace/plan-tieup-payment-tracking/Run_Tracking_Pipeline.bat) để tự động cập nhật và xem kết quả mới nhất.
