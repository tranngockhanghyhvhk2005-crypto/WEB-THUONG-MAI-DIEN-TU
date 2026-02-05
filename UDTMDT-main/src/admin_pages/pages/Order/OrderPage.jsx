import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import { OrderWrapper, OrderHeader, OrderFilters } from './style'

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Hàm gọi API
  const fetchOrders = useCallback(async (page, search = '', status = '') => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        search: search,
        status: status,
      };
      const response = await apiService.get('/order/all-orders', { params });

      setOrders(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);

    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Không thể tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Lấy dữ liệu
  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [fetchOrders, currentPage, searchTerm, statusFilter]);

  // Xử lý Pagination và Search/Filter
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // --- Xử lý Actions ---

  // Cập nhật trạng thái
  const handleUpdateStatus = async (orderId, newStatus) => {
    const toastId = toast.loading('Đang cập nhật...');
    try {
      // Gọi API cập nhật
      const response = await apiService.put(`/order/status/${orderId}`, { status: newStatus });

      if (response.data.status === 'OK') {
        toast.success('Cập nhật trạng thái thành công!', { id: toastId });

        // Gọi lại hàm lấy danh sách đơn hàng
        // Việc này đảm bảo UI hiển thị đúng 100% những gì đã lưu trong DB (bao gồm isPaid: true)
        await fetchOrders(currentPage, searchTerm, statusFilter);
      } else {
        toast.error('Cập nhật thất bại: ' + response.data.message, { id: toastId });
      }

    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Lỗi hệ thống khi cập nhật.', { id: toastId });
    }
  };


  return (
    <OrderWrapper>
      <OrderHeader>
        <div>
          <h2>Orders</h2>
        </div>
      </OrderHeader>

      {/* Thanh Search & Filter */}
      <OrderFilters>
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm (Tên, SĐT khách hàng)..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-select">
          <select className="form-select" value={statusFilter} onChange={handleStatusChange}>
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </OrderFilters>

      {/* Bảng Order */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" className="text-center"><div className="spinner-border text-primary"></div></td></tr>
                    ) : orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order._id} style={{
                          // Nếu status là Cancelled thì nền màu đỏ nhạt, chữ hơi đậm
                          backgroundColor: order.status === 'Cancelled' ? '#ffe5e5' : 'transparent',
                          color: order.status === 'Cancelled' ? '#d9534f' : 'inherit'
                        }}>
                          <td><small style={{fontFamily: 'monospace', color: '#666', fontSize: '100%'}}>#{order._id.substring(0, 8).toUpperCase()}</small></td>
                          <td>{order.shippingAddress?.fullName || 'Guest'}</td>
                          <td>{order.shippingAddress?.phone || 'N/A'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{formatCurrency(order.totalPrice)}</td>
                          <td>
                            <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}
                              style={{ fontSize: '10px', padding: '6px 10px' }}>
                              {/* Nếu là COD và đã trả -> COD(Paid), ngược lại -> COD(Not Paid) */}
                              {order.paymentMethod === 'COD' || order.paymentMethod === 'Tiền mặt'
                                ? `COD ${order.isPaid ? '(Paid)' : '(Not Paid)'}`
                                : `${order.paymentMethod} ${order.isPaid ? '(Paid)' : '(Not Paid)'}`
                              }
                            </span>
                          </td>
                          <td>
                            {/* Dropdown cập nhật trạng thái */}
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              style={{
                                // Nếu đã hủy thì viền đỏ
                                borderColor: order.status === 'Cancelled' ? '#dc3545' : '',
                                color: order.status === 'Cancelled' ? '#dc3545' : '#333',
                                fontWeight: order.status === 'Cancelled' ? 'bold' : 'normal'
                              }}
                            // (Tùy chọn) Nếu muốn Admin KHÔNG ĐƯỢC CHỈNH SỬA đơn đã hủy thì thêm disabled
                            // disabled={order.status === 'Cancelled'} 
                            >
                              {ORDER_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="text-end">
                            <Link to={`/admin/order/detail/${order._id}`} className="btn btn-sm btn-info">
                              <i className="fas fa-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="text-center">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </OrderWrapper>
  );
};

export default OrderPage;