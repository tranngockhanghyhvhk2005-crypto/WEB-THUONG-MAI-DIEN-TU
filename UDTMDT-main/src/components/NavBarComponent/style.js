import styled from 'styled-components'

export const WrapperLableText = styled.h4`
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px 0;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;

  &:first-child {
    margin-top: 0;
  }
`

export const WrapperTextValue = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  padding: 6px 0;
  display: block;
  transition: all 0.2s ease;
  
  &:hover {
    color: #326e51;
    padding-left: 4px;
  }
`

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .ant-checkbox-wrapper {
    margin-left: 0;
    font-size: 14px;
    
    &:hover {
      .ant-checkbox-inner {
        border-color: #326e51;
      }
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #326e51;
    border-color: #326e51;
  }

  .ant-rate {
    color: #ffce3d;
  }
`

export const WrapperTextPrice = styled.div`
  padding: 8px 12px;
  color: #333;
  border-radius: 6px;
  background-color: #f5f5f5;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    background-color: #326e51;
    color: #fff;
  }
`