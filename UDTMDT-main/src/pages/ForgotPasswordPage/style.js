import styled from 'styled-components';
import { Input } from 'antd';

export const WrapperContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: auto;
  padding: 30px 40px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  p {
    font-size: 16px;
    color: #555;
    text-align: center;
    margin-bottom: 20px;
  }
`

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
`

export const WrapperInputPasswordStyle = styled(Input.Password)`
  border-radius: 0;
  border: 1px solid #ccc;
  height: 40px;
  margin-bottom: 10px;
  .ant-input {
    height: 30px;
  }
  &:focus-within {
    border-color: #326e51;
    box-shadow: none;
  }
`
