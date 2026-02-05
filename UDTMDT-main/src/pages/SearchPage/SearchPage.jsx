import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Spin, Pagination } from 'antd';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperProducts } from '../HomePage/style'; 
import axios from 'axios';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  //2. CẬP NHẬT PAGE SIZE = 6 
  const pageSize = 6; 

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  // Dùng useRef để lưu từ khóa tìm kiếm của lần trước
  const prevQuery = useRef(query);

  const fetchProducts = useCallback(async (searchQuery, page) => {
    setLoading(true);
    
    // Nếu không có từ khóa thì tìm chuỗi rỗng để tránh lỗi undefined
    const text = searchQuery || ''; 
    const url = `http://localhost:8080/api/products?search=${text}&page=${page}&limit=${pageSize}`;

    try {
      const response = await axios.get(url);
      
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setTotalProducts(response.data.total || response.data.data.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setProducts([]);
      setTotalProducts(0);
    }
    setLoading(false);
  }, [pageSize]);

  // === 3. LOGIC SỬA LỖI PHÂN TRANG ===
  useEffect(() => {
    // Trường hợp A: Người dùng nhập từ khóa tìm kiếm MỚI
    if (query !== prevQuery.current) {
      setCurrentPage(1); // Reset giao diện về số 1
      prevQuery.current = query; // Cập nhật lại ref
      fetchProducts(query, 1); // Gọi ngay API trang 1
    } 
    // Trường hợp B: Từ khóa cũ, người dùng chỉ bấm chuyển trang (Trang 2, 3...)
    else {
      fetchProducts(query, currentPage);
    }
  }, [query, currentPage, fetchProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#efefef', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ width: '1270px', margin: '0 auto', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#333' }}>
          Kết quả tìm kiếm cho từ khóa: "**{query}**"
        </h3>
        <Spin spinning={loading}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <WrapperProducts>
              {products.length === 0 && !loading ? (
                <div style={{ textAlign: 'center', fontSize: '16px', padding: '50px' }}>
                  Không tìm thấy sản phẩm nào.
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {products.map((product) => {
                    if (!product.variations || product.variations.length === 0) {
                      return null; 
                    }
                    const firstVariation = product.variations[0];
                    const price = firstVariation.price;
                    const originalPrice = firstVariation.originalPrice;
                    let discount = 0;
                    if (originalPrice && price < originalPrice) {
                      discount = Math.round(((originalPrice - price) / originalPrice) * 100);
                    }
                    const imageUrl = firstVariation.image || product.images?.[0]?.url;
                    
                    // Lấy rating để hiển thị cho đẹp (nếu có)
                    const averageRating = product.reviewSummary?.averageRating || 0;

                    return (
                      // Đã điều chỉnh cột để hiển thị 6 sản phẩm
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} key={product._id}>
                        <CardComponent
                          id={product._id}
                          image={imageUrl} 
                          name={product.name}
                          price={price}
                          discount={discount}
                          rating={averageRating}
                          sold={product.sold || 0}
                        />
                      </Col>
                    );
                  })}
                </Row>
              )}
            </WrapperProducts>
            
            {totalProducts > pageSize && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <Pagination
                  current={currentPage}
                  total={totalProducts} 
                  pageSize={pageSize} 
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default SearchPage;