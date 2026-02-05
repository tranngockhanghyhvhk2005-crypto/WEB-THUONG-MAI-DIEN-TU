const express = require('express');
const router = express.Router();
const { protect: auth, adminOnly } = require('../middleware/authMiddleware.js'); 

const {
    registerUser,
    loginUser,
    loginAdmin,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    addAddress,
    updateAddress,
    removeAddress,
    updateCart,
    getCart,
    getAllUsers,
    deleteUser,
    toggleBlockUser,
    createUser,
    getDetailsUser, 
    updateUser,
} = require('../controllers/userController');

// --- KHÔNG CẦN ĐĂNG NHẬP ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/admin-login', loginAdmin);

// --- CẦN ĐĂNG NHẬP (PROFILE) ---
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// --- QUẢN LÝ ĐỊA CHỈ ---
router.post('/address', auth, addAddress);
router.put('/address/:id', auth, updateAddress);
router.delete('/address/:id', auth, removeAddress);

// --- WISHLIST ---
router.get('/wishlist', auth, getWishlist);
router.post('/add-wishlist', auth, addToWishlist); 
router.delete('/wishlist/:productId', auth, removeFromWishlist);

// --- GIỎ HÀNG ---
router.put('/update-cart', auth, updateCart);
router.get('/get-cart', auth, getCart);

// --- ADMIN ROUTES ---
// Lấy danh sách users (Admin mới xem được)
router.get('/all-users', auth, adminOnly, getAllUsers);

// Toggle Block User
router.put('/toggle-block/:id', auth, adminOnly, toggleBlockUser);

// Xóa User
router.delete('/:id', auth, adminOnly, deleteUser);

// Tạo User mới
router.post('/create', auth, adminOnly, createUser);

// Lấy chi tiết User
router.get('/get-details/:id', auth, adminOnly, getDetailsUser);

// Cập nhật User (Admin sửa)
router.put('/update/:id', auth, adminOnly, updateUser);

module.exports = router;