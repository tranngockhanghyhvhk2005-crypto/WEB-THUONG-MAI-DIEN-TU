import React, { useState } from 'react';
import { WrapperInputStyle, WrapperButtonStyle } from '../SignInPage/style';
import { WrapperContainer, Title } from '../ForgotPasswordPage/style'; 

import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams(); 
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        if (!password) {
            alert('Vui lòng nhập mật khẩu mới.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/users/reset-password/${token}`, { password });
            alert(response.data.message || 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/sign-in');
        } catch (error) {
            alert(error.response?.data?.message || 'Link đã hết hạn hoặc không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc', height: '100vh' }}>
            <WrapperContainer>
                <Title>Tạo mật khẩu mới</Title>
                
                <WrapperInputStyle
                    placeholder="Mật khẩu mới"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />

                <WrapperInputStyle
                    placeholder="Xác nhận mật khẩu mới"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <WrapperButtonStyle
                    disabled={!password.length || !confirmPassword.length || loading}
                    onClick={handleResetPassword}
                    style={{ marginTop: '20px', width: '100%' }}
                >
                    {loading ? 'Đang lưu...' : 'Lưu mật khẩu'}
                </WrapperButtonStyle>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/sign-in" style={{color: '#326e51', fontWeight: 500}}>Quay lại Đăng nhập</Link>
                </div>
            </WrapperContainer>
        </div>
    );
};

export default ResetPasswordPage;