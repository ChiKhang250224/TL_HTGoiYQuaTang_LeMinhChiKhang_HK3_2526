import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import { useGoogleLogin } from '@react-oauth/google';
import _ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
const ReactFacebookLogin = _ReactFacebookLogin.default || _ReactFacebookLogin;

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const [activeTab, setActiveTab] = useState(isLoginRoute ? 'login' : 'register');

  // Cập nhật tab khi URL thay đổi
  useEffect(() => {
    setActiveTab(location.pathname === '/login' ? 'login' : 'register');
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regData, setRegData] = useState({
    fullName: '', email: '', password: '', phoneNumber: '', role: 'CUSTOMER'
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSocialLogin = async (token, provider) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/social-login`, { token, provider });
      setSuccess(`Đăng nhập ${provider} thành công!`);
      setError('');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('role', res.data.role);
      if (res.data.email) localStorage.setItem('email', res.data.email);
      if (res.data.avatar) localStorage.setItem('avatar', res.data.avatar);
      if (res.data.role === 'STORE') {
        navigate('/store-products');
      } else if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(`Đăng nhập bằng ${provider} thất bại hoặc tính năng chưa được cấu hình Client ID.`);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSocialLogin(tokenResponse.access_token, 'GOOGLE'),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email: loginEmail, password: loginPassword });
      setSuccess(`Đăng nhập thành công!`);
      setError('');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('role', res.data.role);
      if (res.data.email) localStorage.setItem('email', res.data.email);
      if (res.data.avatar) localStorage.setItem('avatar', res.data.avatar);
      if (res.data.role === 'STORE') {
        navigate('/store-products');
      } else if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      setSuccess('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

    if (!gmailRegex.test(regData.email)) {
      setError('Vui lòng sử dụng tài khoản @gmail.com hợp lệ.');
      return;
    }
    if (!vnPhoneRegex.test(regData.phoneNumber)) {
      setError('Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam 10 số).');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', regData);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setError('');
      handleTabChange('login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  const handleRegChange = (e) => {
    setRegData({...regData, [e.target.name]: e.target.value});
  };

  return (
    <div className="flex w-full min-h-screen bg-surface-container-lowest">
      {/* Cột trái: Hình ảnh & Lớp phủ */}
      <div className="hidden lg:flex flex-1 relative bg-surface-variant overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop" 
          alt="Gift box on a table" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-16 text-white w-full h-full">
          <h1 className="font-heading text-[48px] xl:text-[56px] leading-[1.1] font-bold mb-4 max-w-lg">
            Tìm món quà hoàn hảo cho những người thân yêu của bạn.
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 mb-8 max-w-md">
            Sử dụng sức mạnh của AI để mang lại nụ cười chân thật qua từng món quà được cá nhân hóa.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant/50 backdrop-blur-sm"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant/50 backdrop-blur-sm"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant/50 backdrop-blur-sm"></div>
            </div>
            <span className="font-label-sm text-sm text-white/90">Hàng ngàn người đã tìm thấy món quà ưng ý</span>
          </div>
        </div>
      </div>

      {/* Cột phải: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-surface-container-lowest">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <img alt="GiftMatch AI Logo" className="h-8 w-8 object-contain rounded-md" src="https://lh3.googleusercontent.com/aida/AP1WRLsr7D7H0GKzQesVtP5Aseu58Aoto8depA1CO6RMGE3Y1-5IgZmx5IqxZkoGBv5zZZtd8tGbWGazDQuBBbj23rtgVTuyZ01-5cmB5s-UoW6hCgqLVX3hs5ocAUD50HRwZX3fdwjrk7LeYCO_C3gPdCDFDoK4Mlz82VKrgxVkAV6AZEAIQoCSDYcbyjMGkg8Pjp68Xc_BmzgFKs-WyHdxz26uv_b2Z5ka48WYTSZF-MwcawCJ0Jubx8q_StDs"/>
              <span className="font-heading text-title-md font-bold text-primary group-hover:text-primary-container transition-colors">GiftMatch AI</span>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex w-full mb-8 border-b border-outline-variant">
            <button 
              onClick={() => handleTabChange('login')}
              className={`flex-1 pb-3 text-center font-heading text-[18px] transition-colors ${activeTab === 'login' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary-container'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => handleTabChange('register')}
              className={`flex-1 pb-3 text-center font-heading text-[18px] transition-colors ${activeTab === 'register' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary-container'}`}
            >
              Đăng ký
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-tertiary-container text-on-tertiary-container rounded-lg text-sm">{success}</div>}

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button type="button" onClick={() => loginGoogle()} className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl hover:bg-surface-container transition-colors shadow-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="font-label-md text-sm text-on-surface font-semibold">Google</span>
            </button>
            <ReactFacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID || 'dummy'}
              callback={(response) => {
                if (response.accessToken) {
                  handleSocialLogin(response.accessToken, 'FACEBOOK');
                } else {
                  setError("Không lấy được Access Token từ Facebook (có thể do sai App ID)");
                }
              }}
              render={renderProps => (
                <button type="button" onClick={renderProps.onClick} className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl hover:bg-surface-container transition-colors shadow-sm">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                  <span className="font-label-md text-sm text-on-surface font-semibold">Facebook</span>
                </button>
              )}
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-outline-variant"></div>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">Hoặc tiếp tục với email</span>
            <div className="flex-1 h-px bg-outline-variant"></div>
          </div>

          {/* Forms */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="email@vi-du.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all placeholder:text-on-surface-variant/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Mật khẩu</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all placeholder:text-on-surface-variant/50"
                    required
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end pt-1">
                <a href="#" className="text-sm font-label-md text-secondary hover:text-secondary-container transition-colors">Quên mật khẩu?</a>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary-container hover:bg-primary text-white py-3 rounded-xl font-label-md text-[16px] shadow-sm hover:shadow-md transition-all mt-4 font-semibold"
              >
                Đăng nhập
              </button>
              
              <div className="text-center mt-6 text-sm">
                <span className="text-on-surface-variant">Chưa có tài khoản? </span>
                <button type="button" onClick={() => handleTabChange('register')} className="font-label-md text-primary hover:text-primary-container transition-colors font-semibold">Đăng ký ngay</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Họ và tên</label>
                <input type="text" name="fullName" onChange={handleRegChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Email</label>
                <input type="email" name="email" onChange={handleRegChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Mật khẩu</label>
                <input type="password" name="password" onChange={handleRegChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Số điện thoại</label>
                <input type="text" name="phoneNumber" onChange={handleRegChange} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-label-md text-on-surface mb-1">Loại tài khoản</label>
                <CustomSelect
                  name="role"
                  value={regData.role}
                  onChange={handleRegChange}
                  options={[
                    { value: "CUSTOMER", label: "Khách hàng (Người tìm quà)" },
                    { value: "STORE", label: "Cửa hàng (Người bán quà)" }
                  ]}
                  className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl outline-none text-on-surface"
                />
              </div>
              
              <button type="submit" className="w-full bg-primary-container hover:bg-primary text-white py-3 rounded-xl font-label-md text-[16px] shadow-sm hover:shadow-md transition-all mt-4 font-semibold">
                Đăng ký
              </button>
              
              <div className="text-center mt-6 text-sm">
                <span className="text-on-surface-variant">Đã có tài khoản? </span>
                <button type="button" onClick={() => handleTabChange('login')} className="font-label-md text-primary hover:text-primary-container transition-colors font-semibold">Đăng nhập</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
