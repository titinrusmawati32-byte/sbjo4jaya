import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Search, Edit3, Trash2, Check, X, Loader2, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, AchievementRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { deleteFileFromSupabase } from '../../services/storageService';

export const AchievementsCMS: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AchievementRecord> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AchievementRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAchievements = async () => {
    setLoading(true);
    const res = await getRecords<AchievementRecord>('achievements', {
      search: search ? { column: 'title', query: search } : undefined,
      orderBy: { column: 'created_at', ascending: false },
      page,
      pageSize,
    });
    setAchievements(res.data);
    setTotalCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, [page, search]);

  const handleOpenCreate = () => {
    setEditingItem({
      title: '',
      description: '',
      category: 'Akademik',
      level: 'Kabupaten',
      image_url: '',
      achievement_date: new Date().toISOString().split('T')[0],
      sort_order: achievements.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AchievementRecord) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title) return alert('Judul Prestasi wajib diisi!');

    setIsSaving(true);
    try {
      if (editingItem.id) {
        const res = await updateRecord<AchievementRecord>('achievements', editingItem.id, editingItem);
        if (res.error) throw new Error(res.error);
        setAchievements((prev) => prev.map((a) => (a.id === editingItem.id ? res.data! : a)));
      } else {
        const res = await insertRecord<AchievementRecord>('achievements', editingItem);
        if (res.error) throw new Error(res.error);
        setAchievements((prev) => [res.data!, ...prev]);
        setTotalCount((c) => c + 1);
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
      const res = await deleteRecord('achievements', deleteTarget.id);
      if (!res.success) throw new Error(res.error || 'Gagal menghapus');

      if (deleteTarget.image_url) {
        await deleteFileFromSupabase(deleteTarget.image_url);
      }

      setAchievements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setTotalCount((c) => Math.max(0, c - 1));
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
            <Trophy className="w-4 h-4" /> Manajemen Prestasi Siswa & Sekolah
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Prestasi Sekolah
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi Baru</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari prestasi..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs font-medium mt-2">Memuat data prestasi...</p>
        </div>
      ) : achievements.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border text-center text-slate-400">
          <p className="text-sm font-bold">Belum ada data prestasi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="h-44 bg-slate-100 dark:bg-slate-800 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-500">
                    <Trophy className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded-full text-[10px] uppercase">
                  {item.level || 'Kabupaten'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col space-y-2">
                <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full w-fit">
                  {item.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 flex-1">{item.description}</p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">
                    {item.achievement_date || '2026'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-400 hover:text-amber-500 rounded-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-black text-lg">
                {editingItem.id ? 'Edit Prestasi' : 'Tambah Prestasi'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Judul Prestasi *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Juara 1 Lomba Sains..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Kategori</label>
                  <select
                    value={editingItem.category || 'Akademik'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Tingkat</label>
                  <select
                    value={editingItem.level || 'Kabupaten'}
                    onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten">Kabupaten</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                  </select>
                </div>
              </div>

              <FileUpload
                label="Foto Piagam / Dokumentasi (Supabase Storage)"
                folder="achievements"
                value={editingItem.image_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, image_url: url })}
              />

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Deskripsi Ringkasan</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Prestasi Ini?"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
