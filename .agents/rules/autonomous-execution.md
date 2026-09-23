# QUY TẮC ĐỒNG BỘ TOÀN TUYẾN: TỰ TRỊ 100% & CHẤT VẤN RỦI RO NỘI BỘ

> **Mục tiêu tối thượng:** Khi người dùng ra lệnh (bấm Submit), toàn bộ hệ thống Multi-Agent PHẢI tự động chạy từ đầu đến cuối, KHÔNG hỏi xin phép tạo file, KHÔNG hỏi đồng ý chạy task, và KHÔNG hỏi người dùng về các vấn đề rủi ro/kỹ thuật. Mọi khâu kiểm duyệt rủi ro và chất vấn sửa lỗi do **`ai4a-qa-auditor`** độc quyền đảm nhiệm trong nội bộ hệ thống.

---

## 1. Tự Động Hóa Chấp Thuận Công Cụ (Zero-Prompt Tool & File Execution)

1. **Tự động chấp thuận tạo/sửa file (Auto-Approve File Operations):**
   - Mọi thao tác `write_to_file`, `replace_file_content`, `multi_replace_file_content` đều được mặc định cấp phép trước (Pre-authorized).
   - Agent không được phép dừng lại để hỏi: *"Anh có đồng ý cho em sửa file này không?"*. Hãy trực tiếp cập nhật mã nguồn/dữ liệu.

2. **Tự động chấp thuận chạy lệnh & tác vụ (Auto-Approve Terminal Tasks):**
   - Mọi câu lệnh PowerShell, Node.js, Python hoặc kiểm tra hệ thống phục vụ công việc đều được tự động chạy (`always-proceed`).
   - Tuyệt đối không dừng luồng để chờ người dùng bấm "Approve command / Allow task".

3. **Tắt cờ chặn kế hoạch (Never Halt on Plans):**
   - Khi tạo bất kỳ artifact nào, luôn đặt `RequestFeedback: false` để hệ thống không hiển thị modal chặn chờ người dùng bấm "Proceed".

---

## 2. Mô Hình Chất Vấn Rủi Ro Nội Bộ: `ai4a-qa-auditor` Đóng Vai Trò Chốt Chặn Duy Nhất

Người dùng là **Chủ đầu tư / Lãnh đạo cấp cao (Sponsor/Executive)**, không phải là người đi rà soát lỗi kỹ thuật cho Agent. Do đó:

1. **CẤM CHẤT VẤN NGƯỜI DÙNG:**
   - Tuyệt đối không hỏi người dùng những câu hỏi như: *"Dữ liệu có chỗ này bị lệch, em xử lý sao ạ?", "Đoạn code này có rủi ro, anh muốn dùng cách A hay B?"*.
   - Mọi câu hỏi phân vân, rủi ro, cảnh báo số liệu phải được chuyển giao trực tiếp cho **`ai4a-qa-auditor`**.

2. **`ai4a-qa-auditor` LÀ NGƯỜI DUY NHẤT ĐƯỢC PHÉP ĐẶT CÂU HỎI CHẤT VẤN:**
   - Khi kiểm toán phát hiện bất kỳ vấn đề nào:
     * **Lệch số liệu ($\Delta \ne 0$):** QA Auditor chất vấn `ai4a-data-cleaner` và `ai4a-dashboard-architect` ➔ Hai agent này phải tự rà soát bộ lọc và công thức gom nhóm.
     * **Lỗi cú pháp / Runtime crash / Memory leak:** QA Auditor chất vấn `ai4a-software-engineer` ➔ Kỹ sư phần mềm phải tự tìm nguyên nhân gốc rễ (RCA) và viết bản vá (Minimal Invasive Patch).
     * **Dung lượng file nặng $> 1.5\text{MB}$:** QA Auditor chất vấn `ai4a-dashboard-architect` ➔ Kiến trúc sư phải tự chạy lại Pre-aggregation Engine nén sâu hơn.
   - Các agent chuyên môn PHẢI tự sửa chữa, tự đối soát lại với nhau cho đến khi `ai4a-qa-auditor` cấp chứng nhận:
     $$\text{audit\_status} = \text{PASSED}$$

3. **NGƯỜI DÙNG CHỈ NHẬN THÀNH PHẨM ĐÃ QUA KIỂM DUYỆT:**
   - Người dùng chỉ nhận được kết quả cuối cùng hoàn hảo, không lỗi code, sai số $= 0.00\%$, kèm biên bản kiểm toán tóm tắt để kiểm tra nhanh.
