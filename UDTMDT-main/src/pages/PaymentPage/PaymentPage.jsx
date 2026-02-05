import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Form, Input, Radio, Button, message, Tag } from 'antd'
import {
  EnvironmentOutlined,
  CreditCardOutlined,
  WalletOutlined
} from '@ant-design/icons'
import {
  WrapperContainer,
  WrapperLeft,
  WrapperRight,
  WrapperTotal,
  WrapperMethod
} from './style'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { resetCart } from '../../redux/slides/cartSlice';

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // Lấy URL API từ biến môi trường
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const { items: orderItems, subtotal: itemsPrice, total: totalPrice } = location.state || {}
  const [shippingPrice, setShippingPrice] = useState(0)

  // [STATE MỚI CHO COUPON]
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Lưu object coupon đã apply thành công

  // --- TÍNH TOÁN TỔNG TIỀN CUỐI CÙNG ---
  // Giá cuối = (Giá hàng + Ship) - Giảm giá coupon
  const finalTotalPrice = useMemo(() => {
    const total = (totalPrice || 0) - couponDiscount;
    return total > 0 ? total : 0;
  }, [totalPrice, couponDiscount]);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    email: ''
  });

  // --- 1. LOGIC TỰ ĐỘNG ĐIỀN FORM ---
  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    let user = null;
    if (userStorage) {
      try { user = JSON.parse(userStorage); } catch (e) { }
    }

    if (user) {
      let name = user.name || '';
      if (!name && user.firstName) name = `${user.firstName} ${user.lastName || ''}`.trim();

      let phone = user.phone || '';
      let address = '';
      let city = '';
      let email = user.email || '';

      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
        if (defaultAddr) {
          const parts = [defaultAddr.specificAddress, defaultAddr.ward, defaultAddr.district, defaultAddr.province].filter(part => part);
          address = parts.join(', ');
          city = defaultAddr.province;
        }
      }
      else if (user.address) {
        if (typeof user.address === 'object') address = Object.values(user.address).join(', ');
        else address = String(user.address);
        city = user.city || '';
      }

      if (address === '[object Object]') address = '';

      const newState = {
        name: name || '',
        phone: phone,
        address: address,
        city: city,
        email: email
      };

      setStateUserDetails(newState);

      // Tự động điền dữ liệu vào Form
      form.setFieldsValue({
        fullName: newState.name,
        phone: newState.phone,
        address: newState.address,
        city: newState.city,
        email: newState.email
      });
    }
  }, [form]);

  // --- 2. KIỂM TRA GIỎ HÀNG ---
  useEffect(() => {
    if (!orderItems || orderItems.length === 0) {
      message.warning('Vui lòng chọn sản phẩm để thanh toán.', 3);
      navigate('/order');
    } else {
      const calculatedShipping = itemsPrice >= 500000 ? 0 : 30000
      setShippingPrice(calculatedShipping)
    }
  }, [orderItems, itemsPrice, navigate])

  const handleChangeAddress = () => {
    navigate('/address', { state: { from: '/payment' } });
  }

  // --- HÀM XỬ LÝ MÃ GIẢM GIÁ ---
  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    // 1. Lấy Token từ LocalStorage (Giống hệt logic trong onFinish)
    let token = localStorage.getItem('access_token');
    if (token && typeof token === 'string') {
      if (token.startsWith('"') && token.endsWith('"')) token = token.slice(1, -1);
    }

    // Nếu không có token -> Báo lỗi đăng nhập
    if (!token) {
      message.error("Vui lòng đăng nhập để sử dụng mã giảm giá!");
      return;
    }

    try {
      // 2. Gọi API validate có kèm Header Token
      const res = await axios.post(
        `${API_URL}/api/coupons/validate`,
        {
          code: couponCode,
          orderValue: itemsPrice
        },
        {
          headers: {
            token: `Bearer ${token}`, 
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.status === 'OK') {
        const { calculatedDiscount } = res.data.data;
        setCouponDiscount(calculatedDiscount);
        setAppliedCoupon(res.data.data);
        message.success(`Áp dụng mã thành công! Giảm ${calculatedDiscount.toLocaleString()}đ`);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Mã giảm giá không hợp lệ';
      message.error(msg);

      setCouponDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setAppliedCoupon(null);
  };

  const parseJwt = (token) => {
    try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
  };

  const onFinish = async (values) => {
    console.log("Dữ liệu orderItems gửi đi:", orderItems);

    let token = localStorage.getItem('access_token');
    if (token && typeof token === 'string') {
      if (token.startsWith('"') && token.endsWith('"')) token = token.slice(1, -1);
    }

    let userId = null;
    if (token) {
      const decoded = parseJwt(token);
      if (decoded?.id) userId = decoded.id;
      else if (decoded?._id) userId = decoded._id;
    }

    if (!userId) {
      message.error("Vui lòng đăng nhập lại!");
      navigate('/sign-in');
      return;
    }

    const emailFinal = values.email;

    if (!emailFinal) {
      message.error("Vui lòng nhập Email để nhận thông báo đơn hàng!");
      return;
    }

    const orderInfo = {
      orderItems: orderItems,
      shippingAddress: {
        fullName: values.fullName,
        address: values.address,
        city: values.city,
        phone: values.phone
      },
      paymentMethod,
      itemsPrice,
      shippingPrice: shippingPrice,

      //Gửi giá cuối và thông tin mã giảm giá
      totalPrice: finalTotalPrice,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      discountPrice: couponDiscount,

      user: userId,
      email: emailFinal,
      isPaid: false,
      isDelivered: false
    }

    const config = {
      headers: {
        token: `Bearer ${token}`,
        Authorization: `Bearer ${token}`
      }
    };

    if (paymentMethod === 'vnpay') {
      localStorage.setItem('PENDING_ORDER', JSON.stringify(orderInfo));
      try {
        message.loading({ content: 'Đang kết nối VNPAY...', key: 'payment_loading' });
        const { data } = await axios.post(
          `${API_URL}/api/payment/create_payment_url`,
          {
            amount: finalTotalPrice, // Gửi giá cuối cùng qua VNPAY
            bankCode: '',
            language: 'vn',
            orderDescription: `Thanh toan don hang ${values.fullName}`,
            orderType: 'billpayment',
            email: emailFinal
          },
          config
        );
        if (data?.url) window.location.href = data.url;
      } catch (error) {
        console.error(error);
        message.error({ content: 'Lỗi hệ thống VNPAY!', key: 'payment_loading' });
      }
    }
    else {
      // COD
      try {
        const res = await axios.post(`${API_URL}/api/order/create`, orderInfo, config);

        if (res.data.status === 'OK' || res.status === 200 || res.status === 201) {
          message.success('Đặt hàng thành công!');
          localStorage.removeItem('PENDING_ORDER');
          dispatch(resetCart());
          navigate('/order-success', {
            state: {
              paymentMethod: 'cod',
              order: orderInfo
            }
          });
        } else {
          message.error(res.data.message || 'Đặt hàng thất bại');
        }
      } catch (e) {
        console.error("Lỗi COD:", e);
        const errorMsg = e.response?.data?.message || e.message;
        message.error('Lỗi đặt hàng: ' + errorMsg);
      }
    }
  }

  if (!orderItems || orderItems.length === 0) return null;

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh', paddingBottom: '40px' }}>
      <WrapperContainer>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Thanh toán</h2>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ city: 'Hồ Chí Minh' }}>
          <Row gutter={16}>
            <Col span={16}>
              <WrapperLeft>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <EnvironmentOutlined style={{ color: '#326e51' }} /> Thông tin giao hàng
                    </h3>
                    <span onClick={handleChangeAddress} style={{ color: '#3d6ef7', cursor: 'pointer', fontWeight: '500' }}>Thay đổi</span>
                  </div>

                  <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '6px', border: '1px solid #cceeff', marginBottom: '20px' }}>
                    <div style={{ fontWeight: 'bold', color: '#333', fontSize: '15px', marginBottom: '5px' }}>
                      {stateUserDetails.name}
                      {stateUserDetails.phone && <span style={{ fontWeight: 'normal', color: '#666' }}> ({stateUserDetails.phone})</span>}
                    </div>
                    <div style={{ color: '#555', lineHeight: '1.5' }}>
                      {stateUserDetails.address || <span style={{ color: '#ff4d4f' }}>Vui lòng thêm địa chỉ giao hàng</span>}
                    </div>
                  </div>

                  <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                    <Input size="large" placeholder="Nhập họ tên" />
                  </Form.Item>

                  <Form.Item
                    label="Email (Để nhận thông báo)"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập Email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input size="large" placeholder="Nhập email của bạn (vd: abc@gmail.com)" />
                  </Form.Item>

                  <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}>
                    <Input size="large" placeholder="Nhập SĐT" />
                  </Form.Item>
                  <Form.Item label="Địa chỉ nhận hàng" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                    <Input.TextArea size="large" rows={2} placeholder="Địa chỉ cụ thể" />
                  </Form.Item>
                  <Form.Item label="Ghi chú đơn hàng" name="note">
                    <Input.TextArea size="large" rows={2} placeholder="Ghi chú thêm (nếu có)" />
                  </Form.Item>

                  {/* --- [MỚI] KHU VỰC NHẬP MÃ GIẢM GIÁ --- */}
                  <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                    <div style={{ fontWeight: '500', marginBottom: '10px' }}>Mã giảm giá</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Input
                        size="large"
                        placeholder="Nhập mã giảm giá (VD: SALE50)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon} // Khóa ô nhập nếu đã apply
                      />
                      {appliedCoupon ? (
                        <Button size="large" danger onClick={handleRemoveCoupon}>Bỏ chọn</Button>
                      ) : (
                        <Button size="large" type="primary" onClick={handleApplyCoupon} style={{ background: '#326e51' }}>Áp dụng</Button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <div style={{ marginTop: '10px', color: '#00d165', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Tag color="success">{appliedCoupon.code}</Tag>
                        <span>Đã giảm {couponDiscount.toLocaleString()}đ</span>
                      </div>
                    )}
                  </div>
                  {}

                  <Form.Item name="city" style={{ display: 'none' }}><Input /></Form.Item>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCardOutlined style={{ color: '#326e51' }} /> Phương thức thanh toán
                  </h3>
                  <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%' }}>
                    <WrapperMethod><Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio></WrapperMethod>
                    <WrapperMethod>
                      <Radio value="vnpay">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <WalletOutlined style={{ color: '#005ba6', fontSize: '24px' }} />
                          <span>Thanh toán qua VNPAY</span>
                        </div>
                      </Radio>
                    </WrapperMethod>
                  </Radio.Group>
                </div>
              </WrapperLeft>
            </Col>

            <Col span={8}>
              <WrapperRight>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Đơn hàng</h3>

                {/* --- SỬA PHẦN TỔNG KẾT --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666' }}>
                  <span>Tạm tính</span>
                  <span>{itemsPrice?.toLocaleString()}đ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666' }}>
                  <span>Phí vận chuyển</span>
                  <span>{shippingPrice?.toLocaleString()}đ</span>
                </div>

                {/* Hiển thị dòng giảm giá nếu có */}
                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#00d165' }}>
                    <span>Giảm giá</span>
                    <span>- {couponDiscount?.toLocaleString()}đ</span>
                  </div>
                )}

                <WrapperTotal>
                  <span>Tổng cộng</span>
                  <span style={{ color: '#ff424e', fontSize: '24px', fontWeight: 'bold' }}>
                    {finalTotalPrice?.toLocaleString('vi-VN')}đ
                  </span>
                </WrapperTotal>
                {}

                <Button type="primary" htmlType="submit" size="large" style={{ width: '100%', marginTop: '20px', background: '#326e51', borderColor: '#326e51' }}>
                  {paymentMethod === 'vnpay' ? 'Thanh toán VNPAY' : 'Đặt hàng'}
                </Button>
              </WrapperRight>
            </Col>
          </Row>
        </Form>
      </WrapperContainer>
    </div>
  )
}
export default PaymentPage