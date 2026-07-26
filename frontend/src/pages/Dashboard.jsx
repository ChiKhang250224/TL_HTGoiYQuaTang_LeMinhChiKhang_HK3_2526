import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Dashboard() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/profiles/me');
        
        // Transform data from backend to match UI expectations
        const transformed = res.data.map((profile, index) => {
          const colors = [
            { av: 'bg-[#ffebd6] text-[#e8845a]', rel: 'bg-[#fff5cc] text-[#9a7b00]', ev: 'bg-[#ffedeb] text-[#ba1a1a]' },
            { av: 'bg-[#e0e0ff] text-[#5644d0]', rel: 'bg-[#ffecf1] text-[#ba1a5e]', ev: 'bg-[#f0f0ff] text-[#4029ba]' },
            { av: 'bg-[#ccf8f5] text-[#006a64]', rel: 'bg-[#d6f5ff] text-[#00608a]', ev: 'bg-[#f4efed] text-[#55433c]' },
            { av: 'bg-[#ffdad6] text-[#ba1a1a]', rel: 'bg-[#ffeadd] text-[#934b00]', ev: 'bg-[#ffedeb] text-[#ba1a1a]' }
          ];
          const colorSet = colors[index % colors.length];
          
          let nextEvent = '📅 Chưa có sự kiện sắp tới';
          if (profile.anniversaries && profile.anniversaries.length > 0) {
             const ev = profile.anniversaries[0];
             nextEvent = `${ev.eventName} — ${ev.eventDate}`;
          }
          
          return {
            id: profile.profileId,
            name: profile.fullName,
            age: profile.age,
            initial: profile.fullName.charAt(0).toUpperCase(),
            avatarBg: colorSet.av,
            relationship: profile.relationship,
            relBg: colorSet.rel,
            event: nextEvent,
            eventBg: colorSet.ev,
          };
        });
        
        setRecipients(transformed);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError('Không thể tải Sổ tay người nhận.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  const handleDelete = async (person) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa hồ sơ của ${person.name}?`
    );
    if (!confirmed) return;
    setDeletingId(person.id);
    setError('');
    try {
      await api.delete(`/profiles/${person.id}`);
      setRecipients(current => current.filter(item => item.id !== person.id));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || 'Không thể xóa hồ sơ người nhận.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow grid place-items-center">
        <div className="text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
            menu_book
          </span>
          <p>Đang tải Sổ tay...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg lg:py-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-xl gap-4">
        <h1 className="font-heading text-display-lg text-on-surface font-bold flex items-center gap-3">
          Sổ tay người nhận <span className="text-[40px]">📓</span>
        </h1>
        <Link to="/add-profile" className="bg-primary-container hover:bg-primary text-white px-6 py-3 rounded-xl font-label-md text-[16px] font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm người nhận
        </Link>
      </div>

      {error && (
        <div className="mb-lg rounded-xl bg-error-container px-4 py-3 text-error">
          {error}
        </div>
      )}

      {/* Grid Danh sách người nhận */}
      {recipients.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-outline-variant bg-white p-xl text-center">
          <span className="material-symbols-outlined text-6xl text-outline">
            person_add
          </span>
          <h2 className="font-title-lg font-bold mt-md">Sổ tay đang trống</h2>
          <p className="text-on-surface-variant mt-xs mb-lg">
            Thêm người nhận mới hoặc lưu hồ sơ ngay sau khi hoàn thành khảo sát.
          </p>
          <Link
            to="/add-profile"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-bold"
          >
            <span className="material-symbols-outlined">add</span>
            Thêm người nhận
          </Link>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md lg:gap-lg">
        {recipients.map((person) => (
          <div key={person.id} className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            
            {/* User Info Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-heading text-title-md font-bold ${person.avatarBg}`}>
                  {person.initial}
                </div>
                <div>
                  <h3 className="font-heading text-[22px] font-bold text-on-surface leading-tight">
                    {person.name}
                  </h3>
                  <span className="font-body-md text-on-surface-variant">
                    {person.age} tuổi
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Link to={`/edit-profile/${person.id}`} className="text-outline hover:text-primary-container p-2 transition-colors inline-block" title="Chỉnh sửa">
                  <span className="material-symbols-outlined">edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(person)}
                  disabled={deletingId === person.id}
                  className="text-outline hover:text-error p-2 transition-colors disabled:opacity-50"
                  title="Xóa hồ sơ"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            {/* Relationship Badge */}
            <div className="mb-6">
              <span className={`inline-block px-3 py-1.5 rounded-full font-label-sm text-[13px] font-bold ${person.relBg}`}>
                {person.relationship}
              </span>
            </div>

            {/* Event Notification */}
            <div className={`w-full px-4 py-3 rounded-xl font-label-md text-[14px] font-semibold mb-4 ${person.eventBg}`}>
              {person.event}
            </div>

            {/* Action Button */}
            <Link
              to="/survey"
              state={{ recipientProfileId: person.id, recipientName: person.name }}
              className="w-full bg-primary-container hover:bg-primary text-white py-3 rounded-xl font-label-md text-[16px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">featured_seasonal_and_gifts</span>
              Gợi ý quà
            </Link>

          </div>
        ))}
      </div>
      )}
    </main>
  );
}
