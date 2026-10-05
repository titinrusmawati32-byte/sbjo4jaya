import React, { useState, useEffect } from 'react';
import { Home, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { getRecords, updateRecord, insertRecord, HomepageSectionRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';

export const HomepageCMS: React.FC = () => {
  const [sections, setSections] = useState<HomepageSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    const res = await getRecords<HomepageSectionRecord>('homepage_sections', { orderBy: { column: 'sort_order', ascending: true } });
    if (res.data.length === 0) {
      const defaultSections: Partial<HomepageSectionRecord>[] = [
        {
          section_key: 'hero',
          title: 'Mewujudkan Generasi Cerdas, Berkarakter & Berprestasi',
          subtitle: 'SDN SUMBEREJO 04',
          content: 'Pendidikan Berkualitas dengan Kurikulum Merdeka Terintegrasi Teknologi dan Nilai Karakter Pancasila.',
          image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
          sort_order: 1,
          is_visible: true,
        },
        {
          section_key: 'welcome',
          title: 'Sambutan Kepala Sekolah',
          subtitle: 'SDN SUMBEREJO 04',
          content: 'Selamat datang di Website Resmi SDN SUMBEREJO 04. Kami berkomitmen untuk menyelenggarakan pendidikan dasar yang humanis, holistik, dan berprestasi.',
          image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
          sort_order: 2,
          is_visible: true,
        },
      ];
      for (const item of defaultSections) {
        await insertRecord('homepage_sections', item);
      }
      const reFetch = await getRecords<HomepageSectionRecord>('homepage_sections', { orderBy: { column: 'sort_order', ascending: true } });
      setSections(reFetch.data);
    } else {
      setSections(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleUpdateSection = (index: number, fields: Partial<HomepageSectionRecord>) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], ...fields };
    setSections(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      for (const item of sections) {
        if (item.id) {
          await updateRecord('homepage_sections', item.id, item);
        }
      }
      alert('Pengaturan Beranda berhasil disimpan ke Supabase!');
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
            <Home className="w-4 h-4" /> Manajemen Halaman Beranda (Homepage)
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Konten Beranda
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg text-xs flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Perubahan Beranda</span>
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={section.id || idx} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-black uppercase text-[#00A887] tracking-wider">
                Bagian: {section.section_key}
              </span>
              <button
                type="button"
                onClick={() => handleUpdateSection(idx, { is_visible: !section.is_visible })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  section.is_visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{section.is_visible ? 'Tampil di Website' : 'Disembunyikan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Judul Bagian</label>
                <input
                  type="text"
                  value={section.title || ''}
                  onChange={(e) => handleUpdateSection(idx, { title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Sub-judul / Tagline</label>
                <input
                  type="text"
                  value={section.subtitle || ''}
                  onChange={(e) => handleUpdateSection(idx, { subtitle: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
                />
              </div>
            </div>

            <FileUpload
              label="Gambar Background / Foto Sampul (Supabase Storage)"
              folder="hero"
              value={section.image_url || ''}
              onChange={(url) => handleUpdateSection(idx, { image_url: url })}
            />

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Isi Konten Teks</label>
              <textarea
                rows={4}
                value={section.content || ''}
                onChange={(e) => handleUpdateSection(idx, { content: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
