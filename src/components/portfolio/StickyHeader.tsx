import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { PencilLine, FileDown, Menu, X } from 'lucide-react';
import type { PortfolioUiLabels } from '../../data/i18n';

interface StickyHeaderProps {
  candidateName: string;
  uiLabels: PortfolioUiLabels;
  onOpenEditor: () => void;
  onOpenPrintPreview: () => void;
}

const SECTION_IDS = ['intro', 'experience', 'projects', 'skills', 'education', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function StickyHeader({
  candidateName,
  uiLabels,
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
    <header className="no-print sticky top-0 z-40 safe-top bg-white/88 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Edge Gradient Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        className="h-[3px] w-full origin-left bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#10B981]"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Candidate Brand Wordmark */}
        <a
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('intro');
          }}
          className="font-display text-sm sm:text-lg font-extrabold tracking-tight text-[#0B1F3A] whitespace-nowrap min-w-0 truncate hover:text-[#0284C7] transition-colors sm:max-w-[220px]"
        >
          {candidateName || 'CV Portfolio'}
        </a>

        {/* Center: Desktop Section Nav with Active Light-Blue Pill */}
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
                    ? 'bg-sky-50 text-[#0284C7]'
                    : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: 2 Compact Action Pills + Mobile Menu Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenEditor}
            aria-label={uiLabels.actions.editCv}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 min-h-[44px] sm:min-h-[38px] rounded-full border border-slate-200 bg-white text-xs font-semibold text-[#0B1F3A] hover:border-sky-300 hover:bg-sky-50/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PencilLine className="w-3.5 h-3.5 text-[#0284C7]" aria-hidden="true" />
            <span className="hidden sm:inline">{uiLabels.actions.editCv}</span>
            <span className="sm:hidden">
              {uiLabels.actions.editCv.startsWith('Edit') ? 'Edit' : 'Sửa'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenPrintPreview}
            aria-label={uiLabels.actions.exportPdf}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 min-h-[44px] sm:min-h-[38px] rounded-full bg-gradient-to-r from-[#0284C7] to-[#10B981] text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
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
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-[#0B1F3A] hover:bg-slate-100 transition-colors shrink-0"
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
                    ? 'bg-sky-50 text-[#0284C7]'
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
