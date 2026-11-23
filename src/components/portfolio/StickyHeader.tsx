import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { PencilLine, FileDown, Menu, X, Palette, Check } from 'lucide-react';
import type { PortfolioUiLabels } from '../../data/i18n';
import type { CvLanguage, WebThemeId } from '../../types/cv';
import { WEB_THEMES, getWebThemePreset } from '../../data/themes';

interface StickyHeaderProps {
  candidateName: string;
  uiLabels: PortfolioUiLabels;
  language: CvLanguage;
  activeTheme: WebThemeId;
  onSelectTheme: (themeId: WebThemeId) => void;
  onOpenEditor: () => void;
  onOpenPrintPreview: () => void;
}

const SECTION_IDS = ['intro', 'experience', 'projects', 'skills', 'education', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function StickyHeader({
  candidateName,
  uiLabels,
  language,
  activeTheme,
  onSelectTheme,
  onOpenEditor,
  onOpenPrintPreview,
}: StickyHeaderProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  const [activeSection, setActiveSection] = useState<SectionId>('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const currentTheme = getWebThemePreset(activeTheme);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.05, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!themeMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setThemeMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [themeMenuOpen]);

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'intro', label: uiLabels.nav.intro },
    { id: 'experience', label: uiLabels.nav.experience },
    { id: 'projects', label: uiLabels.nav.projects },
    { id: 'skills', label: uiLabels.nav.skills },
    { id: 'education', label: uiLabels.nav.education },
    { id: 'contact', label: uiLabels.nav.contact },
  ];

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 safe-top bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Edge Gradient Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="h-[3px] w-full origin-left theme-gradient-bg"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Candidate Brand Wordmark */}
        <a
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('intro');
          }}
          className="font-display text-sm sm:text-lg font-extrabold tracking-tight text-theme-ink whitespace-nowrap min-w-0 truncate hover:text-theme-accent transition-colors sm:max-w-[210px]"
        >
          {candidateName || 'CV Portfolio'}
        </a>

        {/* Center: Desktop Section Nav with Active Theme Soft Pill */}
        <nav aria-label="Điều hướng hồ sơ" className="hidden lg:flex items-center gap-1 shrink-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-theme-soft text-theme-accent'
                    : 'text-slate-600 hover:text-theme-ink hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Picker + 2 Action Pills + Mobile Menu Trigger */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Youthful Web Color Theme Picker */}
          <div ref={themeMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeMenuOpen((v) => !v)}
              aria-expanded={themeMenuOpen}
              aria-haspopup="true"
              aria-label="Đổi màu chủ đạo trang web"
              title="Đổi màu chủ đạo trang web"
              className="inline-flex items-center justify-center gap-1.5 w-11 h-11 sm:w-auto sm:h-auto sm:px-3 sm:min-h-[38px] rounded-full border border-slate-200 bg-white text-xs font-semibold text-theme-ink hover:border-theme-soft hover:bg-theme-soft transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="w-4 h-4 rounded-full ring-1 ring-black/10 shrink-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${currentTheme.swatchFrom}, ${currentTheme.swatchTo})`,
                }}
              />
              <Palette className="hidden xl:block w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span className="hidden xl:inline">{language === 'en' ? 'Theme' : 'Màu sắc'}</span>
            </button>

            {themeMenuOpen && (
              <div
                role="dialog"
                aria-label="Chọn bảng màu chủ đạo"
                className="absolute right-0 mt-2 w-[272px] max-w-[calc(100vw-24px)] rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50"
              >
                <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-theme-ink">
                    {language === 'en' ? 'Website Color Theme' : 'Màu chủ đạo trang web'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {WEB_THEMES.length} {language === 'en' ? 'palettes' : 'bảng màu'}
                  </span>
                </div>

                <div className="space-y-1">
                  {WEB_THEMES.map((theme) => {
                    const isSelected = theme.id === activeTheme;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          onSelectTheme(theme.id);
                          setThemeMenuOpen(false);
                        }}
                        aria-pressed={isSelected}
                        className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-100/90 ring-1 ring-slate-200'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="w-7 h-7 rounded-full shrink-0 shadow-xs ring-1 ring-black/10 flex items-center justify-center text-white"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${theme.swatchFrom}, ${theme.swatchTo})`,
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {language === 'en' ? theme.nameEn : theme.nameVi}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {theme.taglineVi}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenEditor}
            aria-label={uiLabels.actions.editCv}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 min-h-[44px] sm:min-h-[38px] rounded-full border border-slate-200 bg-white text-xs font-semibold text-theme-ink hover:border-theme-soft hover:bg-theme-soft transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PencilLine className="w-3.5 h-3.5 text-theme-accent" aria-hidden="true" />
            <span className="hidden sm:inline">{uiLabels.actions.editCv}</span>
            <span className="sm:hidden">
              {uiLabels.actions.editCv.startsWith('Edit') ? 'Edit' : 'Sửa'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenPrintPreview}
            aria-label={uiLabels.actions.exportPdf}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 min-h-[44px] sm:min-h-[38px] rounded-full theme-gradient-bg text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{uiLabels.actions.exportPdf}</span>
            <span className="sm:hidden">PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-theme-ink hover:bg-slate-100 transition-colors shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Touch-Friendly Slide-Down Menu (>= 44px targets) */}
      {mobileMenuOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="lg:hidden border-t border-slate-200/80 bg-white px-4 py-3 grid grid-cols-2 gap-1.5 shadow-lg"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`min-h-[44px] px-4 rounded-xl text-left text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-theme-soft text-theme-accent'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
