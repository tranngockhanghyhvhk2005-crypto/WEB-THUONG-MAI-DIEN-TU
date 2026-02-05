// models/Category.js
const mongoose = require('mongoose');

// --- SCHEMA DANH MỤC SẢN PHẨM ---
const categorySchema = new mongoose.Schema({
    name: {          // Tên danh mục
        type: String,
        required: true,
        trim: true
    },
    slug: {          // Slug dùng URL, duy nhất
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true }); // Tạo createdAt, updatedAt tự động

// --- TẠO VÀ EXPORT MODEL 'Category' ---
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
