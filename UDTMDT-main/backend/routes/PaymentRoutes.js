const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { protect } = require('../middleware/authMiddleware');

// 1. Route Tạo URL thanh toán (Code bạn vừa gửi - Đã chuẩn)
router.post('/create_payment_url', 
    (req, res, next) => {
        console.log(">>> [ROUTER CHECK] Đã tìm thấy đường dẫn Payment!");
        next(); 
    },
    protect, 
    PaymentController.createPaymentUrl
);

// 2. Route Nhận kết quả từ VNPAY
router.get('/vnpay_return', PaymentController.vnpayReturn);

module.exports = router;