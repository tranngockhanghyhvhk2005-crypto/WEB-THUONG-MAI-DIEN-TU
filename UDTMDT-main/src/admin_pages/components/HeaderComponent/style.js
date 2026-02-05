import { styled } from 'styled-components';

const themeColorSolid = '#00e66b';

export const HeaderContainer = styled.div`
    position: fixed;
    top: 0;
    left: 260px; // Chiều rộng sidebar
    right: 0;
    height: 64px;
    background: #fff;
    color: #333; 
    z-index: 1001;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: left 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    &.condensed {
        left: 80px;
    }

    @media (max-width: 991.98px) {
        left: 80px;
    }
`;

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;

export const ToggleButton = styled.button`
    background: none;
    border: none;
    padding: 0 15px;
    color: #666; 
    font-size: 20px;
    cursor: pointer;
    
    &:hover {
        color: ${themeColorSolid};
    }
`;

export const UserMenu = styled.div`
    display: flex;
    align-items: center;
`;

export const UserDropdown = styled.div`
    position: relative;
    
    .user-img {
        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #eee;
        }
    }

    .dropdown-toggle {
        padding: 0;
        color: #333;
        background: none;
        border: none;
        text-decoration: none;
        display: flex;
        align-items: center;

        &::after {
            display: none;
        }
    }

    .dropdown-menu {
        position: absolute;
        right: 0;
        top: 100%;
        min-width: 200px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 15px;
        margin-top: 10px;
        display: none;
        color: #333;

        &.show {
            display: block;
        }
    }

    .user-header {
        padding-bottom: 10px;
        border-bottom: 1px solid #e3e6f0;
        margin-bottom: 10px;
        h6 { margin: 0; font-size: 15px; color: #333; }
        p { margin: 5px 0 0; font-size: 12px; color: #666; }
    }

    .dropdown-item {
        padding: 8px 15px;
        color: #333;
        text-decoration: none;
        display: block;
        font-size: 14px;
        background: none;
        border: none;
        width: 100%;
        text-align: left;

        &:hover {
            background: rgba(0, 255, 119, 0.1);
            color: ${themeColorSolid};
        }
    }
`;