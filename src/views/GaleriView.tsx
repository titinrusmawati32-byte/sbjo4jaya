import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Language, GalleryItem } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import {
  formatImageUrl,
  getMediaEmbedType,
  getYouTubeEmbedUrl,
  getGoogleDriveEmbedUrl,
  useResolvedMediaUrl,
} from '../utils/mediaUtils';
import { ImageIcon, X, ZoomIn, Calendar } from 'lucide-react';

interface GaleriViewProps {
  language: Language;
}

function GaleriItemMedia({ item, isModal = false }: { item: GalleryItem; isModal?: boolean }) {
  const embedType = getMediaEmbedType(item.url);
  const resolvedVideoUrl = useResolvedMediaUrl(item.url);
  const isVideo = item.type === 'video' || embedType !== 'none';

  if (isVideo) {
    if (embedType === 'youtube' && item.url) {
      return (
        <iframe
          src={getYouTubeEmbedUrl(item.url, isModal)}
          title={item.title.ID}
          className={`w-full h-full object-cover border-0 ${!isModal ? 'pointer-events-none' : 'pointer-events-auto'}`}
          allow="autoplay; encrypted-media"
        />
      );
    }
    if (embedType === 'gdrive' && item.url) {
      return (
        <iframe
          src={getGoogleDriveEmbedUrl(item.url)}
          title={item.title.ID}
          className={`w-full h-full object-cover border-0 ${!isModal ? 'pointer-events-none' : 'pointer-events-auto'}`}
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      );
    }
    if (resolvedVideoUrl) {
      return (
        <video
          src={resolvedVideoUrl}
          controls={isModal}
          autoPlay={isModal}
          muted={!isModal}
          loop
          playsInline
          className="w-full h-full object-contain max-h-[65vh]"
        />
      );
    }
  }

  return (
    <img
      src={formatImageUrl(item.url)}
      alt={item.title.ID}
      className={`w-full h-full ${isModal ? 'object-contain max-h-[65vh]' : 'object-cover group-hover:scale-105 transition-transform duration-500'}`}
    />
  );
}

export const GaleriView: React.FC<GaleriViewProps> = ({ language }) => {
  const [db, setDb] = useState(getDatabase());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;
  const galleryItems = db.galleryItems || [];

  const categories = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'seni', label: 'Seni & Budaya' },
    { id: 'olahraga', label: 'Olahraga' },
    { id: 'pramuka', label: 'Pramuka' },
    { id: 'lingkungan', label: 'Lingkungan' },
    { id: 'upacara', label: 'Upacara Resmi' },
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="space-y-12 py-8 bg-[#062B3A] text-[#F5FAFC] min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] shadow-2xl relative overflow-hidden border border-[rgba(32,214,160,0.25)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[rgba(32,214,160,0.30)]">
              <ImageIcon className="w-3.5 h-3.5 text-[#FFBD24]" />
              <span>Dokumentasi Kegiatan & Fasilitas</span>
            </div>
            <h1 className="text-[#F5FAFC] font-extrabold tracking-tight text-3xl sm:text-5xl leading-tight">
              Galeri Sekolah
            </h1>
            <p className="text-base sm:text-lg text-[#C0D5DF] leading-relaxed font-normal">
              Potret dinamika aktivitas murid, momen kebersamaan, dan atmosfer pembelajaran aktif di {schoolInfo.name}.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073440]/90 backdrop-blur-md p-4 rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00A887] text-white shadow-md shadow-[#00A887]/30'
                  : 'bg-[#062B3A] text-[#C0D5DF] hover:text-[#20D6A0] border border-[rgba(32,214,160,0.15)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#073440]/80 rounded-2xl border border-dashed border-[rgba(32,214,160,0.25)]">
            <ImageIcon className="w-12 h-12 text-[#20D6A0]/40 mx-auto mb-3" />
            <h3 className="font-bold text-[#F5FAFC] text-lg">
              Belum Ada Dokumentasi
            </h3>
            <p className="text-xs text-[#C0D5DF] mt-1">
              Foto dan video untuk kategori ini akan segera diperbarui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] overflow-hidden border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 group cursor-pointer flex flex-col hover:-translate-y-1 hover:border-[#20D6A0]/50 transition-all duration-300"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#083D49]">
                  <GaleriItemMedia item={item} />
                  <div className="absolute inset-0 bg-[#062B3A]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#00A887] text-white flex items-center justify-center shadow-lg">
                      <ZoomIn className="w-5 h-5 text-[#FFBD24]" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#062B3A]/90 text-[#20D6A0] border border-[rgba(32,214,160,0.25)] text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-[#F5FAFC] text-sm group-hover:text-[#20D6A0] transition-colors line-clamp-1">
                    {item.title[language] || item.title.ID}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#C0D5DF] pt-2 border-t border-[rgba(32,214,160,0.15)]">
                    <Calendar className="w-3 h-3 text-[#20D6A0]" />
                    <span>{item.date || '2026/2027'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative border border-slate-200 flex flex-col"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-[#071524] flex items-center justify-center min-h-[300px] max-h-[65vh] p-2">
                <GaleriItemMedia item={selectedImage} isModal={true} />
              </div>

              <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#008B6A] uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#0B1F33]">
                    {selectedImage.title[language] || selectedImage.title.ID}
                  </h3>
                </div>

                <div className="text-xs text-[#64748B]">
                  Tanggal: {selectedImage.date}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
