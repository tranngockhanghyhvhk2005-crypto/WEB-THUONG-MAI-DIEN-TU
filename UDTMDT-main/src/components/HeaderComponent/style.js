import { Row } from 'antd'
import { Input } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: #326e51;
    align-items: center;
    
    @media (max-width: 768px) {
        padding: 10px 20px;
    }
`

export const AccountDropdown = styled.div`
    min-width: 200px;
    background-color: #fff;
    border-radius: 10px;
    padding: 8px 0;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    border: 1px solid #f0f0f0;
`

export const AccountDropdownItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => (props.danger ? '#d64545' : '#333')};
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    svg {
        font-size: 18px;
        color: ${(props) => (props.danger ? '#d64545' : '#6b6b6b')};
        transition: inherit;
    }

    &:hover {
        background-color: #f4f7f5;
        color: ${(props) => (props.danger ? '#b83232' : '#326e51')};

        svg {
            color: ${(props) => (props.danger ? '#b83232' : '#326e51')};
        }
    }
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    cursor: pointer;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
        opacity: 0.8;
    }
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const ButtonSearch = styled(Input.Search)`
    width: 100%;
    
    .ant-input-search-button {
        background-color: #326e51 !important;
        border-color: #326e51 !important;
        
        &:hover {
            background-color: #2a5d44 !important;
            border-color: #2a5d44 !important;
        }
    }
    
    .ant-btn-primary {
        background-color: #326e51 !important;
        border-color: #326e51 !important;
        
        &:hover {
            background-color: #2a5d44 !important;
            border-color: #2a5d44 !important;
        }
    }
`