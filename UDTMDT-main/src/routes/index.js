import HomePage from "../pages/HomePage/HomePage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import OrderPage from "../pages/OrderPage/OrderPage"
import PaymentPage from "../pages/PaymentPage/PaymentPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import MyOrdersPage from "../pages/MyOrdersPage/MyOrdersPage"
import ChangePasswordPage from "../pages/ChangePasswordPage/ChangePasswordPage"
import SearchPage from "../pages/SearchPage/SearchPage"
import AccountLockedPage from '../pages/AccountLockedPage/AccountLockedPage';

import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage"

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/product-details/:id',
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/change-password',
        page: ChangePasswordPage,
        isShowHeader: true
    },
    {
        path: '/my-orders',
        page: MyOrdersPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true
    },


    {
        path: '/order-success',
        page: OrderSuccessPage,
        isShowHeader: true
    },

    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/search',
        page: SearchPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },
    {
        path: '/account-locked',
        page: AccountLockedPage,
        isShowHeader: false 
    },
]