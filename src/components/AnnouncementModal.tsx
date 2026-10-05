import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, ExternalLink, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { getDatabase } from '../services/database';

interface Announcement {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  image?: string;
  buttonText?: Record<Language, string>;
  buttonLink?: string;
  enabled: boolean;
  type: 'info' | 'success' | 'warning' | 'ppdb';
}

interface AnnouncementModalProps {
  language: Language;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    // In a real app, this would come from the database
    const activeAnnouncement: Announcement = {
      id: 'ppdb-2027',
      title: {
        ID: 'PPDB Tahun Ajaran 2027/2028 Telah Dibuka!',
        EN: 'Admission for Academic Year 2027/2028 is Now Open!',
      },
      description: {
        ID: 'Segera daftarkan putra-putri Anda di SDN SUMBEREJO 04. Kuota terbatas! Pendaftaran gratis tanpa dipungut biaya.',
        EN: 'Register your children at SDN SUMBEREJO 04 now. Limited seats available! Free registration.',
      },
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
      buttonText: {
        ID: 'Daftar Sekarang',
        EN: 'Register Now',
      },
      buttonLink: '#daftar',
      enabled: true,
      type: 'ppdb',
    };

    const hasSeen = localStorage.getItem(`announcement_${activeAnnouncement.id}`);
    
    if (activeAnnouncement.enabled && !hasSeen) {
      const timer = setTimeout(() => {
        setAnnouncement(activeAnnouncement);
        setIsOpen(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (announcement) {
      localStorage.setItem(`announcement_${announcement.id}`, 'true');
    }
  };

  if (!announcement) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0B1F33]/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 font-sans"
          >
            {/* Header / Image */}
            {announcement.image && (
              <div className="relative h-48 sm:h-56">
                <img 
                  src={announcement.image} 
                  alt="Pengumuman Sekolah" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {!announcement.image && (
              <div className="flex justify-end p-4">
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-6 sm:px-8 pb-8 pt-2 space-y-5">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#008B6A]/10 text-[#008B6A] rounded-full text-[11px] font-bold uppercase tracking-wider border border-[#008B6A]/20">
                  {announcement.type === 'ppdb' ? <Sparkles className="w-3.5 h-3.5 text-[#F4B41A]" /> : <Bell className="w-3.5 h-3.5 text-[#008B6A]" />}
                  <span>{announcement.type === 'ppdb' ? 'PPDB Online' : 'Warta Pengumuman'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33] leading-snug">
                  {announcement.title[language]}
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {announcement.description[language]}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {announcement.buttonText && (
                  <button
                    onClick={() => {
                      handleClose();
                      if (announcement.buttonLink?.startsWith('#')) {
                        window.location.hash = announcement.buttonLink;
                      } else if (announcement.buttonLink) {
                        window.open(announcement.buttonLink, '_blank');
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#008B6A] hover:bg-[#F4B41A] text-white hover:text-[#0B1F33] font-semibold text-xs py-3 px-5 rounded-[30px] shadow-sm transition-all"
                  >
                    <span>{announcement.buttonText[language]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#64748B] font-semibold text-xs py-3 px-5 rounded-[30px] transition-all"
                >
                  {language === 'ID' ? 'Nanti Saja' : 'Maybe Later'}
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-400 font-normal">
                {language === 'ID' ? 'Klik di luar untuk menutup warta' : 'Click outside to close'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
