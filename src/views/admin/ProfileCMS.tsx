import React, { useState, useEffect } from 'react';
import { School, Save, Loader2 } from 'lucide-react';
import { getRecords, updateRecord, insertRecord, SchoolProfileRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';

export const ProfileCMS: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getRecords<SchoolProfileRecord>('school_profile');
    if (res.data.length > 0) {
      setProfile(res.data[0]);
    } else {
      setProfile({
        about: 'SDN SUMBEREJO 04 adalah sekolah dasar negeri unggulan di Kabupaten Malang.',
        history: 'Didirikan untuk memberikan pendidikan inklusif dan bermutu tinggi bagi anak-anak bangsa.',
        vision: 'Mewujudkan Sekolah Unggul, Berkarakter, Cinta Lingkungan & Berprestasi di Tingkat Nasional.',
        mission: ['Menyelenggarakan pembelajaran aktif dan menyenangkan.', 'Menanamkan nilai-nilai religius dan budi pekerti.'],
        goals: ['Lulusan berkarakter Pancasila', 'Prestasi akademik dan non-akademik meningkat'],
        accreditation: 'A (Sangat Baik)',
        address: 'Jl. Raya Sumberejo No. 04',
        phone: '(0341) 123456',
        email: 'sdnsumberejo04@sch.id',
        principal_name: 'Kepala Sekolah SDN SUMBEREJO 04',
        principal_photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
        principal_message: 'Selamat datang di SDN SUMBEREJO 04. Kami siap mendidik generasi penerus bangsa.',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      if (profile.id) {
        await updateRecord('school_profile', profile.id, profile);
      } else {
        const res = await insertRecord('school_profile', profile);
        if (res.data) setProfile(res.data as SchoolProfileRecord);
      }
      alert('Profil Sekolah berhasil disimpan ke Supabase!');
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
            <School className="w-4 h-4" /> Profil & Identitas Sekolah
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Profil Sekolah
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg text-xs flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Profil</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Visi Sekolah</label>
          <textarea
            rows={3}
            value={profile?.vision || ''}
            onChange={(e) => setProfile({ ...profile!, vision: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs font-serif font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Misi Sekolah (Satu per baris)</label>
          <textarea
            rows={5}
            value={Array.isArray(profile?.mission) ? profile.mission.join('\n') : profile?.mission || ''}
            onChange={(e) => setProfile({ ...profile!, mission: e.target.value.split('\n') })}
            placeholder="Misi 1&#10;Misi 2..."
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Sejarah Singkat Sekolah</label>
          <textarea
            rows={4}
            value={profile?.history || ''}
            onChange={(e) => setProfile({ ...profile!, history: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Nama Kepala Sekolah</label>
            <input
              type="text"
              value={profile?.principal_name || ''}
              onChange={(e) => setProfile({ ...profile!, principal_name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Akreditasi</label>
            <input
              type="text"
              value={profile?.accreditation || ''}
              onChange={(e) => setProfile({ ...profile!, accreditation: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>
        </div>

        <FileUpload
          label="Foto Kepala Sekolah (Upload ke Supabase Storage)"
          folder="teachers"
          value={profile?.principal_photo || ''}
          onChange={(url) => setProfile({ ...profile!, principal_photo: url })}
        />

        <div>
          <label className="block text-xs font-bold uppercase mb-2">Sambutan Kepala Sekolah</label>
          <textarea
            rows={5}
            value={profile?.principal_message || ''}
            onChange={(e) => setProfile({ ...profile!, principal_message: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
          />
        </div>
      </form>
    </div>
  );
};
