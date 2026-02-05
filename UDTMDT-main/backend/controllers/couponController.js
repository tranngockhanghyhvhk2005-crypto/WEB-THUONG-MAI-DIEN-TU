const Coupon = require('../models/Coupon');

// Tạo mã giảm giá
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderValue, maxDiscountAmount, startDate, endDate, usageLimit } = req.body;

        // Kiểm tra trùng mã
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Mã giảm giá này đã tồn tại!' });
        }

        const newCoupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            usageLimit
        });

        res.status(201).json({ status: 'OK', message: 'Tạo mã thành công', data: newCoupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy danh sách (Admin)
const getAllCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search ? { code: { $regex: search, $options: 'i' } } : {};

        const totalCoupons = await Coupon.countDocuments(query);
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: 'OK',
            data: coupons,
            totalPages: Math.ceil(totalCoupons / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật mã
const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCoupon) return res.status(404).json({ message: 'Không tìm thấy mã' });
        res.status(200).json({ status: 'OK', message: 'Cập nhật thành công', data: updatedCoupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xóa mã
const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Toggle Status (Ẩn/Hiện)
const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Không tìm thấy mã' });
        
        coupon.status = !coupon.status;
        await coupon.save();
        
        res.status(200).json({ status: 'OK', message: 'Cập nhật trạng thái thành công', data: coupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- API KIỂM TRA MÃ GIẢM GIÁ CHO USER ---
const validateCoupon = async (req, res) => {
    try {
        const { code, orderValue } = req.body;
        
        // 1. Tìm mã 
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase()
        });

        // 2. Kiểm tra tồn tại
        if (!coupon) {
            return res.status(404).json({ message: 'Mã giảm giá không tồn tại!' });
        }

        // 3. [MỚI] Kiểm tra trạng thái (Status)
        if (!coupon.status) {
            return res.status(400).json({ message: 'Mã giảm giá bạn đang sử dụng hiện đang không thể sử dụng' });
        }

        // 4. Kiểm tra số lượng giới hạn
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
        }

        // 5. Kiểm tra thời hạn
        const now = new Date();
        const start = new Date(coupon.startDate);
        const end = new Date(coupon.endDate); // Lưu ý: endDate trong DB nên set giờ là 23:59:59

        if (now < start) {
             return res.status(400).json({ message: 'Mã giảm giá chưa đến đợt áp dụng' });
        }
        if (now > end) {
             return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
        }

        // 6. Kiểm tra giá trị đơn hàng tối thiểu
        if (orderValue < coupon.minOrderValue) {
            return res.status(400).json({ 
                message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString('vi-VN')}đ mới được dùng mã này` 
            });
        }

        // 7. Tính toán số tiền được giảm
        let discountAmount = 0;
        if (coupon.discountType === 'percent') {
            discountAmount = (orderValue * coupon.discountValue) / 100;
            // Nếu có giới hạn số tiền giảm tối đa
            if (coupon.maxDiscountAmount > 0) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        } else {
            // Giảm tiền mặt trực tiếp
            discountAmount = coupon.discountValue;
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Áp dụng mã thành công',
            data: {
                ...coupon._doc,
                calculatedDiscount: discountAmount
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    validateCoupon,
};