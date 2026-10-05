import React, { useEffect, useState } from 'react';
import { 
  Newspaper, 
  Users, 
  Image as ImageIcon, 
  Trophy, 
  Calendar, 
  Bell, 
  TrendingUp, 
  ArrowUpRight, 
  Clock,
  Database,
  CheckCircle,
  FileText
} from 'lucide-react';
import { getRecords, seedSupabaseDatabase } from '../../services/supabaseDataService';

interface DashboardStats {
  news: number;
  teachers: number;
  staff: number;
  albums: number;
  achievements: number;
  agenda: number;
  announcements: number;
}

const StatCard: React.FC<{ 
  label: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string;
  trend?: string;
}> = ({ label, value, icon, color, trend }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.05] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full uppercase tracking-wider">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl font-serif font-black text-slate-900 dark:text-white mb-1">{value}</h3>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    news: 0,
    teachers: 0,
    staff: 0,
    albums: 0,
    achievements: 0,
    agenda: 0,
    announcements: 0,
  });
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [activeAnnouncements, setActiveAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        newsRes, 
        teachersRes, 
        staffRes, 
        albumsRes, 
        achievementsRes, 
        agendaRes, 
        announcementsRes
      ] = await Promise.all([
        getRecords('news'),
        getRecords('teachers'),
        getRecords('staff'),
        getRecords('albums'),
        getRecords('achievements'),
        getRecords('agendas'),
        getRecords('announcements')
      ]);

      setStats({
        news: newsRes.count || newsRes.data?.length || 0,
        teachers: teachersRes.count || teachersRes.data?.length || 0,
        staff: staffRes.count || staffRes.data?.length || 0,
        albums: albumsRes.count || albumsRes.data?.length || 0,
        achievements: achievementsRes.count || achievementsRes.data?.length || 0,
        agenda: agendaRes.count || agendaRes.data?.length || 0,
        announcements: announcementsRes.count || announcementsRes.data?.length || 0,
      });

      setRecentNews(newsRes.data.slice(0, 4));
      setActiveAnnouncements(announcementsRes.data.slice(0, 3));
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedMessage('Mengunggah data awal ke Supabase...');
    const result = await seedSupabaseDatabase();
    setSeedMessage(result.message);
    setIsSeeding(false);
    await fetchDashboardData();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#062B3A] via-[#083D49] to-[#00A887] rounded-[32px] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[90px] -mr-48 -mt-48"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="bg-[#FFBD24] text-slate-900 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              SUPABASE CMS ENGINE
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black">
              Dashboard CMS Sekolah
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              Kelola seluruh konten website SDN SUMBEREJO 04 secara terpusat dengan database Supabase, penyimpanan berkas Storage, dan fitur lengkap.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="bg-[#00A887] hover:bg-[#FFBD24] text-white hover:text-slate-900 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg flex items-center gap-2 text-xs"
            >
              <span>Buka Website Publik</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3.5 rounded-2xl transition-all text-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Database className="w-4 h-4 text-[#20D6A0]" />
              <span>{isSeeding ? 'Memproses Seed...' : 'Seed Initial Data'}</span>
            </button>
          </div>
        </div>

        {seedMessage && (
          <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs font-mono text-[#20D6A0] flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {seedMessage}
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Artikel Berita" 
          value={stats.news} 
          icon={<Newspaper className="w-6 h-6" />} 
          color="bg-emerald-600" 
          trend="Supabase DB"
        />
        <StatCard 
          label="Total Guru" 
          value={stats.teachers} 
          icon={<Users className="w-6 h-6" />} 
          color="bg-teal-600" 
        />
        <StatCard 
          label="Total Staff" 
          value={stats.staff} 
          icon={<FileText className="w-6 h-6" />} 
          color="bg-indigo-600" 
        />
        <StatCard 
          label="Album Galeri" 
          value={stats.albums} 
          icon={<ImageIcon className="w-6 h-6" />} 
          color="bg-purple-600" 
        />
        <StatCard 
          label="Prestasi Siswa" 
          value={stats.achievements} 
          icon={<Trophy className="w-6 h-6" />} 
          color="bg-amber-500" 
        />
        <StatCard 
          label="Agenda & Pengumuman" 
          value={stats.agenda + stats.announcements} 
          icon={<Calendar className="w-6 h-6" />} 
          color="bg-rose-500" 
        />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent News List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#00A887]" />
              Berita & Artikel Terbaru
            </h2>
            <span className="text-xs text-slate-400 font-medium">Terhubung PostgreSQL</span>
          </div>

          <div className="space-y-4">
            {recentNews.length > 0 ? (
              recentNews.map((news) => (
                <div
                  key={news.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-[#00A887] transition-all"
                >
                  {news.thumbnail_url ? (
                    <img
                      src={news.thumbnail_url}
                      alt={news.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                      <Newspaper className="w-6 h-6 text-slate-400" />
                    </div>
                  )}

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00A887]/10 text-[#00A887]">
                        {news.category || 'Berita'}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          news.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {news.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {news.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {news.excerpt || news.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic p-4 text-center">
                Belum ada berita. Klik "Seed Initial Data" untuk mengunggah sampel berita.
              </p>
            )}
          </div>
        </div>

        {/* Active Announcements */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h3 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FFBD24]" />
            Pengumuman Aktif
          </h3>

          <div className="space-y-4">
            {activeAnnouncements.length > 0 ? (
              activeAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2"
                >
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/80 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center p-4">
                Tidak ada pengumuman aktif saat ini.
              </p>
            )}
          </div>

          <div className="p-4 bg-[#062B3A] text-white rounded-2xl space-y-2 text-xs">
            <p className="font-bold text-[#20D6A0]">● Supabase Storage Active</p>
            <p className="text-slate-300">
              Setiap berkas logo, hero, foto guru, dan dokumen tersimpan langsung di bucket <code className="text-[#FFBD24]">school-assets</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
