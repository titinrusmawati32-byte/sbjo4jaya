import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit3, Trash2, Check, X, Loader2 } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord } from '../../services/supabaseDataService';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';

export const AcademicCMS: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    const res = await getRecords('academic_programs', { orderBy: { column: 'sort_order', ascending: true } });
    if (res.data.length === 0) {
      const defaults = [
        { title: 'Kurikulum Merdeka Belajar', code: 'KM', description: 'Pengembangan karakter dan soft skills melalui Projek Penguatan Profil Pelajar Pancasila (P5).', sort_order: 1, is_active: true },
        { title: 'Program Literasi & Numerasi', code: 'PLN', description: 'Pembiasaan membaca 15 menit sebelum pelajaran dan pojok baca interaktif.', sort_order: 2, is_active: true },
        { title: 'Ekstrakurikuler Pramuka & Seni', code: 'EKS', description: 'Pembentukan kedisiplinan, kemandirian, kepramukaan, tari, dan seni musik.', sort_order: 3, is_active: true },
      ];
      for (const item of defaults) {
        await insertRecord('academic_programs', item);
      }
      const reFetch = await getRecords('academic_programs', { orderBy: { column: 'sort_order', ascending: true } });
      setPrograms(reFetch.data);
    } else {
      setPrograms(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title) return alert('Nama Program wajib diisi!');

    setIsSaving(true);
    try {
      if (editingItem.id) {
        const res = await updateRecord('academic_programs', editingItem.id, editingItem);
        setPrograms((prev) => prev.map((p) => (p.id === editingItem.id ? res.data : p)));
      } else {
        const res = await insertRecord('academic_programs', editingItem);
        setPrograms((prev) => [...prev, res.data]);
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
      await deleteRecord('academic_programs', deleteTarget.id);
      setPrograms((prev) => prev.filter((p) => p.id !== deleteTarget.id));
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
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A887] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" /> Manajemen Akademik & Program Unggulan
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Program Akademik
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              title: '',
              code: 'PROG',
              description: '',
              sort_order: programs.length + 1,
              is_active: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Akademik</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-[#00A887] animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-[#00A887]/10 text-[#00A887] px-3 py-1 rounded-full">
                  {item.code || 'AKADEMIK'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif font-black text-slate-900 dark:text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-400 flex-1">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-black text-lg">{editingItem.id ? 'Edit Program' : 'Tambah Program'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="Nama Program..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <input
                type="text"
                value={editingItem.code || ''}
                onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                placeholder="Kode Singkat (e.g. P5)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs font-mono"
              />
              <textarea
                rows={4}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Deskripsi Program..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-[#00A887] text-white text-xs font-bold rounded-xl">Simpan Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Program Ini?"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
