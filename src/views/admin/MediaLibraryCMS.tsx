import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, FileText } from 'lucide-react';
import { FileUpload } from '../../components/admin/FileUpload';

export const MediaLibraryCMS: React.FC = () => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00A887] uppercase tracking-wider mb-1">
          <ImageIcon className="w-4 h-4" /> Supabase Storage Bucket: school-assets
        </div>
        <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
          Pustaka Media & Berkas
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm space-y-4">
        <h2 className="text-base font-serif font-black">Unggah Berkas Baru ke Storage</h2>
        <FileUpload
          label="Pilih foto/berkas untuk langsung diunggah ke Supabase Storage"
          folder="gallery"
          value=""
          onChange={(newUrl) => {
            if (newUrl) setUploadedUrls((prev) => [newUrl, ...prev]);
          }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uploadedUrls.map((url, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden p-3 space-y-2 relative group shadow-sm">
            <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
              <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(url, idx)}
                className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#00A887] hover:text-white text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === idx ? 'Tersalin' : 'Salin URL'}</span>
              </button>
              <button
                onClick={() => setUploadedUrls((prev) => prev.filter((_, i) => i !== idx))}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
