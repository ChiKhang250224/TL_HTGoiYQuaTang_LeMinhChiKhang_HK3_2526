import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddRecipientProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    relationship: '',
    hobbies: ['Công nghệ', 'Nấu ăn'], // Mock initial
    notes: '',
    anniversaries: [{ eventName: 'Sinh nhật', eventDate: '' }]
  });

  const availableHobbies = [
    'Công nghệ', 'Nấu ăn', 'Du lịch', 'Thời trang', 'Sách', 'Âm nhạc', 'Thể thao'
  ];

  const handleToggleHobby = (hobby) => {
    setFormData(prev => {
      const hobbies = prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby];
      return { ...prev, hobbies };
    });
  };

  const handleAddAnniversary = () => {
    setFormData(prev => ({
      ...prev,
      anniversaries: [...prev.anniversaries, { eventName: '', eventDate: '' }]
    }));
  };

  const handleRemoveAnniversary = (index) => {
    setFormData(prev => ({
      ...prev,
      anniversaries: prev.anniversaries.filter((_, i) => i !== index)
    }));
  };

  const handleAnniversaryChange = (index, field, value) => {
    setFormData(prev => {
      const newAnniversaries = [...prev.anniversaries];
      newAnniversaries[index][field] = value;
      return { ...prev, anniversaries: newAnniversaries };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to save
    console.log('Save profile', formData);
    navigate('/dashboard'); // Navigate back to notebook
  };

  return (
    <main className="flex-grow max-w-3xl mx-auto w-full px-gutter md:px-xl py-lg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant mb-4">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to="/dashboard" className="hover:text-primary transition-colors">Sổ tay</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary font-bold">Thêm người nhận</span>
      </div>

      <div className="mb-8">
        <h1 className="font-display-lg text-[32px] md:text-[40px] font-bold text-on-surface mb-2">
          Thêm Hồ sơ Người nhận
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Xây dựng hồ sơ chi tiết để AI đề xuất những món quà tinh tế và ý nghĩa nhất.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-surface-container">
        
        {/* Section 1: Thông tin cơ bản */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-title-md font-bold text-on-surface mb-6 border-b border-surface-container pb-4">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
            Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-md text-on-surface mb-2 font-medium">Họ và tên</label>
              <input 
                type="text" 
                placeholder="Nhập tên người nhận"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-label-md text-on-surface mb-2 font-medium">Độ tuổi</label>
              <input 
                type="number" 
                placeholder="Ví dụ: 25"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-3 bg-surface-container rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-label-md text-on-surface mb-3 font-medium">Giới tính</label>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Nam" checked={formData.gender === 'Nam'} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-5 h-5 accent-primary text-primary" />
                  <span className="text-body-md text-on-surface">Nam</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Nữ" checked={formData.gender === 'Nữ'} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-5 h-5 accent-primary text-primary" />
                  <span className="text-body-md text-on-surface">Nữ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Khác" checked={formData.gender === 'Khác'} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-5 h-5 accent-primary text-primary" />
                  <span className="text-body-md text-on-surface">Khác</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-label-md text-on-surface mb-2 font-medium">Mối quan hệ</label>
              <div className="relative">
                <select 
                  value={formData.relationship}
                  onChange={e => setFormData({...formData, relationship: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Chọn mối quan hệ</option>
                  <option value="Gia đình">Gia đình</option>
                  <option value="Bạn bè">Bạn bè</option>
                  <option value="Đồng nghiệp">Đồng nghiệp</option>
                  <option value="Người yêu">Người yêu</option>
                  <option value="Khác">Khác</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Cá tính & Sở thích */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-title-md font-bold text-on-surface mb-6 border-b border-surface-container pb-4">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            Cá tính & Sở thích
          </h2>
          
          <div className="mb-6">
            <label className="block text-label-md text-on-surface mb-3 font-medium">Sở thích tiêu biểu</label>
            <div className="flex flex-wrap gap-3">
              {availableHobbies.map(hobby => {
                const isSelected = formData.hobbies.includes(hobby);
                return (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => handleToggleHobby(hobby)}
                    className={`px-4 py-2 rounded-full text-label-md transition-all ${
                      isSelected 
                        ? 'bg-secondary-fixed text-on-secondary-fixed font-bold' 
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {hobby}
                  </button>
                );
              })}
              <button type="button" className="px-4 py-2 rounded-full text-label-md text-primary border border-dashed border-primary hover:bg-primary-container hover:text-white transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">add</span> Thêm mới
              </button>
            </div>
          </div>

          <div>
            <label className="block text-label-md text-on-surface mb-2 font-medium">Ghi chú sở thích chi tiết</label>
            <textarea 
              rows="3"
              placeholder="Người này thích những thứ tối giản, màu pastel, thường xuyên uống cà phê đặc sản..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-3 bg-surface-container rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-transparent transition-all resize-none"
            ></textarea>
          </div>
        </section>

        {/* Section 3: Ngày kỷ niệm */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-title-md font-bold text-on-surface mb-6 border-b border-surface-container pb-4">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
            Ngày kỷ niệm quan trọng
          </h2>
          
          <div className="space-y-4">
            {formData.anniversaries.map((ann, index) => (
              <div key={index} className="flex items-end gap-4">
                <div className="flex-grow">
                  <label className="block text-label-md text-on-surface mb-2 font-medium">Tên sự kiện</label>
                  <input 
                    type="text" 
                    placeholder="Sinh nhật, Kỷ niệm..."
                    value={ann.eventName}
                    onChange={e => handleAnniversaryChange(index, 'eventName', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-transparent transition-all"
                  />
                </div>
                <div className="flex-grow">
                  <label className="block text-label-md text-on-surface mb-2 font-medium">Ngày kỷ niệm</label>
                  <input 
                    type="date" 
                    value={ann.eventDate}
                    onChange={e => handleAnniversaryChange(index, 'eventDate', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-transparent transition-all text-on-surface-variant uppercase"
                  />
                </div>
                {formData.anniversaries.length > 1 && (
                  <button type="button" onClick={() => handleRemoveAnniversary(index)} className="p-3 text-outline hover:text-error transition-colors mb-1">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button type="button" onClick={handleAddAnniversary} className="mt-4 flex items-center gap-1 text-primary font-bold text-label-md hover:underline">
            <span className="material-symbols-outlined text-[20px]">add_circle</span> Thêm ngày kỷ niệm khác
          </button>
        </section>

        {/* AI Tip */}
        <div className="bg-surface-container rounded-2xl p-5 flex items-start gap-4 mb-10 border border-surface-container-high">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          </div>
          <div>
            <h4 className="font-bold text-label-md text-on-surface mb-1">Mẹo từ AI Advisor</h4>
            <p className="text-label-sm text-on-surface-variant leading-relaxed">
              Càng có nhiều thông tin chi tiết về cá tính, AI sẽ càng gợi ý chính xác những món quà mang tính cá nhân hóa cao.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 rounded-xl border border-outline-variant text-on-surface font-bold hover:bg-surface-container transition-colors">
            Hủy
          </button>
          <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">save</span> Lưu hồ sơ
          </button>
        </div>
      </form>
    </main>
  );
}
