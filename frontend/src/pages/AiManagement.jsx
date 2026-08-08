import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';
import { GIFT_NAME_LABELS, GIFT_TAXONOMY } from '../constants/giftTaxonomy';

const formatSize = (bytes) => {
  if (!bytes) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function AiManagement() {
  const [models, setModels] = useState([]);
  const [activeModel, setActiveModel] = useState('');
  const [unlabeledProducts, setUnlabeledProducts] = useState([]);
  const [labels, setLabels] = useState({});
  const [modelFile, setModelFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [modelResponse, productResponse] = await Promise.all([
        api.get('/admin/ai-models'),
        api.get('/admin/products/unlabeled'),
      ]);
      setModels(modelResponse.data.models || []);
      setActiveModel(modelResponse.data.active_model || '');
      setUnlabeledProducts(productResponse.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || 'Không thể tải dữ liệu quản lý AI.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const runAction = async (action, successMessage) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(successMessage);
      await loadData();
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail
        || requestError.response?.data?.message
        || 'Thao tác không thành công.'
      );
    } finally {
      setBusy(false);
    }
  };

  const uploadModel = () => {
    if (!modelFile) {
      setError('Hãy chọn file .joblib.');
      return;
    }
    const formData = new FormData();
    formData.append('file', modelFile);
    runAction(
      () => api.post('/admin/ai-models/upload?activate=true', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      'Đã tải lên, kiểm tra và kích hoạt model mới.'
    );
  };

  const labelProduct = (productId) => {
    const aiGiftName = labels[productId];
    if (!aiGiftName) {
      setError('Hãy chọn nhãn AI cho sản phẩm.');
      return;
    }
    runAction(
      () => api.put(`/admin/products/${productId}/label`, {
        aiGiftName,
        status: 'APPROVED',
      }),
      'Đã gắn nhãn và duyệt sản phẩm.'
    );
  };

  if (loading) {
    return (
      <AdminShell title="Quản lý mô hình AI">
        <div className="grid min-h-[55vh] place-items-center text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
            psychology
          </span>
          <p className="mt-2 text-on-surface-variant">Đang tải quản lý AI...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Quản lý mô hình AI">
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: theme('colors.surface-variant'); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: theme('colors.outline'); }
        .dashed-upload { border: 2px dashed theme('colors.outline-variant'); }
      `}</style>
      <div className="mx-auto w-full max-w-5xl">
          <div className="mb-lg">
            <span className="text-[12px] font-bold text-primary uppercase tracking-wider">ADMIN AI</span>
            <h2 className="mt-1 text-2xl font-bold text-on-surface sm:text-3xl">
              Gắn nhãn dữ liệu & Quản lý mô hình
            </h2>
            <p className="text-on-surface-variant mt-2 text-label-md">
              Model chỉ được kích hoạt sau khi AI service nạp và kiểm tra bundle thành công.
            </p>
          </div>

        {message && (
          <div className="mb-md rounded-xl bg-tertiary-container/15 px-4 py-3 text-tertiary-container">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-md rounded-xl bg-error-container px-4 py-3 text-error">
            {error}
          </div>
        )}

        <section className="bg-white rounded-3xl border border-outline-variant p-8 mb-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between gap-xl mb-lg">
            <div className="flex-1">
              <h2 className="font-title-lg font-bold text-on-surface mb-4">Phiên bản model</h2>
              <div className="rounded-xl border border-outline-variant p-4 bg-white">
                <p className="text-[12px] font-bold text-on-surface-variant mb-2 uppercase">Đang hoạt động:</p>
                <code className="bg-[#FFF5F0] text-primary px-3 py-2 rounded text-[13px] break-all inline-block border border-[#FFE4D6]">
                  {activeModel || 'Chưa có model'}
                </code>
              </div>
            </div>
            
            <div className="flex-1 max-w-[400px]">
              <p className="text-label-sm text-on-surface-variant mb-2">Tải lên bundle mới</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".joblib"
                  onChange={(event) => setModelFile(event.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="dashed-upload rounded-xl bg-white p-4 text-center text-label-md text-on-surface-variant transition-colors hover:bg-surface-container">
                   {modelFile ? modelFile.name : 'Chọn tệp hoặc kéo thả'}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  disabled={busy}
                  onClick={uploadModel}
                  className="flex-1 rounded-xl bg-[#A0522D] hover:bg-[#8B4513] transition-colors px-4 py-3 text-white font-bold text-label-md disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  Tải lên & kích hoạt
                </button>
                <button
                  disabled={busy}
                  onClick={() => runAction(
                    () => api.post('/admin/ai-models/reload'),
                    'Đã reload model đang hoạt động.'
                  )}
                  className="rounded-xl border border-[#A0522D] hover:bg-[#FFF5F0] transition-colors px-6 py-3 text-[#A0522D] font-bold text-label-md disabled:opacity-50"
                >
                  Reload
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-surface-variant text-label-sm text-on-surface-variant">
                <tr>
                  <th className="py-3">Tên file</th>
                  <th className="py-3">Dung lượng</th>
                  <th className="py-3">Trạng thái</th>
                  <th className="py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.filename} className="border-b border-surface-container">
                    <td className="py-3 font-medium">{model.filename}</td>
                    <td className="py-3">{formatSize(model.size_bytes)}</td>
                    <td className="py-3">
                      {model.active ? (
                        <span className="rounded-full bg-tertiary-container/15 px-3 py-1 text-tertiary-container font-bold">
                          Đang dùng
                        </span>
                      ) : 'Dự phòng'}
                    </td>
                    <td className="py-3 text-right">
                      {!model.active && (
                        <button
                          disabled={busy}
                          onClick={() => runAction(
                            () => api.post(`/admin/ai-models/activate/${encodeURIComponent(model.filename)}`),
                            `Đã kích hoạt ${model.filename}.`
                          )}
                          className="text-primary font-bold disabled:opacity-50"
                        >
                          Kích hoạt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {models.length === 0 && (
              <p className="py-8 text-center text-on-surface-variant">
                Chưa có model trong thư mục quản lý. Hãy tải file từ Colab lên.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-outline-variant p-8 shadow-sm">
          <div className="mb-lg">
            <h2 className="font-title-lg font-bold text-on-surface text-[20px]">Dữ liệu sản phẩm chưa gắn nhãn</h2>
            <p className="text-label-md text-on-surface-variant mt-1">
              Chọn nhãn gần nhất trong 35 `gift_name`; backend tự xác định `gift_type`.
            </p>
          </div>

          <div className="space-y-sm">
            {unlabeledProducts.map((product) => (
              <div
                key={product.productId}
                className="grid grid-cols-1 md:grid-cols-[1fr_320px_auto] items-center gap-sm rounded-xl border border-surface-container p-4"
              >
                <div>
                  <div className="font-bold text-on-surface">{product.name}</div>
                  <div className="text-label-sm text-on-surface-variant">
                    #{product.productId} · {Number(product.price || 0).toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <select
                  value={labels[product.productId] || ''}
                  onChange={(event) => setLabels({
                    ...labels,
                    [product.productId]: event.target.value,
                  })}
                  className="rounded-lg border border-outline-variant px-3 py-2"
                >
                  <option value="">Chọn nhãn AI</option>
                  {GIFT_TAXONOMY.map((item) => (
                    <option key={item.name} value={item.name}>
                      {GIFT_NAME_LABELS[item.name] || item.name} · {item.type}
                    </option>
                  ))}
                </select>
                <button
                  disabled={busy}
                  onClick={() => labelProduct(product.productId)}
                  className="rounded-lg bg-secondary px-4 py-2 text-white font-bold disabled:opacity-50"
                >
                  Gắn nhãn & duyệt
                </button>
              </div>
            ))}
            {unlabeledProducts.length === 0 && (
              <div className="py-16 text-center flex flex-col items-center border border-dashed border-outline-variant rounded-2xl bg-white">
                <div className="w-32 h-32 rounded-full bg-[#FFF5F0] flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[48px] text-[#A0522D]" style={{fontVariationSettings: "'wght' 200"}}>task_alt</span>
                </div>
                <h3 className="text-[16px] font-bold text-on-surface">Tất cả sản phẩm đã được gắn nhãn.</h3>
                <p className="text-label-md text-on-surface-variant mt-1">Dữ liệu hiện tại hoàn toàn sạch.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
