# ĐẶC TẢ THIẾT KẾ DASHBOARD ĐIỀU HÀNH (DASHBOARD SPECIFICATION)

**Tên hệ thống:** `{{dashboard_title}}`  
**Kỳ báo cáo:** `{{period}}`  
**Đối tượng sử dụng chính:** Giám đốc bán hàng / ASM / RSM / Đội ngũ Sales đi tuyến  
**Nền tảng đích:** Standalone Single File HTML (Tối ưu hóa hiển thị trên Máy tính & Zalo Mobile)  
**Kiến trúc sư:** Dashboard Architect (AI4A)

---

## 1. Mục Tiêu Quản Trị & Quyết Định Được Hỗ Trợ

| Cấp Quản Trị | Câu Hỏi Nghiệp Vụ Cần Trả Lời Ngay | Hành Động Hỗ Trợ Tức Thì |
| :--- | :--- | :--- |
| **ASM / RSM** | Tiến độ về đích tháng này đạt bao nhiêu %? Vùng nào đang hụt số? | Điều phối chỉ tiêu, can thiệp bổ sung cơ chế Trade Promo cho vùng yếu. |
| **Sales Rep / Giám Sát** | SubD nào đang ứ đọng vốn? SubD nào sắp đứt hàng cuối tuần? | Dùng bảng tính P&L để ép đại lý chốt đơn; giải phóng hàng tồn quá 7 ngày. |
| **Chủ SubD / NPP** | Tôi mua thêm bao nhiêu thùng thì đạt thưởng? Quán nào chưa mua hàng? | Nhận Thẻ tóm tắt 30 giây và danh sách quán cần Sales hỗ trợ thăm viếng qua Zalo. |

---

## 2. Kiến Trúc Thông Tin & Các Tab Chức Năng

### Tab 1: Tổng Quan Điều Hành (Executive Summary)
- **Hàng 1 - 5 Thẻ KPI Cốt Lõi:**
  1. Tổng Target Sell-In (Thùng)
  2. Thực Tế Nhập (Sell-In) & % Hoàn thành
  3. Bán Lẻ Thực Tế (Sell-Out) & Tỷ lệ $SO/SI$
  4. Số Lượng Đại Lý Đang Hoạt Động (Phân bổ theo Khu vực)
  5. Số Lượng Điểm Bán Chưa Lên Đơn (Non-ordering Alert)
- **Hàng 2 - Biểu Đồ Trực Quan:**
  - Biểu đồ Cột kép: So sánh Target vs Thực đạt giữa các Khu vực.
  - Biểu đồ Donut: Phân bổ rủi ro Tồn kho toàn mạng lưới (Đỏ / Vàng / Xanh).

### Tab 2: Bảng Điều Khiển Chi Tiết Thực Thể (Entity Hub)
- **Thanh Công Cụ Lọc Tức Thì:** Tìm kiếm theo Tên/Mã, Lọc theo Khu Vực, Lọc theo Trạng Thái Chương Trình, Lọc theo Mức Tồn Kho.
- **Action Cards:** Mỗi đối tượng là 1 thẻ trực quan gồm: Thanh tiến độ Target, Hộp chỉ số Sell-In/Out, Huy hiệu cảnh báo Tồn kho SCD, và Bộ công cụ Zalo.

### Tab 3: Trung Tâm Cảnh Báo Tồn Kho (SCD Exception Hub)
- Bảng lọc chuyên biệt các mã hàng (SKU) có $\text{SCD} > 7\text{ ngày}$ (Gợi ý: Chạy combo giải phóng hàng) và $\text{SCD} < 3\text{ ngày}$ (Gợi ý: Lên đơn bổ sung gấp).

### Tab 4: Danh Sách Điểm Bán Chưa Mua Hàng (Field Route Actions)
- Chi tiết Mã quán, Tên quán, Địa bàn, Tình trạng đơn hàng và Nút bấm *"Thêm vào lịch đi tuyến"*.

---

## 3. Quy Chuẩn Zalo Action Toolkit

```
[Khối Dữ Liệu SubD]
        │
        ├─► [Nút 1: Copy Zalo] ➔ Sao chép đoạn text chào hỏi & chốt số chuẩn vào Clipboard
        ├─► [Nút 2: Xuất Thẻ Ảnh] ➔ Render ảnh card đồ họa 520px qua html2canvas ➔ Tải về máy
        └─► [Nút 3: Chat Zalo] ➔ Mở trực tiếp link https://zalo.me/{phone}
```

- **Mẫu Tin Nhắn Zalo Chuẩn Hóa:**
  ```text
  ⭐ [THÔNG BÁO TIẾN ĐỘ] - {SubD_Name} ({SubD_ID})
  - Target Tháng: {Target} thùng | Đã nhập: {Actual_SI} thùng ({Achieve_Pct}%)
  - Bán lẻ Sell-Out: {Actual_SO} thùng (Tỷ lệ tiêu thụ: {SO_SI_Pct}%)
  - Tình trạng kho: {SCD} ngày tồn ({Warning_Text})
  - Điểm bán chưa lên đơn: {Inactive_Count} quán quen
  👉 Em gửi anh/chị chính sách hỗ trợ tuần này để kích hoạt lại các điểm bán nhé ạ!
  ```

---

## 4. Tiêu Chuẩn Kỹ Thuật (Technical Spec)

- **Định dạng file:** Standalone HTML5 (`<!DOCTYPE html>`).
- **Giới hạn kích thước:** $\le 1.5\text{ MB}$.
- **Thư viện tích hợp:** `ApexCharts` (Biểu đồ nhẹ), `Lucide Icons` (Biểu tượng SVG hiện đại), `html2canvas` (Chụp ảnh thẻ Zalo).
- **Mã hóa:** `UTF-8 with BOM`.
