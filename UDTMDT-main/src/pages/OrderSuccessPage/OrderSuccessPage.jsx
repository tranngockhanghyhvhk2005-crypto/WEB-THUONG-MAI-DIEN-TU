import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, message } from 'antd'; 
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetCart } from '../../redux/slides/cartSlice';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 2. Khai báo dispatch
  
  const state = location.state || {}; 
  const { paymentMethod, order } = state; 

  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('code') || queryParams.get('vnp_ResponseCode');
  
  const isCalled = useRef(false);

  // Lấy URL API chuẩn
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (responseCode === '00' && !isCalled.current) {
        isCalled.current = true;
        const pendingOrder = JSON.parse(localStorage.getItem('PENDING_ORDER'));

        if (pendingOrder) {
            let token = localStorage.getItem('access_token');
            if (token && typeof token === 'string') {
                if (token.startsWith('"') && token.endsWith('"')) {
                    token = token.slice(1, -1);
                }
            }
            
            if (!token) return;

            const config = {
                headers: {
                    token: `Bearer ${token}`,
                    Authorization: `Bearer ${token}`
                }
            };

            const finalOrder = { 
                ...pendingOrder, 
                isPaid: true, 
                paidAt: new Date(), 
                paymentMethod: 'vnpay' 
            };

            axios.post(`${API_URL}/api/order/create`, finalOrder, config)
                .then(async (res) => {
                    if(res.data.status === 'OK' || res.status === 200 || res.status === 201) {
                        message.success('Thanh toán VNPAY thành công!');
                        localStorage.removeItem('PENDING_ORDER');
                        
                        // A. Xóa giỏ hàng trong Redux (Frontend)
                        dispatch(resetCart());

                        // B. Xóa giỏ hàng trong Database (Backend)
                        // Gọi API update giỏ hàng thành rỗng []
                        try {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user?.id || user?._id) {
                                await axios.put(`${API_URL}/api/users/update-cart`, { cartItems: [] }, config);
                            }
                        } catch (err) {
                            console.log("Lỗi xóa giỏ hàng DB:", err);
                        }
                    }
                })
                .catch(err => {
                    console.error('Lỗi lưu đơn VNPAY:', err);
                    message.error('Đã thanh toán nhưng lỗi lưu đơn. Vui lòng liên hệ Admin!');
                });
        }
    }
  }, [responseCode, dispatch, API_URL]);

  const isSuccess = responseCode === '00' || (paymentMethod === 'cod' && order);

  return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#f5f5fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {isSuccess ? (
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle={`Cảm ơn bạn đã mua sắm. Đơn hàng ${paymentMethod === 'vnpay' ? 'đã thanh toán qua VNPAY' : ''} của bạn đang được xử lý.`}
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>,
            <Button key="orders" onClick={() => navigate('/my-orders')}>
              Xem đơn hàng của tôi
            </Button>
          ]} 
        />
      ) : (
        <Result
          status="error"
          title="Đặt hàng thất bại"
          subTitle="Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình xử lý."
          extra={[
            <Button type="primary" onClick={() => navigate('/payment')}>
              Thử lại
            </Button>,
            <Button onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          ]} 
        />
      )}
    </div>
  );
};

export default OrderSuccessPage;