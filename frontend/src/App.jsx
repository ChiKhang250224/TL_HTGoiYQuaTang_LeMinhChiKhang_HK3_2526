import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import AuthPage from './pages/AuthPage';
import UserHome from './pages/UserHome';
import ProfilePage from './pages/ProfilePage';
import StoreProfilePage from './pages/StoreProfilePage';
import StoreProductsPage from './pages/StoreProductsPage';
import Favorites from './pages/Favorites';
import { useState, useEffect } from 'react';

function AppLayout({ children }) {
  const location = useLocation();
  const noLayoutPages = ['/login', '/register', '/store-profile', '/store-products'];
  const hideDefaultLayout = noLayoutPages.includes(location.pathname);
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    setUserName(localStorage.getItem('fullName'));
    setUserAvatar(localStorage.getItem('avatar'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setUserAvatar(null);
    window.location.href = '/';
  };

  return (
    <div className="bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-white min-h-screen flex flex-col">
      {!hideDefaultLayout && (
        <nav className="w-full top-0 sticky z-50 shadow-sm bg-surface">
          <div className="flex justify-between items-center px-gutter md:px-xl py-md max-w-container-max mx-auto h-20">
            {/* Brand */}
            <Link className="flex items-center gap-xs" to={userName ? "/home" : "/"}>
              <img alt="GiftMatch AI Logo" className="h-10 w-10 object-contain rounded-md" src="https://lh3.googleusercontent.com/aida/AP1WRLsr7D7H0GKzQesVtP5Aseu58Aoto8depA1CO6RMGE3Y1-5IgZmx5IqxZkoGBv5zZZtd8tGbWGazDQuBBbj23rtgVTuyZ01-5cmB5s-UoW6hCgqLVX3hs5ocAUD50HRwZX3fdwjrk7LeYCO_C3gPdCDFDoK4Mlz82VKrgxVkAV6AZEAIQoCSDYcbyjMGkg8Pjp68Xc_BmzgFKs-WyHdxz26uv_b2Z5ka48WYTSZF-MwcawCJ0Jubx8q_StDs"/>
              <span className="font-heading text-[24px] font-bold text-primary hidden sm:block">GiftMatch AI</span>
            </Link>
            {/* Navigation Links */}
            <ul className="hidden md:flex items-center gap-lg">
              <li>
                <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md" to={userName ? "/home" : "/"}>Trang chủ</Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary-container transition-all font-body-md" to="/recommendations">Khám phá</Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary-container transition-all font-body-md" to="/dashboard">Sổ tay</Link>
              </li>
            </ul>
            {/* Trailing Action */}
            <div className="flex items-center gap-sm">
              {userName ? (
                <div className="flex items-center gap-4">
                  <Link to="/favorites" className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all hidden sm:block" title="Danh sách yêu thích">
                    <span className="material-symbols-outlined">favorite</span>
                  </Link>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all hidden sm:block">
                    <span className="material-symbols-outlined">notifications</span>
                  </button>
                  <Link to="/profile" title="Tài khoản của tôi" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all shadow-sm">
                    <span className="text-label-md font-bold text-on-surface">{userName}</span>
                    {userAvatar && userAvatar !== 'null' && userAvatar.startsWith('http') ? (
                      <img src={userAvatar} alt="Avatar" referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>account_circle</span>
                    )}
                  </Link>
                  <button onClick={handleLogout} title="Đăng xuất" className="p-2 text-error hover:bg-error-container rounded-full transition-all">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="font-label-md text-secondary border-2 border-secondary rounded-lg px-6 py-2 hover:bg-secondary hover:text-white transition-all hidden sm:block">Đăng nhập</Link>
              )}
              <button className="md:hidden text-primary p-2">
                <span className="material-symbols-outlined text-3xl">menu</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="flex-grow flex flex-col">
        {children}
      </div>

      {!hideDefaultLayout && (
        <footer className="w-full mt-auto bg-surface-container">
          <div className="flex flex-col md:flex-row justify-between items-center px-gutter md:px-xl py-lg max-w-container-max mx-auto gap-md text-center md:text-left">
            <div className="flex flex-col gap-xs">
              <span className="font-heading text-[20px] font-bold text-primary">GiftMatch AI</span>
              <span className="font-label-md text-secondary">© 2024 GiftMatch AI. All rights reserved.</span>
            </div>
            <ul className="flex flex-wrap justify-center gap-md">
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a></li>
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a></li>
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Contact Us</a></li>
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">FAQ</a></li>
            </ul>
          </div>
        </footer>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('token') || localStorage.getItem('fullName');
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/store-profile" element={<ProtectedRoute><StoreProfilePage /></ProtectedRoute>} />
          <Route path="/store-products" element={<ProtectedRoute><StoreProductsPage /></ProtectedRoute>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
