import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit3, Trash2, Check, X, Loader2, UserCheck, Shield, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, TeacherRecord, StaffRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { deleteFileFromSupabase } from '../../services/storageService';

export const StaffCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'staff'>('teachers');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const table = activeTab === 'teachers' ? 'teachers' : 'staff';
    const res = await getRecords(table, {
      search: search ? { column: 'name', query: search } : undefined,
      orderBy: { column: 'sort_order', ascending: true },
      page,
      pageSize,
    });

    setItems(res.data);
    setTotalCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, page, search]);

  const handleOpenCreate = () => {
    setEditingItem({
      name: '',
      nip: '-',
      photo_url: '',
      position: activeTab === 'teachers' ? 'Guru Kelas' : 'Staf TU',
      subject: activeTab === 'teachers' ? 'Guru Kelas I' : undefined,
      bio: 'S1 Pendidikan',
      sort_order: items.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.position) {
      alert('Nama dan Jabatan wajib diisi!');
      return;
    }

    setIsSaving(true);
    const table = activeTab === 'teachers' ? 'teachers' : 'staff';

    try {
      if (editingItem.id) {
        const res = await updateRecord(table, editingItem.id, editingItem);
        if (res.error) throw new Error(res.error);
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? res.data : i)));
      } else {
        const res = await insertRecord(table, editingItem);
        if (res.error) throw new Error(res.error);
        setItems((prev) => [...prev, res.data]);
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
    const table = activeTab === 'teachers' ? 'teachers' : 'staff';

    try {
      const res = await deleteRecord(table, deleteTarget.id);
      if (!res.success) throw new Error(res.error || 'Gagal menghapus');

      if (deleteTarget.photo_url) {
        await deleteFileFromSupabase(deleteTarget.photo_url);
      }

      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A887] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Manajemen Tenaga Pendidik & Kependidikan
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Guru & Staf Sekolah
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah {activeTab === 'teachers' ? 'Guru' : 'Staf'} Baru</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
        <button
          onClick={() => {
            setActiveTab('teachers');
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'teachers'
              ? 'bg-[#00A887] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Guru & Tenaga Pendidik
        </button>
        <button
          onClick={() => {
            setActiveTab('staff');
            setPage(1);
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'staff'
              ? 'bg-[#00A887] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" /> Staf & Tenaga Kependidikan
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Cari nama ${activeTab === 'teachers' ? 'guru' : 'staf'}...`}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#00A887] animate-spin" />
          <p className="text-xs font-medium">Memuat data...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-center text-slate-400 space-y-2">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Belum ada data</p>
          <p className="text-xs">Klik "Tambah Baru" untuk menginput data personel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((person) => (
            <div
              key={person.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center relative group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#00A887]/30 shadow-md">
                <img
                  src={person.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mb-1">
                {person.name}
              </h3>
              <p className="text-xs font-semibold text-[#00A887] mb-1">{person.position}</p>
              {person.subject && (
                <p className="text-[11px] text-slate-400 mb-2">{person.subject}</p>
              )}
              <p className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full mb-4">
                NIP: {person.nip || '-'}
              </p>

              <div className="flex items-center gap-2 mt-auto w-full pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleOpenEdit(person)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#00A887] hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(person)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {items.length} dari {totalCount} data</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 border rounded-xl disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">Halaman {page}</span>
            <button
              disabled={page * pageSize >= totalCount}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border rounded-xl disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Edit/Add */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-serif font-black text-slate-900 dark:text-white">
                {editingItem.id ? 'Edit Data' : 'Tambah Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Drs. Budi Santoso, M.Pd"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={editingItem.nip || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nip: e.target.value })}
                    placeholder="19800101..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.position || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                    placeholder="Contoh: Kepala Sekolah / Guru Kelas 1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
                  />
                </div>
              </div>

              {activeTab === 'teachers' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Mata Pelajaran / Tugas
                  </label>
                  <input
                    type="text"
                    value={editingItem.subject || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                    placeholder="Contoh: Tematik Kelas VI / PJOK"
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
                  />
                </div>
              )}

              <FileUpload
                label="Foto Profil (Upload ke Supabase Storage)"
                folder={activeTab === 'teachers' ? 'teachers' : 'staff'}
                value={editingItem.photo_url || ''}
                onChange={(url) => setEditingItem({ ...editingItem, photo_url: url })}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Pendidikan / Bio Singkat
                </label>
                <input
                  type="text"
                  value={editingItem.bio || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                  placeholder="Contoh: S1 PGSD Universitas Negeri Malang"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#00A887] text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Ini?"
        message="Apakah Anda yakin ingin menghapus data dari Supabase?"
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
