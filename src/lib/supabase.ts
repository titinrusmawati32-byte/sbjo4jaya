import { createClient } from '@supabase/supabase-js';

// Get environment variables or fallback to defaults safely
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://demo-supabase-project.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key';

export const isSupabaseConfigured = Boolean(
  metaEnv.VITE_SUPABASE_URL && 
  metaEnv.VITE_SUPABASE_ANON_KEY &&
  !metaEnv.VITE_SUPABASE_URL.includes('your-supabase-project')
);

// Create centralized Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const BUCKET_NAME = 'school-assets';

export const ASSET_FOLDERS = {
  LOGO: 'logo',
  HERO: 'hero',
  NEWS: 'news',
  TEACHERS: 'teachers',
  STAFF: 'staff',
  GALLERY: 'gallery',
  ACHIEVEMENTS: 'achievements',
  PPDB: 'ppdb',
  DOCUMENTS: 'documents',
} as const;
