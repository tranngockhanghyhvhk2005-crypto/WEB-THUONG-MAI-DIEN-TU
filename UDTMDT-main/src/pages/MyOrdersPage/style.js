import styled from 'styled-components';
import { Tabs } from 'antd';

export const WrapperTabs = styled(Tabs)`
  .ant-tabs-tab {
    font-size: 16px;
    font-weight: 500;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #326e51; 
  }
  .ant-tabs-ink-bar {
    background-color: #326e51;
  }
`;

export const WrapperOrderCard = styled.div`
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fff;
`;

export const WrapperOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const OrderStatus = styled.span`
  color: #326e51;
  font-weight: 600;
  text-transform: uppercase;
`;

export const WrapperProductItem = styled.div`
  display: flex;
  padding: 20px;
  gap: 15px;
  border-bottom: 1px solid #f0f0f0;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #eee;
  }
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ProductName = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
`;

export const ProductQuantity = styled.div`
  font-size: 14px;
  color: #555;
`;

export const WrapperOrderFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
  gap: 10px;
  background-color: #fcfcfc;
`;

export const TotalPrice = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #326e51;
`;