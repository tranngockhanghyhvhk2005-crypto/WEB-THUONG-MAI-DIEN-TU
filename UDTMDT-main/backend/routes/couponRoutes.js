const express = require('express');
const router = express.Router();
const { protect: auth, adminOnly } = require('../middleware/authMiddleware');
const couponController = require('../controllers/couponController');

// User cần đăng nhập để dùng mã (chỉ dùng middleware auth)
router.post('/validate', auth, couponController.validateCoupon);

// Tất cả route đều cần quyền Admin
router.get('/', auth, adminOnly, couponController.getAllCoupons);
router.post('/', auth, adminOnly, couponController.createCoupon);
router.put('/:id', auth, adminOnly, couponController.updateCoupon);
router.delete('/:id', auth, adminOnly, couponController.deleteCoupon);
router.put('/status/:id', auth, adminOnly, couponController.toggleCouponStatus);

module.exports = router;