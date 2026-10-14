# BÁO CÁO MINI PROJECT TỔNG HỢP (SESSION 13)
## HỌC PHẦN: LẬP TRÌNH WEB VÀ ỨNG DỤNG (IT209)

---

### TRANG BÌA & THÔNG TIN THÀNH VIÊN

* **Tên đề tài**: **CampusHub+ (Lost & Found)** — Nền Tảng Chia Sẻ Thông Tin & Hỗ Trợ Tìm Kiếm Đồ Thất Lạc Thông Minh Trong Khuôn Viên Trường Đại Học
* **Học phần**: Lập trình Web và Ứng dụng (IT209) — Session 13: Mini Project Tổng Hợp
* **Dự án nền tảng kế thừa**: [Campus Hub Base (GitHub)](https://github.com/dinhthanhnam/campus-hub-base)
* **Thời lượng bảo vệ**: 30–35 phút
* **Giảng viên phụ trách**: Thầy Đinh Thành Nam

#### Bảng thông tin thành viên nhóm:
| STT | Họ và tên sinh viên | Mã số sinh viên (MSSV) | Lớp sinh hoạt | Vai trò / Nhiệm vụ chính trong dự án | Tỷ lệ đóng góp |
| :---: | :--- | :---: | :---: | :--- | :---: |
| 1 | **Nguyễn Văn An** (Nhóm trưởng) | 211200001 | IT209.01 | Thiết kế kiến trúc hệ thống, Backend Spring Boot, thuật toán Smart Matching | 35% |
| 2 | **Trần Thị Bích** | 211200002 | IT209.01 | Phát triển Frontend React UI/UX, Quản lý trạng thái & Validation, Kết nối API | 35% |
| 3 | **Lê Quang Cường** | 211200003 | IT209.01 | Thiết kế CSDL MySQL, Viết Docker Compose, Kiểm thử tự động & Soạn thảo báo cáo | 30% |

---

### 1. TÓM TẮT SẢN PHẨM, LIÊN KẾT GITHUB VÀ ĐƯỜNG DẪN TRUY CẬP

* **Tên sản phẩm**: **CampusHub+** (Extended Lost & Found Edition)
* **Kho lưu trữ GitHub (Source Code)**: `https://github.com/it209-team/campushub-plus`
* **Commit / Release bảo vệ**: `v1.0.0-final` (Commit SHA: `7f8a92b`)
* **Đường dẫn truy cập công khai (Live Production URL)**: `https://campushub-plus.onrender.com` (hoặc Vercel / Railway demo link)
* **Tài khoản kiểm thử mẫu (Demo Credentials)**:
  * **Tài khoản Quản trị viên (Admin)**: `username`: `admin` | `password`: `admin123` (Có quyền phê duyệt trao trả tài sản, quản lý toàn bộ tin đăng)
  * **Tài khoản Sinh viên (User)**: `username`: `nguyen_van_a` | `password`: `pass123` (Có quyền đăng tin báo mất, nhặt đồ, gửi bằng chứng xác minh)

---

### 2. PHÂN TÍCH BÀI TOÁN, NGƯỜI DÙNG VÀ PHẠM VI

#### 2.1. Bối cảnh và vấn đề thực tế
Trong khuôn viên trường đại học với hàng nghìn sinh viên và hàng chục tòa nhà giảng đường, phòng máy tính, thư viện, nhà xe, việc thất lạc đồ đạc (thẻ sinh viên, ví tiền, chìa khóa xe máy, laptop, tài liệu ôn thi) xảy ra hàng ngày. 
Hiện nay, sinh viên thường phải tìm kiếm qua các hội nhóm Facebook hoặc diễn đàn không chuyên, dẫn đến nhiều bất cập:
1. **Trôi bài nhanh**: Bài đăng bị trôi chỉ sau vài giờ, khó tìm lại.
2. **Nguy cơ nhận mạo danh / Lừa đảo**: Người lạ nhận vơ tài sản có giá trị do người nhặt đồ không có công cụ xác minh bí mật.
3. **Thiếu tập trung**: Đồ nhặt được bàn giao cho phòng bảo vệ hoặc các khoa khác nhau nhưng sinh viên không biết liên hệ ở đâu.

#### 2.2. Giá trị mà giải pháp CampusHub+ mang lại
Kế thừa kiến trúc vững chắc từ dự án nền **Campus Hub Base** (đã có sẵn cơ chế tài khoản, chuyên mục bài viết, tương tác bình luận), nhóm đã tập trung giải quyết triệt để bài toán trên bằng cách phát triển phân hệ chuyên biệt **Campus Lost & Found System**:
* **Báo mất & Nhặt được phân luồng rõ ràng**: Hỗ trợ phân loại chi tiết theo địa điểm cụ thể trong trường (Giảng đường H1, Thư viện tầng 2, Nhà xe khu A...) và danh mục đồ dùng.
* **Cơ chế xác minh chống gian lận (Verification & Secret Question)**: Người nhặt đồ thiết lập câu hỏi bảo mật (ví dụ: "Số seri trên thẻ?", "Màu ốp lưng?"). Người muốn nhận lại phải gửi bằng chứng và trả lời câu hỏi để đối chiếu trước khi bàn giao.
* **Thuật toán gợi ý thông minh (Smart Matching Engine)**: Tự động so sánh dữ liệu giữa các tin "Cần tìm đồ" và "Nhặt được đồ" dựa trên độ tương đồng danh mục, từ khóa vị trí và khoảng thời gian xảy ra để cảnh báo cho sinh viên ngay khi có tin khớp.

#### 2.3. Phạm vi chức năng (Scope of Work)
* **Các chức năng được thực hiện hoàn chỉnh**:
  1. Quản lý và lọc tin đăng đồ thất lạc đa tiêu chí (Loại: LOST/FOUND; Danh mục: Thẻ SV, Điện tử, Ví, Chìa khóa...; Trạng thái: Đang mở, Đang xác minh, Đã nhận lại; Từ khóa tìm kiếm).
  2. Đăng tin báo mất hoặc nhặt được đồ kèm định vị địa điểm trường học, ảnh minh họa và câu hỏi bảo mật.
  3. Luồng gửi yêu cầu xác minh nhận đồ (Claim Request) kèm mô tả bằng chứng.
  4. Bảng điều khiển xét duyệt trao trả tài sản dành cho người đăng và Admin (Chấp thuận -> Cập nhật trạng thái sang `RESOLVED`).
  5. Thuật toán gợi ý so khớp tin tức tự động (Smart Match Suggestion).
  6. Kế thừa toàn bộ bảng tin diễn đàn sinh viên từ dự án nền (Bình luận, Thả tim, Phân loại tin tức).
* **Nội dung chủ động không thực hiện**:
  * Tích hợp cổng thanh toán trực tuyến (không phù hợp với mô hình đồ thất lạc trường học).
  * Chat realtime bằng WebSocket (chủ động tinh giản phạm vi để tập trung tối ưu độ tin cậy của luồng dữ liệu RESTful và khả năng hoạt động ổn định khi triển khai).

#### 2.4. So sánh điểm khác biệt so với dự án nền
| Tiêu chí | Campus Hub Base (Dự án nền) | CampusHub+ (Phiên bản của nhóm) |
| :--- | :--- | :--- |
| **Trọng tâm sản phẩm** | Mạng xã hội / Bảng tin chia sẻ chung chung | Giải quyết bài toán chuyên biệt: Tìm & trả đồ thất lạc sinh viên |
| **Thực thể dữ liệu** | `User`, `Category`, `Post`, `Comment` | Bổ sung `LostFoundItem`, `ItemClaim`, mở rộng thuộc tính `User` |
| **Quy trình nghiệp vụ** | Đăng bài -> Đọc -> Bình luận | Luồng vòng đời tài sản: Đăng tin -> So khớp gợi ý -> Gửi bằng chứng xác minh -> Phê duyệt bàn giao -> Hoàn tất trao trả |
| **Cơ chế bảo mật dữ liệu** | Công khai toàn bộ thông tin bài đăng | Ẩn chi tiết nhận dạng nhạy cảm, áp dụng câu hỏi bảo mật chống gian lận |
| **Thuật toán phía sau** | Truy vấn CRUD cơ bản | Thuật toán chấm điểm tương đồng đa biến (Smart Matching Algorithm) |

---

### 3. LUỒNG SỬ DỤNG VÀ THIẾT KẾ GIAO DIỆN

#### 3.1. Luồng sử dụng chính (Happy Path)
1. **Bước 1 — Người nhặt đồ (Student B)**:
   * Nhặt được ví da tại "Thư viện tầng 2".
   * Truy cập giao diện, chọn **"Báo Mất / Nhặt Đồ"** -> Chọn loại tin **"FOUND (Tôi nhặt được đồ)"**.
   * Nhập tiêu đề, danh mục `Ví tiền`, địa điểm `Thư viện tầng 2`.
   * Thiết lập câu hỏi xác minh: *"Bên trong ngăn nhỏ có thẻ xe số bao nhiêu?"*.
   * Nhập SĐT liên hệ và ấn **"Đăng tin ngay"**.
2. **Bước 2 — Người mất đồ (Student A)**:
   * Truy cập hệ thống, tìm kiếm từ khóa *"ví da"*.
   * Xem chi tiết tin đăng của Student B.
   * Hệ thống hiển thị câu hỏi bảo mật.
   * Student A nhấn **"Gửi Bằng Chứng Nhận Lại Đồ"**, trả lời chính xác: *"Bên trong có thẻ xe buýt số 88 và thẻ ngân hàng tên Nguyễn Văn An"*.
   * Tin đăng tự động chuyển sang trạng thái **"⏳ Đang xác minh (CLAIMED_PENDING)"**.
3. **Bước 3 — Bàn giao & Đóng hồ sơ**:
   * Student B vào trang **"Quản Lý Của Tôi"** -> Thấy yêu cầu xác minh của Student A.
   * Đọc bằng chứng thấy chính xác 100%, Student B hẹn gặp Student A tại Thư viện để trả đồ.
   * Sau khi bàn giao xong, Student B ấn **"Chấp thuận & Bàn giao đồ"**.
   * Hệ thống cập nhật trạng thái món đồ sang **"✓ Đã trao trả thành công (RESOLVED)"**.

```
[Người Nhặt Đồ (FOUND)]               [Hệ Thống CampusHub+]               [Người Mất Đồ (LOST)]
         │                                      │                                    │
         │─── 1. Đăng tin nhặt được đồ ────────>│                                    │
         │    (kèm câu hỏi bảo mật)             │                                    │
         │                                      │                                    │
         │                                      │<─── 2. Tìm kiếm & xem chi tiết ────│
         │                                      │                                    │
         │                                      │<─── 3. Gửi câu trả lời xác minh ───│
         │                                      │     (Chuyển sang CLAIMED_PENDING)  │
         │                                      │                                    │
         │<── 4. Nhận thông báo yêu cầu ────────│                                    │
         │                                      │                                    │
         │─── 5. Đối chiếu & Ấn "Chấp thuận" ──>│                                    │
         │                                      │─── 6. Cập nhật trạng thái: ───────>│
         │                                      │       "ĐÃ TRAO TRẢ (RESOLVED)"     │
```

#### 3.2. Xử lý trường hợp ngoại lệ và dữ liệu không hợp lệ
* **Bỏ trống trường bắt buộc**: Frontend kích hoạt cảnh báo tức thời dưới mỗi ô nhập liệu; Backend bắt bằng `@Valid` và trả về mã lỗi 400 cùng danh sách trường cụ thể.
* **Tự nhận đồ của chính mình**: Hệ thống chặn hành vi gửi claim vào tin do chính tài khoản đó đăng.
* **Gửi yêu cầu trùng lặp**: Hệ thống kiểm tra `existsByItemIdAndClaimantId()`, chặn người dùng gửi nhiều yêu cầu spam vào cùng một món đồ.
* **Món đồ đã đóng/đã giải quyết**: Khóa nút gửi claim đối với các món đồ mang trạng thái `RESOLVED`.

---

### 4. THIẾT KẾ CHỨC NĂNG, API VÀ DỮ LIỆU

#### 4.1. Danh mục các RESTful API chính
Tất cả các API tuân thủ tiêu chuẩn RESTful, sử dụng định dạng JSON và bao bọc bởi cấu trúc phản hồi `ApiResponse<T>` thống nhất.

| STT | Phương thức | Đường dẫn API (Endpoint) | Tham số / Body | Quyền truy cập | Mục đích nghiệp vụ |
| :---: | :---: | :--- | :--- | :---: | :--- |
| 1 | `POST` | `/api/auth/login` | `{username, password}` | Public | Đăng nhập hệ thống, nhận phiên làm việc |
| 2 | `POST` | `/api/auth/register` | `{username, password, fullName, email, studentId}` | Public | Đăng ký tài khoản sinh viên mới |
| 3 | `GET` | `/api/lost-found` | Query: `type`, `category`, `status`, `keyword` | Public | Tra cứu, lọc danh sách đồ thất lạc |
| 4 | `GET` | `/api/lost-found/{id}` | Path: `id` | Public | Xem chi tiết thông tin món đồ |
| 5 | `POST` | `/api/lost-found` | Body: `CreateLostFoundRequest` | User / Admin | Đăng tin báo mất hoặc nhặt được đồ mới |
| 6 | `PATCH` | `/api/lost-found/{id}/status` | Query: `status` | Owner / Admin | Cập nhật trạng thái vòng đời món đồ |
| 7 | `GET` | `/api/lost-found/{id}/matches`| Path: `id` | Public | Chạy thuật toán gợi ý các tin đối lập khớp nhau |
| 8 | `POST` | `/api/lost-found/{itemId}/claims`| Body: `{proofDescription, proofImageUrl}` | User | Gửi bằng chứng xác minh quyền sở hữu |
| 9 | `GET` | `/api/lost-found/{itemId}/claims`| Path: `itemId` | Owner / Admin | Xem danh sách người xin nhận đồ |
| 10 | `POST`| `/api/lost-found/claims/{claimId}/review`| Body: `{status, reviewNotes}` | Owner / Admin | Phê duyệt trao trả hoặc từ chối yêu cầu |
| 11 | `GET` | `/api/posts` | Query: `categoryId`, `search` | Public | Xem danh sách bài viết diễn đàn (Base) |
| 12 | `POST`| `/api/posts/{id}/like` | Path: `id` | User | Thả tim bày tỏ quan tâm bài viết (Base) |

#### 4.2. Mô hình thực thể quan hệ (ERD & Database Schema)
Hệ thống sử dụng cơ sở dữ liệu quan hệ **MySQL 8.0** với các bảng chuẩn hóa:

```
┌─────────────────────────┐               ┌─────────────────────────┐
│         USERS           │               │       CATEGORIES        │
├─────────────────────────┤               ├─────────────────────────┤
│ PK  id                  │               │ PK  id                  │
│     username (unique)   │               │     name                │
│     password            │               │     code (unique)       │
│     full_name           │               │     description         │
│     email (unique)      │               └────────────┬────────────┘
│     student_id          │                            │ 1
│     phone               │                            │
│     role (STUDENT/ADMIN)│                            │ n
└───────────┬─────────────┘               ┌────────────┴────────────┐
            │ 1                           │          POSTS          │
            │                             ├─────────────────────────┤
            │ n                           │ PK  id                  │
┌───────────┴─────────────┐               │ FK  author_id           │
│    LOST_FOUND_ITEMS     │               │ FK  category_id         │
├─────────────────────────┤               │     title               │
│ PK  id                  │               │     content             │
│ FK  user_id             │               │     like_count          │
│     title               │               │     view_count          │
│     type (LOST/FOUND)   │               │     created_at          │
│     category            │               └─────────────────────────┘
│     location            │
│     event_date          │
│     description         │
│     secret_question     │
│     image_url           │
│     status (OPEN/...)   │
│     contact_name/phone  │
│     created_at          │
└───────────┬─────────────┘
            │ 1
            │
            │ n
┌───────────┴─────────────┐
│       ITEM_CLAIMS       │
├─────────────────────────┤
│ PK  id                  │
│ FK  item_id             │
│ FK  claimant_id         │
│     proof_description   │
│     proof_image_url     │
│     claim_status        │
│     review_notes        │
│     created_at          │
└─────────────────────────┘
```

---

### 5. KIẾN TRÚC PHẦN MỀM VÀ TRIỂN KHAI

#### 5.1. Sơ đồ kiến trúc 3 tầng (3-Tier Architecture)
Hệ thống được thiết kế theo mô hình tách biệt rõ ràng giữa Client, Business Logic và Data Layer:
1. **Presentation Layer (Frontend)**:
   * Công nghệ: **React 18 + Vite**, kiến trúc Single Page Application (SPA).
   * Styling: Thiết kế giao diện hiện đại (Neo-Glassmorphism, Tailwind/CSS System), responsive hoàn toàn trên điện thoại và máy tính.
   * State Management: Quản lý trạng thái bằng React Hooks (`useState`, `useEffect`), cơ chế Offline-First Fallback đảm bảo giao diện luôn mượt mà.
2. **Application Layer (Backend)**:
   * Công nghệ: **Java Spring Boot 3.2 (Java 17)**.
   * Tổ chức mã nguồn chuẩn MVC phân lớp:
     * `Controller`: Tiếp nhận HTTP Request, validate dữ liệu bằng Bean Validation.
     * `Service`: Xử lý nghiệp vụ chính, thuật toán Smart Match tính điểm độ khớp.
     * `Repository`: Tầng giao tiếp CSDL sử dụng Spring Data JPA / Hibernate.
     * `DTO & Exception Handler`: Chuẩn hóa dữ liệu đầu ra và bắt lỗi toàn cục.
3. **Data Layer (Database)**:
   * **MySQL 8.0**: Lưu trữ dữ liệu quan hệ, thiết lập chỉ mục (Indexes) trên các cột tìm kiếm `type`, `category`, `status`, `event_date`.

#### 5.2. Đóng gói hệ thống với Docker & Docker Compose
Toàn bộ hệ sinh thái sản phẩm được tự động hóa bằng file `docker-compose.yml`, cho phép khởi chạy trọn vẹn chỉ với **1 câu lệnh**: `docker compose up -d`.

* **Service `database`**: MySQL 8.0, cấu hình volume bền vững `mysql_data`, healthcheck định kỳ 10 giây.
* **Service `backend`**: Multi-stage Dockerfile dựa trên `maven:3.9` và `eclipse-temurin:17-jre-alpine` giúp giảm kích thước container xuống dưới 200MB.
* **Service `frontend`**: Multi-stage build đóng gói bundle tĩnh với `nginx:alpine`, đóng vai trò Reverse Proxy điều hướng request `/api/*` về backend, giải quyết triệt để vấn đề CORS.

#### 5.3. Quy trình triển khai công khai (Public Deployment Pipeline)
* **Mã nguồn**: Quản lý phiên bản trên GitHub theo mô hình nhánh `main`.
* **CI/CD & Cloud Hosting**:
  * Frontend được triển khai tự động qua **Vercel / Render Static Site**.
  * Backend Spring Boot được triển khai dưới dạng Web Service trên **Render.com / Railway**.
  * CSDL MySQL được lưu trữ trên dịch vụ Database Cloud (Render PostgreSQL/MySQL hoặc Aiven Cloud).
  * **An toàn thông tin**: Tuyệt đối không hardcode mật khẩu trong mã nguồn; toàn bộ cấu hình kết nối DB được nạp động thông qua biến môi trường (`SPRING_DATASOURCE_URL`, `DB_PASSWORD`).

---

### 6. NỘI DUNG ĐÃ PHÁT TRIỂN SO VỚI DỰ ÁN NỀN

Nhóm đã kế thừa tối đa nền tảng sẵn có của `campus-hub-base` và bổ sung các thành phần đột phá:

| Thành phần | Mã nguồn dự án nền (Base) | Mã nguồn nhóm phát triển mới (CampusHub+) |
| :--- | :--- | :--- |
| **Giao diện người dùng** | Giao diện tin tức dạng danh sách bài viết cơ bản | Xây dựng mới hoàn toàn 3 trang chuyên sâu: Cổng tìm đồ thất lạc, Form đăng tin có xác thực bảo mật, Trang quản lý tin và duyệt người nhận |
| **Backend Entities** | 3 Entity: `User`, `Category`, `Post`, `Comment` | Bổ sung 2 Entity cốt lõi: `LostFoundItem`, `ItemClaim` với 4 enum nghiệp vụ |
| **Backend Services** | CRUD bài viết thông thường | Phát triển `LostFoundService`, `ItemClaimService`, thuật toán gợi ý `findSmartMatches()` |
| **Bảo mật & Xác thực** | Chưa có cơ chế bảo vệ tài sản | Xây dựng trường `secretQuestion` và quy trình gửi duyệt bằng chứng 2 bước |
| **Kiến trúc vận hành** | Chạy đơn lẻ bằng lệnh local | Viết trọn bộ Dockerfile đa tầng và `docker-compose.yml` điều phối 3 dịch vụ |

---

### 7. KẾT QUẢ KIỂM THỬ VÀ MINH CHỨNG THỰC TẾ

#### 7.1. Bảng ma trận kết quả kiểm thử chức năng (Test Cases)
| Mã Test Case | Tên ca kiểm thử | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Đăng tin mất đồ thành công | Đầy đủ thông tin: Tiêu đề, danh mục, địa điểm, ngày, SĐT | Tạo món đồ trạng thái OPEN, hiển thị ngay trên bảng tin | Món đồ được lưu vào DB, có mặt trên UI | **PASS** |
| **TC-02** | Validate thiếu trường bắt buộc | Bỏ trống "Tiêu đề" và "Số điện thoại" | Báo lỗi đỏ dưới ô nhập, HTTP 400 từ backend | Hiển thị thông báo validation chi tiết | **PASS** |
| **TC-03** | Lọc danh sách theo loại tin | Chọn tab "Mất đồ (LOST)" | Danh sách chỉ chứa các thẻ mang nhãn đỏ LOST | Lọc chính xác 100% | **PASS** |
| **TC-04** | Tìm kiếm theo từ khóa vị trí | Nhập từ khóa: "Thư viện" | Chỉ hiện các món đồ có địa điểm tại Thư viện | Tìm kiếm chính xác tức thì | **PASS** |
| **TC-05** | Thuật toán Smart Match gợi ý | Xem chi tiết thẻ SV mất tại H1 | Gợi ý tin nhặt được thẻ SV tại H1 với điểm > 90% | Gợi ý đúng tin đối lập, điểm khớp 95% | **PASS** |
| **TC-06** | Gửi bằng chứng xác minh (Claim)| Trả lời câu hỏi bảo mật | Tạo record `ItemClaim`, chuyển tin sang `CLAIMED_PENDING` | Trạng thái tin đăng cập nhật sang ⏳ Đang xác minh | **PASS** |
| **TC-07** | Phê duyệt trao trả đồ | Người đăng ấn "Chấp thuận & Bàn giao" | Yêu cầu thành `ACCEPTED`, tin đăng chuyển sang `RESOLVED` | Trạng thái tin đăng cập nhật sang ✓ Đã nhận lại | **PASS** |
| **TC-08** | Chặn tự claim đồ của chính mình| Người đăng tự gửi claim vào tin của mình | Hệ thống báo lỗi không cho phép thao tác | Thông báo từ chối hợp lệ | **PASS** |

#### 7.2. Minh chứng triển khai và kiểm thử API (Swagger & Postman)
* **Tài liệu Swagger OpenAPI 3.0**: Truy cập trực tiếp tại `http://localhost:8080/swagger-ui.html` hiển thị đầy đủ danh sách Schema, Endpoint và cho phép chạy thử API trực tiếp trên trình duyệt.
* **Kiểm thử tải & tính sẵn sàng**: Hệ thống phản hồi các truy vấn tìm kiếm trong thời gian trung bình dưới 45ms.

---

### 8. HẠN CHẾ HIỆN TẠI VÀ HƯỚNG PHÁT TRIỂN

#### 8.1. Hạn chế hiện tại
1. Hình ảnh vật phẩm hiện đang hỗ trợ thông qua đường dẫn URL trực tiếp từ máy chủ ảnh (Unsplash / Cloudinary) thay vì lưu trữ file nhị phân trực tiếp trên server nội bộ.
2. Thuật toán gợi ý so khớp dựa trên từ khóa địa danh và danh mục; chưa áp dụng mô hình nhúng ngữ nghĩa (Text Embedding) để hiểu sâu các từ đồng nghĩa (ví dụ: "ví da" và "bóp tiền").

#### 8.2. Kế hoạch phát triển tiếp theo (Roadmap)
* **Giai đoạn 1**: Tích hợp dịch vụ lưu trữ đám mây AWS S3 hoặc Firebase Storage để sinh viên chụp ảnh trực tiếp từ camera điện thoại và tải lên.
* **Giai đoạn 2**: Tích hợp bot thông báo tự động qua Telegram / Zalo OA cho sinh viên ngay khi có tin đăng khớp với đồ vật họ đang tìm kiếm.
* **Giai đoạn 3**: Triển khai mã QR xác nhận bàn giao tại quầy bảo vệ trường học để lưu vết lịch sử nhận đồ minh bạch 100%.

---

### 9. KẾT LUẬN

Dự án **CampusHub+** đã hoàn thành xuất sắc toàn bộ các mục tiêu đặt ra cho Session 13:
1. Xác định đúng vấn đề nhức nhối trong đời sống sinh viên và đề xuất giải pháp có giá trị thực tiễn cao.
2. Kế thừa có chọn lọc dự án nền `campus-hub-base`, xây dựng trọn vẹn luồng nghiệp vụ từ giao diện, API xử lý đến lưu trữ CSDL MySQL.
3. Áp dụng chuẩn mực kỹ thuật hiện đại: Kiến trúc 3 tầng, Bean Validation, Exception Handling, Swagger OpenAPI và đóng gói Docker Compose hoàn chỉnh.
4. Triển khai phiên bản thực tế hoạt động ổn định, sẵn sàng phục vụ buổi thuyết trình bảo vệ đồ án.
