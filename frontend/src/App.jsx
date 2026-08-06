import { lazy, Suspense, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import NotificationBell from './components/NotificationBell';

const AddRecipientProfile = lazy(() => import('./pages/AddRecipientProfile'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminProductReportsPage = lazy(() => import('./pages/AdminProductReportsPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminStoresPage = lazy(() => import('./pages/AdminStoresPage'));
const AdminTaxonomyPage = lazy(() => import('./pages/AdminTaxonomyPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'));
const AdminAuditPage = lazy(() => import('./pages/AdminAuditPage'));
const AiManagement = lazy(() => import('./pages/AiManagement'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExploreProductsPage = lazy(() => import('./pages/ExploreProductsPage'));
const Favorites = lazy(() => import('./pages/Favorites'));
const History = lazy(() => import('./pages/History'));
const Home = lazy(() => import('./pages/Home'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProductCompare = lazy(() => import('./pages/ProductCompare'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const StoreProductsPage = lazy(() => import('./pages/StoreProductsPage'));
const StoreProfilePage = lazy(() => import('./pages/StoreProfilePage'));
const StoreAnalyticsPage = lazy(() => import('./pages/StoreAnalyticsPage'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));
const UserHome = lazy(() => import('./pages/UserHome'));

function RouteLoading() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
        <span className="font-semibold text-on-surface-variant">Đang tải nội dung...</span>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const location = useLocation();
  const noLayoutPages = [
    '/login',
    '/register',
    '/store-profile',
    '/store-products',
    '/store-dashboard',
    '/store-analytics',
    '/survey',
    '/admin',
  ];
  const hideDefaultLayout = noLayoutPages.includes(location.pathname)
    || location.pathname.startsWith('/admin/');
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('fullName'));
    setUserAvatar(localStorage.getItem('avatar'));
    setMobileOpen(false);
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
  const isRecommendationsActive = location.pathname === '/explore';
  const isNotebookActive = location.pathname === '/dashboard'
    || location.pathname === '/add-profile'
    || location.pathname.startsWith('/edit-profile/');
  const isHistoryActive = location.pathname === '/history';
  const isCompareActive = location.pathname === '/compare';
  const role = localStorage.getItem('role');

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
                  to="/explore"
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
              {role === 'CUSTOMER' && (
                <li>
                  <Link
                    className={navItemClass(isCompareActive)}
                    to="/compare"
                  >
                    So sánh
                  </Link>
                </li>
              )}
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
                onClick={() => setMobileOpen(open => !open)}
                className="md:hidden text-primary p-2"
                aria-label="Mở menu"
                aria-expanded={mobileOpen}
              >
                <span className="material-symbols-outlined text-3xl">menu</span>
              </button>
            </div>
          </div>
          {mobileOpen && (
            <div className="border-t border-outline-variant bg-surface px-4 py-3 md:hidden">
              <div className="mx-auto grid max-w-container-max grid-cols-2 gap-2">
                <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to={userName ? '/home' : '/'}>Trang chủ</Link>
                <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/explore">Khám phá</Link>
                {role === 'CUSTOMER' && <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/dashboard">Sổ tay</Link>}
                {role === 'CUSTOMER' && <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/history">Lịch sử</Link>}
                {role === 'CUSTOMER' && <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/favorites">Yêu thích</Link>}
                {role === 'CUSTOMER' && <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/compare">So sánh</Link>}
                {role === 'ADMIN' && <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/admin">Quản trị</Link>}
                {role === 'STORE' && <Link className="rounded-xl bg-surface-container px-3 py-2 font-bold" to="/store-products">Cửa hàng</Link>}
              </div>
            </div>
          )}
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

function defaultRouteForRole(role) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'STORE') return '/store-products';
  return '/home';
}

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={defaultRouteForRole(role)} replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><UserHome /></ProtectedRoute>} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Dashboard /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Recommendations /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ExploreProductsPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Favorites /></ProtectedRoute>} />
          <Route path="/add-profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><AddRecipientProfile /></ProtectedRoute>} />
          <Route path="/edit-profile/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><AddRecipientProfile /></ProtectedRoute>} />
          <Route path="/survey" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><SurveyPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/products/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ProductCompare /></ProtectedRoute>} />
          <Route path="/store-profile" element={<ProtectedRoute allowedRoles={['STORE', 'ADMIN']}><StoreProfilePage /></ProtectedRoute>} />
          <Route path="/store-products" element={<ProtectedRoute allowedRoles={['STORE', 'ADMIN']}><StoreProductsPage /></ProtectedRoute>} />
          <Route path="/store-dashboard" element={<ProtectedRoute allowedRoles={['STORE', 'ADMIN']}><StoreAnalyticsPage /></ProtectedRoute>} />
          <Route path="/store-analytics" element={<ProtectedRoute allowedRoles={['STORE', 'ADMIN']}><StoreAnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminStoresPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProductsPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProductReportsPage /></ProtectedRoute>} />
          <Route path="/admin/labels" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTaxonomyPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAuditPage /></ProtectedRoute>} />
          <Route path="/admin/ai" element={<ProtectedRoute allowedRoles={['ADMIN']}><AiManagement /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
