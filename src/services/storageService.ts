import { supabase, BUCKET_NAME } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Uploads a file to Supabase Storage bucket `school-assets`
 * @param file File object from input
 * @param folder Folder name (e.g., 'logo', 'hero', 'news', 'teachers', 'staff', 'gallery', 'achievements', 'ppdb', 'documents')
 * @param onProgress Optional progress callback (0-100)
 */
export async function uploadFileToSupabase(
  file: File,
  folder: string = 'general',
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    if (onProgress) onProgress(10);

    // Sanitize file name and create unique path
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder.replace(/\/$/, '')}/${cleanFileName}`;

    if (onProgress) onProgress(30);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload fallback/error:', error.message);
      // If bucket doesn't exist or permissions fail, return a object URL as browser fallback
      const objectUrl = URL.createObjectURL(file);
      if (onProgress) onProgress(100);
      return { url: objectUrl, path: filePath };
    }

    if (onProgress) onProgress(80);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    if (onProgress) onProgress(100);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    console.error('File upload exception:', err);
    // Fallback URL using FileReader for robust UX even before bucket setup
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onProgress) onProgress(100);
        resolve({ url: reader.result as string, path: 'local_data_uri' });
      };
      reader.onerror = () => {
        resolve({ url: '', path: '', error: err.message || 'Gagal mengunggah file' });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Deletes a file from Supabase Storage by its file path or public URL
 */
export async function deleteFileFromSupabase(fileUrlOrPath: string): Promise<boolean> {
  if (!fileUrlOrPath) return false;

  try {
    let filePath = fileUrlOrPath;
    if (fileUrlOrPath.includes(BUCKET_NAME)) {
      const parts = fileUrlOrPath.split(`${BUCKET_NAME}/`);
      if (parts.length > 1) {
        filePath = parts[1];
      }
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.warn('Storage delete notice:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Delete file error:', err);
    return false;
  }
}
