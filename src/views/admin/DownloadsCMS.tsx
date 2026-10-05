import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Edit3, Check, X, Loader2, FileText } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, DownloadRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { deleteFileFromSupabase } from '../../services/storageService';

export const DownloadsCMS: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<DownloadRecord> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DownloadRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDownloads = async () => {
    setLoading(true);
    const res = await getRecords<DownloadRecord>('downloads', { orderBy: { column: 'created_at', ascending: false } });
    setDownloads(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.file_url) return alert('Judul dan Berkas File wajib diisi!');

    setIsSaving(true);
    try {
      if (editingItem.id) {
        const res = await updateRecord<DownloadRecord>('downloads', editingItem.id, editingItem);
        setDownloads((prev) => prev.map((d) => (d.id === editingItem.id ? res.data! : d)));
      } else {
        const res = await insertRecord<DownloadRecord>('downloads', editingItem);
        setDownloads((prev) => [res.data!, ...prev]);
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
      await deleteRecord('downloads', deleteTarget.id);
      if (deleteTarget.file_url) await deleteFileFromSupabase(deleteTarget.file_url);
      setDownloads((prev) => prev.filter((d) => d.id !== deleteTarget.id));
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
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Download className="w-4 h-4" /> Dokumen & File Unduhan
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Pusat Unduhan (Downloads)
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              title: '',
              description: '',
              file_url: '',
              file_type: 'PDF',
              category: 'Dokumen',
              is_active: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        </div>
      ) : downloads.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border text-center text-slate-400">
          <p className="text-sm font-bold">Belum ada file dokumen unduhan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloads.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-slate-400 truncate">{item.description}</p>
                  <a href={item.file_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline font-bold">
                    Buka / Unduh Berkas ({item.file_type || 'PDF'})
                  </a>
                </div>
              </div>

              <div className="flex gap-1">
                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(item)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-black text-lg">{editingItem.id ? 'Edit Dokumen' : 'Tambah Dokumen'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="Nama Dokumen..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <FileUpload
                label="Unggah File (PDF, DOCX, ZIP ke Supabase Storage)"
                folder="documents"
                previewType="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                value={editingItem.file_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, file_url: url })}
              />
              <input
                type="text"
                value={editingItem.category || 'Dokumen'}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                placeholder="Kategori (Kurikulum, Form, dll)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <textarea
                rows={2}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Keterangan file..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">Simpan Dokumen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Dokumen Ini?"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
