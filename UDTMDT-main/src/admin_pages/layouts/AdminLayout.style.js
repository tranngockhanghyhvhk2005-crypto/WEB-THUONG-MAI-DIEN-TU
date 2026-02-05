import { styled } from 'styled-components';

export const MainWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    position: relative;
`;

export const PageWrapper = styled.div`
    flex: 1;
    margin-left: 260px;
    min-height: 100vh;
    background: #eef1f5;
    position: relative;
    transition: margin-left 0.3s;

    @media (max-width: 991.98px) {
        margin-left: 80px;
    }

    &.condensed {
        margin-left: 80px;
    }
`;

export const ContentContainer = styled.div`
    padding: 72px 20px 20px 20px; 
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
`;