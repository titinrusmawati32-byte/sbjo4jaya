import { useState } from 'react';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  UploadTask 
} from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../services/firebase';
import { compressImageFile } from './mediaUtils';

export interface UploadMetadata {
  name: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: any;
  altText: string;
}

export interface UseMediaUploadResult {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, folder?: string) => Promise<UploadMetadata>;
  cancelUpload: () => void;
}

/**
 * Centered promise-based Media Upload Handler integrating Firebase Storage & Firestore Metadata
 */
export async function uploadMediaFile(
  file: File, 
  folder: string = 'media_library',
  onProgress?: (progress: number) => void,
  onTaskCreated?: (task: UploadTask) => void
): Promise<UploadMetadata> {
  let finalFile: File | Blob = file;

  // 1. Image compression (if file is an image) to save bandwidth and speed up load times
  if (file.type.startsWith('image/')) {
    try {
      const compressedBase64 = await compressImageFile(file, 1600, 1200, 0.85);
      const response = await fetch(compressedBase64);
      finalFile = await response.blob();
    } catch (err) {
      console.warn('Image compression failed, using original file instead:', err);
    }
  }

  // 2. Setup safe, sanitized storage path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;
  const fileRef = ref(storage, storagePath);

  // 3. Initiate resumable upload task
  const uploadTask = uploadBytesResumable(fileRef, finalFile);
  if (onTaskCreated) {
    onTaskCreated(uploadTask);
  }

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Firebase Storage upload failed:', error);
        reject(new Error(`Gagal mengunggah ke Storage: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          // 4. Save metadata object to Firestore media_library collection
          const metadata = {
            name: file.name,
            url: downloadUrl,
            mimeType: file.type,
            size: file.size,
            uploadedAt: serverTimestamp(),
            altText: file.name.split('.')[0]
          };

          const docRef = await addDoc(collection(db, 'media_library'), metadata);
          
          resolve({
            ...metadata,
            id: docRef.id
          } as any);
        } catch (dbErr: any) {
          console.error('Firestore metadata write failed:', dbErr);
          reject(new Error(`Gagal menyimpan metadata media ke Database: ${dbErr.message}`));
        }
      }
    );
  });
}

/**
 * Specialized React Hook for direct, responsive uploads with progress tracking
 */
export function useMediaUpload(): UseMediaUploadResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<UploadTask | null>(null);

  const uploadFile = async (file: File, folder: string = 'media_library'): Promise<UploadMetadata> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadMediaFile(
        file, 
        folder, 
        (p) => setProgress(p),
        (task) => setActiveTask(uploadTask => {
          if (uploadTask) {
            uploadTask.cancel(); // Cancel any existing active upload tasks in progress
          }
          return task;
        })
      );
      setUploading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  const cancelUpload = () => {
    if (activeTask) {
      activeTask.cancel();
      setUploading(false);
      setProgress(0);
      setActiveTask(null);
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    cancelUpload
  };
}
