import styled from 'styled-components'

export const WrapperContainer = styled.div`
  width: 1270px;
  margin: 0 auto;
  padding-top: 20px;
`

export const WrapperLeft = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
`

export const WrapperRight = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  position: sticky;
  top: 20px;
`

export const WrapperInfo = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
`

export const WrapperTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 2px solid #326e51;
`

export const WrapperMethod = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #326e51;
    background-color: #f0f9f4;
  }

  .ant-radio-wrapper {
    width: 100%;
  }

  .ant-radio-checked + span {
    color: #326e51;
  }
`

export const WrapperItemOrder = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`