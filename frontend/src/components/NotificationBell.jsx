import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const formatEventDate = value => {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/notifications/unread-count')
      .then(response => {
        if (active) setUnreadCount(Number(response.data?.count || 0));
      })
      .catch(() => {
        if (active) setUnreadCount(0);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleNotifications = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.get('/notifications/me');
      const data = Array.isArray(response.data) ? response.data : [];
      setNotifications(data);
      setUnreadCount(data.filter(item => !item.read).length);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || 'Không thể tải thông báo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const markRead = async notification => {
    if (notification.read) return;
    try {
      await api.put(`/notifications/${notification.notificationId}/read`);
      setNotifications(current => current.map(item => (
        item.notificationId === notification.notificationId
          ? { ...item, read: true }
          : item
      )));
      setUnreadCount(current => Math.max(0, current - 1));
    } catch {
      setError('Không thể cập nhật trạng thái thông báo.');
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(current => current.map(item => ({
        ...item,
        read: true,
      })));
      setUnreadCount(0);
    } catch {
      setError('Không thể đánh dấu đã đọc.');
    }
  };

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={toggleNotifications}
        className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all"
        aria-label="Thông báo nhắc chọn quà"
        aria-expanded={open}
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-5 h-5 px-1 rounded-full bg-error text-white text-[11px] font-bold grid place-items-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[360px] max-w-[90vw] rounded-2xl border border-outline-variant bg-white shadow-xl overflow-hidden z-[70]">
          <div className="flex items-center justify-between border-b border-surface-container px-4 py-3">
            <div>
              <h2 className="font-bold text-on-surface">Nhắc chọn quà</h2>
              <p className="text-label-sm text-on-surface-variant">
                Sự kiện trong 30 ngày tới
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-label-sm font-bold text-primary hover:underline"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-on-surface-variant">
                Đang tải thông báo...
              </p>
            ) : error ? (
              <p className="p-4 text-error">{error}</p>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-outline">
                  notifications_off
                </span>
                <p className="mt-2 font-bold">Chưa có lời nhắc mới</p>
                <p className="mt-1 text-label-md text-on-surface-variant">
                  Thêm ngày kỷ niệm vào Sổ tay để nhận thông báo.
                </p>
              </div>
            ) : notifications.map(notification => (
              <Link
                key={notification.notificationId}
                to="/survey"
                state={{
                  recipientProfileId: notification.profileId,
                  recipientName: notification.recipientName,
                }}
                onClick={() => {
                  markRead(notification);
                  setOpen(false);
                }}
                className={`block border-b border-surface-container px-4 py-4 transition-colors hover:bg-surface-container-low ${
                  notification.read ? 'bg-white' : 'bg-primary/5'
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center">
                    <span className="material-symbols-outlined">redeem</span>
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-label-md text-on-surface">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-label-md text-on-surface-variant">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-label-sm font-bold text-primary">
                      {formatEventDate(notification.eventDate)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
