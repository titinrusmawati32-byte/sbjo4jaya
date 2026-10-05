import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { getDatabase, addPPDBRegistration } from '../services/database';
import { formatWhatsAppUrl } from '../utils/mediaUtils';
import { X, CheckCircle2, Calendar, FileText, Phone, Send, Download, ArrowRight, Sparkles, User, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PPDBModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PPDBModal: React.FC<PPDBModalProps> = ({ isOpen, onClose, language }) => {
  const schoolInfo = getDatabase().schoolInfo;
  const ppdbData = getDatabase().ppdbInfo;
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'alur' | 'daftar'>('info');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    nik: '',
    phone: '',
    email: '',
    targetGrade: 'Kelas 1',
    prevSchool: '',
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPPDBRegistration(formData);
    setFormSubmitted(true);
    showToast(language === 'ID' ? 'Pendaftaran berhasil dikirim!' : 'Registration submitted successfully!', 'success');
    
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        studentName: '',
        parentName: '',
        nik: '',
        phone: '',
        email: '',
        targetGrade: 'Kelas 1',
        prevSchool: '',
      });
      setActiveTab('info');
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B1F33]/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 font-sans"
          >
            {/* Header: Navy #0B1F33 with Gold & Emerald details */}
            <div className="bg-[#0B1F33] p-6 sm:p-8 text-white relative overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors z-20"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F4B41A] text-[#0B1F33] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    PPDB {ppdbData.year}
                  </span>
                  <span className="text-[#00A878] text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#008B6A] animate-pulse" />
                    {ppdbData.status === 'Buka' ? 'Pendaftaran Sedang Dibuka' : 'Informasi PPDB'}
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {language === 'ID'
                    ? 'Penerimaan Peserta Didik Baru'
                    : 'New Student Admissions'}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-normal max-w-md leading-relaxed">
                  {language === 'ID'
                    ? 'Wujudkan masa depan gemilang bersama SDN SUMBEREJO 04. Proses transparan, mudah, dan bebas biaya.'
                    : 'Realize a bright future with SDN SUMBEREJO 04. Transparent, simple, and free of charge.'}
                </p>
              </div>
            </div>

            {/* Tab selector */}
            <div className="flex bg-[#F5F8F7] p-2 gap-2 border-b border-slate-200">
              {[
                { id: 'info', label: language === 'ID' ? 'Persyaratan' : 'Requirements', icon: Info },
                { id: 'alur', label: language === 'ID' ? 'Alur Pendaftaran' : 'Steps', icon: ArrowRight },
                { id: 'daftar', label: language === 'ID' ? 'Formulir Online' : 'Register Form', icon: Send },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#008B6A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0B1F33] hover:bg-slate-200/60'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content body */}
            <div className="p-6 sm:p-8 max-h-[52vh] overflow-y-auto no-scrollbar bg-[#F5F8F7]">
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
                      <div className="w-11 h-11 rounded-xl bg-[#008B6A]/10 text-[#008B6A] flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-[#008B6A]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#008B6A]">
                          Periode Pendaftaran
                        </h4>
                        <p className="text-base font-bold text-[#0B1F33] mt-0.5">
                          {ppdbData.registrationPeriod[language]}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-[#0B1F33] text-base flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#008B6A]" />
                        <span>Dokumen Persyaratan</span>
                      </h3>
                      <div className="grid gap-2.5">
                        {ppdbData.requirements.map((req, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs"
                          >
                            <div className="w-5 h-5 rounded-md bg-[#008B6A]/10 text-[#008B6A] flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#008B6A]" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-[#243447]">{req[language]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'alur' && (
                  <motion.div
                    key="alur"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {ppdbData.steps.map((stepItem, idx) => (
                      <div
                        key={stepItem.step}
                        className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-3 shadow-xs hover:border-[#008B6A]/40 transition-all"
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#008B6A] text-white font-bold text-xs flex items-center justify-center shadow">
                          {stepItem.step}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0B1F33] text-sm mb-1 leading-snug">
                            {stepItem.title[language]}
                          </h4>
                          <p className="text-xs text-[#64748B] leading-relaxed">
                            {stepItem.desc[language]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'daftar' && (
                  <motion.div
                    key="daftar"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {formSubmitted ? (
                      <div className="py-10 text-center space-y-4 bg-white rounded-2xl p-6 border border-slate-200">
                        <div className="w-16 h-16 bg-[#008B6A]/10 text-[#008B6A] rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8 text-[#008B6A]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xl text-[#0B1F33]">
                            Pendaftaran Berhasil Dikirim!
                          </h4>
                          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                            Data formulir telah tersimpan di sistem sekolah. Panitia PPDB akan segera memverifikasi dan menghubungi Anda.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#0B1F33]">Nama Lengkap Calon Siswa</label>
                            <input
                              type="text"
                              required
                              value={formData.studentName}
                              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                              className="w-full bg-[#F5F8F7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#243447] focus:outline-none focus:ring-2 focus:ring-[#008B6A]/20 focus:border-[#008B6A]"
                              placeholder="Nama murid"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#0B1F33]">Nama Orang Tua / Wali</label>
                            <input
                              type="text"
                              required
                              value={formData.parentName}
                              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                              className="w-full bg-[#F5F8F7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#243447] focus:outline-none focus:ring-2 focus:ring-[#008B6A]/20 focus:border-[#008B6A]"
                              placeholder="Nama ayah/ibu"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#0B1F33]">NIK Siswa (16 Digit)</label>
                            <input
                              type="text"
                              required
                              maxLength={16}
                              value={formData.nik}
                              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                              className="w-full bg-[#F5F8F7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#243447] focus:outline-none focus:ring-2 focus:ring-[#008B6A]/20 focus:border-[#008B6A]"
                              placeholder="3509xxxxxxxxxxxx"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#0B1F33]">No. WhatsApp Aktif</label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-[#F5F8F7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#243447] focus:outline-none focus:ring-2 focus:ring-[#008B6A]/20 focus:border-[#008B6A]"
                              placeholder="08xxxxxxxxxx"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#0B1F33]">Target Kelas</label>
                            <select
                              value={formData.targetGrade}
                              onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                              className="w-full bg-[#F5F8F7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#243447] focus:outline-none focus:ring-2 focus:ring-[#008B6A]/20 focus:border-[#008B6A]"
                            >
                              <option value="Kelas 1">Kelas 1</option>
                              <option value="Kelas 2">Kelas 2 (Pindahan)</option>
                              <option value="Kelas 3">Kelas 3 (Pindahan)</option>
                              <option value="Kelas 4">Kelas 4 (Pindahan)</option>
                              <option value="Kelas 5">Kelas 5 (Pindahan)</option>
                              <option value="Kelas 6">Kelas 6 (Pindahan)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#0B1F33]">Asal Sekolah / TK</label>
                            <input
                              type="text"
                              value={formData.prevSchool}
                              onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                              className="w-full bg-[#F5F8F7] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#243447] focus:outline-none focus:ring-2 focus:ring-[#008B6A]/20 focus:border-[#008B6A]"
                              placeholder="Contoh: TK Dharma Wanita"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 bg-[#008B6A] hover:bg-[#F4B41A] text-white hover:text-[#0B1F33] font-semibold text-sm py-3.5 px-6 rounded-[30px] shadow-md transition-all mt-4"
                        >
                          <Send className="w-4 h-4" />
                          <span>Kirim Pendaftaran Online</span>
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-white p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <a
                href={formatWhatsAppUrl(
                  schoolInfo.whatsapp,
                  `Halo ${schoolInfo.name}, saya ingin bertanya tentang syarat PPDB.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-[#008B6A] hover:text-[#00A878] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Bantuan Pendaftaran via WhatsApp</span>
              </a>
              
              <button
                onClick={() => {
                  showToast(language === 'ID' ? 'Mengunduh brosur PPDB...' : 'Downloading PPDB brochure...', 'info');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-[#243447] hover:bg-slate-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#008B6A]" />
                <span>Unduh Brosur Informasi</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
