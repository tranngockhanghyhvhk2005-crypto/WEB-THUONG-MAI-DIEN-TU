import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { UserWrapper, UserPageHeader } from './style';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer'
  });

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiService.get(`/users/get-details/${id}`);
        const user = response.data.data;
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'customer'
        });
      } catch (error) {
        toast.error('Không tìm thấy user');
        navigate('/admin/users');
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.put(`/users/update/${id}`, formData);
      toast.success('Cập nhật thành công!');
      navigate('/admin/users');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserWrapper>
      <UserPageHeader>
        <h2>Edit User</h2>
        <Link to="/admin/users" className="btn btn-secondary">Back</Link>
      </UserPageHeader>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} disabled style={{backgroundColor: '#e9ecef'}} />
                </div>
                <div className="col-md-6 mb-3">
                    <label>Phone</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserEditPage;