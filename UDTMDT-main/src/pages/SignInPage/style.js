import { Input } from 'antd'
import styled from 'styled-components'

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0px 0px 10px;
    font-size: 24px;
    font-weight: 600;
    color: #000;
  }

  p {
    font-size: 15px;
    margin-bottom: 20px;
    color: #666;
  }
`

export const WrapperContainerRight = styled.div`
  width: 300px;
  background: linear-gradient(136deg, #326e51 -1%, #4a9d7a 85%);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 0 6px 6px 0;

  h4 {
    color: #fff;
    font-size: 17px;
    font-weight: 500;
    margin: 0;
  }
`

export const WrapperTextLight = styled.span`
  color: #326e51;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

export const WrapperInputStyle = styled(Input)`
  border-top: none;
  border-right: none;
  border-left: none;
  outline: none;
  margin-bottom: 20px;
  padding: 8px 0;
  font-size: 14px;

  &:focus {
    box-shadow: none;
    border-color: #326e51;
  }
`

export const WrapperButtonStyle = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: none;
  background-color: #326e51;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin: 20px 0 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2a5d44;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(50, 110, 81, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`