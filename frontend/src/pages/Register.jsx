import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

    if (!gmailRegex.test(formData.email)) {
      setError('Vui lòng sử dụng tài khoản @gmail.com hợp lệ.');
      return;
    }
    if (!vnPhoneRegex.test(formData.phoneNumber)) {
      setError('Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam 10 số).');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký Tài khoản mới</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <input 
            type="text" 
            name="fullName"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input 
            type="password" 
            name="password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input 
            type="text" 
            name="phoneNumber"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản</label>
          <select 
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
          >
            <option value="CUSTOMER">Khách hàng (Người tìm quà)</option>
            <option value="STORE">Cửa hàng (Người bán quà)</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors mt-4"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
