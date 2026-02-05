import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import defaultAvatar from '../../assets/img/avatar.jpg';
import {
  HeaderContainer,
  HeaderLeft,
  UserMenu,
  UserDropdown
} from './style';

const Header = ({ onToggleSidebar, className }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
      <HeaderContainer className={className || ''}>
      <HeaderLeft>
        {/* <ToggleButton onClick={handleToggleSidebar} aria-label="Toggle sidebar">
          <i className="fas fa-bars"></i>
        </ToggleButton> */}
      </HeaderLeft>
      <UserMenu>
          <UserDropdown>
            <button className="dropdown-toggle" type="button" onClick={handleToggleDropdown} aria-expanded={isDropdownOpen}>
              <span className="user-img">
                <img
                  src={user?.avatar || defaultAvatar}
                  alt={user?.fullname || 'Admin'}
                />
              </span>
            </button>
            <div className={`dropdown-menu${isDropdownOpen ? ' show' : ''}`}>
              <div className="user-header">
                <h6>{user?.fullname || 'Admin User'}</h6>
                <p>{user?.role || 'admin'}</p>
              </div>
              <button className="dropdown-item" type="button" onClick={logout}>Logout</button>
            </div>
          </UserDropdown>
        </UserMenu>
      
    </HeaderContainer>
  );
};

export default Header;