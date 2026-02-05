// routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUserAddresses,  // Lấy danh sách địa chỉ
    addAddress,        // Thêm địa chỉ mới
    updateAddress,     // Cập nhật địa chỉ
    deleteAddress,     // Xóa địa chỉ
    setDefaultAddress  // Đặt địa chỉ mặc định
} = require('../controllers/addressController');

const { protect: auth } = require('../middleware/authMiddleware.js'); // Middleware xác thực user

// Debug giá trị middleware và controller
console.log('Middleware auth:', auth);
console.log('Controller getUserAddresses:', getUserAddresses);

// --- ROUTES ---
router.get('/', auth, getUserAddresses);               // GET: Lấy tất cả địa chỉ của user
router.post('/', auth, addAddress);                   // POST: Thêm địa chỉ mới
router.put('/:id', auth, updateAddress);             // PUT: Cập nhật địa chỉ theo id
router.delete('/:id', auth, deleteAddress);          // DELETE: Xóa địa chỉ theo id
router.patch('/:id/set-default', auth, setDefaultAddress); // PATCH: Đặt địa chỉ mặc định

module.exports = router;
