# BIỂU MẪU ĐỀ XUẤT TÁI KÝ HỢP ĐỒNG ĐIỂM BÁN (ON-PREMISE SALES RETIE-UP - OSR FORM)
> **Mã biểu mẫu:** `HEINEKEN-VN-OSR-2026-V1`  
> **Áp dụng:** Kênh Tiêu Dùng Tại Chỗ (On-Premise) & Đại Lý Bán Sỉ/Lẻ SubD

---

### PHẦN 1: HỒ SƠ PHÁP LÝ & ĐỊA BÀN ĐIỂM BÁN (OUTLET PROFILE)

* **Mã điểm bán (Outlet ID):** `{{outlet_code}}`
* **Tên điểm bán (Outlet Name):** `{{outlet_name}}`
* **Mô hình kinh doanh (Channel):** `{{channel}}`
* **Địa chỉ kinh doanh:** `{{address}}` — `{{city}}`
* **Khu vực thương mại:** `{{area_name}}` (South 2 / South 9)
* **Nhà Phân Phối / SubD trực tiếp cấp hàng:** `{{subd_id}}` — `{{subd_name}}`
* **Đại diện Sales Rep phụ trách tuyến:** `{{sales_rep_name}}` (SĐT: `{{sales_rep_phone}}`)

---

### PHẦN 2: BÁO CÁO HIỆU QUẢ HỢP ĐỒNG CHU KỲ CŨ (PAST PERFORMANCE REVIEW)

| Chỉ Tiêu Đánh Giá | Hợp Đồng Cũ Cam Kết | Thực Đạt Kỳ Này | Tỷ Lệ Hoàn Thành (%) | Đánh Giá Hiệu Suất |
| :--- | :---: | :---: | :---: | :--- |
| **Tổng sản lượng bia (Thùng)** | `{{contract_target}}` thùng | `{{actual_volume}}` thùng | **`{{achieve_pct}}%`** | `{{performance_status}}` |
| **Tần suất lên đơn hàng** | $\ge 4\text{ đơn/tháng}$ | `{{orders_month}}` đơn | - | `{{order_consistency}}` |
| **Giá trị tài trợ chu kỳ cũ** | `{{old_grant_vnd}}` VNĐ | - | - | Gói tài trợ hiện hữu |
| **Chi phí tài trợ thực tế (Cost/Case)** | $\le 20.000\text{ đ/thùng}$ | **`{{cost_per_case}}` đ/thùng** | - | `{{cost_compliance_status}}` |
| **Phân Hạng Điểm Bán (Tier)** | - | **TIER `{{tier}}`** | - | `{{tier_description}}` |

---

### PHẦN 3: ĐỀ XUẤT TÀI TRỢ & CAM KẾT CHU KỲ MỚI (RETIE-UP SCHEME PROPOSAL)

* **Khuyến nghị từ Hệ thống AI Commercial:** `{{recommendation_action}}`
* **Lý do & Căn cứ phê duyệt:** `{{recommendation_rationale}}`

#### Chi Tiết Gói Đầu Tư & Chỉ Tiêu Đợt Mới (Thời hạn 6 - 12 tháng):
1. **Chỉ tiêu sản lượng cam kết mới:** `{{suggested_target}}` thùng / tháng (Tối thiểu $50\%$ Focus AA: Heineken Silver / Tiger Crystal).
2. **Tổng ngân sách tài trợ đề xuất:** `{{suggested_grant_vnd}}` VNĐ, phân bổ thành:
   - *Tài trợ tài sản cố định / POSM:* Hộp đèn biển hiệu, dù bạt, ly bia, khay phục vụ (Trị giá: `{{posm_grant_vnd}}` VNĐ).
   - *Thưởng sản lượng (Performance Rebate):* `{{rebate_per_case}}` VNĐ / thùng bán ra vượt mốc $80\%$ cam kết.
   - *Hỗ trợ PG & Sampling:* `{{pg_support_detail}}`.

---

### PHẦN 4: KỊCH BẢN ĐÀM PHÁN THỰC CHIẾN CHO SALES REP (NEGOTIATION PITCH)

> **Lời thoại 30 giây khi tiếp xúc Chủ quán:**  
> *"{{negotiation_pitch_script}}"*

---

### PHẦN 5: CHỮ KÝ XÁC NHẬN THỎA THUẬN (SIGN-OFF)

| Đại Diện Điểm Bán (Chủ Quán) | Đại Diện SubD Cấp Hàng | Đại Diện Thương Mại Heineken |
| :---: | :---: | :---: |
| *(Ký và ghi rõ họ tên)* | *(Ký và đóng dấu)* | *(Ký duyệt ASM / RSM)* |
| <br><br><br>Ngày: ..../..../2026 | <br><br><br>Ngày: ..../..../2026 | <br><br><br>Ngày: ..../..../2026 |
