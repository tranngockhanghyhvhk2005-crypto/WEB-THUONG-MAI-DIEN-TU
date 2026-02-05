import React, { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
  WrapperInputStyle,
  WrapperButtonStyle
} from './style'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { message } from 'antd'
import { useDispatch } from 'react-redux';
import { setCart } from '../../redux/slides/cartSlice';
import { updateUser } from '../../redux/slides/userSlice';
import axiosClient from '../../apis/axiosClient';

const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }

  const handleNavigateForgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      message.error('Vui lòng nhập email và mật khẩu')
      return
    }

    try {
      // 1. Gọi API Login
      const response = await axios.post(
        'http://localhost:8080/api/users/login', 
        { email, password }
      )

      if (response.data && (response.data.token || response.data.access_token)) {
        message.success('Đăng nhập thành công!')

        // 2. Lưu Token
        const token = response.data.token || response.data.access_token;
        localStorage.setItem('access_token', token)

        // 3. Lưu thông tin User vào LocalStorage & Redux
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          // Cập nhật Redux userSlice để App.js nhận diện được user đang login
          dispatch(updateUser(response.data.user)); 
        }

        // 4. Lấy giỏ hàng đã lưu từ Database đổ về Redux
        try {
          const cartRes = await axiosClient.get('/api/users/get-cart'); 
          if (cartRes.data.success) {
            dispatch(setCart(cartRes.data.cartItems));
          }
        } catch (e) {
          console.log('Không tải được giỏ hàng cũ hoặc lỗi server');
        }

        // 5. Điều hướng
        if (location.state && location.state.from) {
          navigate(location.state.from);
        } else if (location.state && typeof location.state === 'string') {
          navigate(location.state);
        } else {
          navigate('/');
        }
      } else {
        message.error('Lỗi đăng nhập: Không nhận được dữ liệu người dùng.')
      }
    } catch (error) {
      if (error.response && error.response.status === 403 && error.response.data.isBlocked) {
        navigate('/account-locked');
      } else {
        console.error('Lỗi đăng nhập:', error)
        message.error(error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu.')
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập hoặc Tạo tài khoản</p>
          <WrapperInputStyle placeholder="abc@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div style={{ position: 'relative' }}>
            <span onClick={() => setShowPassword(!showPassword)} style={{ zIndex: 10, position: 'absolute', top: '4px', right: '8px', cursor: 'pointer' }}>
              {showPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <WrapperInputStyle placeholder="Mật khẩu" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <WrapperButtonStyle disabled={!email.length || !password.length} onClick={handleSignIn}>Đăng nhập</WrapperButtonStyle>
          <p style={{ fontSize: '13px', color: '#326e51', cursor: 'pointer' }} onClick={handleNavigateForgotPassword}>Quên mật khẩu?</p>
          <p style={{ fontSize: '13px' }}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <div style={{ width: '203px', height: '203px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <svg width="120" height="120" viewBox="64 64 896 896" style={{ fill: '#326e51' }}><path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z" /></svg>
          </div>
          <h4>Mua sắm tại BeautyCosmetic</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage