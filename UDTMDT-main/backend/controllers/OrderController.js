const Order = require('../models/OrderProduct');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// HÀM CẬP NHẬT KHO
const updateProductStock = async (orderItems) => {
    try {
        for (const item of orderItems) {
            const qty = parseInt(item.amount || item.quantity) || 0;
            if (qty <= 0) continue;

            // TRƯỜNG HỢP 1: MUA BIẾN THỂ
            if (item.variantName) {
                const result = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        "variants.name": item.variantName
                    },
                    {
                        $inc: {
                            "variants.$.countInStock": -qty,
                            "selled": +qty,
                            "countInStock": -qty
                        }
                    },
                    { new: true }
                );

                if (result) {
                    console.log(`Đã trừ kho BIẾN THỂ '${item.variantName}' & KHO TỔNG - SL: ${qty}`);
                } else {
                    const product = await Product.findById(item.product);
                    if (product) {
                        const variantIndex = product.variants.findIndex(v => v.name.trim() === item.variantName.trim());
                        if (variantIndex >= 0) {
                            product.variants[variantIndex].countInStock -= qty;
                            product.countInStock -= qty;
                            product.selled = (product.selled || 0) + qty;
                            await product.save();
                        }
                    }
                }
            }
            // TRƯỜNG HỢP 2: SẢN PHẨM THƯỜNG
            else {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            countInStock: -qty,
                            selled: +qty
                        }
                    }
                );
            }
        }
    } catch (e) {
        console.error("Lỗi cập nhật kho:", e);
    }
};

// HÀM HOÀN TRẢ KHO
const restoreProductStock = async (orderItems) => {
    try {
        for (const item of orderItems) {
            const qty = parseInt(item.amount || item.quantity) || 0;
            if (qty <= 0) continue;

            // TRƯỜNG HỢP 1: BIẾN THỂ
            if (item.variantName) {
                const result = await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        "variants.name": item.variantName
                    },
                    {
                        $inc: {
                            "variants.$.countInStock": +qty,
                            "selled": -qty,
                            "countInStock": +qty
                        }
                    },
                    { new: true }
                );

                if (!result) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        const variantIndex = product.variants.findIndex(v => v.name.trim() === item.variantName.trim());
                        if (variantIndex >= 0) {
                            product.variants[variantIndex].countInStock += qty;
                            product.countInStock += qty;
                            product.selled = Math.max(0, (product.selled || 0) - qty);
                            await product.save();
                        }
                    }
                }
            }
            // TRƯỜNG HỢP 2: SẢN PHẨM THƯỜNG
            else {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            countInStock: +qty,
                            selled: -qty
                        }
                    }
                );
            }
        }
    } catch (e) {
        console.error("Lỗi hoàn kho:", e);
    }
};

// --- TẠO ĐƠN HÀNG ---
const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod, itemsPrice, shippingPrice, totalPrice,
            user, isPaid, paidAt,
            fullName, address, city, phone, email,
            couponCode, discountPrice
        } = req.body;

        if (!req.body.orderItems || req.body.orderItems.length === 0) {
            return res.status(400).json({ status: 'ERR', message: 'Giỏ hàng rỗng' });
        }

        // --- XỬ LÝ COUPON CHI TIẾT ---
        let finalTotalPrice = totalPrice; 
        let appliedDiscount = 0;

        if (couponCode) {
            // Tìm coupon theo code
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (!coupon) {
                return res.status(404).json({ status: 'ERR', message: 'Mã giảm giá không tồn tại' });
            }

            // Kiểm tra trạng thái (Status)
            if (!coupon.status) {
                return res.status(400).json({ status: 'ERR', message: 'Mã giảm giá hiện không thể sử dụng' });
            }

            // Kiểm tra ngày hiệu lực (Start/End Date)
            const now = new Date();
            if (coupon.startDate && now < new Date(coupon.startDate)) {
                return res.status(400).json({ status: 'ERR', message: 'Mã giảm giá chưa đến thời gian hiệu lực' });
            }
            if (coupon.endDate && now > new Date(coupon.endDate)) {
                return res.status(400).json({ status: 'ERR', message: 'Mã giảm giá đã hết hạn' });
            }

            // Kiểm tra giới hạn lượt dùng (Usage Limit)
            if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
                return res.status(400).json({ status: 'ERR', message: 'Mã giảm giá đã hết lượt sử dụng' });
            }

            // Kiểm tra đơn hàng tối thiểu (Min Order Value)
            if (coupon.minOrderValue && itemsPrice < coupon.minOrderValue) {
                return res.status(400).json({
                    status: 'ERR',
                    message: `Đơn hàng chưa đạt giá trị tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã`
                });
            }

            // TÍNH TOÁN LẠI GIÁ & CHẶN SỐ ÂM
            // Logic: Tổng thanh toán = (Tiền hàng + Ship) - Giảm giá
            // Nếu Giảm giá > (Tiền hàng + Ship) thì Tổng = 0 (Không được âm)
            const calculatedTotal = (itemsPrice + shippingPrice) - (discountPrice || 0);
            finalTotalPrice = Math.max(0, calculatedTotal);

            // Cập nhật lượt dùng
            coupon.usedCount += 1;
            await coupon.save();

            appliedDiscount = discountPrice || 0;
        }

        // Xử lý thông tin giao hàng
        const shippingAddress = {
            fullName: req.body.shippingAddress?.fullName || fullName,
            address: req.body.shippingAddress?.address || address,
            city: req.body.shippingAddress?.city || city,
            phone: req.body.shippingAddress?.phone || phone,
            email: req.body.shippingAddress?.email || email
        };

        if (!shippingAddress.email) {
            return res.status(400).json({ status: 'ERR', message: 'Cần cung cấp Email' });
        }

        const newOrder = await Order.create({
            orderItems: req.body.orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice: finalTotalPrice, // Dùng giá đã tính toán lại

            couponCode: couponCode || '',
            discountPrice: appliedDiscount,

            user: user || null,
            isPaid: isPaid || false,
            paidAt: paidAt || null,
            email: shippingAddress.email
        });

        if (newOrder) {
            await updateProductStock(req.body.orderItems);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Tạo đơn hàng thành công',
            data: newOrder
        });

    } catch (e) {
        console.error("Lỗi Controller CreateOrder:", e);
        return res.status(500).json({ status: 'ERR', message: 'Lỗi server', error: e.message });
    }
};

// --- LẤY ĐƠN HÀNG USER ---
const getAllOrder = async (req, res) => {
    try {
        const userId = req.params.id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'OK', data: orders });
    } catch (e) { res.status(500).json({ status: 'ERR', error: e.message }) }
};

// --- CHI TIẾT ĐƠN HÀNG ---
const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ status: 'ERR', message: 'Not found' });
        res.status(200).json({ status: 'OK', data: order });
    } catch (e) { res.status(500).json({ status: 'ERR', error: e.message }) }
};

// --- HỦY ĐƠN HÀNG (CÓ HOÀN KHO & HOÀN COUPON) ---
const cancelOrderProduct = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({
                status: 'ERR',
                message: 'Không thể hủy đơn hàng đã xác nhận/đang giao.'
            });
        }

        // 1. Hoàn lượt dùng Coupon
        if (order.couponCode) {
            const coupon = await Coupon.findOne({ code: order.couponCode });
            if (coupon) {
                coupon.usedCount = Math.max(0, coupon.usedCount - 1);
                await coupon.save();
            }
        }

        // 2. Hoàn kho
        if (order.orderItems && order.orderItems.length > 0) {
            await restoreProductStock(order.orderItems);
        }

        order.status = 'Cancelled';
        order.isDelivered = false;
        await order.save();

        return res.status(200).json({
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
            data: order
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi hủy đơn hàng',
            error: e.message
        });
    }
};

// --- ADMIN: LẤY ALL ĐƠN ---
const getAllOrdersSystem = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status;
        let query = {};
        if (status) query.status = status;
        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            status: 'OK',
            data: orders,
            total: totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit)
        });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi server', error: e.message });
    }
};

// --- ADMIN: UPDATE STATUS (KÈM HOÀN KHO NẾU HUỶ) ---
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        // Nếu Admin hủy đơn -> Hoàn kho
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            if (order.orderItems) {
                await restoreProductStock(order.orderItems);
            }
            // Optional: Hoàn coupon ở đây nếu cần thiết
        }

        order.status = status;
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            if ((order.paymentMethod || '').toLowerCase().includes('cod')) {
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        } else {
            order.isDelivered = false;
        }
        await order.save();
        res.status(200).json({ status: 'OK', message: 'Success', data: order });
    } catch (e) {
        res.status(500).json({ message: 'Error', error: e.message });
    }
};

const getDetailsOrderAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('user', 'name email');
        if (!order) return res.status(404).json({ status: 'ERR', message: 'Not found' });
        res.status(200).json({ status: 'OK', data: order });
    } catch (e) { res.status(500).json({ status: 'ERR', error: e.message }) }
};

module.exports = {
    createOrder,
    getAllOrder,
    getDetailsOrder,
    cancelOrderProduct,
    getAllOrdersSystem,
    updateOrderStatus,
    getDetailsOrderAdmin,
};