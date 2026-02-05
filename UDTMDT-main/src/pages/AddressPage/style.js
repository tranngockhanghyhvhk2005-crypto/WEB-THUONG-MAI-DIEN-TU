import styled from 'styled-components';
import { Button } from 'antd';

export const AddressHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
`;

export const AddButton = styled(Button)`
    background-color: #326e51;
    border-color: #326e51;
    color: #fff;
    font-weight: 500;
    height: 40px;
    padding: 0 20px;

    &:hover, &:focus {
        background-color: #2b5a41;
        border-color: #2b5a41;
        color: #fff;
    }
`;

export const AddressList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const AddressItem = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
`;

export const AddressInfo = styled.div`
    flex: 1;
`;

export const AddressName = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
`;

export const DefaultBadge = styled.span`
    background-color: #e6f7f0;
    color: #326e51;
    border: 1px solid #a6d9c1;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    margin-left: 10px;
`;

export const AddressDetails = styled.p`
    font-size: 14px;
    color: #555;
    margin: 5px 0;
    line-height: 1.5;

    span {
        color: #777;
        width: 80px;
        display: inline-block;
    }
`;

export const AddressActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    a {
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background-color: #f0f5f3;
        text-align: center;
        transition: all 0.2s ease;

        &:hover {
            background-color: #326e51;
            color: #fff;
        }
    }
`;