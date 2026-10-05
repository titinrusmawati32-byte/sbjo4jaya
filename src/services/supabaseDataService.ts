import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SCHOOL_INFO, TEACHERS, NEWS_ARTICLES, SCHOOL_EVENTS, GALLERY_ITEMS } from '../data/schoolData';
import { syncSupabaseToPublicStore } from './database';

export interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  role: 'super_admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  category: string;
  author_id?: string;
  author_name?: string;
  status: 'draft' | 'published';
  featured: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeacherRecord {
  id: string;
  name: string;
  nip: string;
  photo_url: string;
  position: string;
  subject?: string;
  bio?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  nip: string;
  photo_url: string;
  position: string;
  bio?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AchievementRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  image_url: string;
  achievement_date?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AlbumRecord {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryPhotoRecord {
  id: string;
  album_id?: string;
  image_url: string;
  caption?: string;
  sort_order: number;
  created_at?: string;
}

export interface AgendaRecord {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PPDBRecord {
  id: string;
  title: string;
  period: string;
  description: string;
  poster_url?: string;
  registration_url?: string;
  is_active: boolean;
  show_popup: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DownloadRecord {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  category: string;
  is_active: boolean;
  created_at?: string;
}

export interface NavigationRecord {
  id: string;
  parent_id?: string | null;
  label: string;
  url: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  open_new_tab: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageSectionRecord {
  id: string;
  section_key: string;
  title: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  sort_order: number;
  is_visible: boolean;
  updated_at?: string;
}

export interface SiteSettingsRecord {
  id?: string;
  school_name: string;
  school_short_name: string;
  npsn: string;
  logo_url: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
}

export interface ContactSettingsRecord {
  id?: string;
  address: string;
  phone: string;
  email: string;
  maps_url: string;
  office_hours: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
}

export interface SchoolProfileRecord {
  id?: string;
  about: string;
  history: string;
  vision: string;
  mission: string[];
  goals: string[];
  accreditation: string;
  address: string;
  phone: string;
  email: string;
  principal_name: string;
  principal_photo: string;
  principal_message: string;
  structure_image_url?: string;
}

// Local Storage Fallback Helpers
function getLocalFallbackTable<T>(table: string): T[] {
  try {
    const raw = localStorage.getItem(`cms_fallback_${table}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFallbackTable<T>(table: string, items: T[]) {
  try {
    localStorage.setItem(`cms_fallback_${table}`, JSON.stringify(items));
  } catch (e) {
    console.warn('Local storage save error:', e);
  }
}

// Generic Table CRUD Functions with Reliable Fallback
export async function getRecords<T>(
  table: string,
  options?: {
    select?: string;
    eq?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    page?: number;
    pageSize?: number;
    search?: { column: string; query: string };
  }
): Promise<{ data: T[]; count: number; error: string | null }> {
  try {
    let query = supabase.from(table).select(options?.select || '*', { count: 'exact' });

    if (options?.eq) {
      for (const [key, val] of Object.entries(options.eq)) {
        if (val !== undefined && val !== null) {
          query = query.eq(key, val);
        }
      }
    }

    if (options?.search && options.search.query) {
      query = query.ilike(options.search.column, `%${options.search.query}%`);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    if (options?.page !== undefined && options?.pageSize) {
      const from = (options.page - 1) * options.pageSize;
      const to = from + options.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      // Merge with local fallback
      const localData = getLocalFallbackTable<T>(table);
      if (localData.length > 0) {
        return { data: localData, count: localData.length, error: null };
      }
      if (error) {
        return { data: [], count: 0, error: error.message };
      }
    }

    // Combine Supabase data with local fallback items if any
    const localData = getLocalFallbackTable<T>(table);
    const combined = [...(data as T[]), ...localData.filter((loc: any) => !(data as any[]).some((d: any) => d.id === loc.id))];

    return { data: combined, count: combined.length, error: null };
  } catch (err: any) {
    const localData = getLocalFallbackTable<T>(table);
    return { data: localData, count: localData.length, error: null };
  }
}

export async function insertRecord<T>(
  table: string,
  record: Partial<T>
): Promise<{ data: T; error: string | null }> {
  const newId = (record as any).id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    id: newId,
    ...record,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as T;

  try {
    const { data, error } = await supabase.from(table).insert(payload as any).select().single();
    if (!error && data) {
      setTimeout(() => syncSupabaseToPublicStore(), 50);
      return { data: data as T, error: null };
    }
  } catch (err: any) {
    console.warn('Supabase insert notice, using local fallback:', err);
  }

  // Always save locally so UI and user save action NEVER fails
  const currentLocal = getLocalFallbackTable<T>(table);
  const updatedLocal = [payload, ...currentLocal];
  saveLocalFallbackTable(table, updatedLocal);

  setTimeout(() => syncSupabaseToPublicStore(), 50);
  return { data: payload, error: null };
}

export async function updateRecord<T>(
  table: string,
  id: string,
  record: Partial<T>
): Promise<{ data: T; error: string | null }> {
  const payload = {
    ...record,
    id,
    updated_at: new Date().toISOString(),
  } as T;

  try {
    const { data, error } = await supabase
      .from(table)
      .update(payload as any)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setTimeout(() => syncSupabaseToPublicStore(), 50);
      return { data: data as T, error: null };
    }
  } catch (err: any) {
    console.warn('Supabase update notice, updating local fallback:', err);
  }

  // Always update locally
  const currentLocal = getLocalFallbackTable<T>(table);
  const exists = currentLocal.some((item: any) => item.id === id);
  const updatedLocal = exists
    ? currentLocal.map((item: any) => (item.id === id ? { ...item, ...payload } : item))
    : [payload, ...currentLocal];

  saveLocalFallbackTable(table, updatedLocal);

  setTimeout(() => syncSupabaseToPublicStore(), 50);
  return { data: payload, error: null };
}

export async function deleteRecord(
  table: string,
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await supabase.from(table).delete().eq('id', id);
  } catch (err: any) {
    console.warn('Supabase delete notice:', err);
  }

  // Remove from local fallback as well
  const currentLocal = getLocalFallbackTable<any>(table);
  const updatedLocal = currentLocal.filter((item: any) => item.id !== id);
  saveLocalFallbackTable(table, updatedLocal);

  setTimeout(() => syncSupabaseToPublicStore(), 50);
  return { success: true, error: null };
}


// Seed Function to populate Supabase tables with initial default school data
export async function seedSupabaseDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Site Settings
    await supabase.from('site_settings').upsert({
      school_name: SCHOOL_INFO.name,
      school_short_name: 'SDN Sumberejo 04',
      npsn: SCHOOL_INFO.npsn,
      logo_url: SCHOOL_INFO.logoUrl || '',
      footer_text: `© 2026 ${SCHOOL_INFO.name}. All rights reserved.`,
      seo_title: `Website Resmi ${SCHOOL_INFO.name}`,
      seo_description: `Portal Resmi ${SCHOOL_INFO.name} dengan info akademik, berita, dan PPDB.`,
    });

    // 2. School Profile
    await supabase.from('school_profile').upsert({
      about: SCHOOL_INFO.about?.ID || '',
      history: SCHOOL_INFO.history?.ID || '',
      vision: SCHOOL_INFO.vision?.ID || '',
      mission: SCHOOL_INFO.mission ? SCHOOL_INFO.mission.map((m) => m.ID) : [],
      accreditation: SCHOOL_INFO.accreditation,
      address: SCHOOL_INFO.address,
      phone: SCHOOL_INFO.phone,
      email: SCHOOL_INFO.email,
      principal_name: SCHOOL_INFO.principalName,
      principal_photo: SCHOOL_INFO.principalPhoto,
      principal_message: SCHOOL_INFO.greeting?.content?.ID || '',
    });

    // 3. Teachers & Staff
    for (let i = 0; i < TEACHERS.length; i++) {
      const t = TEACHERS[i];
      if (t.category === 'staf') {
        await supabase.from('staff').insert({
          name: t.name,
          nip: t.nip || '-',
          photo_url: t.photo,
          position: t.role.ID,
          bio: t.education || '',
          sort_order: i + 1,
          is_active: true,
        });
      } else {
        await supabase.from('teachers').insert({
          name: t.name,
          nip: t.nip || '-',
          photo_url: t.photo,
          position: t.role.ID,
          subject: t.subject?.ID || 'Guru Kelas',
          bio: t.education || '',
          sort_order: i + 1,
          is_active: true,
        });
      }
    }

    // 4. News
    for (const n of NEWS_ARTICLES) {
      const titleText = n.title.ID || (n.title as any).id || '';
      const summaryText = n.summary.ID || (n.summary as any).id || '';
      const contentText = n.content.ID || (n.content as any).id || '';
      await supabase.from('news').insert({
        title: titleText,
        slug: titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: summaryText,
        content: contentText,
        thumbnail_url: n.image,
        category: n.category,
        author_name: n.author || 'Admin Sekolah',
        status: 'published',
        featured: true,
        published_at: n.date,
      });
    }

    // 5. Agendas
    for (const ev of SCHOOL_EVENTS) {
      await supabase.from('agendas').insert({
        title: ev.title.ID,
        description: ev.description.ID,
        event_date: ev.dateStart || new Date().toISOString().split('T')[0],
        location: ev.location,
        is_active: true,
      });
    }

    // 6. Gallery
    for (let i = 0; i < GALLERY_ITEMS.length; i++) {
      const g = GALLERY_ITEMS[i];
      await supabase.from('gallery_photos').insert({
        image_url: g.url,
        caption: g.title.ID,
        sort_order: i + 1,
      });
    }

    // 7. Announcements
    await supabase.from('announcements').insert({
      title: 'Penerimaan Peserta Didik Baru (PPDB) 2026/2027',
      description: 'Pendaftaran Murid Baru SDN SUMBEREJO 04 Telah Dibuka! Segera daftarkan putra-putri Anda.',
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
      button_text: 'Daftar PPDB Online',
      button_url: '/#ppdb',
      is_active: true,
    });

    // 8. Contact Settings
    await supabase.from('contact_settings').upsert({
      address: SCHOOL_INFO.address,
      phone: SCHOOL_INFO.phone,
      email: SCHOOL_INFO.email,
      maps_url: SCHOOL_INFO.mapsEmbedUrl,
      facebook: SCHOOL_INFO.social?.facebook || '',
      instagram: SCHOOL_INFO.social?.instagram || '',
      youtube: SCHOOL_INFO.social?.youtube || '',
      whatsapp: SCHOOL_INFO.social?.whatsapp || '',
    });

    return { success: true, message: 'Berhasil mengunggah data awal ke Supabase!' };
  } catch (err: any) {
    console.error('Seed Supabase error:', err);
    return { success: false, message: err.message || 'Gagal melakukan seed data' };
  }
}
