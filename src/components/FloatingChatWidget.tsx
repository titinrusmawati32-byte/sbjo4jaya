import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { getDatabase } from '../services/database';
import { X, Send, Bot, HelpCircle, MessageCircle, Sparkles, User, Minimize2 } from 'lucide-react';

interface FloatingChatWidgetProps {
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ language }) => {
  const schoolInfo = getDatabase().schoolInfo;
  const faqs = getDatabase().faqs;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text:
        language === 'ID'
          ? `Halo! Selamat datang di ${schoolInfo.name}. Ada yang bisa saya bantu seputar PPDB, kurikulum, fasilitas, atau jadwal kegiatan?`
          : `Hello! Welcome to ${schoolInfo.name}. How can I assist you with admissions, curriculum, facilities, or schedules?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getLocalReply = (queryText: string): string => {
    const lower = queryText.toLowerCase();

    if (
      lower.includes('ppdb') ||
      lower.includes('daftar') ||
      lower.includes('syarat') ||
      lower.includes('admission')
    ) {
      return language === 'ID'
        ? `PPDB ${schoolInfo.name} dibuka untuk Jalur Zonasi, Afirmasi, dan Prestasi. Pendaftaran gratis. Syarat utama: Akta Kelahiran, Kartu Keluarga, dan Pasfoto 3x4.`
        : `PPDB for ${schoolInfo.name} is open for Zoning, Affirmation, and Achievement tracks. Registration is completely free.`;
    } else if (
      lower.includes('biaya') ||
      lower.includes('uang') ||
      lower.includes('spp') ||
      lower.includes('bayar')
    ) {
      return language === 'ID'
        ? `Pendaftaran PPDB di ${schoolInfo.name} adalah GRATIS (bebas biaya pendaftaran) sesuai ketentuan Dinas Pendidikan.`
        : `New student registration at ${schoolInfo.name} is completely FREE.`;
    } else if (
      lower.includes('alamat') ||
      lower.includes('lokasi') ||
      lower.includes('posisi') ||
      lower.includes('dimana')
    ) {
      return `${schoolInfo.name} berlokasi di ${schoolInfo.address}.`;
    } else if (
      lower.includes('kurikulum') ||
      lower.includes('pancasila') ||
      lower.includes('merdeka')
    ) {
      return `Kami mengimplementasikan Kurikulum Merdeka yang berpusat pada minat dan bakat murid serta penguatan Profil Pelajar Pancasila.`;
    } else if (
      lower.includes('kontak') ||
      lower.includes('telepon') ||
      lower.includes('wa') ||
      lower.includes('hubungi')
    ) {
      return `Silakan hubungi kami melalui Telepon: ${schoolInfo.phone} atau WhatsApp: ${schoolInfo.whatsapp}.`;
    } else if (
      lower.includes('guru') ||
      lower.includes('staf') ||
      lower.includes('kepala sekolah')
    ) {
      return `${schoolInfo.name} didukung oleh tenaga pendidik profesional dan bersertifikasi. Anda dapat melihat daftar lengkap guru di menu SDM.`;
    } else if (
      lower.includes('fasilitas') ||
      lower.includes('ruang') ||
      lower.includes('lab')
    ) {
      return `${schoolInfo.name} memiliki ruang kelas interaktif, perpustakaan, sarana olahraga, dan lingkungan hijau yang asri.`;
    }

    return language === 'ID'
      ? `Terima kasih atas pertanyaannya. Untuk informasi lebih mendalam seputar "${queryText}", silakan hubungi tim layanan kami melalui WhatsApp ${schoolInfo.whatsapp} atau kunjungi menu Kontak.`
      : `Thank you for asking. For further details about "${queryText}", please contact our school office.`;
  };

  const handleSend = (presetText?: string) => {
    const textToSend = presetText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!presetText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getLocalReply(textToSend);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[90vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-[#073440] text-[#F5FAFC] rounded-2xl shadow-2xl border border-[rgba(32,214,160,0.25)] overflow-hidden flex flex-col mb-3 font-sans backdrop-blur-xl ring-1 ring-black/40"
          >
            {/* Header: Deep Navy Teal #062B3A with Emerald & Gold Details */}
            <div className="bg-[#062B3A] text-white p-4 flex items-center justify-between border-b border-[rgba(32,214,160,0.20)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00A887] text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-[#FFBD24]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#F5FAFC] leading-tight">Asisten Virtual Sekolah</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20D6A0] animate-pulse" />
                    <span className="text-[11px] text-[#C0D5DF] font-medium">Online • Siap Membantu</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#C0D5DF] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Tutup Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#05222E]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    msg.sender === 'ai' 
                      ? 'bg-[#00A887] text-white' 
                      : 'bg-[#083D49] text-white'
                  }`}>
                    {msg.sender === 'ai' ? <Bot className="w-3.5 h-3.5 text-[#FFBD24]" /> : <User className="w-3.5 h-3.5 text-[#20D6A0]" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#00A887] text-white rounded-br-none font-medium'
                        : 'bg-[#073440] text-[#F5FAFC] border border-[rgba(32,214,160,0.20)] rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 opacity-60 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00A887] text-white flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-[#FFBD24]" />
                  </div>
                  <div className="bg-[#073440] text-[#F5FAFC] rounded-2xl rounded-bl-none px-3.5 py-2.5 shadow-sm border border-[rgba(32,214,160,0.20)]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#20D6A0] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-[#20D6A0] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-[#20D6A0] rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Topic Chips */}
            <div className="px-3.5 py-2 bg-[#062B3A] border-t border-[rgba(32,214,160,0.20)] overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0 no-scrollbar">
              {(faqs || []).slice(0, 4).map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(faq.question?.[language] || faq.question?.ID || '')}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-[#073440] hover:bg-[#00A887]/20 text-[#20D6A0] px-3 py-1.5 rounded-full border border-[rgba(32,214,160,0.25)] transition-all shrink-0"
                >
                  <HelpCircle className="w-3 h-3 text-[#FFBD24]" />
                  <span>{faq.category}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#062B3A] border-t border-[rgba(32,214,160,0.20)] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === 'ID' ? 'Ketik pertanyaan...' : 'Ask question...'}
                  className="w-full text-xs bg-[#073440] border border-[rgba(32,214,160,0.25)] rounded-full pl-4 pr-11 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A887]/40 focus:border-[#20D6A0] text-[#F5FAFC] placeholder-[#C0D5DF]/60"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-1 w-8 h-8 rounded-full bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-[#062B3A] disabled:opacity-30 flex items-center justify-center transition-all shadow-sm"
                  aria-label="Kirim"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button: Capsule shape */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-[#062B3A] hover:bg-[#073440] text-white shadow-2xl rounded-full p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-3 transition-all border border-[rgba(32,214,160,0.30)] active:scale-95"
        aria-label="Tanya Asisten Virtual"
      >
        <div className="w-8 h-8 rounded-full bg-[#00A887] flex items-center justify-center text-white shrink-0 group-hover:bg-[#20D6A0] transition-colors">
          <Bot className="w-4 h-4 text-[#FFBD24]" />
        </div>

        <div className="text-left hidden sm:block pr-1">
          <div className="text-[10px] font-semibold text-[#20D6A0] leading-none">Asisten Virtual</div>
          <div className="text-xs font-bold text-[#F5FAFC] mt-0.5">Butuh Bantuan?</div>
        </div>

        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
          {isOpen ? <X className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5 text-[#20D6A0]" />}
        </div>
      </button>
    </div>
  );
};
