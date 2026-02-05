import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const UserWrapper = styled(AdminPageWrapper)`
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
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            background: #00b95a;
            transform: translateY(-1px);
        }

        i {
            font-size: 14px;
        }
    }

    .table {
        td {
            vertical-align: middle; /* Căn giữa nội dung theo chiều dọc */
        }
    }

    .user-item {
        display: flex;
        align-items: center;
        gap: 12px; /* Khoảng cách giữa ảnh và tên */

        img {
            width: 40px;          /* Kích thước avatar nhỏ gọn */
            height: 40px;
            border-radius: 50%;   /* Bo tròn hoàn toàn */
            object-fit: cover;    /* Chống méo ảnh */
            border: 1px solid #eee;
            background-color: #f1f1f1;
        }

        .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            line-height: 1.2;
        }
    }
`;

export const UserPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 { font-size: 24px; color: #333; }

    .add-button {
        background: #00d165;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;

        &:hover { background: #00b95a; }
    }
`;

export const UserTable = styled.div`
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

        tr:hover { background: #f8f9fc; }

        .user-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

        .status {
            &.active { color: #1cc88a; }
            &.inactive { color: #e74a3b; }
        }
    }
`;

export const UserFilter = styled.div`
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
        select { width: 100%; padding: 10px; border: 1px solid #e3e6f0; border-radius: 5px; }
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;

    button {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;

    &.edit { background: #00d165; color: white; }
        &.delete { background: #e74a3b; color: white; }
    }
`;