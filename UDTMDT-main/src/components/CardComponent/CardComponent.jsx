import React from 'react'
import { Rate } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../../services/ProductService'
import {
    WrapperCardStyle,
    WrapperImageStyle,
    WrapperPriceText,
    WrapperDiscountText,
    WrapperReportText,
    WrapperStyleNameCard
} from './style'
import { ThunderboltFilled } from '@ant-design/icons';

const CardComponent = (props) => {
    const {
        id,
        name,
        image,
        price,
        rating,
        selled,
        discount,
        brand,
        isFlashSale,
        flashSalePrice,
        variants,
    } = props

    const navigate = useNavigate();

    const handleNavigateDetail = () => {
        navigate(`/product-details/${id}`);
    }

    // --- LOGIC TÍNH GIÁ HIỂN THỊ ---
    let displayPrice = price;
    let originalPrice = price;
    let displayDiscount = discount;

    // 1. Nếu có Flash Sale -> Ưu tiên số 1
    if (isFlashSale) {
        displayPrice = flashSalePrice;
        originalPrice = price; // Giá gốc để gạch ngang
        displayDiscount = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }
    // 2. Nếu không Flash Sale nhưng có Variants -> Hiển thị giá thấp nhất
    else if (variants && variants.length > 0) {
        const prices = variants.map(v => v.price);
        displayPrice = Math.min(...prices);
        originalPrice = Math.max(...prices); // Có thể dùng max để hiện khoảng giá nếu muốn
        // Nếu min < max tức là có khoảng giá, ta vẫn hiện min nhưng discount tính theo min so với base price
    }

    return (
        <WrapperCardStyle
            hoverable
            styles={{
                header: { width: '200px', height: '200px' },
                body: { padding: '10px' }
            }}
            style={{ width: 200, position: 'relative', overflow: 'hidden' }}
            cover={
                <WrapperImageStyle
                    alt={name}
                    src={getImageUrl(image)}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200" }}
                />
            }
            onClick={handleNavigateDetail}
        >
            {/* Tag Flash Sale góc ảnh */}
            {isFlashSale && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, background: '#ff424e', color: '#fff',
                    fontSize: '10px', padding: '2px 6px', borderBottomRightRadius: '10px', zIndex: 10, fontWeight: 'bold'
                }}>
                    <ThunderboltFilled /> FLASH SALE
                </div>
            )}

            {/* Tên Brand */}
            {brand && brand.name && (
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {brand.name}
                </div>
            )}

            <WrapperStyleNameCard>{name}</WrapperStyleNameCard>

            <WrapperReportText>
                <span style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 2 }}>{rating}</span>
                    <Rate allowHalf disabled value={rating} style={{ fontSize: '10px', color: '#ffce3d' }} />
                </span>
                <span style={{ fontSize: '11px', color: '#787878' }}> | Đã bán {selled || 0}+</span>
            </WrapperReportText>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                <WrapperPriceText>
                    {displayPrice?.toLocaleString()}₫
                </WrapperPriceText>

                {displayDiscount > 0 && (
                    <WrapperDiscountText>
                        -{displayDiscount}%
                    </WrapperDiscountText>
                )}
            </div>

            {/* Giá gốc gạch ngang */}
            {displayDiscount > 0 && (
                <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '11px' }}>
                    {isFlashSale ? originalPrice?.toLocaleString() : (price > displayPrice ? price?.toLocaleString() : '')}₫
                </div>
            )}
        </WrapperCardStyle>
    )
}

export default CardComponent