import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- INTERCEPTOR REQUEST: TỰ ĐỘNG GẮN TOKEN ---
axiosClient.interceptors.request.use(
    (config) => {
        // 1. Lấy đúng tên key là 'access_token' (như đã sửa ở trang Login)
        let token = localStorage.getItem('access_token');

        if (token) {
            // 2. LOGIC LÀM SẠCH QUAN TRỌNG: Xóa dấu ngoặc kép thừa
            if (typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
                token = token.slice(1, -1);
            }

            // 3. Gắn vào Header (Gắn cả 2 kiểu để chắc chắn Backend nhận được)
            config.headers['token'] = `Bearer ${token}`; 
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);
// ---------------------------------------------

// --- INTERCEPTOR RESPONSE: XỬ LÝ KHI TOKEN HẾT HẠN ---
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Xử lý lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.error("Token không hợp lệ hoặc đã hết hạn.");
            
            // Tùy chọn: Tự động logout nếu token chết
            // localStorage.clear();
            // window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;