import React, { useState } from 'react';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import {
    WrapperContainerLeft,
    WrapperContainerRight,
    WrapperTextLight,
    WrapperInputStyle,
    WrapperButtonStyle
} from './style';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleNavigateSignIn = () => {
        navigate('/sign-in');
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        if (!firstName || !lastName || !email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/users/register', 
                {
                    firstName,
                    lastName,
                    email,
                    password
                }
            );

            if (response.status === 201 || response.status === 200) {
                alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            alert(error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#ccc', 
            height: '100vh' 
        }}>
            <div style={{ 
                width: '800px', 
                height: 'auto',
                padding: '20px 0',
                borderRadius: '6px', 
                backgroundColor: '#fff',
                display: 'flex',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' 
            }}>
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng ký tài khoản mới</p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <WrapperInputStyle 
                            placeholder="Họ (Last Name)" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ width: '100%' }}
                        />
                        <WrapperInputStyle 
                            placeholder="Tên (First Name)" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <WrapperInputStyle 
                        placeholder="abc@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '12px', 
                                right: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {showPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <WrapperInputStyle
                            placeholder="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '12px',
                                right: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {showConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <WrapperInputStyle
                            placeholder="Nhập lại mật khẩu"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <WrapperButtonStyle
                        disabled={!email.length || !password.length || !confirmPassword.length || !firstName.length || !lastName.length}
                        onClick={handleSignUp}
                    >
                        Đăng ký
                    </WrapperButtonStyle>

                    <p style={{ fontSize: '13px' }}>
                        Bạn đã có tài khoản? 
                        <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight>
                    </p>
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <div style={{
                        width: '203px',
                        height: '203px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <svg 
                            width="120" 
                            height="120" 
                            viewBox="64 64 896 896"
                            style={{ fill: '#326e51' }}
                        >
                            <path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z"/>
                        </svg>
                    </div>
                    <h4>Mua sắm tại BeautyCosmetic</h4>
                </WrapperContainerRight>
            </div>
        </div>
    );
}

export default SignUpPage;