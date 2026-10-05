import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Instagram, MessageCircle, Youtube, Share2, X } from 'lucide-react';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { formatWhatsAppUrl } from '../utils/mediaUtils';

export const FloatingSocialBar: React.FC = () => {
  const [db, setDb] = useState(getDatabase());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;

  const getWaUrl = () => {
    return formatWhatsAppUrl(
      schoolInfo.social?.whatsapp || schoolInfo.whatsapp,
      `Halo ${schoolInfo.name}, saya ingin bertanya informasi sekolah.`
    );
  };

  const socials = [
    { id: 'wa', icon: MessageCircle, hoverBg: 'hover:bg-[#25D366]', href: getWaUrl(), label: 'WhatsApp' },
    { id: 'ig', icon: Instagram, hoverBg: 'hover:bg-[#E4405F]', href: schoolInfo.social?.instagram || 'https://instagram.com', label: 'Instagram' },
    { id: 'fb', icon: Facebook, hoverBg: 'hover:bg-[#1877F2]', href: schoolInfo.social?.facebook || 'https://facebook.com', label: 'Facebook' },
    { id: 'yt', icon: Youtube, hoverBg: 'hover:bg-[#FF0000]', href: schoolInfo.social?.youtube || 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <>
      {/* Desktop Fixed Bar: Compact & Elegant on Navy Teal base */}
      <aside aria-label="Media Sosial Resmi" className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col bg-[#062B3A]/95 backdrop-blur-md shadow-2xl rounded-l-xl border-y border-l border-[rgba(32,214,160,0.20)] overflow-hidden">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 text-[#C0D5DF] hover:text-white flex items-center justify-center transition-all ${social.hoverBg} border-b border-[rgba(32,214,160,0.15)] last:border-b-0`}
            title={social.label}
          >
            <social.icon className="w-4 h-4" />
          </a>
        ))}
      </aside>

      {/* Mobile Subtle Button */}
      <div className="fixed right-4 bottom-24 z-[55] md:hidden">
        <div className="relative flex flex-col items-center">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 15 }}
                className="absolute bottom-12 flex flex-col gap-2 bg-[#062B3A] p-1.5 rounded-full shadow-xl border border-[rgba(32,214,160,0.25)]"
              >
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 bg-[#073440] ${social.hoverBg} text-[#C0D5DF] hover:text-white rounded-full flex items-center justify-center shadow transition-colors`}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 rounded-full bg-[#062B3A] text-[#20D6A0] hover:text-white flex items-center justify-center shadow-lg border border-[rgba(32,214,160,0.30)] transition-all active:scale-95"
            aria-label="Tampilkan Media Sosial"
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
};
