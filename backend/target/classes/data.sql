-- ========================================================
-- Seed Data for Campus Hub Extended - Mini Project Session 13
-- ========================================================

-- Insert Sample Users
INSERT INTO users (id, username, password, full_name, email, student_id, phone, role, created_at)
VALUES 
(1, 'admin', 'admin123', 'Quản Trị Viên Trường', 'admin@campus.edu.vn', 'AD001', '0912345678', 'ADMIN', CURRENT_TIMESTAMP),
(2, 'nguyen_van_a', 'pass123', 'Nguyễn Văn An', 'an.nv@campus.edu.vn', 'SV2021001', '0987654321', 'STUDENT', CURRENT_TIMESTAMP),
(3, 'tran_thi_b', 'pass123', 'Trần Thị Bích', 'bich.tt@campus.edu.vn', 'SV2021002', '0978112233', 'STUDENT', CURRENT_TIMESTAMP),
(4, 'le_quang_c', 'pass123', 'Lê Quang Cường', 'cuong.lq@campus.edu.vn', 'SV2022015', '0905998877', 'STUDENT', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Insert Categories
INSERT INTO categories (id, name, code, description)
VALUES 
(1, 'Thông báo chung', 'ANNOUNCEMENT', 'Các thông báo từ Ban giám hiệu, phòng Đào tạo và Đoàn trường'),
(2, 'Học tập & Tài liệu', 'ACADEMIC', 'Trao đổi phương pháp học tập, tài liệu ôn thi môn học'),
(3, 'Đời sống sinh viên', 'STUDENT_LIFE', 'Ký túc xá, câu lạc bộ, sự kiện sinh viên và tuyển dụng'),
(4, 'Tìm & Trả Đồ Thất Lạc', 'LOST_AND_FOUND', 'Kênh tiếp nhận và xác minh tìm kiếm vật phẩm thất lạc')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Sample Posts (Campus Hub Base Feature)
INSERT INTO posts (id, title, content, author_id, category_id, like_count, view_count, created_at)
VALUES 
(1, 'Lịch thi kết thúc học phần Học kỳ 1 năm học 2024-2025', 'Phòng Đào tạo thông báo lịch thi chi tiết cho toàn bộ các khoa đã được cập nhật trên cổng thông tin sinh viên. Đề nghị các bạn sinh viên kiểm tra phòng thi và mang theo thẻ SV.', 1, 1, 45, 320, CURRENT_TIMESTAMP),
(2, 'Tài liệu ôn tập và đề cương môn Lập trình Web nâng cao IT209', 'Chia sẻ cho các bạn K21 bộ đề cương tóm tắt kiến trúc Spring Boot, RESTful API và React Router để ôn tập Session 13 và chuẩn bị bảo vệ Mini Project thật tốt nhé!', 2, 2, 88, 560, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert Sample Lost and Found Items (New Extended Feature)
INSERT INTO lost_found_items (id, title, type, category, location, event_date, description, secret_question, image_url, status, contact_name, contact_phone, contact_location, user_id, created_at, updated_at)
VALUES 
(1, 'Nhặt được Thẻ Sinh Viên tại Giảng đường H1 - Bàn 302', 'FOUND', 'STUDENT_CARD', 'Giảng đường H1 tầng 3', '2024-10-12', 'Nhặt được 01 thẻ sinh viên trường, mang mã số K21, ngành CNTT. Hiện đã gửi tạm tại phòng Quản lý Giảng đường H1.', 'Họ và tên đầy đủ và 3 số cuối mã SV ghi trên thẻ?', 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=500&auto=format&fit=crop', 'OPEN', 'Nguyễn Văn An', '0987654321', 'Phòng Quản lý Giảng đường H1 (Gặp thầy Nam)', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Mất Chùm Chìa Khóa xe máy Honda có móc khóa Pikachu', 'LOST', 'KEYS', 'Nhà xe khu A hoặc Lối vào Căn tin', '2024-10-13', 'Sáng nay khoảng 9h30 mình có đánh rơi chùm chìa khóa xe Wave có gắn móc khóa gấu bông Pikachu nhỏ và 1 chìa khóa phòng trọ. Ai nhặt được cho mình xin chuộc lại với ạ!', 'Trên chìa khóa phòng trọ có đánh số mấy?', 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop', 'OPEN', 'Trần Thị Bích', '0978112233', 'Ký túc xá Phòng B402 hoặc liên hệ trực tiếp SĐT', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Nhặt được Ví da nam màu nâu tại Thư viện Tầng 2', 'FOUND', 'WALLET_PURSE', 'Thư viện trường - Tầng 2 khu tự học', '2024-10-14', 'Nhặt được một ví da bò màu nâu sẫm, bên trong có một ít tiền mặt và giấy tờ tùy thân mang tên sinh viên khoa Kinh tế.', 'Bên trong ngăn kéo nhỏ của ví có thẻ gì đặc biệt?', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop', 'CLAIMED_PENDING', 'Lê Quang Cường', '0905998877', 'Bàn trực thủ thư Tầng 2 Thư viện', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 'Đã trao trả Laptop Acer Nitro để quên tại Phòng máy 405', 'FOUND', 'ELECTRONICS', 'Phòng thực hành máy tính 405', '2024-10-10', 'Bạn sinh viên để quên laptop sau giờ thực hành môn Mạng máy tính. Đã được chủ nhân đến xác minh mật khẩu và nhận lại thành công.', 'Mật khẩu đăng nhập Windows và hình dán sau lưng máy?', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop', 'RESOLVED', 'Quản Trị Viên Trường', '0912345678', 'Văn phòng Đoàn trường P.102', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert Sample Claim Request
INSERT INTO item_claims (id, item_id, claimant_id, proof_description, proof_image_url, claim_status, review_notes, created_at)
VALUES 
(1, 3, 2, 'Ví này là của em bị rơi lúc 14h chiều khi đang ngồi ôn bài ở dãy bàn số 4. Ngăn phụ bên trong có thẻ xe buýt tháng số 88 và thẻ ngân hàng Vietcombank tên Nguyễn Văn An.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop', 'SUBMITTED', 'Đang chờ người nhặt đồ đối chiếu khi hẹn gặp tại Thư viện', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE proof_description=VALUES(proof_description);
