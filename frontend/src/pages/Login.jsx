import { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      setSuccess(`Đăng nhập thành công! Xin chào ${res.data.fullName}`);
      setError('');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập GiftMatch</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary outline-none"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
