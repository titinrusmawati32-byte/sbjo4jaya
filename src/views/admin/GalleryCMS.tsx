import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit3, Check, X, Loader2, FolderPlus } from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, AlbumRecord, GalleryPhotoRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { deleteFileFromSupabase } from '../../services/storageService';

export const GalleryCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'albums' | 'photos'>('photos');
  const [photos, setPhotos] = useState<GalleryPhotoRecord[]>([]);
  const [albums, setAlbums] = useState<AlbumRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<GalleryPhotoRecord> | null>(null);

  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Partial<AlbumRecord> | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteType, setDeleteType] = useState<'photo' | 'album'>('photo');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const photosRes = await getRecords<GalleryPhotoRecord>('gallery_photos', { orderBy: { column: 'created_at', ascending: false } });
    const albumsRes = await getRecords<AlbumRecord>('albums', { orderBy: { column: 'sort_order', ascending: true } });
    setPhotos(photosRes.data);
    setAlbums(albumsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto?.image_url) return alert('Pilih foto terlebih dahulu!');

    setIsSaving(true);
    try {
      if (editingPhoto.id) {
        const res = await updateRecord<GalleryPhotoRecord>('gallery_photos', editingPhoto.id, editingPhoto);
        setPhotos((prev) => prev.map((p) => (p.id === editingPhoto.id ? res.data! : p)));
      } else {
        const res = await insertRecord<GalleryPhotoRecord>('gallery_photos', editingPhoto);
        setPhotos((prev) => [res.data!, ...prev]);
      }
      setIsPhotoModalOpen(false);
      setEditingPhoto(null);
    } catch (err: any) {
      alert(`Gagal menyimpan foto: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum?.title) return alert('Nama album wajib diisi!');

    setIsSaving(true);
    try {
      if (editingAlbum.id) {
        const res = await updateRecord<AlbumRecord>('albums', editingAlbum.id, editingAlbum);
        setAlbums((prev) => prev.map((a) => (a.id === editingAlbum.id ? res.data! : a)));
      } else {
        const res = await insertRecord<AlbumRecord>('albums', editingAlbum);
        setAlbums((prev) => [...prev, res.data!]);
      }
      setIsAlbumModalOpen(false);
      setEditingAlbum(null);
    } catch (err: any) {
      alert(`Gagal menyimpan album: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteType === 'photo') {
        await deleteRecord('gallery_photos', deleteTarget.id);
        if (deleteTarget.image_url) await deleteFileFromSupabase(deleteTarget.image_url);
        setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      } else {
        await deleteRecord('albums', deleteTarget.id);
        if (deleteTarget.cover_url) await deleteFileFromSupabase(deleteTarget.cover_url);
        setAlbums((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" /> Galeri Dokumentasi Sekolah
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Foto & Album
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingAlbum({ title: '', description: '', cover_url: '', sort_order: albums.length + 1, is_active: true });
              setIsAlbumModalOpen(true);
            }}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-3 rounded-2xl transition-all text-xs flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" /> Buat Album Baru
          </button>

          <button
            onClick={() => {
              setEditingPhoto({ image_url: '', caption: 'Dokumentasi Kegiatan', sort_order: photos.length + 1 });
              setIsPhotoModalOpen(true);
            }}
            className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-5 py-3 rounded-2xl transition-all text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Unggah Foto
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border w-fit">
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs ${activeTab === 'photos' ? 'bg-[#00A887] text-white' : 'text-slate-600'}`}
        >
          Semua Foto ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('albums')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs ${activeTab === 'albums' ? 'bg-[#00A887] text-white' : 'text-slate-600'}`}
        >
          Album ({albums.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
        </div>
      ) : activeTab === 'photos' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square border border-slate-200 dark:border-slate-700 shadow-sm">
              <img src={photo.image_url} alt={photo.caption || 'Foto'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <p className="text-xs font-bold truncate">{photo.caption || 'Foto Galeri'}</p>
                <button
                  onClick={() => {
                    setDeleteTarget(photo);
                    setDeleteType('photo');
                  }}
                  className="mt-2 p-1.5 bg-rose-600 text-white rounded-lg w-fit text-xs self-end"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="bg-white dark:bg-slate-900 border rounded-3xl p-4 shadow-sm space-y-3">
              <div className="h-36 bg-slate-100 rounded-2xl overflow-hidden">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{album.title}</h3>
              <p className="text-xs text-slate-400">{album.description}</p>
              <button
                onClick={() => {
                  setDeleteTarget(album);
                  setDeleteType('album');
                }}
                className="text-rose-500 hover:underline text-xs font-bold"
              >
                Hapus Album
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Foto */}
      {isPhotoModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-black text-lg">Unggah Foto Galeri Baru</h3>
            <FileUpload
              label="Pilih Foto (Upload ke Supabase Storage)"
              folder="gallery"
              value={editingPhoto.image_url || ''}
              onChange={(url) => setEditingPhoto({ ...editingPhoto, image_url: url })}
            />
            <input
              type="text"
              value={editingPhoto.caption || ''}
              onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
              placeholder="Caption / Keterangan Foto..."
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
              <button onClick={handleSavePhoto} disabled={isSaving} className="px-5 py-2 bg-[#00A887] text-white text-xs font-bold rounded-xl">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Album */}
      {isAlbumModalOpen && editingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-black text-lg">Buat Album Galeri Baru</h3>
            <input
              type="text"
              required
              value={editingAlbum.title || ''}
              onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
              placeholder="Judul Album..."
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
            />
            <FileUpload
              label="Sampul / Cover Album"
              folder="gallery"
              value={editingAlbum.cover_url || ''}
              onChange={(url) => setEditingAlbum({ ...editingAlbum, cover_url: url })}
            />
            <textarea
              rows={2}
              value={editingAlbum.description || ''}
              onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
              placeholder="Deskripsi Album..."
              className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAlbumModalOpen(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Batal</button>
              <button onClick={handleSaveAlbum} disabled={isSaving} className="px-5 py-2 bg-[#00A887] text-white text-xs font-bold rounded-xl">Simpan Album</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title={`Hapus ${deleteType === 'photo' ? 'Foto' : 'Album'} Ini?`}
        itemName={deleteTarget?.caption || deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
