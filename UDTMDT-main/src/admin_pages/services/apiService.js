import axios from 'axios';
import { toast } from 'react-hot-toast';

// thay đổi API URL
const API_URL = 'http://127.0.0.1:8080/api/';

const apiService = axios.create({
  baseURL: API_URL,
});

// Request interceptor để đính kèm JWT token
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Chuyển hướng về trang login
      window.location.href = '/admin/login';
    } else {
      // Hiển thị lỗi chung
      const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default apiService;