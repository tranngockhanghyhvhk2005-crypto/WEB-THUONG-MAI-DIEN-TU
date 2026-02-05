import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const axiosClient = axios.create({
    baseURL: API_URL,
});

// --- USER ROUTES ---

// 1. Tạo đánh giá (Kèm Token)
export const createReview = async (formData, access_token) => {
    // Lưu ý: data truyền vào là FormData object
    const res = await axiosClient.post(`/reviews/create`, formData, {
        headers: { 
            Authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

// 2. Lấy đánh giá theo sản phẩm 
export const getReviewsByProduct = async (productId) => {
    const res = await axiosClient.get(`/reviews/product/${productId}`);
    return res.data;
};

// --- ADMIN ROUTES ---

// 3. Lấy tất cả đánh giá
export const getAllReviewsSystem = async (access_token) => {
    const res = await axiosClient.get(`/reviews/all-reviews`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return res.data;
};

// 4. Admin trả lời
export const replyReview = async (reviewId, content, access_token) => {
    const res = await axiosClient.put(`/reviews/reply/${reviewId}`, { content }, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return res.data;
};

// 5. Xóa đánh giá
export const deleteReview = async (id, access_token) => {
    const res = await axiosClient.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return res.data;
};