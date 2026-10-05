import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeModule, 
  onModuleChange 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('admin_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem('admin_dark_mode', String(nextVal));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <AdminSidebar 
        activeModule={activeModule}
        onModuleChange={onModuleChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCompact={isCompact}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCompact ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <AdminHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={activeModule.replace(/-/g, ' ')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <main className="flex-1 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="py-6 px-8 text-center text-slate-400 dark:text-slate-500 text-xs border-t border-slate-100 dark:border-slate-800">
          © 2026 Admin Panel SDN SUMBEREJO 04. Dikembangkan secara profesional untuk pengelolaan mandiri.
        </footer>
      </div>
    </div>
  );
};
