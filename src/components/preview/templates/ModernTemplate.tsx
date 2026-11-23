import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
} from 'lucide-react';
import type { CvData, CvSettings } from '../../../types/cv';
import type { CvSectionLabels } from '../../../data/i18n';
import {
  formatDisplayUrl,
  getContrastTextColor,
  hexToRgba,
  normalizeHref,
} from '../../../utils/cvHelpers';
import { CvAvatar } from '../CvAvatar';

interface TemplateProps {
  data: CvData;
  settings: CvSettings;
  labels: CvSectionLabels;
  densityScale: {
    pagePad: string;
    sectionGap: string;
    itemGap: string;
    bodyText: string;
    smallText: string;
    headingText: string;
    nameText: string;
    titleText: string;
    lineHeight: string;
  };
}

export function ModernTemplate({ data, settings, labels, densityScale }: TemplateProps) {
  const { personal, visibility } = data;
  const accent = settings.primaryColor;
  const sidebarInk = getContrastTextColor(accent);
  const isLightSidebar = sidebarInk === '#0F172A';
  const sidebarMuted = isLightSidebar ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.78)';
  const sidebarRule = isLightSidebar ? 'rgba(15, 23, 42, 0.16)' : 'rgba(255, 255, 255, 0.22)';
  const sidebarTagBg = isLightSidebar ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.14)';
  const sidebarTrackBg = isLightSidebar ? 'rgba(15, 23, 42, 0.16)' : 'rgba(255, 255, 255, 0.22)';

  const contactItems = [
    { icon: Phone, value: personal.phone, href: personal.phone ? `tel:${personal.phone.replace(/\s+/g, '')}` : '' },
    { icon: Mail, value: personal.email, href: personal.email ? `mailto:${personal.email}` : '' },
    { icon: MapPin, value: personal.address, href: '' },
    { icon: Calendar, value: personal.dateOfBirth ? `${labels.dob}: ${personal.dateOfBirth}` : '', href: '' },
    { icon: Linkedin, value: formatDisplayUrl(personal.linkedin), href: normalizeHref(personal.linkedin) },
    { icon: Github, value: formatDisplayUrl(personal.github), href: normalizeHref(personal.github) },
    { icon: Globe, value: formatDisplayUrl(personal.portfolio), href: normalizeHref(personal.portfolio) },
  ].filter((item) => item.value.trim().length > 0);

  return (
    <div
      className={`cv-paper grid grid-cols-[32%_68%] ${densityScale.bodyText} ${densityScale.lineHeight}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${accent} 32%, #ffffff 32%)`,
      }}
    >
      {/* Left Sidebar (32%) */}
      <aside
        className={`flex flex-col ${densityScale.pagePad} ${densityScale.sectionGap}`}
        style={{ color: sidebarInk }}
      >
        {/* Avatar */}
        {personal.showAvatar && (
          <div className="flex justify-center pb-1">
            <CvAvatar
              src={personal.avatarUrl}
              fullName={personal.fullName}
              shape={personal.avatarShape}
              sizeClass="w-28 h-28"
              accentColor={sidebarTagBg}
              contrastInk={sidebarInk}
              ringClass="ring-2 ring-white/30 shadow-sm"
            />
          </div>
        )}

        {/* Contact */}
        {contactItems.length > 0 && (
          <section className="cv-avoid-break">
            <h2
              className="cv-heading-keep text-[11px] font-bold tracking-[0.12em] uppercase pb-1.5 mb-2.5 border-b"
              style={{ borderColor: sidebarRule }}
            >
              {labels.contact}
            </h2>
            <ul className="space-y-2">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-2 text-[11.5px] leading-snug">
                    <Icon
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      style={{ color: sidebarMuted }}
                      aria-hidden="true"
                    />
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="break-words min-w-0 hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="break-words min-w-0">{item.value}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Skills */}
        {visibility.skills && data.skills.length > 0 && (
          <section>
            <h2
              className="cv-heading-keep text-[11px] font-bold tracking-[0.12em] uppercase pb-1.5 mb-2.5 border-b"
              style={{ borderColor: sidebarRule }}
            >
              {labels.skills}
            </h2>
            <div className="space-y-3">
              {data.skills.map((group) => (
                <div key={group.id} className="cv-avoid-break">
                  {group.category && (
                    <h3
                      className="text-[11px] font-semibold mb-1.5"
                      style={{ color: sidebarMuted }}
                    >
                      {group.category}
                    </h3>
                  )}
                  {settings.skillDisplayMode === 'tags' ? (
                    <div className="flex flex-wrap gap-1.5">
                      {group.items
                        .filter((sk) => sk.name.trim())
                        .map((sk) => (
                          <span
                            key={sk.id}
                            className="inline-block px-2 py-0.5 rounded text-[10.5px] font-medium leading-tight break-words"
                            style={{ backgroundColor: sidebarTagBg, color: sidebarInk }}
                          >
                            {sk.name}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {group.items
                        .filter((sk) => sk.name.trim())
                        .map((sk) => (
                          <div key={sk.id}>
                            <div className="flex items-center justify-between gap-2 text-[11px] mb-0.5">
                              <span className="break-words min-w-0">{sk.name}</span>
                              <span className="tabular-nums text-[10px] shrink-0" style={{ color: sidebarMuted }}>
                                {sk.level}/5
                              </span>
                            </div>
                            <div
                              className="h-1.5 w-full rounded-full overflow-hidden"
                              style={{ backgroundColor: sidebarTrackBg }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(sk.level / 5) * 100}%`,
                                  backgroundColor: sidebarInk,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {visibility.languages && data.languages.length > 0 && (
          <section className="cv-avoid-break">
            <h2
              className="cv-heading-keep text-[11px] font-bold tracking-[0.12em] uppercase pb-1.5 mb-2.5 border-b"
              style={{ borderColor: sidebarRule }}
            >
              {labels.languages}
            </h2>
            <ul className="space-y-2">
              {data.languages.map((lang) => (
                <li key={lang.id} className="text-[11.5px] leading-snug">
                  <div className="font-semibold">{lang.name}</div>
                  {lang.proficiency && (
                    <div className="text-[11px] mt-0.5" style={{ color: sidebarMuted }}>
                      {lang.proficiency}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Right Main Column (68%) */}
      <main className={`flex flex-col bg-white text-slate-800 ${densityScale.pagePad} ${densityScale.sectionGap}`}>
        {/* Header Name & Title */}
        <header className="pb-3 border-b border-slate-200">
          <h1
            className={`${densityScale.nameText} font-bold tracking-tight text-slate-900 leading-tight`}
          >
            {personal.fullName || 'Họ và Tên'}
          </h1>
          {personal.jobTitle && (
            <p
              className={`${densityScale.titleText} font-semibold mt-1`}
              style={{ color: accent }}
            >
              {personal.jobTitle}
            </p>
          )}
        </header>

        {/* Summary */}
        {visibility.summary && data.summary.trim() && (
          <section className="cv-avoid-break">
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.summary}
            </h2>
            <p className="text-slate-700 whitespace-pre-line">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {visibility.experience && data.experience.length > 0 && (
          <section>
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2.5 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.experience}
            </h2>
            <div className={densityScale.itemGap}>
              {data.experience.map((exp) => {
                const dateRange = [
                  exp.startDate,
                  exp.isCurrent ? labels.present : exp.endDate,
                ]
                  .filter(Boolean)
                  .join(' – ');
                return (
                  <article key={exp.id} className="cv-avoid-break">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-bold text-slate-900">{exp.position}</h3>
                      {dateRange && (
                        <span className={`${densityScale.smallText} font-medium text-slate-500 tabular-nums shrink-0`}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center justify-between gap-2 ${densityScale.smallText} font-medium mt-0.5`}>
                      <span style={{ color: accent }}>{exp.company}</span>
                      {exp.location && <span className="text-slate-500 shrink-0">{exp.location}</span>}
                    </div>
                    {exp.bullets.filter((b) => b.trim()).length > 0 && (
                      <ul className="mt-1.5 space-y-1 pl-4 list-disc marker:text-slate-400 text-slate-700">
                        {exp.bullets
                          .filter((b) => b.trim())
                          .map((bullet, bIdx) => (
                            <li key={bIdx} className="pl-0.5">
                              {bullet}
                            </li>
                          ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {visibility.projects && data.projects.length > 0 && (
          <section>
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2.5 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.projects}
            </h2>
            <div className={densityScale.itemGap}>
              {data.projects.map((proj) => (
                <article key={proj.id} className="cv-avoid-break">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                    {proj.period && (
                      <span className={`${densityScale.smallText} font-medium text-slate-500 tabular-nums shrink-0`}>
                        {proj.period}
                      </span>
                    )}
                  </div>
                  <div className={`${densityScale.smallText} text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5`}>
                    {proj.role && (
                      <span className="font-medium" style={{ color: accent }}>
                        {proj.role}
                      </span>
                    )}
                    {proj.role && proj.technologies && <span aria-hidden="true">·</span>}
                    {proj.technologies && (
                      <span className="text-slate-600">
                        <strong className="font-medium text-slate-700">{labels.technologies}:</strong>{' '}
                        {proj.technologies}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="mt-1 text-slate-700 whitespace-pre-line">{proj.description}</p>
                  )}
                  {proj.link && (
                    <a
                      href={normalizeHref(proj.link)}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-1 inline-flex items-center gap-1 ${densityScale.smallText} font-medium hover:underline break-all`}
                      style={{ color: accent }}
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span>{formatDisplayUrl(proj.link)}</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {visibility.education && data.education.length > 0 && (
          <section>
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.education}
            </h2>
            <div className={densityScale.itemGap}>
              {data.education.map((edu) => (
                <article key={edu.id} className="cv-avoid-break">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                    {edu.period && (
                      <span className={`${densityScale.smallText} font-medium text-slate-500 tabular-nums shrink-0`}>
                        {edu.period}
                      </span>
                    )}
                  </div>
                  {edu.major && (
                    <div className={`${densityScale.smallText} font-medium mt-0.5`} style={{ color: accent }}>
                      {edu.major}
                    </div>
                  )}
                  {edu.gpaOrHonors && (
                    <p className={`${densityScale.smallText} text-slate-600 mt-0.5`}>{edu.gpaOrHonors}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Certificates & Awards */}
        {visibility.certificates && data.certificates.length > 0 && (
          <section className="cv-avoid-break">
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.certificates}
            </h2>
            <ul className="space-y-1.5">
              {data.certificates.map((cert) => (
                <li key={cert.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-900">{cert.name}</span>
                    {cert.issuer && (
                      <span className={`${densityScale.smallText} text-slate-600`}> — {cert.issuer}</span>
                    )}
                  </div>
                  {cert.year && (
                    <span className={`${densityScale.smallText} text-slate-500 tabular-nums shrink-0`}>
                      {cert.year}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Activities */}
        {visibility.activities && data.activities.length > 0 && (
          <section>
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.activities}
            </h2>
            <div className={densityScale.itemGap}>
              {data.activities.map((act) => (
                <article key={act.id} className="cv-avoid-break">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-bold text-slate-900">{act.organization}</h3>
                    {act.period && (
                      <span className={`${densityScale.smallText} text-slate-500 tabular-nums shrink-0`}>
                        {act.period}
                      </span>
                    )}
                  </div>
                  {act.role && (
                    <div className={`${densityScale.smallText} font-medium`} style={{ color: accent }}>
                      {act.role}
                    </div>
                  )}
                  {act.description && (
                    <p className="mt-1 text-slate-700 whitespace-pre-line">{act.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {visibility.references && data.references.length > 0 && (
          <section className="cv-avoid-break">
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b`}
              style={{ color: accent, borderColor: hexToRgba(accent, 0.22) }}
            >
              {labels.references}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.references.map((ref) => (
                <div key={ref.id} className="cv-avoid-break">
                  <div className="font-semibold text-slate-900">{ref.name}</div>
                  {ref.titleAndCompany && (
                    <div className={`${densityScale.smallText} text-slate-600`}>{ref.titleAndCompany}</div>
                  )}
                  {ref.contact && (
                    <div className={`${densityScale.smallText} text-slate-500 mt-0.5 break-words`}>
                      {ref.contact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
