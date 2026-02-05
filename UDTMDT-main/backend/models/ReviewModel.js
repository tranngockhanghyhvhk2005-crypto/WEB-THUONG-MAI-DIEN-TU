const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Uncomment nếu muốn check đơn hàng

    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }], // Lưu danh sách link ảnh

    adminReply: { // [MỚI] Phần trả lời của Admin
        content: { type: String },
        repliedAt: { type: Date }
    }
}, {
    timestamps: true
});

// Index giúp tìm kiếm nhanh hơn
reviewSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);