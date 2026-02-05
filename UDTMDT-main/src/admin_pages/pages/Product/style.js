import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const ProductWrapper = styled(AdminPageWrapper)`
    padding: 30px;
    background: #f8f9fc; /* Đồng bộ nền với các trang khác */
`;

export const ProductHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h2 {
        font-size: 24px;
        color: #333;
        font-weight: 700;
        margin: 0;
    }

    .add-button, .btn-primary {
        background: #00d165;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;

        &:hover {
            background: #00b95a;
            transform: translateY(-2px);
            color: #fff;
        }
        
        i { font-size: 16px; }
    }
`;

export const ProductFilters = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 24px;

    .search-box {
        flex: 1;
        max-width: 400px;
        input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #e3e6f0;
            border-radius: 8px;
            font-size: 15px;
            transition: border-color 0.3s;
            
            &:focus {
                outline: none;
                border-color: #00d165;
            }
        }
    }

    .filter-select {
        width: 200px;
        select {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #e3e6f0;
            border-radius: 8px;
            font-size: 15px;
        }
    }
`;

// 👇 BỔ SUNG: ProductTable
export const ProductTable = styled.div`
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    overflow-x: auto; /* Cho phép cuộn ngang nếu bảng quá rộng */

    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 800px;

        thead {
            tr {
                background-color: #f8f9fc;
                th {
                    padding: 18px 20px;
                    text-align: left;
                    font-weight: 700;
                    color: #4e5d78;
                    border-bottom: 2px solid #edf2f7;
                    font-size: 15px;
                    white-space: nowrap;
                }
            }
        }

        tbody {
            tr {
                transition: background-color 0.2s;
                border-bottom: 1px solid #edf2f7;

                &:hover {
                    background-color: #f8f9fc;
                }

                td {
                    padding: 16px 20px;
                    vertical-align: middle;
                    color: #333;
                    font-size: 15px;

                    img {
                        border-radius: 6px;
                        border: 1px solid #eee;
                    }
                }
            }
        }
    }
`;

// 👇 BỔ SUNG: LoadingWrapper
export const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    width: 100%;

    .spinner-border {
        width: 3rem;
        height: 3rem;
        color: #00d165;
    }
`;

// 👇 BỔ SUNG: NoDataMessage
export const NoDataMessage = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #8898aa;
    font-size: 16px;
    font-style: italic;
`;

// (Giữ lại các thành phần cũ nếu bạn còn dùng ở nơi khác, ví dụ ProductGrid/ProductCard)
export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
`;

export const ProductCard = styled.div`
    /* ... code cũ giữ nguyên nếu cần ... */
`;