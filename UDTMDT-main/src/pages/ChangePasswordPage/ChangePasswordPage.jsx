import React from 'react';
import { Form, Input, Button, message } from 'antd';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import {
    WrapperContainer,
    WrapperContent,
    WrapperSidebar,
    WrapperMainContent,
    PasswordHeader,
    PasswordSubtitle,
    FormWrapper,
    FormRow,
    FormLabel,
    FormControl,
    ConfirmButton
} from './style';

const ChangePasswordPage = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        // TODO: Gọi API để thay đổi mật khẩu
        console.log('Password values:', values);
        
        // Giả sử gọi API thành công
        message.success('Đổi mật khẩu thành công!');
        form.resetFields();
    };

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar>
                    {/* Render Sidebar chung */}
                    <ProfileSidebar />
                </WrapperSidebar>

                <WrapperMainContent>
                    {/* Header (Giống Shopee) */}
                    <PasswordHeader>
                        Đổi Mật Khẩu
                    </PasswordHeader>
                    <PasswordSubtitle>
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                    </PasswordSubtitle>

                    {/* Form (Giống Shopee) */}
                    <FormWrapper>
                        <Form form={form} onFinish={onFinish} layout="horizontal">
                            <FormRow>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <FormControl>
                                    <Form.Item
                                        name="newPassword"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                        ]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>
                                </FormControl>
                            </FormRow>

                            <FormRow>
                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                <FormControl>
                                    <Form.Item
                                        name="confirmPassword"
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>
                                </FormControl>
                            </FormRow>

                            <FormRow>
                                <FormLabel></FormLabel>
                                <FormControl>
                                    <ConfirmButton htmlType="submit">
                                        Xác Nhận
                                    </ConfirmButton>
                                </FormControl>
                            </FormRow>
                        </Form>
                    </FormWrapper>

                </WrapperMainContent>
            </WrapperContent>
        </WrapperContainer>
    );
};

export default ChangePasswordPage;