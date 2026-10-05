import React, { useState, useEffect, useRef } from 'react';
import { Language, NavTab, SchoolInfo, HeroSlide } from '../types';
import { formatImageUrl, extractGoogleDriveId, useResolvedMediaUrl } from '../utils/mediaUtils';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface HeroVideoOpeningProps {
  language: Language;
  schoolInfo: SchoolInfo;
  heroSlides: HeroSlide[];
  onOpenPPDB: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export const HeroVideoOpening: React.FC<HeroVideoOpeningProps> = ({
  language,
  schoolInfo,
  heroSlides,
  onOpenPPDB,
  onSelectTab,
}) => {
  // Determine Primary Video Target and Second Photo Target
  const firstSlide = heroSlides[0];
  const secondSlide = heroSlides[1] || heroSlides[0];

  const rawVideoTarget = firstSlide?.videoUrl || (firstSlide?.mediaType === 'video' ? firstSlide?.image : '');
  const resolvedVideoBlob = useResolvedMediaUrl(rawVideoTarget);

  // Extract Google Drive ID if present for direct download streaming
  const gDriveId = extractGoogleDriveId(rawVideoTarget);
  const directDriveUrl = gDriveId
    ? `https://drive.usercontent.google.com/download?id=${gDriveId}&export=download`
    : '';

  // Reliable educational campus video source fallback
  const fallbackSampleUrl = 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43364-large.mp4';

  // Primary video source
  const videoSource = resolvedVideoBlob || directDriveUrl || rawVideoTarget || fallbackSampleUrl;

  // Second Photo Target (Formatted)
  const rawSecondPhoto = secondSlide?.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80';
  const secondPhotoUrl = formatImageUrl(rawSecondPhoto);

  // State Management for Transition Flow:
  // VIDEO OPENING (opacity 1) -> ENDED -> VIDEO FADE OUT (800ms) + PHOTO FADE IN (1200ms) + SLOW ZOOM (10s) -> VIDEO HIDDEN
  const [videoFadingOut, setVideoFadingOut] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [photoFadingIn, setPhotoFadingIn] = useState(false);
  const [photoZooming, setPhotoZooming] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. PRELOADING: Preload second photo immediately on mount so there is ZERO delay or flicker
  useEffect(() => {
    if (secondPhotoUrl) {
      const img = new Image();
      img.src = secondPhotoUrl;
    }
  }, [secondPhotoUrl]);

  // Transition handler when video ends
  const handleVideoEnded = () => {
    if (videoEnded) return;
    setVideoEnded(true);

    // 1. Video fades out over 800ms
    setVideoFadingOut(true);

    // 2. Foto kedua fades in simultaneously over 1200ms
    setPhotoFadingIn(true);

    // 3. Trigger Slow Zoom on second photo (scale 1.00 -> 1.05 over 10 seconds)
    setPhotoZooming(true);

    // 4. After 1200ms, hide video completely to prevent background overlap
    if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    fadeOutTimerRef.current = setTimeout(() => {
      setVideoHidden(true);
    }, 1200);
  };

  // Fallback handler if video fails to load, autoplay blocked, or invalid source
  const handleVideoFallback = () => {
    if (videoEnded) return;
    setVideoEnded(true);
    setVideoFadingOut(true);
    setPhotoFadingIn(true);
    setPhotoZooming(true);
    setVideoHidden(true);
  };

  // Replay feature if user wants to see the opening video again
  const handleReplayVideo = () => {
    setVideoHidden(false);
    setVideoFadingOut(false);
    setPhotoFadingIn(false);
    setPhotoZooming(false);
    setVideoEnded(false);

    if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => handleVideoFallback());
      }
    }, 50);
  };

  // Event listener setup on video element
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const onEndedListener = () => {
      handleVideoEnded();
    };

    const onErrorListener = () => {
      console.warn('Hero video load notice: activating second photo fallback seamlessly.');
      handleVideoFallback();
    };

    videoEl.addEventListener('ended', onEndedListener);
    videoEl.addEventListener('error', onErrorListener);

    // Attempt autoplay (muted, playsInline)
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Hero video autoplay blocked or unsupported:', err);
        handleVideoFallback();
      });
    }

    // Safety timeout: if video stalls or cannot buffer within 4 seconds, fallback gracefully
    const stallTimeout = setTimeout(() => {
      if (videoEl && videoEl.readyState === 0 && videoEl.currentTime === 0) {
        handleVideoFallback();
      }
    }, 4500);

    return () => {
      videoEl.removeEventListener('ended', onEndedListener);
      videoEl.removeEventListener('error', onErrorListener);
      clearTimeout(stallTimeout);
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    };
  }, [videoSource]);

  return (
    <section className="relative overflow-hidden bg-[#0B1F33]">
      {/* Container: Desktop 650–720px, Tablet & Mobile proportional */}
      <div className="relative w-full h-[580px] sm:h-[640px] md:h-[670px] lg:h-[700px] overflow-hidden select-none">
        
        {/* ==================================================
            LAYER 0: SOLID BASE (Guarantees zero white flash or blank screen)
            ================================================== */}
        <div className="absolute inset-0 bg-[#0B1F33] z-0 pointer-events-none" />

        {/* ==================================================
            LAYER 2: FOTO KEDUA (Underneath video, reveals on video ended with Slow Zoom)
            ================================================== */}
        <div
          className={`absolute inset-0 z-[1] overflow-hidden pointer-events-none transition-opacity duration-[1200ms] ease-out ${
            photoFadingIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={secondPhotoUrl}
            alt={schoolInfo.name}
            loading="eager"
            className="w-full h-full object-cover object-center will-change-transform"
            style={{
              transform: photoZooming ? 'scale(1.05)' : 'scale(1.00)',
              transition: 'transform 10s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          />
        </div>

        {/* ==================================================
            LAYER 1: VIDEO OPENING (Plays ONCE, no looping, fades out over 800ms)
            ================================================== */}
        {!videoHidden && (
          <div
            className={`absolute inset-0 z-[2] overflow-hidden pointer-events-none transition-opacity duration-[800ms] ease-out ${
              videoFadingOut ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <video
              ref={videoRef}
              src={videoSource}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              onEnded={handleVideoEnded}
              onError={handleVideoFallback}
            >
              {directDriveUrl && <source src={directDriveUrl} type="video/mp4" />}
              {fallbackSampleUrl && <source src={fallbackSampleUrl} type="video/mp4" />}
            </video>
          </div>
        )}

        {/* ==================================================
            LAYER 3: UNIFIED OVERLAY (Shared across Video and Photo for a seamless crossfade)
            Gradient: rgba(11,31,51,0.15) -> rgba(0,139,106,0.65)
            ================================================== */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          {/* Requested gradient: rgba(11,31,51,0.15) to rgba(0,139,106,0.65) */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(11, 31, 51, 0.15) 0%, rgba(11, 31, 51, 0.35) 45%, rgba(0, 139, 106, 0.65) 100%)',
            }}
          />
          {/* Legibility contrast scrim for white text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(11, 31, 51, 0.85) 0%, rgba(11, 31, 51, 0.25) 50%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(11, 31, 51, 0.75) 0%, rgba(11, 31, 51, 0.30) 45%, transparent 100%)',
            }}
          />
        </div>

        {/* ==================================================
            LAYER 4: HERO CONTENT (Never disappears or flickers during background switch)
            ================================================== */}
        <div className="relative z-[4] flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-auto">
          <div className="max-w-3xl space-y-5">
            {/* 1. Badge Sekolah */}
            <div className="inline-flex items-center gap-2 bg-[#F4B41A] text-[#0B1F33] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>SEKOLAH DASAR NEGERI UNGGULAN • NPSN {schoolInfo.npsn || '20524058'}</span>
            </div>

            {/* 2. Hero Heading: Poppins ExtraBold 56-64px desktop / 40-48px tablet / 32-38px mobile */}
            <h1 className="text-white font-extrabold tracking-tight leading-[1.08] text-[32px] sm:text-[44px] md:text-[52px] lg:text-[62px] drop-shadow-md">
              SD NEGERI SUMBEREJO <br />
              <span className="text-[#F4B41A]">04</span>
            </h1>

            {/* 3. Tagline & Subtitle */}
            <div className="space-y-1.5">
              <p className="text-[13px] sm:text-[15px] font-bold tracking-[0.25em] text-[#F4B41A] uppercase drop-shadow">
                TIADA HARI TANPA PRESTASI
              </p>
              <p className="text-[16px] sm:text-[18px] text-white/95 font-normal leading-relaxed max-w-2xl drop-shadow">
                {firstSlide?.subtitle?.[language] ||
                  'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia di Lingkungan Pendidikan yang Ramah, Asri, dan Berprestasi.'}
              </p>
            </div>

            {/* 4. CTA Buttons: Emerald #008B6A (hover Gold #F4B41A) & Secondary Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                onClick={onOpenPPDB}
                className="btn-primary group"
              >
                <Sparkles className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
                <span>DAFTAR PPDB ONLINE</span>
              </button>

              <button
                onClick={() => onSelectTab('profil')}
                className="btn-secondary group"
              >
                <span>MENGENAL SEKOLAH KAMI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Replay Video Trigger (subtle affordance when photo is active) */}
        {photoFadingIn && (
          <button
            onClick={handleReplayVideo}
            className="absolute bottom-6 right-6 z-[10] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1F33]/70 hover:bg-[#0B1F33] text-white/80 hover:text-white border border-white/15 text-xs font-medium backdrop-blur-md transition-all shadow-md active:scale-95"
            title="Tonton Kembali Video Pembuka"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#F4B41A]" />
            <span className="hidden sm:inline">Putar Ulang Video</span>
          </button>
        )}

      </div>

      {/* Clean Secondary Ribbon (Navy with Gold Highlight) */}
      <div className="bg-[#0B1F33] text-white py-4 px-4 border-t border-white/10 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-[#008B6A] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4 text-[#F4B41A]" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">
                Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027
              </span>
              <span className="text-xs text-white/70">
                Pendaftaran resmi online gratis tanpa dipungut biaya.
              </span>
            </div>
          </div>

          <button
            onClick={onOpenPPDB}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4B41A] hover:bg-white text-[#0B1F33] text-xs font-bold uppercase tracking-wider shadow transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Isi Formulir Pendaftaran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
