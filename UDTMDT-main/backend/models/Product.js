const mongoose = require('mongoose');

// 1. Tạo Schema riêng cho từng review
const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        type: String // Album ảnh mô tả (khoảng 10 ảnh)
    }],
    image: {
        type: String,
        required: true // Ảnh đại diện (lấy từ images[0])
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand: { //THÊM: Quản lý thương hiệu
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String
    },
    discount: {
        type: Number
    },
    selled: {
        type: Number
    },
    isFlashSale: { 
        type: Boolean, 
        default: false 
    },
    flashSalePrice: { 
        type: Number, 
        default: 0 
    },

    // THÊM: Cấu trúc Variants cho Mỹ phẩm (Màu sắc / Dung tích)
    // Ví dụ: Son màu đỏ, KCN 50ml
    variants: [
        {
            name: { type: String, required: true }, // Tên biến thể: "Đỏ Cam", "50ml"
            price: { type: Number, required: true }, // Giá riêng cho biến thể này
            flashSalePrice: { 
                type: Number, 
                default: 0}, // Giá flash sale riêng cho biến thể này
            countInStock: { type: Number, required: true }, // Kho riêng
            image: { type: String }, // Ảnh riêng của biến thể (Ví dụ màu son)
        }
    ]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;