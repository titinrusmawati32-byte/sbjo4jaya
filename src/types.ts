export type Language = 'ID' | 'EN';

export type NavTab = 'beranda' | 'profil' | 'sdm' | 'akademik' | 'galeri' | 'berita' | 'kontak';

export interface BilingualText {
  ID: string;
  EN: string;
}

export interface SchoolInfo {
  name: string;
  shortName: string;
  npsn: string;
  motto: BilingualText;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  accreditation: string;
  established: string;
  principalName?: string;
  principalNip?: string;
  principalPhoto?: string;
  logoUrl?: string;
  mapsEmbedUrl?: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok?: string;
    whatsapp?: string;
  };
  vision: BilingualText;
  mission: BilingualText[];
  about?: BilingualText;
  history?: BilingualText;
  structureImage?: string;
  greeting?: {
    title: BilingualText;
    content: BilingualText;
    headmasterName?: string;
    headmasterTitle?: string;
    headmasterPhoto?: string;
  };
}

export interface HymneInfo {
  title: string;
  composer: string;
  lyrics: BilingualText;
}

export interface HeroSlide {
  id: string;
  image: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  title: BilingualText;
  subtitle: BilingualText;
}

export interface CoreValueItem {
  id: string;
  code: string;
  title: BilingualText;
  desc: BilingualText;
  icon: string;
}

export interface TeacherItem {
  id: string;
  name: string;
  nip?: string;
  role: BilingualText;
  category: 'pimpinan' | 'guru_kelas' | 'guru_bidang' | 'staf';
  grade?: string;
  subject?: BilingualText;
  education: string;
  photo: string;
  quote?: BilingualText;
}

export interface NewsItem {
  id: string;
  title: BilingualText;
  summary: BilingualText;
  content: BilingualText;
  date: string;
  category: 'Prestasi' | 'Kegiatan' | 'Akademik' | 'Pengumuman';
  image: string;
  author: string;
  readTime: string;
}

export interface GalleryItem {
  id: string;
  title: BilingualText;
  category: 'seni' | 'olahraga' | 'pramuka' | 'lingkungan' | 'upacara';
  type: 'photo' | 'video';
  url: string;
  date: string;
  description: BilingualText;
}

export interface FacilityItem {
  id: string;
  name: BilingualText;
  description: BilingualText;
  category: 'Akademik' | 'Seni & Olahraga' | 'Umum' | 'Sains & Tekno';
  image: string;
  features: BilingualText[];
}

export interface ExtracurricularItem {
  id: string;
  name: BilingualText;
  category: 'Seni' | 'Olahraga' | 'Akademik & Sains' | 'Kepemimpinan';
  schedule: BilingualText;
  description: BilingualText;
  image: string;
  coach: string;
}

export interface FAQItem {
  question: BilingualText;
  answer: BilingualText;
  category: string;
}

export interface PPDBInfo {
  year: string;
  status: 'Buka' | 'Segera Buka' | 'Tutup';
  registrationPeriod: BilingualText;
  requirements: BilingualText[];
  steps: {
    step: number;
    title: BilingualText;
    desc: BilingualText;
  }[];
}

export interface PPDBRegistration {
  id: string;
  studentName: string;
  parentName: string;
  nik: string;
  phone: string;
  email: string;
  targetGrade: string;
  prevSchool: string;
  submittedAt: string;
  status: 'Diproses' | 'Diterima' | 'Berkas Belum Lengkap';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface SchoolEventItem {
  id: string;
  title: BilingualText;
  category: 'libur' | 'ujian' | 'p5' | 'raport' | 'kegiatan' | 'ppdb';
  dateStart: string; // YYYY-MM-DD
  dateEnd?: string;   // YYYY-MM-DD
  displayDate: string;
  time?: string;
  location?: string;
  target?: string;
  description: BilingualText;
}

export type DatabaseTableKey =
  | 'schoolInfo'
  | 'heroSlides'
  | 'coreValues'
  | 'teachers'
  | 'newsArticles'
  | 'galleryItems'
  | 'facilities'
  | 'extracurriculars'
  | 'faqs'
  | 'ppdbInfo'
  | 'ppdbRegistrations'
  | 'contactMessages'
  | 'schoolEvents'
  | 'adminCredentials';

export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

export interface DatabaseSchema {
  schoolInfo: SchoolInfo;
  heroSlides: HeroSlide[];
  coreValues: CoreValueItem[];
  teachers: TeacherItem[];
  newsArticles: NewsItem[];
  galleryItems: GalleryItem[];
  facilities: FacilityItem[];
  extracurriculars: ExtracurricularItem[];
  faqs: FAQItem[];
  ppdbInfo: PPDBInfo;
  ppdbRegistrations: PPDBRegistration[];
  contactMessages: ContactMessage[];
  hymne: HymneInfo;
  schoolEvents: SchoolEventItem[];
  adminCredentials?: AdminCredentials;
  achievements?: any[];
  announcements?: any[];
  downloads?: any[];
  homepageConfig?: any;
  schoolProfile?: any;
  academicConfig?: any;
  navigationConfig?: any;
}

