# KẾ HOẠCH ĐIỀU PHỐI ĐA TÁC TỬ (MASTER ORCHESTRATION PLAN)
## Dự án: {{project_name}}

* **Mã dự án:** `{{project_id}}`
* **Ngày khởi tạo:** `{{current_date}}`
* **Orchestrator phụ trách:** `ai4a-orchestrator`
* **Mục tiêu kinh doanh:** `{{business_objective}}`

---

## 1. Bản Đặc Tả OIPO Toàn Tuyến (End-to-End OIPO)

* **Objective (Mục tiêu):** `{{objective_detail}}`
* **Input (Dữ liệu đầu vào):** `{{input_paths}}` (Dung lượng: `{{raw_size}}`, Định dạng: `{{raw_format}}`)
* **Process (Quy trình 5 chặng):**
  1. *Chặng 1 (Framing):* Khảo sát cấu trúc & chốt Acceptance Criteria.
  2. *Chặng 2 (Cleanse):* Khử trùng lặp, chuẩn hóa UTF-8, chuyển đổi kiểu dữ liệu.
  3. *Chặng 3 (Build):* Tạo khối tiền tổng hợp (Pre-aggregation) & render giao diện/file.
  4. *Chặng 4 (QA Gate):* Kiểm toán sai số $= 0.00\%$, rà soát bảo mật.
  5. *Chặng 5 (Deliver):* Xuất bản Slide deck 16:9 & tóm tắt bàn giao.
* **Output (Thành phẩm cuối cùng):** `{{final_artifacts_list}}`

---

## 2. Ma Trận Bàn Giao Giữa Các Chuyên Viên (Hand-off Matrix)

| Chặng | Chuyên Viên Phụ Trách | Đầu Vào (Input) | Đầu Ra (Output) | Tiêu Chí Bàn Giao (Gate Check) |
|:---:|:---|:---|:---|:---|
| **1** | `ai4a-brainstorm` | Yêu cầu người dùng | `docs/task_manifest.json` | Đầy đủ 4 trường Hợp đồng |
| **2** | `ai4a-data-cleaner` | File thô | `outputs/cleansed/` | 0 dòng rác, 100% UTF-8 |
| **3** | `ai4a-dashboard-architect` | Dữ liệu sạch | `outputs/dashboard/` | Dung lượng payload $< 1.5\text{MB}$ |
| **4** | `ai4a-qa-auditor` | Input vs Output | `outputs/reports/reconciliation.md` | Sai số đối soát $= 0.00\%$ |
| **5** | `ai4a-ppt-architect` | Báo cáo kiểm toán | `outputs/presentations/` | Đạt chuẩn Action Titles 16:9 |

---

## 3. Nhật Ký Phản Hồi & Tự Động Vá Lỗi (Auto-Healing Log)

*(Ghi nhận các trường hợp QA Auditor phát hiện lỗi và kích hoạt ai4a-software-engineer xử lý)*

| Lần | Agent Bị Bắt Lỗi | Mô Tả Sai Lệch | Nguyên Nhân Gốc Rễ (RCA) | Bản Vá Đã Áp Dụng (Patch) | Kết Quả Re-check |
|:---:|---|---|---|---|:---:|
| 1 | `{{agent_name}}` | `{{discrepancy_desc}}` | `{{rca_finding}}` | `{{patch_applied}}` | `PASSED / FAILED` |

---

## 4. Chữ Ký Phê Duyệt Phát Hành (Sign-off)

- [ ] **Data Quality Gate:** Đã nghiệm thu bởi `ai4a-data-cleaner`
- [ ] **Performance Gate:** Đã nghiệm thu bởi `ai4a-dashboard-architect` (Kích thước $< 1.5\text{MB}$)
- [ ] **Financial Audit Gate:** Đã ký duyệt bởi `ai4a-qa-auditor` (Chênh lệch $= 0.00\%$)
- [ ] **Executive Presentation Gate:** Đã nghiệm thu bởi `ai4a-ppt-architect` (Slide 16:9 Widescreen)
