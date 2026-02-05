import styled from 'styled-components';
import { Form, Button } from 'antd';

export const FormWrapper = styled(Form)`
    max-width: 700px;
`;

export const FormRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .ant-form-item {
        margin-bottom: 0;
        flex: 1;
    }
`;

export const FormLabel = styled.span`
    width: 150px;
    font-size: 15px;
    color: #555;
    padding-right: 20px;
    text-align: right;
    flex-shrink: 0;
`;

export const FormControl = styled.div`
    flex: 1;
`;

export const SaveButton = styled(Button)`
    background-color: #326e51;
    border-color: #326e51;
    font-weight: 500;
    height: 40px;
    padding: 0 30px;

    &:hover, &:focus {
        background-color: #2b5a41;
        border-color: #2b5a41;
    }
`;