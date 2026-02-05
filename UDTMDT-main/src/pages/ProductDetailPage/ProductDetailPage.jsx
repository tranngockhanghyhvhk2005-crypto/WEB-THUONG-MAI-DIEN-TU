import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rate, Button, InputNumber, Breadcrumb, message, Spin, Row, Col } from 'antd';
import {
    PlusOutlined, MinusOutlined, CheckCircleFilled, ThunderboltFilled,
    HeartOutlined, HeartFilled, ShoppingCartOutlined
} from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import apiService from '../../services/apiService';
import { addToCart } from '../../redux/slides/cartSlice';
import { getImageUrl } from '../../services/ProductService';
import ProductReviews from '../../components/ProductReviews/ProductReviews';
import CardComponent from '../../components/CardComponent/CardComponent';
import { updateUser } from '../../redux/slides/userSlice';

import {
    WrapperStyleImageSmall,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperDescription,
    WrapperBtnShowMore,
    WrapperQualityProduct
} from './style';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);

    // --- STATE ---
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // UI State
    const [displayImage, setDisplayImage] = useState('');
    const [numProduct, setNumProduct] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const res = await ProductService.getDetailsProduct(id);
                if (res?.status === 'OK' && res.data) {
                    setProductDetails(res.data);
                    setDisplayImage(getImageUrl(res.data.image));

                    // Mặc định chọn biến thể đầu tiên nếu có
                    if (res.data.variants && res.data.variants.length > 0) {
                        const firstVar = res.data.variants[0];
                        setSelectedVariant(firstVar);
                        if (firstVar.image) setDisplayImage(getImageUrl(firstVar.image));
                    }

                    // Check Wishlist
                    if (user?.wishlist?.includes(res.data._id)) {
                        setIsLiked(true);
                    }

                    // Fetch sản phẩm tương tự
                    const categoryId = res.data.category?._id || res.data.category;
                    if (categoryId) {
                        fetchRelatedProducts(categoryId);
                    }

                } else {
                    message.error('Không tìm thấy sản phẩm');
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProductDetails();
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi load xong
    }, [id, user]);

    const fetchRelatedProducts = async (categoryId) => {
        try {
            // Lấy 6 sản phẩm cùng danh mục
            const res = await ProductService.getAllProduct(null, 6, 0, `&category=${categoryId}`);
            if (res?.status === 'OK' || res?.data) {
                // Lọc bỏ sản phẩm hiện tại đang xem
                const related = (res.data || []).filter(item => item._id !== id && item.id !== id);
                setRelatedProducts(related);
            }
        } catch (error) {
            console.log("Lỗi lấy SP gợi ý", error);
        }
    }

    // --- XỬ LÝ CHỌN BIẾN THỂ ---
    const handleSelectVariant = (variant) => {
        setSelectedVariant(variant);
        if (variant.image) setDisplayImage(getImageUrl(variant.image));
    };

    // --- XỬ LÝ MUA HÀNG & GIỎ HÀNG ---
    const handleAction = (actionType) => {
        if (!user || (!user.id && !user._id)) {
            message.warning('Vui lòng đăng nhập để mua hàng!');
            navigate('/sign-in', { state: { from: location } });
            return;
        }

        const isFlashSale = productDetails.isFlashSale;
        let finalPrice;

        // Logic tính giá khi đưa vào giỏ
        if (selectedVariant) {
            // Nếu biến thể có Flash Sale riêng -> dùng giá đó
            if (isFlashSale && selectedVariant.flashSalePrice > 0) {
                finalPrice = selectedVariant.flashSalePrice;
            } else {
                finalPrice = selectedVariant.price;
            }
        } else {
            // Sản phẩm thường
            finalPrice = isFlashSale ? productDetails.flashSalePrice : productDetails.price;
        }

        // Kiểm tra tồn kho
        const countInStock = selectedVariant ? selectedVariant.countInStock : productDetails.countInStock;

        if (numProduct > countInStock) {
            message.warning(`Chỉ còn ${countInStock} sản phẩm trong kho`);
            return;
        }

        const cartItem = {
            name: productDetails.name + (selectedVariant ? ` (${selectedVariant.name})` : ''),
            quantity: numProduct,
            image: selectedVariant?.image ? getImageUrl(selectedVariant.image) : getImageUrl(productDetails.image),
            price: finalPrice,
            product: productDetails._id,
            discount: isFlashSale ? 0 : productDetails.discount,
            countInStock: countInStock,
            variantName: selectedVariant?.name || ''
        };

        dispatch(addToCart(cartItem));

        if (actionType === 'buy_now') {
            navigate('/order');
        } else {
            message.success('Đã thêm vào giỏ hàng thành công!');
        }
    };

    // --- XỬ LÝ YÊU THÍCH ---
    const handleAddToWishlist = async () => {
        if (!user || (!user.id && !user._id)) {
            message.warning('Vui lòng đăng nhập để thêm vào yêu thích!');
            navigate('/sign-in', { state: { from: location } });
            return;
        }
        try {
            const res = await apiService.post(`/products/add-to-wishlist/${productDetails._id}`);
            if (res.status === 200) {
                if (res.data.data) {
                    dispatch(updateUser(res.data.data));
                }
                if (res.data.action === 'added') {
                    setIsLiked(true);
                    message.success('Đã thêm vào yêu thích');
                } else {
                    setIsLiked(false);
                    message.success('Đã bỏ yêu thích');
                }
            }
        } catch (e) {
            message.error('Lỗi thao tác');
        }
    };

    if (loading) return <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
    if (!productDetails) return null;

    // --- TÍNH TOÁN GIÁ HIỂN THỊ ---
    const isFlashSale = productDetails.isFlashSale;
    const basePrice = selectedVariant ? selectedVariant.price : productDetails.price;
    let currentPrice = basePrice;

    if (isFlashSale) {
        if (selectedVariant) {
            if (selectedVariant.flashSalePrice > 0) {
                currentPrice = selectedVariant.flashSalePrice;
            } else {
                currentPrice = basePrice;
            }
        } else {
            currentPrice = productDetails.flashSalePrice;
        }
    }

    const currentStock = selectedVariant ? selectedVariant.countInStock : productDetails.countInStock;
    const discountPercent = basePrice > currentPrice
        ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
        : 0;

    return (
        <div style={{ width: '100%', background: '#efefef', minHeight: '100vh', paddingBottom: '40px' }}>
            <div style={{ width: '1270px', margin: '0 auto', padding: '10px 0' }}>
                <Breadcrumb items={[
                    { title: 'Trang chủ', href: '/' },
                    { title: 'Sản phẩm', href: '/products' },
                    { title: productDetails.name }
                ]} />
            </div>

            <div style={{ display: 'flex', background: '#fff', width: '1270px', margin: '0 auto', padding: '20px', borderRadius: '8px' }}>
                {/* --- ẢNH --- */}
                <div style={{ width: '40%', paddingRight: '20px', borderRight: '1px solid #f0f0f0' }}>
                    <img
                        src={displayImage}
                        alt="product main"
                        style={{ width: '100%', height: '450px', objectFit: 'contain', marginBottom: '15px', borderRadius: '8px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                        <WrapperStyleImageSmall
                            src={getImageUrl(productDetails.image)}
                            $active={displayImage === getImageUrl(productDetails.image)}
                            onClick={() => setDisplayImage(getImageUrl(productDetails.image))}
                        />
                        {productDetails.images?.map((img, index) => (
                            <WrapperStyleImageSmall
                                key={index}
                                src={getImageUrl(img)}
                                $active={displayImage === getImageUrl(img)}
                                onClick={() => setDisplayImage(getImageUrl(img))}
                            />
                        ))}
                    </div>
                </div>

                {/* --- THÔNG TIN --- */}
                <div style={{ width: '60%', paddingLeft: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {productDetails.brand && (
                                <span style={{ color: '#1a94ff', background: '#f0f8ff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                                    {productDetails.brand.name}
                                </span>
                            )}
                            {isFlashSale && (
                                <span style={{ color: '#fff', background: '#ff424e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                    FLASH SALE
                                </span>
                            )}
                        </div>
                        <Button
                            type="text"
                            icon={isLiked ? <HeartFilled style={{ color: '#ff424e', fontSize: '24px' }} /> : <HeartOutlined style={{ fontSize: '24px' }} />}
                            onClick={handleAddToWishlist}
                        />
                    </div>

                    <WrapperStyleNameProduct>{productDetails.name}</WrapperStyleNameProduct>

                    <div style={{ marginBottom: '15px' }}>
                        <Rate disabled allowHalf value={productDetails.rating} style={{ fontSize: '14px', color: '#ffc400' }} />
                        <WrapperStyleTextSell> | Đã bán {productDetails.selled || 0}+</WrapperStyleTextSell>
                    </div>

                    <div style={{
                        background: (isFlashSale && discountPercent > 0) ? 'linear-gradient(90deg, #fff0f1 0%, #fff 100%)' : '#fafafa',
                        padding: '15px', borderRadius: '8px', margin: '15px 0'
                    }}>
                        {isFlashSale && discountPercent > 0 && (
                            <div style={{ color: '#ff424e', fontWeight: 'bold', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <ThunderboltFilled /> GIÁ SỐC HÔM NAY
                            </div>
                        )}
                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct>
                                {currentPrice?.toLocaleString()} đ
                            </WrapperPriceTextProduct>
                            {(discountPercent > 0) && (
                                <span style={{ color: '#888' }}>
                                    <span style={{ textDecoration: 'line-through', fontSize: '16px' }}>{basePrice?.toLocaleString()} đ</span>
                                    <span style={{ marginLeft: '8px', color: '#ff424e', border: '1px solid #ff424e', padding: '0 4px', borderRadius: '2px', fontSize: '12px' }}>
                                        -{discountPercent}%
                                    </span>
                                </span>
                            )}
                        </WrapperPriceProduct>
                    </div>

                    {productDetails.variants?.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '10px', fontWeight: '600' }}>Chọn loại:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {productDetails.variants.map((variant, idx) => {
                                    const isSelected = selectedVariant?.name === variant.name;
                                    return (
                                        <div key={idx} onClick={() => handleSelectVariant(variant)}
                                            style={{
                                                padding: '8px 16px',
                                                border: isSelected ? '2px solid #00d165' : '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                background: isSelected ? '#fff0f1' : '#fff',
                                                color: isSelected ? '#00d165' : '#333',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                fontWeight: isSelected ? '600' : '400'
                                            }}
                                        >
                                            {variant.image && <img src={getImageUrl(variant.image)} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />}
                                            <span>{variant.name}</span>
                                            {isSelected && <CheckCircleFilled style={{ color: '#00d165', marginLeft: '4px' }} />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontWeight: '600' }}>Số lượng:</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => setNumProduct(n => Math.max(1, n - 1))}><MinusOutlined /></button>
                            <InputNumber min={1} max={currentStock} value={numProduct} onChange={setNumProduct} style={{ width: '50px', border: 'none', textAlign: 'center' }} controls={false} />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => setNumProduct(n => Math.min(currentStock, n + 1))}><PlusOutlined /></button>
                        </WrapperQualityProduct>
                        <span style={{ color: '#888', fontSize: '13px' }}>
                            {currentStock > 0 ? `${currentStock} sản phẩm có sẵn` : <span style={{ color: 'red', fontWeight: 'bold' }}>Hết hàng</span>}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button
                            size="large"
                            style={{
                                background: '#326e51', borderColor: '#326e51', color: '#fff',
                                fontWeight: 'bold', height: '48px', width: '200px', fontSize: '16px'
                            }}
                            onClick={() => handleAction('buy_now')}
                            disabled={currentStock <= 0}
                        >
                            MUA NGAY
                        </Button>
                        <Button
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            style={{
                                background: '#fff', borderColor: '#326e51', color: '#326e51',
                                fontWeight: 'bold', height: '48px', width: '200px', fontSize: '16px'
                            }}
                            onClick={() => handleAction('add_to_cart')}
                            disabled={currentStock <= 0}
                        >
                            THÊM VÀO GIỎ
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ width: '1270px', margin: '20px auto', background: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Mô tả sản phẩm</h3>
                <WrapperDescription $expanded={isDescExpanded}>
                    <div dangerouslySetInnerHTML={{ __html: productDetails.description }} style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }} />
                </WrapperDescription>
                <WrapperBtnShowMore onClick={() => setIsDescExpanded(!isDescExpanded)}>
                    {isDescExpanded ? <span>Thu gọn nội dung</span> : <span>Xem thêm nội dung</span>}
                </WrapperBtnShowMore>
            </div>

            <div style={{ width: '1270px', margin: '20px auto', background: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Đánh giá & Nhận xét</h3>
                <ProductReviews
                    productId={productDetails._id}
                    reviews={productDetails.reviews || []}
                />
            </div>

            {/* SẢN PHẨM TƯƠNG TỰ (DÙNG ROW/COL ĐỂ GÓI GỌN) */}
            {relatedProducts.length > 0 && (
                <div style={{ width: '1270px', margin: '20px auto', background: '#fff', padding: '20px', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>
                        Có thể bạn cũng thích
                    </h3>
                    <div style={{ padding: '10px' }}>
                        <Row gutter={[16, 16]}> 
                            {relatedProducts.map((product) => {
                                // Xử lý ID an toàn
                                const relatedId = product._id || product.id;
                                if (!relatedId) return null;

                                return (
                                    <Col key={relatedId} xs={24} sm={12} md={8} lg={6} xl={4}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <CardComponent
                                                id={relatedId}
                                                countInStock={product.countInStock}
                                                description={product.description}
                                                image={product.image}
                                                name={product.name}
                                                price={product.price}
                                                rating={product.rating}
                                                type={product.type}
                                                selled={product.selled}
                                                discount={product.discount}
                                                isFlashSale={product.isFlashSale}
                                                flashSalePrice={product.flashSalePrice}
                                            />
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProductDetailPage;