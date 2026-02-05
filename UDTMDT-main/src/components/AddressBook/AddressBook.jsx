import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Form, Input, Select, message, Space, Popconfirm, Typography, Spin } from 'antd';
import styled from 'styled-components';

/*Các container và card dùng để hiển thị danh sách địa chỉ.*/

const AddressBookContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledAddressList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const AddressCard = styled.div`
  border: 1px solid ${props => props.$isDefault ? '#1890ff' : '#f0f0f0'};
  border-width: ${props => props.$isDefault ? '2px' : '1px'};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  background: #fff;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const DefaultBadge = styled.span`
  background: #1890ff;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  color: #999;
`;

const AddressActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  ${AddressCard}:hover & {
    opacity: 1;
  }
`;

const { Option } = Select;

const AddressBook = () => {
    const [form] = Form.useForm();           // Form control
    const [addresses, setAddresses] = useState([]);  // Danh sách địa chỉ
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal thêm/sửa
    const [editingAddress, setEditingAddress] = useState(null);  // Địa chỉ đang sửa
    const [loading, setLoading] = useState(false);   // Loading khi submit form
    const [isLoading, setIsLoading] = useState(true); // Loading khi fetch danh sách
    const [provinces] = useState(['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng']); // Mẫu tỉnh
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const fetchAddresses = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/addresses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setAddresses(result.data || []);
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải địa chỉ');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleAddAddress = () => {
        setEditingAddress(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        form.setFieldsValue(address);
        setIsModalVisible(true);
    };

    const handleDeleteAddress = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/addresses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                message.success('Xóa địa chỉ thành công');
                fetchAddresses();
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa địa chỉ');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8080/api/addresses/${id}/set-default`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                message.success('Đã đặt làm địa chỉ mặc định');
                fetchAddresses();
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi đặt địa chỉ mặc định');
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const url = editingAddress 
                ? `http://localhost:8080/api/addresses/${editingAddress._id}`
                : 'http://localhost:8080/api/addresses';
            const method = editingAddress ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(values)
            });
            const result = await res.json();
            if (result.success) {
                message.success(editingAddress ? 'Cập nhật thành công' : 'Thêm mới thành công');
                setIsModalVisible(false);
                fetchAddresses();
            } else {
                throw new Error(result.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Chọn tỉnh, tự động cập nhật quận/huyện
    const handleProvinceChange = (value) => {
        setDistricts(['Quận 1', 'Quận 3']);
        setWards([]);
    };

    // Chọn quận, tự động cập nhật phường/xã
    const handleDistrictChange = (value) => {
        setWards(['Phường Bến Nghé', 'Phường Bến Thành']);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <div>Đang tải địa chỉ...</div>
            </div>
        );
    }

    return (
        <AddressBookContainer>
            <AddressHeader>
                <Typography.Title level={4} style={{ margin: 0 }}>Sổ địa chỉ của tôi</Typography.Title>
                <Button type="primary" onClick={handleAddAddress}>Thêm địa chỉ mới</Button>
            </AddressHeader>

            <StyledAddressList>
                {addresses.map(address => (
                    <AddressCard key={address._id} $isDefault={address.isDefault}>
                        <div style={{ marginBottom: 12 }}>
                            <span style={{ fontWeight: 500 }}>
                                {address.type === 'home' ? 'Nhà riêng' : address.type === 'office' ? 'Công ty' : 'Khác'}
                            </span>
                            {address.isDefault && <DefaultBadge>Mặc định</DefaultBadge>}
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{address.fullName}</div>
                            <div style={{ color: '#666' }}>{address.phone}</div>
                        </div>
                        <div style={{ color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
                            <div>{address.specificAddress}</div>
                            <div>{[address.ward, address.district, address.province].filter(Boolean).join(', ')}</div>
                        </div>
                        <AddressActions>
                            <Space>
                                <Button size="small" onClick={() => handleEditAddress(address)}>Sửa</Button>
                                <Popconfirm
                                    title={`Bạn có chắc muốn xóa địa chỉ này${address.isDefault ? ' (Mặc định)' : ''}?`}
                                    onConfirm={() => handleDeleteAddress(address._id)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button size="small" danger>Xóa</Button>
                                </Popconfirm>
                                {!address.isDefault && <Button size="small" type="link" onClick={() => handleSetDefault(address._id)}>Mặc định</Button>}
                            </Space>
                        </AddressActions>
                    </AddressCard>
                ))}

                {addresses.length === 0 && (
                    <EmptyState>
                        <div style={{ marginBottom: 16, fontSize: 16 }}>Bạn chưa có địa chỉ nào</div>
                        <Button type="primary" onClick={handleAddAddress}>Thêm địa chỉ mới</Button>
                    </EmptyState>
                )}
            </StyledAddressList>

            {/* Modal Thêm/Sửa địa chỉ */}
            <Modal
                title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ type: 'home', isDefault: false }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
                            <Input placeholder="Nhập họ và tên" />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại" rules={[
                            { required: true },
                            { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ' }
                        ]}>
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
                            <Select placeholder="Chọn tỉnh/thành phố" onChange={handleProvinceChange}>
                                {provinces.map(p => <Option key={p} value={p}>{p}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true }]}>
                            <Select placeholder="Chọn quận/huyện" onChange={handleDistrictChange} disabled={!form.getFieldValue('province')}>
                                {districts.map(d => <Option key={d} value={d}>{d}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true }]}>
                            <Select placeholder="Chọn phường/xã" disabled={!form.getFieldValue('district')}>
                                {wards.map(w => <Option key={w} value={w}>{w}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="type" label="Loại địa chỉ">
                            <Select>
                                <Option value="home">Nhà riêng</Option>
                                <Option value="office">Công ty</Option>
                                <Option value="other">Khác</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item name="specificAddress" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} placeholder="Số nhà, đường, tổ dân phố..." />
                    </Form.Item>
                    <Form.Item name="isDefault" valuePropName="checked">
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '16px' }}>
                                {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={handleCancel}>Hủy</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </AddressBookContainer>
    );
};

export default React.memo(AddressBook);
