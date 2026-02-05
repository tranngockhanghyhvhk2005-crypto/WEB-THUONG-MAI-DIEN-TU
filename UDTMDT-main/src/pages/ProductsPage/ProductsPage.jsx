import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Pagination } from 'antd';

import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';

import {
  WrapperContainer,
  WrapperContent,
  WrapperSidebar,
  WrapperMainContent,
  PageTitle
} from '../ProfilePage/style';

import {
  ProductList,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice
} from './style';

const ProductsPage = () => {
  const location = useLocation();

  // --- State ---
  const [products, setProducts] = useState([]);       // danh sách sản phẩm
  const [loading, setLoading] = useState(true);       // trạng thái loading
  const [currentPage, setCurrentPage] = useState(1);  // trang hiện tại
  const [total, setTotal] = useState(0);              // tổng số sản phẩm

  const pageSize = 8; // số sản phẩm/trang

  // Khi query string thay đổi (search, filter), reset page về 1
  useEffect(() => {
    setCurrentPage(1);
  }, [location.search]);

  // --- Lấy dữ liệu sản phẩm từ API ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams(location.search);

        params.set('page', currentPage);
        params.set('limit', pageSize);

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        setProducts(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total ?? 0);
      } catch (error) {
        console.error("Không thể tải sản phẩm:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, location.search]);

  // --- Thay đổi trang ---
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProductVariation = (product) => {
    const first = product?.variations?.[0];
    return {
      price: first?.price || 0,
      image: first?.image || 'https://via.placeholder.com/200'
    };
  };

  return (
    <WrapperContainer>
      <WrapperContent>
        <WrapperSidebar>
          <ProfileSidebar />
        </WrapperSidebar>

        <WrapperMainContent>
          <PageTitle>Tất cả sản phẩm</PageTitle>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              Đang tải sản phẩm...
            </div>
          ) : (
            <>
              {/* Danh sách sản phẩm */}
              <ProductList>
                {products.length === 0 ? (
                  <p>Không tìm thấy sản phẩm nào.</p>
                ) : (
                  products.map((product) => {
                    const { price, image } = getProductVariation(product);
                    return (
                      <ProductCard
                        key={product._id}
                        to={`/product-detail/${product._id}`}
                      >
                        <ProductImage src={image} alt={product.name} />
                        <ProductInfo>
                          <ProductName>{product.name}</ProductName>
                          <ProductPrice>
                            {price
                              ? `${price.toLocaleString('vi-VN')} đ`
                              : 'Đang cập nhật'}
                          </ProductPrice>
                        </ProductInfo>
                      </ProductCard>
                    );
                  })
                )}
              </ProductList>

              {/* Pagination */}
              {products.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </WrapperMainContent>
      </WrapperContent>
    </WrapperContainer>
  );
};

export default ProductsPage;
