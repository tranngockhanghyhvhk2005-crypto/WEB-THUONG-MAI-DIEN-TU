import React, { useState } from 'react';
import { WrapperInputStyle, WrapperButtonStyle } from '../SignInPage/style'; 
import { WrapperContainer, Title } from './style'; 
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendRequest = async () => {
        if (!email) {
            alert('Vui lòng nhập email của bạn.');
            return;
        }
        setLoading(true);
        try {
            //TẠO API Ở BACKEND
            const response = await axios.post('http://localhost:8080/api/users/forgot-password', { email });
            alert(response.data.message || 'Nếu email tồn tại, một link khôi phục đã được gửi.');
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccc', height: '100vh' }}>
            <WrapperContainer>
                <Title>Quên mật khẩu</Title>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                    Vui lòng nhập email của bạn để nhận link khôi phục.
                </p>

                <WrapperInputStyle 
                    placeholder="abc@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <WrapperButtonStyle
                    disabled={!email.length || loading}
                    onClick={handleSendRequest}
                    style={{ marginTop: '20px', width: '100%' }}
                >
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </WrapperButtonStyle>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/sign-in" style={{color: '#326e51', fontWeight: 500}}>Quay lại Đăng nhập</Link>
                </div>
            </WrapperContainer>
        </div>
    );
};

export default ForgotPasswordPage;