# BIÊN BẢN KIỂM TOÁN CHẤT LƯỢNG PHÁT HÀNH (PRE-RELEASE QA CLEARANCE REPORT)

**Tên sản phẩm / Ấn phẩm:** `{{product_name}}`  
**Phiên bản / Kỳ báo cáo:** `{{version}}`  
**Ngày kiểm toán:** `{{date}}`  
**Kiểm toán viên:** Pre-release QA Gatekeeper (AI4A)  
**KẾT LUẬN CUỐI CÙNG:** `{{CLEARANCE_STATUS}}` *(PASS / BLOCKED)*

---

## 1. Bảng Đánh Giá 4 Cổng Kiểm Toán (The 4 Gatekeepers)

| Cổng Kiểm Toán | Nội Dung Đánh Giá | Trạng Thái | Số Lỗi Phát Hiện | Chi Tiết / Biện Pháp Xử Lý |
| :--- | :--- | :---: | :---: | :--- |
| **Cổng 1: Code & Syntax** | Cú pháp PowerShell, JavaScript, PSScriptAnalyzer warnings, giải phóng bộ nhớ COM | `{{gate1_status}}` | {{gate1_errors}} | Đã giải quyết triệt để cảnh báo unapproved verb & $null on left. |
| **Cổng 2: Data & Math** | Đối soát số học (Zero Discrepancy), bảo vệ phép chia cho 0, lọc sạch dòng rác | `{{gate2_status}}` | {{gate2_errors}} | Độ lệch số học bằng 0. Không còn lỗi NaN% hay Infinity. |
| **Cổng 3: Spelling & Font** | Chính tả tiếng Việt, dấu thanh, font UTF-8 with BOM, thuật ngữ FMCG | `{{gate3_status}}` | {{gate3_errors}} | Đã chuẩn hóa phông chữ và thuật ngữ SubD, Sell-In, Sell-Out, SCD. |
| **Cổng 4: Performance & UX** | Dung lượng file (< 1.5MB), mở trên Zalo Mobile, nút xuất ảnh card & copy | `{{gate4_status}}` | {{gate4_errors}} | Dung lượng tối ưu đạt chuẩn, mở mượt mà trên thiết bị di động. |

---

## 2. Chi Tiết Các Lỗi Đã Phát Hiện & Bản Vá Áp Dụng (Bug Fix Log)

### A. Lỗi Mã Nguồn (Code Fixes)
- [x] **Lỗi:** `{{code_bug_desc}}`
  - *Nguyên nhân:* {{code_bug_cause}}
  - *Bản vá áp dụng:* `{{code_fix_patch}}`

### B. Lỗi Dữ Liệu & Số Học (Data Fixes)
- [x] **Lỗi:** `{{data_bug_desc}}`
  - *Nguyên nhân:* {{data_bug_cause}}
  - *Bản vá áp dụng:* `{{data_fix_patch}}`

### C. Lỗi Chính Tả & Hiển Thị Phông Chữ (Typo & Encoding Fixes)
- [x] **Lỗi:** `{{typo_bug_desc}}`
  - *Khắc phục:* `{{typo_fix_desc}}`

---

## 3. Xác Nhận Điều Kiện Phát Hành (Release Checklist)

- [ ] Toàn bộ script đã được chạy thử nghiệm thành công không báo lỗi?
- [ ] Số liệu trên Dashboard khớp 100% với báo cáo tài chính/bán hàng gốc?
- [ ] Không có bất kỳ cảnh báo console đỏ nào trên trình duyệt?
- [ ] Đã kiểm tra tính năng gửi tin nhắn và xuất thẻ ảnh Zalo?
- [ ] File HTML và tài liệu đính kèm đã sẵn sàng bàn giao cho người dùng?
