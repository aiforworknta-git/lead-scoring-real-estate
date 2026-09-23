# CẨM NANG GỠ LỖI & LẬP TRÌNH PHÒNG THỦ (DEFENSIVE PROGRAMMING BEST PRACTICES)

> Dành cho kỹ sư phần mềm `ai4a-software-engineer` áp dụng khi vận hành, gỡ lỗi và phát triển hệ thống.

---

## 1. Triết Lý Vá Lỗi Phẫu Thuật (Surgical Patching Philosophy)

* **Không viết lại khi chỉ cần vá:** Đừng bao giờ viết lại (rewrite) cả một hàm 200 dòng khi chỉ có 1 phép toán bị lỗi chia cho 0.
* **Tôn trọng mã nguồn hiện hữu:** Giữ nguyên tên biến, phong cách viết code (formatting style) và các chú thích (comments) có sẵn.
* **Diff tối thiểu:** Bản vá lý tưởng là bản vá có số dòng thay đổi ít nhất nhưng mang lại hiệu quả cao nhất và ít rủi ro nhất.

---

## 2. Nguyên Tắc Lập Trình Phòng Thủ (Defensive Programming Rules)

### A. Quản Lý Bộ Nhớ & Tiến Trình (Resource Management)
* **Quy tắc vàng:** Bất kỳ tài nguyên nào mở ra (`FileStream`, `DatabaseConnection`, `COMObject`, `ChildProcess`) **BẮT BUỘC** phải được giải phóng trong khối `finally`.
* **Mẫu PowerShell an toàn:**
  ```powershell
  $excel = New-Object -ComObject Excel.Application
  try {
      # Thực thi logic...
  } finally {
      $excel.Quit()
      [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
      [System.GC]::Collect()
      [System.GC]::WaitForPendingFinalizers()
  }
  ```

### B. Bảo Vệ Dữ Liệu Đầu Vào (Input Validation & Guard Clauses)
* Kiểm tra `null` / `undefined` ngay đầu hàm (Fail fast).
* Luôn đặt giá trị mặc định an toàn cho biến:
  ```javascript
  const target = Number(item?.target_total ?? 0);
  const actual = Number(item?.actual_si ?? 0);
  ```

### C. Cơ Chế Xử Lý Lỗi Chia Cho 0
* Tuyệt đối không để xảy ra biểu thức chia trần `a / b`. Luôn dùng hàm bọc an toàn:
  ```javascript
  const safeRate = (numerator, denominator) => {
      const num = Number(numerator || 0);
      const denom = Number(denominator || 0);
      return denom > 0 ? Number(((num / denom) * 100).toFixed(1)) : 0;
  };
  ```

---

## 3. Quy Trình Kiểm Thử Hồi Quy (Regression Testing Protocol)

Mỗi khi vá một bug, kỹ sư phần mềm bắt buộc phải thực hiện 3 bài kiểm tra:
1. **Unit Test Lỗi:** Chạy đúng trường hợp (case) đã gây ra crash để xác nhận lỗi đã hết.
2. **Boundary Test:** Kiểm tra các giá trị biên (dữ liệu rỗng, số 0, số âm, số cực lớn, ký tự đặc biệt tiếng Việt).
3. **Integration Test:** Chạy toàn bộ kịch bản từ đầu đến cuối (End-to-End Pipeline) để đảm bảo đầu ra cuối cùng vẫn đạt chuẩn 100%.
