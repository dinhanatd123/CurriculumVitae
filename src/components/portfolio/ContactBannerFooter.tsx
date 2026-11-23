import { Mail, Phone, Linkedin, Github, FileDown, RotateCcw } from 'lucide-react';
import type { PersonalInfo } from '../../types/cv';
import type { PortfolioUiLabels } from '../../data/i18n';
import { normalizeHref } from '../../utils/cvHelpers';

interface ContactBannerFooterProps {
  personal: PersonalInfo;
  uiLabels: PortfolioUiLabels;
  onOpenPrintPreview: () => void;
  onReplaySplash: () => void;
}

const GLASS_PILL_CLASS =
  'inline-flex items-center gap-2.5 px-5 py-3 min-h-[46px] rounded-full border border-white/45 bg-white/12 backdrop-blur-md text-white text-sm font-semibold hover:bg-white hover:text-[#0B1F3A] hover:border-white hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap cursor-pointer';

export function ContactBannerFooter({
  personal,
  uiLabels,
  onOpenPrintPreview,
  onReplaySplash,
}: ContactBannerFooterProps) {
  const year = new Date().getFullYear();

  return (
    <>
      <section
        id="contact"
        className="no-print scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-10 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B1F3A] via-[#0369A1] to-[#0D9488] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-white shadow-[0_28px_64px_-20px_rgba(11,31,58,0.42)]">
            {/* Subtle radial highlight inside banner (static GPU-free background) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.28) 0%, transparent 45%), radial-gradient(circle at 12% 85%, rgba(16, 185, 129, 0.24) 0%, transparent 45%)',
              }}
            />

            <div className="relative z-10 max-w-3xl">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-sky-200 mb-3">
                {uiLabels.eyebrows.contact}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-balance">
                {uiLabels.headings.contactTitle}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-2xl">
                {uiLabels.headings.contactSubtitle}
              </p>

              {/* Glassmorphism Contact Pills */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className={GLASS_PILL_CLASS}>
                    <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Email</span>
                  </a>
                )}

                {personal.phone && (
                  <a
                    href={`tel:${personal.phone.replace(/\s+/g, '')}`}
                    className={GLASS_PILL_CLASS}
                  >
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>SĐT / Zalo</span>
                  </a>
                )}

                {personal.linkedin && (
                  <a
                    href={normalizeHref(personal.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className={GLASS_PILL_CLASS}
                  >
                    <Linkedin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {personal.github && (
                  <a
                    href={normalizeHref(personal.github)}
                    target="_blank"
                    rel="noreferrer"
                    className={GLASS_PILL_CLASS}
                  >
                    <Github className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                )}

                <button type="button" onClick={onOpenPrintPreview} className={GLASS_PILL_CLASS}>
                  <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{uiLabels.actions.downloadPdf}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal White Footer */}
      <footer className="no-print bg-white border-t border-slate-200/80 safe-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <div>
            © {year} <strong className="font-semibold text-[#0B1F3A]">{personal.fullName || 'CV Portfolio'}</strong>.{' '}
            <span>{personal.jobTitle}</span>
          </div>
          <button
            type="button"
            onClick={onReplaySplash}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0284C7] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Xem lại màn hình mở đầu</span>
          </button>
        </div>
      </footer>
    </>
  );
}
