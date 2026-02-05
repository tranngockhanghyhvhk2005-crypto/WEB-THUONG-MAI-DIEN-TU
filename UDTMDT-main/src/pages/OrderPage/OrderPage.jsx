import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, InputNumber, Checkbox, message, Modal } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';

import { 
    updateQuantity, 
    removeFromCart, 
    toggleSelectItem, 
    toggleSelectAll 
} from '../../redux/slides/cartSlice';

import { getImageUrl } from '../../services/ProductService';

import {
    WrapperContainer, WrapperBody, WrapperLeftCol, WrapperRightCol,
    WrapperCartHeader, WrapperCartItem, ItemCheckbox, WrapperItemInfo,
    ItemName, ItemPrice, OriginalPrice, ItemQuantity, ItemTotalPrice, ItemAction,
    WrapperSummary, SummaryRow, WrapperTotal, TotalPriceText, CheckoutButton
} from './style';

const OrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [messageApi, contextHolderMessage] = message.useMessage();
    const [modal, contextHolderModal] = Modal.useModal();
    
    // Lấy user và cart từ Redux store
    // currentUser trong userSlice đã chứa object user (data)
    const user = useSelector(state => state.user.currentUser);
    const cart = useSelector(state => state.cart);

    // Tính toán tổng tiền và số lượng
    const { selectedItems, subtotal, totalItems, areAllSelected } = useMemo(() => {
        const selectedItems = cart.items.filter(item => item.selected);
        const subtotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalItems = selectedItems.length;
        const areAllSelected = cart.items.length > 0 && cart.items.every(item => item.selected);
        return { selectedItems, subtotal, totalItems, areAllSelected };
    }, [cart.items]);

    const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
    const total = subtotal + shippingFee;

    // --- XỬ LÝ ĐỊA CHỈ ---
    const deliveryAddress = useMemo(() => {
        if (!user) return '';
        
        let address = '';
        // Ưu tiên địa chỉ mặc định trong mảng addresses
        if (user.addresses && user.addresses.length > 0) {
            const defaultAddr = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
            if (defaultAddr) {
                const parts = [
                    defaultAddr.specificAddress, 
                    defaultAddr.ward, 
                    defaultAddr.district, 
                    defaultAddr.province
                ].filter(part => part);
                address = parts.join(', ');
            }
        } else if (user.address) {
            // Fallback
             address = user.address;
        }
        
        const name = user.name || user.firstName + ' ' + user.lastName;
        const phone = user.phone;
        
        if (address) {
            return `${name || ''} ${phone ? `(${phone})` : ''} - ${address}`;
        }
        return '';
    }, [user]);

    // --- CÁC HÀM XỬ LÝ ---
    const handleCheckAll = (e) => {
        dispatch(toggleSelectAll(e.target.checked));
    };

    const handleToggleItem = (productId) => {
        dispatch(toggleSelectItem(productId));
    };

    const handleChangeCount = (product, variantName, value) => {
        const item = cart.items.find(i => i.product === product && i.variantName === variantName);
        if(item && value >= 1 && value <= item.countInStock) {
            dispatch(updateQuantity({ product, variantName, quantity: value }));
        }
    };

    const handleRemoveItem = (product, variantName) => {
        modal.confirm({
            title: 'Xóa sản phẩm',
            content: 'Bạn có chắc muốn xóa sản phẩm này?',
            onOk: () => {
                dispatch(removeFromCart({ idProduct: product, variantName }));
                // SỬA: Dùng 'messageApi' từ hook
                messageApi.success('Đã xóa sản phẩm');
            }
        });
    };

    const handleRemoveAllSelected = () => {
        if(selectedItems.length === 0) return;
        
        modal.confirm({
            title: 'Xóa sản phẩm',
            content: `Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`,
            onOk: () => {
                selectedItems.forEach(item => {
                    dispatch(removeFromCart({ idProduct: item.product, variantName: item.variantName }));
                });
                messageApi.success('Đã xóa các sản phẩm đã chọn');
            }
        });
    };

    const handleCheckout = () => {
        if (!user) {
            message.info('Vui lòng đăng nhập để thanh toán');
            navigate('/sign-in', { state: { from: '/order' } });
            return;
        }
        
        if (selectedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
            return;
        }

        if (!deliveryAddress) {
            modal.confirm({
                title: 'Chưa có địa chỉ giao hàng',
                content: 'Vui lòng cập nhật địa chỉ giao hàng trước khi thanh toán.',
                okText: 'Cập nhật ngay',
                cancelText: 'Để sau',
                onOk: () => navigate('/profile'),
            });
            return;
        }

        navigate('/payment', { state: { items: selectedItems, subtotal, total, shippingFee } });
    };

    return (
        <WrapperContainer>
            {contextHolderMessage}
            {contextHolderModal}

            <div style={{ width: '1270px', margin: '0 auto' }}>
                 <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Giỏ hàng</h2>
            </div>
            
            <WrapperBody>
                <WrapperLeftCol span={17}>
                    <WrapperCartHeader>
                        <Checkbox style={{ width: '5%' }} onChange={handleCheckAll} checked={areAllSelected} />
                        <span style={{ width: '40%' }}>
                            Sản phẩm 
                            {selectedItems.length > 0 && (
                                <span style={{fontSize: '12px', color: '#ff4d4f', cursor: 'pointer', marginLeft: '10px'}} onClick={handleRemoveAllSelected}>
                                    (Xóa {selectedItems.length} đã chọn)
                                </span>
                            )}
                        </span>
                        <span style={{ width: '25%' }}>Đơn giá</span>
                        <span style={{ width: '15%' }}>Số lượng</span>
                        <span style={{ width: '10%', textAlign: 'center' }}>Số tiền</span>
                        <span style={{ width: '5%', textAlign: 'right' }}>Xóa</span>
                    </WrapperCartHeader>

                    {cart.items.length === 0 ? (
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <p>Giỏ hàng của bạn đang trống.</p>
                            <Button type="primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>
                        </div>
                    ) : (
                        cart.items.map(item => (
                            <WrapperCartItem key={`${item.product}-${item.variantName}`}>
                                <ItemCheckbox checked={item.selected} onChange={() => handleToggleItem(item.product)} />
                                <WrapperItemInfo>
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <ItemName onClick={() => navigate(`/product-details/${item.product}`)} style={{cursor: 'pointer'}}>
                                            {item.name}
                                        </ItemName>
                                        {/* Hiển thị biến thể */}
                                        {item.variantName && <div style={{fontSize: '12px', color: '#888'}}>Phân loại: {item.variantName}</div>}
                                        {/* Hiển thị cảnh báo tồn kho */}
                                        {item.quantity > item.countInStock && <div style={{color: 'red', fontSize: '11px'}}>Chỉ còn {item.countInStock} sản phẩm</div>}
                                    </div>
                                </WrapperItemInfo>
                                <ItemPrice>
                                    {/* Logic hiển thị giá gốc nếu có discount */}
                                    {item.discount > 0 && <OriginalPrice>{(item.price / (1 - item.discount/100)).toLocaleString('vi-VN')}đ</OriginalPrice>}
                                    <span style={{ fontWeight: 500, color: '#326e51' }}>{item.price?.toLocaleString('vi-VN')}đ</span>
                                </ItemPrice>
                                <ItemQuantity>
                                    <div style={{display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px'}}>
                                        <Button icon={<MinusOutlined />} type="text" size="small" onClick={() => handleChangeCount(item.product, item.variantName, item.quantity - 1)} disabled={item.quantity <= 1} />
                                        <InputNumber 
                                            min={1} 
                                            max={item.countInStock} 
                                            value={item.quantity} 
                                            onChange={(value) => handleChangeCount(item.product, item.variantName, value)} 
                                            controls={false} 
                                            style={{width: '40px', textAlign: 'center', border: 'none'}} 
                                        />
                                        <Button icon={<PlusOutlined />} type="text" size="small" onClick={() => handleChangeCount(item.product, item.variantName, item.quantity + 1)} disabled={item.quantity >= item.countInStock} />
                                    </div>
                                </ItemQuantity>
                                <ItemTotalPrice>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</ItemTotalPrice>
                                <ItemAction>
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(item.product, item.variantName)} />
                                </ItemAction>
                            </WrapperCartItem>
                        ))
                    )}
                </WrapperLeftCol>

                <WrapperRightCol span={7}>
                    <WrapperSummary>
                        <div style={{ paddingBottom: '15px', marginBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                <span style={{fontWeight: '600', display:'flex', alignItems:'center', gap:'5px'}}>
                                    <EnvironmentOutlined style={{color: '#326e51'}}/> Giao tới:
                                </span>
                                <span 
                                    style={{ fontWeight: 500, color: '#3d6ef7', cursor: 'pointer', fontSize: '13px' }} 
                                    onClick={() => navigate('/profile', { state: { from: '/order' } })} // Chuyển hướng đến trang Profile để sửa
                                >
                                    Thay đổi
                                </span>
                            </div>
                            
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333', lineHeight: '1.4' }}>
                                {deliveryAddress ? (
                                    deliveryAddress
                                ) : (
                                    <span style={{color: '#ff4d4f', fontStyle: 'italic'}}>Bạn chưa có địa chỉ giao hàng</span>
                                )}
                            </div>
                        </div>

                        <SummaryRow>
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                        </SummaryRow>
                        <SummaryRow>
                            <span>Phí giao hàng</span>
                            <span>{shippingFee === 0 ? 'Miễn phí' : shippingFee.toLocaleString('vi-VN') + 'đ'}</span>
                        </SummaryRow>
                        <WrapperTotal>
                            <span>Tổng cộng</span>
                            <TotalPriceText>{total.toLocaleString('vi-VN')}đ</TotalPriceText>
                        </WrapperTotal>
                        <CheckoutButton onClick={handleCheckout}>
                            Thanh Toán ({totalItems})
                        </CheckoutButton>
                    </WrapperSummary>
                </WrapperRightCol>
            </WrapperBody>
        </WrapperContainer>
    );
};

export default OrderPage;