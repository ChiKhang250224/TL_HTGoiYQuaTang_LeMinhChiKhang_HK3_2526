import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Dữ liệu mẫu (Mock data) giống như trong thiết kế
  const mockRecipients = [
    {
      id: 1,
      name: 'Huyền',
      age: 25,
      initial: 'H',
      avatarBg: 'bg-[#ffebd6] text-[#e8845a]',
      relationship: 'Bạn thân 💛',
      relBg: 'bg-[#fff5cc] text-[#9a7b00]',
      event: '🎂 Sinh nhật — còn 12 ngày',
      eventBg: 'bg-[#ffedeb] text-[#ba1a1a]',
    },
    {
      id: 2,
      name: 'Mẹ',
      age: 52,
      initial: 'M',
      avatarBg: 'bg-[#e0e0ff] text-[#5644d0]',
      relationship: 'Gia đình ❤️',
      relBg: 'bg-[#ffecf1] text-[#ba1a5e]',
      event: '💐 Ngày của Mẹ — còn 45 ngày',
      eventBg: 'bg-[#f0f0ff] text-[#4029ba]',
    },
    {
      id: 3,
      name: 'Tuấn Anh',
      age: 28,
      initial: 'TA',
      avatarBg: 'bg-[#ccf8f5] text-[#006a64]',
      relationship: 'Đồng nghiệp 🤝',
      relBg: 'bg-[#d6f5ff] text-[#00608a]',
      event: '📅 Chưa có sự kiện sắp tới',
      eventBg: 'bg-[#f4efed] text-[#55433c]',
    },
    {
      id: 4,
      name: 'Lan',
      age: 22,
      initial: 'L',
      avatarBg: 'bg-[#ffdad6] text-[#ba1a1a]',
      relationship: 'Người yêu ✨',
      relBg: 'bg-[#ffeadd] text-[#934b00]',
      event: '💖 Kỷ niệm — còn 5 ngày',
      eventBg: 'bg-[#ffedeb] text-[#ba1a1a]',
    }
  ];

  const [recipients] = useState(mockRecipients);

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

      {/* Grid Danh sách người nhận */}
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
              <button className="text-outline hover:text-primary-container p-2 transition-colors">
                <span className="material-symbols-outlined">edit</span>
              </button>
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
            <Link to="/recommendations" className="w-full bg-primary-container hover:bg-primary text-white py-3 rounded-xl font-label-md text-[16px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">featured_seasonal_and_gifts</span>
              Gợi ý quà
            </Link>

          </div>
        ))}
      </div>
    </main>
  );
}
