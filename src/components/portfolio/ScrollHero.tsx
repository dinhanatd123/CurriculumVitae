import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { ArrowDown, ArrowUpRight, FileDown, CheckCircle2, Sparkles } from 'lucide-react';
import type { PersonalInfo, PortfolioStory } from '../../types/cv';
import type { PortfolioUiLabels } from '../../data/i18n';
import { computeHeroActIndex } from '../../utils/cvHelpers';

interface ScrollHeroProps {
  personal: PersonalInfo;
  story: PortfolioStory;
  uiLabels: PortfolioUiLabels;
  onOpenPrintPreview: () => void;
}

function ReducedMotionHero({
  personal,
  story,
  uiLabels,
  onOpenPrintPreview,
}: ScrollHeroProps) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <section id="intro" className="portfolio-radial-bg py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            {story.statusBadge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-soft border border-theme-soft text-xs font-semibold text-theme-accent">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{story.statusBadge}</span>
              </div>
            )}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-theme-ink leading-[1.08] text-balance">
              {personal.fullName}
              <span className="block text-outline-blue mt-1">{personal.jobTitle}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {story.slogan}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenPrintPreview}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full theme-gradient-bg text-white text-sm font-semibold shadow-md cursor-pointer"
              >
                <FileDown className="w-4 h-4" aria-hidden="true" />
                <span>{uiLabels.actions.downloadPdf}</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white text-theme-ink text-sm font-semibold hover:border-theme-soft cursor-pointer"
              >
                <span>{uiLabels.actions.viewProjects}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-xl space-y-5">
              {story.heroStats.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex items-center gap-4 pb-4 last:pb-0 border-b last:border-b-0 border-slate-100"
                >
                  <span className="font-display text-xs font-bold text-theme-accent tabular-nums">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="font-display text-xl font-extrabold text-theme-ink tabular-nums">
                      {st.value}
                    </div>
                    <div className="text-xs font-medium text-slate-500">{st.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedScrollHero({
  personal,
  story,
  uiLabels,
  onOpenPrintPreview,
}: ScrollHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeAct, setActiveAct] = useState<0 | 1 | 2>(0);

  // heroRef is unconditionally attached to the root <section> below, ensuring hydration on mount.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = computeHeroActIndex(latest);
    if (next !== activeAct) {
      setActiveAct(next);
    }
  });

  // GPU-only transforms (opacity, scale, translateY) for silky 60fps across mobile & desktop
  const act1Opacity = useTransform(scrollYProgress, [0, 0.26, 0.36], [1, 1, 0]);
  const act1Scale = useTransform(scrollYProgress, [0, 0.36], [1, 0.93]);
  const act1Y = useTransform(scrollYProgress, [0, 0.36], [0, -32]);

  const act2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const act2Y = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [36, 0, 0, -28]);
  const act2Scale = useTransform(scrollYProgress, [0.3, 0.4, 0.7], [0.96, 1, 0.96]);

  const act3Opacity = useTransform(scrollYProgress, [0.64, 0.74, 1], [0, 1, 1]);
  const act3Y = useTransform(scrollYProgress, [0.64, 0.76], [36, 0]);
  const act3Scale = useTransform(scrollYProgress, [0.64, 0.76], [0.96, 1]);

  const scrollToAct = (actIndex: 0 | 1 | 2) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetProgress = actIndex === 0 ? 0 : actIndex === 1 ? 0.5 : 0.92;
    window.scrollTo({ top: top + maxScroll * targetProgress, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="intro"
      ref={heroRef}
      aria-label="Giới thiệu tương tác 3 chặng"
      className="relative h-[220vh] md:h-[260vh] portfolio-radial-bg"
    >
      <div className="sticky top-0 h-[100dvh] w-full flex items-center overflow-hidden">
        {/* Right-Edge Act Counter Indicator (01 / 03 → 03 / 03) */}
        <div
          aria-label="Tiến độ câu chuyện giới thiệu"
          className="hidden sm:flex flex-col items-end gap-3 absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-20"
        >
          <div className="font-display text-xs font-bold tracking-[0.16em] text-theme-ink tabular-nums">
            0{activeAct + 1} <span className="text-slate-400">/ 03</span>
          </div>
          <div className="flex flex-col gap-2">
            {([0, 1, 2] as const).map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToAct(idx)}
                aria-label={`Chuyển đến chặng 0${idx + 1} trên 03`}
                aria-pressed={activeAct === idx}
                className={`w-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeAct === idx
                    ? 'h-8 theme-gradient-vertical'
                    : 'h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Compact Act Counter at Bottom */}
        <div className="sm:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs">
          <span className="font-display text-[11px] font-bold tracking-[0.14em] text-theme-ink tabular-nums">
            0{activeAct + 1} / 03
          </span>
          <div className="flex items-center gap-1.5">
            {([0, 1, 2] as const).map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToAct(idx)}
                aria-label={`Chặng 0${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  activeAct === idx ? 'w-5 theme-gradient-bg' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center">
          {/* ACT 01 (01 / 03): Split Introduction + 3D Tilted Summary Card */}
          <motion.div
            style={{ opacity: act1Opacity, scale: act1Scale, y: act1Y }}
            className={`absolute inset-x-4 sm:inset-x-6 lg:inset-x-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
              activeAct === 0 ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
            }`}
          >
            {/* Left Copy & CTAs */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {story.statusBadge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-soft border border-theme-soft text-xs font-semibold text-theme-accent">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{story.statusBadge}</span>
                </div>
              )}

              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight text-theme-ink leading-[1.08] text-balance">
                  {personal.fullName || 'Nguyễn Minh Khôi'}
                </h1>
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-outline-blue leading-tight">
                  {personal.jobTitle || 'Senior Frontend Engineer'}
                </p>
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl">
                {story.slogan}
              </p>

              {/* 2 Primary CTA Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenPrintPreview}
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-full theme-gradient-bg text-white text-sm font-semibold shadow-lg hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
                >
                  <FileDown className="w-4 h-4" aria-hidden="true" />
                  <span>{uiLabels.actions.downloadPdf}</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-full border border-slate-300 bg-white/95 text-theme-ink text-sm font-semibold hover:border-theme-soft hover:text-theme-accent hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>{uiLabels.actions.viewProjects}</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* 3 Core Strengths */}
              {story.strengths.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {story.strengths.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-theme-ink shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: 3D Tilted Highlight Card + 2 Floating Badges */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center [perspective:1200px]">
              <div className="relative w-full max-w-[390px] transition-transform duration-500 ease-out [transform:rotateY(-8deg)_rotateX(4deg)] hover:[transform:rotateY(-2deg)_rotateX(1deg)]">
                {/* Main 3D Card */}
                <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-[0_28px_60px_-18px_rgba(15,23,42,0.16)] space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-theme-accent">
                        Tổng quan năng lực
                      </div>
                      <div className="font-display text-lg font-extrabold text-theme-ink mt-0.5">
                        3 Dấu ấn nổi bật
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl theme-gradient-diag text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {story.heroStats.slice(0, 3).map((stat, idx) => (
                      <div
                        key={stat.id}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/90 border border-slate-100"
                      >
                        <div className="w-9 h-9 rounded-xl bg-theme-soft border border-theme-soft text-theme-accent font-display text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums shadow-2xs">
                          0{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="font-display text-lg font-extrabold text-theme-ink leading-tight tabular-nums">
                            {stat.value}
                          </div>
                          <div className="text-xs font-medium text-slate-600 mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge Top-Right */}
                {story.floatingBadges[0] && (
                  <div className="absolute -top-4 -right-5 px-4 py-2 rounded-2xl theme-ink-bg text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                    {story.floatingBadges[0]}
                  </div>
                )}

                {/* Floating Badge Bottom-Left */}
                {story.floatingBadges[1] && (
                  <div className="absolute -bottom-4 -left-5 px-4 py-2 rounded-2xl theme-gradient-bg text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                    {story.floatingBadges[1]}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ACT 02 (02 / 03): Solid + Outline Stroke Core Philosophy */}
          <motion.div
            style={{ opacity: act2Opacity, y: act2Y, scale: act2Scale }}
            className={`absolute inset-x-4 sm:inset-x-8 lg:inset-x-14 max-w-5xl mx-auto text-center ${
              activeAct === 1 ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
            }`}
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-theme-accent mb-4">
              02 / 03 · GIÁ TRỊ CỐT LÕI
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-balance">
              <span className="block text-theme-ink">{story.act2Solid}</span>
              <span className="block text-outline-blue mt-1.5">{story.act2Outline}</span>
            </h2>
            <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {story.act2Description}
            </p>
          </motion.div>

          {/* ACT 03 (03 / 03): Centered Impact Statement + Scroll Down CTA */}
          <motion.div
            style={{ opacity: act3Opacity, y: act3Y, scale: act3Scale }}
            className={`absolute inset-x-4 sm:inset-x-8 lg:inset-x-14 max-w-4xl mx-auto text-center ${
              activeAct === 2 ? 'pointer-events-auto z-10' : 'pointer-events-none z-0'
            }`}
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-theme-accent mb-4">
              03 / 03 · SẴN SÀNG ĐỒNG HÀNH
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-theme-ink leading-[1.12] text-balance">
              {story.act3Headline}
            </h2>
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {story.act3Subtext}
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => scrollToSection('experience')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[48px] rounded-full theme-gradient-bg text-white text-sm sm:text-base font-semibold shadow-lg hover:opacity-95 hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
              >
                <span>{uiLabels.actions.scrollToDetails}</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ScrollHero(props: ScrollHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <ReducedMotionHero {...props} />;
  }
  return <AnimatedScrollHero {...props} />;
}
