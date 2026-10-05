-- ====================================================================
-- SUPABASE DATABASE SCHEMA FOR SDN SUMBEREJO 04 SCHOOL WEBSITE CMS
-- Execute this SQL script in the Supabase SQL Editor.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. SITE SETTINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name TEXT NOT NULL DEFAULT 'SDN SUMBEREJO 04',
  school_short_name TEXT DEFAULT 'SDN Sumberejo 04',
  npsn TEXT DEFAULT '20512345',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#062B3A',
  secondary_color TEXT DEFAULT '#083D49',
  accent_color TEXT DEFAULT '#00A887',
  footer_text TEXT DEFAULT '© 2026 SDN SUMBEREJO 04. All rights reserved.',
  seo_title TEXT DEFAULT 'Website Resmi SDN SUMBEREJO 04',
  seo_description TEXT DEFAULT 'Portal Resmi SDN SUMBEREJO 04 dengan navigasi Beranda, Profil, SDM, Akademik, Galeri, Berita, dan Kontak.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. NAVIGATION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.navigation(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  open_new_tab BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. HOMEPAGE SECTIONS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. SCHOOL PROFILE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  about TEXT,
  history TEXT,
  vision TEXT,
  mission JSONB, -- Array of strings
  goals JSONB,   -- Array of strings
  accreditation TEXT DEFAULT 'A',
  address TEXT,
  phone TEXT,
  email TEXT,
  principal_name TEXT,
  principal_photo TEXT,
  principal_message TEXT,
  structure_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. TEACHERS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nip TEXT DEFAULT '-',
  photo_url TEXT,
  position TEXT NOT NULL,
  subject TEXT,
  bio TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. STAFF
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  nip TEXT DEFAULT '-',
  photo_url TEXT,
  position TEXT NOT NULL,
  bio TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. ACADEMIC PROGRAMS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  code TEXT,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. NEWS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'Kegiatan',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'Admin Sekolah',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. ACHIEVEMENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Akademik',
  level TEXT DEFAULT 'Kabupaten',
  image_url TEXT,
  achievement_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. ALBUMS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 12. GALLERY PHOTOS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 13. AGENDAS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT DEFAULT 'SDN SUMBEREJO 04',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 14. ANNOUNCEMENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  button_text TEXT,
  button_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 15. PPDB
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ppdb (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Penerimaan Peserta Didik Baru',
  period TEXT DEFAULT '2026/2027',
  description TEXT,
  poster_url TEXT,
  registration_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  show_popup BOOLEAN NOT NULL DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 16. DOWNLOADS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'PDF',
  category TEXT DEFAULT 'Umum',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 17. CONTACT SETTINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT DEFAULT 'Jl. Raya Sumberejo No. 04, Sumberejo',
  phone TEXT DEFAULT '(0341) 123456',
  email TEXT DEFAULT 'sdnsumberejo04@sch.id',
  maps_url TEXT,
  office_hours TEXT DEFAULT 'Senin - Sabtu: 07.00 - 14.00 WIB',
  facebook TEXT DEFAULT 'https://facebook.com',
  instagram TEXT DEFAULT 'https://instagram.com',
  youtube TEXT DEFAULT 'https://youtube.com',
  tiktok TEXT DEFAULT 'https://tiktok.com',
  whatsapp TEXT DEFAULT '6281234567890',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppdb ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'editor') AND status = 'active'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- PUBLIC READ POLICIES (Allow everyone to view active/published data)
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read navigation" ON public.navigation FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read homepage_sections" ON public.homepage_sections FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Public read school_profile" ON public.school_profile FOR SELECT USING (true);
CREATE POLICY "Public read teachers" ON public.teachers FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read staff" ON public.staff FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read academic_programs" ON public.academic_programs FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read albums" ON public.albums FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read gallery_photos" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public read agendas" ON public.agendas FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read ppdb" ON public.ppdb FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read downloads" ON public.downloads FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public read contact_settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated read profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);

-- WRITE POLICIES (Allow super_admin and editor full CRUD)
CREATE POLICY "Admin CRUD site_settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD navigation" ON public.navigation FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD homepage_sections" ON public.homepage_sections FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD school_profile" ON public.school_profile FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD teachers" ON public.teachers FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD staff" ON public.staff FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD academic_programs" ON public.academic_programs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD news" ON public.news FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD achievements" ON public.achievements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD albums" ON public.albums FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD gallery_photos" ON public.gallery_photos FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD agendas" ON public.agendas FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD announcements" ON public.announcements FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD ppdb" ON public.ppdb FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD downloads" ON public.downloads FOR ALL USING (public.is_admin());
CREATE POLICY "Admin CRUD contact_settings" ON public.contact_settings FOR ALL USING (public.is_admin());
CREATE POLICY "User manage own profile" ON public.profiles FOR ALL USING (id = auth.uid() OR public.get_user_role(auth.uid()) = 'super_admin');

-- ====================================================================
-- STORAGE BUCKET CONFIGURATION
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('school-assets', 'school-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public access to school-assets bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-assets');

CREATE POLICY "Admin upload to school-assets bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'school-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update school-assets bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'school-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete from school-assets bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'school-assets' AND auth.role() = 'authenticated');
