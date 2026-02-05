import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Button, message } from 'antd';
import { FormRow, FormLabel, FormControl, SaveButton } from './style'; 
import dayjs from 'dayjs';

const ProfileEditModal = ({ visible, onCancel, onUpdate, currentUser }) => {
    const [form] = Form.useForm();

    // Load dữ liệu vào form khi modal mở hoặc user thay đổi
    useEffect(() => {
        if (visible && currentUser) {
            form.setFieldsValue({
                firstName: currentUser.firstName,
                phone: currentUser.phone,
                gender: currentUser.gender,
                birthday: currentUser.birthday ? dayjs(currentUser.birthday) : null
            });
        }
    }, [visible, currentUser, form]);

    const handleFinish = (values) => {
        // TODO: Gọi API cập nhật
        console.log('Updating profile:', values);

        // Cập nhật localStorage (tạm thời)
        const updatedUser = { ...currentUser, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        message.success('Cập nhật thành công!');
        onUpdate(updatedUser); // Trả dữ liệu mới về cho ProfilePage
    };

    return (
        <Modal
            title="Thông tin tài khoản"
            open={visible}
            onCancel={onCancel}
            footer={null} // Ẩn footer mặc định
            width={700}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                {/* Tái sử dụng layout FormRow/FormLabel của bạn */}
                <FormRow>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input size="large" value={currentUser?.email} disabled />
                    </FormControl>
                </FormRow>
                <FormRow>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                        <Form.Item name="firstName">
                            <Input size="large" />
                        </Form.Item>
                    </FormControl>
                </FormRow>
                <FormRow>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                        <Form.Item name="phone">
                            <Input size="large" />
                        </Form.Item>
                    </FormControl>
                </FormRow>
                <FormRow>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                        <Form.Item name="gender">
                            <Radio.Group>
                                <Radio value="male">Nam</Radio>
                                <Radio value="female">Nữ</Radio>
                                <Radio value="other">Khác</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </FormControl>
                </FormRow>
                <FormRow>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                        <Form.Item name="birthday">
                            <DatePicker 
                                size="large" 
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </FormControl>
                </FormRow>
                <FormRow>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <SaveButton htmlType="submit">Lưu thay đổi</SaveButton>
                    </FormControl>
                </FormRow>
            </Form>
        </Modal>
    );
};

export default ProfileEditModal;