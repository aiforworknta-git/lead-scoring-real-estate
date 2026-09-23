# HEINEKEN VIETNAM – DASHBOARD BRAND GUIDELINES

Tài liệu hướng dẫn chuẩn mực nhận diện thương hiệu (Brand Guidelines) dành riêng cho việc thiết kế, xây dựng và phát triển hệ thống **Data Dashboard / Business Intelligence (BI)** tại Heineken Việt Nam (Power BI, Tableau, Qlik, Excel).

---

## 1. BẢNG MÀU THƯƠNG HIỆU (BRAND COLOR PALETTE)

Để đảm bảo Dashboard vừa mang tính nhận diện thương hiệu cao vừa tối ưu hóa khả năng đọc dữ liệu (Data Visualization), bảng màu được chia thành các nhóm chính:

### 1.1. Màu chính (Primary Brand Colors)

Sử dụng cho các yếu tố định danh chính: Header, Navigation bar, KPI quan trọng, đường kẻ chính, hoặc thanh điểm nhấn.

| Tên màu | Mã HEX | Mã RGB | Ứng dụng trong Dashboard |
| :--- | :--- | :--- | :--- |
| **Heineken Green** | `#008200` | `rgb(0, 130, 0)` | Màu thương hiệu chủ đạo, tiêu đề KPI chính, trạng thái Đạt (Success/Positive). |
| **Star Red** | `#E31B23` | `rgb(227, 27, 35)` | Ngôi sao thương hiệu, điểm nhấn dữ liệu đặc biệt, Cảnh báo/Chưa đạt (Alert/Negative). |
| **Heineken Black** | `#000000` | `rgb(0, 0, 0)` | Text chính, Sidebar nền tối (Dark mode), khung viền sắc nét. |
| **Silver / White** | `#FFFFFF` | `rgb(255, 255, 255)` | Nền Dashboard (Light mode), Nền thẻ dữ liệu (KPI Card). |

### 1.2. Màu bổ trợ & Biểu đồ (Data Visualization Colors)

| Tên màu | Mã HEX | Tác dụng trong biểu đồ |
| :--- | :--- | :--- |
| **Deep Forest Green** | `#004D00` | Chuỗi dữ liệu 1 (Doanh thu / Sản lượng thực tế) |
| **Bright Green** | `#20D020` | Chuỗi dữ liệu 2 (Tăng trưởng / Dự báo) |
| **Warm Gold** | `#FFC72C` | Trạng thái Chờ / Trung tính (Warning / On Track) |
| **Steel Blue** | `#1C698D` | Dữ liệu đối sánh / Chuỗi dữ liệu phụ |
| **Cool Grey** | `#888888` | Dữ liệu Kế hoạch (Target / Benchmark) |

### 1.3. Màu nền & Trung tính (Neutral & Background Colors)

* **Main Background (Light Mode):** `#F4F6F8` (Xám nhạt giúp giảm mỏi mắt)
* **Card / Container Background:** `#FFFFFF` (Trắng)
* **Border / Divider:** `#E0E4E8` (Xám kẻ mảnh)
* **Text Primary:** `#1A1A1A`
* **Text Secondary:** `#666666`

---

## 2. QUY CHUẨN MÃ MÀU THEO BRAND PORTFOLIO & SKU

Khi thiết kế biểu đồ so sánh sản lượng/doanh số giữa các Brand hoặc phân tích sâu đến cấp SKU, **bắt buộc** áp dụng đúng mã màu dưới đây để đảm bảo tính đồng bộ trên toàn bộ hệ thống báo cáo.

### 2.1. Mã màu cấp Thương hiệu (Brand Level)

| Brand | Dòng sản phẩm | Màu chủ đạo (Primary) | Mã HEX | RGB |
| :--- | :--- | :--- | :--- | :--- |
| **Heineken** | Original / Silver / 0.0 | Heineken Green | `#008200` | `rgb(0, 130, 0)` |
| | | Corporate Green | `#205527` | `rgb(32, 85, 39)` |
| | | Heineken Red | `#FF2B00` | `rgb(255, 43, 0)` |
| | | Silver Grey | `#C3C3C3` | `rgb(195, 195, 195)` |
| | | Electric Blue | `#00D2FF` | `rgb(0, 210, 255)` |
| **Tiger** | Tiger Regular | Tiger Blue | `#002B66` | `rgb(0, 43, 102)` |
| | | Tiger Orange/Gold | `#E8891A` | `rgb(232, 137, 26)` |
| | Tiger Crystal | Crystal Blue / Silver | `#00A3E0` | `rgb(0, 163, 224)` |
| **Bia Việt** | Bia Việt / Cold Pure | Viet Red | `#DA291C` | `rgb(218, 41, 28)` |
| | | Viet Gold/Yellow | `#FFC72C` | `rgb(255, 199, 44)` |
| **Larue** | Larue Original / Smooth | Larue Blue | `#0033A0` | `rgb(0, 51, 160)` |
| | | Larue Yellow/Gold | `#FFB81C` | `rgb(255, 184, 28)` |
| **Bivina** | Bivina | Bivina Red | `#C8102E` | `rgb(200, 16, 46)` |
| | | Bivina Gold | `#EAAA00` | `rgb(234, 170, 0)` |
| **Edelweiss** | Wheat Beer | Alpine Navy | `#0A192F` | `rgb(10, 25, 47)` |
| | | Snow Ice Blue | `#88D4E4` | `rgb(136, 212, 228)` |
| **Strongbow** | Cider | Cider Gold / Yellow | `#EAAA00` | `rgb(234, 170, 0)` |
| | | Berry Red / Dark Pink | `#A6192E` | `rgb(166, 25, 46)` |

### 2.2. Mã màu chi tiết theo SKU (SKU Level Detail)

| Brand | Mã SKU / Tên SKU | Mã HEX | RGB | Ghi chú Visual |
| :--- | :--- | :--- | :--- | :--- |
| **Heineken** | `HEN_CAN_330` (Heineken Original Lon 330ml) | `#008200` | `0, 130, 0` | Mảng màu xanh chuẩn Original |
| | `HEN_BTL_330` (Heineken Original Chai 330ml) | `#005A00` | `0, 90, 0` | Xanh đậm hơn phân biệt Chai/Lon |
| | `HEN_SLK_330` (Heineken Silver Lon Cao 330ml) | `#00D2FF` | `0, 210, 255` | Accent Electric Cyan / Silver |
| | `HEN_BTL_SIL` (Heineken Silver Chai 330ml) | `#95A5A6` | `149, 165, 166` | Xám bạc kim loại |
| | `HEN_ZERO_330` (Heineken 0.0 Lon 330ml) | `#0051A8` | `0, 81, 168` | Blue Accent (Đặc trưng dòng 0.0) |
| **Tiger** | `TIG_CAN_330` (Tiger Regular Lon 330ml) | `#002B66` | `0, 43, 102` | Tiger Navy Blue |
| | `TIG_BTL_330` (Tiger Regular Chai 330ml) | `#E8891A` | `232, 137, 26` | Amber / Tiger Gold |
| | `TIG_CRY_CAN` (Tiger Crystal Lon 330ml) | `#00A3E0` | `0, 163, 224` | Ice Crystal Blue |
| | `TIG_CRY_BTL` (Tiger Crystal Chai 330ml) | `#80D8FF` | `128, 216, 255` | Light Ice Blue |
| | `TIG_SOJU_330` (Tiger Soju Series) | `#00A859` | `0, 168, 89` | Green Lime Accent |
| **Bia Việt** | `BVT_CAN_330` (Bia Việt Lon 330ml) | `#DA291C` | `218, 41, 28` | Viet Red |
| | `BVT_COLD_330` (Bia Việt Cold Pure Lon 330ml) | `#009688` | `0, 150, 136` | Teal Cold Pure |
| **Larue** | `LAR_CAN_330` (Larue Original Lon 330ml) | `#0033A0` | `0, 51, 160` | Larue Deep Blue |
| | `LAR_SMO_330` (Larue Smooth Lon 330ml) | `#FFB81C` | `255, 184, 28` | Larue Gold / Yellow |
| **Bivina** | `BIV_CAN_330` (Bivina Lon 330ml) | `#C8102E` | `200, 16, 46` | Bivina Red |
| **Edelweiss**| `EDL_CAN_330` (Edelweiss Wheat Beer 330ml) | `#0A192F` | `10, 25, 47` | Alpine Midnight Navy |
| **Strongbow**| `STR_GLD_330` (Strongbow Gold Apple) | `#EAAA00` | `234, 170, 0` | Cider Gold |
| | `STR_BER_330` (Strongbow Red Berries) | `#A6192E` | `166, 25, 46` | Berry Red |
| | `STR_DAR_330` (Strongbow Dark Fruit) | `#4A154B` | `74, 21, 75` | Dark Purple |

---

## 3. KIỂU CHỮ (TYPOGRAPHY)

### 3.1. Phông chữ quy định (Primary Font Family)

* **Font chuẩn thương hiệu:** `Heineken Sans` (Nếu có giấy phép)
* **Font thay thế chuẩn UI/BI:** `Roboto`, `Arial`, hoặc `Inter` (Ưu tiên font sans-serif không chân để hiển thị rõ ràng số liệu).

### 3.2. Phân cấp cỡ chữ (Hierarchy & Sizing)

| Cấp độ | Kích thước (px) | Font Weight | Trường hợp sử dụng |
| :--- | :--- | :--- | :--- |
| **Dashboard Title** | 24px - 28px | Bold (700) | Tên Dashboard chính (VD: *HEINEKEN VIETNAM - SALES PERFORMANCE*) |
| **Section Header** | 18px - 20px | Semi-Bold (600) | Tên phân vùng / Tên thẻ lớn |
| **KPI Value** | 28px - 36px | Bold (700) | Con số KPI nổi bật (VD: **1,250,000 Hectoliters**) |
| **Card Title / Chart Title** | 14px - 16px | Medium (500) | Tiêu đề của từng biểu đồ, thẻ KPI |
| **Body / Table Content** | 12px - 14px | Regular (400) | Dữ liệu bảng, nhãn trục biểu đồ, ghi chú |
| **Caption / Subtext** | 10px - 11px | Light / Italic | Ghi chú nguồn dữ liệu, thời gian cập nhật (*Updated: 15 mins ago*) |

---

## 4. QUY TẮC BỐ CỤC & VISUALIZATION (LAYOUT & VISUAL RULES)

### 4.1. Grid & Spacing

* **Bố cục dạng lưới (Grid System):** 12 cột (12-Column Grid).
* **Khoảng cách giữa các Card (Gutter):** 16px - 20px.
* **Margin ngoài cùng:** 24px.
* **Bo góc Card (Border Radius):** 6px - 8px.

### 4.2. Nguyên tắc biểu diễn dữ liệu theo Brand & Packaging

1. **Đồng nhất thương hiệu:** Khi vẽ biểu đồ so sánh sản lượng/doanh số giữa các Brand (Stacked Bar, Clustered Bar, Line Chart), **bắt buộc** dùng đúng màu đại diện thương hiệu. Không sử dụng dải màu mặc định của BI tool.
2. **Quy tắc phân biệt Bao bì (Packaging / Form Factor):**
   * **Lon (Can):** Dùng màu **Primary Solid** của thương hiệu.
   * **Chai (Bottle):** Dùng tông màu **Sẫm hơn 15-20%** so với màu chính.
   * **Keg / Draught (Bia tươi):** Dùng màu **Metallic/Silver** kết hợp đường viền màu chuẩn Brand.

---

## 5. BỘ CẤU HÌNH POWER BI THEME (JSON CONFIG)

Anh có thể copy đoạn mã bên dưới và nạp trực tiếp vào Power BI (`View` -> `Themes` -> `Browse for themes`) để tự động đồng bộ dải màu chuẩn theo Brand & SKU:

```json
{
  "name": "Heineken_VN_Portfolio_SKU_Theme",
  "dataColors": [
    "#008200", 
    "#00D2FF", 
    "#0051A8", 
    "#002B66", 
    "#00A3E0", 
    "#00A859", 
    "#DA291C", 
    "#009688", 
    "#0033A0", 
    "#FFB81C", 
    "#EAAA00", 
    "#A6192E"
  ],
  "background": "#FFFFFF",
  "foreground": "#205527",
  "tableAccent": "#008200"
}
```

---

## 6. DOS & DON'TS (NHỮNG ĐIỀU NÊN & KHÔNG NÊN)

### ✅ NÊN (DOS)

* Giữ không gian trống (White space) hợp lý để Dashboard không bị rối mắt.
* Sử dụng màu `Star Red` (`#E31B23`) một cách tiết chế – chỉ dùng cho cảnh báo hoặc dữ liệu thực sự cần sự chú ý khẩn cấp.
* Đảm bảo độ tương phản cao giữa chữ và nền để dễ theo dõi trong phòng họp.

### ❌ KHÔNG NÊN (DON'TS)

* Không dùng quá 5 màu khác nhau trong cùng một biểu đồ đơn giản.
* Không sử dụng màu sắc ngẫu nhiên không nằm trong Brand Portfolio Palette.
* Không dùng hiệu ứng 3D cho biểu đồ (Bar Chart 3D, Pie Chart 3D) làm méo tỷ lệ dữ liệu.
* Không làm bóp méo tỷ lệ Logo Heineken hoặc đổi màu Logo trái quy định.