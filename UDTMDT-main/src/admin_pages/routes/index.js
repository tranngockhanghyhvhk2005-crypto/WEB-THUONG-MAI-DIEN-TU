import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import PublicRoutes from '../utils/PublicRoutes';
import AdminLayout from '../layouts/AdminLayout';

// Import Pages
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import CategoryPage from '../pages/Category/CategoryPage';
import ProductPage from '../pages/Product/ProductPage';
import ProductAddPage from '../pages/ProductAdd/ProductAddPage';
import ProductEditPage from '../pages/ProductEditPage/ProductEditPage';
import OrderPage from '../pages/Order/OrderPage';
import OrderDetailPage from '../pages/Order/OrderDetailPage';
import UserPage from '../pages/User/UserPage';
import UserAddPage from '../pages/User/UserAddPage';
import UserEditPage from '../pages/User/UserEditPage';
import CouponPage from '../pages/Coupon/CouponPage';
import FeedbackPage from '../pages/Feedback/FeedbackPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import BrandPage from "../pages/Brand/BrandPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public (Login) */}
      {/* Các route này chỉ dành cho người dùng chưa đăng nhập */}
      <Route element={<PublicRoutes />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* ProtectedRoutes: Yêu cầu xác thực, sau đó bọc các trang bằng AdminLayout */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="brands" element={<BrandPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="product/add" element={<ProductAddPage />} />
          <Route path="product/edit/:id" element={<ProductEditPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="order/detail/:id" element={<OrderDetailPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="user/add" element={<UserAddPage />} />
          <Route path="user/edit/:id" element={<UserEditPage />} />
          <Route path="coupons" element={<CouponPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;