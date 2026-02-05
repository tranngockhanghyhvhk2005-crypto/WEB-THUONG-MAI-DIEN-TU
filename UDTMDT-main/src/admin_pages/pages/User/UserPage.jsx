import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/img/avatar.jpg';
import { UserWrapper, UserPageHeader, UserFilter } from './style';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async (page, search = '') => {
    try {
      setLoading(true);
      const params = { page, limit, search };
      const response = await apiService.get('/users/all-users', { params });

      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [fetchUsers, currentPage, searchTerm]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      try {
        await apiService.delete(`/users/${id}`);
        toast.success('Xóa thành công');
        fetchUsers(currentPage, searchTerm);
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  return (
    <UserWrapper>
      <UserPageHeader>
        <h2>Users Management</h2>
        <Link to="/admin/user/add" className="btn btn-primary">
          <i className="fas fa-plus"></i> Add User
        </Link>
      </UserPageHeader>

      <UserFilter>
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </UserFilter>

      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            {/* --- SỬA GIAO DIỆN TẠI ĐÂY --- */}
                            <div className="user-item">
                              <img
                                src={user.avatar || defaultAvatar}
                                alt="Avatar"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar }}
                              />
                              <div className="user-name">
                                {user.fullname || `${user.lastName || ''} ${user.firstName || ''}`.trim() || 'No Name'}
                              </div>
                            </div>
                            {/* ----------------------------- */}
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-light text-dark'}`}>
                              {user.role?.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-end">
                            {user.role !== 'admin' && (
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="text-center">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </UserWrapper>
  );
};

export default UserPage;