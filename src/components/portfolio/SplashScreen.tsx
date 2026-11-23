import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import type { PersonalInfo, PortfolioStory, WebThemeId } from '../../types/cv';
import type { PortfolioUiLabels } from '../../data/i18n';
import { WEB_THEMES } from '../../data/themes';
import { getInitials } from '../../utils/cvHelpers';

interface SplashScreenProps {
  personal: PersonalInfo;
  story: PortfolioStory;
  uiLabels: PortfolioUiLabels;
  activeTheme: WebThemeId;
  onSelectTheme: (themeId: WebThemeId) => void;
  onEnter: () => void;
}

export function SplashScreen({
  personal,
  story,
  uiLabels,
  activeTheme,
  onSelectTheme,
  onEnter,
}: SplashScreenProps) {
  const touchStartYRef = useRef<number | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [personal.avatarUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === 'BUTTON' || tag === 'A') return;
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
      {/* Top-Right Compact Theme Dots Bar */}
      <div
        role="group"
        aria-label="Chọn màu chủ đạo trang web"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-sm"
      >
        {WEB_THEMES.map((theme) => {
          const isSelected = theme.id === activeTheme;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              title={theme.nameVi}
              aria-label={`Chọn chủ đề màu ${theme.nameVi}`}
              aria-pressed={isSelected}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                isSelected
                  ? 'scale-110 ring-2 ring-offset-2 ring-slate-800'
                  : 'opacity-80 hover:opacity-100 hover:scale-105'
              }`}
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.swatchFrom}, ${theme.swatchTo})`,
              }}
            />
          );
        })}
      </div>

      {/* Orbiting Avatar Centerpiece */}
      <div className="relative flex items-center justify-center mb-8 sm:mb-10">
        {/* Thin Rotating Ellipses (GPU transform only) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 280 280"
          className="w-56 h-56 sm:w-64 sm:h-64 animate-orbit-slow opacity-35"
          style={{ color: 'var(--theme-accent)' }}
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
          <circle cx="255" cy="108" r="3.5" fill="var(--theme-accent)" />
        </svg>

        <svg
          aria-hidden="true"
          viewBox="0 0 280 280"
          className="absolute w-56 h-56 sm:w-64 sm:h-64 animate-orbit-reverse opacity-35"
          style={{ color: 'var(--theme-accent-2)' }}
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
          <circle cx="48" cy="186" r="3" fill="var(--theme-accent-2)" />
        </svg>

        {/* Portrait or Initials Monogram */}
        <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 theme-gradient-diag shadow-xl">
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
              <span className="font-display text-3xl font-extrabold text-theme-ink tracking-tight">
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
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-theme-accent mb-3">
          {personal.jobTitle || 'Interactive Portfolio'}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-theme-ink leading-[1.1] text-balance">
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
            className="animate-soft-ring pointer-events-none absolute inset-0 rounded-full border-2"
            style={{ borderColor: 'var(--theme-accent)' }}
          />
          <button
            type="button"
            onClick={onEnter}
            className="relative inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full bg-white text-theme-ink text-sm sm:text-base font-bold shadow-[0_12px_32px_-8px_rgba(15,23,42,0.2)] border border-theme-soft hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
          >
            <span>{uiLabels.actions.exploreProfile}</span>
            <span className="w-7 h-7 rounded-full theme-gradient-bg text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="inline-flex flex-col items-center gap-1 text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500 hover:text-theme-accent transition-colors py-1 cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{uiLabels.actions.tapToStart}</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
