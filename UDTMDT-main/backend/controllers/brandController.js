const Brand = require('../models/Brand');

const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// 1. LẤY TẤT CẢ BRAND
const getAllBrand = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        // Response chuẩn cho Frontend
        return res.status(200).json({
            status: 'OK',
            message: 'Lấy danh sách thành công',
            data: brands
        });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

// 2. TẠO BRAND
const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) return res.status(400).json({ status: 'ERR', message: 'Tên thương hiệu là bắt buộc' });

        const slug = generateSlug(name);
        const checkBrand = await Brand.findOne({ slug });
        if (checkBrand) return res.status(400).json({ status: 'ERR', message: 'Thương hiệu đã tồn tại' });

        // Chỉ lưu name và slug
        const newBrand = await Brand.create({ name, slug });
        return res.status(200).json({ status: 'OK', message: 'Tạo thành công', data: newBrand });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

// 2. CẬP NHẬT BRAND
const updateBrand = async (req, res) => {
    try {
        const brandId = req.params.id;
        const { name } = req.body;
        let updateData = { name }; // Chỉ cập nhật tên

        if (name) {
            updateData.slug = generateSlug(name);
        }

        const updatedBrand = await Brand.findByIdAndUpdate(brandId, updateData, { new: true });
        if (!updatedBrand) return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy' });

        return res.status(200).json({ status: 'OK', message: 'Cập nhật thành công', data: updatedBrand });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

// 4. XÓA BRAND
const deleteBrand = async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: 'OK', message: 'Xóa thành công' });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message });
    }
};

const getDetailsBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ status: 'ERR', message: 'Not found' });
        return res.status(200).json({ status: 'OK', data: brand });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

module.exports = {
    getAllBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    getDetailsBrand
};