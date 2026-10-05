import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Eye, Filter, Newspaper, Check, X, Loader2, Sparkles, AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getRecords, insertRecord, updateRecord, deleteRecord, NewsRecord } from '../../services/supabaseDataService';
import { FileUpload } from '../../components/admin/FileUpload';
import { ConfirmDeleteModal } from '../../components/admin/ConfirmDeleteModal';
import { PreviewModal } from '../../components/admin/PreviewModal';
import { deleteFileFromSupabase } from '../../services/storageService';

export const NewsCMS: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter & Pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsRecord> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<NewsRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview Modal
  const [previewData, setPreviewData] = useState<NewsRecord | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const eqFilter: Record<string, any> = {};
      if (selectedCategory !== 'ALL') eqFilter.category = selectedCategory;
      if (selectedStatus !== 'ALL') eqFilter.status = selectedStatus;

      const res = await getRecords<NewsRecord>('news', {
        eq: eqFilter,
        search: search ? { column: 'title', query: search } : undefined,
        orderBy: { column: 'created_at', ascending: false },
        page,
        pageSize,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setNewsList(res.data);
        setTotalCount(res.count);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, selectedCategory, selectedStatus, search]);

  const handleOpenCreate = () => {
    setEditingNews({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      thumbnail_url: '',
      category: 'Kegiatan',
      status: 'published',
      featured: false,
      published_at: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (news: NewsRecord) => {
    setEditingNews(news);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews?.title || !editingNews?.content) {
      alert('Judul dan Isi Berita wajib diisi!');
      return;
    }

    setIsSaving(true);
    try {
      const slug = editingNews.slug || editingNews.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (editingNews.id) {
        // Update
        const res = await updateRecord<NewsRecord>('news', editingNews.id, {
          ...editingNews,
          slug,
        });
        if (res.error) throw new Error(res.error);

        // Update local state immediately
        setNewsList((prev) => prev.map((item) => (item.id === editingNews.id ? res.data! : item)));
      } else {
        // Create
        const res = await insertRecord<NewsRecord>('news', {
          ...editingNews,
          slug,
          author_name: 'Admin Sekolah',
        });
        if (res.error) throw new Error(res.error);

        setNewsList((prev) => [res.data!, ...prev]);
        setTotalCount((c) => c + 1);
      }

      setIsModalOpen(false);
      setEditingNews(null);
    } catch (err: any) {
      alert(`Gagal menyimpan berita: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deleteRecord('news', deleteTarget.id);
      if (!res.success) throw new Error(res.error || 'Gagal menghapus');

      // Also remove storage thumbnail if present
      if (deleteTarget.thumbnail_url) {
        await deleteFileFromSupabase(deleteTarget.thumbnail_url);
      }

      setNewsList((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setTotalCount((c) => Math.max(0, c - 1));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A887] uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" /> Manajemen Berita & Artikel
          </div>
          <h1 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
            Kelola Berita Sekolah
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-[#00A887]/20 flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berita berdasarkan judul..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00A887]"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Kegiatan">Kegiatan</option>
            <option value="Prestasi">Prestasi</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Akademik">Akademik</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00A887]"
          >
            <option value="ALL">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00A887] animate-spin" />
            <p className="text-xs font-medium">Memuat data berita dari Supabase...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Newspaper className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Belum ada data berita</p>
            <p className="text-xs">Klik "Tambah Berita Baru" untuk membuat artikel pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-wider font-black text-slate-400">
                  <th className="p-4">Gambar</th>
                  <th className="p-4">Judul Artikel</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {newsList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 w-16">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                          <Newspaper className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.excerpt || item.content}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {item.category || 'Kegiatan'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewData(item)}
                          className="p-2 text-slate-400 hover:text-[#00A887] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors"
                          title="Pratinjau"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalCount > pageSize && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan {newsList.length} dari {totalCount} berita
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold">Halaman {page}</span>
              <button
                disabled={page * pageSize >= totalCount}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-serif font-black text-slate-900 dark:text-white">
                {editingNews.id ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Judul Berita *
                </label>
                <input
                  type="text"
                  required
                  value={editingNews.title || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  placeholder="Masukkan judul berita..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingNews.category || 'Kegiatan'}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Akademik">Akademik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={editingNews.status || 'published'}
                    onChange={(e) => setEditingNews({ ...editingNews, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
                  >
                    <option value="published">Published (Tampil di Publik)</option>
                    <option value="draft">Draft (Disimpan Saja)</option>
                  </select>
                </div>
              </div>

              <div>
                <FileUpload
                  label="Gambar Utama / Thumbnail (Upload ke Supabase Storage)"
                  folder="news"
                  value={editingNews.thumbnail_url || ''}
                  onChange={(url) => setEditingNews({ ...editingNews, thumbnail_url: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={editingNews.excerpt || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Isi Berita Lengkap *
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingNews.content || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  placeholder="Tulis artikel berita lengkap di sini..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#00A887]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={editingNews.featured || false}
                  onChange={(e) => setEditingNews({ ...editingNews, featured: e.target.checked })}
                  className="rounded border-slate-300 text-[#00A887] focus:ring-[#00A887]"
                />
                <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Jadikan Berita Unggulan (Featured Slide)
                </label>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Pratinjau sebelum menyimpan?
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewData(editingNews as NewsRecord)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> Lihat Preview
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Simpan Berita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Berita Ini?"
        message="Apakah Anda yakin ingin menghapus berita ini secara permanen dari Supabase?"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        type="news"
        data={previewData}
      />
    </div>
  );
};
