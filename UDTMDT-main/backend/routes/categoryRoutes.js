const express = require('express');
const router = express.Router();
const { protect: auth, adminOnly } = require('../middleware/authMiddleware');

const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// --- CẤU HÌNH ROUTES ---
router.get('/', getAllCategories);        // Cho CategoryPage
router.get('/get-all', getAllCategories); // Cho ProductPage

// Các route thao tác dữ liệu
router.post('/', auth, adminOnly, createCategory);
router.put('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

module.exports = router;