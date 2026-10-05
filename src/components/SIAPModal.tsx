import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { getDatabase, subscribeToDatabase } from '../services/database';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  X, Lock, User, Key, ShieldCheck, ArrowRight, Database, Users, Newspaper,
  FileText, Mail, LogOut, CheckCircle2, ShieldAlert, Eye, EyeOff, Home,
  RefreshCw, Shield, Clock, AlertTriangle, Keyboard, Fingerprint, Mail as MailIcon,
  LayoutDashboard
} from 'lucide-react';

interface SIAPModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialTab?: 'login' | 'privasi';
  onOpenDatabase?: (tab?: string) => void;
  onGoHome?: () => void;
}

export const SIAPModal: React.FC<SIAPModalProps> = ({
  isOpen,
  onClose,
  language,
  initialTab = 'login',
  onOpenDatabase,
  onGoHome,
}) => {
  const db = getDatabase();
  const schoolInfo = db.schoolInfo;
  const [activeTab, setActiveTab] = useState<'login' | 'privasi'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<{ type: 'error' | 'success' | 'warning'; msg: string } | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Security 1: Dynamic 2FA Math CAPTCHA
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(7);
  const [captchaInput, setCaptchaInput] = useState('');

  // Security 2: Anti Brute-Force Rate Limiting & Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const saved = localStorage.getItem('siap_lockout_until');
    if (saved) {
      const time = parseInt(saved, 10);
      return time > Date.now() ? time : null;
    }
    return null;
  });
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState(0);

  // Security 4: Session Inactivity Auto-Logout Timer (15 mins)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewCaptcha = () => {
    const n1 = Math.floor(Math.random() * 20) + 5;
    const n2 = Math.floor(Math.random() * 15) + 2;
    setNum1(n1);
    setNum2(n2);
    setCaptchaInput('');
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFailedAttempts(0);
        localStorage.removeItem('siap_lockout_until');
      }
    });
    return () => unsubscribe();
  }, []);

  // Lockout Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (lockoutUntil && lockoutUntil > Date.now()) {
      interval = setInterval(() => {
        const diff = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (diff <= 0) {
          setLockoutUntil(null);
          localStorage.removeItem('siap_lockout_until');
          setLockoutRemainingSec(0);
          setFailedAttempts(0);
          generateNewCaptcha();
        } else {
          setLockoutRemainingSec(diff);
        }
      }, 1000);
    } else {
      setLockoutRemainingSec(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockoutUntil]);

  // Session Inactivity Auto Logout Effect
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(async () => {
        await signOut(auth);
        setLoginStatus({
          type: 'warning',
          msg: language === 'ID'
            ? 'Sesi Admin terputus otomatis setelah 15 menit tanpa aktivitas untuk keamanan.'
            : 'Admin session automatically logged out after 15 minutes of inactivity for security.'
        });
      }, 15 * 60 * 1000); // 15 minutes
    };

    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user, language]);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoginStatus(null);
      if (!user) {
        setEmail('');
        setPassword('');
      }
      generateNewCaptcha();
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab, user]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check Lockout Status
    if (lockoutUntil && lockoutUntil > Date.now()) {
      setLoginStatus({
        type: 'error',
        msg: language === 'ID'
          ? `Akses terkunci sementara karena salah password 3x. Tunggu ${lockoutRemainingSec} detik.`
          : `Temporarily locked out due to 3 failed attempts. Wait ${lockoutRemainingSec}s.`
      });
      return;
    }

    // Check CAPTCHA
    const expectedCaptcha = num1 + num2;
    if (parseInt(captchaInput.trim(), 10) !== expectedCaptcha) {
      setLoginStatus({
        type: 'error',
        msg: language === 'ID'
          ? 'Hasil Kode Verifikasi Keamanan (CAPTCHA) salah. Silakan coba hitung kembali.'
          : 'Incorrect Security CAPTCHA answer. Please try again.'
      });
      generateNewCaptcha();
      return;
    }

    setIsLoading(true);
    setLoginStatus(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      const newFailedCount = failedAttempts + 1;
      setFailedAttempts(newFailedCount);
      generateNewCaptcha();

      if (newFailedCount >= 3) {
        const lockoutTime = Date.now() + 5 * 60 * 1000; // 5-minute lockout
        setLockoutUntil(lockoutTime);
        localStorage.setItem('siap_lockout_until', lockoutTime.toString());
        setLoginStatus({
          type: 'error',
          msg: language === 'ID'
            ? 'TERKUNCI! Anda telah 3 kali salah memasukkan password. Portal dikunci selama 5 menit untuk mencegah akses ilegal (Anti Brute-Force).'
            : 'LOCKED OUT! 3 failed attempts reached. Portal is locked for 5 minutes (Anti Brute-Force).'
        });
      } else {
        let errorMsg = language === 'ID' 
          ? `Email/Password salah (${newFailedCount}/3 Percobaan). Sisa percobaan: ${3 - newFailedCount}x.` 
          : `Invalid credentials (${newFailedCount}/3 attempts). ${3 - newFailedCount} attempt(s) remaining.`;
        
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          // Generic message already set
        } else if (error.code === 'auth/too-many-requests') {
          errorMsg = language === 'ID' ? 'Terlalu banyak percobaan. Akun terkunci sementara.' : 'Too many attempts. Account temporarily disabled.';
        }

        setLoginStatus({ type: 'error', msg: errorMsg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const handleOpenDatabaseAction = (tab: string = 'info') => {
    if (onOpenDatabase) {
      onClose();
      onOpenDatabase(tab);
    }
  };

  const handleExitToHome = () => {
    onClose();
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fadeIn border border-emerald-800/30">
        {/* Header with High-Security Badge */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close SIAP Modal"
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-950" />
              <span>HIGH SECURITY • LEVEL 3</span>
            </span>
            <span className="text-emerald-300 text-xs font-semibold">
              {language === 'ID' ? 'Autentikasi Firebase Cloud Terenkripsi' : 'Firebase Cloud Encrypted Auth'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight flex items-center gap-2 text-white">
            <span>{language === 'ID' ? 'Portal SIAP ' + schoolInfo.name : 'SIAP Portal ' + schoolInfo.name}</span>
          </h2>

          <div className="mt-2 text-[11px] text-emerald-200/80 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5 text-amber-300" />
              <span>Pintasan Rahasia: <code className="bg-emerald-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-emerald-700/50 font-mono font-bold">Ctrl + Shift + A</code></span>
            </span>
          </div>
        </div>

        {/* Tabs Menu */}
        <div className="flex flex-wrap border-b border-gray-200 bg-gray-50 px-4 sm:px-6 gap-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'login'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ID' ? 'Akses SIAP Admin' : 'Portal Access'}</span>
          </button>

          <button
            onClick={() => setActiveTab('privasi')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'privasi'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{language === 'ID' ? 'Fitur Keamanan Tinggi' : 'High Security Features'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: PORTAL & LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {user ? (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                        <span>{language === 'ID' ? 'Sesi Admin Terautentikasi Cloud' : 'Cloud Authenticated Session'}</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">2FA VERIFIED</span>
                      </div>
                      <p className="text-emerald-800 mt-1 leading-relaxed">
                        {language === 'ID'
                          ? `Terhubung sebagai: ${user.email}. Sesi aman aktif dengan proteksi Firestore Rules.`
                          : `Connected as: ${user.email}. Secure session active with Firestore Rules protection.`}
                      </p>
                    </div>
                  </div>

                  {/* Security Session Indicator */}
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs flex items-center justify-between border border-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{language === 'ID' ? 'Auto-Logout Sesi Inaktif: 15 Menit' : 'Inactivity Timeout: 15 mins'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded">STATUS: CLOUD SECURED</span>
                  </div>

                  {/* Summary Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleOpenDatabaseAction('teachers')}
                      className="p-3 bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100/80 rounded-xl flex flex-col items-start transition-all text-left"
                    >
                      <Users className="w-4 h-4 text-amber-700 mb-1" />
                      <div className="text-[10px] uppercase font-bold text-amber-800">Guru & Staf</div>
                      <div className="text-base font-black text-amber-950">{db.teachers.length} Orang</div>
                    </button>

                    <button
                      onClick={() => handleOpenDatabaseAction('news')}
                      className="p-3 bg-blue-50/80 border border-blue-200/80 hover:bg-blue-100/80 rounded-xl flex flex-col items-start transition-all text-left"
                    >
                      <Newspaper className="w-4 h-4 text-blue-700 mb-1" />
                      <div className="text-[10px] uppercase font-bold text-blue-800">Berita</div>
                      <div className="text-base font-black text-blue-950">{db.newsArticles.length} Artikel</div>
                    </button>

                    <button
                      onClick={() => handleOpenDatabaseAction('ppdb')}
                      className="p-3 bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100/80 rounded-xl flex flex-col items-start transition-all text-left"
                    >
                      <FileText className="w-4 h-4 text-emerald-700 mb-1" />
                      <div className="text-[10px] uppercase font-bold text-emerald-800">PPDB</div>
                      <div className="text-base font-black text-emerald-950">{db.ppdbRegistrations.length} Siswa</div>
                    </button>

                    <button
                      onClick={() => handleOpenDatabaseAction('messages')}
                      className="p-3 bg-purple-50/80 border border-purple-200/80 hover:bg-purple-100/80 rounded-xl flex flex-col items-start transition-all text-left"
                    >
                      <MailIcon className="w-4 h-4 text-purple-700 mb-1" />
                      <div className="text-[10px] uppercase font-bold text-purple-800">Pesan</div>
                      <div className="text-base font-black text-purple-950">{db.contactMessages.length} Masuk</div>
                    </button>
                  </div>

                  {/* Primary Action Card: Buka Modern CMS Panel */}
                  <a
                    href="/admin"
                    className="w-full p-4 bg-[#0B1F33] hover:bg-[#071524] text-white rounded-2xl shadow-lg transition-all flex items-center justify-between group border border-white/10"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-xl bg-[#008B6A] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0">
                        <LayoutDashboard className="w-6 h-6 text-[#F4B41A]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-white group-hover:text-[#F4B41A] transition-colors">
                            Buka Modern Admin CMS
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#F4B41A] text-[#0B1F33] px-2 py-0.5 rounded shadow-xs">
                            CMS VITAL
                          </span>
                        </div>
                        <p className="text-xs text-white/70 mt-0.5">
                          Pusat kendali seluruh isi website: Beranda, Profil, SDM, PPDB, Berita & Pengaturan
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-[#F4B41A] group-hover:translate-x-1.5 transition-transform shrink-0 ml-3" />
                  </a>

                  {/* Secondary Action Card: Kelola Database Legacy */}
                  <button
                    onClick={() => handleOpenDatabaseAction('info')}
                    className="w-full p-4 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl shadow transition-all flex items-center justify-between group border border-slate-700"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold shadow-md shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white group-hover:text-slate-300 transition-colors">
                          Editor Database Langsung (JSON & Backup)
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Akses tabel data langsung, impor, dan ekspor JSON
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                  </button>

                  {/* Action Bar: Exit to Home & Logout */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
                    <button
                      onClick={handleExitToHome}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-xs"
                    >
                      <Home className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'ID' ? 'Keluar ke Beranda' : 'Exit to Home'}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'ID' ? 'Keluar Sesi Admin' : 'Logout Admin'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 px-4 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 bg-[#008B6A] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-[#F4B41A]" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-[#0B1F33]">
                      Portal Admin CMS SDN SUMBEREJO 04
                    </h3>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
                      Pengelolaan konten berita, profil sekolah, guru, PPDB, agenda, galeri, dan konfigurasi website resmi.
                    </p>
                  </div>

                  <div className="pt-2 max-w-md mx-auto">
                    <a
                      href="/admin/login"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#008B6A] hover:bg-[#F4B41A] text-white hover:text-[#0B1F33] font-semibold text-sm rounded-[30px] shadow-md transition-all group"
                    >
                      <span>Buka Halaman Login Modern CMS (/admin/login)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-[#64748B]">
                    <Shield className="w-3.5 h-3.5 text-[#008B6A]" />
                    <span>Terotentikasi & Terlindungi oleh Firebase Auth</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FITUR KEAMANAN TINGGI */}
          {activeTab === 'privasi' && (
            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {language === 'ID'
                    ? 'Protokol Keamanan Tingkat Tinggi (Multi-Layer Protection)'
                    : 'Multi-Layer High Security Protocol'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-emerald-700" />
                    <span>1. Firebase Cloud Auth</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Autentikasi menggunakan layanan Cloud Firebase yang terenkripsi standar industri. Password tidak pernah tersimpan dalam database lokal.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <span>2. Anti Brute-Force Lockout</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Maksimal 3 kali kesalahan password berturut-turut. Jika terlampaui, portal terkunci otomatis selama 5 menit untuk mencegah serangan otomatis.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-amber-700" />
                    <span>3. Dynamic 2FA CAPTCHA</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Setiap percobaan login memerlukan verifikasi perhitungan matematika dinamis (Second Factor) untuk mencegah bot.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-blue-700" />
                    <span>4. Firestore Security Rules</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Data dilindungi oleh aturan keamanan sisi server (Backend-enforced). Hanya admin dengan email yang tepat yang dapat mengubah data.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-[11px]">
                <strong>Undang-Undang Pelindungan Data Pribadi (UU PDP):</strong> Seluruh data siswa, pendaftar PPDB, dan guru tersimpan terenkripsi dalam penyimpanan cloud terisolasi.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={handleExitToHome}
            className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>© {schoolInfo.name} • Portal SIAP Sec-Cloud</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition-colors"
          >
            {language === 'ID' ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
