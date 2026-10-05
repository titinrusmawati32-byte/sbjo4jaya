import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { formatWhatsAppUrl } from '../utils/mediaUtils';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Navigation,
  Copy,
  Check,
  Building2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface KontakViewProps {
  language: Language;
}

export const KontakView: React.FC<KontakViewProps> = ({ language }) => {
  const [db, setDb] = useState(getDatabase());
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'PPDB / Pendaftaran Murid Baru',
    message: '',
  });

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;
  const faqs = db.faqs;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    showToast(language === 'ID' ? 'Pesan berhasil dikirim!' : 'Message sent successfully!', 'success');
    
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'PPDB / Pendaftaran Murid Baru',
        message: '',
      });
    }, 4000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(schoolInfo.address);
    setCopiedAddress(true);
    showToast(language === 'ID' ? 'Alamat disalin ke clipboard' : 'Address copied to clipboard', 'info');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const mapEmbedSrc =
    schoolInfo.mapsEmbedUrl && schoolInfo.mapsEmbedUrl.trim() !== ''
      ? schoolInfo.mapsEmbedUrl
      : `https://maps.google.com/maps?q=${encodeURIComponent(schoolInfo.name + ' ' + schoolInfo.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(schoolInfo.name + ' ' + schoolInfo.address)}`;

  return (
    <div className="space-y-16 py-8 bg-[#062B3A] text-[#F5FAFC] min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083D49] rounded-[24px] p-8 sm:p-14 text-[#F5FAFC] shadow-2xl relative overflow-hidden border border-[rgba(32,214,160,0.25)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A887]/20 text-[#20D6A0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[rgba(32,214,160,0.30)]">
              <Phone className="w-3.5 h-3.5 text-[#FFBD24]" />
              <span>Pusat Layanan & Komunikasi</span>
            </div>
            <h1 className="text-[#F5FAFC] font-extrabold tracking-tight text-3xl sm:text-5xl leading-tight">
              Kontak & Bantuan
            </h1>
            <p className="text-base sm:text-lg text-[#C0D5DF] leading-relaxed font-normal">
              Sekretariat {schoolInfo.name} siap melayani pertanyaan seputar PPDB, kurikulum, administrasi, maupun kunjungan ke kampus kami.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Contact Details & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="bg-[#073440]/90 backdrop-blur-md p-6 sm:p-8 rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 space-y-6">
              <h3 className="text-lg font-bold text-[#F5FAFC] pb-3 border-b border-[rgba(32,214,160,0.15)]">
                Informasi Kontak Resmi
              </h3>

              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Alamat Sekolah', detail: schoolInfo.address },
                  { icon: Phone, title: 'Telepon & WA', detail: schoolInfo.phone, link: `tel:${schoolInfo.phone}` },
                  { icon: Mail, title: 'Email Resmi', detail: schoolInfo.email, link: `mailto:${schoolInfo.email}` },
                  { icon: Clock, title: 'Jam Operasional', detail: 'Senin – Jumat: 07.00 – 15.00 WIB' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#00A887]/20 border border-[rgba(32,214,160,0.30)] text-[#20D6A0] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C0D5DF] block">{item.title}</span>
                      {item.link ? (
                        <a href={item.link} className="text-sm font-semibold text-[#F5FAFC] hover:text-[#20D6A0] transition-colors leading-relaxed block mt-0.5">
                          {item.detail}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-[#F5FAFC] leading-relaxed mt-0.5">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick WhatsApp Card */}
            <a
              href={formatWhatsAppUrl(
                schoolInfo.whatsapp,
                `Halo ${schoolInfo.name}, saya ingin bertanya seputar pendaftaran sekolah.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-[#062B3A] p-7 rounded-[20px] shadow-xl transition-all group border border-[rgba(32,214,160,0.3)]"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFBD24] group-hover:text-[#062B3A] block">Layanan Cepat</span>
              <h4 className="font-bold text-xl mt-1 text-white group-hover:text-[#062B3A]">Konsultasi WhatsApp</h4>
              <p className="text-xs text-white/90 group-hover:text-[#062B3A]/90 mt-1 font-normal">Hubungi tim informasi sekolah via chat instan untuk respon cepat.</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#062B3A] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                <MessageCircle className="w-3.5 h-3.5 text-[#20D6A0]" />
                <span>Chat Sekarang</span>
              </div>
            </a>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-[#073440]/90 backdrop-blur-md p-8 sm:p-10 rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60">
              <div className="mb-6 space-y-1">
                <span className="section-badge">Formulir Pesan</span>
                <h3 className="text-2xl font-bold text-[#F5FAFC] pt-2">Kirim Pertanyaan</h3>
                <p className="text-xs text-[#C0D5DF]">Isi formulir di bawah ini dan kami akan membalas via email atau WhatsApp.</p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#00A887]/20 text-[#20D6A0] border border-[rgba(32,214,160,0.3)] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-xl text-[#F5FAFC]">Pesan Terkirim!</h4>
                  <p className="text-xs text-[#C0D5DF] max-w-sm mx-auto">Terima kasih telah menghubungi kami. Tim kami akan segera menindaklanjuti pesan Anda.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#F5FAFC]">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] outline-none text-[#F5FAFC] placeholder-[#C0D5DF]/50"
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#F5FAFC]">Alamat Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] outline-none text-[#F5FAFC] placeholder-[#C0D5DF]/50"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#F5FAFC]">Nomor WhatsApp / HP</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] outline-none text-[#F5FAFC] placeholder-[#C0D5DF]/50"
                        placeholder="0812..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#F5FAFC]">Kategori Keperluan</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] outline-none text-[#F5FAFC]"
                      >
                        <option value="PPDB / Pendaftaran Murid Baru">PPDB / Pendaftaran Murid Baru</option>
                        <option value="Konsultasi Kurikulum & Akademik">Konsultasi Kurikulum & Akademik</option>
                        <option value="Jadwal Kunjungan Kampus">Jadwal Kunjungan Kampus</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F5FAFC]">Isi Pesan</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#062B3A] border border-[rgba(32,214,160,0.25)] rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] outline-none text-[#F5FAFC] placeholder-[#C0D5DF]/50 resize-none"
                      placeholder="Tuliskan pertanyaan atau pesan Anda..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Sekarang</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Google Maps Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073440]/90 backdrop-blur-md p-6 sm:p-10 rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(32,214,160,0.15)]">
            <div>
              <span className="section-badge">Peta Lokasi</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5FAFC] mt-2">Lokasi Sekolah</h2>
              <p className="text-xs text-[#C0D5DF] mt-1">{schoolInfo.address}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#062B3A] hover:bg-[#083D49] text-[#F5FAFC] text-xs font-semibold rounded-full border border-[rgba(32,214,160,0.20)] transition-all"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-[#20D6A0]" /> : <Copy className="w-3.5 h-3.5 text-[#20D6A0]" />}
                <span>Salin Alamat</span>
              </button>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-[#062B3A] text-xs font-semibold rounded-full shadow transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Petunjuk Arah</span>
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[rgba(32,214,160,0.25)] shadow-2xl h-[380px] sm:h-[480px]">
            <iframe
              title={`Peta Lokasi ${schoolInfo.name}`}
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-[#073440]/90 backdrop-blur-md p-8 sm:p-12 rounded-[20px] border border-[rgba(32,214,160,0.20)] shadow-xl shadow-[#062B3A]/60">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="section-badge">Pusat Informasi</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5FAFC]">Pertanyaan Sering Diajukan</h2>
            <p className="text-xs text-[#C0D5DF]">Jawaban seputar pendaftaran, kurikulum, dan operasional {schoolInfo.name}.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-[#20D6A0]/50 bg-[#00A887]/10' : 'border-[rgba(32,214,160,0.20)] bg-[#062B3A]/70 hover:border-[#20D6A0]/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className={`w-4 h-4 shrink-0 ${isOpen ? 'text-[#20D6A0]' : 'text-[#C0D5DF]/70'}`} />
                      <span className={`text-sm font-bold ${isOpen ? 'text-[#20D6A0]' : 'text-[#F5FAFC]'}`}>
                        {faq.question[language]}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#20D6A0]' : 'text-[#C0D5DF]/70'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-[#C0D5DF] leading-relaxed border-t border-[rgba(32,214,160,0.15)]">
                        {faq.answer[language]}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
