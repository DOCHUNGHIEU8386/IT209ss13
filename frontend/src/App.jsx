import React, { useState, useEffect } from 'react';
import { 
  Search, PlusCircle, AlertCircle, CheckCircle2, Clock, 
  MapPin, Calendar, User, Phone, ShieldCheck, Sparkles, 
  Tag, MessageSquare, Heart, RefreshCw, Eye, ArrowRight,
  Layers, Check, X, Filter, ExternalLink
} from 'lucide-react';
import { INITIAL_ITEMS, INITIAL_POSTS, CURRENT_USER, INITIAL_CLAIMS } from './mockData';
import { apiService } from './api';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('lost-found'); // 'lost-found', 'create', 'my-items', 'forum'
  
  // Data State
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [claims, setClaims] = useState(INITIAL_CLAIMS);
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Filters State
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'LOST', 'FOUND'
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Selected Item
  const [selectedItem, setSelectedItem] = useState(null);
  const [smartMatches, setSmartMatches] = useState([]);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimProof, setClaimProof] = useState('');
  const [claimImage, setClaimImage] = useState('');

  // Form State for Creating New Item
  const [formData, setFormData] = useState({
    title: '',
    type: 'LOST',
    category: 'STUDENT_CARD',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    secretQuestion: '',
    imageUrl: '',
    contactName: CURRENT_USER.fullName,
    contactPhone: CURRENT_USER.phone,
    contactLocation: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Try connecting to backend on mount
  useEffect(() => {
    checkConnectionAndLoad();
  }, []);

  const checkConnectionAndLoad = async () => {
    try {
      const connected = await apiService.checkHealth();
      setIsBackendConnected(connected);
      if (connected) {
        const fetchedItems = await apiService.getItems();
        if (fetchedItems && fetchedItems.length > 0) setItems(fetchedItems);
        const fetchedPosts = await apiService.getPosts();
        if (fetchedPosts && fetchedPosts.length > 0) setPosts(fetchedPosts);
      }
    } catch {
      setIsBackendConnected(false);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLocation = item.location.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLocation && !matchDesc) return false;
    }
    return true;
  });

  // Open Item Detail & fetch smart matches
  const handleViewDetail = async (item) => {
    setSelectedItem(item);
    // Find smart matches: opposite type, same category, similar location
    if (isBackendConnected) {
      try {
        const matches = await apiService.getSmartMatches(item.id);
        setSmartMatches(matches);
      } catch {
        calculateLocalMatches(item);
      }
    } else {
      calculateLocalMatches(item);
    }
  };

  const calculateLocalMatches = (target) => {
    const oppType = target.type === 'LOST' ? 'FOUND' : 'LOST';
    const matches = items
      .filter(i => i.id !== target.id && i.type === oppType && i.category === target.category && i.status === 'OPEN')
      .map(candidate => {
        let score = 55;
        let reasons = ['Cùng danh mục ' + candidate.categoryDisplayName];
        if (candidate.location.toLowerCase().includes(target.location.toLowerCase().slice(0, 5))) {
          score += 35;
          reasons.push('Khớp vị trí giảng đường / địa điểm');
        }
        return {
          matchedItem: candidate,
          matchScore: Math.min(score, 98),
          matchReason: reasons.join(' • ')
        };
      });
    setSmartMatches(matches);
  };

  // Handle Create Form Validation & Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Vui lòng nhập tiêu đề';
    if (!formData.location.trim()) errors.location = 'Vui lòng nhập địa điểm';
    if (!formData.description.trim()) errors.description = 'Vui lòng nhập mô tả chi tiết';
    if (!formData.contactPhone.trim()) errors.contactPhone = 'Vui lòng nhập số điện thoại liên hệ';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'error');
      return;
    }

    setFormErrors({});

    const newItem = {
      ...formData,
      id: Date.now(),
      categoryDisplayName: getCategoryDisplayName(formData.category),
      status: 'OPEN',
      userId: currentUser.id,
      userName: currentUser.fullName,
      claimCount: 0,
      createdAt: new Date().toISOString(),
      imageUrl: formData.imageUrl.trim() || getDefaultImage(formData.category)
    };

    if (isBackendConnected) {
      try {
        const saved = await apiService.createItem(formData, currentUser.id);
        setItems(prev => [saved, ...prev]);
      } catch (err) {
        setItems(prev => [newItem, ...prev]);
      }
    } else {
      setItems(prev => [newItem, ...prev]);
    }

    addToast('Đăng tin thành công! Tin của bạn đã hiển thị trên hệ thống.', 'success');
    setActiveTab('lost-found');
    // Reset form
    setFormData({
      title: '',
      type: 'LOST',
      category: 'STUDENT_CARD',
      location: '',
      eventDate: new Date().toISOString().split('T')[0],
      description: '',
      secretQuestion: '',
      imageUrl: '',
      contactName: currentUser.fullName,
      contactPhone: currentUser.phone,
      contactLocation: ''
    });
  };

  // Handle Claim Submission
  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimProof.trim()) {
      addToast('Vui lòng cung cấp câu trả lời hoặc bằng chứng xác minh!', 'error');
      return;
    }

    const newClaim = {
      id: Date.now(),
      itemId: selectedItem.id,
      itemTitle: selectedItem.title,
      claimantId: currentUser.id,
      claimantName: currentUser.fullName,
      claimantEmail: currentUser.email,
      claimantPhone: currentUser.phone,
      proofDescription: claimProof,
      proofImageUrl: claimImage,
      claimStatus: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };

    if (isBackendConnected) {
      try {
        await apiService.submitClaim(selectedItem.id, { proofDescription: claimProof, proofImageUrl: claimImage }, currentUser.id);
      } catch (err) {
        console.warn(err);
      }
    }

    setClaims(prev => [newClaim, ...prev]);
    // Update item status to CLAIMED_PENDING
    setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, status: 'CLAIMED_PENDING', claimCount: (i.claimCount || 0) + 1 } : i));
    setSelectedItem(prev => prev ? { ...prev, status: 'CLAIMED_PENDING' } : null);

    setIsClaimModalOpen(false);
    setClaimProof('');
    setClaimImage('');
    addToast('Đã gửi yêu cầu xác minh nhận lại đồ thành công! Người đăng tin sẽ sớm liên hệ đối chiếu.', 'success');
  };

  // Handle Review Claim
  const handleReviewClaim = async (claimId, newStatus) => {
    if (isBackendConnected) {
      try {
        await apiService.reviewClaim(claimId, newStatus, 'Xử lý qua bảng điều khiển', currentUser.id);
      } catch (err) {
        console.warn(err);
      }
    }

    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, claimStatus: newStatus } : c));
    
    // If accepted, mark corresponding item as RESOLVED
    if (newStatus === 'ACCEPTED') {
      const targetClaim = claims.find(c => c.id === claimId);
      if (targetClaim) {
        setItems(prev => prev.map(i => i.id === targetClaim.itemId ? { ...i, status: 'RESOLVED' } : i));
      }
      addToast('Đã chấp thuận yêu cầu! Món đồ được chuyển sang trạng thái: ĐÃ TRAO TRẢ THÀNH CÔNG.', 'success');
    } else {
      addToast('Đã từ chối yêu cầu xác minh không hợp lệ.', 'info');
    }
  };

  // Helper labels
  const getCategoryDisplayName = (cat) => {
    const map = {
      STUDENT_CARD: 'Thẻ sinh viên / Thẻ xe',
      ELECTRONICS: 'Điện tử & Công nghệ',
      WALLET_PURSE: 'Ví tiền & Bóp',
      KEYS: 'Chìa khóa & Thẻ từ',
      DOCUMENTS: 'Giấy tờ & Hồ sơ',
      BACKPACK_CLOTHES: 'Balo & Trang phục',
      OTHER: 'Đồ dùng khác'
    };
    return map[cat] || 'Khác';
  };

  const getDefaultImage = (cat) => {
    const map = {
      STUDENT_CARD: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=500&auto=format&fit=crop',
      ELECTRONICS: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop',
      WALLET_PURSE: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop',
      KEYS: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop',
      DOCUMENTS: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop',
      BACKPACK_CLOTHES: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop'
    };
    return map[cat] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop';
  };

  // Calculate statistics
  const totalItems = items.length;
  const resolvedCount = items.filter(i => i.status === 'RESOLVED').length;
  const activeLostCount = items.filter(i => i.type === 'LOST' && i.status === 'OPEN').length;
  const activeFoundCount = items.filter(i => i.type === 'FOUND' && i.status === 'OPEN').length;

  return (
    <div>
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            {toast.type === 'success' && <CheckCircle2 size={18} color="#4ade80" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#f87171" />}
            {toast.type === 'info' && <Sparkles size={18} color="#60a5fa" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="brand" role="button" onClick={() => setActiveTab('lost-found')} style={{ cursor: 'pointer' }}>
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <span>CampusHub</span>
              <span style={{ color: 'var(--primary)', marginLeft: '2px' }}>+</span>
            </div>
          </div>

          <div className="nav-links">
            <button 
              className={`nav-link ${activeTab === 'lost-found' ? 'active' : ''}`}
              onClick={() => setActiveTab('lost-found')}
            >
              <Search size={16} /> Đồ Thất Lạc
            </button>
            <button 
              className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <PlusCircle size={16} /> Báo Mất / Nhặt Đồ
            </button>
            <button 
              className={`nav-link ${activeTab === 'my-items' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-items')}
            >
              <Layers size={16} /> Quản Lý Của Tôi
            </button>
            <button 
              className={`nav-link ${activeTab === 'forum' ? 'active' : ''}`}
              onClick={() => setActiveTab('forum')}
            >
              <MessageSquare size={16} /> Bảng Tin Trường
            </button>
          </div>

          <div className="nav-actions">
            {/* Backend status pill */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                background: isBackendConnected ? '#ecfdf5' : '#fef3c7',
                color: isBackendConnected ? '#065f46' : '#92400e',
                border: isBackendConnected ? '1px solid #a7f3d0' : '1px solid #fde68a'
              }}
              title={isBackendConnected ? "Đang kết nối trực tiếp Spring Boot API (Port 8080)" : "Đang chạy chế độ Client Preview (Có thể kết nối Spring Boot khi khởi động)"}
            >
              <span style={{ 
                width: '7px', 
                height: '7px', 
                borderRadius: '50%', 
                backgroundColor: isBackendConnected ? '#10b981' : '#f59e0b',
                display: 'inline-block' 
              }}></span>
              {isBackendConnected ? 'Spring Boot Online' : 'Preview Mode'}
            </div>

            {/* Current user switch */}
            <div className="user-pill">
              <div className="user-avatar">{currentUser.fullName.charAt(0)}</div>
              <span>{currentUser.fullName}</span>
              <button 
                onClick={() => {
                  const isStudent = currentUser.role === 'STUDENT';
                  setCurrentUser(isStudent ? {
                    id: 1,
                    username: 'admin',
                    fullName: 'Thầy Quản Trị Viên',
                    email: 'admin@campus.edu.vn',
                    studentId: 'AD001',
                    phone: '0912345678',
                    role: 'ADMIN'
                  } : CURRENT_USER);
                  addToast(`Đã chuyển vai trò: ${isStudent ? 'Quản Trị Viên (Admin)' : 'Sinh viên (Nguyễn Văn An)'}`, 'info');
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                title="Đổi vai trò để test phân quyền người dùng"
              >
                Đổi vai trò
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main>
        {activeTab === 'lost-found' && (
          <div>
            {/* Hero Banner */}
            <section className="hero">
              <div className="container">
                <div className="hero-badge">
                  <Sparkles size={14} /> Mini Project IT209 Session 13 — Kế Thừa & Phát Triển Campus Hub
                </div>
                <h1 className="hero-title">
                  Tìm lại đồ thất lạc <span>nhanh chóng & tin cậy</span> tại trường
                </h1>
                <p className="hero-subtitle">
                  Nền tảng hỗ trợ sinh viên báo mất đồ, đăng tin nhặt được đồ, xác minh chủ sở hữu thông minh và bảo vệ tài sản trong khuôn viên trường.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('create')}>
                    <PlusCircle size={18} /> Đăng Tin Báo Mất / Nhặt Đồ
                  </button>
                  <button className="btn btn-secondary" onClick={() => {
                    setFilterType('FOUND');
                    addToast('Đang lọc danh sách: Đồ nhặt được chờ nhận lại', 'info');
                  }}>
                    <CheckCircle2 size={18} color="#10b981" /> Xem Đồ Nhặt Được ({activeFoundCount})
                  </button>
                </div>

                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-value">{totalItems}</span>
                    <span className="stat-label">Tổng số tin đăng</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#ef4444' }}>{activeLostCount}</span>
                    <span className="stat-label">Đang cần tìm đồ</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#10b981' }}>{activeFoundCount}</span>
                    <span className="stat-label">Nhặt được chờ chủ</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#3b82f6' }}>{resolvedCount}</span>
                    <span className="stat-label">Đã trao trả thành công</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Bar */}
            <section className="container" style={{ marginTop: '1.5rem' }}>
              <div className="filter-bar">
                <div className="filter-row">
                  <div className="search-input-wrapper">
                    <Search size={18} />
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Tìm kiếm theo tên vật phẩm, địa điểm (ví dụ: Thư viện, H1, chìa khóa...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="tabs">
                    <button 
                      className={`tab-btn ${filterType === 'ALL' ? 'active' : ''}`}
                      onClick={() => setFilterType('ALL')}
                    >
                      Tất Cả ({items.length})
                    </button>
                    <button 
                      className={`tab-btn ${filterType === 'LOST' ? 'active' : ''}`}
                      onClick={() => setFilterType('LOST')}
                    >
                      Mất Đồ (LOST)
                    </button>
                    <button 
                      className={`tab-btn ${filterType === 'FOUND' ? 'active' : ''}`}
                      onClick={() => setFilterType('FOUND')}
                    >
                      Nhặt Được (FOUND)
                    </button>
                  </div>
                </div>

                <div className="filter-row" style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Filter size={15} /> Bộ lọc:
                    </span>
                    <select 
                      className="filter-select"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="ALL">Mọi danh mục</option>
                      <option value="STUDENT_CARD">Thẻ sinh viên / Thẻ xe</option>
                      <option value="ELECTRONICS">Điện thoại / Laptop / Tai nghe</option>
                      <option value="WALLET_PURSE">Ví tiền & Bóp</option>
                      <option value="KEYS">Chìa khóa & Thẻ từ</option>
                      <option value="DOCUMENTS">Giấy tờ & Hồ sơ</option>
                      <option value="BACKPACK_CLOTHES">Balo & Trang phục</option>
                      <option value="OTHER">Đồ dùng khác</option>
                    </select>

                    <select 
                      className="filter-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="ALL">Mọi trạng thái</option>
                      <option value="OPEN">Đang tìm kiếm / Chờ nhận (OPEN)</option>
                      <option value="CLAIMED_PENDING">Đang xác minh (CLAIMED)</option>
                      <option value="RESOLVED">Đã trao trả (RESOLVED)</option>
                    </select>
                  </div>

                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Hiển thị <strong>{filteredItems.length}</strong> kết quả
                  </span>
                </div>
              </div>

              {/* Cards Grid */}
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <Search size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Không tìm thấy đồ vật nào phù hợp</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                  <button className="btn btn-secondary" onClick={() => {
                    setFilterType('ALL');
                    setFilterCategory('ALL');
                    setFilterStatus('ALL');
                    setSearchQuery('');
                  }}>
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              ) : (
                <div className="card-grid">
                  {filteredItems.map(item => (
                    <div key={item.id} className="item-card">
                      <div className="card-img-container">
                        <img src={item.imageUrl} alt={item.title} className="card-img" />
                        <div className="card-badges">
                          <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                            {item.type === 'LOST' ? '🔍 Cần Tìm Đồ' : '✨ Nhặt Được Đồ'}
                          </span>
                          <span className={`badge-status ${
                            item.status === 'RESOLVED' ? 'status-resolved' :
                            item.status === 'CLAIMED_PENDING' ? 'status-claimed' : 'status-open'
                          }`}>
                            {item.status === 'RESOLVED' ? '✓ Đã nhận lại' :
                             item.status === 'CLAIMED_PENDING' ? '⏳ Đang xác minh' : 'Đang mở'}
                          </span>
                        </div>
                      </div>

                      <div className="card-content">
                        <div className="card-category">{item.categoryDisplayName}</div>
                        <h3 className="card-title" title={item.title}>{item.title}</h3>

                        <div className="card-meta">
                          <div className="meta-row">
                            <MapPin size={15} color="#ef4444" />
                            <span>{item.location}</span>
                          </div>
                          <div className="meta-row">
                            <Calendar size={15} color="#6366f1" />
                            <span>Ngày: {item.eventDate}</span>
                          </div>
                          <div className="meta-row">
                            <User size={15} color="#64748b" />
                            <span>Người đăng: {item.userName}</span>
                          </div>
                        </div>

                        <p className="card-description">{item.description}</p>

                        <div className="card-footer">
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleViewDetail(item)}
                          >
                            <Eye size={15} /> Chi Tiết
                          </button>

                          {item.status !== 'RESOLVED' && item.userId !== currentUser.id && (
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsClaimModalOpen(true);
                              }}
                            >
                              <ShieldCheck size={15} /> {item.type === 'FOUND' ? 'Đây là đồ của tôi' : 'Tôi đang giữ đồ này'}
                            </button>
                          )}

                          {item.status === 'RESOLVED' && (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={16} /> Đã hoàn tất
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 2: Create Item */}
        {activeTab === 'create' && (
          <section className="container" style={{ padding: '2.5rem 1rem', maxWidth: '800px' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div className="brand-icon">
                  <PlusCircle size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Đăng Tin Báo Mất / Nhặt Được Đồ</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vui lòng cung cấp thông tin chính xác để hệ thống tự động so khớp và hỗ trợ tìm kiếm.</p>
                </div>
              </div>

              <form onSubmit={handleCreateSubmit}>
                {/* Type Selection */}
                <div className="form-group">
                  <label className="form-label">Loại tin đăng <span className="required">*</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                      type="button"
                      className={`btn ${formData.type === 'LOST' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.85rem' }}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'LOST' }))}
                    >
                      <Search size={18} /> Tôi Bị Mất Đồ (LOST)
                    </button>
                    <button
                      type="button"
                      className={`btn ${formData.type === 'FOUND' ? 'btn-success' : 'btn-secondary'}`}
                      style={{ padding: '0.85rem' }}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'FOUND' }))}
                    >
                      <CheckCircle2 size={18} /> Tôi Nhặt Được Đồ (FOUND)
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Tiêu đề tin đăng <span className="required">*</span></label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Rơi ví nam màu nâu tại Thư viện Tầng 2, Nhặt được thẻ SV K21..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                  {formErrors.title && <div style={{ color: 'var(--accent-lost)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.title}</div>}
                </div>

                {/* Category & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Danh mục vật phẩm <span className="required">*</span></label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="STUDENT_CARD">Thẻ sinh viên / Thẻ xe</option>
                      <option value="ELECTRONICS">Điện thoại / Laptop / Công nghệ</option>
                      <option value="WALLET_PURSE">Ví tiền & Bóp</option>
                      <option value="KEYS">Chìa khóa & Thẻ từ</option>
                      <option value="DOCUMENTS">Giấy tờ & Hồ sơ</option>
                      <option value="BACKPACK_CLOTHES">Balo & Trang phục</option>
                      <option value="OTHER">Đồ dùng khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ngày xảy ra <span className="required">*</span></label>
                    <input 
                      type="date"
                      className="form-input"
                      value={formData.eventDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label">Địa điểm trong trường <span className="required">*</span></label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Giảng đường H1 Bàn 302, Thư viện tầng 2, Nhà xe Cán sự..."
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                  {formErrors.location && <div style={{ color: 'var(--accent-lost)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.location}</div>}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Mô tả đặc điểm nhận dạng <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Mô tả màu sắc, nhãn hiệu, các đặc điểm nhận dạng quan trọng..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                  {formErrors.description && <div style={{ color: 'var(--accent-lost)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.description}</div>}
                </div>

                {/* Secret Question */}
                <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4338ca' }}>
                    <ShieldCheck size={18} /> Câu hỏi xác minh bảo mật (Chống nhận mạo danh)
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Hình dán sau ốp lưng màu gì? Ba số cuối của thẻ SV là gì?"
                    value={formData.secretQuestion}
                    onChange={(e) => setFormData(prev => ({ ...prev, secretQuestion: e.target.value }))}
                  />
                  <div className="form-hint">Người muốn nhận đồ sẽ phải trả lời câu hỏi này trước khi bạn đồng ý trao trả tài sản.</div>
                </div>

                {/* Image URL */}
                <div className="form-group">
                  <label className="form-label">Đường dẫn hình ảnh (URL)</label>
                  <input 
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/... (để trống nếu không có)"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>

                {/* Contact Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Người liên hệ</label>
                    <input 
                      type="text"
                      className="form-input"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số điện thoại liên hệ <span className="required">*</span></label>
                    <input 
                      type="text"
                      className="form-input"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    />
                    {formErrors.contactPhone && <div style={{ color: 'var(--accent-lost)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{formErrors.contactPhone}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Địa điểm hẹn giao nhận (hoặc nơi gửi đồ)</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: Gửi tại Văn phòng Đoàn trường P.102 hoặc Hẹn gặp tại Sảnh A..."
                    value={formData.contactLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactLocation: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('lost-found')}>
                    Hủy bỏ
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    <PlusCircle size={18} /> Đăng Tin Ngay
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Tab 3: My Items & Claims Management */}
        {activeTab === 'my-items' && (
          <section className="container" style={{ padding: '2.5rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quản Lý Tin Đăng & Yêu Cầu Nhận Đồ</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Theo dõi trạng thái các món đồ bạn đã đăng và xét duyệt người xin nhận lại.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveTab('create')}>
                <PlusCircle size={18} /> Tạo Tin Mới
              </button>
            </div>

            {/* List items posted by current user */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="var(--primary)" /> Tin đăng của bạn ({items.filter(i => i.userId === currentUser.id).length})
              </h3>

              {items.filter(i => i.userId === currentUser.id).length === 0 ? (
                <div style={{ background: 'white', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>Bạn chưa đăng tin nào. Hãy nhấn "Tạo Tin Mới" để bắt đầu!</p>
                </div>
              ) : (
                <div className="card-grid">
                  {items.filter(i => i.userId === currentUser.id).map(item => (
                    <div key={item.id} className="item-card">
                      <div className="card-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                            {item.type}
                          </span>
                          <span className={`badge-status ${item.status === 'RESOLVED' ? 'status-resolved' : 'status-open'}`}>
                            {item.status}
                          </span>
                        </div>
                        <h4 className="card-title">{item.title}</h4>
                        <div className="card-meta">
                          <div className="meta-row"><MapPin size={14} /> {item.location}</div>
                          <div className="meta-row"><Calendar size={14} /> {item.eventDate}</div>
                        </div>

                        <div className="card-footer" style={{ marginTop: 'auto' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetail(item)}>
                            <Eye size={14} /> Xem Chi Tiết
                          </button>
                          {item.status !== 'RESOLVED' && (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'RESOLVED' } : i));
                                addToast('Đã đánh dấu hoàn tất trao trả!', 'success');
                              }}
                            >
                              <CheckCircle2 size={14} /> Đánh dấu đã nhận lại
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inbound Claims to Review */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#10b981" /> Danh sách yêu cầu xác minh nhận lại đồ ({claims.length})
              </h3>

              {claims.length === 0 ? (
                <div style={{ background: 'white', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>Chưa có yêu cầu xác minh nào được gửi.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {claims.map(claim => (
                    <div key={claim.id} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Món đồ được yêu cầu:</div>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{claim.itemTitle}</div>
                        </div>
                        <span className={`badge-status ${claim.claimStatus === 'ACCEPTED' ? 'status-resolved' : claim.claimStatus === 'REJECTED' ? 'status-lost' : 'status-claimed'}`}>
                          {claim.claimStatus === 'ACCEPTED' ? '✓ Đã chấp thuận bàn giao' : claim.claimStatus === 'REJECTED' ? '✕ Đã từ chối' : '⏳ Chờ duyệt'}
                        </span>
                      </div>

                      <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: 600, color: '#4338ca', marginBottom: '0.25rem' }}>Câu trả lời / Bằng chứng người nhận cung cấp:</div>
                        <div>"{claim.proofDescription}"</div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div>
                          <strong>Người gửi yêu cầu:</strong> {claim.claimantName} ({claim.claimantPhone})
                        </div>
                        {claim.claimStatus === 'SUBMITTED' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReviewClaim(claim.id, 'REJECTED')}
                            >
                              <X size={14} /> Từ chối
                            </button>
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handleReviewClaim(claim.id, 'ACCEPTED')}
                            >
                              <Check size={14} /> Chấp thuận & Bàn giao đồ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tab 4: Campus Base Forum */}
        {activeTab === 'forum' && (
          <section className="container" style={{ padding: '2.5rem 1rem', maxWidth: '850px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Bảng Tin & Thảo Luận Sinh Viên (Campus Hub Base)</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Kế thừa tính năng chia sẻ thông báo, trao đổi học tập và tài liệu từ dự án nền.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {posts.map(post => (
                <div key={post.id} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                      {post.categoryName}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Tác giả: <strong>{post.authorName}</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{post.content}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Eye size={16} /> {post.viewCount} lượt xem
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MessageSquare size={16} /> {post.commentCount} bình luận
                      </span>
                    </div>

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likeCount: p.likeCount + 1 } : p));
                        addToast('Đã thả tim bài viết!', 'success');
                      }}
                    >
                      <Heart size={15} color="#ef4444" /> Thích ({post.likeCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Item Detail & Smart Match Modal */}
      {selectedItem && !isClaimModalOpen && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${selectedItem.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                  {selectedItem.type === 'LOST' ? 'MẤT ĐỒ (LOST)' : 'NHẶT ĐƯỢC (FOUND)'}
                </span>
                <h3 className="modal-title">{selectedItem.title}</h3>
              </div>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>&times;</button>
            </div>

            <div className="modal-body">
              {selectedItem.imageUrl && (
                <div style={{ marginBottom: '1.25rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px' }}>
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Smart Match Banner */}
              {smartMatches.length > 0 && (
                <div className="smart-match-box">
                  <div className="match-header">
                    <Sparkles size={18} />
                    <span>Hệ Thống Phát Hiện {smartMatches.length} Tin So Khớp Tiềm Năng!</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4338ca', marginBottom: '0.5rem' }}>
                    Thuật toán so khớp tự động tìm thấy các tin đăng đối lập có cùng danh mục và địa điểm:
                  </p>
                  {smartMatches.map((match, idx) => (
                    <div key={idx} className="match-item">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{match.matchedItem.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{match.matchReason}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="match-score-badge">{match.matchScore}% Khớp</span>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewDetail(match.matchedItem)}
                        >
                          Xem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Details table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong style={{ minWidth: '120px', color: 'var(--text-secondary)' }}>Danh mục:</strong>
                  <span>{selectedItem.categoryDisplayName}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong style={{ minWidth: '120px', color: 'var(--text-secondary)' }}>Địa điểm:</strong>
                  <span>{selectedItem.location}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong style={{ minWidth: '120px', color: 'var(--text-secondary)' }}>Ngày xảy ra:</strong>
                  <span>{selectedItem.eventDate}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <strong style={{ minWidth: '120px', color: 'var(--text-secondary)' }}>Mô tả chi tiết:</strong>
                  <span>{selectedItem.description}</span>
                </div>

                {selectedItem.secretQuestion && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
                    <div style={{ fontWeight: 700, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <ShieldCheck size={16} /> Câu hỏi xác minh của người đăng:
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>"{selectedItem.secretQuestion}"</div>
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Thông tin liên hệ:</div>
                  <div style={{ fontSize: '0.9rem' }}>👤 Người liên hệ: <strong>{selectedItem.contactName || selectedItem.userName}</strong></div>
                  <div style={{ fontSize: '0.9rem' }}>📞 SĐT: <strong>{selectedItem.contactPhone || 'Chưa cập nhật'}</strong></div>
                  {selectedItem.contactLocation && (
                    <div style={{ fontSize: '0.9rem' }}>📍 Nơi giao nhận/gửi tạm: <strong>{selectedItem.contactLocation}</strong></div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                Đóng
              </button>
              {selectedItem.status !== 'RESOLVED' && selectedItem.userId !== currentUser.id && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsClaimModalOpen(true)}
                >
                  <ShieldCheck size={16} /> Gửi Bằng Chứng Nhận Lại Đồ
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim Submission Modal */}
      {isClaimModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={() => setIsClaimModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Gửi Bằng Chứng Xác Minh Quyền Sở Hữu</h3>
              <button className="modal-close" onClick={() => setIsClaimModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmitClaim}>
              <div className="modal-body">
                <div style={{ background: '#eef2ff', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#4338ca' }}>Vật phẩm: {selectedItem.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6366f1' }}>Địa điểm: {selectedItem.location}</div>
                </div>

                {selectedItem.secretQuestion && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#b45309', marginBottom: '0.25rem' }}>
                      ❓ Câu hỏi xác minh: {selectedItem.secretQuestion}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
                      Vui lòng trả lời câu hỏi trên thật chính xác để người giữ đồ đối chiếu trước khi gặp trực tiếp.
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Câu trả lời / Bằng chứng nhận dạng <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Nhập câu trả lời cho câu hỏi xác minh, hoặc mô tả các chi tiết bí mật mà chỉ chủ nhân mới biết (ví dụ: số serial, hình nền máy tính, các vật phẩm trong ngăn nhỏ ví...)"
                    value={claimProof}
                    onChange={(e) => setClaimProof(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Link ảnh chứng minh sở hữu (nếu có)</label>
                  <input 
                    type="url"
                    className="form-input"
                    placeholder="https://... ảnh cũ chụp cùng vật phẩm, hóa đơn mua hàng..."
                    value={claimImage}
                    onChange={(e) => setClaimImage(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Hệ thống sẽ chuyển thông tin liên hệ của bạn ({currentUser.fullName} - {currentUser.phone}) đến người đăng tin để 2 bên chủ động gặp mặt bàn giao tài sản.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsClaimModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <ShieldCheck size={16} /> Gửi Yêu Cầu Xác Minh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>CampusHub+ Platform</strong> — Mini Project Tổng Hợp Session 13 (IT209)
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Phát triển mở rộng từ dự án nền Campus Hub Base (React + Java Spring Boot + MySQL)
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Nhóm Thực Hiện: IT209 Group</span>
            <span>•</span>
            <a href="https://github.com/dinhthanhnam/campus-hub-base" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Base Repo <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
