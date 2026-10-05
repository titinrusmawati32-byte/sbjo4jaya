import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import {
  History as HistoryIcon,
  Target,
  Compass,
  Music,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

interface ProfilViewProps {
  language: Language;
}

export const ProfilView: React.FC<ProfilViewProps> = ({ language }) => {
  const [db, setDb] = useState(getDatabase());

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;
  const visionText = schoolInfo.vision ? schoolInfo.vision[language] : '';
  const missionList = schoolInfo.mission || [];

  return (
    <div className="space-y-16 md:space-y-20 py-8 bg-[#062B3A] text-[#F5FAFC] min-h-screen">
      
      {/* 1. Page Header (Deep Teal #083D49 with Gold & Emerald Accent) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] shadow-2xl relative overflow-hidden border border-[rgba(32,214,160,0.25)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[rgba(32,214,160,0.30)]">
              <HistoryIcon className="w-3.5 h-3.5 text-[#FFBD24]" />
              <span>Identitas & Profil Institusi</span>
            </div>
            
            <h1 className="text-[#F5FAFC] font-extrabold tracking-tight text-3xl sm:text-5xl leading-tight">
              Profil {schoolInfo.name}
            </h1>
            
            <p className="text-base sm:text-lg text-[#C0D5DF] leading-relaxed font-normal">
              Membangun fondasi masa depan generasi bangsa dengan pendidikan berkarakter, kurikulum merdeka, dan lingkungan belajar ramah anak.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Selayang Pandang & Sejarah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="section-badge">Selayang Pandang</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#F5FAFC]">
                Mendidik dengan Hati, <span className="text-[#20D6A0]">Meraih Prestasi</span>
              </h2>
            </div>
            
            <div className="space-y-4 text-sm sm:text-base text-[#C0D5DF] leading-relaxed">
              <p>
                <strong className="text-[#F5FAFC] font-semibold">{schoolInfo.name}</strong> adalah lembaga pendidikan dasar negeri yang berkomitmen memberikan layanan pendidikan komprehensif, inklusif, dan bermutu tinggi bagi setiap anak didik.
              </p>
              <p>
                {schoolInfo.history?.[language] ||
                  `Berdiri sejak tahun ${schoolInfo.established || '1985'}, sekolah ini terus berinovasi mengikuti perkembangan zaman melalui implementasi Kurikulum Merdeka yang menumbuhkembangkan potensi minat, bakat, serta Profil Pelajar Pancasila.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#073440]/90 backdrop-blur-md p-5 rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60">
                <span className="text-xs text-[#C0D5DF] block font-medium">Nomor Pokok Sekolah Nasional</span>
                <span className="text-xl sm:text-2xl font-bold text-[#20D6A0] tracking-tight mt-1 block">
                  {schoolInfo.npsn}
                </span>
              </div>
              <div className="bg-[#073440]/90 backdrop-blur-md p-5 rounded-2xl border border-[rgba(32,214,160,0.20)] shadow-lg shadow-[#062B3A]/60">
                <span className="text-xs text-[#C0D5DF] block font-medium">Status Akreditasi</span>
                <span className="text-xl sm:text-2xl font-bold text-[#20D6A0] tracking-tight mt-1 block">
                  {schoolInfo.accreditation.toLowerCase().includes('a') ? 'Terakreditasi A (Unggul)' : schoolInfo.accreditation}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[rgba(32,214,160,0.25)]">
              <img
                src={schoolInfo.structureImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80"}
                alt="Lingkungan SDN SUMBEREJO 04"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFBD24]">
                    Kampus Ramah Anak
                  </span>
                  <p className="text-[#F5FAFC] text-sm font-semibold mt-0.5">
                    Suasana pembelajaran nyaman, asri, aman, dan memicu rasa ingin tahu siswa.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Visi & Misi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Visi */}
          <div className="bg-[#073440]/90 backdrop-blur-md rounded-[22px] p-8 sm:p-10 border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00A887]/20 border border-[rgba(32,214,160,0.30)] text-[#20D6A0] flex items-center justify-center">
                <Target className="w-6 h-6 text-[#20D6A0]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#20D6A0]">Visi Sekolah</span>
                <h3 className="text-xl font-bold text-[#F5FAFC] mt-1">Cita-Cita & Arah Pendidikan</h3>
              </div>
              <blockquote className="text-lg sm:text-xl font-semibold text-[#20D6A0] leading-relaxed pt-2 border-l-4 border-[#20D6A0] pl-4">
                "{visionText || 'Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Terampil, Mandiri, dan Berwawasan Lingkungan.'}"
              </blockquote>
            </div>
            
            <p className="text-xs text-[#C0D5DF]">
              Visi ini menjadi kompas seluruh warga sekolah dalam menjalankan proses pembelajaran setiap hari.
            </p>
          </div>

          {/* Card Misi */}
          <div className="bg-[#083D49] rounded-[22px] p-8 sm:p-10 text-[#F5FAFC] shadow-xl border border-[rgba(32,214,160,0.25)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00A887] flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6 text-[#FFBD24]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#20D6A0]">Misi Strategis</span>
                <h3 className="text-xl font-bold text-[#F5FAFC] mt-0.5">Langkah & Komitmen Nyata</h3>
              </div>
            </div>

            <ul className="space-y-3.5">
              {missionList.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00A887] text-[#062B3A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-[#C0D5DF] leading-relaxed font-normal">
                    {m[language]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 4. Mars / Hymne Sekolah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073440]/90 backdrop-blur-md rounded-[22px] p-8 sm:p-12 border border-[rgba(32,214,160,0.20)] shadow-2xl text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#00A887]/20 border border-[rgba(32,214,160,0.30)] text-[#20D6A0] flex items-center justify-center mx-auto">
            <Music className="w-7 h-7 text-[#FFBD24]" />
          </div>

          <div>
            <span className="section-badge">Himne Identitas</span>
            <h3 className="text-2xl font-bold text-[#F5FAFC] mt-2">Mars SDN SUMBEREJO 04</h3>
          </div>

          <div className="bg-[#062B3A]/80 rounded-xl p-6 sm:p-8 text-base sm:text-lg text-[#F5FAFC] italic whitespace-pre-line leading-relaxed border border-[rgba(32,214,160,0.15)] font-medium">
            {language === 'ID' 
              ? 'Derap langkah nan tegas dan pasti\nMenuju masa depan gemilang\nSDN SUMBEREJO 04 kebanggaan kami\nTempat menimba ilmu nan cemerlang...'
              : 'With firm and confident steps\nTowards a glorious future\nSDN SUMBEREJO 04 our pride\nA place to gain brilliant knowledge...'}
          </div>

          <span className="text-xs text-[#C0D5DF] block">
            Dinyanyikan dengan khidmat pada upacara bendera dan kegiatan resmi sekolah.
          </span>
        </div>
      </section>

    </div>
  );
};
