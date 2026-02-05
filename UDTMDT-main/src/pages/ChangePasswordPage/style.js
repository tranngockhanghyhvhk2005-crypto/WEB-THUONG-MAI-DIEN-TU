import { Button } from 'antd';
import styled from 'styled-components';

// --- Các style layout này copy từ ProfilePage để đảm bảo đồng nhất ---
export const WrapperContainer = styled.div`
  background-color: #efefef;
  padding: 20px 0;
  min-height: 80vh;
`;

export const WrapperContent = styled.div`
  width: 1270px;
  margin: 0 auto;
  display: flex;
  background-color: #fff;
  border-radius: 8px;
`;

export const WrapperSidebar = styled.div`
  flex: 0 0 220px;
  border-right: 1px solid #f0f0f0;
`;

export const WrapperMainContent = styled.div`
  flex: 1;
  padding: 20px 30px;
`;

// --- Style riêng cho trang Đổi Mật Khẩu ---

export const PasswordHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

export const PasswordSubtitle = styled.p`
  font-size: 14px; 
  color: #555;
  margin-bottom: 30px;
`;

export const FormWrapper = styled.div`
  max-width: 500px; /* Giới hạn chiều rộng form giống Shopee */
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
  width: 150px; /* Label rộng hơn cho "Xác nhận mật khẩu" */
  text-align: right;
  padding-right: 20px;
  color: #555;
  font-size: 15px;
`;

export const FormControl = styled.div`
  flex: 1;
`;

export const ConfirmButton = styled(Button)`
  background-color: #326e51; /* Dùng màu xanh chủ đạo của bạn */
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  padding: 0 30px;
  border: none;
  margin-left: 150px; /* Căn lề với các label */

  /* Sửa lỗi hover (thêm màu xanh đậm) */
  &:hover {
    background-color: #2b5a41;
    color: #fff !important;
  }
`;