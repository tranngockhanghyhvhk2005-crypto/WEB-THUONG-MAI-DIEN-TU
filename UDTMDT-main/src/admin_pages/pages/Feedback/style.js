import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const FeedbackWrapper = styled(AdminPageWrapper)`
    padding: 20px;
`;

export const FeedbackHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        font-size: 24px;
        color: #333;
    }
`;

export const FeedbackFilters = styled.div`
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
`;

export const FeedbackGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

export const FeedbackCard = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding: 20px;

    .feedback-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .user-info {
            .name {
                font-weight: bold;
                color: #333;
            }
            .date {
                font-size: 12px;
                color: #666;
            }
        }

        .rating {
            margin-left: auto;
            color: #f6c23e;
        }
    }

    .feedback-content {
        color: #666;
        margin-bottom: 15px;
        line-height: 1.5;
    }

    .feedback-product {
        display: flex;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid #e3e6f0;

        img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 10px;
        }

        .product-info {
            .name {
                font-weight: bold;
                color: #333;
            }
            .category {
                font-size: 12px;
                color: #666;
            }
        }
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;

    button {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &.reply {
            background: #00d165;
            color: white;
        }
        
        &.delete {
            background: #e74a3b;
            color: white;
        }
    }
`;