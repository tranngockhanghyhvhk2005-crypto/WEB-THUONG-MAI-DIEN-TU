import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Pagination, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';

import TypeProduct from '../../components/TypeProduct/TypeProduct';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent';
import { WrapperTypeProduct, WrapperProducts } from './style';
import * as ProductService from '../../services/ProductService';

import slider1 from '../../assets/images/slider1.jpg';
import slider2 from '../../assets/images/slider2.jpg';
import slider3 from '../../assets/images/slider3.jpg';
import slider4 from '../../assets/images/slider4.jpg';
import slider5 from '../../assets/images/slider5.jpg';
import slider6 from '../../assets/images/slider6.jpg';
import slider7 from '../../assets/images/slider7.jpg';
import slider8 from '../../assets/images/slider8.jpg';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 8;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const prevSearchParams = useRef(searchParamsString); 
  
  const [typeProducts, setTypeProducts] = useState([]);

  // Lấy danh mục cho thanh ngang
  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllCategories();
      if(res?.status === 'OK') {
        setTypeProducts(res?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  // Lấy sản phẩm
  const fetchProducts = useCallback(async (page, currentSearchParamsString) => {
    setLoading(true);
    const currentParams = new URLSearchParams(currentSearchParamsString);
    currentParams.set('page', page);
    currentParams.set('limit', pageSize);

    try {
      // Dùng Service thay vì axios trực tiếp
      const data = await ProductService.getAllProduct(currentParams.toString());
      setProducts(data?.data || []);
      setTotalProducts(data?.total || 0);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    if (prevSearchParams.current !== searchParamsString) {
      setCurrentPage(1);
      prevSearchParams.current = searchParamsString;
      fetchProducts(1, searchParamsString);
    } else {
      fetchProducts(currentPage, searchParamsString);
    }
  }, [searchParamsString, currentPage, fetchProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (id) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', id);
      newParams.set('page', 1);
      setSearchParams(newParams);
  }

  const sliderImages = [slider1, slider2, slider3, slider4, slider5, slider6, slider7, slider8];

  return (
    <div style={{ width: '100%', backgroundColor: '#efefef' }}>
      
      {/* Thanh danh mục ngang */}
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
            <div onClick={() => { setSearchParams({}); }} style={{cursor: 'pointer'}}>
                <TypeProduct name="Tất cả" />
            </div>
            {typeProducts.map((cate) => (
                <div key={cate._id} onClick={() => handleCategoryClick(cate._id)} style={{cursor: 'pointer'}}>
                    <TypeProduct name={cate.name} />
                </div>
            ))}
        </WrapperTypeProduct>
      </div>

      {/* Slider */}
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '1270px', margin: '0 auto', paddingBottom: 20 }}>
          <SliderComponent arrImage={sliderImages} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperProducts>
          <Row gutter={20}>
            <Col span={5}>
              <NavBarComponent />
            </Col>

            <Col span={19}>
              <div style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
                <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    {searchParams.get('search') ? `Kết quả: "${searchParams.get('search')}"` : 'Sản phẩm'}
                </h2>

                <Spin spinning={loading}>
                  <Row gutter={[16, 16]}>
                    {products.length > 0 ? products.map(product => (
                        <Col xs={24} sm={12} md={12} lg={8} xl={6} key={product._id}>
                          <CardComponent
                            id={product._id}
                            countInStock={product.countInStock}
                            description={product.description}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            selled={product.selled}
                            discount={product.discount}
                            // Props quan trọng mới thêm
                            brand={product.brand}
                            isFlashSale={product.isFlashSale}
                            flashSalePrice={product.flashSalePrice}
                            variants={product.variants}
                          />
                        </Col>
                    )) : (
                      <div style={{ textAlign: 'center', width: '100%', padding: 50 }}>
                        Không tìm thấy sản phẩm.
                      </div>
                    )}
                  </Row>
                </Spin>

                {totalProducts > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30, paddingBottom: 20 }}>
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
            </Col>
          </Row>
        </WrapperProducts>
      </div>
    </div>
  );
};

export default HomePage;