import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import useFavorites from '../hooks/useFavorites';
import { GIFT_NAME_LABELS, GIFT_TYPE_LABELS } from '../constants/giftTaxonomy';
import api from '../utils/api';
import RecommendationFeedback from '../components/RecommendationFeedback';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

const readStoredJson = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const ageByGroup = {
  Child: 10,
  Teen: 15,
  Adult: 30,
  Senior: 65,
};

const genderLabels = {
  Female: 'Nữ',
  Male: 'Nam',
};

const relationshipLabels = {
  Partner: 'Người yêu',
  Family: 'Gia đình',
  Friend: 'Bạn bè',
  Colleague: 'Đồng nghiệp',
  Teacher: 'Thầy cô',
};

const hobbyLabels = {
  Tech: 'Công nghệ',
  Books: 'Sách',
  Fashion: 'Thời trang',
  Gaming: 'Trò chơi',
  'Home Decor': 'Trang trí nhà cửa',
  Music: 'Âm nhạc',
  Art: 'Nghệ thuật',
  Fitness: 'Thể thao',
  Travel: 'Du lịch',
};

export default function Recommendations() {
  const location = useLocation();
  const storedResult = readStoredJson('giftmatch_recommendation_result');
  const surveyData = readStoredJson('temp_survey_data');
  const result = location.state?.result || storedResult;
  const { toggleFavorite, isFavorite } = useFavorites();
  const [sortOrder, setSortOrder] = useState('Độ phù hợp');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [savedProfileId, setSavedProfileId] = useState(
    result?.recipientProfileId || surveyData?.recipientProfileId || null
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const products = useMemo(() => {
    const source = result?.products || [];
    const filtered = source.filter((product) => (
      (selectedType === 'all' || product.giftType === selectedType)
      && Number(product.price) <= maxPrice
    ));
    return [...filtered].sort((left, right) => {
      if (sortOrder === 'Giá tăng dần') {
        return Number(left.price) - Number(right.price);
      }
      if (sortOrder === 'Mới nhất') {
        return Number(right.productId) - Number(left.productId);
      }
      return Number(right.matchScore) - Number(left.matchScore);
    });
  }, [maxPrice, result, selectedType, sortOrder]);

  const availableTypes = useMemo(
    () => [...new Set((result?.predictedGifts || []).map((gift) => gift.gift_type))],
    [result]
  );

  const saveRecipientToNotebook = async () => {
    const recipientName = result?.recipientName?.trim()
      || surveyData?.recipientName?.trim();
    if (!recipientName || !surveyData) {
      setSaveError('Thiếu dữ liệu người nhận để lưu vào Sổ tay.');
      return;
    }

    setSavingProfile(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const profileResponse = await api.post('/profiles/me', {
        fullName: recipientName,
        age: ageByGroup[surveyData.ageGroup] || null,
        gender: genderLabels[surveyData.gender] || surveyData.gender || '',
        relationship: relationshipLabels[surveyData.relationship]
          || surveyData.relationship
          || '',
        hobbies: surveyData.hobby
          ? [hobbyLabels[surveyData.hobby] || surveyData.hobby]
          : [],
        notes: [
          'Hồ sơ được tạo từ khảo sát AI.',
          surveyData.personality
            ? `Tính cách: ${surveyData.personality}.`
            : '',
          surveyData.style ? `Phong cách quà: ${surveyData.style}.` : '',
        ].filter(Boolean).join(' '),
        anniversaries: [],
      });

      const profileId = profileResponse.data.profileId;
      if (result.historyId) {
        await api.put(
          `/history/${result.historyId}/recipient-profile/${profileId}`
        );
      }

      const updatedResult = {
        ...result,
        recipientProfileId: profileId,
      };
      localStorage.setItem(
        'giftmatch_recommendation_result',
        JSON.stringify(updatedResult)
      );
      localStorage.setItem(
        'temp_survey_data',
        JSON.stringify({
          ...surveyData,
          recipientProfileId: profileId,
        })
      );
      setSavedProfileId(profileId);
      setSaveMessage(`Đã lưu hồ sơ của ${recipientName} vào Sổ tay.`);
    } catch (requestError) {
      setSaveError(
        requestError.response?.data?.message
        || 'Không thể lưu hồ sơ vào Sổ tay. Vui lòng thử lại.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (!result) {
    return (
      <main className="flex-grow flex items-center justify-center px-gutter py-xl">
        <div className="max-w-xl text-center bg-surface-container-lowest rounded-2xl p-xl gift-shadow">
          <span className="material-symbols-outlined text-6xl text-primary mb-md">
            psychology
          </span>
          <h1 className="font-display-sm font-bold text-on-surface mb-sm">
            Chưa có kết quả gợi ý
          </h1>
          <p className="text-on-surface-variant mb-lg">
            Hãy hoàn thành khảo sát để Random Forest phân tích và tìm quà phù hợp.
          </p>
          <Link
            to="/survey"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-bold"
          >
            Bắt đầu khảo sát
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      <div className="mb-xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary text-label-sm font-bold mb-sm">
              <span className="material-symbols-outlined text-[16px]">forest</span>
              Random Forest Hybrid
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
              Gợi ý dành riêng cho {result.recipientName || 'người nhận'} ✨
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Xếp hạng theo kết quả AI và giới hạn ngân sách bạn đã chọn.
            </p>
          </div>
          <div className="flex flex-wrap gap-sm">
            {savedProfileId ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-bold"
              >
                <span className="material-symbols-outlined">menu_book</span>
                Đã lưu trong Sổ tay
              </Link>
            ) : (
              <button
                type="button"
                onClick={saveRecipientToNotebook}
                disabled={savingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-bold hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">person_add</span>
                {savingProfile ? 'Đang lưu...' : 'Lưu vào Sổ tay'}
              </button>
            )}
            <Link
              to="/survey"
              state={{
                recipientProfileId: savedProfileId,
                recipientName: result.recipientName,
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-primary font-bold hover:bg-primary/5"
            >
              <span className="material-symbols-outlined">tune</span>
              Làm lại khảo sát
            </Link>
          </div>
        </div>

        {saveMessage && (
          <div className="mt-md rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700">
            {saveMessage}
          </div>
        )}
        {saveError && (
          <div className="mt-md rounded-xl bg-error-container px-4 py-3 text-error">
            {saveError}
          </div>
        )}

        <RecommendationFeedback
          historyId={result.historyId}
          products={result.products || []}
        />

        <div className="mt-lg flex flex-wrap gap-sm">
          {(result.predictedGifts || []).slice(0, 5).map((gift) => (
            <div
              key={`${gift.rank}-${gift.gift_name}`}
              className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
            >
              <div className="text-label-sm text-on-surface-variant">
                Top {gift.rank} · {GIFT_TYPE_LABELS[gift.gift_type] || gift.gift_type}
              </div>
              <div className="font-bold text-on-surface">
                {GIFT_NAME_LABELS[gift.gift_name] || gift.gift_name}
              </div>
              <div className="text-label-sm text-primary">
                {(gift.score * 100).toFixed(1)}% điểm AI
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-xl">
        <aside className="w-full md:w-[280px] shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-md gift-shadow sticky top-[100px]">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-title-md text-title-md text-on-surface">Bộ lọc</h2>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setMaxPrice(5000000);
                }}
                className="text-secondary text-label-sm font-label-sm"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="mb-lg">
              <h3 className="font-label-md text-label-md text-on-surface mb-sm">Loại quà</h3>
              <div className="flex flex-wrap gap-xs">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-sm py-xs rounded-full font-label-sm ${
                    selectedType === 'all'
                      ? 'bg-primary-container text-white'
                      : 'bg-secondary-fixed text-on-secondary-fixed'
                  }`}
                >
                  Tất cả
                </button>
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-sm py-xs rounded-full font-label-sm ${
                      selectedType === type
                        ? 'bg-primary-container text-white'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    {GIFT_TYPE_LABELS[type] || type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-label-md text-label-md text-on-surface mb-sm">
                Giá tối đa: {formatPrice(maxPrice)}
              </h3>
              <input
                className="w-full accent-primary-container mb-xs"
                max="5000000"
                min="100000"
                step="100000"
                type="range"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </div>
          </div>
        </aside>

        <section className="flex-grow">
          <div className="flex flex-wrap items-center justify-between mb-lg gap-sm">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Hiển thị {products.length} sản phẩm phù hợp
            </span>
            <div className="flex items-center gap-xs w-52">
              <span className="font-label-md text-on-surface-variant whitespace-nowrap">
                Sắp xếp:
              </span>
              <CustomSelect
                name="sortOrder"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                options={[
                  { value: 'Độ phù hợp', label: 'Độ phù hợp' },
                  { value: 'Giá tăng dần', label: 'Giá tăng dần' },
                  { value: 'Mới nhất', label: 'Mới nhất' },
                ]}
                className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg"
              />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant p-xl text-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-sm">
                inventory_2
              </span>
              <h2 className="font-title-lg font-bold text-on-surface mb-xs">
                Chưa có sản phẩm phù hợp trong cửa hàng
              </h2>
              <p className="text-on-surface-variant">
                AI đã dự đoán được nhóm quà, nhưng chưa có sản phẩm đã duyệt khớp loại và ngân sách.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {products.map((product) => {
                const favoriteProduct = {
                  id: product.productId,
                  name: product.name,
                  brand: product.storeName || 'GiftMatch Store',
                  price: formatPrice(product.price),
                  image: product.imageUrl || FALLBACK_IMAGE,
                  matchPercentage: Math.round(product.matchScore * 100),
                };
                const favorite = isFavorite(product.productId);
                return (
                  <article
                    key={product.productId}
                    className="bg-surface-container-lowest rounded-xl p-sm gift-shadow gift-shadow-hover relative flex flex-col border border-surface-variant"
                  >
                    <div className="relative w-full aspect-square mb-sm rounded-lg overflow-hidden bg-surface-variant">
                      <img
                        className="w-full h-full object-cover"
                        alt={product.name}
                        src={product.imageUrl || FALLBACK_IMAGE}
                      />
                      <button
                        onClick={() => toggleFavorite(favoriteProduct)}
                        className={`absolute top-sm right-sm rounded-full p-xs shadow-sm ${
                          favorite ? 'bg-error-container text-error' : 'bg-white text-outline'
                        }`}
                        aria-label={favorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: favorite ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      </button>
                      <div className="absolute bottom-sm left-sm bg-secondary text-white px-sm py-1 rounded-full font-label-sm shadow-sm">
                        {Math.round(product.matchScore * 100)}% Hợp gu
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col">
                      <span className="text-label-sm text-on-surface-variant">
                        {product.storeName || 'GiftMatch Store'}
                      </span>
                      <h3 className="font-title-md font-bold text-on-surface mt-1">
                        {product.name}
                      </h3>
                      <p className="text-label-sm text-primary mt-1">
                        AI: {GIFT_NAME_LABELS[product.predictedGiftName] || product.predictedGiftName}
                      </p>
                      <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-2">
                        {product.description || 'Sản phẩm phù hợp với hồ sơ người nhận.'}
                      </p>
                      <div className="font-headline-lg text-[22px] font-semibold text-primary-container mt-auto pt-md">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
