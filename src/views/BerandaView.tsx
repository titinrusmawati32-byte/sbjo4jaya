import React, { useState, useEffect } from 'react';
import { Language, NavTab, HeroSlide, CoreValueItem, NewsItem, TeacherItem } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { formatImageUrl } from '../utils/mediaUtils';
import { HeroSection } from '../components/HeroSection';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Heart,
  ShieldCheck,
  Lightbulb,
  Sprout,
  BookOpen,
  Building,
  GraduationCap,
  Users,
  Award,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';

interface BerandaViewProps {
  language: Language;
  onSelectTab: (tab: NavTab, subTab?: string) => void;
  onOpenPPDB: () => void;
}

// Dynamic Icon helper
const getIcon = (iconName: string) => {
  const lower = iconName.toLowerCase();
  if (lower.includes('shield')) return <ShieldCheck className="w-6 h-6" />;
  if (lower.includes('lightbulb')) return <Lightbulb className="w-6 h-6" />;
  if (lower.includes('sprout')) return <Sprout className="w-6 h-6" />;
  if (lower.includes('book')) return <BookOpen className="w-6 h-6" />;
  if (lower.includes('building')) return <Building className="w-6 h-6" />;
  if (lower.includes('heart')) return <HeartHandshake className="w-6 h-6" />;
  if (lower.includes('award')) return <Award className="w-6 h-6" />;
  return <Sparkles className="w-6 h-6" />;
};

const getAccreditationShort = (text: string) => {
  if (text.includes('A')) return 'UNGGUL';
  return 'TERAKREDITASI';
};

export const BerandaView: React.FC<BerandaViewProps> = ({
  language,
  onSelectTab,
  onOpenPPDB,
}) => {
  const [db, setDb] = useState(getDatabase());

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const heroSlides = db.heroSlides || [];
  const coreValues = db.coreValues || [];
  const newsArticles = db.newsArticles || [];
  const schoolInfo = db.schoolInfo;
  const principal = db.teachers.find((t) => t.role.ID.toLowerCase().includes('kepala sekolah')) || db.teachers[0];

  return (
    <div className="space-y-16 md:space-y-24 pb-20 bg-[#062B3A] text-[#F5FAFC]">
      
      {/* ==================================================
          1. HERO SECTION (Video Opening -> Second Photo Transition)
          ================================================== */}
      <HeroSection
        language={language}
        schoolInfo={schoolInfo}
        heroSlides={heroSlides}
        onOpenPPDB={onOpenPPDB}
        onSelectTab={onSelectTab}
      />

      {/* ==================================================
          2. BANNER INFORMASI PPDB (Teal Gelap #083D49 with Gold #FFBD24 Button)
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-30">
        <div className="bg-[#083D49] rounded-2xl sm:rounded-[22px] p-5 sm:p-7 border border-[rgba(32,214,160,0.25)] shadow-xl shadow-[#062B3A]/80 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#00A887]/20 border border-[#20D6A0]/30 flex items-center justify-center text-[#20D6A0] shrink-0 shadow-inner">
                <GraduationCap className="w-6 h-6 text-[#FFBD24]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#F5FAFC] tracking-tight">
                  Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran {db.ppdbInfo.year || '2027/2028'}
                </h3>
                <p className="text-xs sm:text-sm text-[#C0D5DF] font-normal">
                  Pendaftaran resmi online gratis tanpa dipungut biaya.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPPDB}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FFBD24] hover:bg-[#ffe082] text-[#062B3A] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#FFBD24]/20 transition-all hover:scale-105 active:scale-95 shrink-0 w-full sm:w-auto"
            >
              <span>Isi Formulir Pendaftaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. SECTION PILAR KARAKTER SEKOLAH (Deep Teal Gradient & Dark Glassmorphism)
          ================================================== */}
      <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-b from-[#062B3A] via-[#083D49] to-[#062B3A] border-y border-[rgba(32,214,160,0.15)]">
        {/* Subtle school photo background overlay texture */}
        <div 
          className="absolute inset-0 opacity-[0.06] bg-cover bg-center pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1600')",
          }}
        />

        {/* Abstract emerald decorative gradient glows */}
        <div className="absolute top-1/4 left-1/12 w-96 h-96 rounded-full bg-[#20D6A0]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/12 w-96 h-96 rounded-full bg-[#00A887]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[rgba(32,214,160,0.15)] text-[#20D6A0] border border-[rgba(32,214,160,0.30)] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilar Karakter Sekolah</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5FAFC] tracking-tight leading-tight">
              {language === 'ID' ? (
                <>Fondasi Pendidikan <span className="text-[#20D6A0]">Berkarakter</span></>
              ) : (
                <>Core Character <span className="text-[#20D6A0]">Foundation</span></>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#C0D5DF] max-w-lg mx-auto leading-relaxed">
              Membekali murid dengan karakter unggul, kemandirian berpikir, dan akhlak mulia sesuai Profil Pelajar Pancasila.
            </p>
          </div>

          {/* 4 Kartu Pilar Karakter: Dark Glassmorphism, 18-22px rounded, hover lift 4px */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val) => (
              <div
                key={val.id}
                className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] p-6 sm:p-7 border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#20D6A0]/50 hover:shadow-xl hover:shadow-[#00A887]/15 group"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-[#00A887]/20 border border-[rgba(32,214,160,0.30)] text-[#20D6A0] flex items-center justify-center mb-5 group-hover:bg-[#00A887] group-hover:text-white transition-all duration-300 shadow-sm">
                    {getIcon(val.icon)}
                  </div>
                  <h3 className="font-bold text-[#F5FAFC] text-lg mb-2 group-hover:text-[#20D6A0] transition-colors">
                    {val.title[language]}
                  </h3>
                  <p className="text-sm text-[#C0D5DF] leading-relaxed font-normal">
                    {val.desc[language]}
                  </p>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-[rgba(32,214,160,0.15)] mt-6">
                  <span className="text-xs font-bold text-[#20D6A0] uppercase tracking-wider">
                    Pilar Utama
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg text-[#20D6A0]/40 group-hover:text-[#FFBD24] transition-colors">
                      {val.code}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#20D6A0]/50 group-hover:text-[#20D6A0] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          4. PRINCIPAL WELCOME (Dark Teal Glass Card with Emerald Accents)
          ================================================== */}
      {principal && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#073440]/90 backdrop-blur-md rounded-[24px] p-8 sm:p-12 text-[#F5FAFC] shadow-2xl border border-[rgba(32,214,160,0.20)] overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Photo */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative">
                  <img
                    src={principal.photo}
                    alt={principal.name}
                    className="w-56 h-72 sm:w-64 sm:h-80 rounded-2xl object-cover object-top border-4 border-[#20D6A0]/30 shadow-2xl bg-[#062B3A]"
                  />
                  <div className="absolute -bottom-3 -right-2 bg-[#FFBD24] text-[#062B3A] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Kepala Sekolah
                  </div>
                </div>

                <div className="mt-7 text-center">
                  <h3 className="font-bold text-xl text-[#F5FAFC]">{principal.name}</h3>
                  <p className="text-xs text-[#20D6A0] font-medium mt-1">{principal.role[language]}</p>
                </div>
              </div>

              {/* Greeting Message */}
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-[rgba(32,214,160,0.30)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFBD24]" />
                  <span>Sambutan Resmi Kepala Sekolah</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#F5FAFC] leading-snug">
                  "{principal.quote?.[language] || 'Mewujudkan lingkungan belajar yang aman, ramah anak, dan memicu rasa ingin tahu untuk masa depan gemilang.'}"
                </h3>

                <p className="text-base text-[#C0D5DF] leading-relaxed font-normal">
                  {language === 'ID'
                    ? `${schoolInfo.name} berdedikasi menciptakan proses pembelajaran bermakna yang berpihak pada murid. Melalui implementasi Kurikulum Merdeka, kami mendorong perkembangan minat, bakat, karakter Profil Pelajar Pancasila, serta pembiasaan positif sejak dini.`
                    : `${schoolInfo.name} is dedicated to creating a meaningful, student-centered learning environment supporting character and academic excellence.`}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectTab('profil')}
                    className="btn-primary"
                  >
                    <span>Baca Profil Sekolah Selengkapnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          5. STATISTIK SEKOLAH (4 Metric Cards in Dark Glassmorphism)
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { val: getAccreditationShort(schoolInfo.accreditation), label: 'Akreditasi Sekolah', desc: 'BAN-S/M Unggul' },
            { val: schoolInfo.npsn, label: 'NPSN Resmi', desc: 'Kemendikbudristek' },
            { val: `${db.extracurriculars.length}+`, label: 'Ekstrakurikuler', desc: 'Bakat & Minat Siswa' },
            { val: '100%', label: 'Pendidikan Inklusif', desc: 'Ramah Anak' },
          ].map((stat, i) => (
            <div 
              key={i}
              className="bg-[#073440]/90 backdrop-blur-md rounded-2xl p-6 border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/50 text-center hover:border-[#20D6A0]/50 transition-all hover:-translate-y-1 group"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-[#20D6A0] tracking-tight group-hover:scale-105 transition-transform">
                {stat.val}
              </div>
              <div className="text-sm font-semibold text-[#F5FAFC] mt-2">
                {stat.label}
              </div>
              <div className="text-xs text-[#C0D5DF] mt-0.5 font-normal">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          6. BERITA & WARTA TERBARU
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-1.5">
            <span className="section-badge">Warta Sekolah</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FAFC]">Kabar & Prestasi Terbaru</h2>
          </div>
          
          <button
            onClick={() => onSelectTab('berita')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#20D6A0] hover:text-[#FFBD24] transition-colors"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsArticles.slice(0, 3).map((news) => (
            <article
              key={news.id}
              onClick={() => onSelectTab('berita')}
              className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 overflow-hidden cursor-pointer flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:border-[#20D6A0]/50"
            >
              <div className="relative h-52 overflow-hidden bg-[#083D49]">
                <img
                  src={news.image}
                  alt={news.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#00A887] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow">
                  {news.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#C0D5DF]">
                    <Calendar className="w-3.5 h-3.5 text-[#20D6A0]" />
                    <span>{news.date}</span>
                  </div>
                  <h3 className="font-bold text-[#F5FAFC] text-base leading-snug group-hover:text-[#20D6A0] transition-colors line-clamp-2">
                    {news.title[language]}
                  </h3>
                  <p className="text-xs text-[#C0D5DF] line-clamp-3 leading-relaxed">
                    {news.summary[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(32,214,160,0.15)] flex items-center justify-between text-xs font-semibold text-[#20D6A0]">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================================================
          7. CTA SECTION (Campus Exploration)
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-[rgba(32,214,160,0.25)] relative overflow-hidden">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="inline-block bg-[#00A887]/20 text-[#20D6A0] text-xs font-semibold px-4 py-1 rounded-full border border-[#20D6A0]/30 uppercase tracking-wider">
              Lingkungan Pendidikan Ramah Anak
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F5FAFC] tracking-tight leading-snug">
              Jelajahi Potensi & Prestasi Bersama SDN SUMBEREJO 04
            </h3>
            <p className="text-sm text-[#C0D5DF] leading-relaxed font-normal">
              Fasilitas penunjang belajar lengkap, ruang kelas asri, dan guru-guru berdedikasi siap mendampingi tumbuh kembang putra-putri Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => onSelectTab('galeri')}
              className="btn-primary"
            >
              <span>Lihat Galeri Sekolah</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('akademik')}
              className="btn-secondary"
            >
              <span>Program Akademik</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
