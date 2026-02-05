import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WrapperContainer, WrapperContent, WrapperSidebar, WrapperMainContent } from '../ProfilePage/style';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import { WrapperTabs, WrapperOrderCard, WrapperOrderHeader, OrderStatus, WrapperProductItem, ProductInfo, ProductName, ProductQuantity, WrapperOrderFooter, TotalPrice } from './style';
import axios from 'axios';
import { message, Button, Popconfirm, Tag } from 'antd';
import ReviewModal from '../../components/ModalComponent/ReviewModal';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenReview, setIsOpenReview] = useState(false);
    const [reviewData, setReviewData] = useState({ productInfo: null, orderId: null });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const fetchMyOrders = async () => {
        setIsLoading(true);
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (!userString || !token) {
            navigate('/sign-in');
            return;
        }

        const user = JSON.parse(userString);
        const userId = user.id || user._id;
        
        let cleanToken = token.startsWith('"') ? token.slice(1, -1) : token;

        try {
            const res = await axios.get(`${API_URL}/api/order/get-all-order/${userId}`, {
                headers: { Authorization: `Bearer ${cleanToken}` }
            });
            if (res.data.status === 'OK') setOrders(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, [navigate, API_URL]);

    const handleCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('access_token');
            let cleanToken = token.startsWith('"') ? token.slice(1, -1) : token;

            const res = await axios.delete(`${API_URL}/api/order/cancel-order/${orderId}`, {
                headers: { Authorization: `Bearer ${cleanToken}` }
            });

            if (res.data.status === 'OK') {
                message.success('Đã hủy đơn hàng!');
                fetchMyOrders();
            } else {
                message.error(res.data.message);
            }
        } catch (e) {
            message.error('Lỗi hủy đơn');
        }
    };

    // --- SỬA LẠI: HÀM NÀY NHẬN ITEM VÀ ORDER_ID ---
    const handleReview = (item, orderId) => {
        setReviewData({
            productInfo: {
                id: item.product || item._id,
                name: item.name,
                image: item.image,
                variantName: item.variantName
            },
            orderId: orderId
        });
        setIsOpenReview(true);
    };

    const handleBuyAgain = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    const handleReviewSuccess = () => {
        fetchMyOrders();
    };

    const getOrderStatusText = (order) => {
        switch (order.status) {
            case 'Pending': return <Tag color="orange">Đang chờ xử lý</Tag>;
            case 'Confirmed': return <Tag color="blue">Đã xác nhận</Tag>;
            case 'Shipped': return <Tag color="cyan">Đang vận chuyển</Tag>;
            case 'Delivered': return <Tag color="green">Giao hàng thành công</Tag>;
            case 'Cancelled': return <Tag color="red">Đã hủy</Tag>;
            default: return <Tag>{order.status}</Tag>;
        }
    };

    const renderOrders = (orderList) => {
        if (isLoading) return <p style={{textAlign: 'center', marginTop: 20}}>Đang tải...</p>;
        if (!orderList?.length) return <p style={{textAlign: 'center', marginTop: 20}}>Chưa có đơn hàng nào.</p>;

        return orderList.map(order => (
            <WrapperOrderCard key={order._id}>
                <WrapperOrderHeader>
                    <span>Mã đơn: <b>#{order._id.substring(0, 8).toUpperCase()}</b></span>
                    <OrderStatus>{getOrderStatusText(order)}</OrderStatus>
                </WrapperOrderHeader>

                {}
                {order.orderItems?.map((item) => (
                    <WrapperProductItem key={item._id || item.product}>
                        <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid #eee' }}
                            />
                            <ProductInfo>
                                <ProductName>{item.name}</ProductName>
                                {item.variantName && <div style={{ fontSize: '12px', color: '#888' }}>Phân loại: {item.variantName}</div>}
                                <ProductQuantity>x {item.amount || item.quantity}</ProductQuantity>
                                <div style={{ color: '#ff424e', fontWeight: 500 }}>
                                    {item.price?.toLocaleString('vi-VN')}đ
                                </div>
                            </ProductInfo>
                        </div>

                        {}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '100px', alignItems: 'flex-end' }}>
                            {}
                            {order.status === 'Delivered' && (
                                !item.isReviewed ? (
                                    <Button 
                                        size="middle"
                                        onClick={() => handleReview(item, order._id)}
                                        style={{ borderColor: '#fadb14', color: '#d48806' }}
                                    >
                                        Viết đánh giá
                                    </Button>
                                ) : (
                                    <Button 
                                        size="middle" 
                                        type="primary" 
                                        ghost
                                        onClick={() => handleBuyAgain(item.product)}
                                    >
                                        Mua lại
                                    </Button>
                                )
                            )}

                            {/* Case 2: Đã hủy -> Nút Mua lại */}
                            {order.status === 'Cancelled' && (
                                <Button 
                                    size="middle"
                                    onClick={() => handleBuyAgain(item.product)}
                                >
                                    Mua lại
                                </Button>
                            )}
                        </div>
                    </WrapperProductItem>
                ))}

                <WrapperOrderFooter>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                            <span style={{color: '#555'}}>Tổng tiền: </span>
                            <TotalPrice>{order.totalPrice?.toLocaleString('vi-VN')}đ</TotalPrice>
                        </div>

                        {}
                        
                        {}
                        {order.status === 'Pending' && (
                            <Popconfirm
                                title="Hủy đơn hàng?"
                                description="Bạn chắc chắn muốn hủy đơn này?"
                                onConfirm={() => handleCancelOrder(order._id)}
                                okText="Đồng ý"
                                cancelText="Không"
                            >
                                <Button danger type="primary">Hủy đơn hàng</Button>
                            </Popconfirm>
                        )}
                    </div>
                </WrapperOrderFooter>
            </WrapperOrderCard>
        ));
    };

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar><ProfileSidebar /></WrapperSidebar>
                <WrapperMainContent>
                    <h2>Đơn Mua của tôi</h2>
                    <WrapperTabs defaultActiveKey="1">
                        <WrapperTabs.TabPane tab="Tất cả" key="1">{renderOrders(orders)}</WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Đang xử lý" key="2">{renderOrders(orders.filter(o => ['Pending', 'Confirmed', 'Shipped'].includes(o.status)))}</WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Hoàn thành" key="3">{renderOrders(orders.filter(o => o.status === 'Delivered'))}</WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Đã hủy" key="4">{renderOrders(orders.filter(o => o.status === 'Cancelled'))}</WrapperTabs.TabPane>
                    </WrapperTabs>
                </WrapperMainContent>
            </WrapperContent>

            <ReviewModal 
                isOpen={isOpenReview}
                onCancel={() => setIsOpenReview(false)}
                onSuccess={handleReviewSuccess}
                productInfo={reviewData.productInfo}
                orderId={reviewData.orderId}
                token={localStorage.getItem('access_token')}
            />
        </WrapperContainer>
    );
};

export default MyOrdersPage;