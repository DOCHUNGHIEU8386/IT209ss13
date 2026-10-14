# 🎓 CampusHub+ (Extended Lost & Found Edition)
> **Mini Project Tổng Hợp — Session 13 | Học phần Lập trình Web và Ứng dụng (IT209)**  
> Kế thừa & Phát triển từ dự án nền: [Campus Hub Base (GitHub)](https://github.com/dinhthanhnam/campus-hub-base)  
> Giảng viên hướng dẫn: **Thầy Đinh Thành Nam**

---

## 🌟 1. Giới Thiệu Dự Án
**CampusHub+** là nền tảng số hỗ trợ sinh viên trong khuôn viên trường đại học, kết hợp giữa mạng xã hội thông tin học tập và **Hệ thống Quản lý & Khớp nối Đồ Thất Lạc Thông Minh (Campus Lost & Found)**.

### ✨ Điểm nổi bật & tính năng mở rộng:
1. **Phân luồng báo mất (LOST) & nhặt được (FOUND)**: Gắn liền với các địa danh thực tế trong trường (Giảng đường H1, Thư viện, Căn tin, Nhà xe...).
2. **Cơ chế xác minh chống gian lận (Anti-Fraud Claim)**: Người nhặt đồ thiết lập *câu hỏi bảo mật bí mật*; người muốn nhận lại đồ phải trả lời đúng và cung cấp bằng chứng trước khi gặp mặt.
3. **Thuật toán gợi ý thông minh (Smart Matching Engine)**: Tự động so sánh dữ liệu giữa các tin LOST và FOUND dựa trên danh mục, địa điểm và thời gian để đưa ra cảnh báo cho sinh viên.
4. **Quy trình bàn giao hoàn chỉnh**: Người đăng tin hoặc Admin xem xét bằng chứng -> Chấp thuận -> Hệ thống cập nhật trạng thái `RESOLVED (Đã trao trả thành công)`.
5. **Kế thừa bảng tin trường học**: Đầy đủ tính năng đăng bài, thả tim, bình luận và chia sẻ tài liệu ôn thi.

---

## 🛠️ 2. Công Nghệ Sử Dụng

* **Frontend**: React 18, Vite, Lucide Icons, Modern Glassmorphism CSS Design System.
* **Backend**: Java Spring Boot 3.2 (Java 17), Spring Data JPA, Hibernate, Bean Validation, OpenAPI 3.0 (Swagger).
* **Database**: MySQL 8.0 (hỗ trợ fallback H2 In-Memory).
* **DevOps & Container**: Dockerfile đa tầng, Nginx Reverse Proxy, Docker Compose.

---

## 🚀 3. Hướng Dẫn Khởi Chạy Hệ Thống

### Cách 1: Khởi chạy 1-Click bằng Docker Compose (Khuyên dùng)
Yêu cầu: Máy đã cài đặt Docker Desktop.

```bash
# Khởi động toàn bộ 3 dịch vụ (MySQL + Spring Boot + React Nginx)
docker compose up -d --build
```
* **Frontend**: Truy cập tại `http://localhost` hoặc `http://localhost:3000`
* **Backend API**: Truy cập tại `http://localhost:8080/api`
* **Tài liệu Swagger API**: Truy cập tại `http://localhost:8080/swagger-ui.html`

Để dừng hệ thống:
```bash
docker compose down
```

---

### Cách 2: Khởi chạy thủ công từng phần

#### 1. Khởi chạy Backend (Spring Boot):
Yêu cầu: Java 17+, Maven.
```bash
cd backend
mvn clean spring-boot:run
```
*(Mặc định backend tự tạo database và nạp dữ liệu mẫu từ `data.sql`)*

#### 2. Khởi chạy Frontend (React):
Yêu cầu: Node.js 18+.
```bash
cd frontend
npm install
npm run dev
```
Truy cập tại `http://localhost:5173`.

---

## 🔑 4. Tài Khoản & Dữ Liệu Kiểm Thử Mẫu

| Tài khoản | Username | Password | Vai trò | Quyền hạn kiểm thử |
| :--- | :---: | :---: | :---: | :--- |
| **Quản trị viên** | `admin` | `admin123` | `ADMIN` | Quản trị toàn bộ tin, duyệt và đóng hồ sơ trao trả đồ |
| **Sinh viên A** | `nguyen_van_a` | `pass123` | `STUDENT` | Báo mất đồ, gửi yêu cầu xác minh nhận lại đồ |
| **Sinh viên B** | `tran_thi_b` | `pass123` | `STUDENT` | Nhặt được đồ, thiết lập câu hỏi bảo mật, phê duyệt trao trả |

---

## 📋 5. Sản Phẩm Báo Cáo Cần Nộp (Mục 5 Đề Bài)

Tất cả tài liệu báo cáo đầy đủ 9 mục theo yêu cầu đã được biên soạn sẵn tại thư mục `docs/`:

1. **File Báo cáo Word (`.docx`)**:
   * File nguồn: `docs/REPORT_BAO_CAO_SESSION_13.html` và `docs/REPORT_BAO_CAO_SESSION_13.md`.
   * **Cách xuất ra `.docx`**:
     * Cách 1: Chạy script `python docs/export_to_docx.py` hoặc PowerShell `.\docs\export_to_docx.ps1`.
     * Cách 2: Chuột phải vào `docs/REPORT_BAO_CAO_SESSION_13.html` -> Chọn **Open with Microsoft Word** -> Vào **File -> Save As -> Word Document (.docx)**.
2. **Liên kết GitHub**: Ghi kèm commit tag bảo vệ `v1.0.0-final`.

---

## 🌐 6. Hướng Dẫn Triển Khai Công Khai Miễn Phí (Live Demo URL)

Để đáp ứng tiêu chí: *"Được triển khai trên môi trường công khai và có thể truy cập bằng đường dẫn do nhóm cung cấp"*:

1. **Deploy Frontend trên Vercel / Render**:
   * Kết nối repo GitHub với Vercel -> Root Directory chọn `frontend` -> Framework: Vite -> Deploy.
2. **Deploy Backend trên Render / Railway**:
   * Tạo Web Service mới trên [Render.com](https://render.com) -> Trỏ tới thư mục `backend` -> Chọn Environment: Docker (hoặc Java Maven).
   * Tạo cơ sở dữ liệu MySQL miễn phí trên Render hoặc Aiven.
   * Cấu hình Environment Variables: `DB_HOST`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.
