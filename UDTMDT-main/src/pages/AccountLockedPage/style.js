import styled from 'styled-components';

export const WrapperContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background-color: #f8f9fa;
    padding: 20px;
`;

export const WrapperContent = styled.div`
    text-align: center;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
`;

export const PageTitle = styled.h1`
    font-size: 28px;
    color: #e74c3c; /* Màu đỏ cảnh báo */
    margin-bottom: 20px;
    font-weight: bold;
`;

export const LockIcon = styled.div`
    font-size: 64px;
    margin-bottom: 20px;
`;

export const Message = styled.p`
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.5;
`;

export const SubMessage = styled.p`
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
`;

export const ActionButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
`;

export const HomeButton = styled.button`
    padding: 10px 20px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
        background-color: #2980b9;
        transform: translateY(-2px);
    }
`;

export const ContactButton = styled.button`
    padding: 10px 20px;
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
        background-color: #f1f1f1;
        border-color: #bbb;
        transform: translateY(-2px);
    }
`;