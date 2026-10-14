// API Service Client with seamless backend connection & fallback
const API_BASE = '/api';

export const apiService = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/posts`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Lost & Found
  async getItems(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'ALL') params.append('type', filters.type);
    if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.keyword) params.append('keyword', filters.keyword);

    const res = await fetch(`${API_BASE}/lost-found?${params.toString()}`);
    if (!res.ok) throw new Error('Không thể tải danh sách đồ thất lạc');
    const json = await res.json();
    return json.data;
  },

  async getItemById(id) {
    const res = await fetch(`${API_BASE}/lost-found/${id}`);
    if (!res.ok) throw new Error('Không thể tải chi tiết');
    const json = await res.json();
    return json.data;
  },

  async createItem(itemData, userId = 2) {
    const res = await fetch(`${API_BASE}/lost-found`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.toString()
      },
      body: JSON.stringify(itemData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi khi tạo tin');
    return json.data;
  },

  async getSmartMatches(id) {
    const res = await fetch(`${API_BASE}/lost-found/${id}/matches`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async submitClaim(itemId, claimData, userId = 2) {
    const res = await fetch(`${API_BASE}/lost-found/${itemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.toString()
      },
      body: JSON.stringify(claimData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi gửi yêu cầu xác minh');
    return json.data;
  },

  async reviewClaim(claimId, status, reviewNotes, userId = 2) {
    const res = await fetch(`${API_BASE}/lost-found/claims/${claimId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.toString()
      },
      body: JSON.stringify({ status, reviewNotes })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi xét duyệt yêu cầu');
    return json.data;
  },

  // Posts
  async getPosts(categoryId = null, search = '') {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/posts?${params.toString()}`);
    if (!res.ok) throw new Error('Không thể tải bài viết');
    const json = await res.json();
    return json.data;
  },

  async likePost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  }
};
