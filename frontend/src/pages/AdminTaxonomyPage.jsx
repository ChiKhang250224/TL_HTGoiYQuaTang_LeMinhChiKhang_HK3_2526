import { useCallback, useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';

const EMPTY_DATA = { types: [], labels: [] };

export default function AdminTaxonomyPage() {
  const [data, setData] = useState(EMPTY_DATA);
  const [typeForm, setTypeForm] = useState({ code: '', displayName: '' });
  const [labelForm, setLabelForm] = useState({ giftTypeId: '', code: '', displayName: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/taxonomy');
      setData({
        types: Array.isArray(response.data?.types) ? response.data.types : [],
        labels: Array.isArray(response.data?.labels) ? response.data.labels : [],
      });
      setMessage(current => current.type === 'success' ? current : { type: '', text: '' });
    } catch (error) {
      setData(EMPTY_DATA);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Không thể tải taxonomy.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createType = async event => {
    event.preventDefault();
    try {
      await api.post('/admin/taxonomy/types', typeForm);
      setTypeForm({ code: '', displayName: '' });
      setMessage({ type: 'success', text: 'Đã tạo loại quà.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tạo loại quà.' });
    }
  };

  const createLabel = async event => {
    event.preventDefault();
    try {
      await api.post('/admin/taxonomy/labels', {
        ...labelForm,
        giftTypeId: Number(labelForm.giftTypeId),
      });
      setLabelForm({ giftTypeId: '', code: '', displayName: '' });
      setMessage({ type: 'success', text: 'Đã tạo nhãn quà.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tạo nhãn quà.' });
    }
  };

  const toggle = async (kind, item) => {
    try {
      const id = kind === 'types' ? item.giftTypeId : item.giftLabelId;
      await api.put(`/admin/taxonomy/${kind}/${id}/active`, { active: !item.active });
      setMessage({ type: 'success', text: 'Đã cập nhật trạng thái taxonomy.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể cập nhật taxonomy.' });
    }
  };

  const editType = async item => {
    const displayName = window.prompt('Tên loại quà', item.displayName);
    if (!displayName) return;
    const code = window.prompt('Mã loại quà', item.code);
    if (!code) return;
    try {
      await api.put(`/admin/taxonomy/types/${item.giftTypeId}`, { code, displayName });
      setMessage({ type: 'success', text: 'Đã cập nhật loại quà.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể sửa loại quà.' });
    }
  };

  const editLabel = async item => {
    const displayName = window.prompt('Tên nhãn quà', item.displayName);
    if (!displayName) return;
    const code = window.prompt('Mã nhãn quà', item.code);
    if (!code) return;
    try {
      await api.put(`/admin/taxonomy/labels/${item.giftLabelId}`, {
        giftTypeId: item.giftTypeId,
        code,
        displayName,
      });
      setMessage({ type: 'success', text: 'Đã cập nhật nhãn quà.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể sửa nhãn quà.' });
    }
  };

  const inputClass = 'min-w-0 rounded-xl border border-outline-variant bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <AdminShell title="Taxonomy quà tặng">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">Loại quà và nhãn AI</h2>
          <p className="mt-1 text-on-surface-variant">
            Nhãn được ngừng sử dụng thay vì xóa nhằm bảo toàn lịch sử và liên kết sản phẩm.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-primary/10 px-3 py-2 text-primary">{data.types.length} loại quà</span>
          <span className="rounded-full bg-secondary/10 px-3 py-2 text-secondary">{data.labels.length} nhãn</span>
        </div>
      </div>

      {message.text && (
        <div className={`mb-4 rounded-xl border px-4 py-3 ${message.type === 'error' ? 'border-error/20 bg-error-container text-error' : 'border-green-200 bg-green-50 text-green-800'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="grid min-h-[40vh] place-items-center rounded-2xl border border-outline-variant bg-white text-center">
          <div>
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="mt-2 text-on-surface-variant">Đang tải taxonomy...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="min-w-0 rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">Loại quà</h3>
            <form onSubmit={createType} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
              <input required placeholder="Mã, ví dụ BOOK" value={typeForm.code} onChange={event => setTypeForm({ ...typeForm, code: event.target.value })} className={inputClass} />
              <input required placeholder="Tên hiển thị" value={typeForm.displayName} onChange={event => setTypeForm({ ...typeForm, displayName: event.target.value })} className={inputClass} />
              <button className="rounded-xl bg-primary px-4 py-3 font-bold text-white">Thêm</button>
            </form>
            <div className="mt-5 space-y-2">
              {data.types.map(type => (
                <div key={type.giftTypeId} className="flex min-w-0 flex-col justify-between gap-3 rounded-xl bg-surface-container-low p-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <strong className="break-words">{type.displayName}</strong>
                    <p className="break-all text-xs text-on-surface-variant">{type.code} · {type.labelCount} nhãn</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    <button type="button" onClick={() => editType(type)} className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold">Sửa</button>
                    <button type="button" onClick={() => toggle('types', type)} className={`rounded-full px-3 py-1 text-xs font-bold ${type.active ? 'bg-green-100 text-green-800' : 'bg-error-container text-error'}`}>
                      {type.active ? 'Đang dùng' : 'Đã tắt'}
                    </button>
                  </div>
                </div>
              ))}
              {data.types.length === 0 && (
                <p className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">Chưa có loại quà.</p>
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold">Nhãn quà AI</h3>
            <form onSubmit={createLabel} className="mt-4 grid gap-3">
              <select required value={labelForm.giftTypeId} onChange={event => setLabelForm({ ...labelForm, giftTypeId: event.target.value })} className={inputClass}>
                <option value="">Chọn loại quà</option>
                {data.types.filter(type => type.active).map(type => (
                  <option key={type.giftTypeId} value={type.giftTypeId}>{type.displayName}</option>
                ))}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Mã nhãn" value={labelForm.code} onChange={event => setLabelForm({ ...labelForm, code: event.target.value })} className={inputClass} />
                <input required placeholder="Tên nhãn" value={labelForm.displayName} onChange={event => setLabelForm({ ...labelForm, displayName: event.target.value })} className={inputClass} />
              </div>
              <button disabled={data.types.every(type => !type.active)} className="rounded-xl bg-primary px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Thêm nhãn</button>
            </form>
            <div className="mt-5 max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {data.labels.map(label => (
                <div key={label.giftLabelId} className="flex min-w-0 flex-col justify-between gap-3 rounded-xl bg-surface-container-low p-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <strong className="break-words">{label.displayName}</strong>
                    <p className="break-all text-xs text-on-surface-variant">{label.giftTypeName} · {label.code}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    <button type="button" onClick={() => editLabel(label)} className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold">Sửa</button>
                    <button type="button" onClick={() => toggle('labels', label)} className={`rounded-full px-3 py-1 text-xs font-bold ${label.active ? 'bg-green-100 text-green-800' : 'bg-error-container text-error'}`}>
                      {label.active ? 'Đang dùng' : 'Đã tắt'}
                    </button>
                  </div>
                </div>
              ))}
              {data.labels.length === 0 && (
                <p className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">Chưa có nhãn quà AI.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
