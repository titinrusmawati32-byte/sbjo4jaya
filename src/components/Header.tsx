import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, Language, SchoolInfo } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { TopBar } from './TopBar';
import { 
  Menu, 
  X, 
  GraduationCap, 
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  School,
  Target,
  Users,
  Award,
  History,
  MapPin,
  UserCheck,
  Briefcase,
  Fingerprint,
  BookOpen,
  Bell,
  Phone,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab, subTab?: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenPPDB: () => void;
  onOpenSIAP?: () => void;
  onOpenDatabase?: (tab?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  theme = 'light',
  onToggleTheme,
  onOpenPPDB,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(getDatabase().schoolInfo);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setSchoolInfo(getDatabase().schoolInfo);
    });
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTabClick = (tab: NavTab, subTab?: string) => {
    onSelectTab(tab, subTab);
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = (menuId: string) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuId);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const navItems: { id: NavTab; label: { ID: string; EN: string }; hasMega?: boolean }[] = [
    { id: 'beranda', label: { ID: 'Beranda', EN: 'Home' } },
    { id: 'profil', label: { ID: 'Profil', EN: 'Profile' }, hasMega: true },
    { id: 'sdm', label: { ID: 'SDM', EN: 'Faculty' }, hasMega: true },
    { id: 'akademik', label: { ID: 'Akademik', EN: 'Academic' }, hasMega: true },
    { id: 'galeri', label: { ID: 'Galeri', EN: 'Gallery' } },
    { id: 'berita', label: { ID: 'Berita', EN: 'News' } },
    { id: 'kontak', label: { ID: 'Kontak', EN: 'Contact' } },
  ];

  const megaMenuContent = {
    profil: {
      items: [
        { id: 'tentang', label: { ID: 'Tentang Sekolah', EN: 'About School' }, icon: School, tab: 'profil' },
        { id: 'visi-misi', label: { ID: 'Visi & Misi', EN: 'Vision & Mission' }, icon: Target, tab: 'profil' },
        { id: 'struktur', label: { ID: 'Struktur Organisasi', EN: 'Organization' }, icon: Users, tab: 'profil' },
        { id: 'prestasi', label: { ID: 'Prestasi Sekolah', EN: 'Achievements' }, icon: Award, tab: 'berita' },
        { id: 'sejarah', label: { ID: 'Sejarah Singkat', EN: 'History' }, icon: History, tab: 'profil' },
        { id: 'lokasi', label: { ID: 'Lokasi & Peta', EN: 'Location' }, icon: MapPin, tab: 'kontak' },
      ]
    },
    sdm: {
      items: [
        { id: 'guru', label: { ID: 'Tenaga Pendidik (Guru)', EN: 'Teachers' }, desc: { ID: 'Daftar guru kelas & bidang studi', EN: 'Faculty members' }, icon: UserCheck, tab: 'sdm' },
        { id: 'staf', label: { ID: 'Tenaga Kependidikan (Staf)', EN: 'Staff' }, desc: { ID: 'Administrasi & staf penunjang', EN: 'Administrative team' }, icon: Briefcase, tab: 'sdm' },
        { id: 'profil-sdm', label: { ID: 'Struktur SDM Terpadu', EN: 'Faculty Profile' }, desc: { ID: 'Informasi kompetensi SDM', EN: 'Faculty overview' }, icon: Fingerprint, tab: 'sdm' },
      ]
    },
    akademik: {
      sections: [
        {
          title: { ID: 'PEMBELAJARAN', EN: 'LEARNING' },
          items: [
            { id: 'kurikulum', label: { ID: 'Kurikulum Merdeka', EN: 'Curriculum' }, tab: 'akademik', subTab: 'kurikulum' },
            { id: 'mapel', label: { ID: 'Program P5 & Karakter', EN: 'P5 & Character' }, tab: 'akademik', subTab: 'kurikulum' },
            { id: 'program', label: { ID: 'Program Unggulan', EN: 'Flagship Programs' }, tab: 'akademik', subTab: 'kurikulum' },
          ]
        },
        {
          title: { ID: 'INFORMASI AKADEMIK', EN: 'ACADEMIC INFO' },
          items: [
            { id: 'kalender', label: { ID: 'Kalender Pendidikan', EN: 'Academic Calendar' }, tab: 'akademik', subTab: 'kalender' },
            { id: 'fasilitas', label: { ID: 'Fasilitas Belajar', EN: 'Learning Facilities' }, tab: 'akademik', subTab: 'fasilitas' },
            { id: 'pengumuman', label: { ID: 'Agenda & Pengumuman', EN: 'Announcements' }, tab: 'berita' },
          ]
        },
        {
          title: { ID: 'PENGEMBANGAN DIRI', EN: 'SELF DEVELOPMENT' },
          items: [
            { id: 'ekskul', label: { ID: 'Ekstrakurikuler Wajib & Pilihan', EN: 'Extracurriculars' }, tab: 'akademik', subTab: 'ekskul' },
            { id: 'olimpiade', label: { ID: 'Bimbingan Olimpiade MIPA', EN: 'Olympiad Club' }, tab: 'akademik', subTab: 'ekskul' },
            { id: 'prestasi-ak', label: { ID: 'Prestasi Siswa', EN: 'Student Awards' }, tab: 'berita' },
          ]
        }
      ]
    }
  };

  return (
    <>
      <TopBar schoolInfo={schoolInfo} language={language} />
      
      {/* Redesigned Clean Navbar: Background Deep Navy Teal #062B3A, Height 76px */}
      <header 
        ref={headerRef}
        className={`sticky top-0 z-50 w-full bg-[#062B3A]/95 backdrop-blur-md text-[#F5FAFC] border-b border-[rgba(32,214,160,0.20)] transition-all duration-300 ${
          scrolled ? 'shadow-2xl h-[72px]' : 'h-[78px]'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            
            {/* 1. BRAND ZONE: Logo + Nama Sekolah (24-28px, Poppins Bold) */}
            <button
              onClick={() => handleTabClick('beranda')}
              className="flex items-center gap-3.5 text-left group shrink-0 focus:outline-none"
            >
              <div className="relative shrink-0">
                {schoolInfo.logoUrl ? (
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ring-[#00A887]/40 shadow-md group-hover:ring-[#20D6A0] transition-all"
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#00A887] flex items-center justify-center text-white ring-2 ring-white/10 shadow-md group-hover:bg-[#20D6A0] transition-colors">
                    <GraduationCap className="w-6 h-6 text-[#FFBD24]" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <span className="text-[#F5FAFC] font-bold text-[20px] sm:text-[24px] lg:text-[26px] leading-tight tracking-tight group-hover:text-[#20D6A0] transition-colors">
                  {schoolInfo.name}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#20D6A0] uppercase tracking-[0.2em] leading-none mt-0.5">
                  Pendidikan Berkualitas & Berkarakter
                </span>
              </div>
            </button>

            {/* 2. NAV LINKS ZONE: 15-16px, Poppins 500-600, Active Emerald #00A887, Hover Emerald #20D6A0 */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 px-2 flex-1 justify-center">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                const isMegaActive = activeMegaMenu === item.id;
                
                return (
                  <div 
                    key={item.id}
                    onMouseEnter={() => item.hasMega && handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative py-2"
                  >
                    <button
                      onClick={() => !item.hasMega && handleTabClick(item.id)}
                      className={`relative px-4 py-2 text-[15px] transition-all rounded-[28px] flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#00A887] text-[#F5FAFC] font-semibold shadow-md shadow-[#00A887]/35'
                          : 'text-[#C0D5DF] hover:text-[#20D6A0] font-medium'
                      }`}
                    >
                      <span>{item.label[language]}</span>
                      {item.hasMega && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaActive ? 'rotate-180 text-[#20D6A0]' : 'opacity-70'}`} />
                      )}
                    </button>

                    {/* Dropdown / Mega Menu: Dark Teal #073440 Background, Soft Emerald Border */}
                    <AnimatePresence>
                      {isMegaActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-max min-w-[300px] pt-2"
                        >
                          <div className="bg-[#073440] rounded-2xl shadow-2xl border border-[rgba(32,214,160,0.25)] overflow-hidden p-3 ring-1 ring-black/40 backdrop-blur-xl">
                            
                            {/* Profil Dropdown */}
                            {item.id === 'profil' && (
                              <div className="p-4 w-[380px]">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-[#20D6A0] mb-3 pb-2 border-b border-[rgba(32,214,160,0.20)] flex items-center gap-2">
                                  <School className="w-3.5 h-3.5 text-[#FFBD24]" />
                                  <span>Informasi Profil Sekolah</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {megaMenuContent.profil.items.map((sub) => (
                                    <button
                                      key={sub.id}
                                      onClick={() => handleTabClick(sub.tab as NavTab)}
                                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#083D49] text-[#C0D5DF] hover:text-[#F5FAFC] transition-all text-left text-[14px] font-medium"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-[#00A887]/20 flex items-center justify-center text-[#20D6A0]">
                                        <sub.icon className="w-4 h-4" />
                                      </div>
                                      <span>{sub.label[language]}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* SDM Dropdown */}
                            {item.id === 'sdm' && (
                              <div className="p-3 w-[340px] space-y-1.5">
                                {megaMenuContent.sdm.items.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleTabClick(sub.tab as NavTab)}
                                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#083D49] text-left transition-all text-[#F5FAFC] group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-[#00A887]/20 flex items-center justify-center text-[#20D6A0] group-hover:bg-[#00A887] group-hover:text-white transition-all shrink-0">
                                      <sub.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <div className="text-[14px] font-semibold text-[#F5FAFC] group-hover:text-[#20D6A0] transition-colors">{sub.label[language]}</div>
                                      <div className="text-[12px] text-[#C0D5DF] font-normal">{sub.desc[language]}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Akademik Dropdown */}
                            {item.id === 'akademik' && (
                              <div className="p-6 w-[740px]">
                                <div className="grid grid-cols-3 gap-6">
                                  {megaMenuContent.akademik.sections.map((section, idx) => (
                                    <div key={idx} className="space-y-3">
                                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#FFBD24] flex items-center gap-2 pb-2 border-b border-[rgba(32,214,160,0.20)]">
                                        <div className="w-1.5 h-1.5 bg-[#00A887] rounded-full" />
                                        {section.title[language]}
                                      </h4>
                                      <ul className="space-y-1">
                                        {section.items.map((sub) => (
                                          <li key={sub.id}>
                                            <button
                                              onClick={() => handleTabClick(sub.tab as NavTab, sub.subTab)}
                                              className="w-full text-left py-2 px-2.5 rounded-lg text-[14px] font-medium text-[#C0D5DF] hover:text-[#F5FAFC] hover:bg-[#083D49] hover:text-[#20D6A0] transition-all flex items-center gap-2"
                                            >
                                              <span className="text-[#20D6A0]">•</span>
                                              <span>{sub.label[language]}</span>
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-5 pt-4 border-t border-[rgba(32,214,160,0.20)] flex items-center justify-between">
                                  <span className="text-xs text-[#C0D5DF]">
                                    Kurikulum Merdeka berpusat pada minat, bakat, & Profil Pelajar Pancasila.
                                  </span>
                                  <button 
                                    onClick={() => handleTabClick('akademik', 'kalender')}
                                    className="text-xs font-semibold text-[#FFBD24] hover:underline flex items-center gap-1.5"
                                  >
                                    <span>Kalender Pendidikan</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* 3. RIGHT UTILITY ZONE: Language Switcher + PPDB CTA Button */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden sm:flex items-center bg-[#073440] rounded-full p-1 border border-[rgba(32,214,160,0.20)] text-xs font-semibold">
                <button
                  onClick={() => onToggleLanguage('ID')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    language === 'ID' ? 'bg-[#00A887] text-white shadow-sm' : 'text-[#C0D5DF] hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => onToggleLanguage('EN')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    language === 'EN' ? 'bg-[#00A887] text-white shadow-sm' : 'text-[#C0D5DF] hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle Button */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="hidden sm:flex p-2 rounded-full bg-[#073440] text-[#C0D5DF] hover:text-[#FFBD24] hover:bg-[#083D49] border border-[rgba(32,214,160,0.20)] transition-all"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFBD24]" /> : <Moon className="w-4 h-4 text-[#20D6A0]" />}
                </button>
              )}

              {/* Primary Action Button: PPDB (Emerald #00A887 with Gold Hover & 30px rounded corners) */}
              <button
                onClick={onOpenPPDB}
                className="hidden md:inline-flex items-center gap-2 bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-[#062B3A] font-semibold text-[14px] px-6 py-2.5 rounded-[30px] shadow-md shadow-[#00A887]/30 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>PPDB Online</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#073440] text-white hover:bg-[#083D49] border border-[rgba(32,214,160,0.25)] transition-all"
                aria-label="Buka Menu Navigasi"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              />
              
              {/* Drawer Container (Navy #0B1F33) */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-sm bg-[#062B3A] text-[#F5FAFC] shadow-2xl lg:hidden flex flex-col overflow-hidden border-l border-[rgba(32,214,160,0.20)]"
              >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-[rgba(32,214,160,0.20)] bg-[#05222E]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#00A887] flex items-center justify-center text-white shadow">
                      <GraduationCap className="w-5 h-5 text-[#FFBD24]" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#20D6A0] uppercase tracking-wider">Sekolah Dasar Negeri</div>
                      <span className="font-bold text-base text-white truncate block">SUMBEREJO 04</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  <AnimatePresence mode="wait">
                    {!mobileSubmenu ? (
                      <motion.div 
                        key="main-menu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-1.5"
                      >
                        {navItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => item.hasMega ? setMobileSubmenu(item.id) : handleTabClick(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-[15px] font-medium transition-all flex items-center justify-between ${
                              currentTab === item.id
                                ? 'bg-[#00A887] text-white font-semibold shadow-md'
                                : 'text-[#C0D5DF] hover:bg-[#073440] hover:text-white'
                            }`}
                          >
                            <span>{item.label[language]}</span>
                            {item.hasMega ? (
                              <ChevronRight className="w-4 h-4 opacity-70" />
                            ) : (
                              currentTab === item.id && <div className="w-2 h-2 rounded-full bg-[#FFBD24]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="sub-menu"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-2"
                      >
                        <button
                          onClick={() => setMobileSubmenu(null)}
                          className="w-full flex items-center gap-2 p-3 text-[#FFBD24] font-semibold text-xs uppercase tracking-wider border-b border-[rgba(32,214,160,0.20)]"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          <span>Kembali ke Menu Utama</span>
                        </button>

                        <div className="space-y-1 pt-2">
                          {mobileSubmenu === 'profil' && megaMenuContent.profil.items.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleTabClick(sub.tab as NavTab)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#073440] text-[#C0D5DF] hover:text-[#F5FAFC] text-sm font-medium"
                            >
                              <sub.icon className="w-4 h-4 text-[#20D6A0]" />
                              <span>{sub.label[language]}</span>
                            </button>
                          ))}

                          {mobileSubmenu === 'sdm' && megaMenuContent.sdm.items.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleTabClick(sub.tab as NavTab)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#073440] text-[#C0D5DF] hover:text-[#F5FAFC] text-sm font-medium"
                            >
                              <sub.icon className="w-4 h-4 text-[#20D6A0]" />
                              <span>{sub.label[language]}</span>
                            </button>
                          ))}

                          {mobileSubmenu === 'akademik' && megaMenuContent.akademik.sections.map((section) => (
                            <div key={section.title.ID} className="mb-4">
                              <h4 className="px-3 text-[11px] font-bold text-[#FFBD24] uppercase tracking-wider mb-1.5">{section.title[language]}</h4>
                              {section.items.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => handleTabClick(sub.tab as NavTab, sub.subTab)}
                                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#073440] text-[#C0D5DF] hover:text-[#F5FAFC] text-sm font-medium"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#00A887]" />
                                  <span>{sub.label[language]}</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Drawer */}
                <div className="p-5 border-t border-[rgba(32,214,160,0.20)] bg-[#05222E] space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleLanguage(language === 'ID' ? 'EN' : 'ID')}
                      className="flex-1 py-2.5 bg-[#073440] hover:bg-[#083D49] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 border border-[rgba(32,214,160,0.20)]"
                    >
                      <span>{language === 'ID' ? 'Bahasa: Indonesia' : 'Language: English'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenPPDB(); }}
                    className="w-full py-3.5 bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-[#062B3A] font-semibold text-sm rounded-[30px] shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Daftar PPDB Online</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
