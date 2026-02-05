import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WrapperContainer,
  WrapperContent,
  PageTitle,
  LockIcon,
  Message,
  SubMessage,
  ActionButtons,
  HomeButton,
  ContactButton
} from './style';

const AccountLockedPage = () => {
  const navigate = useNavigate();

  return (
    <WrapperContainer>
      <WrapperContent>
        <PageTitle>Tài khoản bị khóa</PageTitle>
        <LockIcon>🔒</LockIcon>
        
        <Message>
          Rất tiếc, tài khoản của bạn đã bị vô hiệu hóa do vi phạm chính sách hoặc vấn đề bảo mật.
        </Message>
        
        <SubMessage>
          Vui lòng liên hệ với quản trị viên hoặc bộ phận hỗ trợ để biết thêm chi tiết.
        </SubMessage>
        
        <ActionButtons>
          <HomeButton onClick={() => navigate('/')}>
            Về trang chủ
          </HomeButton>
          {}
          <ContactButton onClick={() => navigate('/contact')}>
            Liên hệ hỗ trợ
          </ContactButton>
        </ActionButtons>
      </WrapperContent>
    </WrapperContainer>
  );
};

export default AccountLockedPage;