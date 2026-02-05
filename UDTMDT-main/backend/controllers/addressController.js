const Address = require('../models/Address');

// --- LẤY DANH SÁCH ĐỊA CHỈ CỦA NGƯỜI DÙNG ---
const getUserAddresses = async (req, res) => {
    try {
        console.log('Đang gọi API lấy danh sách địa chỉ, User ID:', req.user.id);

        const addresses = await Address.find({ user: req.user.id })
            .sort({ isDefault: -1, createdAt: 1 }); // ưu tiên mặc định lên đầu

        res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách địa chỉ'
        });
    }
};

// --- THÊM ĐỊA CHỈ MỚI ---
const addAddress = async (req, res) => {
    try {
        const { province, district, ward, specificAddress, isDefault, type } = req.body;
        const { firstName, lastName, phone, id: userId } = req.user;

        // Kiểm tra đầy đủ thông tin
        if (!province || !district || !ward || !specificAddress) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
            });
        }

        // Nếu đặt mặc định => bỏ mặc định các địa chỉ khác
        if (isDefault) {
            await Address.updateMany(
                { user: userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const newAddress = new Address({
            fullName: `${firstName} ${lastName}`.trim(),
            phone,
            province,
            district,
            ward,
            specificAddress,
            isDefault: isDefault || false,
            type: type || 'home',
            user: userId
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            success: true,
            message: 'Thêm địa chỉ mới thành công',
            data: savedAddress
        });
    } catch (error) {
        console.error('Lỗi khi thêm địa chỉ mới:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Đã xảy ra lỗi khi thêm địa chỉ mới'
        });
    }
};

// --- CẬP NHẬT ĐỊA CHỈ ---
const updateAddress = async (req, res) => {
    try {
        const { fullName, phone, province, district, ward, specificAddress, isDefault, type } = req.body;

        // Kiểm tra đầy đủ thông tin
        if (!fullName || !phone || !province || !district || !ward || !specificAddress) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin địa chỉ'
            });
        }

        // Nếu đặt mặc định => bỏ mặc định các địa chỉ khác
        if (isDefault) {
            await Address.updateMany(
                { user: req.user.id, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const updateData = {
            fullName, phone, province, district, ward, specificAddress, isDefault, type
        };

        const address = await Address.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy địa chỉ hoặc bạn không có quyền'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật địa chỉ thành công',
            data: address
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật địa chỉ:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Đã xảy ra lỗi khi cập nhật địa chỉ'
        });
    }
};

// --- XÓA ĐỊA CHỈ ---
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy địa chỉ hoặc bạn không có quyền'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa địa chỉ thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa địa chỉ:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa địa chỉ'
        });
    }
};

// --- ĐẶT ĐỊA CHỈ MẶC ĐỊNH ---
const setDefaultAddress = async (req, res) => {
    try {
        // Bỏ mặc định tất cả địa chỉ
        await Address.updateMany(
            { user: req.user.id },
            { $set: { isDefault: false } }
        );

        // Đặt địa chỉ được chọn là mặc định
        const address = await Address.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: { isDefault: true } },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy địa chỉ hoặc bạn không có quyền'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đặt địa chỉ mặc định thành công',
            data: address
        });
    } catch (error) {
        console.error('Lỗi khi đặt địa chỉ mặc định:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi đặt địa chỉ mặc định'
        });
    }
};

module.exports = {
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
