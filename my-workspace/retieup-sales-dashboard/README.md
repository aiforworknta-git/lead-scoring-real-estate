# HEINEKEN SALES CONTROL & COMMERCIAL RETIE-UP COPILOT DASHBOARD
> **Được kiến trúc & tự động hóa bởi:** Master Multi-Agent `ai4a-orchestrator`  
> **Thư mục dự án:** `D:\NTAN\AI For work\Agentic\my-workspace\retieup-sales-dashboard`  
> **Kỳ dữ liệu:** Tháng 09/2026 (102 SubDs, 1.654 Điểm bán quản lý, South 2 & South 9)

---

## 🎯 1. Tổng Quan Giải Pháp

Hệ thống được thiết kế đặc thù phục vụ đội ngũ Quản trị Bán hàng & Thương mại (ASM/RSM, Commercial Analyst, Sales Rep), giải quyết trọn gói 3 bài toán:
1. **Kiểm Soát & Đối Chiếu (Sales Control & Target Reconciliation):**
   - Giám sát tiến độ Sell-In, Sell-Out, Target, Tồn kho (SCD) của 102 SubD.
   - Nhận diện tức thì các SubD có tồn kho cao nguy cơ đọng vốn ($SCD > 7\text{ ngày}$) hoặc tồn kho thấp nguy cơ đứt hàng ($SCD < 3\text{ ngày}$).
   - Theo dõi 3.194 điểm bán quen chưa phát sinh đơn trong tháng.
2. **Bộ Sinh Biểu Mẫu OSR Chuẩn Bị Tái Ký (OSR Document Generator):**
   - Tự động điền thông tin điểm bán, đối chiếu tỷ lệ hoàn thành hợp đồng cũ.
   - Hỗ trợ in ấn chuẩn văn bản khổ **A4** (`window.print()`), xuất file **CSV/Excel** và copy tin nhắn chốt số gửi qua **Zalo 30s**.
3. **Trợ Lý AI Phân Tích & Tư Vấn Đầu Tư (AI Investment Advisory Copilot):**
   - Phân hạng điểm bán (Tier Diamond / Gold / Silver / Bronze).
   - Đánh giá chỉ số chi phí tài trợ thực tế trên mỗi thùng bia ($Cost/Case$).
   - Đưa ra khuyến nghị đầu tư: **Tăng tài trợ VIP (+25%)**, **Duy trì ràng buộc Focus AA**, hoặc **Cắt giảm tài trợ cố định / Chuyển sang thưởng thùng**.
   - Tự động sinh kịch bản đàm phán 30s giúp Sales Rep tự tin tiếp cận chủ quán.

---

## 📁 2. Cấu Trúc Thư Mục Dự Án

```text
retieup-sales-dashboard/
├── index.html                   # [SINGLE-FILE HTML] Ứng dụng điều hành độc lập (810 KB < 1.5MB)
├── data/
│   └── retieup_mart.json        # Data Mart thương mại nén (749 KB)
├── scripts/
│   ├── generate_retieup_mart.js # Script làm sạch, mô hình hóa và nén Fact/Dim
│   └── build_dashboard.js       # Script đóng gói HTML tự động (Reproducible)
├── templates/
│   └── osr_template.md          # Biểu mẫu OSR chuẩn hóa quy cách thương mại
└── README.md                    # Tài liệu hướng dẫn vận hành hệ thống
```

---

## 🚀 3. Hướng Dẫn Sử Dụng Nhanh

1. **Mở Dashboard:** Nhấp đúp trực tiếp vào file [`index.html`](file:///d:/NTAN/AI%20For%20work/Agentic/my-workspace/retieup-sales-dashboard/index.html) để mở trên Google Chrome, Microsoft Edge hoặc Safari. Không cần cài đặt server hay phụ thuộc mạng internet.
2. **Kiểm soát & Đối chiếu SubD:** Sử dụng bộ lọc Vùng (South 2 / South 9) và bộ lọc Tồn kho SCD tại **Tab 1**. Bấm nút `Quán >` để nhảy ngay sang danh sách quán của SubD đó.
3. **Tìm kiếm & Phân tích điểm bán:** Tại **Tab 2**, lọc theo Tier hoặc Khuyến nghị AI. Bấm `Tạo OSR ➔` trên bất kỳ quán nào để tự động nạp hồ sơ quán vào Form OSR.
4. **Trình ký OSR & Gửi Zalo:** Tại **Tab 3**, xem trước biểu mẫu OSR:
   - Bấm **"In Biểu Mẫu OSR"** để in ra giấy A4 sạch đẹp, sẵn sàng trình ký 3 bên.
   - Bấm **"Copy Tin Nhắn Zalo Chốt Số"** để dán kịch bản đàm phán gửi trực tiếp cho Quản lý / Chủ quán.
5. **Mô phỏng tư vấn đầu tư:** Tại **Tab 4**, chọn bất kỳ quán nào trong menu để AI phân tích cấu trúc chi phí Cost/Case, giải thích căn cứ nghiệp vụ và dự kiến số tiền tiết kiệm ngân sách tránh chôn vốn.

---

## 📊 4. Tiêu Chuẩn Kiểm Toán & Đối Soát Số Liệu (QA Audit)

- **Tổng Chỉ Tiêu (Target SI):** 375.772 thùng (Khớp 100%).
- **Thực Đạt Sell-In:** 84.055 thùng (Khớp 100% - Đạt 22.4% Target).
- **Thực Đạt Sell-Out:** 57.624 thùng (Khớp 100% - Tỷ lệ SO/SI: 68.6%).
- **Dung Lượng Ứng Dụng:** 810.1 KB ($< 1.5\text{MB}$ theo cam kết của `ai4a-dashboard-architect`).
- **Sai Số Đối Soát (Discrepancy Rate):** $0.00\%$ (Đạt chuẩn kiểm toán của `ai4a-qa-auditor`).
