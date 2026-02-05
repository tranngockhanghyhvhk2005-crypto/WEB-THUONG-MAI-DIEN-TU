const express = require('express');
const router = express.Router();
const { protect: auth, adminOnly } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/statisticalController');

// Đường dẫn: /api/statistical/dashboard
router.get('/dashboard', auth, adminOnly, getDashboardStats);

module.exports = router;