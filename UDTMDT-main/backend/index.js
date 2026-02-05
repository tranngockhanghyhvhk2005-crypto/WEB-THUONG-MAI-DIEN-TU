// server.js 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const addressRoutes = require('./routes/addressRoutes');
const paymentRouter = require('./routes/PaymentRoutes'); 
const orderRoutes = require('./routes/OrderRoutes');     
const reviewRouter = require('./routes/ReviewRoutes.js');

const categoryRoutes = require('./routes/categoryRoutes');
const statisticalRoutes = require('./routes/statisticalRoutes');
const brandRoutes = require('./routes/brandRoutes');
const couponRoutes = require('./routes/couponRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// --- CẤU HÌNH CORS ---
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000',];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token'); // Đã thêm 'token' vào header cho giống Dự án A

    // Xử lý preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// --- MIDDLEWARE ---
app.use(express.json());

// --- KẾT NỐI MONGO DB ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Đã kết nối tới MongoDB'))
    .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// --- ĐĂNG KÝ ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payment', paymentRouter); 
app.use('/api/order', orderRoutes);     
app.use('/api/statistical', statisticalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRouter);

// --- ROUTE KIỂM TRA SERVER ---
app.get('/', (req, res) => {
    res.send('✅ Máy chủ đang hoạt động');
});

// --- uploads ảnh ---
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));


console.log('Static files path:', path.join(__dirname, 'uploads'));

// --- XỬ LÝ 404 ---
app.use((req, res) => {
    res.status(404).json({ message: '❌ Không tìm thấy tài nguyên' });
});

// --- XỬ LÝ LỖI CHUNG ---
app.use((err, req, res, next) => {
    console.error('❌ Lỗi máy chủ:', err);
    res.status(500).json({
        message: '❌ Đã xảy ra lỗi máy chủ',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- START SERVER ---
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Máy chủ đang chạy tại http://localhost:${port}`);
});