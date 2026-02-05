import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const StatisticalWrapper = styled(AdminPageWrapper)`
    padding: 20px;
`;

export const StatisticalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        font-size: 24px;
        color: #333;
    }
`;

export const DateRangePicker = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .date-input {
        flex: 1;
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e3e6f0;
            border-radius: 5px;
        }
    }

    .apply-button {
        background: #00d165;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
            background: #00b95a;
        }
    }
`;

export const StatisticsCards = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
`;

export const StatCard = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    .stat-title {
        color: #666;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
    }

    .stat-change {
        font-size: 12px;
        
        &.positive {
            color: #1cc88a;
        }
        
        &.negative {
            color: #e74a3b;
        }
    }
`;

export const ChartSection = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 30px;

    .chart-container {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);

        h3 {
            margin-bottom: 20px;
            color: #333;
        }
    }
`;

export const TopProducts = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    h3 {
        margin-bottom: 20px;
        color: #333;
    }

    .product-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #e3e6f0;

        img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 10px;
        }

        .product-info {
            flex: 1;
            
            .name {
                font-weight: bold;
                color: #333;
            }
            
            .sales {
                font-size: 12px;
                color: #666;
            }
        }

        .sales-value {
            font-weight: bold;
            color: #00d165;
        }
    }
`;