import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DashboardView } from './DashboardView';
import { HomepageCMS } from './HomepageCMS';
import { ProfileCMS } from './ProfileCMS';
import { StaffCMS } from './StaffCMS';
import { AcademicCMS } from './AcademicCMS';
import { NewsCMS } from './NewsCMS';
import { AchievementsCMS } from './AchievementsCMS';
import { GalleryCMS } from './GalleryCMS';
import { AgendaCMS } from './AgendaCMS';
import { AnnouncementsCMS } from './AnnouncementsCMS';
import { PPDBCMS } from './PPDBCMS';
import { DownloadsCMS } from './DownloadsCMS';
import { ContactCMS } from './ContactCMS';
import { NavigationCMS } from './NavigationCMS';
import { SettingsCMS } from './SettingsCMS';
import { MediaLibraryCMS } from './MediaLibraryCMS';

export const AdminDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'beranda':
        return <HomepageCMS />;
      case 'profil':
        return <ProfileCMS />;
      case 'sdm':
        return <StaffCMS />;
      case 'akademik':
        return <AcademicCMS />;
      case 'berita':
        return <NewsCMS />;
      case 'prestasi':
        return <AchievementsCMS />;
      case 'galeri':
        return <GalleryCMS />;
      case 'media':
        return <MediaLibraryCMS />;
      case 'agenda':
        return <AgendaCMS />;
      case 'pengumuman':
        return <AnnouncementsCMS />;
      case 'ppdb':
        return <PPDBCMS />;
      case 'download':
        return <DownloadsCMS />;
      case 'kontak':
        return <ContactCMS />;
      case 'navigasi':
        return <NavigationCMS />;
      case 'pengaturan':
        return <SettingsCMS />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AdminLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
    </AdminLayout>
  );
};
