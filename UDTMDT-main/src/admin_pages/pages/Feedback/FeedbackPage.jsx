import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import defaultAvatar from '../../assets/img/avatar.jpg';
import * as ReviewService from '../../../services/ReviewService'; // Import Service đã tạo
import { getImageUrl } from '../../../services/ProductService'; // Hàm helper lấy ảnh (nếu có)

// --- Helper Component: Hiển thị sao ---
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i 
        key={i} 
        className={`fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: '12px', marginRight: '2px' }}
      ></i>
    );
  }
  return <>{stars}</>;
};

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Số lượng item trên 1 trang

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // --- 1. LẤY DỮ LIỆU ---
  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
          toast.error('Bạn chưa đăng nhập!');
          setLoading(false);
          return;
      }

      // Làm sạch token nếu bị thừa dấu ngoặc kép
      let cleanToken = token;
      if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
          cleanToken = cleanToken.slice(1, -1);
      }

      const res = await ReviewService.getAllReviewsSystem(cleanToken);
      
      if (res.status === 'OK') {
        setFeedbacks(res.data);
        setTotalPages(Math.ceil(res.data.length / itemsPerPage));
      } else {
        // Nếu API trả về status khác OK (ví dụ lỗi logic nào đó)
        toast.error(res.message || 'Lỗi tải dữ liệu');
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      // Kiểm tra kỹ mã lỗi để báo thông báo phù hợp
      if (error.response && error.response.status === 403) {
          toast.error('Bạn không có quyền truy cập dữ liệu này (Cần quyền Admin).');
      } else {
          toast.error('Không thể tải danh sách đánh giá.');
      }
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // --- 2. XỬ LÝ LOGIC PHÂN TRANG (Client Side) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // --- 3. XỬ LÝ MODAL ---
  const openDetailModal = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyContent(''); // Reset nội dung trả lời
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  // --- 4. XỬ LÝ TRẢ LỜI ---
  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      return toast.error('Vui lòng nhập nội dung phản hồi!');
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await ReviewService.replyReview(selectedFeedback._id, replyContent, token);

      if (res.status === 'OK') {
        toast.success('Đã gửi phản hồi thành công!');
        fetchFeedbacks(); // Load lại dữ liệu để cập nhật trạng thái
        closeModal();
      } else {
        toast.error(res.message || 'Lỗi khi gửi phản hồi');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 5. XỬ LÝ XÓA ---
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.')) {
      confirmDelete(id);
    }
  };

  const confirmDelete = async (id) => {
    const toastId = toast.loading('Đang xóa...');
    try {
      const token = localStorage.getItem('access_token');
      await ReviewService.deleteReview(id, token);
      toast.success('Đã xóa đánh giá!', { id: toastId });
      fetchFeedbacks();
    } catch (error) {
      toast.error('Xóa thất bại.', { id: toastId });
    }
  };

  // --- RENDER ---
  return (
    <>
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col">
            <h3 className="page-title">Quản lý Đánh giá & Phản hồi</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-header">
                <h4 className="card-title">Danh sách đánh giá</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Khách hàng</th>
                      <th>Đánh giá</th>
                      <th>Nội dung</th>
                      <th>Trạng thái</th>
                      <th>Ngày gửi</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : currentFeedbacks.length > 0 ? (
                      currentFeedbacks.map((fb) => (
                        <tr key={fb._id}>
                          {/* Cột Sản phẩm */}
                          <td>
                            <h2 className="table-avatar">
                              <a href="#" className="avatar avatar-sm me-2">
                                <img
                                  className="avatar-img rounded"
                                  src={fb.product?.image ? getImageUrl(fb.product.image) : defaultAvatar}
                                  alt="Product"
                                  style={{ objectFit: 'cover' }}
                                />
                              </a>
                              <a href="#" style={{ fontSize: '13px', maxWidth: '200px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {fb.product?.name || 'Sản phẩm đã xóa'}
                              </a>
                            </h2>
                          </td>

                          {/* Cột Khách hàng */}
                          <td>
                            <div className="d-flex align-items-center">
                                <img 
                                    src={fb.user?.avatar || defaultAvatar} 
                                    alt="User" 
                                    className="rounded-circle me-2" 
                                    style={{ width: '30px', height: '30px', objectFit:'cover' }} 
                                />
                                <span>{fb.user?.firstName || 'User'} {fb.user?.lastName || ''}</span>
                            </div>
                          </td>

                          {/* Cột Sao */}
                          <td style={{ minWidth: '100px' }}>
                            <StarRating rating={fb.rating} />
                          </td>

                          {/* Cột Nội dung (Rút gọn) */}
                          <td style={{ maxWidth: '200px' }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#555' }}>
                                {fb.comment}
                            </div>
                          </td>

                          {/* Cột Trạng thái */}
                          <td>
                            {fb.adminReply && fb.adminReply.content ? (
                                <span className="badge bg-success-light">Đã trả lời</span>
                            ) : (
                                <span className="badge bg-danger-light">Chưa trả lời</span>
                            )}
                          </td>

                          {/* Cột Ngày */}
                          <td>{new Date(fb.createdAt).toLocaleDateString('vi-VN')}</td>

                          {/* Cột Hành động */}
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-white text-primary me-2"
                              onClick={() => openDetailModal(fb)}
                              title="Xem & Trả lời"
                              style={{ border: '1px solid #e0e0e0' }}
                            >
                              <i className="fas fa-reply me-1"></i> Chi tiết
                            </button>
                            <button
                              className="btn btn-sm btn-white text-danger"
                              onClick={() => handleDelete(fb._id)}
                              title="Xóa đánh giá"
                              style={{ border: '1px solid #e0e0e0' }}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">Chưa có đánh giá nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="row mt-3">
            <div className="col-12 d-flex justify-content-end">
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
      )}

      {/* --- MODAL CHI TIẾT & TRẢ LỜI --- */}
      <Modal
        id="feedbackModal"
        title="Chi tiết Đánh giá & Phản hồi"
        show={showModal}
        onClose={closeModal}
        footer={null} // Tự custom footer bên trong body cho linh hoạt
      >
        {selectedFeedback && (
          <div className="p-2">
            {/* 1. Phần thông tin sản phẩm & User */}
            <div className="d-flex align-items-start mb-3 pb-3 border-bottom">
                <img 
                    src={selectedFeedback.product?.image ? getImageUrl(selectedFeedback.product.image) : defaultAvatar} 
                    alt="Product" 
                    className="rounded"
                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                />
                <div>
                    <h5 style={{ fontSize: '16px', margin: '0 0 5px' }}>{selectedFeedback.product?.name}</h5>
                    <div className="text-muted" style={{ fontSize: '13px' }}>
                        Khách hàng: <strong>{selectedFeedback.user?.firstName} {selectedFeedback.user?.lastName}</strong> ({selectedFeedback.user?.email})
                    </div>
                    <div className="mt-1">
                        <StarRating rating={selectedFeedback.rating} />
                        <span className="text-muted ms-2" style={{ fontSize: '12px' }}>
                            {new Date(selectedFeedback.createdAt).toLocaleString('vi-VN')}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Nội dung đánh giá của khách */}
            <div className="mb-4">
                <h6 className="text-primary"><i className="fas fa-comment-alt me-2"></i>Nội dung đánh giá:</h6>
                <div className="p-3 bg-light rounded border">
                    <p className="mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>{selectedFeedback.comment}</p>
                </div>
                
                {/* Hình ảnh khách gửi (nếu có) */}
                {selectedFeedback.images && selectedFeedback.images.length > 0 && (
                    <div className="mt-3">
                        <p className="mb-2 text-muted" style={{ fontSize: '13px' }}>Hình ảnh đính kèm:</p>
                        <div className="d-flex flex-wrap gap-2">
                            {selectedFeedback.images.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt="Review" 
                                    className="img-thumbnail" 
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => window.open(img, '_blank')}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Phần Admin trả lời */}
            <div className="mb-3">
                <h6 className="text-success"><i className="fas fa-reply me-2"></i>Phản hồi từ Shop:</h6>
                
                {selectedFeedback.adminReply && selectedFeedback.adminReply.content ? (
                    // --- CASE 1: ĐÃ TRẢ LỜI ---
                    <div className="alert alert-success" role="alert">
                        <strong>Shop đã trả lời:</strong>
                        <p className="mt-1 mb-1">{selectedFeedback.adminReply.content}</p>
                        <hr className="my-2" />
                        <small className="text-muted">
                            Thời gian: {new Date(selectedFeedback.adminReply.repliedAt).toLocaleString('vi-VN')}
                        </small>
                    </div>
                ) : (
                    // --- CASE 2: CHƯA TRẢ LỜI ---
                    <div>
                        <textarea 
                            className="form-control" 
                            rows="4"
                            placeholder="Nhập nội dung phản hồi cho khách hàng..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            style={{ fontSize: '14px' }}
                        ></textarea>
                        <div className="d-flex justify-content-end mt-3">
                            <button 
                                className="btn btn-secondary me-2" 
                                onClick={closeModal}
                                disabled={isSubmitting}
                            >
                                Đóng
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleSendReply}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Nút đóng cho trường hợp đã trả lời */}
            {selectedFeedback.adminReply && selectedFeedback.adminReply.content && (
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary" onClick={closeModal}>Đóng</button>
                </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FeedbackPage;