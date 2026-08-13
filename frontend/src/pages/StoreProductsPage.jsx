import { useState, useEffect, useMemo } from 'react';
import StoreShell from '../components/StoreShell';
import api from '../utils/api';
import { GIFT_NAME_LABELS } from '../constants/giftTaxonomy';

const BUSINESS_STATUS_LABELS = {
  IN_STOCK: 'Còn hàng',
  OUT_OF_STOCK: 'Hết hàng',
  HIDDEN: 'Tạm ẩn',
  DISCONTINUED: 'Ngừng kinh doanh',
};

export default function StoreProductsPage() {
  const [products, setProducts] = useState([]);
  const [taxonomy, setTaxonomy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeProfile, setStoreProfile] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Mỹ phẩm',
    description: '',
    giftType: '',
    aiGiftName: '',
    img: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const previewUrl = useMemo(
    () => imageFile ? URL.createObjectURL(imageFile) : formData.img,
    [imageFile, formData.img]
  );

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/store/me');
      let recommendationAppearances = new Map();
      try {
        const analyticsResponse = await api.get('/store/analytics');
        recommendationAppearances = new Map(
          (analyticsResponse.data?.topRecommendedProducts || []).map(item => [
            Number(item.productId),
            Number(item.appearances || 0),
          ])
        );
      } catch (analyticsError) {
        console.warn('Khong the tai thong ke goi y cua cua hang', analyticsError);
      }
      // For UI compatibility, map fields
      const mapped = res.data.map(p => ({
        id: p.productId, // Adjusting ID field
        name: p.name,
        price: p.price ?? 0,
        category: p.category ? p.category.name : 'Chưa phân loại',
        categoryId: p.category ? p.category.categoryId : null,
        description: p.description || '',
        giftType: p.giftType || '',
        aiGiftName: p.aiGiftName || '',
        businessStatus: p.businessStatus || 'IN_STOCK',
        status: p.status === 'PENDING' ? 'Chờ duyệt' : (p.status === 'APPROVED' ? 'Đã duyệt' : 'Bị từ chối'),
        statusBg: p.status === 'PENDING' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]' : (p.status === 'APPROVED' ? 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' : 'bg-error-container text-error border-error/20'),
        rejectionReason: p.rejectionReason || '',
        aiCount: recommendationAppearances.get(Number(p.productId)) || 0,
        img: p.imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'
      }));
      setProducts(mapped);
      setActionError('');
    } catch (error) {
      setActionError(error.response?.data?.message || 'Không thể tải danh sách sản phẩm của cửa hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    Promise.all([api.get('/store/profile/me'), api.get('/store/taxonomy')])
      .then(([profileResponse, taxonomyResponse]) => {
        setStoreProfile(profileResponse.data);
        setTaxonomy(Object.entries(taxonomyResponse.data || {}).map(([name, type]) => ({ name, type })));
      })
      .catch(error => setActionError(error.response?.data?.message || 'Không thể tải hồ sơ hoặc taxonomy của cửa hàng.'));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setActionError('');
        setActionMessage('');
        await api.delete(`/products/${id}`);
        setProducts(current => current.filter(p => p.id !== id));
        setActionMessage('Đã xóa sản phẩm.');
      } catch (error) {
        setActionError(error.response?.data?.message || 'Không thể xóa sản phẩm.');
      }
    }
  };

  const handleBusinessStatus = async (id, businessStatus) => {
    try {
      setActionError('');
      setActionMessage('');
      const response = await api.patch(`/products/${id}/business-status`, { businessStatus });
      setProducts(current => current.map(product => (
        product.id === id ? { ...product, businessStatus: response.data.businessStatus } : product
      )));
      setActionMessage('Đã cập nhật trạng thái kinh doanh.');
    } catch (error) {
      setActionError(error.response?.data?.message || 'Không thể cập nhật trạng thái kinh doanh.');
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data.url;
    } catch (error) {
      setActionError(error.response?.data?.message || 'Không thể tải ảnh sản phẩm.');
      return null;
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    const normalizedPrice = Number(String(formData.price).replace(/[^0-9]/g, ''));
    if (!formData.name.trim() || !formData.aiGiftName || !Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
      setActionError('Vui lòng nhập tên, giá hợp lệ và nhãn quà AI.');
      return;
    }
    setUploading(true);
    let imageUrl = formData.img;
    
    if (imageFile) {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      if (!uploadedUrl) {
        setUploading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }
    
    const payload = {
      name: formData.name.trim(),
      price: normalizedPrice,
      description: formData.description.trim(),
      imageUrl: imageUrl,
      giftType: formData.giftType,
      aiGiftName: formData.aiGiftName
    };

    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      await fetchProducts();
      setShowModal(false);
      setActionMessage(editId ? 'Đã cập nhật sản phẩm và chuyển về trạng thái chờ duyệt.' : 'Đã thêm sản phẩm mới.');
    } catch (error) {
      setActionError(error.response?.data?.message || 'Không thể lưu sản phẩm.');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (product) => {
    setActionError('');
    setActionMessage('');
    if (storeProfile?.status !== 'APPROVED') {
      setActionError('Cửa hàng cần được Admin phê duyệt trước khi thay đổi sản phẩm.');
      return;
    }
    setEditId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      giftType: product.giftType,
      aiGiftName: product.aiGiftName,
      img: product.img
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openAddModal = () => {
    setActionError('');
    setActionMessage('');
    if (storeProfile?.status !== 'APPROVED') {
      setActionError('Cửa hàng cần được Admin phê duyệt trước khi thêm sản phẩm.');
      return;
    }
    setEditId(null);
    setFormData({
      name: '', price: '', category: 'Mỹ phẩm', description: '',
      giftType: '', aiGiftName: '', img: ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageSelection = event => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setImageFile(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setActionError('Tệp được chọn phải là hình ảnh.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setActionError('Ảnh không được vượt quá 5 MB.');
      event.target.value = '';
      return;
    }
    setActionError('');
    setImageFile(file);
  };

  const formatPrice = price => `${Number(price || 0).toLocaleString('vi-VN')} đ`;

  return (
    <StoreShell title="Quản lý sản phẩm cửa hàng">
      <div className="animate-fade-in-up">
          {storeProfile && storeProfile.status !== 'APPROVED' && (
            <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
              <strong>Hồ sơ cửa hàng: {storeProfile.status}</strong>
              <p className="mt-1 text-sm">Chức năng thêm, sửa, xóa và đổi trạng thái sản phẩm được mở sau khi Admin phê duyệt.</p>
              {storeProfile.reviewNote && <p className="mt-2 text-sm"><strong>Phản hồi:</strong> {storeProfile.reviewNote}</p>}
            </div>
          )}
          {actionError && <div className="mb-5 rounded-xl bg-error-container px-4 py-3 text-error">{actionError}</div>}
          {actionMessage && <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-green-800">{actionMessage}</div>}
          {!loading && taxonomy.length === 0 && <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">Chưa có nhãn quà đang hoạt động. Admin cần cấu hình Taxonomy trước khi Store thêm sản phẩm.</div>}
          {loading && <div className="mb-5 rounded-xl bg-surface-container px-4 py-3 text-on-surface-variant">Đang tải sản phẩm của cửa hàng...</div>}
          {/* Header & Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight">Quản lý sản phẩm</h1>
            <button disabled={storeProfile?.status !== 'APPROVED' || taxonomy.length === 0} onClick={openAddModal} className="bg-primary-container text-on-primary px-6 py-3 rounded-[12px] font-label-md flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
              <span className="material-symbols-outlined">add</span>
              Thêm sản phẩm
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-[32px] font-bold text-tertiary-container bg-tertiary-container/10 px-6 py-2 rounded-lg mb-2">{products.filter(p => p.status === 'Đã duyệt').length}</div>
              <div className="text-tertiary-container font-label-md uppercase tracking-wider font-semibold">Đã duyệt</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-[32px] font-bold text-[#D97706] bg-[#FEF3C7] px-6 py-2 rounded-lg mb-2">{products.filter(p => p.status === 'Chờ duyệt').length}</div>
              <div className="text-[#D97706] font-label-md uppercase tracking-wider font-semibold">Chờ duyệt</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-[32px] font-bold text-error bg-error-container px-6 py-2 rounded-lg mb-2">{products.filter(p => p.status === 'Bị từ chối').length}</div>
              <div className="text-error font-label-md uppercase tracking-wider font-semibold">Bị từ chối</div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Hình ảnh</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Tên sản phẩm</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Giá</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Loại quà</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Kinh doanh</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">psychology</span>
                        Số lần gợi ý AI
                      </div>
                    </th>
                    <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {!loading && products.map(product => (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                          <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src={product.img} alt={product.name} />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-title-md text-on-background font-semibold">{product.name}</td>
                      <td className="px-6 py-4 font-medium text-on-surface-variant whitespace-nowrap">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">{product.giftType || product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full font-label-sm border font-medium ${product.statusBg}`}>{product.status}</span>
                        {product.rejectionReason && <p className="mt-2 max-w-[220px] text-xs text-error">{product.rejectionReason}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={product.businessStatus}
                          disabled={storeProfile?.status !== 'APPROVED'}
                          onChange={event => handleBusinessStatus(product.id, event.target.value)}
                          className="min-w-[150px] rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
                          aria-label={`Trạng thái kinh doanh của ${product.name}`}
                        >
                          {Object.entries(BUSINESS_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm inline-block">{product.aiCount}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button disabled={storeProfile?.status !== 'APPROVED'} onClick={() => openEditModal(product)} className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant disabled:opacity-40">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button disabled={storeProfile?.status !== 'APPROVED'} onClick={() => handleDelete(product.id)} className="text-on-surface-variant hover:text-error bg-surface hover:bg-error-container transition-colors p-2 rounded-lg shadow-sm border border-outline-variant disabled:opacity-40">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && products.length === 0 && <p className="p-10 text-center text-on-surface-variant">Cửa hàng chưa có sản phẩm.</p>}
          </div>
      </div>

      {/* Modal Thêm/Sửa Sản Phẩm */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-container-lowest shadow-lg animate-slide-in">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-title-lg text-title-lg text-on-surface">{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">Tên sản phẩm *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-shadow" placeholder="Nhập tên sản phẩm..." />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-label-md font-medium text-on-surface mb-1">Giá (VNĐ) *</label>
                  <input required min="1" inputMode="numeric" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-shadow" placeholder="Ví dụ: 500000" />
                </div>
                <div>
                  <label className="block text-label-md font-medium text-on-surface mb-1">Nhãn quà AI *</label>
                  <select
                    required
                    value={formData.aiGiftName}
                    onChange={e => {
                       const selected = taxonomy.find(item => item.name === e.target.value);
                      setFormData({
                        ...formData,
                        aiGiftName: selected?.name || '',
                        giftType: selected?.type || ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary-fixed bg-surface text-on-surface"
                  >
                    <option value="">Chọn nhãn gần nhất</option>
                     {taxonomy.map(item => (
                      <option key={item.name} value={item.name}>
                        {GIFT_NAME_LABELS[item.name] || item.name}
                      </option>
                    ))}
                  </select>
                  {formData.giftType && (
                    <p className="mt-1 text-label-sm text-on-surface-variant">
                      Nhóm model: {formData.giftType}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">Mô tả sản phẩm</label>
                <textarea rows={4} maxLength={5000} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full resize-y rounded-lg border border-outline-variant px-4 py-2 focus:border-primary-fixed focus:outline-none focus:ring-1 focus:ring-primary-fixed" placeholder="Mô tả đặc điểm và mục đích sử dụng của sản phẩm" />
              </div>

              <div>
                <label className="block text-label-md font-medium text-on-surface mb-1">Hình ảnh (Cloudinary)</label>
                <input type="file" accept="image/*" onChange={handleImageSelection} className="w-full px-4 py-2 border border-outline-variant rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20 transition-colors" />
                <p className="mt-1 text-xs text-on-surface-variant">Định dạng ảnh, dung lượng tối đa 5 MB.</p>
                {previewUrl && (
                  <div className="mt-2 w-24 h-24 rounded-lg border border-outline-variant overflow-hidden">
                    <img src={previewUrl} alt="Xem trước sản phẩm" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface-variant font-label-md hover:bg-surface-variant/20 transition-colors">Hủy</button>
                <button type="submit" disabled={uploading} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-md hover:bg-primary-dim transition-colors flex items-center gap-2">
                  {uploading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">save</span>}
                  {uploading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </StoreShell>
  );
}
