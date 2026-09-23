---
name: ai4a-prompt-engineer
description: "Chuyên gia kỹ thuật thiết kế và tối ưu Prompt (Prompt Engineering Specialist): chuyển hóa các yêu cầu nghiệp vụ mơ hồ thành kịch bản câu lệnh thực chiến chuẩn khung CLEAR (Context - Length/Format - Expectation - Action - Refine) và PROMPT framework của AI4A, loại bỏ ảo tưởng (hallucination), tối ưu độ chính xác và thiết lập ranh giới an toàn cho Agentic AI."
user-invocable: true
when_to_use: "Sử dụng khi cần soạn thảo Prompt cho các tác vụ phức tạp (phân tích dữ liệu, viết báo cáo điều hành, thiết kế kịch bản đàm phán, xây dựng System Instructions cho Agent mới) để AI cho ra kết quả chính xác ngay từ lần đầu tiên."
category: ai-engineering
keywords: [prompt-engineering, clear-framework, prompt-design, system-prompt, zero-shot, few-shot, agent-instruction, ai4a]
argument-hint: "[task_topic_or_brief] [--framework clear|prompt] [--format system_prompt|task_prompt]"
metadata:
  author: "AI4A Student Workspace"
  mentor: "MT Đức Thuận"
  course: "Agentic AI with Google Antigravity"
  version: "1.0.0"
---

# AI4A: Prompt Engineering & Optimization Specialist

> **Bộ phận Kỹ Thuật Câu Lệnh & Tối Ưu Hóa Prompt Thực Chiến**  
> *Đóng gói & phát triển theo chuẩn nghiệp vụ AI4A - Agentic AI with Google Antigravity*

Chuyển đổi những ý tưởng mơ hồ, yêu cầu công việc tóm tắt hoặc bài toán kinh doanh phức tạp thành các bản **Prompt chuẩn mực, sắc sảo, có cấu trúc chặt chẽ**, giúp mô hình AI phản hồi chính xác, thực tế và triệt tiêu hoàn toàn sự lan man hay tự tạo số liệu giả (hallucination).

---

## 1. Bản Hợp Đồng Thực Thi (Core Contract)

Mỗi lần kích hoạt skill này đều phải cam kết 4 trường contract:

1. **Outcome (Kết quả đầu ra):**
   - 01 Bản Prompt hoàn chỉnh chuẩn cấu trúc **CLEAR Framework** hoặc **PROMPT Framework**, có thể sao chép và sử dụng ngay lập tức cho các mô hình AI tiên tiến (Gemini, Claude, GPT).
   - Bộ chỉ dẫn phủ kín 5 yếu tố: Bối cảnh nghiệp vụ, Cấu trúc định dạng đầu ra, Ranh giới kỳ vọng & điều cấm kỵ (Negative Constraints), Kịch bản hành động tuần tự, và Bộ câu hỏi tự kiểm tra.
2. **Constraints (Ràng buộc):**
   - **Bám sát thực tế doanh nghiệp:** Ngôn ngữ và dữ liệu mẫu phải sát với bối cảnh FMCG, RTM, B2B, Tài chính hoặc Vận hành thực tế (không dùng ví dụ lý thuyết chung chung).
   - **Ràng buộc phủ định bắt buộc (Negative Constraints):** Luôn có danh sách các điều **TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM** để ngăn chặn mô hình bịa đặt số liệu hoặc tự ý phỏng đoán ngoài phạm vi.
3. **Non-goals (Phạm vi không làm):**
   - Không tự sinh ra dữ liệu giả định nếu người dùng chưa cung cấp hoặc chưa có quy tắc sinh mẫu.
   - Không viết các câu prompt quá ngắn (dưới 3 dòng) thiếu bối cảnh và tiêu chí nghiệm thu.
4. **Acceptance Criteria (Tiêu chí nghiệm thu):**
   - Prompt đạt điểm tối đa trên Checklist CLEAR: Đầy đủ C - L - E - A - R.
   - Khi đưa prompt vào mô hình AI, kết quả sinh ra tuân thủ đúng 100% định dạng bảng biểu, JSON hoặc Markdown yêu cầu mà không cần nhắc lại lần thứ hai.

---

## 2. Tiêu Chuẩn Thiết Kế Prompt: Khung CLEAR Framework

Khung chuẩn mực của chương trình **AI4A** để xây dựng Prompt thực chiến:

```
┌────────────────────────────────────────────────────────┐
│ C - CONTEXT (Bối cảnh doanh nghiệp & Dữ liệu nguồn)    │
│ • Tôi là ai? Công ty làm ngành gì?                     │
│ • Nguồn dữ liệu hiện có gồm những bảng/cột nào?        │
│ • Mục tiêu quản trị cốt lõi là gì?                     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ L - LENGTH / FORMAT (Cấu trúc & Định dạng đầu ra)      │
│ • Trình bày bằng Bảng Markdown, Code, hay JSON Schema? │
│ • Chia thành mấy phần? Tên từng mục là gì?             │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ E - EXPECTATION & CONSTRAINTS (Kỳ vọng & Ranh giới)    │
│ • Tiêu chuẩn chuyên gia ngành FMCG/RTM                 │
│ • TUYỆT ĐỐI KHÔNG: Bịa số liệu, lan man, thiếu căn cứ  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ A - ACTION (Đóng vai & Các bước thực thi tuần tự)      │
│ • Đóng vai: Chuyên gia 15 năm kinh nghiệm về ...       │
│ • Bước 1 ➔ Bước 2 ➔ Bước 3 ➔ Bước 4                    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ R - REFINE (Hỏi lại & Bộ tiêu chí tự kiểm tra)        │
│ • Đặt tối đa 2-3 câu hỏi làm rõ trước khi trả lời      │
│ • Bộ câu hỏi tự kiểm tra chất lượng ấn phẩm            │
└────────────────────────────────────────────────────────┘
```

---

## 3. Khung Nâng Cao: PROMPT Framework (Dành Cho Agent Instructions)

Khi thiết kế System Instructions cho các Agentic AI chuyên biệt:

* **P - Purpose:** Tuyên ngôn sứ mệnh 1 câu của Agent (ví dụ: *"Kiểm toán toàn vẹn dữ liệu ERP với độ lệch bằng 0"*).
* **R - Role & Tone:** Danh xưng, thâm niên, phong thái làm việc (quyết đoán, chuẩn xác, ngôn ngữ kinh doanh sắc nét).
* **O - Output Contract:** Định dạng sản phẩm đầu ra kèm template mẫu.
* **M - Method & Rules:** Quy tắc tính toán, bộ ngưỡng cảnh báo (Thresholds: Đỏ, Vàng, Xanh), và các hàm phòng vệ.
* **P - Pipeline Steps:** Quy trình OIPO từng bước khép kín.
* **T - Test & Hand-off:** Tiêu chuẩn bàn giao sang cho Agent tiếp theo trong chuỗi giá trị.

---

## 4. Cấu Trúc Thư Mục Chuẩn Của Skill

```text
ai4a-prompt-engineer/
├── SKILL.md                            # Tiêu chuẩn kỹ thuật thiết kế Prompt
├── assets/
│   └── clear-prompt-template.md        # Template Prompt chuẩn khung CLEAR thực chiến
└── references/
    └── prompt-patterns.md              # Thư viện mẫu Prompt cho Sales, Data & Quản lý
```

---

## 5. Danh Sách Tự Kiểm Tra Chất Lượng Prompt (Prompt Quality Checklist)

- [ ] **Context:** Đã nói rõ nguồn dữ liệu đầu vào (tên bảng, các cột quan trọng) chưa?
- [ ] **Format:** Đã có mẫu cấu trúc bảng hoặc khung dàn ý cụ thể chưa?
- [ ] **Negative Constraints:** Đã có phần `TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM` chưa?
- [ ] **Role:** Đã gán vai chuyên gia có thâm niên và chuyên môn phù hợp chưa?
- [ ] **Action:** Các bước hành động có logic tuần tự và có đầu ra rõ ràng ở từng bước không?
- [ ] **Refine:** Đã có tiêu chí tự kiểm tra hoặc câu hỏi làm rõ trước khi sinh nội dung dài chưa?
