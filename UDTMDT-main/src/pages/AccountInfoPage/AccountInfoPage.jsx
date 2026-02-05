import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, DatePicker, message, Button, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import axiosClient from '../../apis/axiosClient';
import {
  WrapperContainer, WrapperContent, WrapperSidebar, WrapperMainContent, PageTitle
} from '../ProfilePage/style';
import {
  FormWrapper, FormRow, FormLabel, FormControl, SaveButton
} from './style';

const AccountInfoPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Trạng thái xác thực SĐT
  const [isVerified, setIsVerified] = useState(false); // SĐT đã xác thực chưa
  const [isModalOpen, setIsModalOpen] = useState(false); // Mở/đóng modal OTP
  const [otpInput, setOtpInput] = useState(''); // Mã OTP nhập từ người dùng
  const [serverOtp, setServerOtp] = useState(''); // Mã OTP giả lập từ server

  useEffect(() => {
    const loadData = () => {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setUserEmail(user.email || '');
          setUserPhone(user.phone || '');
          setIsVerified(user.phoneVerified || false);

          const fullName = user.name || user.firstName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
          const birthday = user.birthday ? dayjs(user.birthday) : null;

          form.setFieldsValue({
            name: fullName,
            phone: user.phone || '',
            gender: user.gender || 'other',
            birthday: birthday
          });
        } catch {
          navigate('/sign-in');
        }
      } else {
        navigate('/sign-in');
      }
    };

    loadData();

    // Event listener nếu thông tin user được cập nhật từ nơi khác
    const handleUserUpdated = (event) => {
      // Logic update lại form nếu có thay đổi từ nơi khác
    };
    window.addEventListener('userUpdated', handleUserUpdated);
    return () => window.removeEventListener('userUpdated', handleUserUpdated);
  }, [navigate, form]);

  const handleSendOtp = () => {
    const phone = form.getFieldValue('phone');
    if (!phone || !phone.match(/^(84|0[3|5|7|8|9])+([0-9]{8})$/)) {
      message.error('Vui lòng nhập số điện thoại hợp lệ trước!');
      return;
    }

    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(fakeOtp);

    // Giả lập gửi SMS
    alert(`[SMS GIẢ LẬP] Mã xác thực của bạn là: ${fakeOtp}`);

    setIsModalOpen(true);
  };

  const handleVerifyOtp = async () => {
    if (otpInput === serverOtp) {
      message.success('Xác thực thành công!');
      setIsVerified(true);
      setIsModalOpen(false);
      setOtpInput('');

      await updateVerifyStatusToBackend(); // Cập nhật trạng thái verified lên server
    } else {
      message.error('Mã OTP không đúng!');
    }
  };

  const updateVerifyStatusToBackend = async () => {
    try {
      const userString = localStorage.getItem('user');
      const currentUser = JSON.parse(userString);

      const response = await axiosClient.put('/api/users/profile', {
        ...currentUser,
        phoneVerified: true
      });

      if (response.data?.success || response.status === 200) {
        const newUser = { ...currentUser, phoneVerified: true };
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (e) {
      console.log("Lỗi update trạng thái verify:", e);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fullName = values.name.trim();
      const dataToSend = {
        firstName: fullName,
        lastName: "",
        phone: values.phone,
        gender: values.gender,
        birthday: values.birthday ? values.birthday.toISOString() : null,
        name: fullName,
        phoneVerified: isVerified
      };

      const response = await axiosClient.put('/api/users/profile', dataToSend);

      if (response.data?.success || response.status === 200) {
        const oldUserString = localStorage.getItem('user');
        if (oldUserString) {
          const oldUser = JSON.parse(oldUserString);
          const newUser = response.data.data || { ...oldUser, ...dataToSend, phoneVerified: isVerified };
          localStorage.setItem('user', JSON.stringify(newUser));
          window.dispatchEvent(new CustomEvent('userUpdated', { detail: newUser }));
        }

        message.success('Cập nhật thông tin thành công!');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        message.error(response.data?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer>
      <WrapperContent>
        <WrapperSidebar><ProfileSidebar /></WrapperSidebar>
        <WrapperMainContent>
          <PageTitle>Thông tin tài khoản</PageTitle>

          <FormWrapper form={form} onFinish={onFinish} layout="vertical">
            {/* Họ tên */}
            <FormRow>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Form.Item name="name" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>
              </FormControl>
            </FormRow>

            {/* Email */}
            <FormRow>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input size="large" value={userEmail} disabled style={{ backgroundColor: '#f5f5f5' }} />
              </FormControl>
            </FormRow>

            {/* Số điện thoại */}
            <FormRow>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Form.Item
                    name="phone"
                    style={{ flex: 1 }}
                    rules={[
                      { required: true, message: 'Nhập SĐT' },
                      { pattern: /^(84|0[3|5|7|8|9])+([0-9]{8})$/, message: 'SĐT không hợp lệ' }
                    ]}
                  >
                    <Input size="large" disabled={isVerified} />
                  </Form.Item>

                  {/* Trạng thái xác thực */}
                  {isVerified ? (
                    <Tag color="success" style={{ padding: '5px 10px', fontSize: '14px', height: '40px', display: 'flex', alignItems: 'center' }}>
                      Đã xác thực
                    </Tag>
                  ) : (
                    <Button type="default" danger onClick={handleSendOtp} style={{ height: '40px' }}>
                      Xác thực ngay
                    </Button>
                  )}
                </div>
              </FormControl>
            </FormRow>

            {/* Giới tính */}
            <FormRow>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Form.Item name="gender">
                  <Select size="large" placeholder="Chọn giới tính" options={[
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Khác', value: 'other' }
                  ]} />
                </Form.Item>
              </FormControl>
            </FormRow>

            {/* Ngày sinh */}
            <FormRow>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Form.Item name="birthday">
                  <DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </FormControl>
            </FormRow>

            {/* Nút lưu */}
            <FormRow>
              <FormLabel></FormLabel>
              <FormControl>
                <SaveButton type="primary" htmlType="submit" loading={loading}>Lưu thay đổi</SaveButton>
              </FormControl>
            </FormRow>
          </FormWrapper>

          {/* Modal nhập OTP */}
          <Modal 
            title="Nhập mã xác thực (OTP)" 
            open={isModalOpen} 
            onOk={handleVerifyOtp} 
            onCancel={() => setIsModalOpen(false)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <p>Mã xác thực đã được gửi tới số điện thoại của bạn.</p>
            <Input 
              value={otpInput} 
              onChange={(e) => setOtpInput(e.target.value)} 
              placeholder="Nhập 6 số OTP..." 
              maxLength={6}
              size="large"
              style={{ textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' }}
            />
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
              (Môi trường Test: Nhập mã hiển thị trong thông báo)
            </p>
          </Modal>
        </WrapperMainContent>
      </WrapperContent>
    </WrapperContainer>
  );
};

export default AccountInfoPage;
