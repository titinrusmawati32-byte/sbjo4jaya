import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, GraduationCap } from 'lucide-react';
import { Language } from '../types';

interface WelcomeModalProps {
  language: Language;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem('schoolWelcomeShown');
    if (!hasShown) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (neverShowAgain: boolean = false) => {
    setIsOpen(false);
    if (neverShowAgain) {
      localStorage.setItem('schoolWelcomeShown', 'true');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleClose()}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 font-sans"
          >
            <button
              onClick={() => handleClose()}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10 text-slate-400 hover:text-slate-600"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#008B6A] flex items-center justify-center text-white shadow-lg">
                  <GraduationCap className="w-9 h-9 text-[#F4B41A]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4B41A]/20 text-[#0B1F33] text-[11px] font-bold uppercase tracking-wider rounded-full border border-[#F4B41A]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#008B6A]" />
                  <span>{language === 'ID' ? 'Selamat Datang' : 'Welcome'}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0B1F33] leading-tight">
                  {language === 'ID' ? 'SD NEGERI SUMBEREJO 04' : 'SDN SUMBEREJO 04'}
                </h2>
                <p className="text-xs text-[#64748B] italic">
                  "Tiada Hari Tanpa Prestasi"
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleClose(true)}
                  className="w-full py-3.5 bg-[#008B6A] hover:bg-[#F4B41A] text-white hover:text-[#0B1F33] font-semibold text-sm rounded-[30px] shadow-md transition-all active:scale-95"
                >
                  {language === 'ID' ? 'Mulai Menjelajah' : 'Start Exploring'}
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className="text-xs font-medium text-slate-400 hover:text-[#008B6A] transition-colors"
                >
                  {language === 'ID' ? 'Jangan tampilkan lagi' : "Don't show this again"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
