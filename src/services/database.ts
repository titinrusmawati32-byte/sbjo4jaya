import {
  DatabaseSchema,
  DatabaseTableKey,
  SchoolInfo,
  HeroSlide,
  CoreValueItem,
  TeacherItem,
  NewsItem,
  GalleryItem,
  FacilityItem,
  ExtracurricularItem,
  FAQItem,
  PPDBInfo,
  PPDBRegistration,
  ContactMessage,
  SchoolEventItem,
} from '../types';
import {
  SCHOOL_INFO,
  HERO_SLIDES,
  CORE_VALUES,
  TEACHERS,
  NEWS_ARTICLES,
  GALLERY_ITEMS,
  FACILITIES,
  EXTRACURRICULARS,
  FREQUENTLY_ASKED_QUESTIONS,
  PPDB_DATA,
  HYMNE_DATA,
  SCHOOL_EVENTS,
} from '../data/schoolData';

import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  onSnapshot, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const DB_STORAGE_KEY = 'sdn_sumberejo04_database_v3';

let inMemoryDb: DatabaseSchema | null = null;
let isFirestoreInitialized = false;

// Initial seed data
const DEFAULT_DATABASE: DatabaseSchema = {
  schoolInfo: SCHOOL_INFO,
  heroSlides: HERO_SLIDES,
  coreValues: CORE_VALUES,
  teachers: TEACHERS,
  newsArticles: NEWS_ARTICLES,
  galleryItems: GALLERY_ITEMS,
  facilities: FACILITIES,
  extracurriculars: EXTRACURRICULARS,
  faqs: FREQUENTLY_ASKED_QUESTIONS,
  ppdbInfo: PPDB_DATA,
  hymne: HYMNE_DATA,
  ppdbRegistrations: [],
  contactMessages: [],
  schoolEvents: SCHOOL_EVENTS,
  adminCredentials: {
    username: 'admin',
    password: 'admin',
  },
};

// Event listener mechanism for reactivity
type DBChangeListener = () => void;
const listeners: Set<DBChangeListener> = new Set();

export const subscribeToDatabase = (listener: DBChangeListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

// Seeding logic
async function seedDatabaseIfEmpty() {
  // Only attempt seeding if we might be admin or if we want to check
  // But actually, getDocs on the collection will fail for public users if it's not empty and they don't have list perms
  // However, we WANT public users to be able to list the school data.
  try {
    const colRef = collection(db, 'school_database');
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      // Only an admin should be able to seed if the collection is empty
      // but if the rules allow creation by anyone (not recommended) or if it's the first run
      console.log('Firestore is empty. Seeding default data...');
      for (const [key, value] of Object.entries(DEFAULT_DATABASE)) {
        if (key === 'adminCredentials') continue; 
        const docRef = doc(db, 'school_database', key);
        await setDoc(docRef, { data: value, updatedAt: serverTimestamp() });
      }
      
      // Seed admin credentials in private collection
      const adminDocRef = doc(db, 'admin_configs', 'credentials');
      await setDoc(adminDocRef, { data: DEFAULT_DATABASE.adminCredentials, updatedAt: serverTimestamp() });
      
      console.log('Database seeded successfully.');
    }
  } catch (error: any) {
    // If it's a permission error, it's expected for non-admins if the DB is already seeded or if write is blocked
    if (error.code === 'permission-denied') {
      // Quietly fail seeding for non-admins
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, 'school_database');
  }
}

// Initialize Realtime Firestore Sync
export const initRealtimeDatabaseSync = () => {
  if (isFirestoreInitialized) return;
  isFirestoreInitialized = true;

  // We skip seedDatabaseIfEmpty() here as we assume data is managed via CMS
  // but for safety during development, we can keep a simpler version if needed.

  try {
    const updateMemory = (key: keyof DatabaseSchema, data: any) => {
      const current = getDatabase();
      inMemoryDb = { ...current, [key]: data };
      notifyListeners();
    };

    // 1. Settings - General (School identity, logo, accreditation, NPSN)
    onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        const s = snap.data();
        const current = getDatabase();
        inMemoryDb = {
          ...current,
          schoolInfo: {
            ...current.schoolInfo,
            name: s.schoolName || s.name || current.schoolInfo.name,
            motto: s.motto ? { ID: s.motto, EN: s.motto } : current.schoolInfo.motto,
            npsn: s.npsn || current.schoolInfo.npsn,
            accreditation: s.accreditation || current.schoolInfo.accreditation,
            address: s.address || current.schoolInfo.address,
            phone: s.phone || current.schoolInfo.phone,
            email: s.email || current.schoolInfo.email,
            logoUrl: s.logo || current.schoolInfo.logoUrl,
            principalName: s.headmaster || current.schoolInfo.principalName,
          }
        };
        notifyListeners();
      }
    }, (err) => {
      console.warn('Settings general sync notice:', err.message);
    });

    // 2. Settings - Contact (Address, Phone, Email, Maps, Social Media)
    onSnapshot(doc(db, 'settings', 'contact'), (snap) => {
      if (snap.exists()) {
        const c = snap.data();
        const current = getDatabase();
        inMemoryDb = {
          ...current,
          schoolInfo: {
            ...current.schoolInfo,
            address: c.address || current.schoolInfo.address,
            phone: c.phone || current.schoolInfo.phone,
            email: c.email || current.schoolInfo.email,
            mapsEmbedUrl: c.mapsUrl || current.schoolInfo.mapsEmbedUrl,
            social: {
              ...current.schoolInfo.social,
              instagram: c.instagram || current.schoolInfo.social?.instagram || '',
              facebook: c.facebook || current.schoolInfo.social?.facebook || '',
              youtube: c.youtube || current.schoolInfo.social?.youtube || '',
              whatsapp: c.whatsapp || current.schoolInfo.social?.whatsapp || '',
            }
          }
        };
        notifyListeners();
      }
    }, (err) => {
      console.warn('Settings contact sync notice:', err.message);
    });

    // 3. Homepage Config (Hero banner, greeting, stats, sections)
    onSnapshot(doc(db, 'homepage', 'config'), (snap) => {
      if (snap.exists()) {
        const h = snap.data();
        const current = getDatabase();
        const updatedHeroSlides = [...current.heroSlides];
        if (h.hero) {
          updatedHeroSlides[0] = {
            id: 'slide-1',
            title: { ID: h.hero.title || updatedHeroSlides[0]?.title?.ID || '', EN: h.hero.title || updatedHeroSlides[0]?.title?.EN || '' },
            subtitle: { ID: h.hero.tagline || updatedHeroSlides[0]?.subtitle?.ID || '', EN: h.hero.tagline || updatedHeroSlides[0]?.subtitle?.EN || '' },
            image: h.hero.bgImage || updatedHeroSlides[0]?.image || '',
            order: 1,
            mediaType: 'image',
          } as any;
        }

        const updatedSchoolInfo = { ...current.schoolInfo };
        if (h.welcome) {
          updatedSchoolInfo.greeting = {
            title: { ID: h.welcome.greetingTitle || '', EN: h.welcome.greetingTitle || '' },
            content: { ID: h.welcome.greetingContent || '', EN: h.welcome.greetingContent || '' },
            headmasterName: h.welcome.headmasterName || updatedSchoolInfo.principalName,
            headmasterTitle: h.welcome.headmasterTitle || 'Kepala Sekolah',
            headmasterPhoto: h.welcome.headmasterPhoto || updatedSchoolInfo.principalPhoto,
          };
        }

        inMemoryDb = {
          ...current,
          heroSlides: updatedHeroSlides,
          schoolInfo: updatedSchoolInfo,
          homepageConfig: h,
        };
        notifyListeners();
      }
    }, (err) => {
      console.warn('Homepage sync notice:', err.message);
    });

    // 4. School Profile (History, Vision, Mission, Goals, Organization Structure)
    onSnapshot(doc(db, 'school_profile', 'info'), (snap) => {
      if (snap.exists()) {
        const p = snap.data();
        const current = getDatabase();
        inMemoryDb = {
          ...current,
          schoolInfo: {
            ...current.schoolInfo,
            about: p.about ? { ID: p.about, EN: p.about } : current.schoolInfo.about,
            history: p.history ? { ID: p.history, EN: p.history } : current.schoolInfo.history,
            vision: p.vision ? { ID: p.vision, EN: p.vision } : current.schoolInfo.vision,
            mission: Array.isArray(p.mission) 
              ? p.mission.filter(Boolean).map((m: string) => ({ ID: m, EN: m }))
              : current.schoolInfo.mission,
            structureImage: p.structureImage || current.schoolInfo.structureImage,
          },
          schoolProfile: p,
        };
        notifyListeners();
      }
    }, (err) => {
      console.warn('Profile sync notice:', err.message);
    });

    // 5. Academic Config (Curriculum, Extracurriculars, Programs)
    onSnapshot(doc(db, 'academic', 'config'), (snap) => {
      if (snap.exists()) {
        const a = snap.data();
        const current = getDatabase();
        let updatedEkskuls = current.extracurriculars;
        if (Array.isArray(a.extracurriculars) && a.extracurriculars.length > 0) {
          updatedEkskuls = a.extracurriculars.map((e: any, idx: number) => ({
            id: `ekskul-${idx + 1}`,
            name: { ID: e.name, EN: e.name },
            category: (e.category || 'Seni') as any,
            schedule: { ID: e.schedule || '', EN: e.schedule || '' },
            description: { ID: `Pelatih: ${e.coach || '-'}`, EN: `Coach: ${e.coach || '-'}` },
            image: e.image || '',
            coach: e.coach || '',
          }));
        }

        inMemoryDb = {
          ...current,
          extracurriculars: updatedEkskuls,
          academicConfig: a,
        };
        notifyListeners();
      }
    }, (err) => {
      console.warn('Academic sync notice:', err.message);
    });

    // 6. PPDB Config (Status, Requirements, Quota, Registration Period)
    onSnapshot(doc(db, 'ppdb', 'config'), (snap) => {
      if (snap.exists()) {
        const p = snap.data();
        const current = getDatabase();
        inMemoryDb = {
          ...current,
          ppdbInfo: {
            ...current.ppdbInfo,
            year: p.academicYear || p.year || current.ppdbInfo.year,
            status: (p.status || current.ppdbInfo.status) as any,
            registrationPeriod: { 
              ID: p.registrationDates || p.registrationPeriod || current.ppdbInfo.registrationPeriod?.ID || '', 
              EN: p.registrationDates || p.registrationPeriod || current.ppdbInfo.registrationPeriod?.EN || '' 
            },
            requirements: Array.isArray(p.requirements)
              ? p.requirements.map((r: string) => ({ ID: r, EN: r }))
              : current.ppdbInfo.requirements,
          }
        };
        notifyListeners();
      }
    }, (err) => {
      console.warn('PPDB config sync notice:', err.message);
    });

    // 7. Navigation Config (Custom Menu Items, Order, Enabled Status)
    onSnapshot(doc(db, 'navigation', 'config'), (snap) => {
      if (snap.exists()) {
        updateMemory('navigationConfig', snap.data());
      }
    }, (err) => {
      console.warn('Navigation sync notice:', err.message);
    });

    // 8. News Articles (Published)
    const newsQuery = query(collection(db, 'news'), where('status', '==', 'published'));
    onSnapshot(newsQuery, (snap) => {
      const news = snap.docs
        .map(d => {
          const raw = d.data() as any;
          return {
            id: d.id,
            title: typeof raw.title === 'string' ? { id: raw.title, en: raw.title } : (raw.title || { id: '', en: '' }),
            summary: typeof raw.summary === 'string' ? { id: raw.summary, en: raw.summary } : (raw.summary || { id: '', en: '' }),
            content: typeof raw.content === 'string' ? { id: raw.content, en: raw.content } : (raw.content || { id: '', en: '' }),
            date: raw.publishedAt || raw.date || new Date().toISOString(),
            category: raw.category || 'Kegiatan',
            image: raw.thumbnail || raw.image || '',
            author: raw.author || 'Admin',
            readTime: raw.readTime || '3 menit',
          } as NewsItem;
        })
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      updateMemory('newsArticles', news);
    }, (err) => {
      console.warn('News sync notice:', err.message);
    });

    // 9. Teachers & Staff
    onSnapshot(query(collection(db, 'teachers'), orderBy('order', 'asc')), (snap) => {
      if (!snap.empty) {
        const teachers = snap.docs.map(d => {
          const raw = d.data() as any;
          return {
            id: d.id,
            name: raw.name || '',
            role: { ID: raw.position || 'Guru', EN: raw.position || 'Teacher' },
            nip: raw.nip || '-',
            subject: raw.subject ? { ID: raw.subject, EN: raw.subject } : undefined,
            photo: raw.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
            category: (raw.type === 'staff' ? 'staf' : 'guru_kelas') as any,
            education: raw.bio || 'S1 Pendidikan',
          } as TeacherItem;
        });
        updateMemory('teachers', teachers);
      }
    }, (err) => {
      console.warn('Teachers sync notice:', err.message);
    });

    // 10. Achievements
    onSnapshot(collection(db, 'achievements'), (snap) => {
      const achievements = snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter((a: any) => !a.status || a.status === 'published');
      updateMemory('achievements', achievements);
    }, (err) => {
      console.warn('Achievements sync notice:', err.message);
    });

    // 11. Gallery Photos
    onSnapshot(collection(db, 'gallery'), (snap) => {
      if (!snap.empty) {
        const gallery = snap.docs.map(d => {
          const g = d.data() as any;
          return {
            id: d.id,
            title: { ID: g.caption || g.title || 'Dokumentasi', EN: g.caption || g.title || 'Documentation' },
            category: g.category || 'Kegiatan',
            url: g.url || g.imageUrl || '',
            type: (g.type || 'image') as any,
            date: g.date || new Date().toISOString(),
          } as GalleryItem;
        });
        updateMemory('galleryItems', gallery);
      }
    }, (err) => {
      console.warn('Gallery sync notice:', err.message);
    });

    // 12. Announcements (Active)
    onSnapshot(collection(db, 'announcements'), (snap) => {
      const announcements = snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter((a: any) => a.enabled !== false);
      updateMemory('announcements', announcements);
    }, (err) => {
      console.warn('Announcements sync notice:', err.message);
    });

    // 13. Agenda Events
    onSnapshot(collection(db, 'agenda'), (snap) => {
      if (!snap.empty) {
        const events = snap.docs.map(d => {
          const ev = d.data() as any;
          return {
            id: d.id,
            title: { ID: ev.title || '', EN: ev.title || '' },
            category: (ev.category || 'kegiatan') as any,
            dateStart: ev.date || ev.dateStart || '',
            displayDate: ev.date || ev.displayDate || '',
            time: ev.time || '',
            location: ev.location || 'SDN SUMBEREJO 04',
            description: { ID: ev.description || '', EN: ev.description || '' },
          } as SchoolEventItem;
        });
        updateMemory('schoolEvents', events);
      }
    }, (err) => {
      console.warn('Agenda sync notice:', err.message);
    });

    // 14. Downloads
    onSnapshot(collection(db, 'downloads'), (snap) => {
      const downloads = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      updateMemory('downloads', downloads);
    }, (err) => {
      console.warn('Downloads sync notice:', err.message);
    });

    // 15. Legacy fallback support for school_database
    const legacyColRef = collection(db, 'school_database');
    onSnapshot(legacyColRef, (snapshot) => {
      const current = getDatabase();
      const updatedDb: DatabaseSchema = { ...current };
      snapshot.docs.forEach((docSnap) => {
        const docId = docSnap.id;
        const data = docSnap.data();
        if (docId in updatedDb) {
          (updatedDb as any)[docId] = data.data;
        }
      });
      inMemoryDb = updatedDb;
      notifyListeners();
    }, (err) => {
      console.warn('Legacy school_database sync notice:', err.message);
    });

    // Auth state changed to sync private data for admin
    let unsubscribePPDB: (() => void) | null = null;
    let unsubscribeMessages: (() => void) | null = null;

    onAuthStateChanged(auth, (user) => {
      // Clean up previous listeners when auth state changes (e.g. on logout)
      if (unsubscribePPDB) {
        unsubscribePPDB();
        unsubscribePPDB = null;
      }
      if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
      }

      // ONLY trigger admin listeners if user is signed in with admin email
      if (user && user.email && user.email.toLowerCase() === 'frezafa20@gmail.com') {
        try {
          unsubscribePPDB = onSnapshot(collection(db, 'ppdb_registrations'), (snapshot) => {
            const regs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as PPDBRegistration));
            if (inMemoryDb) {
              inMemoryDb.ppdbRegistrations = regs.sort((a, b) => 
                new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
              );
              notifyListeners();
            }
          }, (err) => {
            if (err.code !== 'permission-denied') {
              console.warn('PPDB sync notice:', err.message);
            }
          });

          unsubscribeMessages = onSnapshot(collection(db, 'contact_messages'), (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ContactMessage));
            if (inMemoryDb) {
              inMemoryDb.contactMessages = msgs.sort((a, b) => 
                new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
              );
              notifyListeners();
            }
          }, (err) => {
            if (err.code !== 'permission-denied') {
              console.warn('Messages sync notice:', err.message);
            }
          });
        } catch (e: any) {
          console.warn('Private sync notice:', e.message);
        }
      }
    });

  } catch (err) {
    console.error('Failed to initialize Firestore listener', err);
  }
};

import { supabase } from '../lib/supabase';

// Helper to sync Supabase server state directly to the public website store
export const syncSupabaseToPublicStore = async () => {
  try {
    const current = getDatabase();
    const updated: DatabaseSchema = { ...current };

    // 1. Fetch News
    const { data: newsData } = await supabase.from('news').select('*').eq('status', 'published').order('published_at', { ascending: false });
    if (newsData && newsData.length > 0) {
      updated.newsArticles = newsData.map((n) => ({
        id: n.id,
        title: { id: n.title, en: n.title, ID: n.title, EN: n.title },
        summary: { id: n.excerpt || n.content.substring(0, 100), en: n.excerpt || n.content.substring(0, 100), ID: n.excerpt || '', EN: n.excerpt || '' },
        content: { id: n.content, en: n.content, ID: n.content, EN: n.content },
        date: n.published_at || n.created_at || new Date().toISOString(),
        category: n.category || 'Kegiatan',
        image: n.thumbnail_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
        author: n.author_name || 'Admin',
        readTime: '3 menit',
      })) as any;
    }

    // 2. Fetch Teachers & Staff
    const { data: teachersData } = await supabase.from('teachers').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    const { data: staffData } = await supabase.from('staff').select('*').eq('is_active', true).order('sort_order', { ascending: true });

    if (teachersData || staffData) {
      const combinedTeachers: TeacherItem[] = [
        ...(teachersData || []).map((t) => ({
          id: t.id,
          name: t.name,
          nip: t.nip,
          role: { ID: t.position, EN: t.position },
          subject: { ID: t.subject || 'Guru Kelas', EN: t.subject || 'Class Teacher' },
          photo: t.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
          category: 'guru_kelas' as const,
          education: t.bio || 'S1 Pendidikan',
        })),
        ...(staffData || []).map((s) => ({
          id: s.id,
          name: s.name,
          nip: s.nip,
          role: { ID: s.position, EN: s.position },
          photo: s.photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
          category: 'staf' as const,
          education: s.bio || 'Staf Sekolah',
        })),
      ];

      if (combinedTeachers.length > 0) {
        updated.teachers = combinedTeachers;
      }
    }

    // 3. Fetch Agendas / Events
    const { data: agendasData } = await supabase.from('agendas').select('*').eq('is_active', true).order('event_date', { ascending: true });
    if (agendasData && agendasData.length > 0) {
      updated.schoolEvents = agendasData.map((ev) => ({
        id: ev.id,
        title: { ID: ev.title, EN: ev.title },
        category: 'kegiatan' as const,
        dateStart: ev.event_date,
        displayDate: ev.event_date,
        location: ev.location || 'SDN SUMBEREJO 04',
        description: { ID: ev.description || '', EN: ev.description || '' },
      }));
    }

    // 4. Fetch Site Settings
    const { data: settingsData } = await supabase.from('site_settings').select('*').limit(1);
    if (settingsData && settingsData.length > 0) {
      const s = settingsData[0];
      updated.schoolInfo = {
        ...updated.schoolInfo,
        name: s.school_name || updated.schoolInfo.name,
        npsn: s.npsn || updated.schoolInfo.npsn,
        logoUrl: s.logo_url || updated.schoolInfo.logoUrl,
      };
    }

    // 5. Fetch Contact Settings
    const { data: contactData } = await supabase.from('contact_settings').select('*').limit(1);
    if (contactData && contactData.length > 0) {
      const c = contactData[0];
      updated.schoolInfo = {
        ...updated.schoolInfo,
        address: c.address || updated.schoolInfo.address,
        phone: c.phone || updated.schoolInfo.phone,
        email: c.email || updated.schoolInfo.email,
        mapsEmbedUrl: c.maps_url || updated.schoolInfo.mapsEmbedUrl,
        social: {
          ...updated.schoolInfo.social,
          facebook: c.facebook || updated.schoolInfo.social?.facebook || '',
          instagram: c.instagram || updated.schoolInfo.social?.instagram || '',
          youtube: c.youtube || updated.schoolInfo.social?.youtube || '',
          tiktok: c.tiktok || updated.schoolInfo.social?.tiktok || '',
          whatsapp: c.whatsapp || updated.schoolInfo.social?.whatsapp || '',
        },
      };
    }

    // 6. Fetch PPDB Config
    const { data: ppdbData } = await supabase.from('ppdb').select('*').limit(1);
    if (ppdbData && ppdbData.length > 0) {
      const p = ppdbData[0];
      updated.ppdbInfo = {
        ...updated.ppdbInfo,
        year: p.period || updated.ppdbInfo.year,
        status: p.is_active ? 'Buka' : 'Tutup',
      };
    }

    inMemoryDb = updated;
    notifyListeners();
  } catch (err) {
    console.warn('Sync Supabase to public database notice:', err);
  }
};

// Initial trigger
syncSupabaseToPublicStore();

// Auto initialize on module load
initRealtimeDatabaseSync();

// Load or initialize DB
export const getDatabase = (): DatabaseSchema => {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      inMemoryDb = DEFAULT_DATABASE;
      return DEFAULT_DATABASE;
    }
    const parsed = JSON.parse(raw);
    inMemoryDb = { ...DEFAULT_DATABASE, ...parsed };
    return inMemoryDb!;
  } catch (e) {
    inMemoryDb = DEFAULT_DATABASE;
    return DEFAULT_DATABASE;
  }
};

// Save entire DB (Admin only)
export const saveDatabase = async (data: DatabaseSchema) => {
  inMemoryDb = data;
  notifyListeners();

  for (const [key, value] of Object.entries(data)) {
    // Only sync config tables, not the whole schema at once
    // AVOID writing adminCredentials or sub-collections to school_database
    if (key !== 'ppdbRegistrations' && key !== 'contactMessages' && key !== 'adminCredentials') {
      try {
        const docRef = doc(db, 'school_database', key);
        await setDoc(docRef, { data: value, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `school_database/${key}`);
      }
    }
  }
};

// Reset Database
export const resetDatabaseToDefaults = async () => {
  await saveDatabase(DEFAULT_DATABASE);
  return DEFAULT_DATABASE;
};

// Generic Table Setter
export const updateDatabaseTable = async <K extends DatabaseTableKey>(
  key: K,
  value: DatabaseSchema[K]
) => {
  try {
    const docRef = doc(db, 'school_database', key);
    await setDoc(docRef, { data: value, updatedAt: serverTimestamp() }, { merge: true });
    
    const current = getDatabase();
    current[key] = value;
    inMemoryDb = current;
    notifyListeners();
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `school_database/${key}`);
  }
};

// Helper Adders & Updaters
export const addPPDBRegistration = async (
  reg: Omit<PPDBRegistration, 'id' | 'submittedAt' | 'status'>
) => {
  const path = 'ppdb_registrations';
  const newReg: Omit<PPDBRegistration, 'id'> = {
    ...reg,
    submittedAt: new Date().toISOString(),
    status: 'Diproses',
  };

  try {
    const docRef = await addDoc(collection(db, path), newReg);
    return { ...newReg, id: docRef.id } as PPDBRegistration;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
};

export const addContactMessage = async (
  msg: Omit<ContactMessage, 'id' | 'submittedAt'>
) => {
  const path = 'contact_messages';
  const newMsg: Omit<ContactMessage, 'id'> = {
    ...msg,
    submittedAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, path), newMsg);
    return { ...newMsg, id: docRef.id } as ContactMessage;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
};

// Admin credentials helper for Portal SIAP
export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

export const getAdminCredentials = (): AdminCredentials => {
  const dbLocal = getDatabase();
  return dbLocal.adminCredentials || { username: 'admin', password: 'admin' };
};

export const saveAdminCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    const creds: AdminCredentials = {
      username: username.trim(),
      password: password,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to private collection
    const adminDocRef = doc(db, 'admin_configs', 'credentials');
    await setDoc(adminDocRef, { data: creds, updatedAt: serverTimestamp() }, { merge: true });
    
    // Also update local
    const current = getDatabase();
    current.adminCredentials = creds;
    inMemoryDb = current;
    notifyListeners();
    
    return true;
  } catch (e) {
    return false;
  }
};

export const exportDatabaseJSON = () => {
  const db = getDatabase();
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(db, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', 'database_sdn_sumberejo04.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importDatabaseJSON = async (jsonString: string): Promise<boolean> => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.schoolInfo && parsed.teachers) {
      await saveDatabase(parsed);
      return true;
    }
  } catch (e) {
    console.error('Invalid JSON file', e);
  }
  return false;
};
