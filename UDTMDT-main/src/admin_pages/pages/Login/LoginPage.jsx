import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/img/logo.png';
import { toast } from 'react-hot-toast';
import { 
  LoginBody,
  LoginWrapper,
  LoginBox,
  LoginLeft,
  LoginRight,
  LoginRightWrap
} from './style';

const LoginPage = () => {
  // SỬA 1: Đổi tên state từ username -> email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { // SỬA 2: Kiểm tra email
      toast.error('Vui lòng nhập email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      // SỬA 3: Truyền email vào hàm login
      await login(email, password); 
    } catch (error) {
      console.error('Login failed in component:', error);
      // Không cần toast lỗi ở đây vì apiService hoặc AuthContext thường đã làm việc đó
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginBody>
      <LoginWrapper>
        <LoginBox>
          <LoginLeft>
            <img src={logo} alt="Logo" />
          </LoginLeft>
          <LoginRight>
            <LoginRightWrap>
              <h1>Login For Admin</h1>
              <p className="account-subtitle">Access to our dashboard</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {/* SỬA 4: Cập nhật Input cho đúng chuẩn Email */}
                  <input
                    className="form-control"
                    type="email" // Đổi type thành email để có validation cơ bản
                    placeholder="Email Address" // Đổi placeholder
                    value={email} // Bind vào state email
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Login'}
                  </button>
                </div>
              </form>
            </LoginRightWrap>
          </LoginRight>
        </LoginBox>
      </LoginWrapper>
    </LoginBody>
  );
};

export default LoginPage;