import React, { useState, useEffect } from 'react';
import { FileText, Save, Loader2, Eye, Check } from 'lucide-react';
import { getRecords, updateRecord, insertRecord, PPDBRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { PreviewModal } from '../../components/admin/PreviewModal';

export const PPDBCMS: React.FC = () => {
  const [ppdb, setPpdb] = useState<PPDBRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<PPDBRecord | null>(null);

  const fetchPPDB = async () => {
    setLoading(true);
    const res = await getRecords<PPDBRecord>('ppdb');
    if (res.data.length > 0) {
      setPpdb(res.data[0]);
    } else {
      setPpdb({
        id: '',
        title: 'Penerimaan Peserta Didik Baru (PPDB) SDN SUMBEREJO 04',
        period: '2026/2027',
        description: 'Pendaftaran Murid Baru dibuka secara online dan offline.',
        poster_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
        registration_url: 'https://forms.google.com',
        is_active: true,
        show_popup: true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPPDB();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppdb) return;

    setIsSaving(true);
    try {
      if (ppdb.id) {
        await updateRecord('ppdb', ppdb.id, ppdb);
      } else {
        const res = await insertRecord('ppdb', ppdb);
        if (res.data) setPpdb(res.data as PPDBRecord);
      }
      alert('Pengaturan PPDB berhasil disimpan ke Supabase!');
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 text-[#00A887] animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A887] uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Penerimaan Peserta Didik Baru (PPDB)
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Pengaturan Portal & Informasi PPDB
          </h1>
        </div>

        <button
          onClick={() => setPreviewData(ppdb)}
          className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-3 rounded-2xl transition-all text-xs flex items-center gap-2"
        >
          <Eye className="w-4 h-4" /> Lihat Preview PPDB
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Judul Pendaftaran</label>
            <input
              type="text"
              required
              value={ppdb?.title || ''}
              onChange={(e) => setPpdb({ ...ppdb!, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Tahun Ajaran / Periode</label>
            <input
              type="text"
              required
              value={ppdb?.period || ''}
              onChange={(e) => setPpdb({ ...ppdb!, period: e.target.value })}
              placeholder="2026/2027"
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>
        </div>

        <FileUpload
          label="Poster Resmi / Banner PPDB (Upload ke Supabase Storage)"
          folder="ppdb"
          value={ppdb?.poster_url || ''}
          onChange={(url) => setPpdb({ ...ppdb!, poster_url: url })}
        />

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Tautan Formulir Pendaftaran Online</label>
          <input
            type="text"
            value={ppdb?.registration_url || ''}
            onChange={(e) => setPpdb({ ...ppdb!, registration_url: e.target.value })}
            placeholder="https://forms.google.com/..."
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Deskripsi & Syarat Pendaftaran</label>
          <textarea
            rows={4}
            value={ppdb?.description || ''}
            onChange={(e) => setPpdb({ ...ppdb!, description: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ppdb?.is_active || false}
              onChange={(e) => setPpdb({ ...ppdb!, is_active: e.target.checked })}
              className="w-4 h-4 text-[#00A887]"
            />
            <span className="text-xs font-bold">Status Pendaftaran Aktif (Dibuka)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ppdb?.show_popup || false}
              onChange={(e) => setPpdb({ ...ppdb!, show_popup: e.target.checked })}
              className="w-4 h-4 text-[#00A887]"
            />
            <span className="text-xs font-bold">Tampilkan Popup Promosi PPDB</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg text-xs flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Perubahan PPDB</span>
        </button>
      </form>

      <PreviewModal
        isOpen={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        type="ppdb"
        data={previewData}
      />
    </div>
  );
};
