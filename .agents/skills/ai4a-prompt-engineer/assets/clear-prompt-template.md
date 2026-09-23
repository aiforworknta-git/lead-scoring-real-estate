# CLEAR PROMPT TEMPLATE - THỰC CHIẾN DOANH NGHIỆP (AI4A)

> **Mục tiêu:** Áp dụng mẫu Prompt này để yêu cầu AI thực hiện bất kỳ bài toán nghiệp vụ phức tạp nào mà không lo bị lan man, thiếu sót hay sai lệch số liệu.

---

```markdown
# CLEAR PROMPT: [TÊN BÀI TOÁN HOẶC TÁC VỤ CẦN THỰC HIỆN]

## C - CONTEXT (BỐI CẢNH NGHIỆP VỤ & DỮ LIỆU)

- **Doanh nghiệp & Lĩnh vực:** [Ví dụ: Doanh nghiệp đồ uống FMCG, mô hình phân phối qua Nhà phân phối phụ (SubD) và đội ngũ Sales Rep đi tuyến].
- **Vai trò của tôi:** [Ví dụ: Giám sát bán hàng khu vực / Operations Analyst].
- **Nguồn dữ liệu hiện có:**
  1. [Bảng 1: Tên bảng, các cột chính (ví dụ: SubD_ID, Tên, Sản lượng Sell-In, Target)]
  2. [Bảng 2: Tên bảng, các cột chính (ví dụ: Tồn kho Stock, SCD theo SKU)]
  3. [Bảng 3: Danh sách điểm bán Outlets Active / Inactive]
- **Mục tiêu quản trị:** [Ví dụ: Tìm ra các đại lý có nguy cơ không đạt Target và các điểm bán quen chưa phát sinh đơn trong tháng để Sales Rep đi tuyến thăm viếng].

---

## L - LENGTH / FORMAT (CẤU TRÚC ĐỊNH DẠNG ĐẦU RA)

Trình bày kết quả theo đúng cấu trúc chuẩn sau:

### Phần 1: Báo Cáo Tóm Tắt Điều Hành (Executive Brief)
Bảng Markdown gồm:
| Chỉ Số Cốt Lõi | Thực Đạt | Chỉ Tiêu Target | % Hoàn Thành | Đánh Giá Tác Chiến |

### Phần 2: Bảng Phân Tích Chi Tiết Theo Thực Thể
Bảng Markdown gồm:
| Mã Định Danh | Tên Đơn Vị | Khu Vực | Sản Lượng Thực Tế | Tồn Kho SCD | Mức Độ Rủi Ro (Đỏ/Vàng/Xanh) |

### Phần 3: Danh Sách Hành Động Cụ Thể (Actionable Tasks)
Danh sách gạch đầu dòng phân theo mức độ ưu tiên:
- **Ưu tiên 1 (Khẩn cấp):** ...
- **Ưu tiên 2 (Trong tuần):** ...

---

## E - EXPECTATION & CONSTRAINTS (KỲ VỌNG & RÀNG BUỘC)

- Phải phù hợp 100% với thực tế vận hành ngành [FMCG / B2B / Phân phối].
- Tập trung vào tính hành động (Actionable Insights) cho cấp quản lý ra quyết định.
- Sử dụng thuật ngữ chuyên môn chuẩn xác: [Sell-In, Sell-Out, Run-rate, SCD, ASO, Target].

### ⛔ TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM (NEGATIVE CONSTRAINTS):
1. **TUYỆT ĐỐI KHÔNG** tự ý bịa đặt hoặc phỏng đoán số liệu khi không có trong nguồn dữ liệu cung cấp.
2. **TUYỆT ĐỐI KHÔNG** đưa ra các lời khuyên chung chung, sáo rỗng thiếu căn cứ số học.
3. **TUYỆT ĐỐI KHÔNG** bỏ qua các trường hợp ngoại lệ hoặc mẫu số bằng 0 gây lỗi `NaN%`.

---

## A - ACTION (ĐÓNG VAI & CÁC BƯỚC THỰC HIỆN)

**Đóng vai:** Chuyên gia cấp cao về [Sales Analytics / Commercial Finance / FMCG Route-to-Market] với hơn 15 năm kinh nghiệm thực chiến.

Thực hiện các bước tuần tự sau:
1. **Bước 1:** Đọc và làm sạch toàn bộ dữ liệu nguồn, loại bỏ các dòng rác hoặc mã trùng lặp.
2. **Bước 2:** Tính toán các chỉ số phái sinh (Tỷ lệ đạt Target %, Tỷ lệ tiêu thụ SO/SI %, Phân loại cảnh báo SCD).
3. **Bước 3:** Lập bảng tổng hợp và xếp hạng theo thứ tự ưu tiên xử lý.
4. **Bước 4:** Soạn thảo kịch bản hành động ngắn gọn cho đội ngũ thực địa.

---

## R - REFINE (HỎI LẠI & TỰ KIỂM TRA)

- **Trước khi trả lời:** Hãy hỏi tối đa 2 câu hỏi nếu nhận thấy dữ liệu nguồn thiếu trường quan trọng ảnh hưởng đến kết quả.
- **Sau khi hoàn thành:** Tự kiểm tra các tiêu chí:
  - [ ] Đã bao phủ 100% các đối tượng hợp lệ trong dữ liệu chưa?
  - [ ] Các con số cộng tổng có khớp chính xác với file nguồn không?
  - [ ] Đã có đủ các cảnh báo ngoại lệ (Đỏ/Vàng/Xanh) chưa?
```
