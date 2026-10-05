import React, { useState, useEffect } from 'react';
import {
  formatImageUrl,
  getMediaEmbedType,
  getYouTubeEmbedUrl,
  getGoogleDriveEmbedUrl,
  compressImageFile,
  storeVideoBlob,
  useResolvedMediaUrl,
  extractVideoThumbnail,
  saveVideoToFirestore,
  handleFileUpload,
} from '../utils/mediaUtils';
import {
  Language,
  DatabaseSchema,
  TeacherItem,
  NewsItem,
  HeroSlide,
  GalleryItem,
  FacilityItem,
  ExtracurricularItem,
  SchoolEventItem,
} from '../types';
import {
  getDatabase,
  saveDatabase,
  resetDatabaseToDefaults,
  exportDatabaseJSON,
  importDatabaseJSON,
  subscribeToDatabase,
  getAdminCredentials,
  saveAdminCredentials,
} from '../services/database';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  Database,
  X,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Users,
  Newspaper,
  School,
  FileText,
  Mail,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Camera,
  Building,
  Award,
  Calendar as CalendarIcon,
  Video,
  Film,
  Image as ImageIcon,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Share2,
  MapPin,
  KeyRound,
  Key,
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldAlert,
  Home,
  LogOut,
} from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialTab?:
    | 'info'
    | 'hero'
    | 'teachers'
    | 'news'
    | 'gallery'
    | 'facilities'
    | 'extracurriculars'
    | 'events'
    | 'ppdb'
    | 'messages'
    | 'raw'
    | 'account';
}

const HeroCardPreview: React.FC<{
  slide: HeroSlide;
  onDelete: (id: string) => void;
}> = ({ slide, onDelete }) => {
  const videoTarget = slide.videoUrl || (slide.mediaType === 'video' ? slide.image : '');
  const resolvedVideo = useResolvedMediaUrl(videoTarget);
  const embedType = getMediaEmbedType(videoTarget);
  const imageUrl = formatImageUrl(slide.image);
  const isVid = slide.mediaType === 'video' || embedType !== 'none';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
      <div className="relative h-36 w-full bg-slate-900">
        {embedType === 'youtube' && videoTarget ? (
          <iframe
            src={getYouTubeEmbedUrl(videoTarget, false)}
            title={slide.title.ID}
            className="w-full h-full object-cover pointer-events-none opacity-80 border-0"
          />
        ) : embedType === 'gdrive' && videoTarget ? (
          <iframe
            src={getGoogleDriveEmbedUrl(videoTarget)}
            title={slide.title.ID}
            className="w-full h-full object-cover pointer-events-none opacity-80 border-0"
          />
        ) : isVid && resolvedVideo ? (
          <video
            src={resolvedVideo}
            poster={imageUrl || undefined}
            muted
            className="w-full h-full object-cover opacity-80"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={slide.title.ID}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-medium">
            Tanpa Media
          </div>
        )}
        <div className="absolute top-2 right-2">
          {isVid ? (
            <span className="inline-flex items-center gap-1 bg-indigo-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow backdrop-blur-sm">
              <Video className="w-3 h-3" /> VIDIO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-emerald-700/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow backdrop-blur-sm">
              <ImageIcon className="w-3 h-3" /> FOTO
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-end text-white">
          <div className="font-bold text-xs line-clamp-1">{slide.title.ID}</div>
          <div className="text-[10px] text-emerald-200 line-clamp-1">{slide.subtitle.ID}</div>
        </div>
      </div>
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-[11px] text-gray-500 font-mono">ID: {slide.id}</div>
        <button
          onClick={() => onDelete(slide.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs font-sans"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  language,
  initialTab = 'info',
}) => {
  const [db, setDb] = useState<DatabaseSchema>(getDatabase());
  const [activeTab, setActiveTab] = useState<
    | 'info'
    | 'hero'
    | 'teachers'
    | 'news'
    | 'gallery'
    | 'facilities'
    | 'extracurriculars'
    | 'events'
    | 'ppdb'
    | 'messages'
    | 'raw'
    | 'account'
  >(initialTab);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Admin Account credentials management states
  const [user, setUser] = useState<any>(null);
  const [accountStatus, setAccountStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      setAccountStatus({ type: 'error', text: 'Gagal logout.' });
    }
  };

  // Form states for adding teacher
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState<{
    name: string;
    nip: string;
    education: string;
    category: 'pimpinan' | 'guru_kelas' | 'guru_bidang' | 'staf';
    roleID: string;
    photo: string;
    quoteText: string;
  }>({
    name: '',
    nip: '',
    education: '',
    category: 'guru_kelas',
    roleID: 'Guru Kelas',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quoteText: '',
  });

  // Form states for adding news
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNews, setNewNews] = useState({
    titleID: '',
    summaryID: '',
    contentID: '',
    category: 'Kegiatan' as const,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  });

  // Form states for Hero Slides
  const [showAddHero, setShowAddHero] = useState(false);
  const [newHero, setNewHero] = useState<{
    titleID: string;
    subtitleID: string;
    image: string;
    mediaType: 'image' | 'video';
    videoUrl: string;
  }>({
    titleID: '',
    subtitleID: '',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    videoUrl: '',
  });

  // Form states for Gallery Items
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [newGallery, setNewGallery] = useState<{
    titleID: string;
    category: 'seni' | 'olahraga' | 'pramuka' | 'lingkungan' | 'upacara';
    type: 'photo' | 'video';
    url: string;
    descriptionID: string;
  }>({
    titleID: '',
    category: 'lingkungan',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    descriptionID: '',
  });

  // Form states for Facility Items
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFacility, setNewFacility] = useState({
    nameID: '',
    category: 'Akademik' as 'Akademik' | 'Seni & Olahraga' | 'Umum' | 'Sains & Tekno',
    descriptionID: '',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  });

  // Form states for Extracurricular Items
  const [showAddEkskul, setShowAddEkskul] = useState(false);
  const [newEkskul, setNewEkskul] = useState({
    nameID: '',
    category: 'Seni' as 'Seni' | 'Olahraga' | 'Akademik & Sains' | 'Kepemimpinan',
    scheduleID: 'Sabtu, 08.00 - 10.00 WIB',
    descriptionID: '',
    coach: 'Pembina Eskul',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  });

  // Form states for School Events (Kalender)
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<{
    titleID: string;
    titleEN: string;
    category: 'libur' | 'ujian' | 'p5' | 'raport' | 'kegiatan' | 'ppdb';
    dateStart: string;
    dateEnd: string;
    displayDate: string;
    time: string;
    location: string;
    target: string;
    descriptionID: string;
    descriptionEN: string;
  }>({
    titleID: '',
    titleEN: '',
    category: 'kegiatan',
    dateStart: new Date().toISOString().split('T')[0],
    dateEnd: '',
    displayDate: '',
    time: '07.30 - 12.00 WIB',
    location: 'SDN SUMBEREJO 04',
    target: 'Seluruh Siswa',
    descriptionID: '',
    descriptionEN: '',
  });

  // Image Upload Handlers
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 800, 800, 0.8).then((dataUrl) => {
      setDb((prev) => ({
        ...prev,
        schoolInfo: {
          ...prev.schoolInfo,
          logoUrl: dataUrl,
        },
      }));
    });
  };

  const handleTeacherPhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 800, 800, 0.75).then((dataUrl) => {
      setNewTeacher((prev) => ({ ...prev, photo: dataUrl }));
    });
  };

  const handleNewsImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 1200, 800, 0.75).then((dataUrl) => {
      setNewNews((prev) => ({ ...prev, image: dataUrl }));
    });
  };

  const handleHeroImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 1400, 900, 0.75).then((dataUrl) => {
      setNewHero((prev) => ({ ...prev, image: dataUrl, mediaType: 'image' }));
    });
  };

  const handleHeroVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg(`Mengekstrak gambar & memproses video "${file.name}"... Mohon tunggu.`);

    try {
      const { url: videoUrlString, thumbnail } = await handleFileUpload(file, 'video', { idPrefix: 'hero_vid' });

      setNewHero((prev) => ({
        ...prev,
        image: thumbnail || prev.image,
        videoUrl: videoUrlString,
        mediaType: 'video',
      }));

      setStatusMsg(`Video "${file.name}" & gambar sampul berhasil dipasang! Tersinkronisasi REALTIME ke semua perangkat.`);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      console.error('Video upload error:', err);
      const errMsg = err instanceof Error ? err.message : 'Gagal memproses video.';
      setStatusMsg(errMsg);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleGalleryImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 1200, 900, 0.75).then((dataUrl) => {
      setNewGallery((prev) => ({ ...prev, url: dataUrl, type: 'photo' }));
    });
  };

  const handleGalleryVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg(`Memproses video galeri "${file.name}"... Mohon tunggu.`);
    try {
      const { url: videoUrlString } = await handleFileUpload(file, 'video', { idPrefix: 'gallery_vid' });
      setNewGallery((prev) => ({ ...prev, url: videoUrlString, type: 'video' }));
      setStatusMsg(`Video galeri "${file.name}" berhasil dipasang.`);
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err) {
      console.error('Gallery video upload error:', err);
      const errMsg = err instanceof Error ? err.message : 'Gagal memproses video galeri.';
      setStatusMsg(errMsg);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleFacilityImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 1200, 800, 0.75).then((dataUrl) => {
      setNewFacility((prev) => ({ ...prev, image: dataUrl }));
    });
  };

  const handleEkskulImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, 1200, 800, 0.75).then((dataUrl) => {
      setNewEkskul((prev) => ({ ...prev, image: dataUrl }));
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToDatabase(() => {
      setDb(getDatabase());
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSaveSchoolInfo = (e: React.FormEvent) => {
    e.preventDefault();
    saveDatabase(db);
    setStatusMsg('Informasi sekolah berhasil diperbarui di Database!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteTeacher = (id: string) => {
    const updated = db.teachers.filter((t) => t.id !== id);
    const newDb = { ...db, teachers: updated };
    saveDatabase(newDb);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name) return;

    const teacherData: TeacherItem = {
      id: editingTeacherId || `t-${Date.now()}`,
      name: newTeacher.name,
      nip: newTeacher.nip || undefined,
      education: newTeacher.education || 'S1 Pendidikan',
      category: newTeacher.category,
      role: { ID: newTeacher.roleID || 'Guru Pengajar', EN: newTeacher.roleID || 'Teacher' },
      photo: newTeacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      quote: newTeacher.quoteText ? { ID: newTeacher.quoteText, EN: newTeacher.quoteText } : undefined,
    };

    let updatedTeachers: TeacherItem[];
    if (editingTeacherId) {
      updatedTeachers = db.teachers.map((t) => (t.id === editingTeacherId ? teacherData : t));
    } else {
      updatedTeachers = [...db.teachers, teacherData];
    }

    const newDb = { ...db, teachers: updatedTeachers };
    saveDatabase(newDb);
    setShowAddTeacher(false);
    setEditingTeacherId(null);
    setNewTeacher({
      name: '',
      nip: '',
      education: '',
      category: 'guru_kelas',
      roleID: 'Guru Kelas',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      quoteText: '',
    });
    setStatusMsg(editingTeacherId ? 'Data guru berhasil diperbarui!' : 'Guru baru berhasil ditambahkan!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleStartEditTeacher = (teacher: TeacherItem) => {
    setEditingTeacherId(teacher.id);
    setNewTeacher({
      name: teacher.name,
      nip: teacher.nip || '',
      education: teacher.education,
      category: teacher.category,
      roleID: teacher.role.ID,
      photo: teacher.photo,
      quoteText: teacher.quote?.ID || '',
    });
    setShowAddTeacher(true);
  };

  const handleDeleteNews = (id: string) => {
    const updated = db.newsArticles.filter((n) => n.id !== id);
    const newDb = { ...db, newsArticles: updated };
    saveDatabase(newDb);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.titleID) return;
    const item: NewsItem = {
      id: `news-${Date.now()}`,
      title: { ID: newNews.titleID, EN: newNews.titleID },
      summary: { ID: newNews.summaryID, EN: newNews.summaryID },
      content: { ID: newNews.contentID, EN: newNews.contentID },
      category: newNews.category,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      image: newNews.image,
      author: 'Admin Database SDN SUMBEREJO 04',
      readTime: '3 menit',
    };
    const newDb = { ...db, newsArticles: [item, ...db.newsArticles] };
    saveDatabase(newDb);
    setShowAddNews(false);
    setNewNews({
      titleID: '',
      summaryID: '',
      contentID: '',
      category: 'Kegiatan',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    });
    setStatusMsg('Berita baru berhasil ditambahkan ke Database!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Hero Slide handlers
  const handleDeleteHero = (id: string) => {
    const updated = db.heroSlides.filter((h) => h.id !== id);
    saveDatabase({ ...db, heroSlides: updated });
  };

  const handleCreateHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHero.titleID) return;
    const item: HeroSlide = {
      id: `hero-${Date.now()}`,
      title: { ID: newHero.titleID, EN: newHero.titleID },
      subtitle: { ID: newHero.subtitleID, EN: newHero.subtitleID },
      image: newHero.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      mediaType: newHero.mediaType,
      videoUrl: newHero.mediaType === 'video' ? (newHero.videoUrl || newHero.image) : undefined,
    };
    saveDatabase({ ...db, heroSlides: [...db.heroSlides, item] });
    setShowAddHero(false);
    setNewHero({
      titleID: '',
      subtitleID: '',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      mediaType: 'image',
      videoUrl: '',
    });
    setStatusMsg('Banner slide hero baru berhasil ditambahkan!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Gallery handlers
  const handleDeleteGallery = (id: string) => {
    const updated = db.galleryItems.filter((g) => g.id !== id);
    saveDatabase({ ...db, galleryItems: updated });
  };

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.titleID) return;
    const isVideoEmbed = getMediaEmbedType(newGallery.url) !== 'none';
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: { ID: newGallery.titleID, EN: newGallery.titleID },
      category: newGallery.category,
      type: isVideoEmbed ? 'video' : newGallery.type,
      url: newGallery.url,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      description: {
        ID: newGallery.descriptionID || newGallery.titleID,
        EN: newGallery.descriptionID || newGallery.titleID,
      },
    };
    saveDatabase({ ...db, galleryItems: [item, ...db.galleryItems] });
    setShowAddGallery(false);
    setNewGallery({
      titleID: '',
      category: 'lingkungan',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      descriptionID: '',
    });
    setStatusMsg('Media galeri baru berhasil disimpan ke Database!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Facility handlers
  const handleDeleteFacility = (id: string) => {
    const updated = db.facilities.filter((f) => f.id !== id);
    saveDatabase({ ...db, facilities: updated });
  };

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacility.nameID) return;
    const item: FacilityItem = {
      id: `fac-${Date.now()}`,
      name: { ID: newFacility.nameID, EN: newFacility.nameID },
      description: { ID: newFacility.descriptionID, EN: newFacility.descriptionID },
      category: newFacility.category,
      image: newFacility.image,
      features: [{ ID: 'Fasilitas Terstandar', EN: 'Standard Facility' }],
    };
    saveDatabase({ ...db, facilities: [...db.facilities, item] });
    setShowAddFacility(false);
    setNewFacility({
      nameID: '',
      category: 'Akademik',
      descriptionID: '',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    });
    setStatusMsg('Fasilitas sekolah baru berhasil ditambahkan!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Extracurricular handlers
  const handleDeleteEkskul = (id: string) => {
    const updated = db.extracurriculars.filter((ex) => ex.id !== id);
    saveDatabase({ ...db, extracurriculars: updated });
  };

  const handleCreateEkskul = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEkskul.nameID) return;
    const item: ExtracurricularItem = {
      id: `ex-${Date.now()}`,
      name: { ID: newEkskul.nameID, EN: newEkskul.nameID },
      category: newEkskul.category,
      schedule: { ID: newEkskul.scheduleID, EN: newEkskul.scheduleID },
      description: { ID: newEkskul.descriptionID, EN: newEkskul.descriptionID },
      coach: newEkskul.coach,
      image: newEkskul.image,
    };
    saveDatabase({ ...db, extracurriculars: [...db.extracurriculars, item] });
    setShowAddEkskul(false);
    setNewEkskul({
      nameID: '',
      category: 'Seni',
      scheduleID: 'Sabtu, 08.00 - 10.00 WIB',
      descriptionID: '',
      coach: 'Pembina Eskul',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    });
    setStatusMsg('Ekstrakurikuler baru berhasil ditambahkan!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = (db.schoolEvents || []).filter((e) => e.id !== id);
    const newDb = { ...db, schoolEvents: updated };
    saveDatabase(newDb);
    setStatusMsg('Agenda kegiatan berhasil dihapus!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleStartEditEvent = (ev: SchoolEventItem) => {
    setEditingEventId(ev.id);
    setNewEvent({
      titleID: ev.title.ID,
      titleEN: ev.title.EN || ev.title.ID,
      category: ev.category,
      dateStart: ev.dateStart,
      dateEnd: ev.dateEnd || '',
      displayDate: ev.displayDate,
      time: ev.time || '07.30 - 12.00 WIB',
      location: ev.location || 'SDN SUMBEREJO 04',
      target: ev.target || 'Seluruh Siswa',
      descriptionID: ev.description.ID,
      descriptionEN: ev.description.EN || ev.description.ID,
    });
    setShowAddEvent(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.titleID || !newEvent.dateStart) return;

    const eventItem: SchoolEventItem = {
      id: editingEventId || `ev-${Date.now()}`,
      title: {
        ID: newEvent.titleID,
        EN: newEvent.titleEN || newEvent.titleID,
      },
      category: newEvent.category,
      dateStart: newEvent.dateStart,
      dateEnd: newEvent.dateEnd || undefined,
      displayDate: newEvent.displayDate || newEvent.dateStart,
      time: newEvent.time,
      location: newEvent.location,
      target: newEvent.target,
      description: {
        ID: newEvent.descriptionID || newEvent.titleID,
        EN: newEvent.descriptionEN || newEvent.descriptionID || newEvent.titleID,
      },
    };

    let updatedEvents: SchoolEventItem[];
    const currentEvents = db.schoolEvents || [];
    if (editingEventId) {
      updatedEvents = currentEvents.map((item) => (item.id === editingEventId ? eventItem : item));
    } else {
      updatedEvents = [eventItem, ...currentEvents];
    }

    const newDb = { ...db, schoolEvents: updatedEvents };
    saveDatabase(newDb);
    setShowAddEvent(false);
    setEditingEventId(null);
    setNewEvent({
      titleID: '',
      titleEN: '',
      category: 'kegiatan',
      dateStart: new Date().toISOString().split('T')[0],
      dateEnd: '',
      displayDate: '',
      time: '07.30 - 12.00 WIB',
      location: 'SDN SUMBEREJO 04',
      target: 'Seluruh Siswa',
      descriptionID: '',
      descriptionEN: '',
    });
    setStatusMsg(editingEventId ? 'Agenda kegiatan berhasil diperbarui!' : 'Agenda kegiatan baru berhasil ditambahkan!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin meriset seluruh database ke data awal murni SDN SUMBEREJO 04?'
      )
    ) {
      resetDatabaseToDefaults();
      setStatusMsg('Database berhasil diriset ke versi awal SDN SUMBEREJO 04!');
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && importDatabaseJSON(text)) {
        setStatusMsg('Database berhasil diimpor dari file JSON!');
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        alert('File JSON tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[88vh] overflow-hidden shadow-2xl flex flex-col animate-fadeIn border border-gray-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Local Storage & Service Database Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-black">
                {language === 'ID'
                  ? 'Pengelola Database SDN SUMBEREJO 04'
                  : 'SDN SUMBEREJO 04 Database Manager'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div className="bg-emerald-100 border-b border-emerald-200 text-emerald-900 px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 pt-3 flex items-center gap-2 overflow-x-auto text-xs font-bold text-gray-600 shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'info'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Profil Sekolah</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'hero'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Banner Hero ({db.heroSlides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'teachers'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guru & Staff ({db.teachers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'news'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Berita ({db.newsArticles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'gallery'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Galeri Foto ({db.galleryItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'facilities'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Fasilitas ({db.facilities.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('extracurriculars')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'extracurriculars'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Ekstrakurikuler ({db.extracurriculars.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'events'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <span>Kalender Kegiatan ({(db.schoolEvents || []).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ppdb')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ppdb'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PPDB ({db.ppdbRegistrations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'messages'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Pesan ({db.contactMessages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'raw'
                ? 'border-emerald-700 text-emerald-800 bg-white shadow-sm'
                : 'border-transparent hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'account'
                ? 'border-indigo-700 text-indigo-950 bg-white shadow-sm font-bold'
                : 'border-transparent text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50/50'
            }`}
          >
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Akun & Password Admin</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SCHOOL INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveSchoolInfo} className="space-y-4">
              {/* Quick Admin Account Settings Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <KeyRound className="w-5 h-5 text-indigo-700 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-indigo-950">
                      Pengaturan Akun & Password Admin
                    </div>
                    <div className="text-[11px] text-indigo-800">
                      Ubah ID Username & Password login Portal SIAP atau reset kredensial.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('account')}
                  className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Buka Tab Akun Admin</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-gray-900">
                Ubah Profil Sekolah di Database Utama
              </h3>

              {/* Logo Sekolah Upload Section */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-emerald-950 uppercase">
                  Logo Resmi Sekolah (Profil Sekolah)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-300 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {db.schoolInfo.logoUrl ? (
                      <img
                        src={db.schoolInfo.logoUrl}
                        alt="Logo Sekolah"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1">
                        <GraduationCap className="w-6 h-6 text-emerald-700 mx-auto" />
                        <span className="text-[9px] font-bold text-emerald-800">No Logo</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih File Logo (Upload Gambar)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                      {db.schoolInfo.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setDb({
                              ...db,
                              schoolInfo: { ...db.schoolInfo, logoUrl: undefined },
                            })
                          }
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                        >
                          Hapus Logo
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Atau masukkan URL gambar logo (https://...)"
                      value={db.schoolInfo.logoUrl || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          schoolInfo: { ...db.schoolInfo, logoUrl: e.target.value },
                        })
                      }
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={db.schoolInfo.name}
                    onChange={(e) =>
                      setDb({
                        ...db,
                        schoolInfo: { ...db.schoolInfo, name: e.target.value },
                      })
                    }
                    className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    NPSN
                  </label>
                  <input
                    type="text"
                    value={db.schoolInfo.npsn}
                    onChange={(e) =>
                      setDb({
                        ...db,
                        schoolInfo: { ...db.schoolInfo, npsn: e.target.value },
                      })
                    }
                    className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Motto Sekolah (ID)
                  </label>
                  <input
                    type="text"
                    value={db.schoolInfo.motto.ID}
                    onChange={(e) =>
                      setDb({
                        ...db,
                        schoolInfo: {
                          ...db.schoolInfo,
                          motto: { ...db.schoolInfo.motto, ID: e.target.value },
                        },
                      })
                    }
                    className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nomor Telepon / WA
                  </label>
                  <input
                    type="text"
                    value={db.schoolInfo.phone}
                    onChange={(e) =>
                      setDb({
                        ...db,
                        schoolInfo: { ...db.schoolInfo, phone: e.target.value },
                      })
                    }
                    className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={db.schoolInfo.address}
                  onChange={(e) =>
                    setDb({
                      ...db,
                      schoolInfo: { ...db.schoolInfo, address: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>URL Embed Google Maps (Iframe Src)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/maps?q=...&output=embed"
                  value={db.schoolInfo.mapsEmbedUrl || ''}
                  onChange={(e) =>
                    setDb({
                      ...db,
                      schoolInfo: { ...db.schoolInfo, mapsEmbedUrl: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Atur link embed lokasi presisi Google Maps. Jika dikosongkan, sistem akan otomatis mengarahkan peta berdasarkan nama & alamat sekolah.
                </p>
              </div>

              {/* PENGATURAN MEDIA SOSIAL (5 MEDSOS) */}
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Pengaturan Tautan Media Sosial Sekolah (5 Medsos)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Masukkan URL tautan resmi untuk Facebook, Instagram, WhatsApp, TikTok, dan YouTube yang tampil di floating bar samping & footer.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {/* 1. Facebook */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#1877F2] text-white flex items-center justify-center">
                        <Facebook className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span>URL Facebook Sekolah</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={db.schoolInfo.social?.facebook || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          schoolInfo: {
                            ...db.schoolInfo,
                            social: {
                              ...db.schoolInfo.social,
                              facebook: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                    />
                  </div>

                  {/* 2. Instagram */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#f09433] to-[#bc1888] text-white flex items-center justify-center">
                        <Instagram className="w-3.5 h-3.5" />
                      </div>
                      <span>URL Instagram Sekolah</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={db.schoolInfo.social?.instagram || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          schoolInfo: {
                            ...db.schoolInfo,
                            social: {
                              ...db.schoolInfo.social,
                              instagram: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                    />
                  </div>

                  {/* 3. WhatsApp */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#25D366] text-white flex items-center justify-center">
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span>URL / Link WhatsApp Chat</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://wa.me/6285733445566"
                      value={db.schoolInfo.social?.whatsapp || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          schoolInfo: {
                            ...db.schoolInfo,
                            social: {
                              ...db.schoolInfo.social,
                              whatsapp: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                    />
                  </div>

                  {/* 4. TikTok */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.15 6.394 6.394 0 0 0 1.637 9.8 6.32 6.32 0 0 0 8.012-1.921A6.386 6.386 0 0 0 15.8 15.111V8.67a8.211 8.211 0 0 0 4.789 1.516v-3.5a4.796 4.796 0 0 0-1-.0a" />
                        </svg>
                      </div>
                      <span>URL TikTok Sekolah</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://tiktok.com/@..."
                      value={db.schoolInfo.social?.tiktok || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          schoolInfo: {
                            ...db.schoolInfo,
                            social: {
                              ...db.schoolInfo.social,
                              tiktok: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                    />
                  </div>

                  {/* 5. YouTube */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#FF0000] text-white flex items-center justify-center">
                        <Youtube className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span>URL Channel YouTube Sekolah</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/@..."
                      value={db.schoolInfo.social?.youtube || ''}
                      onChange={(e) =>
                        setDb({
                          ...db,
                          schoolInfo: {
                            ...db.schoolInfo,
                            social: {
                              ...db.schoolInfo.social,
                              youtube: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Simpan Perubahan Sekolah
              </button>
            </form>
          )}

          {/* TAB 2: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Daftar Guru & Staff ({db.teachers.length})
                </h3>
                <button
                  onClick={() => {
                    setEditingTeacherId(null);
                    setNewTeacher({
                      name: '',
                      nip: '',
                      education: '',
                      category: 'guru_kelas',
                      roleID: 'Guru Kelas',
                      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                      quoteText: '',
                    });
                    setShowAddTeacher(!showAddTeacher);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddTeacher ? 'Batal' : 'Tambah Guru Baru'}</span>
                </button>
              </div>

              {showAddTeacher && (
                <form
                  onSubmit={handleSaveTeacher}
                  className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-4 shadow-sm"
                >
                  <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                    {editingTeacherId ? 'Edit Data Guru & Staf' : 'Form Tambah Guru & Staf Baru'}
                  </h4>

                  {/* Upload Foto Guru */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Upload Foto Profil Guru / Staf
                    </label>
                    <div className="flex items-center gap-4">
                      {newTeacher.photo ? (
                        <img
                          src={newTeacher.photo}
                          alt="Pratinjau Guru"
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-dashed border-emerald-300 flex items-center justify-center text-emerald-700 text-[10px] shrink-0 font-bold">
                          Foto
                        </div>
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Guru (Upload)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleTeacherPhotoFileUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL foto (https://...)"
                          value={newTeacher.photo}
                          onChange={(e) =>
                            setNewTeacher({ ...newTeacher, photo: e.target.value })
                          }
                          className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nama Lengkap & Gelar *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Drs. Ahmad Dahlan, M.Pd."
                        required
                        value={newTeacher.name}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, name: e.target.value })
                        }
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        NIP / Nomor Identitas Resmi
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 19850312 201001 1 008"
                        value={newTeacher.nip}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, nip: e.target.value })
                        }
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Jabatan / Peran
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Wali Kelas 4 & Pembina Pramuka"
                        value={newTeacher.roleID}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, roleID: e.target.value })
                        }
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Kategori SDM
                      </label>
                      <select
                        value={newTeacher.category}
                        onChange={(e) =>
                          setNewTeacher({
                            ...newTeacher,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-semibold"
                      >
                        <option value="pimpinan">Pimpinan Sekolah</option>
                        <option value="guru_kelas">Wali Kelas / Guru SD</option>
                        <option value="guru_bidang">Guru Bidang Studi</option>
                        <option value="staf">Staf & Perpustakaan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Pendidikan Terakhir
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: S1 PGSD - Universitas Negeri Malang"
                        value={newTeacher.education}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, education: e.target.value })
                        }
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Moto / Kata Mutiara Mengajar Guru
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Mendidik anak dengan keikhlasan, keteladanan, dan kasih sayang tanpa batas."
                      value={newTeacher.quoteText}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, quoteText: e.target.value })
                      }
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 italic text-emerald-950"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
                    >
                      {editingTeacherId ? 'Simpan Perubahan' : 'Simpan Guru ke Database'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTeacher(false);
                        setEditingTeacherId(null);
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {db.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 p-3.5 rounded-2xl text-xs gap-3 hover:border-emerald-300 transition-colors shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-emerald-500 shadow-sm"
                      />
                      <div className="space-y-0.5">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <span>{teacher.name}</span>
                          {teacher.nip && (
                            <span className="text-[10px] font-mono font-normal bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              NIP: {teacher.nip}
                            </span>
                          )}
                        </div>
                        <div className="text-emerald-700 font-semibold">
                          {teacher.role.ID} • <span className="text-gray-500 font-normal">{teacher.education}</span>
                        </div>
                        {teacher.quote?.ID && (
                          <div className="text-[11px] italic text-emerald-900 bg-emerald-50/70 px-2.5 py-1 rounded-lg mt-1 border border-emerald-100">
                            "{teacher.quote.ID}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleStartEditTeacher(teacher)}
                        className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 font-bold"
                        title="Edit Data Guru"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline text-[11px]">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Guru"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Daftar Berita & Pengumuman ({db.newsArticles.length})
                </h3>
                <button
                  onClick={() => setShowAddNews(!showAddNews)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddNews ? 'Batal' : 'Tambah Berita Baru'}</span>
                </button>
              </div>

              {showAddNews && (
                <form
                  onSubmit={handleCreateNews}
                  className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3"
                >
                  <h4 className="font-bold text-xs text-emerald-950 uppercase">
                    Form Tulis Berita Baru
                  </h4>

                  {/* Upload Foto Berita */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Upload Foto Sampul Berita
                    </label>
                    <div className="flex items-center gap-4">
                      {newNews.image ? (
                        <img
                          src={newNews.image}
                          alt="Sampul Berita"
                          className="w-20 h-14 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-14 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[10px] shrink-0 font-medium">
                          Foto
                        </div>
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Sampul (Upload)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleNewsImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL foto (https://...)"
                          value={newNews.image}
                          onChange={(e) =>
                            setNewNews({ ...newNews, image: e.target.value })
                          }
                          className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Judul Berita *"
                    required
                    value={newNews.titleID}
                    onChange={(e) =>
                      setNewNews({ ...newNews, titleID: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={newNews.category}
                      onChange={(e) =>
                        setNewNews({
                          ...newNews,
                          category: e.target.value as any,
                        })
                      }
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Prestasi">Prestasi</option>
                      <option value="Akademik">Akademik</option>
                      <option value="Pengumuman">Pengumuman</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan Singkat Berita *"
                    value={newNews.summaryID}
                    onChange={(e) =>
                      setNewNews({ ...newNews, summaryID: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                  />
                  <textarea
                    rows={4}
                    placeholder="Isi Konten Berita Lengkap *"
                    value={newNews.contentID}
                    onChange={(e) =>
                      setNewNews({ ...newNews, contentID: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Simpan Berita ke Database
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {db.newsArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-2xl text-xs gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={article.image}
                        alt={article.title.ID}
                        className="w-14 h-10 rounded-xl object-cover shrink-0 border border-gray-200"
                      />
                      <div>
                        <div className="font-bold text-gray-900">{article.title.ID}</div>
                        <div className="text-[11px] text-gray-500">
                          {article.date} • Kategori: {article.category}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNews(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HERO SLIDES (BANNER UTAMA) */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Pengaturan Banner & Hero Slider Beranda ({db.heroSlides.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Atur media (Vidio / Foto) latar belakang, judul, dan deskripsi tampilan awal beranda sekolah.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddHero(!showAddHero)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddHero ? 'Batal' : 'Tambah Banner Slide'}</span>
                </button>
              </div>

              {showAddHero && (
                <form
                  onSubmit={handleCreateHero}
                  className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                      Form Tambah Media Banner Beranda
                    </h4>
                    {/* Select Media Type */}
                    <div className="flex items-center gap-1 bg-emerald-100/80 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewHero({ ...newHero, mediaType: 'image' })}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          newHero.mediaType === 'image'
                            ? 'bg-emerald-700 text-white shadow'
                            : 'text-emerald-900 hover:bg-emerald-200/60'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Mode Foto</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewHero({ ...newHero, mediaType: 'video' })}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          newHero.mediaType === 'video'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-emerald-900 hover:bg-emerald-200/60'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Mode Vidio</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Upload Foto */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>MENU UPLOAD FOTO</span>
                      </label>
                      <span className="text-[10px] text-gray-500 font-mono">Format: JPG, PNG, WEBP</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {newHero.image ? (
                        <img
                          src={newHero.image}
                          alt="Preview Banner Foto"
                          className="w-24 h-14 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-14 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[10px] shrink-0 font-medium">
                          Tanpa Foto
                        </div>
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih & Upload Foto Beranda</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Atau tautkan URL foto (https://...)"
                          value={newHero.image}
                          onChange={(e) => setNewHero({ ...newHero, image: e.target.value })}
                          className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Upload Vidio */}
                  <div className={`p-4 rounded-xl border space-y-3 transition-all ${
                    newHero.mediaType === 'video'
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/30'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-indigo-600" />
                        <span>MENU UPLOAD / TAUTAN VIDIO HERO</span>
                      </label>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Realtime Sync Lintas Device
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Film className="w-4 h-4" />
                          <span>Pilih & Upload File Vidio</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleHeroVideoFileUpload}
                            className="hidden"
                          />
                        </label>
                        {newHero.videoUrl && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Vidio Terpasang
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-indigo-950 mb-1 flex items-center justify-between">
                          <span>Atau Masukkan Link / URL Vidio (Otomatis Sync Lintas HP/Perangkat):</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Contoh: https://drive.google.com/file/d/.../view atau https://www.youtube.com/watch?v=..."
                          value={newHero.videoUrl}
                          onChange={(e) =>
                            setNewHero({ ...newHero, videoUrl: e.target.value, mediaType: 'video' })
                          }
                          className="w-full text-xs bg-white border border-gray-300 focus:border-indigo-500 rounded-xl px-3 py-2 font-mono shadow-sm"
                        />
                        <p className="text-[10px] text-indigo-700 font-medium mt-1">
                          💡 <strong>Google Drive:</strong> Salin link berbagi (Pastikan akses dibagikan: <i>"Siapa saja yang memiliki link"</i>).
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-1">
                        <span className="text-gray-500 font-medium">Contoh Tautan Cepat:</span>
                        <button
                          type="button"
                          onClick={() => setNewHero({
                            ...newHero,
                            videoUrl: 'https://drive.google.com/file/d/1v4I-QeZ8q9m_SampleDrive/view',
                            mediaType: 'video'
                          })}
                          className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md font-medium transition-colors"
                        >
                          + Google Drive Sample
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewHero({
                            ...newHero,
                            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                            mediaType: 'video'
                          })}
                          className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition-colors"
                        >
                          + YouTube Sample
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewHero({
                            ...newHero,
                            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                            mediaType: 'video'
                          })}
                          className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors"
                        >
                          + MP4 Direct Sample
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <input
                      type="text"
                      placeholder="Judul Utama Banner Slide *"
                      required
                      value={newHero.titleID}
                      onChange={(e) => setNewHero({ ...newHero, titleID: e.target.value })}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 font-bold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Subjudul / Deskripsi Ringkas Banner *"
                      required
                      value={newHero.subtitleID}
                      onChange={(e) => setNewHero({ ...newHero, subtitleID: e.target.value })}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3.5 py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Simpan Banner Slide ke Database</span>
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {db.heroSlides.map((slide) => (
                  <HeroCardPreview
                    key={slide.id}
                    slide={slide}
                    onDelete={handleDeleteHero}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALLERY ITEMS */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Galeri Foto & Vidio Dokumentasi Sekolah ({db.galleryItems.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Kelola foto dan vidio kegiatan siswa, fasilitas, upacara, dan prestasi sekolah.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddGallery(!showAddGallery)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddGallery ? 'Batal' : 'Tambah Media Galeri'}</span>
                </button>
              </div>

              {showAddGallery && (
                <form
                  onSubmit={handleCreateGallery}
                  className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                      Form Tambah Media Galeri
                    </h4>
                    {/* Select Media Type for Gallery */}
                    <div className="flex items-center gap-1 bg-emerald-100/80 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewGallery({ ...newGallery, type: 'photo' })}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          newGallery.type === 'photo'
                            ? 'bg-emerald-700 text-white shadow'
                            : 'text-emerald-900 hover:bg-emerald-200/60'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Foto</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewGallery({ ...newGallery, type: 'video' })}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          newGallery.type === 'video'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-emerald-900 hover:bg-emerald-200/60'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Vidio</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Upload Foto Menu */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>MENU UPLOAD FOTO</span>
                      </label>
                      <span className="text-[10px] text-gray-500 font-mono">Image Upload</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {newGallery.type === 'photo' && (
                        <img
                          src={newGallery.url}
                          alt="Preview Foto"
                          className="w-20 h-16 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-sm"
                        />
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih & Upload Foto dari Perangkat</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Upload Vidio Menu */}
                  <div className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                    newGallery.type === 'video'
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/30'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-indigo-600" />
                        <span>MENU UPLOAD VIDIO</span>
                      </label>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
                        Video Upload & Link
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                        <Film className="w-3.5 h-3.5" />
                        <span>Pilih & Upload File Vidio (MP4)</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleGalleryVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      URL Media (Latar Foto / Link Vidio Google Drive / YouTube)
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan URL Gambar atau Link Vidio Google Drive / Youtube / MP4"
                      value={newGallery.url}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isVid = getMediaEmbedType(val) !== 'none';
                        setNewGallery({
                          ...newGallery,
                          url: val,
                          type: isVid ? 'video' : newGallery.type,
                        });
                      }}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-mono shadow-sm"
                    />
                    <p className="text-[10px] text-indigo-700 font-medium mt-1">
                      💡 <strong>Dukungan Google Drive:</strong> Tempelkan link Google Drive (Contoh: <i>https://drive.google.com/file/d/.../view</i>). Pastikan izin akses file di Google Drive diatur ke <i>"Siapa saja yang memiliki link"</i>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Judul Foto Galeri *"
                      required
                      value={newGallery.titleID}
                      onChange={(e) => setNewGallery({ ...newGallery, titleID: e.target.value })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    />
                    <select
                      value={newGallery.category}
                      onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="lingkungan">🌿 Lingkungan & Taman</option>
                      <option value="seni">🎨 Kesenian & Budaya</option>
                      <option value="upacara">🇮🇩 Upacara & Sains</option>
                      <option value="olahraga">🏀 Olahraga & Ekskul</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Foto *"
                    value={newGallery.descriptionID}
                    onChange={(e) => setNewGallery({ ...newGallery, descriptionID: e.target.value })}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Simpan Foto ke Galeri
                  </button>
                </form>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {db.galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.title.ID}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2.5 space-y-1">
                      <div className="font-bold text-xs text-gray-900 line-clamp-1">{item.title.ID}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase">{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Kelola Foto & Data Fasilitas Sekolah ({db.facilities.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Atur fasilitas seperti Ruang Kelas, Lab Komputer, Perpustakaan, Lapangan, dll.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddFacility(!showAddFacility)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddFacility ? 'Batal' : 'Tambah Fasilitas Baru'}</span>
                </button>
              </div>

              {showAddFacility && (
                <form
                  onSubmit={handleCreateFacility}
                  className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3"
                >
                  <h4 className="font-bold text-xs text-emerald-950 uppercase">
                    Form Tambah Fasilitas Baru
                  </h4>

                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Upload Foto Fasilitas
                    </label>
                    <div className="flex items-center gap-4">
                      {newFacility.image ? (
                        <img
                          src={newFacility.image}
                          alt="Preview Fasilitas"
                          className="w-20 h-16 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[10px] shrink-0 font-medium">
                          Foto
                        </div>
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Fasilitas (Upload)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFacilityImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL foto (https://...)"
                          value={newFacility.image}
                          onChange={(e) => setNewFacility({ ...newFacility, image: e.target.value })}
                          className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Fasilitas *"
                      required
                      value={newFacility.nameID}
                      onChange={(e) => setNewFacility({ ...newFacility, nameID: e.target.value })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    />
                    <select
                      value={newFacility.category}
                      onChange={(e) => setNewFacility({ ...newFacility, category: e.target.value as any })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Seni & Olahraga">Seni & Olahraga</option>
                      <option value="Sains & Tekno">Sains & Tekno</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Fasilitas *"
                    value={newFacility.descriptionID}
                    onChange={(e) => setNewFacility({ ...newFacility, descriptionID: e.target.value })}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Simpan Fasilitas
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {db.facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-32 w-full">
                      <img
                        src={facility.image}
                        alt={facility.name.ID}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
                        title="Hapus Fasilitas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="font-bold text-xs text-gray-900">{facility.name.ID}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{facility.category}</div>
                      <div className="text-[11px] text-gray-600 line-clamp-2">{facility.description.ID}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXTRACURRICULARS */}
          {activeTab === 'extracurriculars' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Kelola Foto & Kegiatan Ekstrakurikuler ({db.extracurriculars.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Atur kegiatan eskul seperti Pramuka, Seni Tari, Karate, Musik, Pencak Silat, dll.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEkskul(!showAddEkskul)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddEkskul ? 'Batal' : 'Tambah Eskul Baru'}</span>
                </button>
              </div>

              {showAddEkskul && (
                <form
                  onSubmit={handleCreateEkskul}
                  className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3"
                >
                  <h4 className="font-bold text-xs text-emerald-950 uppercase">
                    Form Tambah Ekstrakurikuler Baru
                  </h4>

                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Upload Foto Kegiatan Eskul
                    </label>
                    <div className="flex items-center gap-4">
                      {newEkskul.image ? (
                        <img
                          src={newEkskul.image}
                          alt="Preview Eskul"
                          className="w-20 h-16 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[10px] shrink-0 font-medium">
                          Foto
                        </div>
                      )}
                      <div className="space-y-1.5 flex-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Eskul (Upload)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEkskulImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL foto (https://...)"
                          value={newEkskul.image}
                          onChange={(e) => setNewEkskul({ ...newEkskul, image: e.target.value })}
                          className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Ekstrakurikuler *"
                      required
                      value={newEkskul.nameID}
                      onChange={(e) => setNewEkskul({ ...newEkskul, nameID: e.target.value })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    />
                    <select
                      value={newEkskul.category}
                      onChange={(e) => setNewEkskul({ ...newEkskul, category: e.target.value as any })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="Seni">Seni</option>
                      <option value="Olahraga">Olahraga</option>
                      <option value="Akademik & Sains">Akademik & Sains</option>
                      <option value="Kepemimpinan">Kepemimpinan</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Nama Pembina / Pelatih *"
                      value={newEkskul.coach}
                      onChange={(e) => setNewEkskul({ ...newEkskul, coach: e.target.value })}
                      className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Jadwal Kegiatan (Contoh: Sabtu, 08.00 - 10.00 WIB) *"
                    value={newEkskul.scheduleID}
                    onChange={(e) => setNewEkskul({ ...newEkskul, scheduleID: e.target.value })}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Singkat Eskul *"
                    value={newEkskul.descriptionID}
                    onChange={(e) => setNewEkskul({ ...newEkskul, descriptionID: e.target.value })}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Simpan Ekstrakurikuler
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {db.extracurriculars.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-32 w-full">
                      <img
                        src={ex.image}
                        alt={ex.name.ID}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeleteEkskul(ex.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
                        title="Hapus Eskul"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="font-bold text-xs text-gray-900">{ex.name.ID}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{ex.category} • Pembina: {ex.coach}</div>
                      <div className="text-[11px] text-gray-600 line-clamp-2">{ex.description.ID}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: KALENDER KEGIATAN SEKOLAH */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-700" />
                    <span>Kelola Agenda & Kalender Kegiatan Sekolah ({(db.schoolEvents || []).length})</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tambah, ubah, atau hapus jadwal ujian, libur nasional, kegiatan kokurikuler, rapat wali murid, dan event sekolah.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (showAddEvent) {
                      setShowAddEvent(false);
                      setEditingEventId(null);
                    } else {
                      setEditingEventId(null);
                      setNewEvent({
                        titleID: '',
                        titleEN: '',
                        category: 'kegiatan',
                        dateStart: new Date().toISOString().split('T')[0],
                        dateEnd: '',
                        displayDate: '',
                        time: '07.30 - 12.00 WIB',
                        location: 'SDN SUMBEREJO 04',
                        target: 'Seluruh Siswa',
                        descriptionID: '',
                        descriptionEN: '',
                      });
                      setShowAddEvent(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddEvent ? 'Batal' : 'Tambah Agenda Baru'}</span>
                </button>
              </div>

              {/* Quick Template Chips for Fast Agenda Creation */}
              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80 space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Template Cepat Pengisian Agenda:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setNewEvent({
                        titleID: 'Libur Nasional / Libur Semester Ganjil',
                        titleEN: 'School Holiday / Semester Break',
                        category: 'libur',
                        dateStart: new Date().toISOString().split('T')[0],
                        dateEnd: '',
                        displayDate: 'Libur Sekolah',
                        time: 'Sepanjang Hari',
                        location: 'Libur Sekolah',
                        target: 'Seluruh Siswa & Pengajar',
                        descriptionID: 'Kegiatan belajar mengajar diliburkan sementara.',
                        descriptionEN: 'School classes are temporarily suspended.',
                      });
                      setShowAddEvent(true);
                    }}
                    className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] rounded-lg border border-red-200 transition-colors"
                  >
                    🔴 + Template Libur
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setNewEvent({
                        titleID: 'Asesmen Sumatif Akhir Semester (ASAS)',
                        titleEN: 'Final Semester Assessment',
                        category: 'ujian',
                        dateStart: new Date().toISOString().split('T')[0],
                        dateEnd: '',
                        displayDate: 'Pekan Ujian',
                        time: '07.00 - 11.30 WIB',
                        location: 'Ruang Kelas Masing-masing',
                        target: 'Siswa Kelas 1 - 6',
                        descriptionID: 'Pelaksanaan ujian tertulis dan praktik semester.',
                        descriptionEN: 'Execution of final semester exams.',
                      });
                      setShowAddEvent(true);
                    }}
                    className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[11px] rounded-lg border border-amber-200 transition-colors"
                  >
                    🟡 + Template Ujian
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setNewEvent({
                        titleID: 'Gelar Karya Kokurikuler & 8 Dimensi Profil Lulusan',
                        titleEN: 'Co-Curricular Exhibition & 8 Graduate Profile Dimensions',
                        category: 'p5',
                        dateStart: new Date().toISOString().split('T')[0],
                        dateEnd: '',
                        displayDate: 'Gelar Karya Kokurikuler',
                        time: '08.00 - 12.00 WIB',
                        location: 'Halaman & Hall SDN SUMBEREJO 04',
                        target: 'Siswa, Guru & Orang Tua',
                        descriptionID: 'Pameran hasil karya siswa yang mencerminkan 8 Dimensi Profil Lulusan melalui pendekatan pembelajaran mendalam (deep learning).',
                        descriptionEN: 'Exhibition of student products reflecting the 8 Graduate Profile Dimensions.',
                      });
                      setShowAddEvent(true);
                    }}
                    className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-[11px] rounded-lg border border-purple-200 transition-colors"
                  >
                    🟣 + Template 8 Dimensi Profil Lulusan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setNewEvent({
                        titleID: 'Pembagian Buku Laporan Hasil Belajar (Raport)',
                        titleEN: 'Report Card Distribution',
                        category: 'raport',
                        dateStart: new Date().toISOString().split('T')[0],
                        dateEnd: '',
                        displayDate: 'Penyerahan Raport',
                        time: '08.00 - 11.00 WIB',
                        location: 'Ruang Kelas Wali Kelas',
                        target: 'Orang Tua / Wali Murid',
                        descriptionID: 'Penyerahan laporan hasil belajar siswa semester ganjil/genap kepada orang tua/wali murid.',
                        descriptionEN: 'Distribution of student progress reports to parents.',
                      });
                      setShowAddEvent(true);
                    }}
                    className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-[11px] rounded-lg border border-blue-200 transition-colors"
                  >
                    🔵 + Template Raport
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setNewEvent({
                        titleID: 'Sosialisasi & Pembukaan PPDB Tahun Ajaran Baru',
                        titleEN: 'New Student Admission Launch',
                        category: 'ppdb',
                        dateStart: new Date().toISOString().split('T')[0],
                        dateEnd: '',
                        displayDate: 'Pendaftaran PPDB',
                        time: '08.00 - 14.00 WIB',
                        location: 'Sekretariat PPDB & Online Website',
                        target: 'Calon Wali Murid',
                        descriptionID: 'Pembukaan pendaftaran peserta didik baru jalur zonasi, afirmasi, dan prestasi.',
                        descriptionEN: 'New student admissions launch for upcoming academic year.',
                      });
                      setShowAddEvent(true);
                    }}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors"
                  >
                    🟢 + Template PPDB
                  </button>
                </div>
              </div>

              {showAddEvent && (
                <form
                  onSubmit={handleSaveEvent}
                  className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3 shadow-inner"
                >
                  <h4 className="font-bold text-xs text-emerald-950 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{editingEventId ? 'Edit Agenda Kegiatan' : 'Form Tambah Agenda Kegiatan Baru'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Judul Agenda (Bahasa Indonesia) *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Upacara HUT RI ke-81"
                        required
                        value={newEvent.titleID}
                        onChange={(e) => setNewEvent({ ...newEvent, titleID: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Judul Agenda (Bahasa Inggris)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Independence Day Ceremony"
                        value={newEvent.titleEN}
                        onChange={(e) => setNewEvent({ ...newEvent, titleEN: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Kategori Agenda *</label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                      >
                        <option value="kegiatan">✨ Kegiatan Siswa</option>
                        <option value="libur">🔴 Libur Sekolah / Nasional</option>
                        <option value="ujian">🟡 Ujian / Asesmen</option>
                        <option value="p5">🟣 8 Dimensi Profil Lulusan (Kokurikuler)</option>
                        <option value="raport">🔵 Raport / Rapat Ortis</option>
                        <option value="ppdb">🟢 PPDB Sekolah</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Tanggal Mulai (YYYY-MM-DD) *</label>
                      <input
                        type="date"
                        required
                        value={newEvent.dateStart}
                        onChange={(e) => setNewEvent({ ...newEvent, dateStart: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Tanggal Selesai (Opsional)</label>
                      <input
                        type="date"
                        value={newEvent.dateEnd}
                        onChange={(e) => setNewEvent({ ...newEvent, dateEnd: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Teks Tampilan Tanggal</label>
                      <input
                        type="text"
                        placeholder="Contoh: 17 Agustus 2026 atau 11 - 15 Agustus 2026"
                        value={newEvent.displayDate}
                        onChange={(e) => setNewEvent({ ...newEvent, displayDate: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Waktu Pelaksanaan</label>
                      <input
                        type="text"
                        placeholder="Contoh: 07.30 - 11.00 WIB"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Lokasi Kegiatan</label>
                      <input
                        type="text"
                        placeholder="Contoh: Aula / Halaman Sekolah"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Sasaran / Peserta</label>
                      <input
                        type="text"
                        placeholder="Contoh: Siswa Kelas 1 - 6 & Wali Murid"
                        value={newEvent.target}
                        onChange={(e) => setNewEvent({ ...newEvent, target: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Deskripsi Singkat Agenda *</label>
                      <textarea
                        rows={2}
                        placeholder="Rincian singkat mengenai agenda kegiatan..."
                        required
                        value={newEvent.descriptionID}
                        onChange={(e) => setNewEvent({ ...newEvent, descriptionID: e.target.value })}
                        className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddEvent(false);
                        setEditingEventId(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow hover:bg-emerald-800 transition-colors"
                    >
                      {editingEventId ? 'Perbarui Agenda' : 'Simpan Agenda Baru'}
                    </button>
                  </div>
                </form>
              )}

              {/* Table / List of School Events */}
              <div className="space-y-3">
                {(db.schoolEvents || []).length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-500">
                    Belum ada agenda kegiatan tersimpan di database.
                  </div>
                ) : (
                  (db.schoolEvents || []).map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-emerald-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            ev.category === 'libur' ? 'bg-red-100 text-red-800 border-red-200' :
                            ev.category === 'ujian' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            ev.category === 'p5' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            ev.category === 'raport' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            ev.category === 'ppdb' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            'bg-cyan-100 text-cyan-800 border-cyan-200'
                          }`}>
                            {ev.category.toUpperCase()}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            {ev.displayDate || ev.dateStart}
                          </span>
                          {ev.time && (
                            <span className="text-[11px] text-gray-500">
                              ⏰ {ev.time}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-gray-900 text-sm">{ev.title.ID}</h4>
                        <p className="text-xs text-gray-600 line-clamp-1">{ev.description.ID}</p>

                        <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 pt-1">
                          {ev.location && <span>📍 {ev.location}</span>}
                          {ev.target && <span>👥 {ev.target}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleStartEditEvent(ev)}
                          className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200"
                          title="Edit Agenda"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PPDB REGISTRATIONS */}
          {activeTab === 'ppdb' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Pendaftar PPDB Online Terimpan di Database ({db.ppdbRegistrations.length})
              </h3>
              {db.ppdbRegistrations.length === 0 ? (
                <p className="text-xs text-gray-500">Belum ada pendaftar baru.</p>
              ) : (
                <div className="space-y-3">
                  {db.ppdbRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-emerald-800 text-sm">{reg.studentName}</span>
                        <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black">
                          {reg.status}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        Orang Tua / Wali: <strong className="text-gray-800">{reg.parentName}</strong> • HP: {reg.phone}
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        Target: {reg.targetGrade} • Asal Sekolah: {reg.prevSchool} • Tanggal: {reg.submittedAt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                Pesan Masuk dari Formulir Kontak ({db.contactMessages.length})
              </h3>
              {db.contactMessages.length === 0 ? (
                <p className="text-xs text-gray-500">Belum ada pesan masuk.</p>
              ) : (
                <div className="space-y-3">
                  {db.contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-emerald-800 text-sm">{msg.name}</span>
                        <span className="text-gray-400 font-mono text-[10px]">{msg.submittedAt}</span>
                      </div>
                      <div className="text-gray-600">
                        Subjek: <strong className="text-gray-800">{msg.subject}</strong> • Email: {msg.email} • Tel: {msg.phone}
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl text-gray-700 text-xs italic mt-2">
                        "{msg.message}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: RAW DB IMPORT / EXPORT */}
          {activeTab === 'raw' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-3">
                <h4 className="font-serif font-black text-emerald-950 text-base">
                  Cadangkan & Impor Database SDN SUMBEREJO 04
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Anda dapat mengunduh seluruh isi database website ini dalam format file JSON
                  atau mengunggah file JSON kustom untuk memperbarui isi website secara instan.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={exportDatabaseJSON}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ekspor Database (.JSON)</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Impor File JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-colors ml-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Database ke Default</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2">
                  Pratinjau Struktur JSON Database Saat Ini:
                </h4>
                <pre className="bg-gray-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono h-64 overflow-y-auto leading-relaxed border border-gray-800">
                  {JSON.stringify(db, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 12: ACCOUNT & SECURITY (CLOUD) */}
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-800/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-2.5 py-1 bg-amber-400 text-indigo-950 text-[10px] font-black rounded shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cloud Protected</span>
                    </div>
                    <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Security Protocol v4.0</span>
                  </div>
                  <h3 className="text-2xl font-serif font-black mb-2">Status Autentikasi Cloud</h3>
                  <p className="text-indigo-100 text-xs leading-relaxed max-w-xl">
                    Sistem kini menggunakan <strong>Firebase Cloud Authentication</strong> tingkat tinggi. 
                    Seluruh data dilindungi oleh enkripsi standar industri dan aturan keamanan sisi-server (Firestore Rules).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900">Profil Admin Terhubung</h4>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Terdaftar</div>
                      <div className="text-sm font-mono font-bold text-indigo-950">{user?.email || 'Tidak terdeteksi'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[11px] font-bold text-emerald-700">Sesi Aktif & Terenkripsi</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "Gunakan email ini untuk melakukan perubahan data sekolah. Seluruh aktivitas tercatat dalam log keamanan cloud."
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Sesi Admin</span>
                  </button>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-indigo-950">Ganti Password Admin</h4>
                  </div>
                  
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    Demi keamanan, perubahan password atau reset kredensial harus dilakukan melalui dashboard <strong>Firebase Console</strong> oleh pengelola sistem utama.
                  </p>

                  <div className="p-4 bg-white/60 rounded-2xl border border-indigo-200 text-[11px] text-indigo-800 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Security Tip</span>
                    </div>
                    <p>Jangan pernah membagikan email atau password admin kepada siapapun. Pastikan selalu logout setelah selesai melakukan pembaruan data sekolah.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
