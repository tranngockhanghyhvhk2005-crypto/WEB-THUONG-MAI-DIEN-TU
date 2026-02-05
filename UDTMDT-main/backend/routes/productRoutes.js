const express = require('express');
const router = express.Router();
// --- IMPORT MIDDLEWARE ---
const { protect, adminOnly } = require('../middleware/authMiddleware');
// Import Controller & Upload Middleware
const productController = require('../controllers/productController.js');
const upload = require('../middleware/uploadMiddleware');

// --- 2. LẤY HÀM TỪ CONTROLLER ---
const {
    getAllProducts,
    getDetailsProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    addToWishlist,
    getAllProductsPublic,
    getProductByIdPublic
} = productController;

// --- KHAI BÁO ROUTE ---

// --- ROUTE ĐÁNH GIÁ SẢN PHẨM ---
// Yêu cầu: Phải đăng nhập (protect) nhưng KHÔNG cần là admin
router.post('/:id/reviews', protect, createProductReview);
// ----------------------------------------------------

// --- ROUTE YÊU THÍCH ---
if (typeof addToWishlist === 'function') {
    router.post('/add-to-wishlist/:id', protect, addToWishlist);
} else {
    console.log(" CẢNH BÁO: Server chưa tìm thấy hàm 'addToWishlist'.");
}

// --- CÁC ROUTE CÔNG KHAI (AI CŨNG XEM ĐƯỢC) ---
router.get('/', productController.getAllProducts);
router.get('/get-all', productController.getAllProducts);
//Chi tiết sản phẩm
router.get('/get-details/:id', productController.getDetailsProduct);


// --- CÁC ROUTE ADMIN (CHỈ ADMIN MỚI ĐƯỢC DÙNG) ---
router.delete('/delete/:id', protect, adminOnly, productController.deleteProduct);

// CẤU HÌNH LẠI ROUTE CREATE: Sử dụng upload.fields để nhận 2 mảng ảnh khác nhau
router.post('/create', 
    protect, 
    adminOnly, 
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'variantImages', maxCount: 20 }
    ]), 
    productController.createProduct
);

router.put('/update/:id', 
    protect, 
    adminOnly, 
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'variantImages', maxCount: 20 }
    ]), 
    productController.updateProduct
);

module.exports = router;