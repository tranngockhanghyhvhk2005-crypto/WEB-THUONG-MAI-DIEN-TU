import React, { useEffect, useRef } from 'react';

/**
 * Component Modal tái sử dụng (Đã fix lỗi ref null)
 */
const Modal = ({ id, title, children, footer, show, onClose }) => {
  const modalRef = useRef(null); // Dùng ref để lấy element thay vì getElementById

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return; // Nếu chưa có element thì dừng ngay

    // Lấy hoặc tạo instance Bootstrap Modal
    // eslint-disable-next-line no-undef
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);

    if (show) {
      bsModal.show();
    } else {
      bsModal.hide();
    }

    // Hàm xử lý khi modal đóng
    const handleHidden = () => {
      if (onClose) onClose();
    };

    // Lắng nghe sự kiện đóng
    modalElement.addEventListener('hidden.bs.modal', handleHidden);

    // Cleanup: Gỡ sự kiện khi component unmount hoặc props thay đổi
    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [show, onClose]);

  return (
    <div 
      className="modal fade" 
      id={id} 
      ref={modalRef} // QUAN TRỌNG: Gắn ref vào đây
      tabIndex="-1" 
      aria-labelledby={`${id}Label`} 
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onClose && onClose()}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;