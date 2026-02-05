import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import {
  SidebarContainer,
  SidebarInner,
  SidebarMenu,
  MenuList,
  MenuTitle,
  MenuItem,
  SidebarTop,
  SidebarFooter,
  ToggleBtn,
  SidebarLogo
} from './style';

// onToggle
const Sidebar = ({ isCondensed, onToggle }) => {
  return (
    <SidebarContainer className={isCondensed ? 'condensed' : ''}>
      <SidebarTop>
        <ToggleBtn type="button" aria-label="Toggle sidebar" onClick={() => onToggle && onToggle()}>
          <i className="fa-solid fa-bars"></i>
        </ToggleBtn>
        <SidebarLogo>
          <NavLink to="/admin/">
            <img src={logo} alt="logo" />
            <span className="logo-text">Admin</span>
          </NavLink>
        </SidebarLogo>
      </SidebarTop>

      <SidebarInner>
        <SidebarMenu>
          <MenuList>
            <MenuTitle className="menu-title"><span>Main Menu</span></MenuTitle>
            <MenuItem>
              <NavLink to="/admin/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-home"></i> <span>Dashboard</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-list-alt"></i> <span>Categories</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/brands" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fa-brands fa-font-awesome"></i> <span>Brands</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-box"></i> <span>Products</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-shipping-fast"></i> <span>Orders</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-users"></i> <span>Users</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/coupons" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-tags"></i> <span>Coupons</span>
              </NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
                <i className="fas fa-comments"></i> <span>Feedback</span>
              </NavLink>
            </MenuItem>
          </MenuList>
        </SidebarMenu>
      </SidebarInner>

      <SidebarFooter>
        <button type="button" className="sidebar-link" onClick={() => {}}>
          <i className="fa-solid fa-right-from-bracket fa-rotate-180"></i>
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;