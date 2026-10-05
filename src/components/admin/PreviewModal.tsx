import React from 'react';
import { X, Eye, Calendar, Tag, User, ArrowRight, Bell, Award } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'news' | 'announcement' | 'ppdb' | 'hero';
  data: any;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#062B3A] text-[#F5FAFC] border border-[#20D6A0]/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#083D49]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A887] text-white rounded-xl flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#20D6A0] tracking-widest block">
                PREVIEW TAMPILAN PUBLIK
              </span>
              <h3 className="text-base font-serif font-black text-white capitalize">
                Pratinjau {type}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TYPE: NEWS */}
          {type === 'news' && (
            <article className="space-y-6">
              {data.thumbnail_url && (
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 relative">
                  <img
                    src={data.thumbnail_url}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#00A887] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {data.category || 'Kegiatan'}
                  </div>
                  {data.status === 'draft' && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded-full text-xs uppercase">
                      DRAFT
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                  {data.title || 'Judul Berita'}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#C0D5DF] font-medium border-y border-white/10 py-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#20D6A0]" />
                    {data.published_at
                      ? new Date(data.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Hari ini'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#20D6A0]" />
                    {data.author_name || 'Admin'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#20D6A0]" />
                    {data.category || 'Umum'}
                  </span>
                </div>

                {data.excerpt && (
                  <p className="text-base text-[#20D6A0] font-medium italic bg-[#073440] p-4 rounded-xl border-l-4 border-[#00A887]">
                    "{data.excerpt}"
                  </p>
                )}

                <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 pt-2">
                  {(data.content || 'Isi berita belum ditulis...').split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          )}

          {/* TYPE: ANNOUNCEMENT */}
          {type === 'announcement' && (
            <div className="bg-[#073440] border border-[#20D6A0]/30 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[#FFBD24] font-bold text-xs uppercase tracking-wider">
                <Bell className="w-4 h-4" /> Pengumuman Resmi
              </div>

              {data.image_url && (
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-2xl border border-white/10"
                />
              )}

              <h2 className="text-2xl font-serif font-black text-white">
                {data.title || 'Judul Pengumuman'}
              </h2>

              <p className="text-sm text-slate-200 leading-relaxed">
                {data.description || 'Deskripsi pengumuman'}
              </p>

              {data.button_text && (
                <a
                  href={data.button_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-slate-900 font-bold text-sm rounded-full transition-all shadow-lg"
                >
                  <span>{data.button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* TYPE: PPDB */}
          {type === 'ppdb' && (
            <div className="bg-gradient-to-br from-[#073440] to-[#083D49] border-2 border-[#00A887] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="bg-[#FFBD24] text-slate-900 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
                  TAHUN AJARAN {data.period || '2026/2027'}
                </span>
                <span className="text-xs text-[#20D6A0] font-bold">
                  {data.is_active ? '● Pendaftaran Dibuka' : '○ Pendaftaran Ditutup'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {data.poster_url && (
                  <img
                    src={data.poster_url}
                    alt={data.title}
                    className="w-full h-64 object-cover rounded-2xl border border-white/10 shadow-lg"
                  />
                )}
                <div className="space-y-4">
                  <h2 className="text-2xl font-serif font-black text-white">
                    {data.title || 'PPDB Online SDN SUMBEREJO 04'}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.description || 'Pendaftaran siswa baru dibuka secara online.'}
                  </p>
                  <a
                    href={data.registration_url || '#'}
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-slate-900 font-bold text-sm rounded-2xl transition-all shadow-xl"
                  >
                    <span>Formulir Pendaftaran PPDB</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TYPE: HERO */}
          {type === 'hero' && (
            <div className="relative min-h-[300px] sm:min-h-[400px] rounded-3xl overflow-hidden flex items-center justify-center p-8 text-center border border-white/20">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt="Hero Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#062B3A]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-[#062B3A]/70 to-transparent" />

              <div className="relative z-10 max-w-xl space-y-4">
                <span className="bg-[#20D6A0]/20 border border-[#20D6A0]/40 text-[#20D6A0] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
                  {data.subtitle || 'HERO SECTION'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight">
                  {data.title || 'Judul Utama Banner'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200">
                  {data.content || 'Subdeskripsi singkat banner depan sekolah.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#083D49] border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold text-xs rounded-xl transition-all"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
