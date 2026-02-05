import React, { useState, useEffect } from 'react';
import { Modal, Rate, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as ReviewService from '../../services/ReviewService';
import { getImageUrl } from '../../services/ProductService';

const ReviewModal = ({ isOpen, onCancel, onSuccess, productInfo, orderId, token }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setRating(5);
            setComment('');
            setFileList([]);
        }
    }, [isOpen]);

    const handleOk = async () => {
        if (!comment) {
            message.warning('Vui lòng viết nội dung đánh giá!');
            return;
        }

        setLoading(true);
        try {
            // --- TẠO FORMDATA ĐỂ GỬI FILE ---
            const formData = new FormData();
            console.log('Sending Review Data:', {
                productId: productInfo?.id,
                orderId: orderId,
                rating,
                comment
            });
            formData.append('productId', productInfo?.id);
            formData.append('orderId', orderId);
            formData.append('rating', rating);
            formData.append('comment', comment);

            // Append từng file ảnh vào key 'images'
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });

            // Gọi API
            const res = await ReviewService.createReview(formData, token);

            if (res.status === 'OK') {
                message.success('Đánh giá thành công!');
                onSuccess();
                onCancel();
            } else {
                message.error(res.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
            message.error('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <Modal
            title="Đánh giá sản phẩm"
            open={isOpen}
            onCancel={onCancel}
            footer={null}
        >
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <img
                    src={getImageUrl(productInfo?.image)}
                    alt="product"
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                    <div style={{ fontWeight: 'bold' }}>{productInfo?.name}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>Phân loại: {productInfo?.variantName || 'Mặc định'}</div>
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '5px' }}>Chất lượng sản phẩm:</div>
                <Rate value={rating} onChange={setRating} style={{ fontSize: '24px', color: '#ffce3d' }} />
                <span style={{ marginLeft: '10px', color: '#ffce3d' }}>
                    {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Không hài lòng' : 'Tệ'}
                </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <Input.TextArea
                    rows={4}
                    placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div>Thêm hình ảnh (Tối đa 5 ảnh):</div>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false} // Chặn upload tự động
                    maxCount={5}
                    multiple={true}
                    accept="image/*"
                >
                    {fileList.length < 5 && (
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                    )}
                </Upload>
            </div>

            <div style={{ textAlign: 'right' }}>
                <Button onClick={onCancel} style={{ marginRight: '10px' }}>Trở lại</Button>
                <Button type="primary" onClick={handleOk} loading={loading} style={{ background: '#326e51' }}>
                    Hoàn thành
                </Button>
            </div>
        </Modal>
    );
};

export default ReviewModal;