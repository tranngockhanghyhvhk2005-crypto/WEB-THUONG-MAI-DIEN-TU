import styled from 'styled-components';
import { Button } from 'antd';

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    min-height: 320px;
    text-align: center;
`;

export const EmptyIcon = styled.div`
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 3px solid #cccccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    color: #b5b5b5;
    margin-bottom: 24px;
`;

export const EmptyDescription = styled.p`
    font-size: 16px;
    color: #4a4a4a;
    margin-bottom: 26px;
`;

export const ContinueButton = styled(Button)`
    background-color: #326e51;
    border-color: #326e51;
    color: #fff;
    font-weight: 600;
    padding: 0 24px;
    height: 42px;

    &:hover,
    &:focus {
        background-color: #285740;
        border-color: #285740;
        color: #fff;
    }
`;

export const WishlistGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

export const WishlistCard = styled.div`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const WishlistCardImage = styled.div`
    background-color: #f7f7f7;
    border-radius: 6px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;

export const WishlistCardName = styled.h4`
    font-size: 16px;
    color: #333;
    margin: 0;
`;

export const WishlistPrice = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: #326e51;
`;

export const WishlistCardActions = styled.div`
    display: flex;
    gap: 10px;
`;

export const ViewButton = styled(Button)`
    flex: 1;
`;

export const RemoveButton = styled(Button)`
    flex: 1;
    border-color: #e57373;
    color: #e57373;

    &:hover,
    &:focus {
        border-color: #d84444;
        color: #d84444;
    }
`;
