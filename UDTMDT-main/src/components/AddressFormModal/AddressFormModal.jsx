import React from 'react';
import { Modal, Form, Input, Checkbox, Button, message, Row, Col } from 'antd';
import styled from 'styled-components';

// Style cho nút Lưu
const SaveButton = styled(Button)`
    background-color: #326e51;
    border-color: #326e51;
    width: 100%;
    height: 40px;
    font-weight: 500;

    &:hover, &:focus {
        background-color: #2b5a41;
        border-color: #2b5a41;
    }
`;

// Prop 'addressToEdit' dùng khi bạn muốn "Chỉnh sửa"
const AddressFormModal = ({ visible, onCancel, onSave, addressToEdit }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        // TODO: Gọi API lưu địa chỉ
        console.log('Saving address:', values);
        
        message.success(addressToEdit ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!');
        onSave(values); // Callback về
        form.resetFields();
    };

    // Set dữ liệu nếu là "Chỉnh sửa"
    useEffect(() => {
        if (visible) {
            if (addressToEdit) {
                form.setFieldsValue(addressToEdit);
            } else {
                form.resetFields();
            }
        }
    }, [visible, addressToEdit, form]);

    return (
        <Modal
            title={addressToEdit ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            open={visible}
            onCancel={onCancel}
            footer={null} // Tắt footer mặc định
            width={600}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                {/* Tên và SĐT trên 1 hàng */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                            label="Họ và tên" 
                            name="name" 
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            label="Số điện thoại" 
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* Tỉnh/TP, Quận/Huyện, Phường/Xã (Bạn có thể thay bằng Select) */}
                <Form.Item 
                    label="Tỉnh/Thành phố" 
                    name="province"
                    rules={[{ required: true, message: 'Vui lòng nhập Tỉnh/TP!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item 
                    label="Quận/Huyện" 
                    name="district"
                    rules={[{ required: true, message: 'Vui lòng nhập Quận/Huyện!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item 
                    label="Phường/Xã" 
                    name="ward"
                    rules={[{ required: true, message: 'Vui lòng nhập Phường/Xã!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                
                <Form.Item 
                    label="Địa chỉ cụ thể" 
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item name="isDefault" valuePropName="checked">
                    <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>

                <Form.Item>
                    <SaveButton type="primary" htmlType="submit">
                        Lưu địa chỉ
                    </SaveButton>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddressFormModal;