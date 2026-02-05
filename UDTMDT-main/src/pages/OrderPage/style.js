import styled from 'styled-components';
import { Button, Checkbox, Row, Col } from 'antd';

export const WrapperContainer = styled.div`
  background-color: #efefef;
  padding: 20px;
  min-height: 80vh;
`;

export const WrapperBody = styled(Row)`
  width: 1270px;
  margin: 0 auto;
`;

export const WrapperLeftCol = styled(Col)`
  padding-right: 20px;
`;

export const WrapperRightCol = styled(Col)``;

export const WrapperCartHeader = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

export const WrapperCartItem = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

export const ItemCheckbox = styled(Checkbox)`
  width: 5%;
`;

export const WrapperItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 40%;
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #eee;
  }
`;

export const ItemName = styled.div`
  width: 50%;
  font-size: 16px;
  font-weight: 500;
`;

export const ItemPrice = styled.div`
  width: 25%;
  font-size: 16px;
  color: #333;;
`;

export const OriginalPrice = styled.span`
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
  margin-right: 8px;
`;

export const ItemQuantity = styled.div`
  width: 15%;
`;

export const ItemTotalPrice = styled.div`
  width: 10%;
  font-size: 16px;
  font-weight: 600;
  color: #326e51;
  text-align: center;
`;

export const ItemAction = styled.div`
  width: 5%;
  text-align: right;
`;

export const WrapperSummary = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 16px;
  color: #555;
`;

export const WrapperTotal = styled(SummaryRow)`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border-top: 1px solid #f0f0f0;
  margin-top: 10px;
`;

export const TotalPriceText = styled.span`
  color: #326e51;
  font-size: 22px;
`;

export const CheckoutButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background-color: #326e51;
  color: #fff;
  border: none;
  margin-top: 20px;

  &:hover {
    background-color: #2b5a41;
    color: #326e51 !important;
  }
`;