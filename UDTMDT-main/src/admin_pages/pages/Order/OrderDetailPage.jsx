import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { OrderWrapper, OrderHeader } from './style';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/order/get-details-order/${id}`);
        setOrder(response.data.data); // API trả về { status: 'OK', data: order }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Lỗi tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!order) return <div className="text-center mt-5">Order not found</div>;

  const { shippingAddress } = order;

  // Logic hiển thị Badge thanh toán giống trang danh sách
  const renderPaymentStatus = () => {
    const isCod = (order.paymentMethod || '').toLowerCase().includes('cod');

    if (order.isPaid) {
      return <span className="badge bg-success" style={{ fontSize: '14px' }}>Paid {isCod ? '(COD)' : ''}</span>;
    }
    return <span className="badge bg-danger" style={{ fontSize: '14px' }}>Not Paid</span>;
  };

  return (
    <OrderWrapper>
      <OrderHeader>
        <div><h2>Order Detail #{order._id.substring(0, 8).toUpperCase()}</h2></div>
        <div><Link to="/admin/orders" className="btn btn-secondary">Back</Link></div>
      </OrderHeader>

      <div className="row">
        {/* Cột Sản phẩm */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột Thông tin */}
        <div className="col-lg-4">
          <div className="card mb-3">
            <div className="card-header">Customer Info</div>
            <div className="card-body">
              <p><strong>Name:</strong> {shippingAddress.fullName}</p>
              <p><strong>Phone:</strong> {shippingAddress.phone}</p>
              <p><strong>Address:</strong> {`${shippingAddress.address}, ${shippingAddress.city}`}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header font-weight-bold">Payment Info</div>
            <div className="card-body">
              <p><strong>Method:</strong> <span style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</span></p>
              <p><strong>Paid:</strong> {renderPaymentStatus()}</p>
              <p><strong>Status:</strong>
                <span className={`badge ms-2 ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>
                  {order.status || 'Pending'}
                </span>
              </p>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Items Price:</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span>{formatCurrency(order.shippingPrice)}</span>
              </div>

              {/* --- HIỂN THỊ COUPON --- */}
              {order.couponCode && (
                  <div className="d-flex justify-content-between text-success">
                    <span>
                        Coupon (<strong>{order.couponCode}</strong>):
                    </span>
                    <span>- {formatCurrency(order.discountPrice)}</span>
                  </div>
              )}

              <div className="d-flex justify-content-between fw-bold mt-2">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </OrderWrapper>
  );
};

export default OrderDetailPage;