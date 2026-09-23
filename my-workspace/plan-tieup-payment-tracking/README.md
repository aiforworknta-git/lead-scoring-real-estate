# HEINEKEN PLAN TIE-UP 2026, OSR PAYMENT TRACKING & OSR FORM {OR1A} COPILOT
> **Thư mục dự án:** `D:\NTAN\AI For work\Agentic\my-workspace\plan-tieup-payment-tracking\`  
> **Điều phối Multi-Agent:** Chuẩn tác tử `ai4a-orchestrator` & `ai4a-dashboard-architect`  
> **Mẫu biểu OSR chuẩn:** `05_Template\OSR Anh Tài 66355958.xlsx`

---

## 🗂️ 1. Cấu Trúc Phân Nhóm Tác Vụ (Task-based Directory Structure)

Hệ thống được tổ chức khoa học thành 5 cụm thư mục tác vụ:

```text
my-workspace/plan-tieup-payment-tracking/
│
├── index.html                                # [EXECUTIVE DASHBOARD] Giao diện điều hành & Biểu mẫu OSR (133 KB)
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
│   ├── build_dashboard.js                    # Biên dịch Single-File HTML Dashboard & OSR Form
│   └── full_pipeline.ps1                     # Pipeline điều phối tự động toàn trình
│
├── 📁 03_Executive_Dashboard/                # [TÁC VỤ 3: GIAO DIỆN ĐIỀU HÀNH & TÁC CHIẾN]
│   ├── index.html                            # Dashboard độc lập trong folder tác vụ
│   └── Run_Tracking_Pipeline.bat             # Runner trong folder tác vụ
│
├── 📁 04_QA_Audit_Docs/                      # [TÁC VỤ 4: KIỂM TOÁN ĐỐI SOÁT & TÀI LIỆU]
│   ├── reconciliation_audit.md               # Biên bản kiểm toán đối soát sai số 0.00%
│   └── README.md                             # Bản sao tài liệu kỹ thuật
│
└── 📁 05_Template/                           # [TÁC VỤ 5: BIỂU MẪU CHUẨN DOANH NGHIỆP]
    └── OSR Anh Tài 66355958.xlsx             # Mẫu gốc OSR {OR1A} chuẩn của Heineken
```

---

## 🎯 2. Tổng Quan Các Phân Hệ Trên Dashboard

1. **📊 Tổng Quan & Phân Nhóm TPO:** Ma trận quản trị TPO (27 SubD), Non-TPO (8 SubD), TPO Abnormal (2 SubD); Top 5 đại lý ngân sách 2026 lớn nhất; Top 5 đợt chi lệch ngày sâu nhất.
2. **📋 Ma Trận Kế Hoạch Tái Ký (37 SubDs):** Tra cứu đầy đủ các chỉ số $Cost/Case$, Target cũ $\rightarrow$ mới, Target/Quý, Target/Tháng, Ngân sách 2026. Nút **"Form OSR ➔"** chuyển thẳng sang biểu mẫu OSR tương ứng của đại lý đó.
3. **💳 Giám Sát Chi Trả & Aging OSR (56 Đợt):** Bảng theo dõi tiến độ giải ngân từng đợt thanh toán (PAY 1/4, 2/4...), so sánh ngày hẹn với ngày chi thực tế, phân loại màu sắc tự động (Đúng hạn, Trễ nhẹ $1-15$ ngày, Trễ sâu $>15$ ngày, Chờ duyệt).
4. **📝 Biểu Mẫu OSR Chuẩn {OR1A} (Tích hợp từ file mẫu Anh Tài 66355958):**
   - Tái hiện 100% bố cục chuẩn văn bản **Outlet Sponsorship Requisition {OR1A}**:
     * **Mục A: General Info:** Outlet ID, Tên quán, Sức chứa, Điện thoại, Địa chỉ, SR (Nguyễn Thành Ân), Loại hình SUBDIST, Thương hiệu chính.
     * **Mục B: Distribution:** Mã NPP (10260176), Tên NPP (TG4 DNTN HỒNG PHƯƠNG).
     * **Mục C: Contract Term & Investment:** Thời hạn 12 tháng, Target Incentive, Fixed Cash, **Cost per Case**, Ghi chú căn cứ thẩm định.
     * **Mục D: Monthly Volume Target by SKU:** Bảng chi tiết sản lượng tháng của từng dòng bia (Larue, Tiger, Heineken Silver...).
     * **Mục E: Payment Schedule:** Lịch trình giải ngân từng đợt kèm mốc sản lượng tích lũy cần đạt.
     * **Mục F: Approval Matrix:** 3 cấp ký duyệt: SR (Nguyễn Thành Ân) $\rightarrow$ SE/SS/TL $\rightarrow$ ASM.
   - Menu chọn nhanh: Chuyển đổi giữa mẫu chuẩn **Anh Tài 66355958** hoặc bất kỳ đại lý nào trong 37 SubD kế hoạch.
   - Nút **"In Biểu Mẫu OSR Chuẩn A4"** căn chỉnh chuẩn theo khổ in A4.
   - Nút **"Copy Kịch Bản Trình Ký"** soạn sẵn tin nhắn gửi ASM/RSM duyệt hồ sơ.
5. **🎯 Hồ Sơ SubD 360° & Chốt Số Zalo 30s:** Xem toàn cảnh hồ sơ và copy kịch bản đàm phán gửi khách hàng/đại lý.
6. **⚖️ Kiểm Toán Đối Soát Số Liệu:** Cam kết sai số đối soát tuyệt đối **$0.00\%$**.

---

## 🚀 3. Hướng Dẫn Sử Dụng 1 Chạm

1. **Xem Dashboard ngay:** Nhấp đúp chuột vào [`index.html`](file:///d:/NTAN/AI%20For%20work/Agentic/my-workspace/plan-tieup-payment-tracking/index.html) ở thư mục gốc.
2. **Cập nhật dữ liệu từ Excel mới:** Nhấp đúp chuột vào [`Run_Tracking_Pipeline.bat`](file:///d:/NTAN/AI%20For%20work/Agentic/my-workspace/plan-tieup-payment-tracking/Run_Tracking_Pipeline.bat).
