import axios from "axios";

const apiService = axios.create({
    baseURL: 'http://127.0.0.1:8080/api/',
});

// Thêm Interceptor để tự động gắn Token vào header
apiService.interceptors.request.use(function (config) {
    // Lấy token từ localStorage (key thường là 'access_token')
    const token = localStorage.getItem('access_token');
    
    if (token) {
        // Xử lý trường hợp token bị lưu dạng chuỗi JSON hoặc chuỗi thường
        let parsedToken = token;
        try {
            parsedToken = JSON.parse(token);
        } catch (e) {}

        // Gắn Authorization vào header theo chuẩn Backend yêu cầu
        config.headers.Authorization = `Bearer ${parsedToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default apiService;