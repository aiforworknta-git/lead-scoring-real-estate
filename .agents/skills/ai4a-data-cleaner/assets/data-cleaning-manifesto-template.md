# BIÊN BẢN KIỂM TOÁN LÀM SẠCH DỮ LIỆU (DATA CLEANING MANIFESTO)

**Dự án / Nguồn dữ liệu:** `{{project_name}}`  
**Ngày thực hiện:** `{{date}}`  
**Chuyên gia phụ trách:** Data Cleaner Specialist (AI4A)  
**Trạng thái kiểm toán:** `{{audit_status}}` (PASS / FAIL)

---

## 1. Thống Kê Tổng Quan Xử Lý

| Chỉ số | Trước Làm Sạch (Raw) | Sau Làm Sạch (Cleaned) | Chênh Lệch / Loại Bỏ | Ghi chú |
| :--- | :---: | :---: | :---: | :--- |
| **Tổng số dòng** | {{raw_rows}} | {{clean_rows}} | -{{removed_rows}} | Loại bỏ dòng rác không có ID/Area |
| **Số cột khai thác** | {{raw_cols}} | {{clean_cols}} | {{col_diff}} | Chuẩn hóa tên tiêu đề |
| **Giá trị Null / Rỗng** | {{null_before}} | 0 | -{{null_before}} | Đã gán giá trị mặc định an toàn |
| **Kích thước tệp** | {{raw_size}} | {{clean_size}} | -{{size_saved}} | Giảm nhờ loại bỏ dòng thừa |

---

## 2. Nhật Ký Biến Đổi Dữ Liệu (Transformation Log)

### A. Lọc Dòng & Loại Bỏ Ngoại Lệ
- [x] **Ghost Rows:** Đã loại bỏ `{{ghost_rows_count}}` dòng rỗng không có Mã định danh chính.
- [x] **Sheet rác:** Bỏ qua sheet `{{ignored_sheets}}` (tránh tràn bộ nhớ).
- [x] **Deduplication:** Loại bỏ `{{duplicate_count}}` bản ghi trùng lặp khóa chính.

### B. Ép Kiểu & Chuẩn Hóa Số Học
- [x] Chuyển đổi các cột số tiền tệ / sản lượng về kiểu `Number` / `Float`.
- [x] Thay thế toàn bộ phép chia có mẫu số = 0 bằng giá trị `0%` (Zero-Division Shield).

### C. Chuẩn Hóa Văn Bản & Tiếng Việt
- [x] Cắt bỏ khoảng trắng đầu/cuối (`Trim`) cho 100% cột dạng Text.
- [x] Định dạng mã hóa lưu trữ: **UTF-8 with BOM**.

---

## 3. Đối Soát Tổng Kiểm Tra (Reconciliation Checksum)

| Khoản mục đối soát | Tổng File Nguồn Hợp Lệ | Tổng File Sau Làm Sạch | Độ Lệch (Discrepancy) | Kết Luận |
| :--- | :---: | :---: | :---: | :---: |
| **Tổng Sản Lượng (Volume)** | {{sum_vol_raw}} | {{sum_vol_clean}} | **0** | ✅ Khớp 100% |
| **Tổng Giá Trị (Amount)** | {{sum_amt_raw}} | {{sum_amt_clean}} | **0** | ✅ Khớp 100% |
| **Tổng Số Thực Thể (Entities)** | {{count_entity_raw}} | {{count_entity_clean}} | **0** | ✅ Khớp 100% |

---

## 4. Khuyến Nghị Cho Bộ Phận Dashboard (`ai4a-dashboard-architect`)

- [ ] File dữ liệu sạch đã sẵn sàng tại: `{{clean_data_path}}`
- [ ] Khóa liên kết chính cần dùng: `{{primary_key_name}}`
- [ ] Các trường đã được tính sẵn: `{{pre_calculated_fields}}`
