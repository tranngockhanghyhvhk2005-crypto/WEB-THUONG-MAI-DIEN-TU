const Category = require('../models/Category');

const createSlug = (text) => {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const getAllCategories = async (req, res) => {
    try {
        const { search } = req.query;
        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        // Lấy tất cả danh mục 
        const categories = await Category.find(query).sort({ createdAt: -1 });

        // Trả về dữ liệu
        res.status(200).json({
            status: 'OK',
            message: 'Thành công',
            data: categories,      
            categories: categories, 
            totalCategories: categories.length,
            totalPages: 1,
            currentPage: 1
        });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Lỗi server', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
        
        const slug = createSlug(name);
        const existing = await Category.findOne({ slug });
        if (existing) return res.status(400).json({ message: 'Danh mục đã tồn tại' });

        const newCategory = new Category({ name, slug });
        await newCategory.save();
        res.status(201).json({ status: 'OK', message: 'Tạo thành công', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Không tìm thấy' });

        if (name) {
            category.name = name;
            category.slug = createSlug(name);
        }
        await category.save();
        res.status(200).json({ status: 'OK', message: 'Cập nhật thành công', category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};