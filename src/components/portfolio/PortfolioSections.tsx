import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Layers, MapPin, Award, GraduationCap, Globe } from 'lucide-react';
import type { CvData, CvSettings, ProjectItem } from '../../types/cv';
import type { CvSectionLabels, PortfolioUiLabels } from '../../data/i18n';

interface PortfolioSectionsProps {
  data: CvData;
  settings: CvSettings;
  cvLabels: CvSectionLabels;
  uiLabels: PortfolioUiLabels;
  onSelectProject: (project: ProjectItem) => void;
}

function ProjectCardImage({ project }: { project: ProjectItem }) {
  const [hasError, setHasError] = useState(false);

  if (!project.imageUrl || hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0B1F3A] via-[#0369A1] to-[#0D9488] flex flex-col items-center justify-center p-6 text-white text-center">
        <Layers className="w-8 h-8 mb-2 opacity-80" aria-hidden="true" />
        <span className="font-display text-sm font-bold line-clamp-2">{project.name}</span>
      </div>
    );
  }

  return (
    <img
      src={project.imageUrl}
      alt={`Minh họa ${project.name}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

export function PortfolioSections({
  data,
  settings,
  cvLabels,
  uiLabels,
  onSelectProject,
}: PortfolioSectionsProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const lineScaleY = useTransform(timelineProgress, [0, 1], [0, 1]);

  const { visibility } = data;

  // Combine Education + Certificates into numbered grid cards (01, 02, 03, 04...)
  const credentialCards: {
    id: string;
    kind: 'education' | 'certificate';
    title: string;
    subtitle: string;
    meta: string;
    detail: string;
  }[] = [
    ...(visibility.education
      ? data.education.map((edu) => ({
          id: edu.id,
          kind: 'education' as const,
          title: edu.school,
          subtitle: edu.major,
          meta: edu.period,
          detail: edu.gpaOrHonors,
        }))
      : []),
    ...(visibility.certificates
      ? data.certificates.map((cert) => ({
          id: cert.id,
          kind: 'certificate' as const,
          title: cert.name,
          subtitle: cert.issuer,
          meta: cert.year,
          detail: '',
        }))
      : []),
  ];

  return (
    <div className="bg-[#F8FAFC] relative">
      {/* 01 / KINH NGHIỆM LÀM VIỆC */}
      {visibility.experience && data.experience.length > 0 && (
        <section
          id="experience"
          className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto"
        >
          <div className="mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#0284C7] mb-3">
              {uiLabels.eyebrows.experience}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#0B1F3A]">{uiLabels.headings.experienceSolid} </span>
              <span className="text-outline-blue">{uiLabels.headings.experienceOutline}</span>
            </h2>
            {visibility.summary && data.summary.trim() && (
              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                {data.summary}
              </p>
            )}
          </div>

          {/* Scroll-Drawn Timeline */}
          <div ref={timelineRef} className="relative pl-6 sm:pl-10">
            {/* Background static track */}
            <div
              aria-hidden="true"
              className="absolute left-2 sm:left-3 top-2 bottom-2 w-[2px] bg-slate-200 rounded-full"
            />
            {/* Active scroll-drawn gradient axis (GPU scaleY) */}
            <motion.div
              aria-hidden="true"
              style={{ scaleY: lineScaleY }}
              className="absolute left-2 sm:left-3 top-2 bottom-2 w-[2px] origin-top bg-gradient-to-b from-[#0284C7] via-[#0EA5E9] to-[#10B981] rounded-full"
            />

            <div className="space-y-8 sm:space-y-10">
              {data.experience.map((exp, idx) => {
                const dateRange = [
                  exp.startDate,
                  exp.isCurrent ? cvLabels.present : exp.endDate,
                ]
                  .filter(Boolean)
                  .join(' – ');

                return (
                  <motion.article
                    key={exp.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    {/* Timeline Node */}
                    <span
                      aria-hidden="true"
                      className="absolute -left-[23px] sm:-left-[35px] top-7 w-4 h-4 rounded-full bg-white border-[3px] border-[#0284C7] shadow-xs"
                    />

                    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-sky-300 hover:shadow-[0_18px_40px_-16px_rgba(2,132,199,0.18)] transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1F3A]">
                            {exp.position}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            <span className="font-semibold text-[#0284C7]">{exp.company}</span>
                            {exp.location && (
                              <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
                                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{exp.location}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {dateRange && (
                          <span className="px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0284C7] text-xs font-bold tabular-nums whitespace-nowrap">
                            {dateRange}
                          </span>
                        )}
                      </div>

                      {exp.bullets.filter((b) => b.trim()).length > 0 && (
                        <ul className="mt-4 space-y-2.5 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                          {exp.bullets
                            .filter((b) => b.trim())
                            .map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3">
                                <span
                                  aria-hidden="true"
                                  className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#10B981] shrink-0"
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 02 / DỰ ÁN TIÊU BIỂU */}
      {visibility.projects && data.projects.length > 0 && (
        <section
          id="projects"
          className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-white border-y border-slate-200/70"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 sm:mb-14">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#0284C7] mb-3">
                {uiLabels.eyebrows.projects}
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-[#0B1F3A]">{uiLabels.headings.projectsSolid} </span>
                <span className="text-outline-blue">{uiLabels.headings.projectsOutline}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {data.projects.map((proj, idx) => {
                const techList = proj.technologies
                  .split(/[,·•]/)
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .slice(0, 4);

                return (
                  <motion.article
                    key={proj.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex flex-col rounded-3xl bg-[#F8FAFC] border border-slate-200/90 overflow-hidden hover:-translate-y-1.5 hover:border-sky-400 hover:shadow-[0_24px_48px_-16px_rgba(2,132,199,0.22)] transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectProject(proj)}
                      aria-label={`Xem chi tiết dự án ${proj.name}`}
                      className="flex flex-col flex-1 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        <ProjectCardImage project={proj} />
                      </div>

                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                          <span className="font-semibold text-[#0284C7] truncate">
                            {proj.role || cvLabels.projects}
                          </span>
                          {proj.period && (
                            <span className="tabular-nums shrink-0">{proj.period}</span>
                          )}
                        </div>

                        <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#0B1F3A] group-hover:text-[#0284C7] transition-colors">
                          {proj.name}
                        </h3>

                        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                          {proj.description}
                        </p>

                        {techList.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {techList.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-semibold text-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#0B1F3A] group-hover:text-[#0284C7] transition-colors">
                          <span>{uiLabels.actions.viewProjectDetail}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </div>
                      </div>
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 03 / KỸ NĂNG & CÔNG CỤ */}
      {((visibility.skills && data.skills.length > 0) ||
        (visibility.languages && data.languages.length > 0)) && (
        <section
          id="skills"
          className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto"
        >
          <div className="mb-12 sm:mb-14">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#0284C7] mb-3">
              {uiLabels.eyebrows.skills}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#0B1F3A]">{uiLabels.headings.skillsSolid} </span>
              <span className="text-outline-blue">{uiLabels.headings.skillsOutline}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibility.skills &&
              data.skills.map((group, gIdx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: gIdx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs"
                >
                  <h3 className="font-display text-lg font-extrabold text-[#0B1F3A] pb-3 mb-4 border-b border-slate-100">
                    {group.category}
                  </h3>

                  {settings.skillDisplayMode === 'tags' ? (
                    <div className="flex flex-wrap gap-2">
                      {group.items
                        .filter((sk) => sk.name.trim())
                        .map((sk) => (
                          <span
                            key={sk.id}
                            className="px-3.5 py-1.5 rounded-full bg-sky-50/80 border border-sky-200/70 text-xs font-semibold text-[#0B1F3A]"
                          >
                            {sk.name}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {group.items
                        .filter((sk) => sk.name.trim())
                        .map((sk, sIdx) => (
                          <div key={sk.id}>
                            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                              <span>{sk.name}</span>
                              <span className="tabular-nums text-xs text-[#0284C7]">
                                {sk.level * 20}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: sk.level / 5 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                  duration: 0.65,
                                  delay: 0.08 + sIdx * 0.05,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#0284C7] to-[#10B981]"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              ))}

            {/* Languages Card */}
            {visibility.languages && data.languages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs md:col-span-2 lg:col-span-3"
              >
                <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
                  <Globe className="w-5 h-5 text-[#0284C7]" aria-hidden="true" />
                  <h3 className="font-display text-lg font-extrabold text-[#0B1F3A]">
                    {cvLabels.languages}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="rounded-2xl bg-[#F8FAFC] border border-slate-200/70 px-4 py-3.5"
                    >
                      <div className="font-display font-bold text-[#0B1F3A]">{lang.name}</div>
                      {lang.proficiency && (
                        <div className="text-xs sm:text-sm text-slate-600 mt-1">
                          {lang.proficiency}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* 04 / HỌC VẤN & CHỨNG CHỈ (Numbered Background Cards 01, 02, 03, 04) */}
      {credentialCards.length > 0 && (
        <section
          id="education"
          className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-white border-t border-slate-200/70"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 sm:mb-14">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#0284C7] mb-3">
                {uiLabels.eyebrows.education}
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-[#0B1F3A]">{uiLabels.headings.educationSolid} </span>
                <span className="text-outline-blue">{uiLabels.headings.educationOutline}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {credentialCards.map((card, idx) => {
                const indexLabel = String(idx + 1).padStart(2, '0');
                return (
                  <motion.article
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative overflow-hidden rounded-3xl bg-[#F8FAFC] border border-slate-200/90 p-7 sm:p-8 hover:-translate-y-1.5 hover:bg-white hover:border-sky-400 hover:shadow-[0_24px_48px_-16px_rgba(2,132,199,0.22)] transition-all duration-300"
                  >
                    {/* Subtle Large Number Background (01, 02, 03, 04) */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none select-none font-display text-6xl sm:text-7xl font-extrabold text-sky-950/[0.05] group-hover:text-sky-500/[0.11] transition-colors absolute top-3 right-5 leading-none tabular-nums"
                    >
                      {indexLabel}
                    </span>

                    <div className="relative z-10 space-y-2.5">
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0284C7] pr-16">
                        {card.kind === 'education' ? (
                          <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" />
                        ) : (
                          <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
                        )}
                        <span>
                          {card.kind === 'education' ? cvLabels.education : cvLabels.certificates}
                        </span>
                        {card.meta && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums text-slate-500">{card.meta}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1F3A] pr-16 sm:pr-20 leading-snug">
                        {card.title}
                      </h3>

                      {card.subtitle && (
                        <p className="text-sm sm:text-base font-semibold text-slate-700">
                          {card.subtitle}
                        </p>
                      )}

                      {card.detail && (
                        <p className="text-sm text-slate-600 leading-relaxed pt-1">{card.detail}</p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Optional Activities & References when enabled */}
            {((visibility.activities && data.activities.length > 0) ||
              (visibility.references && data.references.length > 0)) && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibility.activities && data.activities.length > 0 && (
                  <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200/90 p-7">
                    <h3 className="font-display text-lg font-extrabold text-[#0B1F3A] mb-4">
                      {cvLabels.activities}
                    </h3>
                    <div className="space-y-4">
                      {data.activities.map((act) => (
                        <div key={act.id}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-bold text-[#0B1F3A]">{act.organization}</span>
                            {act.period && (
                              <span className="text-xs text-slate-500 tabular-nums shrink-0">
                                {act.period}
                              </span>
                            )}
                          </div>
                          {act.role && (
                            <div className="text-xs font-semibold text-[#0284C7] mt-0.5">
                              {act.role}
                            </div>
                          )}
                          {act.description && (
                            <p className="text-sm text-slate-600 mt-1">{act.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {visibility.references && data.references.length > 0 && (
                  <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200/90 p-7">
                    <h3 className="font-display text-lg font-extrabold text-[#0B1F3A] mb-4">
                      {cvLabels.references}
                    </h3>
                    <div className="space-y-4">
                      {data.references.map((ref) => (
                        <div key={ref.id}>
                          <div className="font-bold text-[#0B1F3A]">{ref.name}</div>
                          {ref.titleAndCompany && (
                            <div className="text-sm text-slate-700">{ref.titleAndCompany}</div>
                          )}
                          {ref.contact && (
                            <div className="text-xs text-slate-500 mt-0.5 break-words">
                              {ref.contact}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
