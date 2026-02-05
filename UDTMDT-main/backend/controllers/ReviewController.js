const Review = require('../models/ReviewModel');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const Order = require('../models/OrderProduct');

// --- HÀM PHỤ: TÍNH TRUNG BÌNH SAO ---
const calculateAverageRating = async (productId) => {
    try {
        const stats = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$product',
                    nReviews: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                rating: Math.round(stats[0].avgRating * 10) / 10,
            });
        }
    } catch (error) {
        console.error("Lỗi khi tính toán Average Rating:", error);
    }
};

// --- 1. TẠO ĐÁNH GIÁ (USER) ---
const createReview = async (req, res) => {
    try {
        console.log("--- [DEBUG] START CREATE REVIEW ---");
        // 1. Kiểm tra User từ Token
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: 'ERR', message: 'Lỗi xác thực: Không tìm thấy thông tin User.' });
        }
        const userId = req.user.id;
        console.log("User ID:", userId);

        // 2. Kiểm tra dữ liệu Body
        console.log("Body nhận được:", req.body);
        const { productId, orderId, rating, comment } = req.body;

        if (!productId || !orderId || !rating) {
            return res.status(400).json({ status: 'ERR', message: 'Thiếu thông tin bắt buộc (productId, orderId, rating)' });
        }

        // 3. Xử lý file ảnh (nếu có)
        let reviewImages = [];
        if (req.files && req.files.length > 0) {
            reviewImages = req.files.map(file => `/uploads/reviews-img/${file.filename}`);
        }
        console.log("Ảnh upload:", reviewImages);

        // 4. Kiểm tra đơn hàng
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
            isDelivered: true, 
            status: 'Delivered'
        });

        if (!order) {
            return res.status(400).json({ status: 'ERR', message: 'Đơn hàng không hợp lệ hoặc chưa giao hàng thành công.' });
        }

        // 5. Tìm sản phẩm trong đơn hàng
        // item.product là ObjectId, productId gửi lên là String -> Cần toString() để so sánh
        const orderItemIndex = order.orderItems.findIndex(item => {
            const itemProdId = item.product ? item.product.toString() : '';
            const itemId = item._id ? item._id.toString() : '';
            return (itemProdId === productId || itemId === productId) && item.isReviewed === false;
        });

        if (orderItemIndex === -1) {
            return res.status(400).json({ status: 'ERR', message: 'Sản phẩm này đã được đánh giá hoặc không tồn tại trong đơn hàng.' });
        }

        const currentUser = await require('../models/User').findById(userId);
        const userName = currentUser ? (currentUser.firstName + ' ' + currentUser.lastName).trim() : 'User';

        // 6. Tạo Review
        const newReview = await Review.create({
            user: userId,
            name: userName,
            product: productId,
            order: orderId,
            rating: Number(rating),
            comment: comment || '',
            images: reviewImages
        });

        // 7. Update trạng thái đơn hàng
        order.orderItems[orderItemIndex].isReviewed = true;
        await order.save();

        // 8. Tính lại Rating trung bình
        const reviews = await Review.find({ product: productId });
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            const avgRating = totalRating / reviews.length;
            await Product.findByIdAndUpdate(productId, { rating: avgRating });
        }

        console.log("--- [DEBUG] REVIEW SUCCESS ---");
        return res.status(201).json({ status: 'OK', message: 'Đánh giá thành công', data: newReview });

    } catch (e) {
        console.error("--- [LỖI 500 REVIEW] ---");
        console.error(e); 
        return res.status(500).json({ status: 'ERR', message: 'Lỗi server: ' + e.message });
    }
};

// --- LẤY TẤT CẢ ĐÁNH GIÁ CỦA 1 SẢN PHẨM (PUBLIC) ---
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId })
            .populate('user', 'firstName lastName avatar')
            .sort({ createdAt: -1 });
        return res.status(200).json({ status: 'OK', data: reviews });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

// --- ADMIN LẤY TẤT CẢ ĐÁNH GIÁ (QUẢN LÝ) ---
const getAllReviewsSystem = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'firstName lastName email avatar')
            .populate('product', 'name image')
            .sort({ createdAt: -1 });
        return res.status(200).json({ status: 'OK', data: reviews });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

// --- ADMIN TRẢ LỜI ĐÁNH GIÁ ---
const replyReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { content } = req.body;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ status: 'ERR', message: 'Review not found' });

        review.adminReply = { content, repliedAt: new Date() };
        await review.save();
        return res.status(200).json({ status: 'OK', message: 'Success', data: review });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

// --- ADMIN XÓA ĐÁNH GIÁ ---
const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: 'OK', message: 'Deleted' });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

module.exports = {
    createReview,
    getReviewsByProduct,
    getAllReviewsSystem,
    replyReview,
    deleteReview
};