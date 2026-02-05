const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        let folder = 'others'; 

        // --- ƯU TIÊN CHECK TÊN FIELD "images" CỦA REVIEW TRƯỚC ---
        // Nếu API đang gọi có chữ 'reviews' hoặc 'feedback'
        if (req.baseUrl && (req.baseUrl.includes('review') || req.baseUrl.includes('feedback'))) {
            folder = 'reviews-img'; 
        } 
        else if (file.fieldname === 'images' && (req.baseUrl && req.baseUrl.includes('products'))) {
            folder = 'product-img';
        }
        else if (file.fieldname === 'variantImages') {
            folder = 'variants-img'; 
        } 
        else if (file.fieldname === 'image' && req.baseUrl.includes('brand')) {
            folder = 'brand-img'; 
        }
        // Fallback chung
        else if (file.fieldname === 'images') {
            folder = 'product-img';
        }

        const uploadPath = path.join(__dirname, '../uploads', folder);
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;