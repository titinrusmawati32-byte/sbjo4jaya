import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NavTab, Language } from './types';
import { getDatabase, subscribeToDatabase } from './services/database';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingSocialBar } from './components/FloatingSocialBar';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { PPDBModal } from './components/PPDBModal';
import { SIAPModal } from './components/SIAPModal';
import { DatabaseModal } from './components/DatabaseModal';

// Views for each menu tab: beranda, profil, sdm, akademik, galeri, berita, kontak
import { BerandaView } from './views/BerandaView';
import { ProfilView } from './views/ProfilView';
import { SDMView } from './views/SDMView';
import { AkademikView } from './views/AkademikView';
import { GaleriView } from './views/GaleriView';
import { BeritaView } from './views/BeritaView';
import { KontakView } from './views/KontakView';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { WelcomeModal } from './components/WelcomeModal';
import { AnnouncementModal } from './components/AnnouncementModal';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { LoginView } from './views/admin/LoginView';
import { AdminDashboard } from './views/admin/AdminDashboard';

function AppContent() {
  // Existing AppContent remains the same, but we wrap it in Routes
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicWebsite />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginView />} />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function PublicWebsite() {
  const [currentTab, setCurrentTab] = useState<NavTab>('beranda');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<Language>('ID');
  const { theme, toggleTheme } = useTheme();
  const [isPPDBModalOpen, setIsPPDBModalOpen] = useState(false);
  const [isSIAPModalOpen, setIsSIAPModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [databaseInitialTab, setDatabaseInitialTab] = useState<any>('info');
  const [db, setDb] = useState(getDatabase());

  useEffect(() => {
    const unsub = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsub();
  }, []);

  const schoolInfo = db.schoolInfo;

  const handleOpenDatabase = (tab: any = 'info') => {
    setDatabaseInitialTab(tab);
    setIsDatabaseModalOpen(true);
  };

  // Secret keyboard shortcut listener (Ctrl+Shift+A or Cmd+Shift+A) to open Admin Login safely from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = '/admin/login';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const tabNames: Record<NavTab, Record<Language, string>> = {
      beranda: { ID: `Beranda - ${schoolInfo.name}`, EN: `Home - ${schoolInfo.name}` },
      profil: { ID: `Profil - ${schoolInfo.name}`, EN: `Profile - ${schoolInfo.name}` },
      sdm: { ID: `SDM (Guru & Staf) - ${schoolInfo.name}`, EN: `Faculty & Staff - ${schoolInfo.name}` },
      akademik: { ID: `Akademik - ${schoolInfo.name}`, EN: `Academics - ${schoolInfo.name}` },
      galeri: { ID: `Galeri Foto - ${schoolInfo.name}`, EN: `Gallery - ${schoolInfo.name}` },
      berita: { ID: `Berita & Prestasi - ${schoolInfo.name}`, EN: `News & Events - ${schoolInfo.name}` },
      kontak: { ID: `Kontak & PPDB - ${schoolInfo.name}`, EN: `Contact & Admissions - ${schoolInfo.name}` },
    };

    document.title = tabNames[currentTab][language];
  }, [currentTab, language, schoolInfo.name]);

  const handleSelectTab = (tab: NavTab, subTab?: string) => {
    setCurrentTab(tab);
    setActiveSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#062B3A] text-[#F5FAFC] flex flex-col font-sans selection:bg-[#00A887] selection:text-white transition-colors duration-200">
      {/* Top Header & Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        language={language}
        onToggleLanguage={setLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPPDB={() => setIsPPDBModalOpen(true)}
        onOpenSIAP={() => setIsSIAPModalOpen(true)}
        onOpenDatabase={(tab) => handleOpenDatabase(tab || 'info')}
      />

      {/* Floating Right Social Bar */}
      <FloatingSocialBar />

      {/* Main View Container with Subtle Slide Transition */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10, x: -8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 8 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="w-full"
          >
            {currentTab === 'beranda' && (
              <BerandaView
                language={language}
                onSelectTab={handleSelectTab}
                onOpenPPDB={() => setIsPPDBModalOpen(true)}
              />
            )}

            {currentTab === 'profil' && <ProfilView language={language} />}

            {currentTab === 'sdm' && <SDMView language={language} />}

            {currentTab === 'akademik' && (
              <AkademikView
                language={language}
                onOpenDatabase={(tab) => handleOpenDatabase(tab || 'events')}
                initialSubTab={activeSubTab as any}
              />
            )}

            {currentTab === 'galeri' && <GaleriView language={language} />}

            {currentTab === 'berita' && <BeritaView language={language} />}

            {currentTab === 'kontak' && <KontakView language={language} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        language={language}
        onOpenPPDB={() => setIsPPDBModalOpen(true)}
        onOpenSIAP={() => setIsSIAPModalOpen(true)}
        onOpenDatabase={(tab) => handleOpenDatabase(tab || 'info')}
      />

      {/* Floating Assistant Chat Widget */}
      <FloatingChatWidget language={language} />

      {/* Modals for PPDB, SIAP Portal & Database Management */}
      <PPDBModal
        isOpen={isPPDBModalOpen}
        onClose={() => setIsPPDBModalOpen(false)}
        language={language}
      />

      <SIAPModal
        isOpen={isSIAPModalOpen}
        onClose={() => setIsSIAPModalOpen(false)}
        language={language}
        onOpenDatabase={(tab) => handleOpenDatabase(tab || 'info')}
        onGoHome={() => handleSelectTab('beranda')}
      />

      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        language={language}
        initialTab={databaseInitialTab}
      />

      <WelcomeModal language={language} />
      <AnnouncementModal language={language} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
