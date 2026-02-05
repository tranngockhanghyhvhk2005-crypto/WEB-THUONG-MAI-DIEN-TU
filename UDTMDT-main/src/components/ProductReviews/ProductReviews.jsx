import React, { useEffect, useState } from 'react';
import { Rate, List, Avatar, Spin, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as ReviewService from '../../services/ReviewService';
import { getImageUrl } from '../../services/ProductService'; 

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0 });

    const fetchReviews = async (page = 1) => {
        setLoading(true);
        try {
            const res = await ReviewService.getReviewsByProduct(productId, page, pagination.limit);
            if (res.status === 'OK') {
                setReviews(res.data);
                setPagination(prev => ({ ...prev, total: res.total, page }));
            }
        } catch (error) {
            console.error("Lỗi tải đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại khi productId thay đổi
    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const handlePageChange = (page) => {
        fetchReviews(page);
    };

    return (
        <div style={{ padding: '10px 0' }}>
            {loading && reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
            ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px' }}>
                    Chưa có đánh giá nào cho sản phẩm này.
                </div>
            ) : (
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={reviews}
                        renderItem={(item) => (
                            <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '20px 0' }}>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar 
                                            src={item.user?.avatar ? getImageUrl(item.user.avatar) : null} 
                                            icon={<UserOutlined />} 
                                            size="large"
                                        />
                                    }
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                                {item.user?.firstName ? `${item.user.lastName || ''} ${item.user.firstName}` : 'Người dùng ẩn danh'}
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#999' }}>
                                                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    }
                                    description={
                                        <div style={{ marginTop: '5px' }}>
                                            <Rate disabled defaultValue={item.rating} style={{ fontSize: '14px', color: '#ffce3d', marginBottom: '8px' }} />
                                            <div style={{ color: '#333', fontSize: '15px', lineHeight: '1.6' }}>
                                                {item.comment}
                                            </div>
                                            {/* Hiển thị ảnh đánh giá nếu có */}
                                            {item.images && item.images.length > 0 && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                    {item.images.map((img, idx) => (
                                                        <img 
                                                            key={idx} 
                                                            src={getImageUrl(img)} 
                                                            alt="review" 
                                                            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee', cursor: 'pointer' }}
                                                            onClick={() => window.open(getImageUrl(img), '_blank')}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                    
                    {/* Phân trang */}
                    {pagination.total > pagination.limit && (
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <Pagination 
                                current={pagination.page} 
                                total={pagination.total} 
                                pageSize={pagination.limit} 
                                onChange={handlePageChange} 
                                size="small"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductReviews;