import { Col, Row, Image, InputNumber, Button } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
    background-color: #efefef;
    padding: 20px 0;
    min-height: 80vh;
`;

export const WrapperLayout = styled.div`
    width: 1270px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
`;

// CỘT BÊN TRÁI
export const WrapperStyleColImage = styled.div`
    flex-basis: 30%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const WrapperThumbnailGroup = styled.div`
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px !important;
    width: 64px !important;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: ${props => props.$active ? '2px solid #ff424e' : '1px solid #ebebeb'};
    &:hover {
        border: 2px solid #ff424e;
    }
`;

// CỘT BÊN PHẢI
export const WrapperStyleColInfo = styled(Col)`
    padding-left: 30px !important;
`;

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    word-break: break-word;
    margin-top: 8px;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
`;

export const WrapperPriceProduct = styled.div`
    border-radius: 4px;
    padding: 10px;
    background: ${props => props.$isFlashSale ? 'linear-gradient(90deg, #fff0f1 0%, #fff 100%)' : '#fafafa'};
    border: ${props => props.$isFlashSale ? '1px solid #ffcccc' : 'none'};
`;

export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top: 10px;
    color: rgb(255, 66, 78);
`;

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        cursor: pointer;
    }
`;

export const WrapperOriginalPrice = styled.span`
    font-size: 16px;
    color: #888;
    text-decoration: line-through;
`;

export const WrapperDiscount = styled.span`
    background-color: #fff0f1;
    color: #d0011b;
    border: 1px solid #ffb8c1;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
`;

export const WrapperInfoRow = styled(Row)`
    margin-top: 20px;
    align-items: center;
`;

export const WrapperInfoLabel = styled.div`
    font-size: 15px;
    color: #777;
    width: 130px;
    flex-shrink: 0;
`;

export const WrapperInfoContent = styled.div`
    flex: 1;
`;

export const WrapperShipping = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 500;
`;

export const WrapperGuarantee = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #555;
    font-weight: 500;
    border: 1px dashed #ccc;
    padding: 5px 10px;
    border-radius: 4px;
`;

export const WrapperVariationGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const WrapperVariationButton = styled(Button)`
    border: 1px solid #ccc;
    padding: 5px 15px;
    height: auto;
    font-weight: 500;

    &.active {
        border-color: #326e51;
        color: #326e51;
        background-color: #f0f5f1;
    }
    
    &:disabled {
        background-color: #f5f5f5;
        border-color: #e0e0e0;
        color: #aaa;
        cursor: not-allowed;
        
        /* Gạch chéo */
        background-image: linear-gradient(
            to top left,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 47%,
            #aaa 47%,
            #aaa 53%,
            rgba(255, 255, 255, 0) 53%,
            rgba(255, 255, 255, 0) 100%
        );
    }
`;

export const WrapperQualityLabel = styled.div`
    font-size: 15px;
    color: #777;
    width: 130px;
    padding-top: 5px;
    flex-shrink: 0;
`;

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 100px;
    padding: 4px;
    align-items: center;
    justify-content: space-evenly;
    align-content: center;
    flex-wrap: nowrap;
    flex-direction: row;
`;

export const WrapperBtnQualityProduct = styled.span`
    display: inline-block;
    border: 1px solid #ccc;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background: #f5f5f5;
    }
`;

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    };
`;

export const WrapperStockText = styled.span`
    font-size: 14px;
    color: #777;
    margin-left: 10px;
`;

export const WrapperButtonRow = styled(Row)`
    margin-top: 30px;
    display: flex;
    gap: 15px;
`;

export const AddToCartButton = styled(Button)`
    background-color: #f0f5f1;
    border: 1px solid #326e51;
    color: #326e51;
    font-weight: 500;
    min-width: 200px;
    height: 48px;
    font-size: 16px;

    &:hover {
        background-color: #e6f7f0;
        border-color: #326e51;
        color: #326e51;
    }
`;

export const BuyNowButton = styled(Button)`
    background-color: #326e51;
    border-color: #326e51;
    color: #fff;
    font-weight: 500;
    min-width: 200px;
    height: 48px;
    font-size: 16px;

    &:hover, &:focus {
        background-color: #2b5a41;
        border-color: #2b5a41;
        color: #fff;
    }
`;

export const FavoriteButton = styled(Button)`
    background-color: #fff;
    border: 1px solid #ff6b81;
    color: #ff6b81;
    font-weight: 500;
    min-width: 200px;
    height: 48px;
    font-size: 16px;

    &:hover {
        background-color: #fff0f2;
        border-color: #ff6b81;
        color: #ff3b61;
    }
`

// PHẦN MÔ TẢ BÊN DƯỚI
// --- STYLE MỚI CHO PHẦN MÔ TẢ ---
export const WrapperDescription = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* Nếu chưa expand thì giới hạn chiều cao, ngược lại thì auto */
    max-height: ${props => props.$expanded ? 'none' : '300px'}; 
    position: relative;
    transition: max-height 0.3s ease;
    
    /* Hiệu ứng mờ dần ở đáy khi thu gọn */
    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: ${props => props.$expanded ? '0' : '100px'};
        background: linear-gradient(transparent, #fff);
        display: ${props => props.$expanded ? 'none' : 'block'};
    }

    img {
        max-width: 100%;
        height: auto;
    }
`;

export const WrapperBtnShowMore = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    cursor: pointer;
    color: #1a94ff;
    font-weight: 500;
    &:hover {
        text-decoration: underline;
    }
`;

export const WrapperRelatedProducts = styled.div`
    margin-top: 30px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
`;