const express = require('express');
const router = express.Router();

// 1. Import Middleware xác thực
const { protect, adminOnly} = require('../middleware/authMiddleware');

// 2. Import Controller
const OrderController = require('../controllers/OrderController');

// --- CÁC ROUTE ---

// 1. Tạo đơn hàng (Cần đăng nhập)
router.post('/create', protect, OrderController.createOrder);

// 2. Lấy tất cả đơn của 1 user (Cần đăng nhập)
router.get('/get-all-order/:id', protect, OrderController.getAllOrder);

// 3. Lấy chi tiết 1 đơn hàng (Cần đăng nhập)
router.get('/get-details-order/:id', protect, OrderController.getDetailsOrder);

// 4. Hủy đơn hàng (Cần đăng nhập)
router.delete('/cancel-order/:id', protect, OrderController.cancelOrderProduct);

// --- ADMIN ROUTES ---
// 1. Lấy tất cả đơn hàng
router.get('/all-orders', protect, adminOnly, OrderController.getAllOrdersSystem);

// 2. Cập nhật trạng thái
router.put('/status/:id', protect, adminOnly, OrderController.updateOrderStatus);

module.exports = router;