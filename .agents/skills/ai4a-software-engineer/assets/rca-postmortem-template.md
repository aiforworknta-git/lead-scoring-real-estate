# BÁO CÁO NGUYÊN NHÂN GỐC RỄ & HỒ SƠ VÁ LỖI (ROOT CAUSE ANALYSIS - RCA)

**Mã sự cố / Bug ID:** `{{bug_id}}`  
**Mức độ nghiêm trọng:** `{{severity}}` *(CRITICAL / HIGH / MEDIUM / LOW)*  
**Hệ thống / Module bị ảnh hưởng:** `{{affected_module}}`  
**Ngày phát hiện & khắc phục:** `{{date}}`  
**Kỹ sư phụ trách:** Software Engineer Specialist (AI4A)

---

## 1. Tóm Tắt Sự Cố & Hiện Tượng Gặp Phải (Incident Summary)

* **Hiện tượng quan sát được:** `{{symptom_description}}`
* **Thông báo lỗi / Stack Trace:**
  ```text
  {{error_stack_trace}}
  ```
* **Mức độ ảnh hưởng vận hành:** `{{business_impact}}` *(Ví dụ: Dashboard bị đơ khi mở qua Zalo; script cập nhật dữ liệu tự động bị ngắt giữa chừng)*.

---

## 2. Phân Tích Nguyên Nhân Gốc Rễ (Root Cause Analysis - 5 Whys)

1. **Tại sao 1 (Triệu chứng trực tiếp):** `{{why_1}}`
2. **Tại sao 2 (Nguyên nhân kỹ thuật):** `{{why_2}}`
3. **Tại sao 3 (Lỗi logic / Luồng thực thi):** `{{why_3}}`
4. **Tại sao 4 (Lỗ hổng thiết kế / Ràng buộc):** `{{why_4}}`
5. **Tại sao 5 (NGUYÊN NHÂN GỐC RỄ - ROOT CAUSE):** `{{root_cause_core}}`

---

## 3. Bản Vá Mã Nguồn Được Triển Khai (Surgical Patch)

* **Tệp mã nguồn đã chỉnh sửa:** `{{modified_file_path}}`
* **Nguyên tắc vá lỗi áp dụng:** Can thiệp tối thiểu (Minimal Invasive Patch) - Không thay đổi logic xung quanh.

```diff
- {{old_broken_code}}
+ {{new_fixed_code}}
```

* **Giải thích kỹ thuật về giải pháp:** `{{technical_explanation}}`

---

## 4. Bằng Chứng Kiểm Thử & Chống Lỗi Hồi Quy (Verification & Regression Test)

| Bước Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Kỳ Vọng | Kết Quả Thực Tế | Đánh Giá |
| :--- | :--- | :--- | :--- | :---: |
| **1. Tái hiện lỗi cũ** | File dữ liệu gặp lỗi | Báo lỗi hoặc sập script | Lỗi xuất hiện chính xác | ✅ Đã kiểm chứng |
| **2. Chạy bản vá mới** | File dữ liệu gặp lỗi | Xử lý hoàn tất, Exit code = 0 | Hoàn tất trong {{exec_time}}s | ✅ PASS |
| **3. Kiểm thử hồi quy** | Các file dữ liệu khác | Các chức năng cũ hoạt động bình thường | 100% chức năng ổn định | ✅ PASS |

---

## 5. Hành Động Phòng Ngừa Tương Lai (Preventative Actions)

- [ ] Bổ sung cơ chế bọc lỗi `try ... finally` giải phóng tài nguyên.
- [ ] Bổ sung hàm kiểm tra ranh giới dữ liệu (Validation Guard).
- [ ] Cập nhật tài liệu hướng dẫn vận hành cho người dùng cuối.
