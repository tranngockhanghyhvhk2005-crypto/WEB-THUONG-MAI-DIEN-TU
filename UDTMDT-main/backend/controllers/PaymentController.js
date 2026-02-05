const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');

// --- 1. HÀM TẠO URL THANH TOÁN (Giữ nguyên của bạn) ---
const createPaymentUrl = (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    
    const tmnCode = process.env.VNPAY_TMNCODE;
    const secretKey = process.env.VNPAY_HASHSECRET;
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    let ipAddr = req.headers['x-forwarded-for'] ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 req.connection.socket.remoteAddress;

    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription || 'Thanh toan don hang';
    const orderType = req.body.orderType || 'billpayment';
    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = moment(date).format('DDHHmmss');
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    
    let paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json({ status: 'OK', message: 'Success', url: paymentUrl });
};

// --- 2. HÀM XỬ LÝ KẾT QUẢ TRẢ VỀ ---
const vnpayReturn = (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa các trường hash để tính toán lại checksum
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp lại tham số theo chuẩn VNPAY
    vnp_Params = sortObject(vnp_Params);

    const tmnCode = process.env.VNPAY_TMNCODE;
    const secretKey = process.env.VNPAY_HASHSECRET;

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // Kiểm tra chữ ký bảo mật
    if (secureHash === signed) {
        // Kiểm tra mã lỗi (00 là thành công)
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            // Chuyển hướng về trang React (Frontend) kèm theo trạng thái
            return res.redirect(`http://localhost:3000/order-success?status=success&code=${vnp_Params['vnp_ResponseCode']}`);
        } else {
            // Thất bại
            return res.redirect(`http://localhost:3000/order-success?status=fail&code=${vnp_Params['vnp_ResponseCode']}`);
        }
    } else {
        // Sai chữ ký (Checksum failed)
        return res.redirect(`http://localhost:3000/order-success?status=error&message=Checksum_failed`);
    }
};

// Hàm sắp xếp tham số 
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = { 
    createPaymentUrl, 
    vnpayReturn 
};