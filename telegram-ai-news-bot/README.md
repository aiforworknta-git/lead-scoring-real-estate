# 🌟 HỆ THỐNG ĐIỂM TIN ĐIỀU HÀNH TỰ ĐỘNG (EXECUTIVE AI DIGEST BOT)

> **Role**: Automation Engineer  
> **Kiến trúc**: **OIPO Enterprise** *(Objective – Input – Process – Output)*  
> **Tiêu chuẩn**: Telegram HTML Blockquote, Đa chủ đề (Bia, Điện máy, Virtual Influencer AI), Phân tích Insight lãnh đạo, Lập lịch 8h30 sáng hàng ngày.

---

## 👥 Danh Sách Người Nhận Đã Kết Nối
Hệ thống tự động phát hiện và cấu hình gửi đồng thời tới:
1. **Anh Nguyễn Thành An**: Chat ID `8901458207`
2. **Anh Tuấn - GĐTT Cà Mau** (+84 912784884): Chat ID `393564943`
*(Có thể thêm Chat ID nhóm hoặc kênh bằng cách bổ sung vào `CHAT_IDS` trong file `.env`)*

---

## 🎯 5 Tính Năng Nâng Cấp Chuyên Nghiệp

### 1. Thu thập 5 tin tức chọn lọc thuộc 3 chuyên mục chiến lược:
- 🍺 **Ngành Bia & Chuỗi Cung Ứng FMCG**: AI trong sản xuất, kiểm soát chất lượng ủ bia, dự báo tồn kho (Heineken, smart brewery).
- 🔌 **Điện Máy & Gia Dụng Thông Minh**: Physical AI trong đồ gia dụng, hệ sinh thái Samsung AI, LG AI Home.
- 💃 **Hot Girl & Virtual Influencer AI**: Xu hướng người mẫu ảo, KOL ảo thế hệ mới, tái định hình chi phí marketing thương hiệu.

### 2. Dịch thuật tiếng Việt chuẩn xác:
- Bóc tách tiêu đề & trích đoạn tóm tắt bài viết.
- Dịch mượt qua REST API bằng `requests` (**không dùng googletrans** tránh lỗi chặn IP).
- Giữ nguyên văn phong chuẩn cho các bài báo tiếng Việt trong nước.

### 3. Trình bày Telegram HTML cao cấp (Có khung viền blockquote & đánh số):
- Khung thẻ `<blockquote>...</blockquote>` tạo viền card box nổi bật trên màn hình điện thoại.
- Đánh số thứ tự trực quan: `1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣`.
- Nút link xem chi tiết nguồn `<a href="...">`.

### 4. Chuyên mục Insight & Góc nhìn chiến lược điều hành:
- Đưa ra góc nhìn mới kết nối giữa:
  * Tự động hóa sản xuất bia và chuỗi cung ứng.
  * Nâng cấp trải nghiệm thiết bị gia dụng thông minh.
  * Tiếp thị số chi phí thấp qua người mẫu ảo / KOL AI (giảm tới 70% chi phí).
- Khuyến nghị hành động cụ thể cho đội ngũ quản lý.

### 5. Lập lịch tự động gửi vào 8h30 sáng hàng ngày:
- **Đã đăng ký tác vụ `Telegram_Executive_AI_Digest` vào Windows Task Scheduler**.
- Kể cả khi tắt VSCode, máy tính sẽ tự động kích hoạt bot gửi tin vào **08:30:00 AM** mỗi ngày.

---

## 📂 Danh Mục Mã Nguồn

```plaintext
telegram-ai-news-bot/
├── .env                         # Cấu hình bí mật BOT_TOKEN & CHAT_IDS (Đã bảo vệ)
├── send_executive_digest.py     # Core Script: 5 tin tức + Insight + HTML Blockquote
├── run_executive_digest.bat     # File 1-click chạy ngay bản tin điều hành
├── scheduler_service.py         # Python Daemon canh giờ 8h30 sáng
├── setup_daily_task.ps1         # Script cấu hình Windows Task Scheduler tự động
├── send_telegram.py             # Script gốc (1 tin AI theo yêu cầu bài học)
├── send_beer_news.py            # Script chuyên biệt thị trường bia
├── get_my_chat_id.py            # Công cụ bắt Chat ID tự động
└── README.md                    # Tài liệu hướng dẫn sử dụng
```

---

## ⚡ Hướng Dẫn Sử Dụng Nhanh

* **Chạy ngay bây giờ**: Nhấp đúp chuột vào file [run_executive_digest.bat](file:///d:/NTAN/AI%20For%20work/Agentic/telegram-ai-news-bot/run_executive_digest.bat).
* **Kiểm tra tác vụ tự động 8h30**: Tác vụ `Telegram_Executive_AI_Digest` đã sẵn sàng trong Task Scheduler của Windows, tự động kích hoạt mỗi sáng.
