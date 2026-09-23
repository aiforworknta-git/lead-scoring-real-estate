---
name: lead_scoring
description: "Chuyên gia chấm điểm và phân loại khách hàng tiềm năng (Lead Scoring) trong ngành Bất Động Sản: chuẩn hóa 5 tiêu chí BANT-E (Ngân sách, Nhu cầu/Loại hình, Tính cấp thiết/Thời gian, Thẩm quyền/Pháp lý, Tương tác), phân tầng HOT/WARM/COLD, tích hợp bộ tiêu chí cộng/trừ 50 điểm thực chiến, kiểm soát rủi ro AI ảo giác và thiết lập giao thức bàn giao 1-chạm cho Sales."
user-invocable: true
when_to_use: "Sử dụng khi cần đánh giá, chấm điểm và phân loại tệp khách hàng tiềm năng bất động sản từ file dữ liệu (Google Sheets, CSV, CRM, Chat log) để tối ưu thời gian gọi, phân bổ nguồn lực Sales cho khách hàng nét và loại bỏ triệt để lead rác."
category: sales-intelligence
keywords: [lead-scoring, real-estate, bat-dong-san, bant, lead-qualification, hot-warm-cold, ai4a, sales-handoff, crm]
argument-hint: "[lead_file_or_text] [--threshold hot:80,warm:50] [--export-csv] [--format zalo|crm|table]"
metadata:
  author: "AI4A Student Workspace"
  mentor: "MT Đức Thuận"
  course: "Agentic AI with Google Antigravity"
  version: "1.0.0"
---

# AI4A: Real Estate Lead Scoring Specialist

> **Bộ Kỹ Năng Chấm Điểm & Phân Hạng Khách Hàng Tiềm Năng Bất Động Sản Thực Chiến**  
> *Đóng gói & chuẩn hóa theo kiến trúc Agentic AI - Antigravity IDE*

Chuyển hóa dữ liệu thô (nội dung tư vấn, ghi chú cuộc gọi, form đăng ký, tệp khách hàng Google Sheets/CRM) thành bảng xếp hạng chất lượng khách hàng minh bạch, chuẩn xác với cơ chế chấm điểm đa tầng, giúp đội ngũ kinh doanh Bất Động Sản tiếp cận đúng người - đúng thời điểm - đúng kịch bản chốt cọc.

---

## 1. Định Nghĩa Lead Scoring & Tầm Quan Trọng Sống Còn Trong BĐS

### 1.1. Lead Scoring Trong Bất Động Sản Là Gì?
**Lead Scoring (Chấm điểm khách hàng tiềm năng)** là phương pháp định lượng giá trị và xác suất chuyển đổi của từng khách hàng dựa trên sự kết hợp giữa:
1. **Dữ liệu nhân khẩu học & Năng lực tài chính (Demographic & Financial Fit):** Ngân sách, dòng vốn, vị thế xã hội.
2. **Dữ liệu hành vi & Tương tác (Behavioral & Engagement):** Kênh liên hệ, tần suất phản hồi, tốc độ nghe máy, thái độ hợp tác.
3. **Mức độ khẩn thiết & Yêu cầu sản phẩm (Urgency & Product Need):** Thời hạn xuống tiền, yêu cầu pháp lý (sổ đỏ/sổ hồng riêng), vị trí đắc địa.

### 1.2. Tại Sao Lead Scoring Là "Sống Còn" Đối Với Doanh Nghiệp & Môi Giới BĐS?
- **Triệt tiêu lãng phí thời gian (Zero Waste Telesales):** Trung bình một môi giới mất tới **60% - 70%** thời lượng mỗi ngày để gọi cho những số thuê bao, khách nhầm ngành, hỏi giá cho vui hoặc đòi mua nhà trung tâm giá 1-2 tỷ. Lead Scoring giúp lọc sạch các liên hệ này ngay từ cửa sổ tiếp nhận.
- **Tối đa hóa "Thời điểm vàng" chuyển đổi (Golden Window SLA):** Khách hàng VIP (>20-30 tỷ hoặc mua sỉ Shophouse) chỉ có độ nóng quyết định trong **15 - 30 phút đầu tiên**. Phân loại tức thì giúp chuyển thẳng cho Giám đốc kinh doanh hoặc Top Senior Broker tiếp cận.
- **Tối ưu chi phí Marketing (CPL vs. CAC):** Cung cấp dữ liệu đối soát cho đội Marketing biết kênh quảng cáo/tệp số điện thoại nào mang về lead thực tế, kênh nào chỉ toàn tài khoản ảo hoặc spam bảo hiểm.
- **Đồng bộ hóa dữ liệu CRM & Đào tạo Sales:** Cung cấp sẵn từ khóa vàng (Golden Keywords) và câu mở lời gợi ý (Ice-breaker Hook), giúp Sales mới vào nghề cũng nắm bắt đúng tâm lý khách ngay khi nhấc máy.

---

## 2. Quy Trình Chấm Điểm 5 Tiêu Chí (Mô Hình BANT-E BĐS)

Được kế thừa từ mô hình bán hàng B2B kinh điển **BANT** và mở rộng thành **BANT-E** chuyên sâu cho thị trường Bất Động Sản Việt Nam:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        QUY TRÌNH CHẤM ĐIỂM BANT-E                     │
├───────────────┬───────────────────────────┬────────────────────────────┤
│ TIÊU CHÍ      │ TRỌNG TÂM ĐÁNH GIÁ        │ TRỌNG SỐ ĐIỂM CHUẨN        │
├───────────────┼───────────────────────────┼────────────────────────────┤
│ 1. Budget     │ Ngân sách & Sức mạnh vốn  │ 0 - 30 điểm (VIP: +50)     │
│ 2. Need       │ Loại hình BĐS & Phân khúc │ 0 - 25 điểm                │
│ 3. Timeline   │ Tính cấp thiết thời gian  │ 0 - 20 điểm                │
│ 4. Authority  │ Thẩm quyền, Pháp lý & Vị thế│ 0 - 15 điểm              │
│ 5. Engagement │ Tương tác & Khả năng liên lạc│ 0 - 10 điểm (Lỗi: -50)  │
└───────────────┴───────────────────────────┴────────────────────────────┘
```

### Tiêu chí 1: Ngân Sách & Năng Lực Vốn (Budget)
- **Tài chính cực mạnh ($\ge 20$ tỷ):** Biệt thự đơn lập, Penthouse, quỹ đất công nghiệp, shophouse mặt tiền lớn, thanh toán thẳng không phụ thuộc ngân hàng $\rightarrow$ **Cộng 50 điểm**.
- **Tài chính tầm trung (3 - 10 tỷ):** Nhà phố liền kề, chung cư 2PN - 3PN, có sẵn dòng tiền hoặc cần đòn bẩy ngân hàng hợp lý (vay 50-70%) $\rightarrow$ **15 - 25 điểm**.
- **Tài chính phổ thông (1 - 3 tỷ):** Đất nền vùng ven (Long An, Đồng Nai, Bình Dương) tìm kiếm cơ hội đầu tư dài hạn $\rightarrow$ **10 - 15 điểm**.
- **Tài chính phi thực tế:** Ngân sách chênh lệch hoàn toàn so với giá trị thực (Ví dụ: Mua nhà Quận 1 giá 1 tỷ, thuê trung tâm 2 triệu) $\rightarrow$ **Trừ 50 điểm**.

### Tiêu chí 2: Mức Độ Quan Tâm & Loại Hình BĐS (Need & Product Fit)
- **Phân khúc Siêu sang / Đầu tư thương mại lớn:** Penthouse có hồ bơi riêng, biệt thự đơn lập view sông, shophouse khối đế mặt đường lớn, sàn văn phòng/kho xưởng $\ge 2000m^2$ $\rightarrow$ Đạt điểm tối đa.
- **Phân khúc Nhu cầu ở thực / An cư:** Căn hộ 2PN cho gia đình trẻ gần trường học, bệnh viện, nhà phố liền kề nội thành $\rightarrow$ Đạt điểm chuẩn tốt.
- **Nhu cầu thuê thương mại ổn định:** Thuê mặt bằng kinh doanh Spa, Cafe, Văn phòng Quận 1, Quận 3 diện tích $80 - 100m^2$, cam kết hợp đồng dài hạn $\rightarrow$ Đạt điểm khá.
- **Không có nhu cầu / Lạc ngành:** Dữ liệu cũ, nhầm số, sản phẩm dịch vụ khác $\rightarrow$ Đánh dấu loại bỏ.

### Tiêu chí 3: Thời Gian Mua & Tính Cấp Thiết (Timeline & Urgency)
- **Cực kỳ cấp thiết (Ngay trong tuần):** Muốn đi xem nhà mẫu ngay cuối tuần này, cần gặp trực tiếp Chủ đầu tư/Giám đốc dự án để đàm phán cọc $\rightarrow$ Đạt điểm tối đa.
- **Ngắn hạn (1 - 3 tháng):** Đang cân nhắc giữa 2 dự án, đang khảo sát chính sách chiết khấu và tiến độ đóng tiền $\rightarrow$ Đạt điểm khá.
- **Dài hạn (6 - 12 tháng):** Đất nền đầu tư tích sản dài hạn 2-3 năm $\rightarrow$ Đạt điểm trung bình.
- **Trì hoãn / Không có kế hoạch:** "Hỏi giá cho vui", "Chưa có ý định mua trong năm nay" $\rightarrow$ **Trừ điểm nặng**.

### Tiêu chí 4: Thẩm Quyền, Pháp Lý & Chân Dung Khách Hàng (Authority & Legal Fit)
- **Chủ thể quyết định cấp cao:** Chủ doanh nghiệp, nhà đầu tư chuyên nghiệp mua sỉ 5-10 căn, khách hàng thân thiết đã từng mua nhiều dự án của tập đoàn.
- **Yêu cầu pháp lý minh bạch:** Yêu cầu "Pháp lý chuẩn 100%", "Sổ hồng riêng từng nền", "Không dính quy hoạch".

### Tiêu chí 5: Mức Độ Tương Tác & Khả Năng Kết Nối (Engagement & Reachability)
- **Thiện chí cao:** Cung cấp rõ ràng yêu cầu diện tích, chấp nhận đi xem thực địa, trao đổi tích cực qua Zalo/Điện thoại.
- **Mất liên lạc / Lỗi thông tin:** Số điện thoại thường xuyên thuê bao, gọi nhiều lần không bắt máy, Zalo không trả lời, spam quảng cáo dịch vụ bảo hiểm/cho vay $\rightarrow$ **Trừ 50 điểm**.

---

## 3. Hệ Thống Điểm Số & Phân Tầng HOT / WARM / COLD

### 3.1. Điểm Khởi Điểm & Quy Tắc Cộng/Trừ Đặc Thù

Hệ thống sử dụng **Thang điểm 100** với mức chuẩn cơ sở (Base Score) là **50 điểm**:

```
TỔNG ĐIỂM = Base Score (50) + Điểm Tiêu Chí BANT-E (± Điều chỉnh đặc thù)
```

#### BỘ TIÊU CHÍ CỘNG 50 ĐIỂM (VIP / SIÊU TIỀM NĂNG - TỔNG $\ge 80$ ĐIỂM)
AI tự động nhận diện từ khóa và ngữ cảnh sau để cộng 50 điểm:
- **Ngân sách lớn:** Đề cập số tiền cụ thể từ 20 tỷ trở lên, hoặc các cụm từ *"tài chính mạnh"*, *"tài chính cực mạnh"*, *"không thành vấn đề"*, *"thanh toán thẳng"*.
- **Loại hình cao cấp:** *"Biệt thự đơn lập"*, *"Penthouse"*, *"Shophouse mặt đường lớn"*, *"Quỹ đất công nghiệp"*, *"Sàn văn phòng diện tích lớn"* ($\ge 2000m^2$).
- **Vị trí đắc địa:** *"Quận 1"*, *"Ven sông"*, *"Vinhomes Ocean Park"*, *"Phú Mỹ Hưng"*, *"Khu Đông"*.
- **Đối tượng khách hàng:** *"Chủ doanh nghiệp"*, *"Nhà đầu tư chuyên nghiệp"*, *"Mua sỉ"*, *"Gom sỉ 5-10 căn"*, *"Đã từng mua nhiều dự án của tập đoàn"*.
- **Tính cấp thiết & Minh bạch:** *"Pháp lý chuẩn 100%"*, *"Sổ hồng riêng"*, *"Muốn gặp trực tiếp chủ đầu tư để đàm phán"*, *"Cần gặp trực tiếp giám đốc dự án"*.

#### BỘ TIÊU CHÍ TRỪ 50 ĐIỂM (RÁC / KHÔNG TIỀM NĂNG - TỔNG $\le 20$ ĐIỂM)
AI tự động nhận diện dấu hiệu sau để trừ 50 điểm:
- **Yêu cầu phi thực tế:** Tìm mua BĐS với mức giá thấp vô lý (*"Nhà Quận 1 giá 1-2 tỷ"*, *"Nhà trung tâm thuê 2 triệu"*, *"Nhà trung tâm có sân vườn hồ bơi giá vài trăm triệu"*).
- **Không có nhu cầu:** *"Nhầm số"*, *"Không có nhu cầu"*, *"Dữ liệu cũ"*, *"Nhầm ngành"*, *"Từ ngành khác trộn vào"*.
- **Không thiện chí:** *"Hỏi giá cho vui"*, *"Chưa có ý định mua trong năm nay"*, *"Thái độ không hợp tác"*.
- **Spam / Quảng cáo:** Chứa dịch vụ khác (*"Bảo hiểm"*, *"Vay vốn"*, *"Mời chào dịch vụ"*).
- **Thông tin liên lạc lỗi:** *"Thuê bao"*, *"Gọi nhiều lần không bắt máy"*, *"Không phản hồi Zalo"*.

#### CÁC TRƯỜNG HỢP GIỮ NGUYÊN HOẶC CỘNG ĐIỂM TẦM TRUNG (50 - 75 ĐIỂM)
- Mua chung cư, nhà phố tầm trung (4 - 10 tỷ).
- Cần vay ngân hàng 70%, đang cân nhắc chính sách chiết khấu giữa các dự án.
- Thuê mặt bằng kinh doanh Spa/Văn phòng lâu dài.
- Mua đất nền vùng ven (Long An, Đồng Nai) tài chính 2-3 tỷ yêu cầu sổ hồng riêng.

---

### 3.2. Bảng Phân Tầng & SLA Xử Lý Cho Đội Ngũ Kinh Doanh

| Phân Loại | Thang Điểm | Chân Dung Điển Hình | SLA Phản Hồi | Nhân Sự Tiếp Nhận | Hành Động Ưu Tiên |
| :---: | :---: | :--- | :---: | :--- | :--- |
| <span style="color:#ef4444;font-weight:bold;">🔥 HOT</span> | **$\ge 80$ điểm** | • Tài chính $\ge 20$ tỷ, thanh toán thẳng<br>• Penthouse, biệt thự ven sông, sỉ shophouse<br>• Chủ doanh nghiệp, nhà đầu tư lớn<br>• Xem nhà mẫu ngay cuối tuần | **$\le 15 - 30$ phút** | Giám đốc dự án / Top Senior Broker | Gọi điện thoại trực tiếp, gửi thư mời VIP, đặt lịch gặp trực tiếp CĐT |
| <span style="color:#f59e0b;font-weight:bold;">⚡ WARM</span> | **$50 - 79$ điểm** | • Nhà phố 8-10 tỷ, Căn hộ 2PN 4-5 tỷ<br>• Thuê mặt bằng spa Quận 1<br>• Đất nền sổ hồng 2-3 tỷ<br>• Cần tư vấn lãi suất vay ngân hàng | **$\le 24$ giờ** | Chuyên viên tư vấn (Sales Specialist) | Nhắn tin Zalo chào dự án, gửi bảng tính dòng tiền & chính sách chiết khấu |
| <span style="color:#6b7280;font-weight:bold;">❄️ COLD</span> | **$< 50$ điểm** | • Thuê bao, gọi không nghe máy<br>• Nhầm số, spam bán bảo hiểm<br>• Hỏi giá cho vui, ngân sách ảo<br>• Đòi mua nhà Q1 giá 1 tỷ | Không phân bổ gọi thủ công | Hệ thống tự động / Lưu kho tiếp thị lại | Đưa vào danh sách Blacklist/Dọn dẹp CRM, hoặc gửi SMS/Zalo ZNS tự động |

---

## 4. Rào Chắn Rủi Ro Khi AI Chấm Điểm Tự Động (Guardrails & Safety)

Khi ứng dụng AI tự động đọc hiểu văn bản tự nhiên để chấm điểm, Agent phải tuân thủ nghiêm ngặt **4 quy tắc phòng thủ rủi ro**:

### 4.1. Chống Ảo Giác Bằng Nguyên Tắc Chấm Điểm Theo Bằng Chứng (Evidence-Based Scoring)
- **Quy tắc:** AI TUYỆT ĐỐI KHÔNG ĐƯỢC tự suy diễn nếu văn bản không chứa dữ liệu. Mọi điểm cộng hoặc trừ đều phải trích dẫn chính xác cụm từ nguyên văn làm bằng chứng (`evidence`).
- *Ví dụ sai:* Thấy khách tên "Trần Bảo Tuấn" tự suy diễn là nam, doanh nhân thành đạt $\rightarrow$ **CẤM**.
- *Ví dụ đúng:* Phát hiện cụm từ *"Ngân sách không thành vấn đề"* $\rightarrow$ Trích dẫn làm bằng chứng cộng điểm tài chính.

### 4.2. Xử Lý Thuật Ngữ Viết Tắt Ngành Bất Động Sản (Real Estate Acronyms)
AI phải nhận diện chính xác các từ lóng và viết tắt thông dụng tại thị trường Việt Nam:
- `2PN`, `3PN`: Căn hộ 2 phòng ngủ, 3 phòng ngủ (Nhu cầu ở thực).
- `Q1`, `Q2`, `Q7`, `TP. Thủ Đức`: Khu vực địa lý trọng điểm.
- `Sổ đỏ`, `Sổ hồng riêng`: Pháp lý an toàn cao.
- `Vay bank 70%`: Đòn bẩy tài chính phổ biến, thuộc nhóm WARM thiện chí.
- `CĐT`: Chủ đầu tư.

### 4.3. Rủi Ro Khách Hàng Tiềm Năng Bị Đánh Giá Thấp Do Kiệm Lời (False Negative)
- Một số khách hàng siêu giàu thường nhắn tin rất ngắn: *"Cần mua biệt thự ven sông. Gọi lại số này"*.
- **Quy tắc an toàn:** Nếu tin nhắn ngắn nhưng có chứa từ khóa thuộc nhóm **CỘNG 50 ĐIỂM** (như "biệt thự ven sông"), hệ thống lập tức phân loại vào nhóm **HOT** để nhân sự có kinh nghiệm thẩm định trực tiếp, không bao giờ để rơi vào nhóm COLD.

### 4.4. Bảo Mật Thông Tin Định Danh Cá Nhân (PII Compliance)
- Trong các báo cáo phân tích, dashboard hiển thị công khai hoặc xuất file kiểm toán, số điện thoại phải được che giấu ký tự giữa (Ví dụ: `098****123` thay vì số đầy đủ) trừ khi có quyền truy cập trực tiếp của bộ phận Sales vận hành.

---

## 5. Giao Thức Bàn Giao Kết Quả Cho Sales (Sales Handoff Protocol)

### 5.1. Thẻ Bàn Giao Nhanh Qua Zalo / Telegram (Zalo 1-Tap Handoff Card)
Khi phát hiện lead thuộc nhóm **HOT** hoặc **WARM**, hệ thống lập tức xuất ra định dạng thẻ tin nhắn 1-chạm:

```text
🔥 [BÀN GIAO LEAD HOT - BẤT ĐỘNG SẢN] 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Khách hàng: Lê Anh Lan
📱 SĐT: 0964 591 036 (Bấm để gọi ngay)
⭐ Điểm số: 100/100 [HẠNG: HOT - SIÊU TIỀM NĂNG]
⏱️ Thời hạn xử lý (SLA): Trong vòng 15 PHÚT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Nhu cầu tóm tắt:
- Tìm mua Penthouse diện tích lớn
- Yêu cầu hồ bơi riêng và thang máy riêng
- Ngân sách không thành vấn đề, ưu tiên đẳng cấp & riêng tư

💎 Từ khóa đắt giá: Penthouse, hồ bơi riêng, thang máy riêng, không thành vấn đề
🗣️ Kịch bản mở lời gợi ý (Ice-breaker):
"Em chào chị Lan, em nhận được thông tin chị đang tìm kiếm dòng Penthouse độc bản có hồ bơi và thang máy riêng tư. Hiện tại bên em đang có 2 căn suất ngoại giao tầng cao nhất tại dự án ven sông đáp ứng chính xác tiêu chuẩn của chị, em xin phép gửi video thực tế qua Zalo chị nhé!"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Điều phối: Phụ trách bởi Senior Broker / Trưởng phòng kinh doanh
```

### 5.2. Vòng Lặp Phản Hồi Ngược (Feedback Loop / PDCA)
Mỗi tuần, kết quả tương tác thực tế của Sales được đối soát ngược lại với điểm số AI:
1. **Plan:** AI chấm điểm dựa trên bộ tiêu chuẩn BANT-E và từ khóa hiện tại.
2. **Do:** Sales tiếp cận khách hàng theo đúng SLA quy định.
3. **Check:** Ghi nhận tỷ lệ chuyển đổi: Bao nhiêu lead HOT chốt cọc/đi xem nhà? Có lead nào AI chấm 100 điểm nhưng Sales gọi lại là "hỏi chơi" không?
4. **Act:** Cập nhật bổ sung từ khóa vào danh mục `tieu_chi_cham_diem.txt` để AI liên tục học hỏi và loại trừ các trường hợp mới.

---

## 6. Bộ Công Cụ & Thư Viện Đi Kèm

- **Tài liệu tham chiếu chuyên sâu:** [references/scoring-rubric-real-estate.md](./references/scoring-rubric-real-estate.md)
- **Bộ mẫu thẻ bàn giao:** [assets/lead-handoff-template.md](./assets/lead-handoff-template.md)
- **Công cụ tự động hóa:** [scripts/score_leads.py](./scripts/score_leads.py)
  - Cú pháp chạy: `python .agents/skills/lead_scoring/scripts/score_leads.py --input <path_to_csv> --output <path_to_result>`
  - Hỗ trợ xuất file kết quả phân tầng HOT/WARM/COLD kèm tóm tắt số liệu trực quan cho ban lãnh đạo.
