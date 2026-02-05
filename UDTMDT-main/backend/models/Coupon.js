const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
        trim: true 
    },
    discountType: { 
        type: String, 
        enum: ['percent', 'fixed'], // 'percent': giảm %, 'fixed': giảm tiền mặt
        default: 'fixed' 
    },
    discountValue: { 
        type: Number, 
        required: true 
    },
    minOrderValue: { // Đơn tối thiểu để áp dụng
        type: Number, 
        default: 0 
    },
    maxDiscountAmount: { // Giảm tối đa (dùng cho loại percent)
        type: Number, 
        default: 0 
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    usageLimit: { // Tổng số lần mã có thể dùng
        type: Number, 
        default: 100 
    },
    usedCount: { // Số lần đã dùng
        type: Number, 
        default: 0 
    },
    status: { // Kích hoạt hay không
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;