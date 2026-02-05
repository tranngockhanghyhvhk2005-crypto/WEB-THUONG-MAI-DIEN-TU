import { Card } from 'antd'
import styled from 'styled-components'

export const WrapperCardStyle = styled(Card)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  .ant-card-body {
    padding: 12px;
  }

  .ant-card-cover {
    overflow: hidden;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  &:hover .ant-card-cover img {
    transform: scale(1.05);
  }
`

export const WrapperImageStyle = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
`

export const WrapperStyleNameCard = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #333;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
`

export const WrapperReportText = styled.div`
  font-size: 12px;
  color: #787878;
  display: flex;
  align-items: center;
`

export const WrapperPriceText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #ff424e;
`

export const WrapperDiscountText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #ff424e;
  background-color: #fff0f1;
  padding: 2px 6px;
  border-radius: 4px;
`