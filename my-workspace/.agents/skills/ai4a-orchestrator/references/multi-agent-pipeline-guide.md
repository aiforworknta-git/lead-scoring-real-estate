# CẨM NANG VẬN HÀNH LUỒNG ĐIỀU PHỐI ĐA TÁC TỬ (MULTI-AGENT PIPELINE GUIDE)

> Cẩm nang thực chiến dành cho học viên chương trình **Agentic AI with Google Antigravity (AI4A)** khi sử dụng `ai4a-orchestrator`.

---

## 1. Bản Chất Của "1 Lệnh Chạy Toàn Bộ Đội Ngũ"

Trong lập trình AI thông thường, người dùng phải đóng vai trò "người làm thuê cho AI": ngồi copy/paste kết quả từ bước này sang bước khác và ra lệnh cho từng agent một.

Mô hình **Multi-Agent Orchestration** đảo ngược hoàn toàn điều này:
* Người dùng đóng vai trò **Giám đốc Điều hành (CEO/Project Sponsor)**: Chỉ đưa ra mục tiêu và nguồn tài nguyên.
* `ai4a-orchestrator` đóng vai trò **Giám đốc Vận hành (COO/Engineering Manager)**: Tự động phân rã công việc, chỉ đạo các chuyên viên Agent làm việc, kiểm tra chéo lẫn nhau và chỉ báo cáo khi sản phẩm đã hoàn thiện 100%.

---

## 2. Các Quy Tắc Vàng Khi Thiết Kế Handoff (Bàn Giao Dữ Liệu)

### Quy tắc 1: Không chuyển giao ngữ cảnh bằng văn bản trôi nổi (No Fluffy Context)
Khi bàn giao giữa các agent, không tóm tắt chung chung bằng lời nói (e.g. *"Dữ liệu có vẻ ổn rồi"*). Mọi bàn giao PHẢI đi kèm:
- Đường dẫn file cụ thể trên đĩa (`path`).
- Tổng số bản ghi (`record_count`).
- Tổng giá trị số học kiểm toán (`checksum_sum`).
- Mã hóa ký tự (`UTF-8`).

### Quy tắc 2: Tách biệt phân vùng Đọc và Ghi (Storage Segregation)
- File nguồn trong `sample-data/` là **bất biến (Immutable)**.
- Mỗi agent chỉ ghi vào thư mục đầu ra của riêng mình.
- Agent phía sau không bao giờ chỉnh sửa trực tiếp file của agent phía trước.

### Quy tắc 3: Quyền phủ quyết tuyệt đối của QA Auditor (Auditor Veto Power)
Nếu `ai4a-qa-auditor` phát hiện sai số chênh lệch $> 0.00\%$ giữa file gốc và file kết quả:
- **Ngừng ngay lập tức việc xuất bản báo cáo.**
- Chuyển giao thông số sai lệch cho `ai4a-software-engineer` để điều tra nguyên nhân (RCA).
- Sau khi vá lỗi, phải chạy lại khâu đối soát từ đầu.

---

## 3. Bí Quyết Viết "1 Câu Lệnh Thần Thánh" (The Perfect Master Prompt)

Để `ai4a-orchestrator` chạy mượt mà nhất, câu lệnh của bạn nên chứa đủ 3 thành phần theo cấu trúc **CLEAR**:

1. **Nguồn dữ liệu (Source):** File nằm ở đâu? (Ví dụ: `sample-data/sales_q3.csv`)
2. **Kỳ vọng thành phẩm (Outcome):** Bạn muốn Dashboard HTML, bảng tính Excel hay Slide trình chiếu?
3. **Tiêu chuẩn chất lượng (Quality Bar):** Sai số 0%, dung lượng < 1.5MB, chuẩn bị slide 16:9 cho Ban Giám Đốc.

### Ví dụ Prompt Thực Chiến Mẫu:
```text
@[ai4a-orchestrator] Hãy tiếp nhận file dữ liệu 'sample-data/erp_sales.xlsx':
1. Làm sạch và chuẩn hóa toàn bộ dữ liệu (loại bỏ dòng rác, sửa lỗi UTF-8).
2. Dựng 1 Executive Dashboard HTML nén dưới 1.5MB có thẻ ảnh Zalo 30s.
3. Đối soát số liệu đảm bảo chênh lệch 0.00% so với dữ liệu nguồn.
4. Đóng gói kết quả thành 1 Slide Deck PowerPoint 16:9 và báo cáo kiểm toán cho Ban Giám Đốc.
```
