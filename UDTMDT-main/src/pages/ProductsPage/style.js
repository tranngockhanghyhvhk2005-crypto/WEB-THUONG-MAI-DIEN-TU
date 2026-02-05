import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ProductList = styled.div`
    display: grid;
    /* Hiển thị 4 cột, tự động điều chỉnh */
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px 0;
`;

export const ProductCard = styled(Link)`
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    background-color: #fff;
    transition: box-shadow 0.2s ease-in-out;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

export const ProductImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 1px solid #f0f0f0;
`;

export const ProductInfo = styled.div`
    padding: 15px;
`;

export const ProductName = styled.h3`
    font-size: 16px;
    font-weight: 500;
    color: #333;
    /* Giới hạn 2 dòng */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 48px; /* Giữ chiều cao cố định cho 2 dòng */
`;

export const ProductPrice = styled.p`
    font-size: 18px;
    font-weight: 600;
    color: #326e51; /* Màu xanh lá chủ đạo */
    margin: 10px 0 0 0;
`;