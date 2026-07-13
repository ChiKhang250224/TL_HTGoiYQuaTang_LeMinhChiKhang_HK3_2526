import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setFullName(localStorage.getItem('fullName') || '');
    setEmail(localStorage.getItem('email') || '');
    setAvatar(localStorage.getItem('avatar') || null);
  }, []);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex-grow w-full max-w-[720px] mx-auto px-gutter md:px-0 py-lg md:py-xl flex flex-col gap-lg animate-fade-in-up">
      <style>{`
        .input-wrapper { position: relative; }
        .input-field {
            width: 100%; padding: 24px 16px 8px; border: 1px solid transparent; border-radius: 12px;
            background-color: theme('colors.surface-container'); transition: all 0.2s ease;
        }
        .input-field:focus {
            outline: none; border-color: theme('colors.secondary-container');
            background-color: theme('colors.surface-container-lowest');
            box-shadow: 0 0 0 4px rgba(111, 95, 234, 0.1);
        }
        .input-label {
            position: absolute; top: 16px; left: 16px; color: theme('colors.on-surface-variant');
            transition: all 0.2s ease; pointer-events: none; transform-origin: left top;
        }
        .input-field:focus + .input-label, .input-field:not(:placeholder-shown) + .input-label {
            transform: translateY(-10px) scale(0.85); color: theme('colors.secondary-container');
        }
        .input-field:read-only + .input-label {
            transform: translateY(-10px) scale(0.85); color: theme('colors.on-surface-variant');
        }
        .input-field:read-only {
            background-color: theme('colors.surface-container-high'); cursor: not-allowed; color: theme('colors.on-surface-variant');
        }
        .password-toggle {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            color: theme('colors.on-surface-variant'); background: none; border: none;
            cursor: pointer; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease;
        }
        .password-toggle:hover { background-color: theme('colors.surface-variant'); color: theme('colors.on-surface'); }
      `}</style>

      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-sm">
        <nav aria-label="Breadcrumb" className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface">Tài khoản của tôi</span>
        </nav>
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Hồ sơ cá nhân</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Cập nhật thông tin cá nhân của bạn</p>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center justify-center gap-sm mt-md">
        <div className="relative group">
          {avatar && avatar !== 'null' && avatar.startsWith('http') ? (
            <img src={avatar} alt="Avatar" referrerPolicy="no-referrer" className="w-[100px] h-[100px] rounded-full object-cover border border-outline-variant shadow-sm" />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-surface-container-high flex items-center justify-center text-primary text-[40px] font-bold shadow-sm overflow-hidden">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <button aria-label="Thay đổi ảnh đại diện" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant shadow-sm flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          </button>
        </div>
        <h2 className="font-title-md text-title-md text-on-surface">{fullName || 'Người dùng GiftMatch'}</h2>
      </div>

      {/* Form Card */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-sm p-md md:p-lg flex flex-col gap-lg border border-surface-container border-opacity-50">
        <form className="flex flex-col gap-md">
          {/* Personal Info */}
          <div className="flex flex-col gap-md">
            <div className="input-wrapper">
              <input className="input-field font-body-md text-body-md text-on-surface" id="fullname" placeholder=" " type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <label className="input-label font-label-md text-label-md" htmlFor="fullname">Họ và tên</label>
            </div>
            <div className="input-wrapper">
              <input className="input-field font-body-md text-body-md text-on-surface" id="phone" placeholder=" " type="tel" defaultValue="" />
              <label className="input-label font-label-md text-label-md" htmlFor="phone">Số điện thoại</label>
            </div>
            <div className="input-wrapper relative group">
              <input className="input-field font-body-md text-body-md" id="email" placeholder=" " readOnly type="email" value={email} />
              <label className="input-label font-label-md text-label-md" htmlFor="email">Email</label>
              <div className="absolute right-4 top-[20px] text-on-surface-variant flex items-center justify-center cursor-help" title="Không thể thay đổi email đăng ký">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-sm py-sm">
            <div className="h-px bg-outline-variant flex-grow"></div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Đổi mật khẩu</span>
            <div className="h-px bg-outline-variant flex-grow"></div>
          </div>

          {/* Password Info */}
          <div className="flex flex-col gap-md">
            <div className="input-wrapper">
              <input className="input-field font-body-md text-body-md text-on-surface pr-12" id="current_password" placeholder=" " type={showCurrentPassword ? "text" : "password"} />
              <label className="input-label font-label-md text-label-md" htmlFor="current_password">Mật khẩu hiện tại</label>
              <button aria-label="Hiện mật khẩu" className="password-toggle" type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
            <div className="input-wrapper">
              <input className="input-field font-body-md text-body-md text-on-surface pr-12" id="new_password" placeholder=" " type={showNewPassword ? "text" : "password"} />
              <label className="input-label font-label-md text-label-md" htmlFor="new_password">Mật khẩu mới</label>
              <button aria-label="Hiện mật khẩu" className="password-toggle" type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                <span className="material-symbols-outlined text-[20px]">{showNewPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
            <div className="input-wrapper">
              <input className="input-field font-body-md text-body-md text-on-surface pr-12" id="confirm_password" placeholder=" " type={showConfirmPassword ? "text" : "password"} />
              <label className="input-label font-label-md text-label-md" htmlFor="confirm_password">Xác nhận mật khẩu mới</label>
              <button aria-label="Hiện mật khẩu" className="password-toggle" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-sm justify-end mt-md pt-sm">
            <button className="px-6 py-3 rounded-[12px] font-label-md text-label-md font-bold text-secondary-container border-2 border-secondary-container hover:bg-secondary-fixed transition-colors order-2 sm:order-1" type="button">
              Hủy
            </button>
            <button className="px-6 py-3 rounded-[12px] font-label-md text-label-md font-bold text-on-primary bg-primary-container hover:bg-primary transition-colors order-1 sm:order-2 shadow-sm hover:shadow-md" onClick={handleSave} type="button">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      <div className={`fixed top-24 right-gutter md:right-xl bg-tertiary-container text-on-tertiary-container px-4 py-3 rounded-lg shadow-md font-label-md text-label-md flex items-center gap-xs z-50 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px] pointer-events-none'}`}>
        <span className="material-symbols-outlined filled">check_circle</span>
        Cập nhật thông tin thành công!
      </div>
    </div>
  );
}
