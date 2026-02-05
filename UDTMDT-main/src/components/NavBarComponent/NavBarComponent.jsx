import React, { useEffect, useState } from 'react';
import { WrapperContent, WrapperLableText, WrapperTextValue } from './style'; 
import { Checkbox, Rate, Spin, InputNumber, Button } from 'antd'; 
import { FilterOutlined } from '@ant-design/icons'; // Icon Filter
import { useSearchParams } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';

const NavBarComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State dữ liệu
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // State ô nhập giá
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  // --- 1. CALL API LẤY DANH MỤC & THƯƠNG HIỆU ---
  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const [resCat, resBrand] = await Promise.all([
            ProductService.getAllCategories(), 
            ProductService.getAllBrands()     
        ]);

        if (resCat?.status === 'OK') setCategories(resCat.data || []);
        if (resBrand?.status === 'OK') setBrands(resBrand.data?.map(b => ({ label: b.name, value: b._id })) || []);
      } catch (error) {
        console.error("Lỗi tải bộ lọc:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  // --- 2. ĐỒNG BỘ URL VÀO Ô INPUT GIÁ ---
  useEffect(() => {
      setPriceFrom(searchParams.get('price_from') || '');
      setPriceTo(searchParams.get('price_to') || '');
  }, [searchParams]);

  // --- HANDLERS ---

  // Xử lý Lọc Giá
  const handleApplyPrice = () => {
      const newParams = new URLSearchParams(searchParams);
      if (priceFrom) newParams.set('price_from', priceFrom); else newParams.delete('price_from');
      if (priceTo) newParams.set('price_to', priceTo); else newParams.delete('price_to');
      newParams.set('page', 1); 
      setSearchParams(newParams);
  };

  // Xử lý Lọc Thương hiệu (Chọn nhiều)
  const handleBrandChange = (checkedValues) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('brand'); // Xóa cũ
    if (checkedValues.length > 0) {
        checkedValues.forEach(val => newParams.append('brand', val)); 
    }
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  // Xử lý Lọc Danh mục / Rating (Chọn 1)
  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(key) === String(value)) newParams.delete(key); else newParams.set(key, value);
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  // --- RENDER CONTENT ---
  const renderContent = (type, options) => {
    switch (type) {
      case 'text': // Danh mục
        return options.map((option, index) => { 
          const isActive = searchParams.get('category') === option._id;
          return (
            <WrapperTextValue 
              key={index} 
              style={{ 
                  color: isActive ? '#326e51' : '#333', 
                  fontWeight: isActive ? '700' : '400',
                  padding: '4px 0',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
              }}
              onClick={() => handleFilter('category', option._id)}
            >
              {option.name}
            </WrapperTextValue>
          )
        })

      case 'checkbox': // Thương hiệu
        return (
          <Checkbox.Group 
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }} 
            onChange={handleBrandChange}
            value={searchParams.getAll('brand')}
          >
            {options.map((option, index) => (
              <Checkbox key={index} value={option.value} style={{ marginLeft: 0 }}>
                  {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )

      case 'star': // Rating
        return options.map((option, index) => (
            <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', marginBottom: '8px'}} onClick={() => handleFilter('rating', option)}>
                <Rate style={{fontSize: '12px', color: '#ffc107'}} disabled defaultValue={option} />
                <span style={{fontSize: '13px', color: searchParams.get('rating') == option ? '#326e51' : '#555', fontWeight: searchParams.get('rating') == option ? 'bold' : 'normal'}}>
                    từ {option} sao
                </span>
            </div>
        ))
      default: return null
    }
  }

  if (loading) return <div style={{padding: 20, textAlign: 'center'}}><Spin /></div>;
  
  return (
    <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      
      {/* 1. DANH MỤC */}
      <WrapperLableText style={{marginBottom: '10px'}}>Danh mục</WrapperLableText>
      <WrapperContent>{renderContent('text', categories)}</WrapperContent>
      
      <div style={{ margin: '15px 0', borderBottom: '1px solid #f0f0f0' }}></div>

      {/* 2. THƯƠNG HIỆU */}
      <WrapperLableText style={{marginBottom: '10px'}}>Thương hiệu</WrapperLableText>
      <WrapperContent>{renderContent('checkbox', brands)}</WrapperContent>
      
      <div style={{ margin: '15px 0', borderBottom: '1px solid #f0f0f0' }}></div>

      {/* 3. ĐÁNH GIÁ */}
      <WrapperLableText style={{marginBottom: '10px'}}>Đánh giá</WrapperLableText>
      <WrapperContent>{renderContent('star', [5, 4, 3])}</WrapperContent>

      <div style={{ margin: '15px 0', borderBottom: '1px solid #f0f0f0' }}></div>

      {/* 4. KHOẢNG GIÁ (GIAO DIỆN ĐẸP) */}
      <WrapperLableText style={{marginBottom: '10px'}}>Khoảng giá (VNĐ)</WrapperLableText>
      <div style={{ 
          padding: '12px', 
          borderRadius: '6px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #eee'
      }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px', marginBottom: '10px' }}>
              <InputNumber 
                  placeholder="0" 
                  style={{ width: '100%', borderRadius: '4px', fontSize: '12px' }} 
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={setPriceFrom}
                  value={priceFrom}
                  size="middle"
                  min={0}
              />
              <span style={{ color: '#aaa' }}>-</span>
              <InputNumber 
                  placeholder="Max" 
                  style={{ width: '100%', borderRadius: '4px', fontSize: '12px' }} 
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={setPriceTo}
                  value={priceTo}
                  size="middle"
                  min={0}
              />
          </div>
          <Button 
              type="primary" 
              icon={<FilterOutlined />} 
              block 
              style={{ 
                  background: '#326e51', 
                  borderColor: '#326e51', 
                  fontWeight: '600', 
                  borderRadius: '4px',
                  height: '35px'
              }}
              onClick={handleApplyPrice}
          >
              Áp dụng
          </Button>
      </div>

    </div>
  )
}

export default NavBarComponent;