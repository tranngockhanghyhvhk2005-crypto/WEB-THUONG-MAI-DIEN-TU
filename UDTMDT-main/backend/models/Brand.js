const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: { 
            type: String, 
            required: true, 
            unique: true 
        } // Thêm trường slug để lưu trữ slug của thương hiệu,
    },
    {
        timestamps: true,
    }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;