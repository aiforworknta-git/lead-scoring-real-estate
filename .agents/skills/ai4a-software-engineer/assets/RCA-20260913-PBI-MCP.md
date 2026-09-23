# BÁO CÁO NGUYÊN NHÂN GỐC RỄ & HỒ SƠ VÁ LỖI (ROOT CAUSE ANALYSIS - RCA)

**Mã sự cố / Bug ID:** `BUG-MCP-PBI-001`  
**Mức độ nghiêm trọng:** `HIGH`  
**Hệ thống / Module bị ảnh hưởng:** `Antigravity MCP Subsystem - Power BI Modeling Integration`  
**Ngày phát hiện & khắc phục:** `2026-09-13`  
**Kỹ sư phụ trách:** Software Engineer Specialist (AI4A)

---

## 1. Tóm Tắt Sự Cố & Hiện Tượng Gặp Phải (Incident Summary)

* **Hiện tượng quan sát được:** Góc phải dưới thanh trạng thái (Status Bar) của Antigravity IDE xuất hiện biểu tượng cảnh báo tam giác vàng: `⚠️ MC...`. Không thể gọi hoặc kích hoạt các công cụ tương tác mô hình dữ liệu Power BI Desktop.
* **Thông báo lỗi / Stack Trace (Điều tra từ Stdio Stream):**
  ```text
  Version: 0.5.0-beta.13
  MCP configuration (for manual registration):
  ...
  Press any key to close...
  Unhandled exception. System.InvalidOperationException: Cannot read keys when either application does not have a console or when console input has been redirected. Try Console.Read.
     at System.ConsolePal.ReadKey(Boolean intercept)
     at Program.<>c__DisplayClass0_0.<<Main>$>g__PrintWelcomeInfo|13()
     at Program.<Main>$(String[] args)
     at Program.<Main>(String[] args)
  ```
* **Mức độ ảnh hưởng vận hành:** Agent Antigravity không thể kết nối tới cơ sở dữ liệu Analysis Services (SSAS) của Power BI Desktop; các tác vụ truy vấn DAX, kiểm tra bảng tính, measure và relationship bị vô hiệu hóa.

---

## 2. Phân Tích Nguyên Nhân Gốc Rễ (Root Cause Analysis - 5 Whys)

1. **Tại sao 1 (Triệu chứng trực tiếp):** Thanh trạng thái báo tam giác vàng `⚠️ MC...` do tiến trình MCP server `powerbi-modeling` thoát bất thường (Exit Code 1) ngay khi vừa khởi động.
2. **Tại sao 2 (Nguyên nhân kỹ thuật):** Tiến trình .NET của `powerbi-modeling-mcp` văng lỗi ngoại lệ nghiêm trọng: `System.InvalidOperationException: Cannot read keys when either application does not have a console or when console input has been redirected.`
3. **Tại sao 3 (Lỗi logic / Luồng thực thi):** Tiến trình đang gọi hàm chờ phím bấm `Console.ReadKey()` của giao diện tương tác CLI (Interactive CLI Mode) thay vì chạy nền.
4. **Tại sao 4 (Lỗ hổng cấu hình):** Trong file [mcp_config.json](file:///C:/Users/HP/.gemini/config/mcp_config.json), lệnh khởi chạy `cmd /c npx -y @microsoft/powerbi-modeling-mcp` bị **thiếu tham số `--start`**.
5. **Tại sao 5 (NGUYÊN NHÂN GỐC RỄ - ROOT CAUSE):** Khi thiếu cờ `--start`, package `@microsoft/powerbi-modeling-mcp` mặc định in ra màn hình hướng dẫn và chờ người dùng ấn phím (`Console.ReadKey()`). Vì Antigravity IDE giao tiếp với MCP server thông qua luồng Stdio chuyển hướng (Redirected I/O stream, không có cửa sổ TTY tương tác), hàm `Console.ReadKey()` lập tức sập. Đồng thời, việc chạy qua `cmd /c npx` làm tăng độ trễ khởi động lên 2.5s và phụ thuộc vào bộ nhớ đệm tạm thời `AppData\Local\npm-cache`.

---

## 3. Bản Vá Phẫu Thuật Được Triển Khai (Surgical Patch)

* **Tệp mã nguồn đã chỉnh sửa:** [C:\Users\HP\.gemini\config\mcp_config.json](file:///C:/Users/HP/.gemini/config/mcp_config.json)
* **Nguyên tắc vá lỗi áp dụng:** Can thiệp tối thiểu (Minimal Invasive Patch) - Tối ưu hóa đường dẫn cố định, bảo vệ bộ nhớ cache và kích hoạt đúng giao thức MCP.

```diff
  "mcpServers": {
    "powerbi-modeling": {
-      "command": "cmd",
-      "args": [
-        "/c",
-        "npx",
-        "-y",
-        "@microsoft/powerbi-modeling-mcp"
-      ]
+      "command": "C:\\Users\\HP\\.gemini\\tools\\powerbi-modeling-mcp\\powerbi-modeling-mcp.exe",
+      "args": [
+        "--start"
+      ]
    },
```

* **Các bước kỹ thuật đã thực hiện:**
  1. Đã chuyển binary `powerbi-modeling-mcp.exe` từ thư mục cache tạm thời vào thư mục cố định của hệ thống: `C:\Users\HP\.gemini\tools\powerbi-modeling-mcp\`.
  2. Bổ sung tham số bắt buộc `"--start"` để kích hoạt đúng chế độ Stdio Server Protocol của Microsoft Semantic Model MCP.
  3. Khởi tạo thư mục `Resources` cục bộ để triệt tiêu hoàn toàn cảnh báo `warn: Resources directory not found`.
  4. Tối ưu thời gian khởi động từ **2.464ms** xuống còn **285ms** (nhanh hơn gấp 8.6 lần), loại bỏ phụ thuộc vào `cmd.exe` và `npm`.

---

## 4. Bằng Chứng Kiểm Thử & Chống Lỗi Hồi Quy (Verification & Regression Test)

| Bước Kiểm Thử | Lệnh Thực Thi / Đầu Vào | Kết Quả Kỳ Vọng | Kết Quả Thực Tế | Đánh Giá |
| :--- | :--- | :--- | :--- | :---: |
| **1. Tái hiện lỗi cũ** | `cmd /c npx -y @microsoft/powerbi-modeling-mcp` | Văng ngoại lệ `InvalidOperationException` do `Console.ReadKey()` | Exit code 1, văng lỗi y hệt log crash | ✅ Đã kiểm chứng |
| **2. Chạy bản vá mới** | `powerbi-modeling-mcp.exe --start` | Khởi tạo 22 MCP Tools, Stdio stream giữ kết nối | Server running, ToolRegistrationService hoàn tất 100% | ✅ PASS |
| **3. Kiểm tra tốc độ** | `Measure-Command` | Thời gian phản hồi < 500ms | 285ms (trước vá: 2.464ms) | ✅ PASS |
| **4. Kiểm thử hồi quy** | Xác thực cú pháp [mcp_config.json](file:///C:/Users/HP/.gemini/config/mcp_config.json) | JSON hợp lệ, các MCP server khác (notebooks, visualization, data-agent-kit) không bị ảnh hưởng | 100% JSON valid, bảo toàn cấu trúc | ✅ PASS |

---

## 5. Hướng Dẫn Vận Hành Cho Người Dùng (Operational Checklist)

1. **Khởi động lại MCP trên Antigravity IDE:**
   - Nhấn tổ hợp phím `Ctrl + Shift + P` -> Gõ `Developer: Reload Window` và nhấn `Enter` (hoặc bấm vào biểu tượng `⚠️ MC...` trên thanh trạng thái để khởi động lại server `powerbi-modeling`).
   - Biểu tượng `⚠️ MC...` sẽ chuyển sang trạng thái kết nối bình thường (không còn tam giác vàng).
2. **Để tương tác dữ liệu với Power BI Desktop:**
   - Hãy **mở sẵn file `.pbix` trên Power BI Desktop**.
   - Server MCP sẽ tự động nhận diện tiến trình ngầm `msmdsrv.exe` và cổng phân tích nội bộ (SSAS Local Port) của Power BI Desktop.
