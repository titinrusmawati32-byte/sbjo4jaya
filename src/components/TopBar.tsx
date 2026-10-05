import React from 'react';
import { MapPin, Phone, Mail, Award, Landmark } from 'lucide-react';
import { Language, SchoolInfo } from '../types';

interface TopBarProps {
  schoolInfo: SchoolInfo;
  language: Language;
}

export const TopBar: React.FC<TopBarProps> = ({ schoolInfo, language }) => {
  return (
    <div className="bg-[#05222E] text-[#C0D5DF] py-2 px-4 sm:px-6 lg:px-8 border-b border-[rgba(32,214,160,0.15)] relative z-[60]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs font-medium tracking-wide">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#FFBD24]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Sekolah Dasar Negeri Unggulan</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-4 text-[#C0D5DF]">
            <Landmark className="w-3.5 h-3.5 text-[#20D6A0]" />
            <span>NPSN: <strong className="text-[#F5FAFC] font-semibold">{schoolInfo.npsn}</strong></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden lg:flex items-center gap-1.5 text-[#C0D5DF]">
            <MapPin className="w-3.5 h-3.5 text-[#FFBD24]" />
            <span className="truncate max-w-[320px]">{schoolInfo.address}</span>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
            <a href={`tel:${schoolInfo.phone}`} className="hover:text-[#20D6A0] transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00A887]" />
              <span className="hidden sm:inline">{schoolInfo.phone}</span>
            </a>
            <a href={`mailto:${schoolInfo.email}`} className="hover:text-[#20D6A0] transition-colors flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00A887]" />
              <span className="hidden sm:inline">{schoolInfo.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
