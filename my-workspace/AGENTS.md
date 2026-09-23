# My Workspace — Quy Tắc Vận Hành

## Dự Án
**Personal Agentic Workspace** — Không gian làm việc AI cá nhân được xây dựng xuyên suốt khóa học Agentic AI with Google Antigravity.

## Chủ Sở Hữu
- **Tên:** {{ten_hoc_vien}}
- **Lĩnh vực:** {{linh_vuc_chuyen_mon}} _(VD: Marketing, Kế Toán, Nhân Sự, Kinh Doanh...)_
- **Mục tiêu tự động hóa:** {{muc_tieu_chinh}} _(VD: Tự động hóa báo cáo tuần, lên lịch nội dung, phân tích dữ liệu khách hàng...)_

## Sứ Mệnh Workspace
{{mo_ta_workspace}} _(VD: Workspace hỗ trợ tôi tự động hóa các công việc lặp lại trong [lĩnh vực], tạo ra các output chuyên nghiệp và có hệ thống.)_

## Quy Tắc Vận Hành (Rules)

### Quy tắc 1 — Tích lũy, không phá vỡ
Mỗi buổi học, tôi CHỈ thêm mới vào workspace. Không xóa bỏ hoặc thay thế các thành phần đã tạo trừ khi có lý do audit rõ ràng.

### Quy tắc 2 — PDCA bắt buộc
Mọi thay đổi quan trọng phải được ghi vào `docs/pdca-log.md`. Format: Plan → Do → Check → Act.

### Quy tắc 3 — Workspace checkpoint
Sau mỗi buổi học, tôi đọc bridge guide tương ứng và hoàn thành ít nhất 1 workspace checkpoint.

### Quy tắc 4 — Output vào đúng thư mục
- Draft content → `outputs/drafts/`
- Báo cáo → `outputs/reports/`
- Dữ liệu thực hành → `sample-data/`

### Quy tắc 5 — Bảo mật
Không đưa API key, mật khẩu, dữ liệu khách hàng thật vào workspace này.

### Quy tắc 6 — Tự động điều phối Đa tác tử (Auto-Orchestration Protocol)
Khi nhận lệnh yêu cầu xử lý dữ liệu hoặc xây dựng sản phẩm từ A-Z (kèm tag `@ai4a-orchestrator` hoặc khi người dùng yêu cầu tự động hóa toàn tuyến):
- Antigravity tự động đóng vai trò **Lead Orchestrator**, dẫn dắt luồng qua 5 chặng: `ai4a-brainstorm` (OIPO) ➔ `ai4a-data-cleaner` (Làm sạch UTF-8) ➔ `ai4a-dashboard-architect` / `ai4a-erp-ops-reporter` (Mô hình hóa Fact/Dim & nén < 1.5MB) ➔ `ai4a-qa-auditor` (Chốt chặn đối soát sai số = 0%) ➔ `ai4a-ppt-architect` (Slide 16:9).
- Tự động kích hoạt cơ chế **Self-Healing Loop**: Nếu QA Auditor phát hiện sai số, kích hoạt `ai4a-software-engineer` điều tra RCA và vá lỗi ngay lập tức mà không dừng lại làm phiền người dùng.

### Quy tắc 7 — Thực thi tự trị 100% & Kiểm duyệt rủi ro nội bộ (Zero-Prompt Protocol)
Khi người dùng bấm Submit yêu cầu:
- **Làm luôn từ A-Z (Tự động chấp thuận thao tác):** Mặc định tự động tạo/sửa file, chạy lệnh terminal kiểm tra hệ thống và xuất xưởng thành phẩm mà không dừng lại hỏi xin phép ("Accept tạo file", "Đồng ý chạy task").
- **`ai4a-qa-auditor` độc quyền chất vấn rủi ro trong nội bộ:** Mọi phân vân, cảnh báo rủi ro, sai lệch số học do `ai4a-qa-auditor` phát hiện PHẢI được chất vấn trực tiếp tới các Agent chuyên môn (`ai4a-software-engineer`, `ai4a-data-cleaner`, `ai4a-dashboard-architect`) để tự động vá lỗi (Self-Healing).
- **TUYỆT ĐỐI KHÔNG HỎI NGƯỜI DÙNG:** Không quấy rầy người dùng bằng các câu hỏi kỹ thuật/xin phép. Người dùng là Chủ đầu tư, chỉ nhận bàn giao kết quả hoàn thiện đã qua chứng nhận `audit_status = PASSED` của QA Auditor.

## Danh Sách Kỹ Năng Đa Tác Tử (Agentic Skills Suite)
- **`ai4a-orchestrator`**: Tổng công trình sư điều phối toàn tuyến.
- **`ai4a-brainstorm`**: Khảo sát bài toán, chốt OIPO, framing phạm vi.
- **`ai4a-content-creator`**: Sáng tạo nội dung, copywriting (AIDA/PAS/BAB) làm đầu vào cho prompt engineer.
- **`ai4a-prompt-engineer`**: Kỹ thuật thiết kế prompt CLEAR/PROMPT framework.
- **`ai4a-vids-creator`**: Sản xuất video Google Vids AI 1 lệnh (Storyboard, Voiceover, Preview).
- **`ai4a-data-cleaner`**: Làm sạch, chuẩn hóa schema UTF-8, bảo vệ phép chia cho 0.
- **`ai4a-dashboard-architect`**: Thiết kế Dashboard, Pre-aggregation Engine < 1.5MB, tác chiến Zalo.
- **`ai4a-erp-ops-reporter`**: Tự động hóa xử lý báo cáo ERP hàng tháng.
- **`ai4a-qa-auditor`**: Chốt chặn đối soát số học sai số = 0% (Zero Discrepancy).
- **`ai4a-software-engineer`**: RCA, gỡ lỗi runtime, vá lỗi Minimal Invasive Patch.
- **`ai4a-ppt-architect`**: Slide deck điều hành 16:9 McKinsey/BCG, Action Titles.

## Lịch Sử Phát Triển

| Buổi | Ngày | Thêm gì vào workspace | Ghi chú |
|:----:|------|----------------------|---------|
| 1 | {{ngay}} | Tạo workspace, viết AGENTS.md | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10 | | | |
| 11 | | | |
