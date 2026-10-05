import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { SchoolInfo, HeroSlide, NavTab, Language } from '../types';
import { formatImageUrl, useResolvedMediaUrl } from '../utils/mediaUtils';

interface HeroSectionProps {
  language: Language;
  schoolInfo: SchoolInfo;
  heroSlides: HeroSlide[];
  onOpenPPDB: () => void;
  onSelectTab: (tab: NavTab, subTab?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  schoolInfo,
  heroSlides,
  onOpenPPDB,
  onSelectTab,
}) => {
  // Video status lifecycle:
  // 'playing': Video is playing, second photo is preloaded and resting at z-0
  // 'fading': Video ended, fading out over 800ms while photo fades in over 1200ms with slow zoom
  // 'completed': Transition finished, video hidden, photo is active background
  // 'fallback': Video failed or blocked, directly show photo without black screen
  const [videoStatus, setVideoStatus] = useState<'playing' | 'fading' | 'completed' | 'fallback'>('playing');
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Determine Video Source
  const firstSlide = heroSlides[0];
  const customVideoUrl = firstSlide?.videoUrl || (firstSlide?.mediaType === 'video' ? firstSlide.image : '');
  const resolvedCustomVideo = useResolvedMediaUrl(customVideoUrl);
  // Default to local ultra-fast streaming video asset, or custom resolved url
  const primaryVideoSrc = '/hero-opening.mp4';

  // 2. Determine Second Photo Source
  const secondSlide = heroSlides[1] || heroSlides.find((s) => s.mediaType === 'image');
  const rawPhotoUrl = secondSlide?.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80';
  const photoSrc = formatImageUrl(rawPhotoUrl) || rawPhotoUrl;

  // Preload second photo immediately on mount
  useEffect(() => {
    if (photoSrc) {
      const preloadImg = new Image();
      preloadImg.src = photoSrc;
    }
  }, [photoSrc]);

  // Handle Video Ended
  const handleVideoEnded = () => {
    // 1. Do NOT immediately remove video
    // 2. Trigger crossfade (video fades out 800ms, photo fades in 1200ms)
    // 3. Trigger slow zoom from 1.00 to 1.05
    setVideoStatus('fading');
    setIsZooming(true);

    // 4. After transition duration, hide video layer
    setTimeout(() => {
      setVideoStatus('completed');
    }, 1200);
  };

  // Handle Video Error or Fallback
  const handleVideoError = () => {
    console.warn('Video failed to load or play, switching to second photo fallback');
    setVideoStatus('fallback');
    setIsZooming(true);
  };

  // Video Autoplay and Event Listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = false;

    // Attach ended listener directly
    const onEndedListener = () => {
      handleVideoEnded();
    };

    video.addEventListener('ended', onEndedListener);

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setHasStartedPlaying(true);
        })
        .catch((err) => {
          console.warn('Autoplay prevented or unplayable, using photo fallback:', err);
          handleVideoError();
        });
    }

    // Safety watchdog: if video doesn't start within 3.5s, fallback safely
    const watchdogTimer = setTimeout(() => {
      if (video.readyState < 2 && !hasStartedPlaying && videoStatus === 'playing') {
        console.warn('Video loading watchdog triggered, switching to photo');
        handleVideoError();
      }
    }, 3500);

    return () => {
      video.removeEventListener('ended', onEndedListener);
      clearTimeout(watchdogTimer);
    };
  }, [hasStartedPlaying]);

  // Replay Video Handler
  const handleReplayVideo = () => {
    setIsZooming(false);
    setVideoStatus('playing');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const heroSubtitle =
    firstSlide?.subtitle?.[language] ||
    'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia di Lingkungan Pendidikan yang Ramah, Asri, dan Berprestasi.';

  return (
    <section className="relative overflow-hidden bg-[#062B3A]">
      {/* Preload link tag for the second photo */}
      {photoSrc && <link rel="preload" as="image" href={photoSrc} />}

      {/* Main Responsive Hero Container: 650-720px on Desktop, proportional on Tablet & Mobile */}
      <div className="relative h-[650px] sm:h-[680px] lg:h-[720px] w-full overflow-hidden">
        
        {/* ==================================================
            LAYER 2: FOTO KEDUA (Underneath layer with slow zoom)
            ================================================== */}
        <div
          className={`absolute inset-0 z-0 overflow-hidden transition-opacity ease-out duration-[1200ms] ${
            videoStatus === 'playing' ? 'opacity-90' : 'opacity-100'
          }`}
        >
          <img
            src={photoSrc}
            alt="SD NEGERI SUMBEREJO 04"
            loading="eager"
            className={`w-full h-full object-cover object-center transition-transform ease-out duration-[10000ms] ${
              isZooming ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        {/* ==================================================
            LAYER 1: VIDEO OPENING (Top background layer, plays once)
            ================================================== */}
        <div
          className={`absolute inset-0 z-10 overflow-hidden transition-opacity ease-in-out duration-[800ms] ${
            videoStatus === 'playing' ? 'opacity-100' : 'opacity-0'
          } ${videoStatus === 'completed' || videoStatus === 'fallback' ? 'pointer-events-none hidden' : ''}`}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            preload="auto"
            onError={handleVideoError}
            onPlaying={() => setHasStartedPlaying(true)}
            className="w-full h-full object-cover object-center"
          >
            <source src={primaryVideoSrc} type="video/mp4" />
            {resolvedCustomVideo && resolvedCustomVideo !== primaryVideoSrc && (
              <source src={resolvedCustomVideo} type="video/mp4" />
            )}
            {customVideoUrl && customVideoUrl !== primaryVideoSrc && (
              <source src={customVideoUrl} type="video/mp4" />
            )}
          </video>
        </div>

        {/* ==================================================
            LAYER 3: UNIFIED OVERLAY (Covers both video & photo identically)
            Gradient: rgba(6,43,58,0.78) -> rgba(0,168,135,0.65)
            with soft left and bottom contrast for perfect typography legibility
            ================================================== */}
        <div
          className="absolute inset-0 z-15 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(6,43,58,0.78) 0%, rgba(6,43,58,0.28) 45%, rgba(0,168,135,0.65) 100%)',
          }}
        />
        <div className="absolute inset-0 z-16 pointer-events-none bg-gradient-to-t from-[#062B3A]/90 via-transparent to-transparent" />

        {/* ==================================================
            LAYER 4: HERO CONTENT (Remains permanently mounted & stable)
            ================================================== */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl space-y-5">
              
              {/* 1. Badge Sekolah */}
              <div className="inline-flex items-center gap-2 bg-[#FFBD24] text-[#062B3A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>SEKOLAH DASAR NEGERI UNGGULAN • NPSN {schoolInfo?.npsn || '20524058'}</span>
              </div>

              {/* 2. Hero Heading: Poppins ExtraBold 56-64px desktop / 40-48px tablet / 32-38px mobile */}
              <h1 className="text-[#F5FAFC] font-extrabold tracking-tight leading-[1.08] text-[32px] sm:text-[44px] md:text-[52px] lg:text-[62px] drop-shadow-md">
                SD NEGERI <br />
                <span className="text-[#F5FAFC]">SUMBEREJO 04</span>
              </h1>

              {/* 3. Hero Tagline: TIADA HARI TANPA PRESTASI */}
              <div className="flex items-center gap-2.5">
                <span className="h-1 w-8 bg-[#FFBD24] rounded-full inline-block" />
                <p className="text-[17px] sm:text-[19px] md:text-[21px] font-bold text-[#FFBD24] tracking-wider uppercase drop-shadow">
                  TIADA HARI TANPA PRESTASI
                </p>
              </div>

              {/* Subtitle Deskripsi Sekolah */}
              <p className="text-[16px] sm:text-[18px] text-[#F5FAFC]/95 font-normal leading-relaxed max-w-2xl drop-shadow">
                {heroSubtitle}
              </p>

              {/* 4. CTA Buttons: DAFTAR PPDB ONLINE & MENGENAL SEKOLAH KAMI */}
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
        </div>

        {/* Replay Video Button (appears discreetly after video ends) */}
        {(videoStatus === 'completed' || videoStatus === 'fading') && (
          <button
            onClick={handleReplayVideo}
            className="absolute bottom-6 right-6 z-25 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062B3A]/85 hover:bg-[#062B3A] text-[#F5FAFC] text-xs font-medium border border-[rgba(32,214,160,0.25)] backdrop-blur-sm shadow-md transition-all group"
            title="Putar Ulang Video Opening"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFBD24] group-hover:-rotate-90 transition-transform duration-300" />
            <span>Putar Ulang Video</span>
          </button>
        )}
      </div>
    </section>
  );
};
