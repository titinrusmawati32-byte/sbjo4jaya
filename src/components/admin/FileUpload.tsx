import React, { useState } from 'react';
import { Upload, X, Check, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadFileToSupabase } from '../../services/storageService';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: string;
  previewType?: 'image' | 'file';
  placeholder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value = '',
  onChange,
  folder = 'general',
  label = 'Unggah File / Gambar',
  accept = 'image/*',
  previewType = 'image',
  placeholder = 'Klik atau drag file ke sini',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(10);

    // Create immediate local preview
    if (file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
    }

    try {
      const result = await uploadFileToSupabase(file, folder, (p) => setProgress(p));
      if (result.error) {
        setError(result.error);
      } else {
        setPreview(result.url);
        onChange(result.url);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Main Upload Box */}
      {preview || value ? (
        <div className="relative group border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-3 flex items-center justify-between gap-4">
          {previewType === 'image' && (preview || value) ? (
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <img
                src={preview || value}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {value.split('/').pop() || 'File Terunggah'}
                </p>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Berhasil tersimpan
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {value.split('/').pop() || 'Dokumen Terunggah'}
                </p>
                <a
                  href={preview || value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-emerald-600 hover:underline font-bold"
                >
                  Lihat File
                </a>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            title="Hapus file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-emerald-50/20 group text-center">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="sr-only"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Mengunggah... {progress}%
              </span>
              <div className="w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {previewType === 'image' ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {placeholder}
                </p>
                <p className="text-[10px] text-slate-400">
                  Klik untuk jelajahi file dari perangkat Anda
                </p>
              </div>
            </>
          )}
        </label>
      )}

      {/* Direct URL input option */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          placeholder="atau tempelkan URL gambar/file langsung di sini..."
          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-600 dark:text-slate-300"
        />
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
