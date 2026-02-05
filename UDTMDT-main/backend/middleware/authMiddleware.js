const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
    // console.log("Bắt đầu kiểm tra Token");
    
    let token;

    // Kiểm tra header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Kiểm tra token rỗng (xử lý cả trường hợp frontend gửi string "null" hoặc "undefined")
            if(!token || token === 'undefined' || token === 'null') {
                 throw new Error("Token bị rỗng hoặc undefined");
            }

            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);

            // Tìm user dựa trên id trong token (xử lý cả id và _id)
            req.user = await User.findById(decoded.id || decoded._id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'User không tồn tại' });
            }

            // console.log("3. Xác thực thành công! User:", req.user.email);
            next();
        } catch (error) {
            console.error("ERROR JWT:", error.message);
            return res.status(401).json({ 
                message: 'Token không hợp lệ: ' + error.message 
            });
        }
    } 
    else {
        return res.status(401).json({ message: 'Không có Token' });
    }
};

// --- Middleware kiểm tra quyền Admin ---
const adminOnly = (req, res, next) => {
    // 1. Kiểm tra xem đã qua bước protect chưa
    if (!req.user) {
        return res.status(401).json({ message: 'Chưa đăng nhập hoặc Token lỗi' });
    }

    // 2. Logic kiểm tra "Dễ Tính" (Chấp nhận nhiều trường hợp)
    
    // Kiểm tra trường isAdmin (Chấp nhận: true, "true", 1)
    const checkIsAdmin = (
        req.user.isAdmin === true || 
        req.user.isAdmin === 'true' || 
        req.user.isAdmin === 1
    );

    // Kiểm tra trường role (Chấp nhận: "admin", "Admin", "ADMIN")
    const checkRole = (
        req.user.role && 
        req.user.role.toLowerCase() === 'admin'
    );

    // Chỉ cần thỏa mãn 1 trong 2 điều kiện là cho qua
    if (checkIsAdmin || checkRole) {
        next(); // OK, là Admin
    } else {
        // In log ra terminal để debug nếu vẫn bị chặn
        console.log(`>>> [AUTH BLOCK] User: ${req.user.email} | isAdmin: ${req.user.isAdmin} | role: ${req.user.role}`);
        res.status(403).json({ message: 'Không có quyền truy cập Admin' }); 
    }
};

module.exports = { protect, adminOnly };