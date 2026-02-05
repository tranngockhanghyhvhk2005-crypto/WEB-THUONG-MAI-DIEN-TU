const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            couponCode: { type: String },       // Mã code đã dùng (VD: SALE50)
            discountPrice: { type: Number, default: 0 }, // Số tiền được giảm bởi coupon
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            variantName: { type: String },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            isReviewed: { type: Boolean, default: false }, 
        },
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    // Thêm trường status để đồng bộ Admin & User
    status: { type: String, default: 'Pending' }, // Các giá trị: Pending, Confirmed, Shipped, Delivered, Cancelled

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;