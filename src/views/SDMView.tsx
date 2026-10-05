import React, { useState, useEffect } from 'react';
import { Language, TeacherItem } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { Users, Search, GraduationCap, Quote, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SDMViewProps {
  language: Language;
}

export const SDMView: React.FC<SDMViewProps> = ({ language }) => {
  const [db, setDb] = useState(getDatabase());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;
  const teachers = db.teachers;

  const filterCategories = [
    { id: 'all', labelID: 'Semua SDM', labelEN: 'All Staff' },
    { id: 'pimpinan', labelID: 'Pimpinan', labelEN: 'Leadership' },
    { id: 'guru_kelas', labelID: 'Guru Kelas', labelEN: 'Homeroom' },
    { id: 'guru_bidang', labelID: 'Guru Bidang', labelEN: 'Specialists' },
    { id: 'staf', labelID: 'Tenaga Kependidikan', labelEN: 'Admin Staff' },
  ];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchCat =
      selectedCategory === 'all' || teacher.category === selectedCategory;
    const matchSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.role[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.subject && teacher.subject[language].toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-12 py-8 bg-[#062B3A] text-[#F5FAFC] min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] shadow-2xl relative overflow-hidden border border-[rgba(32,214,160,0.25)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[rgba(32,214,160,0.30)]">
              <Users className="w-3.5 h-3.5 text-[#FFBD24]" />
              <span>Pendidik & Tenaga Kependidikan</span>
            </div>
            <h1 className="text-[#F5FAFC] font-extrabold tracking-tight text-3xl sm:text-5xl leading-tight">
              Sumber Daya Manusia
            </h1>
            <p className="text-base sm:text-lg text-[#C0D5DF] leading-relaxed font-normal">
              Para pendidik berpengalaman, berdedikasi tinggi, dan bersertifikasi yang siap membimbing dan menginspirasi siswa SDN SUMBEREJO 04.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073440]/90 backdrop-blur-md p-5 rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  showToast(language === 'ID' ? `Filter: ${cat.labelID}` : `Filter: ${cat.labelEN}`, 'info');
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00A887] text-white shadow-md shadow-[#00A887]/30'
                    : 'bg-[#062B3A]/80 text-[#C0D5DF] hover:text-[#20D6A0] hover:bg-[#083D49] border border-[rgba(32,214,160,0.15)]'
                }`}
              >
                {language === 'ID' ? cat.labelID : cat.labelEN}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#20D6A0] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ID' ? 'Cari nama atau mapel...' : 'Search staff...'}
              className="w-full text-xs bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] text-[#F5FAFC] placeholder-[#C0D5DF]/60"
            />
          </div>
        </div>
      </section>

      {/* 3. Teachers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-16 bg-[#073440]/80 rounded-2xl border border-dashed border-[rgba(32,214,160,0.25)]">
            <Users className="w-12 h-12 text-[#20D6A0]/40 mx-auto mb-3" />
            <h3 className="font-bold text-[#F5FAFC] text-lg">
              SDM Tidak Ditemukan
            </h3>
            <p className="text-xs text-[#C0D5DF] mt-1">
              Sesuaikan kata kunci pencarian Anda untuk melihat staf lainnya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-[#073440]/90 backdrop-blur-md rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60 overflow-hidden flex flex-col group hover:-translate-y-1 hover:border-[#20D6A0]/50 transition-all duration-300"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden bg-[#083D49]">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {teacher.category === 'pimpinan' && (
                      <span className="bg-[#FFBD24] text-[#062B3A] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        Pimpinan
                      </span>
                    )}
                    {teacher.grade && (
                      <span className="bg-[#00A887] text-white font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                        Kelas {teacher.grade}
                      </span>
                    )}
                    {teacher.subject && (
                      <span className="bg-[#062B3A]/90 text-[#20D6A0] border border-[rgba(32,214,160,0.25)] font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow">
                        {teacher.subject[language]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#F5FAFC] text-lg leading-tight group-hover:text-[#20D6A0] transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#20D6A0]">
                      {teacher.role[language]}
                    </p>
                    {teacher.nip && teacher.nip !== '-' && (
                      <p className="text-[11px] text-[#C0D5DF] mt-1 font-mono">
                        NIP: {teacher.nip}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-[#C0D5DF] border-t border-[rgba(32,214,160,0.15)] pt-3">
                    <GraduationCap className="w-4 h-4 text-[#20D6A0]" />
                    <span className="truncate">{teacher.education}</span>
                  </div>

                  {teacher.quote && (
                    <div className="bg-[#062B3A]/80 p-3 rounded-xl border border-[rgba(32,214,160,0.15)] text-xs italic text-[#C0D5DF] leading-relaxed">
                      "{teacher.quote[language]}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
