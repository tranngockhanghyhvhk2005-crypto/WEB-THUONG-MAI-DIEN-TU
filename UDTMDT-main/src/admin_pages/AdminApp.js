import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import GlobalStyle from '../GlobalStyle';

function AdminApp() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <AppRoutes />
    </AuthProvider>
  );
}

export default AdminApp;