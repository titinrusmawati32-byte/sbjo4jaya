import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit3, Trash2, Eye, Check, X, Loader2 } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, AnnouncementRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { PreviewModal } from '../../components/admin/PreviewModal';

export const AnnouncementsCMS: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AnnouncementRecord> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AnnouncementRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewData, setPreviewData] = useState<AnnouncementRecord | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const res = await getRecords<AnnouncementRecord>('announcements', { orderBy: { column: 'created_at', ascending: false } });
    setAnnouncements(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title) return alert('Judul pengumuman wajib diisi!');

    setIsSaving(true);
    try {
      if (editingItem.id) {
        const res = await updateRecord<AnnouncementRecord>('announcements', editingItem.id, editingItem);
        setAnnouncements((prev) => prev.map((a) => (a.id === editingItem.id ? res.data! : a)));
      } else {
        const res = await insertRecord<AnnouncementRecord>('announcements', editingItem);
        setAnnouncements((prev) => [res.data!, ...prev]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteRecord('announcements', deleteTarget.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" /> Popup Informasi & Pengumuman Sekolah
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Pengumuman (Popup Modal)
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              title: '',
              description: '',
              image_url: '',
              button_text: 'Daftar Sekarang',
              button_url: '/#ppdb',
              is_active: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengumuman Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border text-center text-slate-400">
          <p className="text-sm font-bold">Belum ada pengumuman aktif.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  {item.is_active ? '● Aktif Tampil' : 'Non-aktif'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setPreviewData(item)} className="p-2 text-slate-400 hover:text-emerald-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-36 object-cover rounded-2xl" />}
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-black text-lg">{editingItem.id ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="Judul Pengumuman..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <FileUpload
                label="Gambar Banner Modal (Supabase Storage)"
                folder="ppdb"
                value={editingItem.image_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, image_url: url })}
              />
              <textarea
                rows={3}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Deskripsi singkat..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={editingItem.button_text || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, button_text: e.target.value })}
                  placeholder="Teks Tombol..."
                  className="bg-slate-50 border rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={editingItem.button_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, button_url: e.target.value })}
                  placeholder="URL Tujuan..."
                  className="bg-slate-50 border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingItem.is_active || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                />
                <label htmlFor="activeCheck" className="text-xs font-bold">Tampilkan Popup Modal saat pengunjung datang</label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Pengumuman Ini?"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      <PreviewModal
        isOpen={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        type="announcement"
        data={previewData}
      />
    </div>
  );
};
