import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Edit3, Trash2, Check, X, Loader2 } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, AgendaRecord } from '../../services/supabaseDataService';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';

export const AgendaCMS: React.FC = () => {
  const [agendas, setAgendas] = useState<AgendaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AgendaRecord> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AgendaRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAgendas = async () => {
    setLoading(true);
    const res = await getRecords<AgendaRecord>('agendas', { orderBy: { column: 'event_date', ascending: true } });
    setAgendas(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.event_date) return alert('Judul & Tanggal wajib diisi!');

    setIsSaving(true);
    try {
      if (editingItem.id) {
        const res = await updateRecord<AgendaRecord>('agendas', editingItem.id, editingItem);
        setAgendas((prev) => prev.map((a) => (a.id === editingItem.id ? res.data! : a)));
      } else {
        const res = await insertRecord<AgendaRecord>('agendas', editingItem);
        setAgendas((prev) => [...prev, res.data!]);
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
      await deleteRecord('agendas', deleteTarget.id);
      setAgendas((prev) => prev.filter((a) => a.id !== deleteTarget.id));
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
          <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" /> Manajemen Agenda & Kegiatan Sekolah
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Agenda Sekolah
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingItem({
              title: '',
              description: '',
              event_date: new Date().toISOString().split('T')[0],
              location: 'SDN SUMBEREJO 04',
              is_active: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
        </div>
      ) : agendas.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border text-center text-slate-400">
          <p className="text-sm font-bold">Belum ada agenda kegiatan.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden divide-y">
          {agendas.map((item) => (
            <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border border-rose-200">
                  <span className="text-lg leading-none">{item.event_date ? new Date(item.event_date).getDate() : '1'}</span>
                  <span className="text-[9px] uppercase tracking-wider mt-0.5">
                    {item.event_date ? new Date(item.event_date).toLocaleDateString('id-ID', { month: 'short' }) : 'BLN'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold mt-1">
                    📍 {item.location || 'SDN SUMBEREJO 04'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-xl"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                >
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
            <h3 className="font-serif font-black text-lg">{editingItem.id ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="Judul Agenda..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <input
                type="date"
                required
                value={editingItem.event_date || ''}
                onChange={(e) => setEditingItem({ ...editingItem, event_date: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <input
                type="text"
                value={editingItem.location || ''}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                placeholder="Lokasi..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <textarea
                rows={3}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Deskripsi..."
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Agenda Ini?"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
