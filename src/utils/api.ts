import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wingstars_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Lỗi xác thực, vui lòng đăng nhập lại!");
      
      // OPTIONAL: Bạn có thể thêm lệnh tự động đá người dùng về trang Login ở đây
      // localStorage.removeItem('wingstars_token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;