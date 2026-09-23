# BÁO CÁO KIỂM TOÁN CHẤT LƯỢNG DỮ LIỆU & TRẠNG THÁI KHẮC PHỤC LỖI
> **Bộ phận kiểm định:** AI4A Data Cleaner & Sanitization Specialist  
> **Dự án:** HEINEKEN SEM Volume & Product Master Intelligence  
> **Thời gian cập nhật:** 2026-09-20 23:40 | Trạng thái: **PASSED (100% SKU Matched)**

---

## 1. Tổng Hợp Đối Soát Số Học Sau Hiệu Chỉnh (Reconciliation Summary)

| Chỉ tiêu | Trước khi sửa | Sau khi anh cập nhật | Trạng thái nghiệm thu |
| :--- | :---: | :---: | :--- |
| **Tổng SKU trong `Product Name.xlsx`** | 354 SKU | **358 SKU** | ✅ Đã bổ sung 6 SKU |
| **Dòng rác ký tự ',' trong Master** | 01 dòng (dòng 291) | **0 dòng** | ✅ **ĐÃ XÓA SẠCH** |
| **SKU trong Vol SEM chưa có trong Master** | 06 SKU | **0 SKU (0.0%)** | ✅ **100.0% KHỚP HOÀN HẢO** |
| **Tổng số dòng giao dịch SEM** | 721,376 | **721,376 bản ghi** | ✅ Bảo toàn nguyên vẹn 100% |
| **Tổng sản lượng đối soát** | 128,769,914.0 | **128,769,914.0 thùng** | ✅ **Zero Discrepancy (0.00%)** |

---

## 2. Chi Tiết Trạng Thái Khắc Phục Các Dị Thường (Anomalies Resolution Log)

### ✅ Bất thường 1: Dòng dữ liệu rác số 291 trong `Product Name.xlsx`
- **Trạng thái:** **ĐÃ GIẢI QUYẾT (RESOLVED)**
- **Chi tiết:** Dòng chứa ký tự dấu phẩy rác `,` đã được xóa sạch. Toàn bộ 358 SKU trong bảng Master hiện tại đều có tên SKU, Company và Sub Company chuẩn xác.

### ✅ Bất thường 2: 06 SKU phát sinh sản lượng thiếu trong Master Data
- **Trạng thái:** **ĐÃ GIẢI QUYẾT (RESOLVED)**
- **Chi tiết:** Anh đã nạp thành công 6 SKU vào bảng `Product Name.xlsx`:
  1. `Ken Phap Can 24s (330)` ➔ `HVN` | `HVN`
  2. `Saigon Lager Can 24s (250)` ➔ `Competitor` | `SBC`
  3. `Dai Ban Gold 24s (330)` ➔ `Competitor` | `GB`
  4. `Red Tiger 24s Can` ➔ `HVN` | `HVN`
  5. `Hanoi Bia Hoi Can 24s (500)` ➔ `Competitor` | `HBC`
  6. `Huda Ice Twist can 24s (250)` ➔ `Competitor` | `CB`
- **Kết quả:** Tỷ lệ khớp nối danh mục giữa Fact Table và Dimension Table đạt đúng **100.0%** (331/331 sản phẩm).

### ℹ️ Bất thường 3: 13 dòng có sản lượng âm (Negative Volume)
- **Trạng thái:** **ĐÃ GHI NHẬN & PHÂN LOẠI**
- **Chi tiết:** Ghi nhận 13 giao dịch trả hàng/điều chỉnh kiểm kê âm tại các điểm bán. Hệ thống giữ nguyên số liệu kế toán gốc để bảo toàn tổng sản lượng đối soát.

### ✅ Bất thường 4: Ký tự Non-breaking Space (`\xa0`)
- **Trạng thái:** **ĐÃ TỰ ĐỘNG CHUẨN HÓA**
- **Chi tiết:** Đã chuẩn hóa toàn bộ về ký tự space tiêu chuẩn.

### 🚨 Bất thường 5: Phát hiện 289 trường hợp sản lượng tăng đột biến giữa các tháng (Monthly Surges & Outliers Audit)
- **Trạng thái:** **ĐÃ PHÁT HIỆN & GẮN CỜ CẢNH BÁO (FLAGGED & HIGHLIGHTED)**
- **Chi tiết kiểm toán:**
  - **Cấp độ Điểm bán (Outlet Level):** Phát hiện 289 trường hợp điểm bán tạp hóa (Grocery Store) có sản lượng bình thường chỉ từ 0 – 60 thùng/tháng, nhưng bất ngờ tăng vọt lên **280,000 – 370,000 thùng** chỉ trong một tháng duy nhất (chênh lệch tròn số).
  - **Top Outlet bất thường:**
    1. `Outlet 68401501` (South 22 - Grocery Store): Jan 2026 (25) ➔ Feb 2026 (370,000) | Tăng +369,975 thùng (+1,479,900%).
    2. `Outlet 69502607` (South 4 - Grocery Store): Jun 2026 (60) ➔ Jul 2026 (290,000) | Tăng +289,940 thùng (+483,233%).
    3. `Outlet 68302923` (South 14 - Grocery Store): Jan 2026 (0) ➔ Feb 2026 (285,000) | Tăng +285,000 thùng.
    4. `Outlet 66205809` (South 6 - Grocery Store): May 2026 (0) ➔ Jun 2026 (280,000) | Tăng +280,000 thùng.
    5. `Outlet 66902257` (South 5 - Grocery Store): May 2026 (0) ➔ Jun 2026 (280,000) | Tăng +280,000 thùng.
    6. `Outlet 66651011` (South 15 - Grocery Store with Delivery): Jun 2026 (0) ➔ Jul 2026 (280,000) | Tăng +280,000 thùng.
    7. `Outlet 68404301` & `68404436` (South 22): Jun 2026 (19-20) ➔ Jul 2026 (280,000) | Tăng +279,980 thùng.
    8. `Outlet 68451150` (South 22): Apr 2026 (46) ➔ May 2026 (280,000) | Tăng +279,954 thùng.
  - **Nhận định rủi ro:** Dấu hiệu dồn kho ảo hoặc gán nhầm mã Nhà phân phối/SubD vào mã tiệm bán lẻ gia đình. Đã được đưa vào Tab Audit trên Dashboard để bộ phận ComEx và Finance đối soát thực địa.
  - **Cấp độ Khu vực (Area Level):**
    - `South 6`: Tháng 1 (1.02M) ➔ Tháng 2 (5.20M) do bùng nổ tiêu thụ mùa Tết miền Tây (+406.2%).
    - `South 22`: Tháng 1 (769k) ➔ Tháng 2 (1.57M) (+105.2%), sau đó tụt giảm trong tháng 3 và tăng vọt trở lại vào tháng 4 (1.05M).
    - `South 5`: Tháng 5 (1.07M) ➔ Tháng 6 (1.40M) (+30.7%).


