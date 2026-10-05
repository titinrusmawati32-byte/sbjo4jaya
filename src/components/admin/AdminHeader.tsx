import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminHeaderProps {
  onMenuClick: () => void;
  title: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onMenuClick, 
  title,
  isDarkMode,
  onToggleDarkMode
}) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn('Signout notice:', e);
    }
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white capitalize tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={onToggleDarkMode}
          className="p-2.5 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          title={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Malam'}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2.5 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl relative transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00A887] rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
              {profile?.full_name || 'Administrator'}
            </span>
            <span className="text-[10px] text-[#00A887] font-bold uppercase tracking-widest mt-0.5">
              {profile?.role || 'Super Admin'}
            </span>
          </div>
          
          <div className="relative">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#00A887]/30 shadow-md transition-all" 
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#00A887] flex items-center justify-center text-white font-black shadow-md">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-bold text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
