import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function SurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    recipientName: location.state?.recipientName || '',
    recipientProfileId: location.state?.recipientProfileId || null,
    relationship: '',
    occasion: '',
    ageGroup: '',
    gender: '',
    hobby: '',
    personality: '',
    budget: 500, // Used for slider, mapping logic at submission
    style: '',
    relationshipCloseness: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const nextStep = () => {
    const requiredByStep = {
      1: ['recipientName', 'relationship', 'relationshipCloseness'],
      2: ['occasion'],
      3: ['ageGroup', 'gender'],
      4: ['hobby'],
      5: ['personality'],
      6: ['style']
    };
    const missing = requiredByStep[step]?.some((field) => {
      const value = formData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });
    if (missing) {
      setError('Vui lòng chọn đầy đủ thông tin trước khi tiếp tục.');
      return;
    }
    if (step < totalSteps) setStep(step + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1); // Back to previous page if at step 1
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        recipientName: formData.recipientName.trim(),
        topK: 10,
      };
      localStorage.setItem('temp_survey_data', JSON.stringify(payload));
      const response = await api.post('/recommendations', payload);
      localStorage.setItem(
        'giftmatch_recommendation_result',
        JSON.stringify(response.data)
      );
      navigate('/recommendations', { state: { result: response.data } });
    } catch (requestError) {
      const message = requestError.response?.data?.detail
        || requestError.response?.data?.message
        || 'Không thể kết nối dịch vụ AI. Vui lòng thử lại.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper cho giao diện Card Selectable
  const SelectCard = ({ icon, title, subtitle, isSelected, onClick }) => (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 border-2
        ${isSelected ? 'border-[#e8845a] bg-[#fffaf5] shadow-sm' : 'border-outline-variant/30 hover:border-outline hover:bg-surface-container-lowest'}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[24px] 
        ${isSelected ? 'bg-[#e8845a] text-white' : 'bg-surface-variant/30 text-secondary'}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h4 className="font-title-md font-bold text-on-surface leading-tight">{title}</h4>
        {subtitle && <p className="font-label-sm text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      {isSelected && (
        <div className="absolute right-4 text-[#e8845a]">
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center p-4 py-8">
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-sm border border-outline-variant/20 p-6 sm:p-10">
        
        {/* Header - Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="font-label-md text-on-surface-variant font-medium">Bước {step} trên {totalSteps}</span>
            {step === 3 && <span className="font-label-sm text-[#e8845a]">Đang phân tích...</span>}
          </div>
          <div className="w-full bg-surface-variant/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#e8845a] h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Cấu trúc từng Bước (Step Content) */}
        <div className="min-h-[400px]">
          
          {/* BƯỚC 1: NGƯỜI NHẬN */}
          {step === 1 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-[#ffebd6] text-[#e8845a] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">person</span>
              </div>
              <h2 className="font-display-sm font-bold text-on-surface mb-2">Bạn đang tìm quà cho ai?</h2>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
                Hãy cho chúng tôi biết thông tin về người nhận để cá nhân hóa gợi ý tốt nhất.
              </p>
              
              <div className="space-y-6 text-left max-w-lg mx-auto">
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-2">Người đặc biệt ấy tên là gì?</label>
                  <input 
                    type="text" 
                    value={formData.recipientName} 
                    onChange={e => updateData('recipientName', e.target.value)}
                    placeholder="VD: Lan, Nam, Mẹ..."
                    className="w-full p-4 rounded-xl border border-outline-variant/50 focus:border-[#e8845a] focus:ring-1 focus:ring-[#e8845a] outline-none transition-colors"
                  />
                  <p className="font-label-sm text-on-surface-variant/70 mt-1">Tên chỉ dùng để hiển thị giao diện, không ảnh hưởng đến kết quả AI.</p>
                </div>
                
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-3">Hai người thân thiết với nhau như thế nào?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'Partner', icon: 'favorite', title: 'Người yêu' },
                      { id: 'Family', icon: 'family_home', title: 'Gia đình' },
                      { id: 'Friend', icon: 'diversity_1', title: 'Bạn bè' },
                      { id: 'Colleague', icon: 'work', title: 'Đồng nghiệp' },
                      { id: 'Teacher', icon: 'school', title: 'Thầy cô' }
                    ].map(item => (
                      <SelectCard 
                        key={item.id}
                        icon={item.icon} 
                        title={item.title}
                        isSelected={formData.relationship === item.id}
                        onClick={() => updateData('relationship', item.id)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-3">Mức độ thân thiết:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'very close', title: 'Rất thân thiết' },
                      { id: 'close', title: 'Thân thiết' },
                      { id: 'neutral', title: 'Bình thường' },
                      { id: 'distant', title: 'Ít thân thiết' }
                    ].map(item => (
                      <SelectCard
                        key={item.id}
                        icon="diversity_3"
                        title={item.title}
                        isSelected={formData.relationshipCloseness === item.id}
                        onClick={() => updateData('relationshipCloseness', item.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: DỊP TẶNG QUÀ */}
          {step === 2 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-[#ffebd6] text-[#e8845a] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">calendar_month</span>
              </div>
              <h2 className="font-display-sm font-bold text-on-surface mb-2">Dịp lễ đặc biệt là gì?</h2>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
                Chọn một dịp để chúng tôi có thể gợi ý những món quà phù hợp nhất với ý nghĩa của ngày đó.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'Birthday', title: 'Sinh nhật', icon: 'cake', subtitle: 'Một ngày đặc biệt cho họ' },
                  { id: 'Anniversary', title: 'Kỷ niệm', icon: 'favorite', subtitle: 'Khoảnh khắc lãng mạn' },
                  { id: 'Graduation', title: 'Tốt nghiệp', icon: 'school', subtitle: 'Mừng cột mốc mới' },
                  { id: 'Farewell', title: 'Chia tay', icon: 'flight_takeoff', subtitle: 'Chuyến đi mới / Thay đổi' },
                  { id: 'Festival', title: 'Ngày lễ', icon: 'celebration', subtitle: 'Lễ hội, Năm mới, Giáng sinh' },
                  { id: "Valentine's Day", title: 'Valentine', icon: 'volunteer_activism', subtitle: 'Dành cho tình yêu' }
                ].map(item => (
                  <SelectCard 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title}
                    subtitle={item.subtitle}
                    isSelected={formData.occasion === item.id}
                    onClick={() => updateData('occasion', item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BƯỚC 3: THÔNG TIN CƠ BẢN */}
          {step === 3 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-[#ffebd6] text-[#e8845a] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">face</span>
              </div>
              <h2 className="font-display-sm font-bold text-on-surface mb-2">Độ tuổi & Giới tính?</h2>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
                {formData.recipientName ? `Điều này giúp gợi ý quà cho ${formData.recipientName} chuẩn xác hơn.` : 'Điều này giúp AI lọc ra những sản phẩm phù hợp.'}
              </p>
              
              <div className="space-y-8 text-left max-w-lg mx-auto">
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-3">Nhóm tuổi:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'Child', title: 'Trẻ em' },
                      { id: 'Teen', title: 'Thanh thiếu niên' },
                      { id: 'Adult', title: 'Người trưởng thành' },
                      { id: 'Senior', title: 'Người cao tuổi' }
                    ].map(item => (
                      <SelectCard 
                        key={item.id}
                        icon="escalator_warning" 
                        title={item.title}
                        isSelected={formData.ageGroup === item.id}
                        onClick={() => updateData('ageGroup', item.id)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-3">Giới tính:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'Female', title: 'Nữ', icon: 'female' },
                      { id: 'Male', title: 'Nam', icon: 'male' }
                    ].map(item => (
                      <SelectCard 
                        key={item.id}
                        icon={item.icon} 
                        title={item.title}
                        isSelected={formData.gender === item.id}
                        onClick={() => updateData('gender', item.id)}
                      />
                    ))}
                  </div>
                  <p className="font-label-sm text-on-surface-variant/70 mt-3 text-center">Hiện tại hệ thống tối ưu cho 2 nhóm giới tính chính dựa trên bộ dữ liệu AI.</p>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 4: SỞ THÍCH */}
          {step === 4 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-[#ffebd6] text-[#e8845a] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">interests</span>
              </div>
              <h2 className="font-display-sm font-bold text-on-surface mb-2">Lĩnh vực yêu thích nhất?</h2>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
                Chọn một sở thích nổi bật nhất để chúng tôi tìm món quà {formData.recipientName ? formData.recipientName : 'người ấy'} sẽ thực sự sử dụng.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'Tech', title: 'Công nghệ', icon: 'devices' },
                  { id: 'Books', title: 'Sách', icon: 'menu_book' },
                  { id: 'Fashion', title: 'Thời trang', icon: 'checkroom' },
                  { id: 'Gaming', title: 'Trò chơi', icon: 'sports_esports' },
                  { id: 'Home Decor', title: 'Trang trí nhà cửa', icon: 'home' },
                  { id: 'Music', title: 'Âm nhạc', icon: 'headphones' },
                  { id: 'Art', title: 'Nghệ thuật', icon: 'palette' },
                  { id: 'Fitness', title: 'Thể thao', icon: 'fitness_center' },
                  { id: 'Travel', title: 'Du lịch', icon: 'flight' }
                ].map(item => (
                  <SelectCard 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title}
                    isSelected={formData.hobby === item.id}
                    onClick={() => updateData('hobby', item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BƯỚC 5: TÍNH CÁCH */}
          {step === 5 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-[#ffebd6] text-[#e8845a] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">psychology</span>
              </div>
              <h2 className="font-display-sm font-bold text-on-surface mb-2">Nét tính cách nổi bật nhất?</h2>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
                Mỗi món quà mang một ý nghĩa riêng, phù hợp với tâm hồn của từng người.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'Creative', title: 'Sáng tạo', icon: 'emoji_objects', sub: 'Thích cái mới lạ, độc đáo' },
                  { id: 'Emotional', title: 'Tình cảm', icon: 'volunteer_activism', sub: 'Trân trọng kỷ niệm' },
                  { id: 'Introvert', title: 'Hướng nội', icon: 'self_improvement', sub: 'Tận hưởng sự yên tĩnh' },
                  { id: 'Extrovert', title: 'Hướng ngoại', icon: 'celebration', sub: 'Thích kết nối, năng động' },
                  { id: 'Practical', title: 'Thực tế', icon: 'fact_check', sub: 'Ưa chuộng công năng hữu ích' }
                ].map(item => (
                  <SelectCard 
                    key={item.id}
                    icon={item.icon} 
                    title={item.title}
                    subtitle={item.sub}
                    isSelected={formData.personality === item.id}
                    onClick={() => updateData('personality', item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BƯỚC 6: NGÂN SÁCH & PHONG CÁCH */}
          {step === 6 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-[#ffebd6] text-[#e8845a] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">payments</span>
              </div>
              <h2 className="font-display-sm font-bold text-on-surface mb-2">Ngân sách & Phong cách</h2>
              <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
                Bước cuối cùng! Cho chúng tôi biết khoảng giá bạn muốn chi và phong cách món quà.
              </p>
              
              <div className="space-y-10 text-left max-w-lg mx-auto">
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <label className="font-label-lg font-bold text-on-surface">Bạn dự định chi bao nhiêu?</label>
                    <span className="font-title-md font-bold text-[#e8845a]">
                      {formData.budget <= 500 ? '≤ 500k VNĐ' : 
                       formData.budget <= 1000 ? '500k - 1.000k VNĐ' : 
                       formData.budget <= 3000 ? '1.000k - 3.000k VNĐ' : '> 3.000k VNĐ'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    step="100"
                    value={formData.budget}
                    onChange={(e) => updateData('budget', parseInt(e.target.value))}
                    className="w-full accent-[#e8845a] h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-label-sm text-on-surface-variant mt-2 font-medium">
                    <span>100k</span>
                    <span>5.000k+</span>
                  </div>
                </div>
                
                <div>
                  <label className="block font-label-lg font-bold text-on-surface mb-4">Bạn muốn món quà thể hiện phong cách nào?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'practical', title: 'Thiết thực', icon: 'build' },
                      { id: 'luxury', title: 'Cao cấp', icon: 'diamond' },
                      { id: 'fun', title: 'Vui nhộn', icon: 'mood' },
                      { id: 'sentimental', title: 'Tình cảm', icon: 'favorite' }
                    ].map(item => (
                      <SelectCard 
                        key={item.id}
                        icon={item.icon} 
                        title={item.title}
                        isSelected={formData.style === item.id}
                        onClick={() => updateData('style', item.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {error && (
          <div className="mt-6 rounded-xl bg-error-container px-4 py-3 text-error font-label-md">
            {error}
          </div>
        )}
        <div className="mt-6 pt-6 border-t border-outline-variant/30 flex justify-between items-center">
          <button 
            onClick={prevStep}
            className="flex items-center gap-2 font-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-surface-variant/20"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Quay lại
          </button>
          
          <button 
            onClick={nextStep}
            disabled={submitting}
            className="flex items-center gap-2 font-label-md font-semibold bg-[#e8845a] text-white px-8 py-3 rounded-full hover:bg-[#d07040] transition-colors shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'AI đang phân tích...' : (step === totalSteps ? 'Hoàn thành' : 'Tiếp theo')}
            {step !== totalSteps && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
        </div>

      </div>
    </div>
  );
}
