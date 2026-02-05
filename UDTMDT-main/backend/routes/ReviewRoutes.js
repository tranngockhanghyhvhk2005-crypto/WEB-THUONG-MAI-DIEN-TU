// routes/ReviewRouter.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// User routes
// Thêm middleware upload.array('images') để xử lý nhiều ảnh
router.post('/create', protect, upload.array('images', 5), ReviewController.createReview);
router.get('/product/:productId', ReviewController.getReviewsByProduct);

// Admin routes
router.get('/all-reviews', protect, adminOnly, ReviewController.getAllReviewsSystem);
router.put('/reply/:reviewId', protect, adminOnly, ReviewController.replyReview);
router.delete('/:id', protect, adminOnly, ReviewController.deleteReview);

module.exports = router;