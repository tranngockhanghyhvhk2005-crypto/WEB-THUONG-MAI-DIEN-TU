import { styled } from 'styled-components';

export const LoginBody = styled.div`
    display: flex;
    min-height: 100vh;
    align-items: center;
    background-color: #f8f9fc;
`;

export const LoginWrapper = styled.div`
    width: 100%;
    padding: 20px;
`;

export const LoginBox = styled.div`
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

export const LoginLeft = styled.div`
    flex: 1;
    background: #ffffffff;
    padding: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 120%;
        height: auto;
    }
`;

export const LoginRight = styled.div`
    flex: 1;
    padding: 50px;
`;

export const LoginRightWrap = styled.div`
    h1 {
        font-size: 28px;
        margin-bottom: 10px;
        color: #333;
    }

    .account-subtitle {
        color: #666;
        margin-bottom: 30px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-control {
        width: 100%;
        padding: 10px 15px;
        border: 1px solid #e3e6f0;
        border-radius: 5px;
        font-size: 14px;
        transition: border-color 0.3s;

        &:focus {
            border-color: #00d165;
            outline: none;
        }
    }

    .btn-primary {
        width: 100%;
        padding: 12px;
        background: #00d165;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
            background: #00b95a;
        }

        &:disabled {
            background: #bdeccf;
            cursor: not-allowed;
        }
    }
`;