const mongoose = require('mongoose');

// --- SCHEMA ĐỊA CHỈ NGƯỜI DÙNG ---
const addressSchema = new mongoose.Schema({
    fullName: {               // Họ và tên người nhận
        type: String,
        required: true
    },
    phone: {                  // Số điện thoại, kiểm tra định dạng VN
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v);
            },
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        }
    },
    province: {               // Tỉnh/Thành phố
        type: String,
        required: true
    },
    district: {               // Quận/Huyện
        type: String,
        required: true
    },
    ward: {                   // Phường/Xã
        type: String,
        required: true
    },
    specificAddress: {        // Địa chỉ chi tiết (số nhà, ngõ, ...)
        type: String,
        required: true
    },
    user: {                   // Liên kết user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    isDefault: {              // Địa chỉ mặc định
        type: Boolean,
        default: false
    },
    type: {                   // Loại địa chỉ: nhà, công ty, khác
        type: String,
        enum: ['home', 'office', 'other'],
        default: 'home'
    }
}, {
    timestamps: true          // Tự động tạo createdAt, updatedAt
});

// --- PRE SAVE: Nếu đặt mặc định, bỏ mặc định các địa chỉ khác ---
addressSchema.pre('save', async function(next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { user: this.user, isDefault: true },
            { $set: { isDefault: false } }
        );
    }
    next();
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
