import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import type { PersonalInfo, PortfolioStory } from '../../types/cv';
import type { PortfolioUiLabels } from '../../data/i18n';
import { getInitials } from '../../utils/cvHelpers';

interface SplashScreenProps {
  personal: PersonalInfo;
  story: PortfolioStory;
  uiLabels: PortfolioUiLabels;
  onEnter: () => void;
}

export function SplashScreen({ personal, story, uiLabels, onEnter }: SplashScreenProps) {
  const touchStartYRef = useRef<number | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [personal.avatarUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    if (touchStartYRef.current - endY > 40) {
      onEnter();
    }
    touchStartYRef.current = null;
  };

  return (
    <motion.div
      data-testid="splash-screen"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -48 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="no-print fixed inset-0 z-50 h-[100dvh] w-full portfolio-radial-bg safe-top safe-bottom flex flex-col items-center justify-center px-6 overflow-hidden select-none"
    >
      {/* Orbiting Avatar Centerpiece */}
      <div className="relative flex items-center justify-center mb-8 sm:mb-10">
        {/* Thin Rotating Ellipses (GPU transform only) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 280 280"
          className="w-56 h-56 sm:w-64 sm:h-64 animate-orbit-slow text-sky-500/30"
        >
          <ellipse
            cx="140"
            cy="140"
            rx="126"
            ry="82"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            transform="rotate(-18 140 140)"
          />
          <circle cx="255" cy="108" r="3.5" fill="#0284C7" />
        </svg>

        <svg
          aria-hidden="true"
          viewBox="0 0 280 280"
          className="absolute w-56 h-56 sm:w-64 sm:h-64 animate-orbit-reverse text-emerald-500/30"
        >
          <ellipse
            cx="140"
            cy="140"
            rx="122"
            ry="76"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            transform="rotate(34 140 140)"
          />
          <circle cx="48" cy="186" r="3" fill="#10B981" />
        </svg>

        {/* Portrait or Initials Monogram */}
        <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-sky-400 via-cyan-500 to-emerald-400 shadow-[0_14px_40px_-10px_rgba(2,132,199,0.35)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
            {personal.showAvatar && personal.avatarUrl && !imgError ? (
              <img
                src={personal.avatarUrl}
                alt={`Chân dung ${personal.fullName}`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="font-display text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                {getInitials(personal.fullName)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Identity & Slogan */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-xl mx-auto"
      >
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#0284C7] mb-3">
          {personal.jobTitle || 'Interactive Portfolio'}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0B1F3A] leading-[1.1] text-balance">
          {personal.fullName || 'Nguyễn Minh Khôi'}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
          {story.slogan}
        </p>
      </motion.div>

      {/* Glowing White Pill CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="mt-9 sm:mt-10 flex flex-col items-center gap-4"
      >
        <div className="relative inline-flex items-center justify-center">
          <span
            aria-hidden="true"
            className="animate-soft-ring pointer-events-none absolute inset-0 rounded-full border-2 border-sky-400/70"
          />
          <button
            type="button"
            onClick={onEnter}
            className="relative inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full bg-white text-[#0B1F3A] text-sm sm:text-base font-bold shadow-[0_12px_32px_-8px_rgba(11,31,58,0.22)] ring-1 ring-sky-200 hover:ring-sky-400 hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
          >
            <span>{uiLabels.actions.exploreProfile}</span>
            <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0284C7] to-[#10B981] text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="inline-flex flex-col items-center gap-1 text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500 hover:text-[#0284C7] transition-colors py-1"
        >
          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{uiLabels.actions.tapToStart}</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
