import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { GIFT_NAME_LABELS, GIFT_TAXONOMY } from '../constants/giftTaxonomy';

export default function StoreProductsPage() {
  const userName = localStorage.getItem('fullName') || 'Quản lý';
  const userAvatar = localStorage.getItem('avatar');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/store/me');
      // For UI compatibility, map fields
      const mapped = res.data.map(p => ({
        id: p.productId, // Adjusting ID field
        name: p.name,
        price: p.price ? p.price + 'đ' : '0đ',
        category: p.category ? p.category.name : 'Chưa phân loại',
        categoryId: p.category ? p.category.categoryId : null,
        description: p.description || '',
        giftType: p.giftType || '',
        aiGiftName: p.aiGiftName || '',
        status: p.status === 'PENDING' ? 'Chờ duyệt' : (p.status === 'APPROVED' ? 'Đã duyệt' : 'Bị từ chối'),
        statusBg: p.status === 'PENDING' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]' : (p.status === 'APPROVED' ? 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' : 'bg-error-container text-error border-error/20'),
        aiCount: 0,
        img: p.imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200&auto=format&fit=crop'
      }));
      setProducts(mapped);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa", error);
      }
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
      console.error("Upload error", error);
      alert("Lỗi upload ảnh.");
      return null;
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = formData.img;
    
    if (imageFile) {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }
    
    const payload = {
      name: formData.name,
      price: formData.price ? formData.price.replace(/[^0-9]/g, '') : 0,
      description: formData.description,
      imageUrl: imageUrl,
      giftType: formData.giftType,
      aiGiftName: formData.aiGiftName
      // Note: Category logic is simplified for demo
    };

    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm", error);
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (product) => {
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
    setEditId(null);
    setFormData({
      name: '', price: '', category: 'Mỹ phẩm', description: '',
      giftType: '', aiGiftName: '', img: ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex w-full">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-inverse-surface dark:bg-surface-container-lowest border-r border-outline-variant shadow-md flex flex-col p-md z-40 hidden md:flex transition-transform duration-300">
        <div className="flex items-center gap-xs mb-lg px-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>storefront</span>
          </div>
          <div>
            <h2 className="font-display-lg text-[20px] leading-tight text-primary-fixed dark:text-primary tracking-tight">GiftMatch Admin</h2>
            <p className="font-label-sm text-label-sm text-surface-variant/80 dark:text-outline mt-0.5">Shop Manager</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-dashboard">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold shadow-sm transition-transform active:scale-95 duration-150 relative overflow-hidden" to="/store-products">
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>inventory_2</span>
            <span className="font-label-md text-label-md">Sản phẩm</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-profile">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">settings</span>
            <span className="font-label-md text-label-md">Cài đặt cửa hàng</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-analytics">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">analytics</span>
            <span className="font-label-md text-label-md">Thống kê</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group mt-8 border-t border-surface-variant/20 pt-4" to="/">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">arrow_back</span>
            <span className="font-label-md text-label-md">Về trang chính</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-surface-variant/20">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-colors active:scale-95 duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            New Product
          </button>
          <div className="mt-4 flex items-center gap-3 px-2">
            {userAvatar && userAvatar !== 'null' && userAvatar.startsWith('http') ? (
               <img className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed shadow-sm" src={userAvatar} referrerPolicy="no-referrer" />
            ) : (
               <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary font-bold border-2 border-primary-fixed shadow-sm">
                  {userName.charAt(0)}
               </div>
            )}
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-container font-semibold truncate max-w-[120px]">{userName}</p>
              <p className="font-label-sm text-label-sm text-surface-variant/70">Quản lý</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen bg-surface-container-lowest">
        {/* TopNavBar */}
        <header className="sticky top-0 h-16 bg-surface/80 backdrop-blur-md shadow-sm flex justify-between items-center px-xl z-30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-variant/20 rounded-full transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-title-md text-title-md text-primary font-bold">Quản lý Cửa hàng</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 relative p-2">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </button>
            <Link to="/store-profile" className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 p-2">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-gutter md:p-xl animate-fade-in-up">
          {/* Header & Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight">Quản lý sản phẩm</h1>
            <button onClick={openAddModal} className="bg-primary-container text-on-primary px-6 py-3 rounded-[12px] font-label-md flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow active:scale-95">
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
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                          <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src={product.img} />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-title-md text-on-background font-semibold">{product.name}</td>
                      <td className="px-6 py-4 font-medium text-on-surface-variant">{product.price}</td>
                      <td className="px-6 py-4">
                        <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full font-label-sm border font-medium ${product.statusBg}`}>{product.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm inline-block">{product.aiCount}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(product)} className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-on-surface-variant hover:text-error bg-surface hover:bg-error-container transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Thêm/Sửa Sản Phẩm */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-slide-in">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md font-medium text-on-surface mb-1">Giá (VNĐ) *</label>
                  <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-shadow" placeholder="Ví dụ: 500000" />
                </div>
                <div>
                  <label className="block text-label-md font-medium text-on-surface mb-1">Nhãn quà AI *</label>
                  <select
                    required
                    value={formData.aiGiftName}
                    onChange={e => {
                      const selected = GIFT_TAXONOMY.find(item => item.name === e.target.value);
                      setFormData({
                        ...formData,
                        aiGiftName: selected?.name || '',
                        giftType: selected?.type || ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary-fixed bg-surface text-on-surface"
                  >
                    <option value="">Chọn nhãn gần nhất</option>
                    {GIFT_TAXONOMY.map(item => (
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
                <label className="block text-label-md font-medium text-on-surface mb-1">Hình ảnh (Cloudinary)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full px-4 py-2 border border-outline-variant rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20 transition-colors" />
                {(imageFile || formData.img) && (
                  <div className="mt-2 w-24 h-24 rounded-lg border border-outline-variant overflow-hidden">
                    <img src={imageFile ? URL.createObjectURL(imageFile) : formData.img} alt="Preview" className="w-full h-full object-cover" />
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

    </div>
  );
}
