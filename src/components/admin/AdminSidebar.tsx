import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  School, 
  Users, 
  BookOpen, 
  Newspaper, 
  Trophy, 
  Image as ImageIcon, 
  Calendar, 
  Bell, 
  FileText, 
  Download, 
  Phone, 
  Navigation, 
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  compact?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, compact }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-[#00A887] text-white shadow-lg shadow-[#00A887]/20 font-bold' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-[#00A887]'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-[#00A887]'}`}>
      {icon}
    </div>
    {!compact && <span className="font-bold text-xs truncate">{label}</span>}
  </button>
);

interface AdminSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCompact?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeModule, 
  onModuleChange, 
  isOpen, 
  onClose,
  isCompact
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn('Signout notice:', e);
    }
    navigate('/admin/login', { replace: true });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'profil', label: 'Profil Sekolah', icon: <School className="w-5 h-5" /> },
    { id: 'sdm', label: 'SDM (Guru & Staf)', icon: <Users className="w-5 h-5" /> },
    { id: 'akademik', label: 'Akademik', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'berita', label: 'Berita & Artikel', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'prestasi', label: 'Prestasi', icon: <Trophy className="w-5 h-5" /> },
    { id: 'galeri', label: 'Galeri & Album', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'media', label: 'Pustaka Media', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'agenda', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
    { id: 'pengumuman', label: 'Pengumuman', icon: <Bell className="w-5 h-5" /> },
    { id: 'ppdb', label: 'PPDB Online', icon: <FileText className="w-5 h-5" /> },
    { id: 'download', label: 'Download Dokumen', icon: <Download className="w-5 h-5" /> },
    { id: 'kontak', label: 'Kontak', icon: <Phone className="w-5 h-5" /> },
    { id: 'navigasi', label: 'Navigasi Website', icon: <Navigation className="w-5 h-5" /> },
    { id: 'pengaturan', label: 'Pengaturan Situs', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCompact ? 'w-20' : 'w-72'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A887] rounded-xl flex items-center justify-center text-white font-black shadow-md">
                SD
              </div>
              {!isCompact && (
                <div className="flex flex-col leading-tight">
                  <span className="font-serif font-black text-slate-900 dark:text-white">ADMIN PANEL</span>
                  <span className="text-[10px] text-[#00A887] font-bold uppercase tracking-wider">SDN SUMBEREJO 04</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeModule === item.id}
                onClick={() => {
                  onModuleChange(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                compact={isCompact}
              />
            ))}
          </div>

          {/* Logout Section in Sidebar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs transition-all shadow-md group cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0 group-hover:rotate-12 transition-transform" />
              {!isCompact && <span>Keluar Sesi Admin</span>}
            </button>
            {!isCompact && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center pt-1">
                SDN SUMBEREJO 04 — SUPABASE CMS
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
