import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Database, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';
import { getRecords, updateRecord, insertRecord, seedSupabaseDatabase, SiteSettingsRecord, Profile } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';

export const SettingsCMS: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRecord | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const settingsRes = await getRecords<SiteSettingsRecord>('site_settings');
    const profilesRes = await getRecords<Profile>('profiles');

    if (settingsRes.data.length > 0) {
      setSiteSettings(settingsRes.data[0]);
    } else {
      setSiteSettings({
        school_name: 'SDN SUMBEREJO 04',
        school_short_name: 'SDN Sumberejo 04',
        npsn: '20512345',
        logo_url: '',
        favicon_url: '',
        primary_color: '#062B3A',
        secondary_color: '#083D49',
        accent_color: '#00A887',
        footer_text: '© 2026 SDN SUMBEREJO 04. All rights reserved.',
        seo_title: 'Website Resmi SDN SUMBEREJO 04',
        seo_description: 'Portal Resmi SDN SUMBEREJO 04 dengan info akademik, berita, dan PPDB.',
      });
    }

    setProfiles(profilesRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;

    setIsSaving(true);
    try {
      if (siteSettings.id) {
        await updateRecord('site_settings', siteSettings.id, siteSettings);
      } else {
        const res = await insertRecord('site_settings', siteSettings);
        if (res.data) setSiteSettings(res.data as SiteSettingsRecord);
      }
      alert('Pengaturan situs berhasil diperbarui ke Supabase!');
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Proses ini akan mengunggah data sampel lengkap ke database Supabase Anda. Lanjutkan?')) return;
    setIsSeeding(true);
    setSeedStatus('Mengunggah data awal...');
    const result = await seedSupabaseDatabase();
    setSeedStatus(result.message);
    setIsSeeding(false);
    await fetchData();
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
            <SettingsIcon className="w-4 h-4" /> Pengaturan Sistem & Database CMS
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Pengaturan Situs & Pengguna
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-3 rounded-2xl transition-all text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-[#20D6A0]" />
            <span>{isSeeding ? 'Seeding...' : 'Seed Data Awal'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg text-xs flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>

      {seedStatus && (
        <div className="p-4 bg-[#00A887]/10 border border-[#00A887]/30 rounded-2xl text-xs font-mono font-bold text-[#00A887]">
          {seedStatus}
        </div>
      )}

      {/* Identitas Sekolah & SEO */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
        <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00A887]" /> Identitas Website & SEO
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Nama Resmi Sekolah</label>
            <input
              type="text"
              value={siteSettings?.school_name || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings!, school_name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Nama Singkatan</label>
            <input
              type="text"
              value={siteSettings?.school_short_name || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings!, school_short_name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">NPSN</label>
            <input
              type="text"
              value={siteSettings?.npsn || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings!, npsn: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs font-mono"
            />
          </div>
        </div>

        <FileUpload
          label="Logo Resmi Sekolah (Upload ke Supabase Storage)"
          folder="logo"
          value={siteSettings?.logo_url || ''}
          onChange={(url) => setSiteSettings({ ...siteSettings!, logo_url: url })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Judul SEO (Meta Title)</label>
            <input
              type="text"
              value={siteSettings?.seo_title || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings!, seo_title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Teks Copyright Footer</label>
            <input
              type="text"
              value={siteSettings?.footer_text || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings!, footer_text: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Deskripsi SEO (Meta Description)</label>
          <textarea
            rows={3}
            value={siteSettings?.seo_description || ''}
            onChange={(e) => setSiteSettings({ ...siteSettings!, seo_description: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
          />
        </div>
      </form>

      {/* Admin Profiles List */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4">
        <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#00A887]" /> Pengguna & Role Supabase RLS
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-3">Nama</th>
                <th className="p-3">Username</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.length > 0 ? (
                profiles.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold">{p.full_name}</td>
                    <td className="p-3 font-mono text-slate-400">{p.username || 'admin'}</td>
                    <td className="p-3 font-bold text-[#00A887] uppercase">{p.role}</td>
                    <td className="p-3 font-bold text-emerald-600">{p.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                    Pengguna terverifikasi akan tercantum di sini setelah login Supabase Auth.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
