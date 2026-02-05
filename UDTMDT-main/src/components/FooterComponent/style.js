import styled from 'styled-components';

export const WrapperFooter = styled.footer`
    background-color: #fff;
    margin-top: 30px;
    border-top: 4px solid #326e51; /* Màu chủ đạo của web bạn */
    padding-top: 20px;
    font-family: 'Roboto', sans-serif;
`;

export const Container = styled.div`
    width: 1270px;
    margin: 0 auto;
`;

export const FooterTitle = styled.h3`
    font-size: 14px;
    font-weight: 700;
    color: #333;
    text-transform: uppercase;
    margin-bottom: 15px;
`;

export const FooterContent = styled.div`
    font-size: 13px;
    color: #333;
    line-height: 24px;

    a {
        color: #333;
        text-decoration: none;
        &:hover {
            color: #326e51;
            text-decoration: underline;
        }
    }
`;

export const HotlineItem = styled.div`
    display: flex;
    /* Gom số điện thoại lại gần chữ Hotline */
    justify-content: flex-start; 
    align-items: center;
    /* Tạo khoảng cách nhỏ giữa chữ và số */
    gap: 5px; 
    margin-bottom: 5px;
    font-size: 13px;

    span:first-child {
        color: #333;
    }

    span:last-child {
        font-weight: 600;
        font-size: 14px;
    }
`;

export const SocialIcons = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
    
    img {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }
`;

export const BottomFooter = styled.div`
    background-color: #f8f8f8;
    padding: 20px 0;
    margin-top: 20px;
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 1.6;
`;