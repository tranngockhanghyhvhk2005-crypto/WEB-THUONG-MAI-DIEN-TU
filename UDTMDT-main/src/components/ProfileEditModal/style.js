import { Button } from 'antd';
import styled from 'styled-components';

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
  width: 130px;
  text-align: right;
  padding-right: 20px;
  color: #555;
  font-size: 15px;
  flex-shrink: 0;
`;

export const FormControl = styled.div`
  flex: 1;
`;

export const SaveButton = styled(Button)`
  background-color: #326e51;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  padding: 0 30px;
  border: none;
  
  &:hover {
    background-color: #2b5a41;
    color: #fff !important;
  }
`;