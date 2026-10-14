// Initial Seed Data for Frontend Demo
export const INITIAL_ITEMS = [
  {
    id: 1,
    title: 'Nhặt được Thẻ Sinh Viên tại Giảng đường H1 - Bàn 302',
    type: 'FOUND',
    category: 'STUDENT_CARD',
    categoryDisplayName: 'Thẻ sinh viên / Thẻ xe',
    location: 'Giảng đường H1 tầng 3',
    eventDate: '2024-10-12',
    description: 'Nhặt được 01 thẻ sinh viên trường, mang mã số K21, ngành CNTT. Hiện đã gửi tạm tại phòng Quản lý Giảng đường H1.',
    secretQuestion: 'Họ và tên đầy đủ và 3 số cuối mã SV ghi trên thẻ?',
    imageUrl: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=500&auto=format&fit=crop',
    status: 'OPEN',
    contactName: 'Nguyễn Văn An',
    contactPhone: '0987654321',
    contactLocation: 'Phòng Quản lý Giảng đường H1 (Gặp thầy Nam)',
    userId: 2,
    userName: 'Nguyễn Văn An',
    claimCount: 0,
    createdAt: '2024-10-12T09:30:00'
  },
  {
    id: 2,
    title: 'Mất Chùm Chìa Khóa xe máy Honda có móc khóa Pikachu',
    type: 'LOST',
    category: 'KEYS',
    categoryDisplayName: 'Chìa khóa & Thẻ từ',
    location: 'Nhà xe khu A hoặc Lối vào Căn tin',
    eventDate: '2024-10-13',
    description: 'Sáng nay khoảng 9h30 mình có đánh rơi chùm chìa khóa xe Wave có gắn móc khóa gấu bông Pikachu nhỏ và 1 chìa khóa phòng trọ. Ai nhặt được cho mình xin chuộc lại với ạ!',
    secretQuestion: 'Trên chìa khóa phòng trọ có đánh số mấy?',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop',
    status: 'OPEN',
    contactName: 'Trần Thị Bích',
    contactPhone: '0978112233',
    contactLocation: 'Ký túc xá Phòng B402 hoặc liên hệ trực tiếp SĐT',
    userId: 3,
    userName: 'Trần Thị Bích',
    claimCount: 0,
    createdAt: '2024-10-13T10:15:00'
  },
  {
    id: 3,
    title: 'Nhặt được Ví da nam màu nâu tại Thư viện Tầng 2',
    type: 'FOUND',
    category: 'WALLET_PURSE',
    categoryDisplayName: 'Ví tiền & Bóp',
    location: 'Thư viện trường - Tầng 2 khu tự học',
    eventDate: '2024-10-14',
    description: 'Nhặt được một ví da bò màu nâu sẫm, bên trong có một ít tiền mặt và giấy tờ tùy thân mang tên sinh viên khoa Kinh tế.',
    secretQuestion: 'Bên trong ngăn kéo nhỏ của ví có thẻ gì đặc biệt?',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop',
    status: 'CLAIMED_PENDING',
    contactName: 'Lê Quang Cường',
    contactPhone: '0905998877',
    contactLocation: 'Bàn trực thủ thư Tầng 2 Thư viện',
    userId: 4,
    userName: 'Lê Quang Cường',
    claimCount: 1,
    createdAt: '2024-10-14T14:20:00'
  },
  {
    id: 4,
    title: 'Đã trao trả Laptop Acer Nitro để quên tại Phòng máy 405',
    type: 'FOUND',
    category: 'ELECTRONICS',
    categoryDisplayName: 'Điện tử & Công nghệ',
    location: 'Phòng thực hành máy tính 405',
    eventDate: '2024-10-10',
    description: 'Bạn sinh viên để quên laptop sau giờ thực hành môn Mạng máy tính. Đã được chủ nhân đến xác minh mật khẩu và nhận lại thành công.',
    secretQuestion: 'Mật khẩu đăng nhập Windows và hình dán sau lưng máy?',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop',
    status: 'RESOLVED',
    contactName: 'Quản Trị Viên Trường',
    contactPhone: '0912345678',
    contactLocation: 'Văn phòng Đoàn trường P.102',
    userId: 1,
    userName: 'Quản Trị Viên Trường',
    claimCount: 1,
    createdAt: '2024-10-10T16:00:00'
  }
];

export const INITIAL_POSTS = [
  {
    id: 1,
    title: 'Lịch thi kết thúc học phần Học kỳ 1 năm học 2024-2025',
    content: 'Phòng Đào tạo thông báo lịch thi chi tiết cho toàn bộ các khoa đã được cập nhật trên cổng thông tin sinh viên. Đề nghị các bạn sinh viên kiểm tra phòng thi và mang theo thẻ SV.',
    authorId: 1,
    authorName: 'Quản Trị Viên Trường',
    categoryId: 1,
    categoryName: 'Thông báo chung',
    likeCount: 45,
    viewCount: 320,
    commentCount: 4,
    createdAt: '2024-10-11T08:00:00'
  },
  {
    id: 2,
    title: 'Tài liệu ôn tập và đề cương môn Lập trình Web nâng cao IT209',
    content: 'Chia sẻ cho các bạn K21 bộ đề cương tóm tắt kiến trúc Spring Boot, RESTful API và React Router để ôn tập Session 13 và chuẩn bị bảo vệ Mini Project thật tốt nhé!',
    authorId: 2,
    authorName: 'Nguyễn Văn An',
    categoryId: 2,
    categoryName: 'Học tập & Tài liệu',
    likeCount: 88,
    viewCount: 560,
    commentCount: 12,
    createdAt: '2024-10-13T19:30:00'
  }
];

export const CURRENT_USER = {
  id: 2,
  username: 'nguyen_van_a',
  fullName: 'Nguyễn Văn An',
  email: 'an.nv@campus.edu.vn',
  studentId: 'SV2021001',
  phone: '0987654321',
  role: 'STUDENT'
};

export const INITIAL_CLAIMS = [
  {
    id: 1,
    itemId: 3,
    itemTitle: 'Nhặt được Ví da nam màu nâu tại Thư viện Tầng 2',
    claimantId: 2,
    claimantName: 'Nguyễn Văn An',
    claimantEmail: 'an.nv@campus.edu.vn',
    claimantPhone: '0987654321',
    proofDescription: 'Ví này là của em bị rơi lúc 14h chiều khi đang ngồi ôn bài ở dãy bàn số 4. Ngăn phụ bên trong có thẻ xe buýt tháng số 88 và thẻ ngân hàng Vietcombank tên Nguyễn Văn An.',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop',
    claimStatus: 'SUBMITTED',
    reviewNotes: 'Đang chờ người nhặt đồ đối chiếu khi hẹn gặp tại Thư viện',
    createdAt: '2024-10-14T15:00:00'
  }
];
