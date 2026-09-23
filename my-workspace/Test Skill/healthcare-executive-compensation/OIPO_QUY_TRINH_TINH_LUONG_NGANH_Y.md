# QUY TRÌNH TÍNH LƯƠNG NHÂN SỰ CẤP CAO NGÀNH Y TẾ & PHÂN TÍCH QUỸ LƯƠNG (OIPO SPECIFICATION)

> **Chuyên đề:** Quy Trình Tính Lương 3P Đặc Thù Y Tế & Kiểm Soát Quỹ Lương Ban Điều Hành / Trưởng Khoa Lâm Sàng  
> **Khung thiết kế:** `ai4a:brainstorm --oipo` (AI4A - Agentic AI with Google Antigravity)  
> **Mentor:** MT Đức Thuận  
> **Đối tượng áp dụng:** Bệnh Viện Đa Khoa Quốc Tế / Bệnh Viện Tư Nhân Quy Mô Lớn  
> **Phạm vi thẩm định:** 12 Nhân sự Cấp cao (C-Suite & Trưởng Khoa Mũi Nhọn) trong 24 Tháng  

---

## 1. Bản Hợp Đồng Thực Thi Cốt Lõi (The 4-Field Contract)

| Trường hợp đồng | Nội dung cam kết chuẩn hóa |
| :--- | :--- |
| **1. Outcome (Kết quả đầu ra)** | • Bộ tài liệu quy trình tính lương 3P chuẩn y tế (SOP & Flowchart OIPO).<br>• Dữ liệu mẫu 24 tháng (288 bản ghi chi tiết) dạng CSV & JSON chuẩn UTF-8.<br>• Báo cáo Phân tích Đánh giá Quỹ Lương gửi Sếp / Hội đồng Quản trị chuẩn Kim tự tháp Minto.<br>• Interactive Executive Dashboard HTML độc lập (< 500KB) mở offline tức thì. |
| **2. Constraints (Ràng buộc)** | • Tuân thủ Luật Lao động, trần đóng BHXH/BHYT bắt buộc (tối đa 20 lần lương cơ sở).<br>• Thuế TNCN tính đúng theo biểu thuế lũy tiến từng phần 7 bậc (bậc cao nhất 35%).<br>• Tỷ lệ quỹ lương cấp cao / Tổng doanh thu lâm sàng khống chế trong ngưỡng an toàn: **$1.8\% - 2.5\%$**.<br>• Chốt chặn an toàn y khoa: Phạt/giảm 100% P3 nếu để xảy ra sự cố y khoa nghiêm trọng (*Sentinel Event*). |
| **3. Non-goals (Phạm vi không làm)** | • Không can thiệp vào quy chế lương của khối điều dưỡng, hộ lý và nhân viên hành chính cấp dưới.<br>• Không can thiệp vào chính sách bảo hiểm trách nhiệm nghề nghiệp y tế của từng cá nhân. |
| **4. Acceptance Criteria (Tiêu chí nghiệm thu)** | • 100% công thức tính toán toán học không sai lệch ($P1 + P2 + P3 + Bonus = Gross$).<br>• Độ lệch số học giữa bảng dữ liệu chi tiết và báo cáo tổng hợp = **$0.00\%$**.<br>• Dashboard mở mượt mà trên Chrome/Edge/Safari, có khả năng lọc đa chiều theo 12 lãnh đạo. |

---

## 2. So Sánh Các Phương Án Kiến Trúc (Approach Trade-off Matrix)

| Tiêu chí | Phương án 1: Lương Khoán Cố Định (Fixed Retainer) | Phương án 2: Mô Hình 3P Y Tế Chuyên Biệt (Recommended) | Phương án 3: Chia Sẻ Doanh Thu Thuần (Revenue Sharing) |
| :--- | :--- | :--- | :--- |
| **Bản chất mô hình** | Trả một mức lương Gross cố định hàng tháng (150M - 300M) không phụ thuộc số ca mổ. | Kết hợp 3P: P1 (Vị trí) + P2 (Học hàm/Học vị/Chứng chỉ) + P3 (Thù lao ca mổ, an toàn y khoa & KPI). | Trả lương cơ bản thấp, chia % trực tiếp trên doanh thu viện phí/khoa phòng. |
| **Ưu điểm cốt lõi** | Đơn giản, dễ tính toán, chi phí dự báo cố định 100%. | **Cân bằng tối ưu giữa giữ chân chuyên gia đầu ngành và thúc đẩy sản lượng chuyên môn, bảo vệ an toàn người bệnh.** | Bác sĩ có động lực tối đa kéo doanh thu bệnh nhân VIP. |
| **Nhược điểm / Rủi ro** | Bác sĩ thiếu động lực mổ các ca khó, ca cấp cứu đêm; nguy cơ ỳ trệ chuyên môn. | Phức tạp trong khâu đối soát dữ liệu phẫu thuật từ hệ thống HIS/EMR. | Rủi ro lạm chỉ định cận lâm sàng/thuốc, xung đột đạo đức y khoa, quỹ lương bùng nổ khi doanh thu tăng. |
| **Key Assumption** | Bác sĩ tự giác duy trì đạo đức và hiệu suất cao nhất. | **Hệ thống HIS/EMR ghi nhận chính xác mã ca mổ và kíp mổ theo thời gian thực.** | Kiểm soát được tính minh bạch và tránh lạm dụng xét nghiệm. |
| **Điểm gãy đầu tiên** | Bác sĩ giỏi rời đi sang bệnh viện tư đối thủ có thù lao mổ cao hơn. | Quy trình thẩm định ca mổ bị chậm trễ gây chậm ngày trả lương. | Bị cơ quan bảo hiểm/thanh tra tuýt còi vì chi phí điều trị đội giá bất thường. |

👉 **Lựa chọn tối ưu:** **Phương án 2 (Mô hình 3P Y Tế Chuyên Biệt)** - Chuẩn mực vận hành tại các hệ thống bệnh viện đa khoa quốc tế hàng đầu (Vinmec, FV, Hoàn Mỹ, Tâm Anh).

---

## 3. Đặc Tả Quy Trình OIPO 4 Bước Chi Tiết

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. OBJECTIVE (MỤC TIÊU NGHIỆP VỤ)                                                      │
│ • Thu hút & giữ chân đội ngũ Bác sĩ đầu ngành, Giáo sư, Tiến sĩ chuyên môn cao.       │
│ • Thúc đẩy năng suất phẫu thuật / thủ thuật chuyên sâu gắn liền với An toàn Người bệnh.│
│ • Kiểm soát chặt chẽ tỷ lệ Quỹ lương Ban Lãnh đạo trong biên độ an toàn <= 2.2% Doanh thu.│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. INPUT (DỮ LIỆU ĐẦU VÀO)                                                             │
│ • HIS / EMR: Số ca phẫu thuật phân loại (Đặc biệt, Loại 1, Loại 2), danh sách kíp mổ. │
│ • Báo cáo Tài chính Khoa: Doanh thu giường, dịch vụ kỹ thuật, khám VIP của từng khoa.   │
│ • Khảo sát CSAT: Tỷ lệ hài lòng người bệnh nội trú/ngoại trú (ngưỡng chuẩn >= 95%).   │
│ • Biên bản An toàn Y khoa: Sự cố y khoa (Incident Reports / Sentinel Events) trong kỳ. │
│ • Hồ sơ Nhân sự: Học hàm, học vị, giấy phép hành nghề, chứng chỉ kỹ thuật cao.         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. PROCESS (LOGIC TÍNH TOÁN & CÔNG THỨC 3P)                                            │
│ [BƯỚC 1]: Xác định P1 (Vị trí) & P2 (Năng lực học thuật/thâm niên).                    │
│ [BƯỚC 2]: Tính toán P3 Chuyên môn = (Thù lao ca mổ x Hệ số) + (KPI An toàn CSAT)       │
│           + (Thưởng hiệu quả tài chính khoa phòng).                                    │
│ [BƯỚC 3]: Áp dụng chốt chặn Chế tài An toàn Y khoa (Giảm 50-100% P3 nếu có tai biến). │
│ [BƯỚC 4]: Tính thưởng năm / Lễ Tết + Khấu trừ BHXH (trần) + Thuế TNCN lũy tiến 7 bậc.  │
│ [BƯỚC 5]: Phê duyệt 3 cấp: Phòng KHTH -> Kế Toán Lương -> Giám Đốc BV duyệt chuyển khoản│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. OUTPUT (KẾT QUẢ ĐẦU RA BÀN GIAO)                                                    │
│ • Bảng thanh toán lương chi tiết từng Bác sĩ (Payslip bảo mật).                       │
│ • File ủy nhiệm chi ngân hàng (Bank Transfer Order).                                   │
│ • Báo cáo Kiểm toán Quỹ Lương & Phân tích ROI Nhân Tài gửi Hội Đồng Quản Trị.        │
│ • Dashboard điều hành theo dõi xu hướng 24 tháng.                                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Công Thức Tính Lương 3P Đặc Thù Ngành Y

$$\mathbf{Gross\ Salary} = \mathbf{P1} + \mathbf{P2} + \mathbf{P3} + \mathbf{Bonus}_{\text{Tet/Year}}$$

### 4.1. Lương Vị Trí Cấp Bậc (P1 - Position Salary)
* Áp dụng theo thang ngạch chức vụ lãnh đạo quản lý:
  * Giám đốc Bệnh viện (CEO/CMO): **$120,000,000\text{ đ/tháng}$**
  * Phó Giám đốc Chuyên môn Khối: **$90,000,000\text{ đ/tháng}$**
  * Giám đốc Vận hành (COO) / Tài chính (CFO): **$80,000,000 - 85,000,000\text{ đ/tháng}$**
  * Trưởng khoa Lâm sàng mũi nhọn: **$70,000,000 - 80,000,000\text{ đ/tháng}$**

### 4.2. Lương Năng Lực & Học Hàm Học Vị (P2 - Person Salary)
* Đãi ngộ chất xám y khoa dựa trên bằng cấp và uy tín chuyên môn:
  * Giáo sư (GS.TS.BS): $+50,000,000\text{ đ/tháng}$
  * Phó Giáo sư (PGS.TS.BS): $+45,000,000\text{ đ/tháng}$
  * Tiến sĩ Y khoa / Bác sĩ Chuyên khoa II (TS.BS.CKII): $+35,000,000 - 40,000,000\text{ đ/tháng}$
  * Thạc sĩ Y khoa / Bác sĩ Chuyên khoa I: $+25,000,000 - 30,000,000\text{ đ/tháng}$

### 4.3. Lương Hiệu Suất & Thù Lao Kỹ Thuật Chuyên Sâu (P3 - Performance Salary)
Được cấu thành từ 3 trụ cột chuyên môn:

$$\mathbf{P3} = \mathbf{P3}_{\text{Phẫu thuật / Thủ thuật}} + \mathbf{P3}_{\text{Chất lượng & An toàn}} + \mathbf{P3}_{\text{Doanh thu Khoa}}$$

1. **Thù lao Phẫu thuật & Thủ thuật ($\mathbf{P3}_{\text{Phẫu thuật}}$ - chiếm $\sim 50\% - 55\%$ P3):**
   * Tính trực tiếp theo từng ca mổ thực hiện thành công được ghi nhận trên EMR:
     * Ca mổ đặc biệt (Ghép tạng, phẫu thuật tim hở, robot): $5,000,000 - 8,000,000\text{ đ/ca}$ (Phẫu thuật viên chính).
     * Ca can thiệp mạch vành / Đột quỵ (DSA): $3,500,000 - 5,000,000\text{ đ/ca}$.
     * Ca mổ loại 1 (Ngoại tiêu hóa, thay khớp háng/gối, mổ bắt con VIP): $2,000,000 - 3,500,000\text{ đ/ca}$.
2. **Thưởng Chất lượng & An toàn Người bệnh ($\mathbf{P3}_{\text{Chất lượng}}$ - chiếm $\sim 25\%$ P3):**
   * Đạt tỷ lệ hài lòng bệnh nhân CSAT $\ge 95\%$: Thưởng $100\%$ định mức.
   * Tỷ lệ nhiễm khuẩn vết mổ $\le 0.5\%$: Thưởng $100\%$ định mức.
   * **CHỐT CHẶN AN TOÀN:** Nếu để xảy ra 01 sự cố y khoa nghiêm trọng cấp độ tử vong/di chứng do lỗi quy trình chuyên môn $\rightarrow$ **CẮT TOÀN BỘ $100\%$ KHOẢN P3 CỦA THÁNG ĐÓ**.
3. **Thưởng Đóng góp Doanh thu Khoa ($\mathbf{P3}_{\text{Doanh thu}}$ - chiếm $\sim 20\% - 25\%$ P3):**
   * Trích thưởng từ $0.8\% - 1.2\%$ trên phần doanh thu thực tế vượt chỉ tiêu kế hoạch tháng của khoa lâm sàng.

---

## 5. Ma Trận Phân Công Trách Nhiệm RACI Trong Tính Lương

| Khâu công việc | Phòng KHTH (Kế Hoạch Tổng Hợp) | Điều Dưỡng Trưởng / Khối Phòng Mổ | Phòng Tài Chính Kế Toán | Phòng Nhân Sự (HR) | Giám Đốc Bệnh Viện (CEO/BOD) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| 1. Xuất dữ liệu ca mổ, kíp mổ từ HIS/EMR | **R / A** | **C** | **I** | **I** | **I** |
| 2. Kiểm tra sự cố y khoa & CSAT người bệnh | **A** | **C** | **I** | **R** | **I** |
| 3. Tổng hợp doanh thu dịch vụ khoa phòng | **C** | **I** | **R / A** | **I** | **I** |
| 4. Áp công thức tính lương 3P & thuế TNCN | **I** | **I** | **R / A** | **C** | **I** |
| 5. Phê duyệt bảng lương & chi trả ngân hàng | **I** | **I** | **C** | **C** | **R / A** |

*(Chú thích: **R** - Responsible: Người làm; **A** - Accountable: Người chịu trách nhiệm chính; **C** - Consulted: Người tham vấn; **I** - Informed: Người nhận thông tin).*
