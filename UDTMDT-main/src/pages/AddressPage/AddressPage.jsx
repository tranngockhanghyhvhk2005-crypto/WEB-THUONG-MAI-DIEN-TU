import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch } from 'react-redux'; 
import { updateUser } from '../../redux/slides/userSlice'; 

import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import {
    WrapperContainer, WrapperContent, WrapperSidebar, WrapperMainContent, PageTitle
} from '../ProfilePage/style';
import {
    AddressHeader, AddButton, AddressList, AddressItem, AddressInfo, AddressName, AddressDetails, AddressActions, DefaultBadge
} from './style';
import { Spin, message, Popconfirm, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axiosClient from '../../apis/axiosClient';
import AddAddressModal from '../../components/AddAddressModal/AddAddressModal';

const AddressPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const dispatch = useDispatch(); 

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    const goBack = () => {
        if (location.state && location.state.from) {
            navigate(location.state.from);
        } else {
            navigate('/profile'); 
        }
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setUserInfo({
                name: user.name || user.firstName || "Người dùng",
                phone: user.phone || "Chưa cập nhật SĐT"
            });
        }
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/users/profile');
            if (response.data.success) {
                setAddresses(response.data.data.addresses || []);
                
                // Cập nhật Redux (nếu import đúng)
                try {
                    dispatch(updateUser({
                        ...response.data.data,
                        access_token: localStorage.getItem('access_token')
                    }));
                } catch (e) { console.warn("Chưa import đúng userSlice"); }
            }
        } catch (error) {
            console.error('Lỗi tải địa chỉ:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsModalVisible(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsModalVisible(true);
    };

    const handleAddressAdded = async () => {
        setIsModalVisible(false);
        await fetchAddresses();
    };

    const handleSetDefaultAndReturn = async (addr) => {
        try {
            message.loading({ content: 'Đang cập nhật...', key: 'setdefault' });
            await axiosClient.put(`/api/users/address/${addr._id}`, { ...addr, isDefault: true });
            message.success({ content: 'Đã chọn địa chỉ này!', key: 'setdefault' });
            
            await fetchAddresses(); 
            
            setTimeout(() => goBack(), 500); 
        } catch (error) {
            message.error({ content: 'Lỗi cập nhật', key: 'setdefault' });
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            message.loading({ content: 'Đang xóa...', key: 'deleting' });
            const res = await axiosClient.delete(`/api/users/address/${id}`);
            if (res?.data?.success) {
                message.success({ content: 'Đã xóa địa chỉ thành công', key: 'deleting' });
                fetchAddresses(); 
            } else {
                message.error({ content: res?.data?.message || 'Xóa thất bại', key: 'deleting' });
            }
        } catch (error) {
            message.error({ content: 'Lỗi khi xóa địa chỉ', key: 'deleting' });
        }
    };

    if (loading) return (<div style={{padding: 50, textAlign: 'center'}}><Spin size="large"/></div>);

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar><ProfileSidebar /></WrapperSidebar>
                <WrapperMainContent>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        {location.state?.from && (
                            <Button icon={<ArrowLeftOutlined />} onClick={goBack} shape="circle" />
                        )}
                        <PageTitle style={{margin: 0}}>Sổ địa chỉ</PageTitle>
                    </div>

                    <AddressHeader>
                        <AddButton onClick={handleAddAddress}>Thêm địa chỉ mới</AddButton>
                    </AddressHeader>

                    <AddressList>
                        {addresses.length === 0 ? <p>Chưa có địa chỉ nào.</p> : addresses.map(addr => (
                            <AddressItem key={addr._id} style={{ border: addr.isDefault ? '1px solid #326e51' : '1px solid #e5e5e5' }}>
                                <AddressInfo>
                                    <AddressName>
                                        {userInfo.name} {addr.isDefault && <DefaultBadge>Mặc định</DefaultBadge>}
                                    </AddressName>
                                    <AddressDetails>
                                        <span>Địa chỉ:</span> {`${addr.specificAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`}
                                    </AddressDetails>
                                    <AddressDetails>
                                        <span>Điện thoại:</span> {userInfo.phone}
                                    </AddressDetails>

                                    {!addr.isDefault && (
                                        <div style={{ marginTop: '10px' }}>
                                            {location.state?.from ? (
                                                <Button type="primary" size="small" onClick={() => handleSetDefaultAndReturn(addr)}>
                                                    Giao đến địa chỉ này
                                                </Button>
                                            ) : (
                                                <Button type="link" size="small" onClick={() => handleSetDefaultAndReturn(addr)} style={{paddingLeft: 0}}>
                                                    Đặt làm mặc định
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </AddressInfo>
                                <AddressActions>
                                    <a onClick={() => handleEditAddress(addr)} style={{ marginRight: 10, color: '#1890ff' }}>Sửa</a>
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa?"
                                        onConfirm={() => handleDeleteAddress(addr._id)}
                                        okText="OK"
                                        cancelText="Hủy"
                                    >
                                        <a style={{ color: 'red' }}>Xóa</a>
                                    </Popconfirm>
                                </AddressActions>
                            </AddressItem>
                        ))}
                    </AddressList>
                </WrapperMainContent>
            </WrapperContent>

            <AddAddressModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onAddressAdded={handleAddressAdded}
                addressToEdit={editingAddress}
            />
        </WrapperContainer>
    );
};

export default AddressPage;