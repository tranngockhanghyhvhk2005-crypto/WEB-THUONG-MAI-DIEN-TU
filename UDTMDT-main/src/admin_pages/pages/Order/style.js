import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const OrderWrapper = styled(AdminPageWrapper)`
    padding: 20px;
`;

export const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        font-size: 24px;
        color: #333;
    }
`;

export const OrderFilters = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .search-box {
        flex: 1;
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e3e6f0;
            border-radius: 5px;
        }
    }

    .filter-select {
        width: 200px;
        select {
            width: 100%;
            padding: 10px;
            border: 1px solid #e3e6f0;
            border-radius: 5px;
        }
    }

    .date-filter {
        width: 200px;
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e3e6f0;
            border-radius: 5px;
        }
    }
`;

export const OrderTable = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    overflow: hidden;

    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e3e6f0;
        }

        th {
            background: #f8f9fc;
            color: #00d165;
            font-weight: bold;
        }

        tr:hover {
            background: #f8f9fc;
        }

        .status {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;

            &.pending {
                background: #f6c23e;
                color: #fff;
            }

            &.processing {
                background: #00d165;
                color: #fff;
            }

            &.completed {
                background: #1cc88a;
                color: #fff;
            }

            &.cancelled {
                background: #e74a3b;
                color: #fff;
            }
        }
    }
`;

export const OrderDetails = styled.div`
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin-top: 20px;

    h3 {
        margin-bottom: 15px;
        color: #333;
    }

    .order-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 20px;

        .info-item {
            .label {
                color: #666;
                margin-bottom: 5px;
            }
            .value {
                font-weight: bold;
                color: #333;
            }
        }
    }

    .products-list {
        border-top: 1px solid #e3e6f0;
        padding-top: 20px;
    }
`;