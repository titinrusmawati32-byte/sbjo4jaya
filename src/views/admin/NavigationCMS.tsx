import React, { useState, useEffect } from 'react';
import { Navigation, Plus, Edit3, Trash2, Check, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, NavigationRecord } from '../../services/supabaseDataService';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';

export const NavigationCMS: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavigationRecord> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<NavigationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNav = async () => {
    setLoading(true);
    const res = await getRecords<NavigationRecord>('navigation', { orderBy: { column: 'sort_order', ascending: true } });
    if (res.data.length === 0) {
      // Default initial menus if empty
      const defaultNavs: Partial<NavigationRecord>[] = [
        { label: 'Beranda', url: '/#beranda', sort_order: 1, is_active: true, open_new_tab: false },
        { label: 'Profil', url: '/#profil', sort_order: 2, is_active: true, open_new_tab: false },
        { label: 'SDM', url: '/#sdm', sort_order: 3, is_active: true, open_new_tab: false },
        { label: 'Akademik', url: '/#akademik', sort_order: 4, is_active: true, open_new_tab: false },
        { label: 'Galeri', url: '/#galeri', sort_order: 5, is_active: true, open_new_tab: false },
        { label: 'Berita', url: '/#berita', sort_order: 6, is_active: true, open_new_tab: false },
        { label: 'Kontak', url: '/#kontak', sort_order: 7, is_active: true, open_new_tab: false },
      ];
      for (const item of defaultNavs) {
        await insertRecord('navigation', item);
      }
      const reFetch = await getRecords<NavigationRecord>('navigation', { orderBy: { column: 'sort_order', ascending: true } });
      setNavItems(reFetch.data);
    } else {
      setNavItems(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.label || !editingItem?.url) return alert('Label & URL wajib diisi!');

    setIsSaving(true);
    try {
      if (editingItem.id) {
        const res = await updateRecord<NavigationRecord>('navigation', editingItem.id, editingItem);
        setNavItems((prev) => prev.map((n) => (n.id === editingItem.id ? res.data! : n)));
      } else {
        const res = await insertRecord<NavigationRecord>('navigation', editingItem);
        setNavItems((prev) => [...prev, res.data!]);
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
      await deleteRecord('navigation', deleteTarget.id);
      setNavItems((prev) => prev.filter((n) => n.id !== deleteTarget.id));
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
            <Navigation className="w-4 h-4" /> Manajemen Navigasi & Menu Utama
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Menu Navbar Website
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              label: '',
              url: '/#',
              sort_order: navItems.length + 1,
              is_active: true,
              open_new_tab: false,
            });
            setIsModalOpen(true);
          }}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-[#00A887] animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden divide-y">
          {navItems.map((item, idx) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</h3>
                  <p className="text-xs font-mono text-slate-400">{item.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  {item.is_active ? 'Aktif' : 'Non-aktif'}
                </span>
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
            <h3 className="font-serif font-black text-lg">{editingItem.id ? 'Edit Menu Navigasi' : 'Tambah Menu'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                required
                value={editingItem.label || ''}
                onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                placeholder="Label Menu..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <input
                type="text"
                required
                value={editingItem.url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                placeholder="URL Tautan (e.g. /#berita)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs font-mono"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={editingItem.is_active || false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                  />
                  <span>Tampilkan di Navbar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={editingItem.open_new_tab || false}
                    onChange={(e) => setEditingItem({ ...editingItem, open_new_tab: e.target.checked })}
                  />
                  <span>Buka di Tab Baru</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-[#00A887] text-white text-xs font-bold rounded-xl">Simpan Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Menu Ini?"
        itemName={deleteTarget?.label}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
