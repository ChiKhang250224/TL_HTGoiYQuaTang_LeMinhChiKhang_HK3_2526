import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import AddRecipientProfile from './pages/AddRecipientProfile';
import AdminPage from './pages/AdminPage';
import AiManagement from './pages/AiManagement';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Recommendations from './pages/Recommendations';
import StoreProductsPage from './pages/StoreProductsPage';
import StoreProfilePage from './pages/StoreProfilePage';
import SurveyPage from './pages/SurveyPage';
import UserHome from './pages/UserHome';
import NotificationBell from './components/NotificationBell';

function AppLayout({ children }) {
  const location = useLocation();
  const noLayoutPages = [
    '/login',
    '/register',
    '/store-profile',
    '/store-products',
    '/survey',
    '/admin',
  ];
  const hideDefaultLayout = noLayoutPages.includes(location.pathname)
    || location.pathname.startsWith('/admin/');
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

  const navItemClass = active => [
    'font-body-md pb-1 border-b-2 transition-colors',
    active
      ? 'text-primary font-bold border-primary'
      : 'text-on-surface-variant border-transparent hover:text-primary-container',
  ].join(' ');

  const isHomeActive = location.pathname === '/'
    || location.pathname === '/home';
  const isRecommendationsActive = location.pathname === '/recommendations';
  const isNotebookActive = location.pathname === '/dashboard'
    || location.pathname === '/add-profile'
    || location.pathname.startsWith('/edit-profile/');
  const isHistoryActive = location.pathname === '/history';

  return (
    <div className="bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-white min-h-screen flex flex-col">
      {!hideDefaultLayout && (
        <nav className="w-full top-0 sticky z-50 shadow-sm bg-surface">
          <div className="flex justify-between items-center px-gutter md:px-xl py-md max-w-container-max mx-auto h-20">
            <Link
              className="flex items-center gap-xs"
              to={userName ? '/home' : '/'}
            >
              <div className="h-10 w-10 bg-primary-container text-primary flex items-center justify-center rounded-md">
                <span className="material-symbols-outlined font-bold text-2xl">
                  redeem
                </span>
              </div>
              <span className="font-heading text-[24px] font-bold text-primary hidden sm:block">
                GiftMatch AI
              </span>
            </Link>

            <ul className="hidden md:flex items-center gap-lg">
              <li>
                <Link
                  className={navItemClass(isHomeActive)}
                  to={userName ? '/home' : '/'}
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  className={navItemClass(isRecommendationsActive)}
                  to="/recommendations"
                >
                  Khám phá
                </Link>
              </li>
              <li>
                <Link
                  className={navItemClass(isNotebookActive)}
                  to="/dashboard"
                >
                  Sổ tay
                </Link>
              </li>
              <li>
                <Link
                  className={navItemClass(isHistoryActive)}
                  to="/history"
                >
                  Lịch sử
                </Link>
              </li>
              {localStorage.getItem('role') === 'ADMIN' && (
                <li>
                  <Link
                    className="text-on-surface-variant hover:text-primary-container transition-all font-body-md"
                    to="/admin/ai"
                  >
                    Quản lý AI
                  </Link>
                </li>
              )}
            </ul>

            <div className="flex items-center gap-sm">
              {userName ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/favorites"
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all hidden sm:block"
                    title="Danh sách yêu thích"
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </Link>
                  <NotificationBell />
                  <Link
                    to="/profile"
                    title="Tài khoản của tôi"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all shadow-sm"
                  >
                    <span className="text-label-md font-bold text-on-surface">
                      {userName}
                    </span>
                    {userAvatar
                      && userAvatar !== 'null'
                      && userAvatar.startsWith('http') ? (
                        <img
                          src={userAvatar}
                          alt="Avatar"
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          account_circle
                        </span>
                      )}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="p-2 text-error hover:bg-error-container rounded-full transition-all"
                  >
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="font-label-md text-secondary border-2 border-secondary rounded-lg px-6 py-2 hover:bg-secondary hover:text-white transition-all hidden sm:block"
                >
                  Đăng nhập
                </Link>
              )}
              <button
                type="button"
                className="md:hidden text-primary p-2"
                aria-label="Mở menu"
              >
                <span className="material-symbols-outlined text-3xl">menu</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="flex-grow flex flex-col">{children}</div>

      {!hideDefaultLayout && (
        <footer className="w-full mt-auto bg-surface-container">
          <div className="flex flex-col md:flex-row justify-between items-center px-gutter md:px-xl py-lg max-w-container-max mx-auto gap-md text-center md:text-left">
            <div className="flex flex-col gap-xs">
              <span className="font-heading text-[20px] font-bold text-primary">
                GiftMatch AI
              </span>
              <span className="font-label-md text-secondary">
                © 2026 GiftMatch AI. All rights reserved.
              </span>
            </div>
            <ul className="flex flex-wrap justify-center gap-md">
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary" href="#">Privacy Policy</a></li>
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary" href="#">Terms of Service</a></li>
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary" href="#">Contact Us</a></li>
              <li><a className="font-label-md text-on-surface-variant hover:text-secondary" href="#">FAQ</a></li>
            </ul>
          </div>
        </footer>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token')
    || localStorage.getItem('fullName');
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/add-profile" element={<ProtectedRoute><AddRecipientProfile /></ProtectedRoute>} />
          <Route path="/edit-profile/:id" element={<ProtectedRoute><AddRecipientProfile /></ProtectedRoute>} />
          <Route path="/survey" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/store-profile" element={<ProtectedRoute><StoreProfilePage /></ProtectedRoute>} />
          <Route path="/store-products" element={<ProtectedRoute><StoreProductsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/ai" element={<ProtectedRoute><AiManagement /></ProtectedRoute>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
