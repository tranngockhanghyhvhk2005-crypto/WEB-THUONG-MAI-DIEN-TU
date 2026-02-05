import styled from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const CouponWrapper = styled(AdminPageWrapper)`
    padding: 20px;

    .btn-primary {
        background: #00d165;
        border: none;
        padding: 8px 20px;
        border-radius: 5px;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
        &:hover { background: #00b95a; }
    }

    .table td {
        vertical-align: middle;
    }
`;

export const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h2 { color: #333; margin: 0; font-size: 24px; }
`;

export const SearchSection = styled.div`
    margin-bottom: 20px;
    input {
        border-radius: 5px;
        border: 1px solid #ddd;
        padding: 8px 12px;
    }
`;