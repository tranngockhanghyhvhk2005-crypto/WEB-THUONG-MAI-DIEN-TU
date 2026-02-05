import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Modal from '../../components/Modal/Modal';
import { ProductAddHeader as WrapperHeader } from '../ProductAdd/style'; 
import './style.js';

import { 
  BrandWrapper,
  PageHeader,
  SearchSection,
  TableCard,
  TableResponsive,
  LoadingWrapper,
  NoDataMessage,
  ModalContent
} from './style';

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null); 
  
  const [brandName, setBrandName] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await apiService.get('/brand/get-all');
      if (res.data.status === 'OK') {
        setBrands(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      toast.error('Không thể tải danh sách thương hiệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentBrandId(null);
    setBrandName('');
    setShowModal(true);
  };

  const openEditModal = (brand) => {
    setIsEditMode(true);
    setCurrentBrandId(brand._id);
    setBrandName(brand.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // --- SUBMIT JSON (Đơn giản hơn nhiều) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName) {
      toast.error('Tên thương hiệu không được để trống.');
      return;
    }

    setFormLoading(true);
    try {
      const payload = { name: brandName }; // Gửi JSON thường

      let res;
      if (isEditMode) {
          res = await apiService.put(`/brand/update/${currentBrandId}`, payload);
      } else {
          res = await apiService.post('/brand/create', payload);
      }
      
      if (res.data.status === 'OK') {
          toast.success(isEditMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
          closeModal();
          fetchBrands();
      } else {
          toast.error(res.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi lưu brand:', error);
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lưu.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (brand) => {
    toast((t) => (
      <span>
        Xóa thương hiệu <b>{brand.name}</b>?
        <div style={{ marginTop: '8px' }}>
            <button className="btn btn-danger btn-sm me-2" onClick={() => confirmDelete(brand._id, t.id)}>Xóa ngay</button>
            <button className="btn btn-secondary btn-sm" onClick={() => toast.dismiss(t.id)}>Hủy</button>
        </div>
      </span>
    ), { duration: 5000 });
  };

  const confirmDelete = async (id, toastId) => {
      toast.dismiss(toastId);
      const loadingToast = toast.loading('Đang xóa...');
      try {
          const res = await apiService.delete(`/brand/delete/${id}`);
          if (res.data.status === 'OK') {
              toast.success('Đã xóa thành công!', { id: loadingToast });
              fetchBrands();
          } else {
              toast.error(res.data.message, { id: loadingToast });
          }
      } catch (error) {
          toast.error('Lỗi khi xóa thương hiệu.', { id: loadingToast });
      }
  };

  return (
    <BrandWrapper>
      <PageHeader>
        <div className="header-row">
          <h1 className="page-title">Brands</h1>
          <button className="btn-primary" onClick={openAddModal}>
            <i className="fas fa-plus"></i> Add Brand
          </button>
        </div>
      </PageHeader>

      <SearchSection>
        <input 
          type="text"
          className="search-input"
          placeholder="Tìm kiếm thương hiệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchSection>

      <TableCard>
        <TableResponsive>
          <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>Brand ID</th>
                <th>Brand Name</th>
                <th className="text-end">Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3"><LoadingWrapper><div className="spinner-border"></div></LoadingWrapper></td></tr>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand._id}>
                    <td className="brand-id"><small style={{fontFamily: 'monospace', color: '#666', fontSize: '120%'}}>#{brand._id}</small></td>
                    <td className="brand-name" style={{fontWeight: '500', fontSize: '120%'}}>{brand.name}</td>
                    <td className="actions-cell">
                      <button className="btn btn-warning" onClick={() => openEditModal(brand)}><i className="fas fa-edit"></i></button>
                      <button className="btn btn-danger" onClick={() => handleDelete(brand)}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3"><NoDataMessage>No brands found</NoDataMessage></td></tr>
              )}
            </tbody>
          </table>
        </TableResponsive>
      </TableCard>

      <Modal
        id="brandModal"
        title={isEditMode ? "Update Brand" : "Add New Brand"}
        show={showModal}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <ModalContent>
          <div className="form-group">
            <label>Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              required
            />
          </div>
        </ModalContent>
      </Modal>
    </BrandWrapper>
  );
};

export default BrandPage;