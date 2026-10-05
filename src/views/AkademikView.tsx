import React, { useState, useEffect } from 'react';
import { Language, SchoolEventItem } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { useToast } from '../context/ToastContext';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Users
} from 'lucide-react';

interface AkademikViewProps {
  language: Language;
  onOpenDatabase?: (tab?: string) => void;
  initialSubTab?: 'kurikulum' | 'kalender' | 'fasilitas' | 'ekskul';
}

export const AkademikView: React.FC<AkademikViewProps> = ({ 
  language, 
  initialSubTab = 'kurikulum' 
}) => {
  const [db, setDb] = useState(getDatabase());
  const [activeTab, setActiveTab] = useState<'kurikulum' | 'kalender' | 'fasilitas' | 'ekskul'>(initialSubTab);
  
  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [facilityFilter, setFacilityFilter] = useState<string>('All');
  const [ekskulFilter, setEkskulFilter] = useState<string>('All');
  const { showToast } = useToast();

  // State for Kalender Kegiatan
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;
  const facilities = db.facilities;
  const extracurriculars = db.extracurriculars;

  const facilityCategories = ['All', 'Akademik', 'Seni & Olahraga', 'Sains & Tekno', 'Umum'];
  const ekskulCategories = ['All', 'Seni', 'Olahraga', 'Akademik & Sains', 'Kepemimpinan'];

  const filteredFacilities = facilities.filter(
    (item) => facilityFilter === 'All' || item.category === facilityFilter
  );

  const filteredEkskuls = extracurriculars.filter(
    (item) => ekskulFilter === 'All' || item.category === ekskulFilter
  );

  const schoolEvents: SchoolEventItem[] = db.schoolEvents || [];

  const monthNamesID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const filteredEvents = schoolEvents.filter((ev) => {
    const evDate = new Date(ev.dateStart);
    const matchesMonth = evDate.getMonth() === selectedMonth && evDate.getFullYear() === selectedYear;
    const matchesCat = eventCategoryFilter === 'All' || ev.category === eventCategoryFilter;
    return matchesMonth && matchesCat;
  });

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();

  return (
    <div className="space-y-12 py-8 bg-[#062B3A] text-[#F5FAFC] min-h-screen">
      
      {/* 1. Header Banner (Navy/Teal with Gold Accent) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] shadow-2xl relative overflow-hidden border border-[rgba(32,214,160,0.25)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[rgba(32,214,160,0.30)]">
              <BookOpen className="w-3.5 h-3.5 text-[#FFBD24]" />
              <span>Ekosistem Pembelajaran & Kesiswaan</span>
            </div>
            <h1 className="text-[#F5FAFC] font-extrabold tracking-tight text-3xl sm:text-5xl leading-tight">
              Akademik & Kesiswaan
            </h1>
            <p className="text-base sm:text-lg text-[#C0D5DF] leading-relaxed font-normal">
              Implementasi Kurikulum Merdeka yang inovatif, berpusat pada minat dan bakat murid, serta pembiasaan karakter positif setiap hari.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Navigation Sub-Tabs (Dark Glassmorphism Pills) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073440]/90 backdrop-blur-md p-2 rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 flex flex-wrap sm:flex-nowrap gap-2">
          {[
            { id: 'kurikulum', label: language === 'ID' ? 'Kurikulum & Jadwal' : 'Curriculum', icon: BookOpen },
            { id: 'kalender', label: language === 'ID' ? 'Kalender Pendidikan' : 'Calendar', icon: CalendarIcon },
            { id: 'fasilitas', label: language === 'ID' ? 'Fasilitas Belajar' : 'Facilities', icon: MapPin },
            { id: 'ekskul', label: language === 'ID' ? 'Ekstrakurikuler' : 'Extracurriculars', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                showToast(language === 'ID' ? `Menu: ${tab.label}` : `Menu: ${tab.label}`, 'info');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#00A887] text-white shadow-md shadow-[#00A887]/30'
                  : 'text-[#C0D5DF] hover:text-[#20D6A0] hover:bg-[#083D49]'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0 text-[#FFBD24]" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* TAB 1: KURIKULUM & JADWAL */}
      {activeTab === 'kurikulum' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="section-badge">Kurikulum Merdeka</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FAFC]">
                  Pembelajaran Bermakna & <span className="text-[#20D6A0]">Berpusat Pada Murid</span>
                </h2>
              </div>
              
              <p className="text-sm sm:text-base text-[#C0D5DF] leading-relaxed font-normal">
                {schoolInfo.name} menerapkan Kurikulum Merdeka secara menyeluruh, menggabungkan pembelajaran intrakurikuler berdiferensiasi dengan Projek Penguatan Profil Pelajar Pancasila (P5).
              </p>

              <div className="grid gap-3.5">
                {[
                  { title: 'Pembelajaran Berbasis Minat & Bakat', desc: 'Siswa dibimbing untuk mengenali keunikan potensi diri dan berkembang sesuai ritme belajarnya.' },
                  { title: 'Projek Penguatan Karakter (P5)', desc: 'Kegiatan tematik kontekstual yang mengasah kepedulian lingkungan, gotong royong, dan kemandirian.' },
                  { title: 'Literasi & Numerasi Dini', desc: 'Pembiasaan membaca 15 menit setiap pagi sebelum KBM untuk memupuk kecintaan terhadap ilmu pengetahuan.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-[#073440]/90 backdrop-blur-md rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60">
                    <div className="w-9 h-9 rounded-xl bg-[#00A887]/20 border border-[rgba(32,214,160,0.30)] text-[#20D6A0] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-[#20D6A0]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#F5FAFC] text-sm">{item.title}</h4>
                      <p className="text-xs text-[#C0D5DF] mt-1 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Schedule Card */}
            <div className="lg:col-span-5 bg-[#083D49] p-8 sm:p-10 rounded-[22px] text-[#F5FAFC] shadow-2xl space-y-6 border border-[rgba(32,214,160,0.25)]">
              <div className="flex items-center gap-3 pb-5 border-b border-[rgba(32,214,160,0.20)]">
                <div className="w-10 h-10 rounded-xl bg-[#00A887] flex items-center justify-center text-white shadow-md">
                  <Clock className="w-5 h-5 text-[#FFBD24]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#F5FAFC]">Jadwal Pembelajaran</h3>
                  <p className="text-xs text-[#20D6A0]">Senin – Sabtu (WIB)</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { time: '06.45 - 07.00', title: 'Kedatangan Murid & Sambut Pagi' },
                  { time: '07.00 - 07.15', title: 'Pembiasaan (Literasi / Doa Bersama)' },
                  { time: '07.15 - 09.15', title: 'Sesi Pembelajaran Inti I' },
                  { time: '09.15 - 09.45', title: 'Istirahat & Kudapan Sehat' },
                  { time: '09.45 - 12.00', title: 'Sesi Pembelajaran Inti II' },
                  { time: '12.00 - 12.30', title: 'Sholat Berjamaah / Refleksi Harian' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[rgba(32,214,160,0.10)] last:border-b-0">
                    <span className="font-semibold text-[#FFBD24] font-mono">{row.time}</span>
                    <span className="text-right text-[#C0D5DF] font-medium">{row.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* TAB 2: KALENDER PENDIDIKAN */}
      {activeTab === 'kalender' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#073440]/90 backdrop-blur-md p-6 sm:p-8 rounded-[22px] border border-[rgba(32,214,160,0.20)] shadow-2xl shadow-[#062B3A]/80 space-y-6">
            
            {/* Month Selector Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[rgba(32,214,160,0.20)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                  className="p-2 rounded-xl bg-[#062B3A] hover:bg-[#083D49] text-[#20D6A0] border border-[rgba(32,214,160,0.20)] transition-colors"
                  aria-label="Bulan sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h3 className="font-bold text-lg text-[#F5FAFC] min-w-[180px] text-center">
                  {monthNamesID[selectedMonth]} {selectedYear}
                </h3>

                <button
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                  className="p-2 rounded-xl bg-[#062B3A] hover:bg-[#083D49] text-[#20D6A0] border border-[rgba(32,214,160,0.20)] transition-colors"
                  aria-label="Bulan berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Event Category Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'kegiatan', 'ujian', 'libur', 'ppdb'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEventCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      eventCategoryFilter === cat
                        ? 'bg-[#00A887] text-white shadow-sm'
                        : 'bg-[#062B3A] text-[#C0D5DF] hover:text-[#20D6A0] border border-[rgba(32,214,160,0.15)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Day Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                <div key={i} className="font-bold text-[#20D6A0] py-2 uppercase tracking-wider">
                  {d}
                </div>
              ))}

              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 rounded-xl bg-[#062B3A]/40" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasEvent = filteredEvents.some((ev) => {
                  const d = new Date(ev.dateStart).getDate();
                  return d === day;
                });

                return (
                  <div
                    key={`day-${day}`}
                    className={`h-16 rounded-xl p-2 flex flex-col justify-between transition-colors border ${
                      hasEvent
                        ? 'bg-[#00A887]/20 border-[#20D6A0] text-[#20D6A0] font-bold shadow-inner'
                        : 'bg-[#062B3A]/70 border-[rgba(32,214,160,0.15)] text-[#F5FAFC]'
                    }`}
                  >
                    <span className="text-left text-xs font-semibold">{day}</span>
                    {hasEvent && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD24] self-end mb-1 shadow-sm" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Events List for Selected Month */}
            <div className="pt-6 border-t border-[rgba(32,214,160,0.20)] space-y-3">
              <h4 className="font-bold text-sm text-[#F5FAFC] uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#FFBD24]" />
                <span>Agenda Kegiatan Bulan Ini ({filteredEvents.length})</span>
              </h4>
              
              {filteredEvents.length === 0 ? (
                <p className="text-xs text-[#C0D5DF]">Tidak ada agenda khusus pada bulan ini.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredEvents.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-xl bg-[#062B3A]/80 border border-[rgba(32,214,160,0.20)] flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00A887] text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        <span>{new Date(ev.dateStart).getDate()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#20D6A0] block">
                          {ev.category}
                        </span>
                        <h5 className="font-bold text-sm text-[#F5FAFC] leading-snug">{ev.title[language]}</h5>
                        <p className="text-xs text-[#C0D5DF] mt-0.5">{ev.description?.[language]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* TAB 3: FASILITAS */}
      {activeTab === 'fasilitas' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            {facilityCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFacilityFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  facilityFilter === cat
                    ? 'bg-[#00A887] text-white shadow-md shadow-[#00A887]/30'
                    : 'bg-[#073440]/90 text-[#C0D5DF] hover:text-[#20D6A0] border border-[rgba(32,214,160,0.20)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((item) => (
              <div key={item.id} className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 overflow-hidden flex flex-col group hover:-translate-y-1 hover:border-[#20D6A0]/50 transition-all duration-300">
                <div className="relative h-52 overflow-hidden bg-[#083D49]">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#062B3A]/90 text-[#20D6A0] border border-[rgba(32,214,160,0.25)] text-[10px] font-bold px-3 py-1 rounded-full shadow">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-[#F5FAFC] text-lg leading-snug group-hover:text-[#20D6A0] transition-colors">
                      {item.name[language]}
                    </h3>
                    <p className="text-xs text-[#C0D5DF] mt-1.5 leading-relaxed font-normal">
                      {item.description[language]}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[rgba(32,214,160,0.15)]">
                    {item.features?.map((f, i) => (
                      <span key={i} className="text-[11px] font-medium bg-[#062B3A] text-[#20D6A0] border border-[rgba(32,214,160,0.20)] px-2.5 py-1 rounded-md">
                        ✓ {f[language]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: EKSTRAKURIKULER */}
      {activeTab === 'ekskul' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            {ekskulCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setEkskulFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  ekskulFilter === cat
                    ? 'bg-[#00A887] text-white shadow-md shadow-[#00A887]/30'
                    : 'bg-[#073440]/90 text-[#C0D5DF] hover:text-[#20D6A0] border border-[rgba(32,214,160,0.20)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEkskuls.map((ekskul) => (
              <div key={ekskul.id} className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 overflow-hidden flex flex-col group hover:-translate-y-1 hover:border-[#20D6A0]/50 transition-all duration-300">
                <div className="relative h-52 overflow-hidden bg-[#083D49]">
                  <img
                    src={ekskul.image}
                    alt={ekskul.name[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#00A887] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                    {ekskul.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-[#F5FAFC] text-lg leading-snug group-hover:text-[#20D6A0] transition-colors">
                      {ekskul.name[language]}
                    </h3>
                    <p className="text-xs text-[#C0D5DF] mt-1.5 leading-relaxed font-normal">
                      {ekskul.description[language]}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-[rgba(32,214,160,0.15)] text-xs text-[#C0D5DF]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FFBD24]" />
                      <span>{ekskul.schedule[language]}</span>
                    </div>
                    {ekskul.coach && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#20D6A0]" />
                        <span>Pelatih: {ekskul.coach}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
