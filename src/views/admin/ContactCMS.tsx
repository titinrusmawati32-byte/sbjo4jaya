import React, { useState, useEffect } from 'react';
import { Phone, Save, Loader2 } from 'lucide-react';
import { getRecords, updateRecord, insertRecord, ContactSettingsRecord } from '../../services/supabaseDataService';

export const ContactCMS: React.FC = () => {
  const [contact, setContact] = useState<ContactSettingsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchContact = async () => {
    setLoading(true);
    const res = await getRecords<ContactSettingsRecord>('contact_settings');
    if (res.data.length > 0) {
      setContact(res.data[0]);
    } else {
      setContact({
        address: 'Jl. Raya Sumberejo No. 04, Sumberejo, Kec. Gedangan, Kab. Malang',
        phone: '(0341) 123456',
        email: 'sdnsumberejo04@sch.id',
        maps_url: 'https://maps.google.com',
        office_hours: 'Senin - Sabtu: 07.00 - 14.00 WIB',
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        tiktok: 'https://tiktok.com',
        whatsapp: '6281234567890',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsSaving(true);
    try {
      if (contact.id) {
        await updateRecord('contact_settings', contact.id, contact);
      } else {
        const res = await insertRecord('contact_settings', contact);
        if (res.data) setContact(res.data as ContactSettingsRecord);
      }
      alert('Informasi kontak sekolah berhasil diperbarui ke Supabase!');
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
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00A887] uppercase tracking-wider mb-1">
          <Phone className="w-4 h-4" /> Informasi Kontak & Sosial Media
        </div>
        <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
          Kelola Kontak Resmi Sekolah
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Alamat Lengkap</label>
            <input
              type="text"
              value={contact?.address || ''}
              onChange={(e) => setContact({ ...contact!, address: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Telepon / WhatsApp Resmi</label>
            <input
              type="text"
              value={contact?.phone || ''}
              onChange={(e) => setContact({ ...contact!, phone: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Email Official</label>
            <input
              type="email"
              value={contact?.email || ''}
              onChange={(e) => setContact({ ...contact!, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">Jam Operasional Kantor</label>
            <input
              type="text"
              value={contact?.office_hours || ''}
              onChange={(e) => setContact({ ...contact!, office_hours: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">URL Google Maps Embed</label>
          <input
            type="text"
            value={contact?.maps_url || ''}
            onChange={(e) => setContact({ ...contact!, maps_url: e.target.value })}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full bg-slate-50 dark:bg-slate-800 border rounded-2xl px-4 py-3 text-xs font-mono"
          />
        </div>

        <div className="pt-4 border-t space-y-4">
          <h3 className="font-serif font-black text-sm">Tautan Sosial Media</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Facebook</label>
              <input
                type="text"
                value={contact?.facebook || ''}
                onChange={(e) => setContact({ ...contact!, facebook: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Instagram</label>
              <input
                type="text"
                value={contact?.instagram || ''}
                onChange={(e) => setContact({ ...contact!, instagram: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">YouTube</label>
              <input
                type="text"
                value={contact?.youtube || ''}
                onChange={(e) => setContact({ ...contact!, youtube: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">TikTok</label>
              <input
                type="text"
                value={contact?.tiktok || ''}
                onChange={(e) => setContact({ ...contact!, tiktok: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">Nomor WhatsApp (62...)</label>
              <input
                type="text"
                value={contact?.whatsapp || ''}
                onChange={(e) => setContact({ ...contact!, whatsapp: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg text-xs flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Kontak</span>
        </button>
      </form>
    </div>
  );
};
