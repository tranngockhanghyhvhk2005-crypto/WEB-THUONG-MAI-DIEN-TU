import axios from "axios"

export const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8080/api/',
})

// Helper hiển thị ảnh
export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `http://127.0.0.1:8080${path}`;
};

// --- LẤY TẤT CẢ SẢN PHẨM (KÈM BỘ LỌC) ---
// Hàm này sẽ nhận toàn bộ query string từ HomePage truyền vào
export const getAllProduct = async (queryString = '') => {
    const res = await axiosClient.get(`/products?${queryString}`)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axiosClient.get(`/products/get-details/${id}`)
    return res.data
}

// --- LẤY DANH MỤC ---
export const getAllCategories = async () => {
    const res = await axiosClient.get(`/categories/get-all`)
    return res.data
}

// --- LẤY THƯƠNG HIỆU ---
export const getAllBrands = async () => {
    const res = await axiosClient.get(`/brand/get-all`)
    return res.data
}