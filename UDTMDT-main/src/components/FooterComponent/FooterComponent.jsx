import React from 'react';
import { Row, Col } from 'antd';
import { 
    WrapperFooter, Container, FooterTitle, FooterContent, 
    HotlineItem, SocialIcons, BottomFooter 
} from './style';
import { 
    FacebookFilled, InstagramFilled, YoutubeFilled
} from '@ant-design/icons';

const FooterComponent = () => {
    return (
        <WrapperFooter>
            <Container>
                <Row gutter={[30, 30]}>
                    {/* CỘT 1: HỖ TRỢ KHÁCH HÀNG */}
                    <Col xs={24} sm={12} md={6}>
                        <FooterTitle>Hỗ trợ khách hàng</FooterTitle>
                        <FooterContent>
                            <HotlineItem>
                                <span>Hotline:</span>
                                <span style={{ color: '#d0021b' }}>1800 6324</span>
                            </HotlineItem>
                            <span style={{ fontSize: '12px', color: '#666' }}>(Miễn phí, 08-22h kể cả T7, CN)</span>
                            
                            <div style={{ marginTop: '15px' }}>
                                <HotlineItem>
                                    <span>Các câu hỏi thường gặp</span>
                                </HotlineItem>
                                <HotlineItem>
                                    <span>Gửi yêu cầu hỗ trợ</span>
                                </HotlineItem>
                                <HotlineItem>
                                    <span>Hướng dẫn đặt hàng</span>
                                </HotlineItem>
                                <HotlineItem>
                                    <span>Phương thức vận chuyển</span>
                                </HotlineItem>
                                <HotlineItem>
                                    <span>Chính sách đổi trả</span>
                                </HotlineItem>
                            </div>
                        </FooterContent>
                    </Col>

                    {/* CỘT 2: VỀ CHÚNG TÔI */}
                    <Col xs={24} sm={12} md={6}>
                        <FooterTitle>Về Beauty Cosmetic</FooterTitle>
                        <FooterContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <a href="#">Giới thiệu Beauty Cosmetic</a>
                                <a href="#">Tuyển dụng</a>
                                <a href="#">Chính sách bảo mật</a>
                                <a href="#">Điều khoản sử dụng</a>
                                <a href="#">Liên hệ</a>
                            </div>
                        </FooterContent>
                    </Col>

                    {/* CỘT 3: HỢP TÁC (ĐÃ XÓA THANH TOÁN & ĐƠN VỊ VẬN CHUYỂN) */}
                    <Col xs={24} sm={12} md={6}>
                        <FooterTitle>Hợp tác & Liên kết</FooterTitle>
                        <FooterContent>
                            <a href="#">Quy chế hoạt động sàn GDTMĐT</a>
                            <div style={{ marginTop: '5px' }}>
                                <a href="#">Bán hàng cùng Beauty Cosmetic</a>
                            </div>
                        </FooterContent>
                    </Col>

                    {/* CỘT 4: KẾT NỐI (ĐÃ XÓA TẢI APP & BỘ CÔNG THƯƠNG) */}
                    <Col xs={24} sm={12} md={6}>
                        <FooterTitle>Kết nối với chúng tôi</FooterTitle>
                        <SocialIcons>
                            <FacebookFilled style={{ fontSize: '28px', color: '#3b5998' }} />
                            <InstagramFilled style={{ fontSize: '28px', color: '#E1306C' }} />
                            <YoutubeFilled style={{ fontSize: '28px', color: '#FF0000' }} />
                        </SocialIcons>
                    </Col>
                </Row>
            </Container>

            {/* PHẦN CUỐI TRANG: BẢN QUYỀN & CÔNG TY */}
            <BottomFooter>
                <Container>
                    <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                        © 2024 Công ty Cổ Phần Beauty Cosmetic Việt Nam
                    </div>
                    <div>
                        Số ĐKKD: 03136xxxxx do Sở Kế hoạch và Đầu tư TP.HCM cấp ngày 01/01/2024
                    </div>
                    <div>
                        Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, Số 29 Đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội.
                    </div>
                    <div>
                        Email: hotro@beautycosmetic.vn - Điện thoại: 1800 6324
                    </div>
                </Container>
            </BottomFooter>
        </WrapperFooter>
    );
};

export default FooterComponent;