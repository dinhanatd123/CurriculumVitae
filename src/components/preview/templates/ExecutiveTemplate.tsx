import { Phone, Mail, MapPin, Calendar, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';
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

export function ExecutiveTemplate({ data, settings, labels, densityScale }: TemplateProps) {
  const { personal, visibility } = data;
  const accent = settings.primaryColor;
  const headerInk = getContrastTextColor(accent);
  const isLightHeader = headerInk === '#0F172A';
  const headerSubtle = isLightHeader ? 'rgba(15, 23, 42, 0.78)' : 'rgba(255, 255, 255, 0.84)';
  const headerDivider = isLightHeader ? 'rgba(15, 23, 42, 0.14)' : 'rgba(255, 255, 255, 0.2)';

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
      className={`cv-paper flex flex-col bg-white text-slate-800 ${densityScale.bodyText} ${densityScale.lineHeight}`}
    >
      {/* Prominent Executive Colored Header */}
      <header
        className="px-9 py-7"
        style={{ backgroundColor: accent, color: headerInk }}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className={`${densityScale.nameText} font-bold tracking-tight leading-tight`}>
              {personal.fullName || 'Họ và Tên'}
            </h1>
            {personal.jobTitle && (
              <p
                className={`${densityScale.titleText} font-medium mt-1`}
                style={{ color: headerSubtle }}
              >
                {personal.jobTitle}
              </p>
            )}
          </div>
          {personal.showAvatar && (
            <CvAvatar
              src={personal.avatarUrl}
              fullName={personal.fullName}
              shape={personal.avatarShape}
              sizeClass="w-24 h-24"
              accentColor={headerDivider}
              contrastInk={headerInk}
              ringClass="ring-2 ring-white/30 shadow-sm"
            />
          )}
        </div>

        {contactItems.length > 0 && (
          <div
            className="mt-4 pt-3 border-t flex flex-wrap gap-x-5 gap-y-1.5 text-[11.5px]"
            style={{ borderColor: headerDivider, color: headerSubtle }}
          >
            {contactItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="inline-flex items-center gap-1.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline break-all"
                      style={{ color: headerInk }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="break-words" style={{ color: headerInk }}>
                      {item.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </header>

      {/* Structured Executive Body */}
      <main className={`flex flex-col ${densityScale.pagePad} ${densityScale.sectionGap}`}>
        {/* Summary */}
        {visibility.summary && data.summary.trim() && (
          <section
            className="cv-avoid-break rounded-md px-4 py-3"
            style={{ backgroundColor: hexToRgba(accent, 0.05) }}
          >
            <h2
              className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase mb-1.5`}
              style={{ color: accent }}
            >
              {labels.summary}
            </h2>
            <p className="text-slate-700 whitespace-pre-line">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {visibility.experience && data.experience.length > 0 && (
          <section>
            <div className="cv-heading-keep flex items-center gap-3 mb-2.5">
              <h2
                className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                style={{ color: accent }}
              >
                {labels.experience}
              </h2>
              <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
            </div>
            <div className={densityScale.itemGap}>
              {data.experience.map((exp) => {
                const dateRange = [
                  exp.startDate,
                  exp.isCurrent ? labels.present : exp.endDate,
                ]
                  .filter(Boolean)
                  .join(' – ');
                return (
                  <article key={exp.id} className="cv-avoid-break grid grid-cols-[125px_1fr] gap-4">
                    <div className="pt-0.5">
                      {dateRange && (
                        <div className={`${densityScale.smallText} font-semibold text-slate-700 tabular-nums`}>
                          {dateRange}
                        </div>
                      )}
                      {exp.location && (
                        <div className={`${densityScale.smallText} text-slate-500 mt-0.5`}>{exp.location}</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900">{exp.position}</h3>
                      {exp.company && (
                        <div className={`${densityScale.smallText} font-semibold mt-0.5`} style={{ color: accent }}>
                          {exp.company}
                        </div>
                      )}
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
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {visibility.projects && data.projects.length > 0 && (
          <section>
            <div className="cv-heading-keep flex items-center gap-3 mb-2.5">
              <h2
                className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                style={{ color: accent }}
              >
                {labels.projects}
              </h2>
              <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
            </div>
            <div className={densityScale.itemGap}>
              {data.projects.map((proj) => (
                <article key={proj.id} className="cv-avoid-break grid grid-cols-[125px_1fr] gap-4">
                  <div className="pt-0.5">
                    {proj.period && (
                      <div className={`${densityScale.smallText} font-semibold text-slate-700 tabular-nums`}>
                        {proj.period}
                      </div>
                    )}
                    {proj.role && (
                      <div className={`${densityScale.smallText} font-medium mt-0.5`} style={{ color: accent }}>
                        {proj.role}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                    {proj.technologies && (
                      <div className={`${densityScale.smallText} text-slate-600 mt-0.5`}>
                        <strong className="font-medium text-slate-700">{labels.technologies}:</strong>{' '}
                        {proj.technologies}
                      </div>
                    )}
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
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {visibility.education && data.education.length > 0 && (
          <section>
            <div className="cv-heading-keep flex items-center gap-3 mb-2">
              <h2
                className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                style={{ color: accent }}
              >
                {labels.education}
              </h2>
              <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
            </div>
            <div className={densityScale.itemGap}>
              {data.education.map((edu) => (
                <article key={edu.id} className="cv-avoid-break grid grid-cols-[125px_1fr] gap-4">
                  <div className={`${densityScale.smallText} font-semibold text-slate-700 tabular-nums pt-0.5`}>
                    {edu.period}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                    {edu.major && (
                      <div className={`${densityScale.smallText} font-semibold mt-0.5`} style={{ color: accent }}>
                        {edu.major}
                      </div>
                    )}
                    {edu.gpaOrHonors && (
                      <p className={`${densityScale.smallText} text-slate-600 mt-0.5`}>{edu.gpaOrHonors}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Skills + Secondary Columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {visibility.skills && data.skills.length > 0 && (
            <section className="cv-avoid-break">
              <div className="cv-heading-keep flex items-center gap-3 mb-2.5">
                <h2
                  className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                  style={{ color: accent }}
                >
                  {labels.skills}
                </h2>
                <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
              </div>
              <div className="space-y-2.5">
                {data.skills.map((group) => (
                  <div key={group.id}>
                    {group.category && (
                      <h3 className={`${densityScale.smallText} font-semibold text-slate-800 mb-1`}>
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
                              className="inline-block px-2 py-0.5 rounded text-[10.5px] font-medium"
                              style={{
                                backgroundColor: hexToRgba(accent, 0.1),
                                color: accent,
                              }}
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
                              <div className="flex justify-between text-[11px] mb-0.5">
                                <span className="text-slate-800">{sk.name}</span>
                                <span className="tabular-nums text-slate-500">{sk.level}/5</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${(sk.level / 5) * 100}%`, backgroundColor: accent }}
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

          {/* Certificates & Languages stacked nicely */}
          <div className="space-y-4">
            {visibility.certificates && data.certificates.length > 0 && (
              <section className="cv-avoid-break">
                <div className="cv-heading-keep flex items-center gap-3 mb-2">
                  <h2
                    className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                    style={{ color: accent }}
                  >
                    {labels.certificates}
                  </h2>
                  <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
                </div>
                <ul className="space-y-1.5">
                  {data.certificates.map((cert) => (
                    <li key={cert.id} className="flex items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900">{cert.name}</div>
                        {cert.issuer && (
                          <div className={`${densityScale.smallText} text-slate-600`}>{cert.issuer}</div>
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

            {visibility.languages && data.languages.length > 0 && (
              <section className="cv-avoid-break">
                <div className="cv-heading-keep flex items-center gap-3 mb-2">
                  <h2
                    className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                    style={{ color: accent }}
                  >
                    {labels.languages}
                  </h2>
                  <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
                </div>
                <ul className="space-y-1.5">
                  {data.languages.map((lang) => (
                    <li key={lang.id}>
                      <span className="font-semibold text-slate-900">{lang.name}</span>
                      {lang.proficiency && (
                        <span className={`${densityScale.smallText} text-slate-600`}> — {lang.proficiency}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Activities */}
        {visibility.activities && data.activities.length > 0 && (
          <section>
            <div className="cv-heading-keep flex items-center gap-3 mb-2">
              <h2
                className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                style={{ color: accent }}
              >
                {labels.activities}
              </h2>
              <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
            </div>
            <div className={densityScale.itemGap}>
              {data.activities.map((act) => (
                <article key={act.id} className="cv-avoid-break grid grid-cols-[125px_1fr] gap-4">
                  <div className={`${densityScale.smallText} font-semibold text-slate-700 tabular-nums pt-0.5`}>
                    {act.period}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">{act.organization}</h3>
                    {act.role && (
                      <div className={`${densityScale.smallText} font-semibold`} style={{ color: accent }}>
                        {act.role}
                      </div>
                    )}
                    {act.description && (
                      <p className="mt-1 text-slate-700 whitespace-pre-line">{act.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {visibility.references && data.references.length > 0 && (
          <section className="cv-avoid-break">
            <div className="cv-heading-keep flex items-center gap-3 mb-2">
              <h2
                className={`${densityScale.headingText} font-bold tracking-[0.08em] uppercase shrink-0`}
                style={{ color: accent }}
              >
                {labels.references}
              </h2>
              <div className="border-t-[1.5px] flex-1" style={{ borderColor: hexToRgba(accent, 0.28) }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <div className="font-semibold text-slate-900">{ref.name}</div>
                  {ref.titleAndCompany && (
                    <div className={`${densityScale.smallText} text-slate-600`}>{ref.titleAndCompany}</div>
                  )}
                  {ref.contact && (
                    <div className={`${densityScale.smallText} text-slate-500 break-words`}>{ref.contact}</div>
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
