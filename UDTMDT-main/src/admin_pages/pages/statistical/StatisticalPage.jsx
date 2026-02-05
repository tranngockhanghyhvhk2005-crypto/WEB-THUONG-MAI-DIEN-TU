import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../../services/apiService';
import { StatisticalWrapper, StatisticalHeader, DateRangePicker, StatisticsCards, StatCard, ChartSection, TopProducts } from './style'

const StatisticalPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // Tải dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllOrders();
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
          const months = getDistinctMonths(response.data.data);
          setSelectedMonth(''); // Reset to all months
          updateChartData(response.data.data, '');
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Lọc đơn hàng theo tháng
  const filterOrdersByMonth = (orders, month) => {
    if (!month) return orders;
    return orders.filter(order => {
      const orderMonth = new Date(order.createdAt).getMonth() + 1;
      return orderMonth.toString() === month;
    });
  };

  // Tính doanh thu theo tháng
  const calculateRevenueByMonth = (orders) => {
    const revenueByMonth = {};
    orders.forEach(order => {
      // Chỉ tính đơn hàng đã giao (status === 3)
      if (order.status === 3) {
        const month = new Date(order.createdAt).getMonth() + 1;
        if (!revenueByMonth[month]) revenueByMonth[month] = 0;

        let orderTotal = 0;
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            orderTotal += (item.product?.price || 0) * (item.quantity || 0);
          });
        }
        orderTotal -= order.discount || 0;
        revenueByMonth[month] += orderTotal;
      }
    });
    return revenueByMonth;
  };

  // Cập nhật dữ liệu biểu đồ
  const updateChartData = (orders, month) => {
    const filteredOrders = filterOrdersByMonth(orders, month);
    const revenueByMonth = calculateRevenueByMonth(filteredOrders);

    const data = {
      labels: Object.keys(revenueByMonth).map(month => `Tháng ${month}`),
      datasets: [{
        label: 'Doanh Thu',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: Object.values(revenueByMonth)
      }]
    };

    setChartData(data);
    setChartOptions({
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString('vi-VN') + 'đ';
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Doanh Thu Theo Tháng'
        }
      }
    });
  };

  // Xử lý thay đổi tháng
  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateChartData(orders, month);
  };

  // Lấy danh sách tháng có dữ liệu
  const getDistinctMonths = (orders) => {
    const months = new Set();
    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth() + 1;
      months.add(month.toString());
    });
    return Array.from(months).sort((a, b) => parseInt(a) - parseInt(b));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const months = getDistinctMonths(orders);

  return (
    <div>
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">Thống Kê Doanh Thu</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col">
                  <h5 className="card-title">Biểu đồ doanh thu</h5>
                </div>
                <div className="col-auto">
                  <select
                    className="form-control"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    <option value="">Tất cả tháng</option>
                    {months.map(month => (
                      <option key={month} value={month}>Tháng {month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body">
              <canvas id="revenueChart" width="400" height="200"></canvas>
              <div className="mt-3">
                <p>Tổng doanh thu: {Object.values(calculateRevenueByMonth(filterOrdersByMonth(orders, selectedMonth))).reduce((a, b) => a + b, 0).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalPage;
