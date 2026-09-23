## PDCA Log — Nhật Ký Cải Tiến

> **Hướng dẫn:** Ghi một entry mới sau mỗi lần thực hành PDCA với AI.  
> **Format:** Plan → Do → Check → Act  

---

<!-- Template: Copy và điền thông tin thật -->
<!--
## PDCA Log #[số thứ tự] — Buổi [X] — [Ngày]

### 📋 PLAN
- **Mục tiêu:** 
- **Output mong muốn:** 
- **Dữ liệu cần:** 
- **Prompt ban đầu:** 

### ✅ DO
- **Đã thực hiện:** 
- **Prompt thực tế đã dùng:** 
- **Output nhận được:** 

### 🔍 CHECK
- **Đạt mục tiêu không?** [Có / Không / Một phần]
- **Vấn đề gặp phải:** 
- **Điểm tốt cần giữ lại:** 

### 🔄 ACT
- **Thay đổi sẽ áp dụng lần sau:** 
- **Ghi nhớ:** 
-->

## PDCA Log #01 — Tự động hóa Báo cáo ERP & Phân tách File Phòng ban — 09/09/2026

### 📋 PLAN
- **Mục tiêu:** Xây dựng quy trình tự động hóa thay thế thao tác thủ công xử lý file ERP hàng tháng cho Operations Analyst.
- **Output mong muốn:** Bộ 4 file Excel phòng ban riêng biệt (có định dạng và công thức SUM) + 1 file báo cáo tổng quan điều hành Markdown + Skill `ai4a-erp-ops-reporter`.
- **Dữ liệu cần:** File export ERP mẫu 200 dòng `sample-data/THỰC HÀNH_ERP_OP_BigData_200rows.xlsx`.
- **Prompt ban đầu:** Sử dụng skill `ai4a-brainstorm` để thiết lập 4-field contract và tạo skill tự động hóa.

### ✅ DO
- **Đã thực hiện:** 
  1. Phân tích schema 8 cột và đối soát baseline 200 nhân sự.
  2. Tạo Skill `ai4a-erp-ops-reporter` với bộ script tự động hóa `scripts/process_erp.ps1`.
  3. Thực thi xử lý batch 2D array trong Excel COM, tính `Net_Salary`, tạo 4 file con và báo cáo điều hành.
- **Output nhận được:** 
  - 4 file Excel: `Sales_Report_2026_03.xlsx`, `HR_Report_2026_03.xlsx`, `Finance_Report_2026_03.xlsx`, `Operations_Report_2026_03.xlsx` tại `outputs/reports/departments/`.
  - Báo cáo tổng hợp: `outputs/reports/monthly_operations_summary.md`.

### 🔍 CHECK
- **Đạt mục tiêu không?** Có (100% hoàn thành).
- **Vấn đề gặp phải:** Lúc đầu ghi từng cell Excel COM bị chậm và lỗi ép kiểu; đã khắc phục bằng cách đẩy mảng 2D Object Array trực tiếp vào Excel Range.
- **Điểm tốt cần giữ lại:** Cơ chế kiểm toán đối soát Checksum tự động (Zero Discrepancy Diff = 0) giúp phát hiện sai lệch số liệu tức thì.

### 🔄 ACT
- **Thay đổi sẽ áp dụng lần sau:** Có thể mở rộng tham số `-SplitBy Manager` khi các quản lý muốn nhận báo cáo theo nhóm phụ trách trực tiếp.
- **Ghi nhớ:** Luôn đặt Human Checkpoint tại báo cáo tổng quan trước khi phân phối file ra bên ngoài.

