import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button, message, Select, Row, Col } from 'antd';
import axiosClient from '../../apis/axiosClient';

const { Option } = Select;

const AddAddressModal = ({ visible, onClose, onAddressAdded, addressToEdit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Dữ liệu giả lập (Sau này thay bằng API thật)
    const fakeProvinces = [
        { ProvinceID: 201, ProvinceName: "Thành phố Hà Nội" },
        { ProvinceID: 202, ProvinceName: "Thành phố Hồ Chí Minh" },
    ];
    const fakeDistricts = [
        { DistrictID: 1482, DistrictName: "Quận Ba Đình" },
        { DistrictID: 1483, DistrictName: "Quận Hoàn Kiếm" },
    ];
    const fakeWards = [
        { WardCode: "1A0407", WardName: "Phường Phúc Xá" },
        { WardCode: "1A0408", WardName: "Phường Trúc Bạch" },
    ];

    useEffect(() => {
        setProvinces(fakeProvinces);
    }, []);

    // Xử lý khi mở modal
    useEffect(() => {
        if (visible && addressToEdit) {
            // Chế độ Sửa: Đổ dữ liệu cũ vào form
            setDistricts(fakeDistricts); // Load sẵn huyện để hiển thị
            setWards(fakeWards);         // Load sẵn xã

            // Tìm ID tương ứng với Tên đã lưu trong DB
            const foundProv = fakeProvinces.find(p => p.ProvinceName === addressToEdit.province);
            const foundDist = fakeDistricts.find(d => d.DistrictName === addressToEdit.district);
            const foundWard = fakeWards.find(w => w.WardName === addressToEdit.ward);

            form.setFieldsValue({
                province: foundProv ? foundProv.ProvinceID : undefined,
                district: foundDist ? foundDist.DistrictID : undefined,
                ward: foundWard ? foundWard.WardCode : undefined,
                specificAddress: addressToEdit.specificAddress,
                isDefault: addressToEdit.isDefault
            });
        } else if (visible && !addressToEdit) {
            // Chế độ Thêm: Reset form
            form.resetFields();
            setDistricts([]);
            setWards([]);
        }
    }, [visible, addressToEdit, form]);

    const handleProvinceChange = () => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        setDistricts(fakeDistricts);
        setWards([]);
    };

    const handleDistrictChange = () => {
        form.setFieldsValue({ ward: undefined });
        setWards(fakeWards);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Tìm tên từ ID
            const selectedProvince = provinces.find(p => p.ProvinceID === values.province);
            const provinceName = selectedProvince ? selectedProvince.ProvinceName : values.province;

            const selectedDistrict = districts.find(d => d.DistrictID === values.district);
            const districtName = selectedDistrict ? selectedDistrict.DistrictName : values.district;

            const selectedWard = wards.find(w => w.WardCode === values.ward);
            const wardName = selectedWard ? selectedWard.WardName : values.ward;

            const payload = {
                province: provinceName,
                district: districtName,
                ward: wardName,
                specificAddress: values.specificAddress,
                isDefault: values.isDefault
            };

            let response;
            if (addressToEdit) {
                // Gọi API Sửa
                response = await axiosClient.put(`/api/users/address/${addressToEdit._id}`, payload);
            } else {
                // Gọi API Thêm
                response = await axiosClient.post('/api/users/address', payload);
            }
            
            if (response.data.success) {
                message.success(addressToEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
                form.resetFields();
                onAddressAdded();
                onClose();
            }
        } catch (error) {
            console.error('Lỗi:', error);
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={addressToEdit ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={600}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
                            <Select placeholder="Chọn Tỉnh/TP" onChange={handleProvinceChange}>
                                {provinces.map(p => <Option key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true }]}>
                            <Select placeholder="Chọn Quận/Huyện" onChange={handleDistrictChange}>
                                {districts.map(d => <Option key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true }]}>
                            <Select placeholder="Chọn Phường/Xã">
                                {wards.map(w => <Option key={w.WardCode} value={w.WardCode}>{w.WardName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="specificAddress" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
                    <Input.TextArea rows={2} placeholder="Số nhà, tên đường..." />
                </Form.Item>

                <Form.Item name="isDefault" valuePropName="checked">
                    <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {addressToEdit ? "Lưu thay đổi" : "Thêm mới"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddAddressModal;