import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#062B3A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A887]"></div>
      </div>
    );
  }

  if (!user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#062B3A] p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border border-white/10">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3.29T17 21l-4-4m0 0l-4 4m4-4V3" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs mb-6">Anda harus login sebagai Admin untuk mengakses panel ini.</p>
          <a 
            href="/admin/login" 
            className="inline-block w-full py-3.5 px-6 bg-[#00A887] hover:bg-[#20D6A0] text-white font-bold rounded-2xl transition-all shadow-lg text-xs"
          >
            Ke Halaman Login Admin
          </a>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#062B3A] p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border border-white/10">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-2">Izin Tidak Cukup</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs mb-6">Akun Anda tidak memiliki hak akses administrator.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-block w-full py-3.5 px-6 bg-[#062B3A] text-white font-bold rounded-2xl transition-all shadow-md text-xs"
          >
            Kembali ke Beranda Website
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
