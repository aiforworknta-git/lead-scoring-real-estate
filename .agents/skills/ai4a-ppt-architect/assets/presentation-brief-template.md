# BẢN ĐẶC TẢ DÀN Ý SLIDE DECK ĐIỀU HÀNH (EXECUTIVE PRESENTATION BRIEF)

**Tên bài thuyết trình:** `{{deck_title}}`  
**Kỳ báo cáo / Sự kiện:** `{{event_name_or_date}}`  
**Đối tượng người nghe (Audience):** Ban Giám Đốc (ASM / RSM / BOD) / Đối tác NPP & SubD  
**Thời lượng trình bày:** 15 – 20 phút (Khoảng 8 – 12 slides)  
**Kiến trúc sư:** Executive PPT Architect (AI4A)

---

## 1. Bản Đồ Kể Chuyện (Story Arc: SCR Framework)

* **S - Situation (Bối cảnh):** `{{situation_desc}}`
* **C - Complication (Điểm nghẽn / Thách thức):** `{{complication_desc}}`
* **R - Resolution (Giải pháp & Đề xuất hành động):** `{{resolution_desc}}`

---

## 2. Chi Tiết Từng Slide (Slide-by-Slide Blueprint)

### Slide 1: Bìa Bài Thuyết Trình (Title Slide)
* **Tiêu đề chính:** `{{deck_title}}`
* **Phụ đề:** Phân Tích Hiệu Suất, Cảnh Báo Tồn Kho & Kế Hoạch Tác Chiến Tháng `{{month_year}}`
* **Thông tin người trình bày:** Đội ngũ Quản trị Bán hàng / Operations Analyst
* **Bố cục:** Nền tối sang trọng (Dark Green / Deep Blue), Logo công ty sắc nét.

---

### Slide 2: Tóm Tắt Điều Hành 60 Giây (Executive Summary)
* **Action Title:** `{{slide2_action_title}}` *(Ví dụ: "Tổng Sản Lượng Đạt 84k Thùng (22.4% Target); Trọng Tâm Nửa Cuối Tháng Là Giải Phóng Hàng Tồn Và Phủ Lại 3.1k Điểm Bán")*
* **Bố cục:** 3 Khối tóm tắt chính (3 Key Takeaways):
  1. *Hiệu suất Sell-In vs Sell-Out:* Đạt `{{si_pct}}%`, tỷ lệ $SO/SI$ đạt `{{so_si_pct}}%`.
  2. *Điểm nóng Tồn kho:* Có `{{high_scd_subd_count}}` SubD tồn kho $> 7\text{ ngày}$.
  3. *Cơ hội tăng trưởng:* `{{inactive_outlets_count}}` quán quen chưa mua hàng cần kích hoạt.

---

### Slide 3: Toàn Cảnh Chỉ Số Kinh Doanh (Key Metrics Spotlight)
* **Action Title:** `{{slide3_action_title}}` *(Ví dụ: "Tiến Độ Chỉ Tiêu Duy Trì Ổn Định Tại South 2, Cần Thúc Đẩy Nhanh Tốc Độ Về Đích Tại South 9")*
* **Bố cục:** Layout 1 - 4 Thẻ KPI to bản:
  * **Thẻ 1:** Target Tổng (`{{target_total}}` thùng)
  * **Thẻ 2:** Thực đạt Sell-In (`{{actual_si}}` thùng - `{{achieve_pct}}%`)
  * **Thẻ 3:** Bán lẻ Sell-Out (`{{actual_so}}` thùng - $SO/SI$: `{{so_si_pct}}%`)
  * **Thẻ 4:** Số lượng SubD hoạt động (`{{total_subds}}` SubD)
* **Biểu đồ:** Bar chart so sánh tiến độ 2 khu vực.

---

### Slide 4: Phân Tích Sâu Tồn Kho & Chu Kỳ Quay Vòng (SCD Inventory Analysis)
* **Action Title:** `{{slide4_action_title}}` *(Ví dụ: "Tồn Kho Trung Bình Toàn Vùng Đạt Ngưỡng An Toàn, Nhưng Cần Xử Lý Ngay Điểm Nghẽn Cận Date Của Nhóm Mã Trọng Điểm")*
* **Bố cục:** Layout 4 - Bảng dữ liệu 60% + Hộp kết luận hành động 40%:
  * Bảng: Top 5 SubD có số ngày tồn SCD cao nhất kèm mã SKU tương ứng.
  * Hộp Callout: Đề xuất triển khai gói Tailored Trade Scheme giải phóng hàng.

---

### Slide 5: Chiến Dịch Tác Chiến Đi Tuyến (Route Visit & Outlet Reactivation)
* **Action Title:** `{{slide5_action_title}}` *(Ví dụ: "Ưu Tiên Đi Tuyến Kích Hoạt 3.194 Quán Quen Chưa Lên Đơn Để Khóa Chặt Sản Lượng Sell-Out")*
* **Bố cục:** Layout 2 - So sánh đối ứng:
  * Bên trái: Cơ cấu các quán chưa phát sinh đơn theo địa bàn/tỉnh.
  * Bên phải: Lịch trình viếng thăm (Route Schedule) và chỉ tiêu tái kích hoạt tối thiểu 60% số quán.

---

### Slide 6: Kế Hoạch Hành Động & Phân Công Trách Nhiệm (Next Steps & RACI)
* **Action Title:** `{{slide6_action_title}}` *(Ví dụ: "Lộ Trình 4 Tuần Khép Kỷ Lục Doanh Số Tháng 09 Với Trách Nhiệm Rõ Ràng Cho Từng Vị Trí")*
* **Bố cục:** Layout 5 - Bảng lộ trình Timeline:
  | Thời gian | Trọng tâm hành động | Người chịu trách nhiệm (PIC) | Kết quả kỳ vọng |
  |---|---|---|---|
  | **Tuần 1 - 2** | Kiểm toán đối soát dữ liệu & phát hành thẻ Zalo 30s | Analyst / Commercial | 100% SubD nắm rõ số liệu |
  | **Tuần 3** | Đi tuyến kích hoạt Outlets chưa mua hàng | Sales Rep / Giám sát | Kích hoạt lại $\ge 1.500$ quán |
  | **Tuần 4** | Chốt đơn Sell-in bổ sung mã thiếu hàng | Sales Lead / SubD | Đạt mốc 100% Target tháng |
