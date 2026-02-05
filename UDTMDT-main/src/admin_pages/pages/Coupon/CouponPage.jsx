import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal'; // Đảm bảo bạn có component này
import { 
  CouponWrapper, 
  PageHeader, 
  SearchSection 
} from './style';

// Hàm format tiền
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
// Hàm format ngày (YYYY-MM-DD) cho input date
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'fixed', // 'fixed' hoặc 'percent'
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    startDate: '',
    endDate: '',
    usageLimit: 100
  });

  // Lấy danh sách Coupon
  const fetchCoupons = useCallback(async (page, search = '') => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search };
      const res = await apiService.get('/coupons', { params });
      
      setCoupons(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (error) {
      toast.error('Lỗi tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons(currentPage, searchTerm);
  }, [fetchCoupons, currentPage, searchTerm]);

  // Xử lý Form Modal
  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setIsEdit(true);
      setEditId(coupon._id);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
        startDate: formatDateForInput(coupon.startDate),
        endDate: formatDateForInput(coupon.endDate),
        usageLimit: coupon.usageLimit
      });
    } else {
      setIsEdit(false);
      setEditId(null);
      setFormData({
        code: '', discountType: 'fixed', discountValue: 0,
        minOrderValue: 0, maxDiscountAmount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '', usageLimit: 100
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await apiService.put(`/coupons/${editId}`, formData);
        toast.success('Cập nhật mã thành công');
      } else {
        await apiService.post('/coupons', formData);
        toast.success('Tạo mã mới thành công');
      }
      setShowModal(false);
      fetchCoupons(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Xử lý Actions khác
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mã này?')) {
      try {
        await apiService.delete(`/coupons/${id}`);
        toast.success('Xóa thành công');
        fetchCoupons(currentPage, searchTerm);
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await apiService.put(`/coupons/status/${coupon._id}`);
      toast.success('Cập nhật trạng thái thành công');
      fetchCoupons(currentPage, searchTerm);
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  return (
    <CouponWrapper>
      <PageHeader>
        <h2>Coupon Management</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal(null)}>
          <i className="fas fa-plus"></i> Add Coupon
        </button>
      </PageHeader>

      <SearchSection>
        <input 
          type="text" 
          placeholder="Search coupon code..." 
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchSection>

      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="8" className="text-center">Loading...</td></tr> : 
               coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td><strong>{coupon.code}</strong></td>
                  <td>
                    <span className={`badge ${coupon.discountType === 'percent' ? 'bg-info' : 'bg-success'}`}>
                      {coupon.discountType === 'percent' ? '%' : 'Fixed'}
                    </span>
                  </td>
                  <td>
                    {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                  </td>
                  <td>{formatCurrency(coupon.minOrderValue)}</td>
                  <td>{coupon.usedCount} / {coupon.usageLimit}</td>
                  <td>{new Date(coupon.endDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Switch 
                      onChange={() => handleToggleStatus(coupon)} 
                      checked={coupon.status}
                      height={16} width={36}
                    />
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleOpenModal(coupon)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(coupon._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* MODAL FORM */}
      <Modal 
        title={isEdit ? "Edit Coupon" : "Add New Coupon"}
        show={showModal} 
        onClose={() => setShowModal(false)}
        footer={
            <>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
            </>
        }
      >
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Coupon Code</label>
              <input type="text" className="form-control" value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                disabled={isEdit} required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Discount Type</label>
              <select className="form-select" value={formData.discountType}
                onChange={e => setFormData({...formData, discountType: e.target.value})}>
                <option value="fixed">Fixed Amount (VND)</option>
                <option value="percent">Percentage (%)</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>Value</label>
              <input type="number" className="form-control" value={formData.discountValue}
                onChange={e => setFormData({...formData, discountValue: e.target.value})} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Min Order Value</label>
              <input type="number" className="form-control" value={formData.minOrderValue}
                onChange={e => setFormData({...formData, minOrderValue: e.target.value})} />
            </div>
            
            {/* Chỉ hiện Max Discount nếu là % */}
            {formData.discountType === 'percent' && (
              <div className="col-md-6 mb-3">
                <label>Max Discount Amount</label>
                <input type="number" className="form-control" value={formData.maxDiscountAmount}
                  onChange={e => setFormData({...formData, maxDiscountAmount: e.target.value})} />
              </div>
            )}

            <div className="col-md-6 mb-3">
              <label>Usage Limit</label>
              <input type="number" className="form-control" value={formData.usageLimit}
                onChange={e => setFormData({...formData, usageLimit: e.target.value})} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Start Date</label>
              <input type="date" className="form-control" value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="col-md-6 mb-3">
              <label>End Date</label>
              <input type="date" className="form-control" value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})} required />
            </div>
          </div>
        </form>
      </Modal>
    </CouponWrapper>
  );
};

export default CouponPage;