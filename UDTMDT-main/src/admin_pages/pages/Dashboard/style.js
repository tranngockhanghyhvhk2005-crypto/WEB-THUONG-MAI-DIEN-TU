import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const DashboardWrapper = styled(AdminPageWrapper)`
    padding: 30px; /* Tăng padding tổng */
`;

export const DashboardCards = styled.div`
    margin-bottom: 40px;
`;

export const WelcomeCard = styled.div`
    background: #fff;
    padding: 30px; /* To hơn */
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    margin-bottom: 30px;

    h3 {
        margin: 0;
        font-size: 28px; /* Tiêu đề to */
        color: #333;
        font-weight: 700;
    }

    p {
        margin: 10px 0 0;
        font-size: 22px; /* Chữ to */
        color: #666;
    }
`;

export const StatCard = styled.div`
    background: #fff;
    padding: 25px; /* To hơn */
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    margin-bottom: 25px;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-5px);
    }

    .dash-widget-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .dash-widget-icon {
        width: 70px;  /* Icon to hơn (cũ 50) */
        height: 70px; /* Icon to hơn (cũ 50) */
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 32px; /* Icon to hơn (cũ 24) */
        margin-right: 20px;

        &.text-primary { background: rgba(0, 209, 101, 0.1); color: #00d165; }
        &.text-success { background: rgba(28, 200, 138, 0.1); color: #1cc88a; }
        &.text-danger { background: rgba(231, 74, 59, 0.1); color: #e74a3b; }
        &.text-warning { background: rgba(246, 194, 62, 0.1); color: #f6c23e; }
    }

    .dash-count {
        h3 {
            margin: 0;
            font-size: 32px; /* Số to đùng (cũ 24) */
            font-weight: 800;
        }
    }

    .dash-widget-info {
        h6 {
            margin: 0;
            font-size: 16px; /* Chữ to hơn */
            color: #666;
        }
    }
`;

export const ChartSection = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); /* Card biểu đồ rộng hơn */
    gap: 30px;
    margin-bottom: 40px;
`;

export const ChartCard = styled.div`
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    overflow: hidden;

    .card-header {
        padding: 20px 25px;
        border-bottom: 1px solid #e3e6f0;
        h4 { margin: 0; color: #333; font-size: 20px; font-weight: 600; }
    }

    .card-body { padding: 25px; }
`;

export const OrdersTable = styled.div`
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    overflow: hidden;

    .card-header {
        padding: 20px 25px;
        border-bottom: 1px solid #e3e6f0;
        h4 { margin: 0; color: #333; font-size: 20px; font-weight: 600; }
    }
    .card-body { padding: 0; }
`;

export const TableResponsive = styled.div`
    overflow-x: auto;
    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 18px 20px; /* Padding cực thoáng (cũ 12px) */
            text-align: left;
            border-bottom: 1px solid #e3e6f0;
            font-size: 16px; /* Chữ trong bảng to 16px */
        }

        th {
            background: #f8f9fc;
            color: #334155;
            font-weight: 700;
            font-size: 16px;
        }

        tbody tr:hover { background: #f8f9fc; }

        .btn-primary {
            background: #00d165;
            color: white;
            padding: 8px 16px; /* Nút to hơn */
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            &:hover { background: #00b95a; }
        }
    }
`;