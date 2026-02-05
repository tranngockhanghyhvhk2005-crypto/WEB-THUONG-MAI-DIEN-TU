import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import axiosClient from './apis/axiosClient' 
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import 'antd/dist/reset.css'

// 1. Import các trang
import HomePage from './pages/HomePage/HomePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import AccountInfoPage from './pages/AccountInfoPage/AccountInfoPage'
import AddressPage from './pages/AddressPage/AddressPage'
import ProductsPage from './pages/ProductsPage/ProductsPage'
import WishlistPage from './pages/WishlistPage/WishlistPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import SignInPage from './pages/SignInPage/SignInPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import OrderPage from './pages/OrderPage/OrderPage'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage'
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage'
import SearchPage from './pages/SearchPage/SearchPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import AdminApp from './admin_pages/AdminApp'
import AccountLockedPage from './pages/AccountLockedPage/AccountLockedPage'
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage'

// 2. Định nghĩa các routes
const userRoutes = [
    { path: '/', page: HomePage, isShowHeader: true },
    { path: '/profile', page: ProfilePage, isShowHeader: true },
    { path: '/account-info', page: AccountInfoPage, isShowHeader: true },
    { path: '/address', page: AddressPage, isShowHeader: true },
    { path: '/products', page: ProductsPage, isShowHeader: true },
    { path: '/wishlist', page: WishlistPage, isShowHeader: true },
    { path: '/sign-up', page: SignUpPage, isShowHeader: false },
    { path: '/sign-in', page: SignInPage, isShowHeader: false },
    { path: '/forgot-password', page: ForgotPasswordPage, isShowHeader: false },
    { path: '/reset-password/:token', page: ResetPasswordPage, isShowHeader: false },

    { path: '/product-details/:id', page: ProductDetailPage, isShowHeader: true }, 
    { path: '/order', page: OrderPage, isShowHeader: true },
    { path: '/payment', page: PaymentPage, isShowHeader: true },
    { path: '/my-orders', page: MyOrdersPage, isShowHeader: true },
    { path: '/change-password', page: ChangePasswordPage, isShowHeader: true },
    { path: '/search', page: SearchPage, isShowHeader: true },
    { path: '/order-success', page: OrderSuccessPage, isShowHeader: true },

    { path: '*', page: NotFoundPage, isShowHeader: false },
    { path: '/account-locked', page: AccountLockedPage, isShowHeader: false },
];

function App() {
  // --- TỰ ĐỘNG LƯU GIỎ HÀNG ---
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    // Hàm xử lý lưu giỏ hàng
    const saveCartToDatabase = async () => {
      // Lấy user ID từ Redux hoặc LocalStorage
      const storedUser = localStorage.getItem('user');
      const userId = user?.id || (storedUser ? JSON.parse(storedUser)._id : null);
      
      // Chỉ lưu khi đã đăng nhập và có item trong giỏ
      if (userId && cart.items) {
        const cartItemsPayload = cart.items.map((item) => ({
          product: item.product,        
          name: item.name,
          image: item.image,
          price: item.price,
          amount: item.quantity,        
          originalPrice: item.originalPrice,
          discount: item.discount,
          variationSku: item.variationSku || item.variantName, 
          stockQuantity: item.stockQuantity
        }));

        try {
          // Gọi API update-cart
          await axiosClient.put('/api/users/update-cart', { cartItems: cartItemsPayload });
        } catch (error) {
          console.error('Lỗi auto-save cart:', error);
        }
      }
    };

    // Chờ 1 giây sau khi thao tác xong mới gọi API để tránh spam server
    const timeoutId = setTimeout(() => {
      saveCartToDatabase();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cart.items, user]); 

  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* User routes */}
        {userRoutes.map((route) => {
          const Page = route.page
          const Layout = route.isShowHeader ? DefaultComponent : Fragment 
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={
                <Layout>
                  <Page />
                </Layout>
              } 
            />
          )
        })}
      </Routes>
    </Router>
  )
}

export default App