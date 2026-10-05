import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { user, isAdmin, loading, signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoggingIn(true);
    setError(null);

    const result = await signInWithEmail(email.trim(), password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin');
    }
    setIsLoggingIn(false);
  };

  const handleQuickDemoLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    const result = await signInWithEmail('frezafa20@gmail.com', 'admin123');
    if (!result.error) {
      navigate('/admin');
    } else {
      setError('Gagal login otomatis. Silakan ketik kredensial.');
    }
    setIsLoggingIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#062B3A]">
        <RefreshCw className="w-10 h-10 text-[#00A887] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#062B3A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00A887]/15 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#20D6A0]/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00A887] to-[#083D49] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl ring-4 ring-[#20D6A0]/20">
            <ShieldCheck className="w-11 h-11 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-black text-white tracking-tight mb-1 uppercase">
            Admin Panel CMS
          </h1>
          <p className="text-[#C0D5DF] font-medium text-xs">
            SD NEGERI SUMBEREJO 04 — SUPABASE ENGINE
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-bold animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Email Admin / Pengguna
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sdnsumberejo04.sch.id"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#00A887]/20 focus:border-[#00A887] text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#00A887]/20 focus:border-[#00A887] text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#062B3A] hover:bg-[#083D49] text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 text-xs"
              >
                <span>{isLoggingIn ? 'Memproses Login...' : 'Masuk ke Dashboard CMS'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#20D6A0]" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              <span>Atau Mode Uji Coba</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoggingIn}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-[#00A887]/10 hover:border-[#00A887] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <KeyRound className="w-4 h-4 text-[#00A887]" />
              <span>Masuk Sebagai Super Admin (Demo)</span>
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold uppercase">Terhubung dengan</span>
            <span className="text-[#00A887] font-black uppercase">SUPABASE AUTH & POSTGRESQL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
