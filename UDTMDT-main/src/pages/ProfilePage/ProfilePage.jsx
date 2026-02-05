import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import axios from 'axios'; 

import {
    WrapperContainer,
    WrapperContent,
    WrapperSidebar,
    WrapperMainContent,
    PageTitle,
    Box,
    BoxHeader,
    BoxTitle,
    BoxAction,
    BoxContent,
    InfoRow,
    InfoLabel,
    InfoValue
} from './style';

const ProfilePage = () => {
    const navigate = useNavigate();

    // --- State ---
    const [userData, setUserData] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    // --- useEffect gọi API khi load page ---
    useEffect(() => {
        const fetchData = async () => {
            const userString = localStorage.getItem('user');

            // Nếu chưa login -> redirect về sign-in
            if (!userString) {
                navigate('/sign-in');
                return;
            }

            // Lấy data từ localStorage trước
            setUserData(JSON.parse(userString));

            // === 1. LẤY TOKEN VÀ LÀM SẠCH ===
            let token = localStorage.getItem('access_token');
            if (token && typeof token === 'string') {
                if (token.startsWith('"') && token.endsWith('"')) {
                    token = token.slice(1, -1);
                }
            }

            if (!token) {
                navigate('/sign-in');
                return;
            }

            // === 2. CẤU HÌNH HEADER THỦ CÔNG ===
            const config = {
                headers: {
                    token: `Bearer ${token}`,
                    Authorization: `Bearer ${token}`
                }
            };

            // --- Fetch profile từ backend ---
            setIsLoadingAddress(true);
            try {
                console.log('Đang gọi API lấy profile...');
                // Gọi trực tiếp URL backend 
                const response = await axios.get('http://localhost:8080/api/users/profile', config);

                if (response.data?.success) {
                    const userProfile = response.data.data || {};
                    const listAddress = userProfile.addresses || [];

                    console.log('Danh sách địa chỉ:', listAddress);

                    // Tìm địa chỉ mặc định
                    const foundDefault = listAddress.find(addr => addr.isDefault === true);
                    setDefaultAddress(foundDefault);
                }
            } catch (error) {
                console.error('Lỗi lấy dữ liệu profile:', error);
                if (error.response?.status === 401) {
                    // Token hết hạn hoặc sai -> Logout luôn
                    localStorage.clear();
                    navigate('/sign-in');
                }
            } finally {
                setIsLoadingAddress(false);
            }
        };

        fetchData();
    }, [navigate]);

    // --- Loading state khi userData chưa có ---
    if (!userData) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải thông tin...</div>;
    }

    // --- Tên hiển thị ---
    const displayName =
        userData.name ||
        [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim();

    // --- Hàm render địa chỉ ---
    const renderAddressString = () => {
        if (isLoadingAddress) return 'Đang tải...';

        if (defaultAddress) {
            return `${defaultAddress.specificAddress || ''}, ${defaultAddress.ward || ''}, ${defaultAddress.district || ''}, ${defaultAddress.province || ''}`;
        }

        return 'Chưa thiết lập địa chỉ giao hàng mặc định.';
    };

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar>
                    <ProfileSidebar />
                </WrapperSidebar>

                <WrapperMainContent>
                    <PageTitle>Tài khoản của tôi</PageTitle>

                    {/* Thông tin tài khoản */}
                    <Box>
                        <BoxHeader>
                            <BoxTitle>Thông tin tài khoản</BoxTitle>
                            <BoxAction onClick={() => navigate('/account-info')}>
                                Chỉnh sửa
                            </BoxAction>
                        </BoxHeader>
                        <BoxContent>
                            {displayName && (
                                <InfoRow>
                                    <InfoValue style={{fontWeight: 'bold'}}>{displayName}</InfoValue>
                                </InfoRow>
                            )}
                            <InfoRow>
                                <InfoLabel>Email:</InfoLabel>
                                <InfoValue>{userData.email}</InfoValue>
                            </InfoRow>
                        </BoxContent>
                    </Box>

                    {/* Địa chỉ giao hàng */}
                    <Box>
                        <BoxHeader>
                            <BoxTitle>Sổ địa chỉ</BoxTitle>
                            <BoxAction onClick={() => navigate('/address')}>
                                Quản lý địa chỉ
                            </BoxAction>
                        </BoxHeader>
                        <BoxContent>
                            <InfoRow>
                                <InfoLabel>Địa chỉ giao hàng mặc định:</InfoLabel>
                                <InfoValue
                                    style={{
                                        fontWeight: defaultAddress ? '500' : 'normal',
                                        color: defaultAddress ? '#333' : '#999'
                                    }}
                                >
                                    {renderAddressString()}
                                </InfoValue>
                            </InfoRow>
                        </BoxContent>
                    </Box>
                </WrapperMainContent>
            </WrapperContent>
        </WrapperContainer>
    );
};

export default ProfilePage;