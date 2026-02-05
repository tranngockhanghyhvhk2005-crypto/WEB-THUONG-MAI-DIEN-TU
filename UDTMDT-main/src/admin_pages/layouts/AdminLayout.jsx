import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SidebarComponent/SidebarComponent';
import Header from '../components/HeaderComponent/HeaderComponent';
import { Outlet } from 'react-router-dom';
import { MainWrapper, PageWrapper, ContentContainer } from './AdminLayout.style';

const AdminLayout = () => {
  const [isSidebarCondensed, setIsSidebarCondensed] = useState(false);

  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCondensed(!isSidebarCondensed);
  };

  return (
    <MainWrapper>
      <Sidebar isCondensed={isSidebarCondensed} onToggle={toggleSidebar} />
      <Header 
        onToggleSidebar={toggleSidebar}
        className={isSidebarCondensed ? 'condensed' : ''}
      />
      <PageWrapper className={isSidebarCondensed ? 'condensed' : ''}>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </PageWrapper>
    </MainWrapper>
  );
};

export default AdminLayout;