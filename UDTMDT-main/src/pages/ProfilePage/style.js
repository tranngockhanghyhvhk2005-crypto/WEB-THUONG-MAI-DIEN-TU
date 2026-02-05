import styled from 'styled-components';

// ===================================
// GIAO DIỆN CHUNG (LAYOUT)
// ===================================

export const WrapperContainer = styled.div`
  background-color: #efefef; /* Nền xám nhạt */
  padding: 20px 0;
  min-height: 80vh;
`;

export const WrapperContent = styled.div`
  width: 1270px;
  margin: 0 auto;
  display: flex;
  background-color: #fff; /* Nền trắng cho nội dung */
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

export const WrapperSidebar = styled.div`
  flex: 0 0 250px; /* Cố định chiều rộng sidebar */
  border-right: 1px solid #f0f0f0;
`;

export const WrapperMainContent = styled.div`
  flex: 1; /* Chiếm hết phần còn lại */
  padding: 20px 30px;
`;

export const PageTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
`;

// ===================================
// STYLE CHO TRANG PROFILE (HÌNH 1)
// ===================================

export const Box = styled.div`
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    margin-bottom: 20px;
`;

export const BoxHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f9f9f9; /* Nền header hơi xám */
    border-bottom: 1px solid #e0e0e0;
    border-radius: 8px 8px 0 0;
`;

export const BoxTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

export const BoxAction = styled.a`
    font-size: 14px;
    font-weight: 500;
    color: #326e51; /* Màu xanh lá */
    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export const BoxContent = styled.div`
    padding: 20px;
`;

export const InfoRow = styled.div`
    font-size: 15px;
    margin-bottom: 10px;
    line-height: 1.5;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const InfoLabel = styled.span`
    width: 200px;
    color: #777;
    margin-right: 10px;
`;

export const InfoValue = styled.span`
    color: #333;
    font-weight: 500;
`;