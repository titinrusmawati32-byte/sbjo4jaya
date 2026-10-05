import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function extractGoogleDriveId(url: string | undefined | null): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // Pattern 1: standard file/d/ID, open?id=ID, uc?id=ID, file/u/0/d/ID, /d/ID
  const match = cleanUrl.match(
    /(?:drive\.google\.com\/(?:file\/(?:u\/\d+\/)?d\/|open\?id=|uc\?(?:.*&)?id=|d\/)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/i
  );
  if (match && match[1]) {
    return match[1];
  }

  // Pattern 2: searchParams "id" or "docid"
  try {
    const urlObj = new URL(cleanUrl);
    const idParam = urlObj.searchParams.get('id') || urlObj.searchParams.get('docid');
    if (idParam) return idParam;
  } catch {
    // ignore
  }

  // Pattern 3: Fallback match for any /d/ID in a Google URL
  if (cleanUrl.toLowerCase().includes('google')) {
    const fallbackMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
  }

  return null;
}

export function formatImageUrl(url: string | undefined | null): string {
  if (!url || url.trim() === '') return '';
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }
  return url;
}

export function getMediaEmbedType(url: string | undefined | null): 'youtube' | 'gdrive' | 'direct' | 'none' {
  if (!url || url.trim() === '') return 'none';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (extractGoogleDriveId(url)) return 'gdrive';
  return 'direct';
}

export function getYouTubeEmbedUrl(url: string, autoplay: boolean = true): string {
  const videoIdMatch = url.match(/(?:watch\?v=|embed\/|youtu\.be\/|v\/|e\/|watch\?.+&v=)([a-zA-Z0-9_-]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&enablejsapi=1`;
}

export function getGoogleDriveEmbedUrl(url: string): string {
  const driveId = extractGoogleDriveId(url);
  if (!driveId) return url;
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

// IndexedDB Helper for persistent local video caching
const DB_NAME = 'SDN_VideoStore_v2';
const STORE_NAME = 'videos';

function openVideoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.close();
          const req2 = indexedDB.open(DB_NAME, database.version + 1);
          req2.onupgradeneeded = () => {
            const db2 = req2.result;
            if (!db2.objectStoreNames.contains(STORE_NAME)) {
              db2.createObjectStore(STORE_NAME);
            }
          };
          req2.onsuccess = () => resolve(req2.result);
          req2.onerror = () => reject(req2.error);
        } else {
          resolve(database);
        }
      };
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function storeVideoBlob(id: string, blob: Blob): Promise<string> {
  try {
    const database = await openVideoDB();
    return new Promise((resolve, reject) => {
      try {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          resolve(`idb://${id}`);
          return;
        }
        const tx = database.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(blob, id);
        tx.oncomplete = () => resolve(`idb://${id}`);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        console.warn('Error in storeVideoBlob transaction:', err);
        resolve(`idb://${id}`);
      }
    });
  } catch (err) {
    console.warn('Error opening video IDB in storeVideoBlob:', err);
    return `idb://${id}`;
  }
}

export async function getVideoBlobUrl(targetUrl: string): Promise<string> {
  if (!targetUrl) return '';
  if (targetUrl.startsWith('data:') || targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    return targetUrl;
  }

  let id = targetUrl;
  if (targetUrl.startsWith('idb://')) {
    id = targetUrl.replace('idb://', '');
  } else if (targetUrl.startsWith('firestore://hero_videos/')) {
    id = targetUrl.replace('firestore://hero_videos/', '');
  }

  try {
    const database = await openVideoDB();
    return new Promise((resolve) => {
      try {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          resolve('');
          return;
        }
        const tx = database.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          if (getReq.result) {
            try {
              const blobUrl = URL.createObjectURL(getReq.result);
              resolve(blobUrl);
            } catch {
              resolve('');
            }
          } else {
            resolve('');
          }
        };
        getReq.onerror = () => resolve('');
      } catch {
        resolve('');
      }
    });
  } catch {
    return '';
  }
}

// Extract 1st frame as JPEG thumbnail poster from video file
export function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      let resolved = false;
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          URL.revokeObjectURL(objectUrl);
        }
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        resolve('');
      }, 5000);

      video.onloadeddata = () => {
        video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
      };

      video.onseeked = () => {
        clearTimeout(timeoutId);
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = video.videoWidth || 640;
          let h = video.videoHeight || 360;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.75);
            cleanup();
            resolve(thumbnail);
            return;
          }
        } catch (e) {
          console.warn('Failed generating video frame thumbnail:', e);
        }
        cleanup();
        resolve('');
      };

      video.onerror = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve('');
      };
    } catch {
      resolve('');
    }
  });
}

// Save video payload to Firestore (supports chunking for large video files)
export async function saveVideoToFirestore(videoId: string, dataUrl: string): Promise<string> {
  const CHUNK_SIZE = 700000; // ~700KB per chunk
  const fullId = videoId || `hero_vid_${Date.now()}`;

  // Local cache first for fast preview on uploader's device
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    await storeVideoBlob(fullId, blob);
  } catch (e) {
    console.warn('Local IndexedDB caching notice:', e);
  }

  // Push to Firestore
  try {
    if (dataUrl.length <= CHUNK_SIZE) {
      const docRef = doc(db, 'hero_videos', fullId);
      await setDoc(docRef, { dataUrl, chunkCount: 1, updatedAt: Date.now() });
    } else {
      const chunks: string[] = [];
      for (let i = 0; i < dataUrl.length; i += CHUNK_SIZE) {
        chunks.push(dataUrl.slice(i, i + CHUNK_SIZE));
      }

      const headerRef = doc(db, 'hero_videos', fullId);
      await setDoc(headerRef, { chunkCount: chunks.length, updatedAt: Date.now() });

      for (let i = 0; i < chunks.length; i++) {
        const chunkRef = doc(db, 'hero_videos', `${fullId}_c${i}`);
        await setDoc(chunkRef, { chunk: chunks[i] });
      }
    }
    return `firestore://hero_videos/${fullId}`;
  } catch (err) {
    console.error('Failed syncing video to Firestore:', err);
    return `idb://${fullId}`;
  }
}

// Fetch video payload from Firestore across devices
export async function getVideoFromFirestore(targetUrl: string): Promise<string> {
  if (!targetUrl) return '';
  if (targetUrl.startsWith('data:') || targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    return targetUrl;
  }

  let videoId = '';
  if (targetUrl.startsWith('firestore://hero_videos/')) {
    videoId = targetUrl.replace('firestore://hero_videos/', '');
  } else if (targetUrl.startsWith('idb://')) {
    videoId = targetUrl.replace('idb://', '');
  } else {
    return targetUrl;
  }

  // 1. Check local IndexedDB cache first
  try {
    const localBlobUrl = await getVideoBlobUrl(`idb://${videoId}`);
    if (localBlobUrl) return localBlobUrl;
  } catch {
    // continue
  }

  // 2. Fetch from Firestore
  try {
    const headerRef = doc(db, 'hero_videos', videoId);
    const headerSnap = await getDoc(headerRef);

    if (!headerSnap.exists()) {
      return '';
    }

    const headerData = headerSnap.data();
    let fullDataUrl = '';

    if (headerData.dataUrl) {
      fullDataUrl = headerData.dataUrl;
    } else if (headerData.chunkCount) {
      const count = headerData.chunkCount;
      const chunkPromises = [];
      for (let i = 0; i < count; i++) {
        const chunkRef = doc(db, 'hero_videos', `${videoId}_c${i}`);
        chunkPromises.push(getDoc(chunkRef));
      }

      const chunkSnaps = await Promise.all(chunkPromises);
      fullDataUrl = chunkSnaps.map((snap) => (snap.exists() ? snap.data().chunk || '' : '')).join('');
    }

    if (fullDataUrl) {
      try {
        const res = await fetch(fullDataUrl);
        const blob = await res.blob();
        await storeVideoBlob(videoId, blob);
        return URL.createObjectURL(blob);
      } catch {
        return fullDataUrl;
      }
    }
  } catch (err) {
    console.error('Failed fetching video from Firestore:', err);
  }

  return '';
}

export function useResolvedMediaUrl(url: string | undefined | null): string {
  const [resolved, setResolved] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setResolved('');
      return;
    }

    if (url.startsWith('firestore://hero_videos/') || url.startsWith('idb://')) {
      let isMounted = true;
      getVideoBlobUrl(url).then((localUrl) => {
        if (localUrl && isMounted) {
          setResolved(localUrl);
        } else {
          getVideoFromFirestore(url).then((resUrl) => {
            if (isMounted) {
              setResolved(resUrl || '');
            }
          });
        }
      });
      return () => {
        isMounted = false;
      };
    } else {
      setResolved(url);
    }
  }, [url]);

  return resolved;
}

export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export function formatWhatsAppUrl(phoneOrUrl: string | undefined | null, text?: string): string {
  if (!phoneOrUrl) return '#';
  let url = phoneOrUrl.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) {
    url = url.replace('https://wa.me/08', 'https://wa.me/628').replace('http://wa.me/08', 'https://wa.me/628');
    if (text && !url.includes('text=')) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}text=${encodeURIComponent(text)}`;
    }
    return url;
  }
  let digits = url.replace(/[^0-9]/g, '');
  if (digits.startsWith('08')) {
    digits = '628' + digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  }
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Robust file upload processor for Blob or File objects.
 * Validates format, extracts thumbnail if video, compresses image or chunk-syncs video to Firestore,
 * and returns the string URL / reference to store in Firestore documents.
 */
export async function handleFileUpload(
  fileOrBlob: File | Blob,
  type: 'image' | 'video' = 'image',
  options?: { idPrefix?: string; maxDimension?: number; quality?: number }
): Promise<{ url: string; thumbnail?: string }> {
  if (type === 'video') {
    if (fileOrBlob.type && !fileOrBlob.type.startsWith('video/')) {
      throw new Error('Format video tidak valid. Gunakan MP4, WebM, atau MOV.');
    }

    let file: File;
    if (fileOrBlob instanceof File) {
      file = fileOrBlob;
    } else {
      file = new File([fileOrBlob], `video_${Date.now()}.mp4`, { type: fileOrBlob.type || 'video/mp4' });
    }

    const thumbnail = await extractVideoThumbnail(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const dataUrl = evt.target?.result as string;
        if (!dataUrl) {
          reject(new Error('Gagal membaca file video'));
          return;
        }
        try {
          const prefix = options?.idPrefix || 'vid';
          const videoId = `${prefix}_${Date.now()}`;
          const downloadUrl = await saveVideoToFirestore(videoId, dataUrl);
          resolve({ url: downloadUrl, thumbnail });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  } else {
    if (fileOrBlob.type && !fileOrBlob.type.startsWith('image/')) {
      throw new Error('Format gambar tidak valid. Gunakan JPG, PNG, atau WEBP.');
    }

    let file: File;
    if (fileOrBlob instanceof File) {
      file = fileOrBlob;
    } else {
      file = new File([fileOrBlob], `image_${Date.now()}.jpg`, { type: fileOrBlob.type || 'image/jpeg' });
    }

    const maxDim = options?.maxDimension || 1200;
    const qual = options?.quality || 0.75;
    const downloadUrl = await compressImageFile(file, maxDim, maxDim, qual);
    return { url: downloadUrl };
  }
}
