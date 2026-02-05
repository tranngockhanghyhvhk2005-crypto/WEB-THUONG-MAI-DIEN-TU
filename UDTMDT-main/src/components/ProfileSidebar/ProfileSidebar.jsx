import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import {
  SidebarWrapper,
  MenuTitle,
  MenuList,
  MenuItem,
  UserInfoWrapper,
  UserName,
  UserEmail
} from './style';

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userString = localStorage.getItem('user');
    try {
      setUser(userString ? JSON.parse(userString) : {});
    } catch {
      setUser({});
    }

    // Lắng nghe custom event userUpdated từ AccountInfoPage
    const handleUserUpdated = (event) => {
      console.log('ProfileSidebar received userUpdated event:', event.detail);
      setUser(event.detail);
    };

    // Lắng nghe sự kiện storage (khi cập nhật từ tab khác)
    const handleStorageChange = () => {
      const updatedUserString = localStorage.getItem('user');
      try {
        setUser(updatedUserString ? JSON.parse(updatedUserString) : {});
      } catch {
        setUser({});
      }
    };

    window.addEventListener('userUpdated', handleUserUpdated);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const displayName =
    user?.firstName ||
    user?.name ||
    (user?.lastName ? `${user?.lastName}` : 'Thành viên');

  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar;

  const menuItems = [
    { key: '/profile', label: 'Tài khoản của tôi' },
    { key: '/my-orders', label: 'Lịch sử mua hàng' },
    { key: '/address', label: 'Sổ địa chỉ' },
    { key: '/wishlist', label: 'Danh sách yêu thích' },
    { key: '/account-info', label: 'Thông tin tài khoản' }
  ];

  return (
    <SidebarWrapper>
      <UserInfoWrapper>
        <Avatar
          size={64}
          src={displayAvatar}
          icon={!displayAvatar && <UserOutlined />}
          style={{ marginBottom: '10px' }}
        />
        <UserName>{displayName}</UserName>
        <UserEmail>{displayEmail}</UserEmail>
      </UserInfoWrapper>

      <MenuList>
        <MenuTitle>Tài khoản</MenuTitle>
        {menuItems.map(item => (
          <MenuItem
            key={item.key}
            className={location.pathname === item.key ? 'active' : ''}
            onClick={() => navigate(item.key)}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </SidebarWrapper>
  );
};

export default ProfileSidebar;
