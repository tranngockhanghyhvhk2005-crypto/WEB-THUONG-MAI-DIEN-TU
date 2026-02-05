import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gọi API chúng ta vừa tạo ở Bước 2
        const response = await apiService.get('/statistical/dashboard');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi tải thống kê:', error);
        toast.error('Không thể tải dữ liệu Dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="content container-fluid">
      {/* --- HEADER --- */}
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">Welcome Admin!</h3>
            <ul className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- CARDS THỐNG KÊ --- */}
      <div className="row">
        {/* Card 1: Users */}
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon bg-primary">
                  <i className="fas fa-users"></i>
                </span>
                <div className="dash-count">
                  <h3>{stats.totalUsers}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Users</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-primary w-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Products */}
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon bg-success">
                  <i className="fas fa-box"></i>
                </span>
                <div className="dash-count">
                  <h3>{stats.totalProducts}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Products</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-success w-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Orders */}
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon bg-warning">
                  <i className="fas fa-shopping-cart"></i>
                </span>
                <div className="dash-count">
                  <h3>{stats.totalOrders}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Orders</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-warning w-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon bg-danger">
                  <i className="fas fa-money-bill-wave"></i>
                </span>
                <div className="dash-count">
                  {/* Format tiền tệ VND */}
                  <h3>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Revenue</h6>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-danger w-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BẢNG ĐƠN HÀNG MỚI NHẤT --- */}
      <div className="row">
        <div className="col-md-12 d-flex">
          <div className="card card-table flex-fill">
            <div className="card-header">
              <h4 className="card-title float-start">Recent Orders</h4>
              <Link to="/admin/orders" className="btn btn-outline-primary float-end">View all</Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.substring(0, 8)}...</td>
                          <td>
                            {order.user 
                              ? `${order.user.lastName || ''} ${order.user.firstName}` 
                              : 'Khách vãng lai'}
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                          </td>
                          <td>
                            <span className={`badge badge-pill ${
                              order.status === 'Delivered' ? 'bg-success' : 
                              order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">Chưa có đơn hàng nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;