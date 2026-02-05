import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Trang không tồn tại</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/admin/">Quay về Trang chủ</Link>
    </div>
  );
};

export default NotFoundPage;