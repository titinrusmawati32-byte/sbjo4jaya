import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Language, NewsItem } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { Newspaper, Search, Calendar, User, Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface BeritaViewProps {
  language: Language;
}

export const BeritaView: React.FC<BeritaViewProps> = ({ language }) => {
  const [db, setDb] = useState(getDatabase());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;
  const newsArticles = db.newsArticles || [];

  const categories = ['All', 'Prestasi', 'Kegiatan', 'Akademik', 'Pengumuman'];

  const filteredNews = newsArticles.filter((article) => {
    const matchCat =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchSearch =
      article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-12 py-8 bg-[#062B3A] text-[#F5FAFC] min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] shadow-2xl relative overflow-hidden border border-[rgba(32,214,160,0.25)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[rgba(32,214,160,0.30)]">
              <Newspaper className="w-3.5 h-3.5 text-[#FFBD24]" />
              <span>Warta & Informasi Sekolah</span>
            </div>
            <h1 className="text-[#F5FAFC] font-extrabold tracking-tight text-3xl sm:text-5xl leading-tight">
              Berita & Prestasi
            </h1>
            <p className="text-base sm:text-lg text-[#C0D5DF] leading-relaxed font-normal">
              Dokumentasi kegiatan resmi, agenda sekolah, pengumuman penting, dan kabar prestasi siswa serta guru {schoolInfo.name}.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073440]/90 backdrop-blur-md p-5 rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  showToast(language === 'ID' ? `Kategori: ${cat}` : `Category: ${cat}`, 'info');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#00A887] text-white shadow-md shadow-[#00A887]/30'
                    : 'bg-[#062B3A] text-[#C0D5DF] hover:text-[#20D6A0] border border-[rgba(32,214,160,0.15)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#20D6A0] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ID' ? 'Cari judul berita...' : 'Search news...'}
              className="w-full text-xs bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] text-[#F5FAFC] placeholder-[#C0D5DF]/60"
            />
          </div>
        </div>
      </section>

      {/* 3. News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-[#073440]/80 rounded-2xl border border-dashed border-[rgba(32,214,160,0.25)]">
            <Newspaper className="w-12 h-12 text-[#20D6A0]/40 mx-auto mb-3" />
            <h3 className="font-bold text-[#F5FAFC] text-lg">
              Warta Tidak Ditemukan
            </h3>
            <p className="text-xs text-[#C0D5DF] mt-1">
              Gunakan kata kunci lain atau pilih kategori Semua untuk menampilkan berita.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] overflow-hidden border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 cursor-pointer flex flex-col group hover:-translate-y-1 hover:border-[#20D6A0]/50 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden bg-[#083D49]">
                  <img
                    src={article.image}
                    alt={article.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#00A887] text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-[#C0D5DF]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#20D6A0]" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#20D6A0]" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#F5FAFC] text-base leading-snug group-hover:text-[#20D6A0] transition-colors line-clamp-2">
                      {article.title[language]}
                    </h3>

                    <p className="text-xs text-[#C0D5DF] line-clamp-3 leading-relaxed font-normal">
                      {article.summary[language]}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[rgba(32,214,160,0.15)] flex items-center justify-between text-xs font-semibold text-[#20D6A0]">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. Full Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#073440] rounded-[24px] max-w-3xl w-full max-h-[88vh] overflow-hidden shadow-2xl relative border border-[rgba(32,214,160,0.3)] flex flex-col"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-20 bg-[#062B3A]/80 hover:bg-[#00A887] text-white p-2.5 rounded-full transition-colors border border-[rgba(32,214,160,0.2)]"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative h-60 sm:h-72 shrink-0 overflow-hidden bg-[#083D49]">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title[language]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-[#062B3A]/40 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 text-white space-y-2">
                  <span className="bg-[#00A887] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight text-[#F5FAFC]">
                    {selectedArticle.title[language]}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-[#C0D5DF]">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[rgba(32,214,160,0.15)] text-xs text-[#C0D5DF]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#20D6A0]" />
                    <span>Penulis: <strong className="text-[#F5FAFC]">{selectedArticle.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#20D6A0]" />
                      {selectedArticle.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#20D6A0]" />
                      {selectedArticle.readTime}
                    </span>
                  </div>
                </div>

                <div className="leading-relaxed whitespace-pre-line text-sm sm:text-base text-[#F5FAFC]">
                  {selectedArticle.content[language]}
                </div>

                <div className="pt-6 border-t border-[rgba(32,214,160,0.15)] flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="btn-primary"
                  >
                    <span>Tutup Artikel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
