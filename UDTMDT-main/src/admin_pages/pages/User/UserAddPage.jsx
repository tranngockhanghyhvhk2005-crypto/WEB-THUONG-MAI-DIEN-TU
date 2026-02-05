import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { UserWrapper, UserPageHeader } from './style'; // Tận dụng style cũ

const UserAddPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp!');
      return;
    }

    setLoading(true);
    try {
      await apiService.post('/users/create', formData);
      toast.success('Tạo user thành công!');
      navigate('/admin/users'); // Chuyển về danh sách user
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserWrapper>
      <UserPageHeader>
        <h2>Add New User</h2>
        <Link to="/admin/users" className="btn btn-secondary">Back</Link>
      </UserPageHeader>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Phone</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Role</label>
                    <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserAddPage;