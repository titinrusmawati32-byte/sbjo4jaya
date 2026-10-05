import React, { useState, useEffect } from 'react';
import { NavTab, Language, SchoolInfo } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  HeartHandshake,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Clock,
  ShieldCheck,
  Database,
  Lock,
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavTab, subTab?: string) => void;
  language: Language;
  onOpenPPDB: () => void;
  onOpenSIAP: () => void;
  onOpenDatabase?: (tab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  language,
  onOpenPPDB,
}) => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(getDatabase().schoolInfo);

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setSchoolInfo(getDatabase().schoolInfo);
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-[#062B3A] text-[#F5FAFC] relative overflow-hidden border-t border-[rgba(32,214,160,0.20)] font-sans">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A887] via-[#FFBD24] to-[#20D6A0]" />
      
      {/* Upper callout strip: Deep Teal #083D49 */}
      <div className="border-b border-[rgba(32,214,160,0.20)] py-10 px-4 sm:px-6 lg:px-8 bg-[#083D49]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F5FAFC] flex items-center justify-center md:justify-start gap-3">
              <HeartHandshake className="w-7 h-7 text-[#FFBD24] shrink-0" />
              <span>
                {language === 'ID'
                  ? 'Mencetak Generasi Unggul & Berkarakter'
                  : 'Cultivating Excellent & Character-Driven Youth'}
              </span>
            </h3>
            <p className="text-sm text-[#C0D5DF] font-normal max-w-xl">
              {language === 'ID'
                ? 'Bergabunglah bersama kami dalam mewujudkan masa depan cerah bagi putra-putri bangsa di SDN SUMBEREJO 04.'
                : 'Join us in building a bright future for our children at SDN SUMBEREJO 04.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onOpenPPDB}
              className="btn-primary"
            >
              <span>{language === 'ID' ? 'Daftar PPDB Online' : 'Admissions Info'}</span>
            </button>
            <button
              onClick={() => {
                onSelectTab('kontak');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-secondary"
            >
              <Phone className="w-4 h-4 text-[#FFBD24]" />
              <span>{language === 'ID' ? 'Hubungi Sekolah' : 'Contact Us'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Column 1: School Identity */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#00A887] flex items-center justify-center text-white shadow-md border border-[#20D6A0]/30">
                  <GraduationCap className="w-6 h-6 text-[#FFBD24]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#20D6A0] block">
                    SEKOLAH DASAR NEGERI
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-[#F5FAFC] leading-tight">
                    SUMBEREJO 04
                  </h4>
                </div>
              </div>
              <p className="text-xs text-[#C0D5DF] leading-relaxed font-normal italic border-l-2 border-[#FFBD24] pl-3 py-1">
                "{schoolInfo.motto[language]}"
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: Facebook, href: schoolInfo.social?.facebook, color: 'hover:bg-[#1877F2]' },
                { icon: Instagram, href: schoolInfo.social?.instagram, color: 'hover:bg-[#E4405F]' },
                { icon: Youtube, href: schoolInfo.social?.youtube, color: 'hover:bg-[#FF0000]' },
                { icon: MessageCircle, href: schoolInfo.social?.whatsapp, color: 'hover:bg-[#25D366]' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-xl bg-[#073440] text-[#C0D5DF] flex items-center justify-center transition-all border border-[rgba(32,214,160,0.20)] ${social.color} hover:text-white hover:-translate-y-0.5`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#FFBD24]">
              {language === 'ID' ? 'Navigasi Cepat' : 'Quick Links'}
            </h5>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { id: 'beranda', label: 'Beranda' },
                { id: 'profil', label: 'Profil Sekolah' },
                { id: 'sdm', label: 'Guru & Tenaga Pendidik' },
                { id: 'akademik', label: 'Akademik & Ekskul' },
                { id: 'galeri', label: 'Galeri Foto & Video' },
                { id: 'berita', label: 'Warta & Prestasi' },
                { id: 'kontak', label: 'Kontak & Lokasi' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onSelectTab(link.id as NavTab)}
                    className="text-[#C0D5DF] hover:text-[#20D6A0] transition-colors flex items-center gap-2 group text-left text-xs sm:text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A887] opacity-60 group-hover:opacity-100 group-hover:bg-[#20D6A0] transition-all" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Jam Operasional */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#FFBD24]">
              {language === 'ID' ? 'Waktu Pembelajaran' : 'School Hours'}
            </h5>
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-[#20D6A0] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#F5FAFC]">Senin – Jumat</div>
                  <div className="text-[#C0D5DF] text-xs">07.00 – 15.00 WIB</div>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-4 h-4 text-[#20D6A0] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#F5FAFC]">Sabtu (Ekstrakurikuler)</div>
                  <div className="text-[#C0D5DF] text-xs">07.30 – 12.00 WIB</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Database className="w-4 h-4 text-[#20D6A0] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#F5FAFC]">Sistem Terintegrasi</div>
                  <div className="text-[#C0D5DF] text-xs">Cloud Database Real-time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#FFBD24]">
              {language === 'ID' ? 'Sekretariat Sekolah' : 'Contact Office'}
            </h5>
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#20D6A0] shrink-0 mt-0.5" />
                <span className="text-[#C0D5DF] leading-relaxed font-normal">
                  {schoolInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#20D6A0] shrink-0" />
                <a href={`tel:${schoolInfo.phone}`} className="text-[#C0D5DF] hover:text-[#20D6A0] transition-colors">
                  {schoolInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#20D6A0] shrink-0" />
                <a href={`mailto:${schoolInfo.email}`} className="text-[#C0D5DF] hover:text-[#20D6A0] transition-colors">
                  {schoolInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[rgba(32,214,160,0.20)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#C0D5DF]/70 text-center sm:text-left font-normal">
            © {new Date().getFullYear()} {schoolInfo.name}. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <a
            href="/admin/login"
            className="group flex items-center gap-2.5 px-4 py-2 bg-[#073440] hover:bg-[#083D49] rounded-full border border-[rgba(32,214,160,0.20)] transition-all text-xs font-medium text-[#C0D5DF] hover:text-[#F5FAFC]"
          >
            <Lock className="w-3.5 h-3.5 text-[#FFBD24] group-hover:rotate-12 transition-transform" />
            <span>{language === 'ID' ? 'Akses Admin CMS' : 'Admin Login'}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
