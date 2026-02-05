const mongoose = require('mongoose');

// --- SCHEMA ĐỊA CHỈ (Giữ nguyên) ---
const addressSchema = new mongoose.Schema({
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    specificAddress: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

// --- SCHEMA GIỎ HÀNG (Giữ nguyên) ---
const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variationSku: { type: String },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    originalPrice: { type: Number },
    stockQuantity: { type: Number },
    discount: { type: Number }
}, { _id: false });

// --- SCHEMA NGƯỜI DÙNG (SỬA LẠI ĐOẠN NÀY) ---
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    phone: {
        type: String,
        default: null,   // Đổi từ '' sang null để tránh trùng lặp chuỗi rỗng
        sparse: true,    // Cho phép nhiều giá trị null (nghĩa là chưa có sđt vẫn lưu được)
        unique: true     // Vẫn giữ unique để sau này nhập sđt thật thì không được trùng
    },

    phoneVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other'
    },
    birthday: { type: Date },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },

    addresses: [addressSchema],
    wishlist: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],

    cartItems: [cartItemSchema],

    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordExpires;
            return ret;
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;