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

export function ClassicTemplate({ data, settings, labels, densityScale }: TemplateProps) {
  const { personal, visibility } = data;
  const accent = settings.primaryColor;
  const contrastInk = getContrastTextColor(accent);

  const inlineContacts = [
    personal.phone,
    personal.email,
    personal.address,
    personal.dateOfBirth ? `${labels.dob}: ${personal.dateOfBirth}` : '',
  ].filter((v) => v && v.trim());

  const linkContacts = [
    { label: formatDisplayUrl(personal.linkedin), href: normalizeHref(personal.linkedin) },
    { label: formatDisplayUrl(personal.github), href: normalizeHref(personal.github) },
    { label: formatDisplayUrl(personal.portfolio), href: normalizeHref(personal.portfolio) },
  ].filter((v) => v.label);

  return (
    <div
      className={`cv-paper flex flex-col bg-white text-slate-900 ${densityScale.pagePad} ${densityScale.sectionGap} ${densityScale.bodyText} ${densityScale.lineHeight}`}
    >
      {/* ATS-Friendly Clean Header */}
      <header className="flex items-start justify-between gap-5 pb-3.5 border-b-2" style={{ borderColor: accent }}>
        <div className="min-w-0 flex-1">
          <h1 className={`${densityScale.nameText} font-bold tracking-tight text-slate-950 leading-tight`}>
            {personal.fullName || 'Họ và Tên'}
          </h1>
          {personal.jobTitle && (
            <p className={`${densityScale.titleText} font-semibold mt-1`} style={{ color: accent }}>
              {personal.jobTitle}
            </p>
          )}
          {inlineContacts.length > 0 && (
            <div className={`mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 ${densityScale.smallText} text-slate-700`}>
              {inlineContacts.map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-2">
                  {idx > 0 && <span className="text-slate-300" aria-hidden="true">·</span>}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          )}
          {linkContacts.length > 0 && (
            <div className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 ${densityScale.smallText}`}>
              {linkContacts.map((link, idx) => (
                <span key={idx} className="inline-flex items-center gap-2">
                  {idx > 0 && <span className="text-slate-300" aria-hidden="true">·</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline break-all"
                    style={{ color: accent }}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          )}
        </div>

        {personal.showAvatar && (
          <CvAvatar
            src={personal.avatarUrl}
            fullName={personal.fullName}
            shape={personal.avatarShape}
            sizeClass="w-20 h-20"
            accentColor={accent}
            contrastInk={contrastInk}
            ringClass="border border-slate-200"
          />
        )}
      </header>

      {/* Summary */}
      {visibility.summary && data.summary.trim() && (
        <section className="cv-avoid-break">
          <h2
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.summary}
          </h2>
          <p className="text-slate-800 whitespace-pre-line">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {visibility.experience && data.experience.length > 0 && (
        <section>
          <h2
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2.5 border-b border-slate-300`}
            style={{ color: accent }}
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
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold text-slate-950">
                      {exp.position}
                      {exp.company && (
                        <span className="font-semibold text-slate-700"> — {exp.company}</span>
                      )}
                    </h3>
                    {dateRange && (
                      <span className={`${densityScale.smallText} font-medium text-slate-600 tabular-nums shrink-0`}>
                        {dateRange}
                      </span>
                    )}
                  </div>
                  {exp.location && (
                    <div className={`${densityScale.smallText} text-slate-500 mt-0.5`}>{exp.location}</div>
                  )}
                  {exp.bullets.filter((b) => b.trim()).length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-4 list-disc marker:text-slate-500 text-slate-800">
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
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2.5 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.projects}
          </h2>
          <div className={densityScale.itemGap}>
            {data.projects.map((proj) => (
              <article key={proj.id} className="cv-avoid-break">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-bold text-slate-950">
                    {proj.name}
                    {proj.role && (
                      <span className="font-medium text-slate-600"> · {proj.role}</span>
                    )}
                  </h3>
                  {proj.period && (
                    <span className={`${densityScale.smallText} font-medium text-slate-600 tabular-nums shrink-0`}>
                      {proj.period}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <div className={`${densityScale.smallText} text-slate-600 mt-0.5`}>
                    <span className="font-semibold text-slate-700">{labels.technologies}:</span> {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <p className="mt-1 text-slate-800 whitespace-pre-line">{proj.description}</p>
                )}
                {proj.link && (
                  <a
                    href={normalizeHref(proj.link)}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-0.5 inline-block ${densityScale.smallText} hover:underline break-all`}
                    style={{ color: accent }}
                  >
                    {formatDisplayUrl(proj.link)}
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
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.education}
          </h2>
          <div className={densityScale.itemGap}>
            {data.education.map((edu) => (
              <article key={edu.id} className="cv-avoid-break">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-bold text-slate-950">{edu.school}</h3>
                  {edu.period && (
                    <span className={`${densityScale.smallText} font-medium text-slate-600 tabular-nums shrink-0`}>
                      {edu.period}
                    </span>
                  )}
                </div>
                {edu.major && <div className="font-medium text-slate-800 mt-0.5">{edu.major}</div>}
                {edu.gpaOrHonors && (
                  <div className={`${densityScale.smallText} text-slate-600 mt-0.5`}>{edu.gpaOrHonors}</div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {visibility.skills && data.skills.length > 0 && (
        <section className="cv-avoid-break">
          <h2
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.skills}
          </h2>
          {settings.skillDisplayMode === 'tags' ? (
            <div className="space-y-1.5">
              {data.skills.map((group) => (
                <div key={group.id} className="flex flex-wrap items-baseline gap-1.5">
                  {group.category && (
                    <span className="font-semibold text-slate-900 mr-1">{group.category}:</span>
                  )}
                  {group.items
                    .filter((sk) => sk.name.trim())
                    .map((sk) => (
                      <span
                        key={sk.id}
                        className="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{
                          backgroundColor: hexToRgba(accent, 0.08),
                          color: '#0F172A',
                        }}
                      >
                        {sk.name}
                      </span>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {data.skills.map((group) => (
                <div key={group.id} className="cv-avoid-break">
                  {group.category && (
                    <h3 className={`${densityScale.smallText} font-semibold text-slate-800 mb-1.5`}>
                      {group.category}
                    </h3>
                  )}
                  <div className="space-y-1.5">
                    {group.items
                      .filter((sk) => sk.name.trim())
                      .map((sk) => (
                        <div key={sk.id}>
                          <div className="flex justify-between text-[11px] mb-0.5">
                            <span>{sk.name}</span>
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
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Certificates */}
      {visibility.certificates && data.certificates.length > 0 && (
        <section className="cv-avoid-break">
          <h2
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.certificates}
          </h2>
          <ul className="space-y-1">
            {data.certificates.map((cert) => (
              <li key={cert.id} className="flex items-baseline justify-between gap-4">
                <span>
                  <strong className="font-semibold text-slate-900">{cert.name}</strong>
                  {cert.issuer && <span className="text-slate-600"> · {cert.issuer}</span>}
                </span>
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

      {/* Languages */}
      {visibility.languages && data.languages.length > 0 && (
        <section className="cv-avoid-break">
          <h2
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.languages}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {data.languages.map((lang) => (
              <div key={lang.id}>
                <span className="font-semibold text-slate-900">{lang.name}</span>
                {lang.proficiency && (
                  <span className="text-slate-600"> — {lang.proficiency}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Activities */}
      {visibility.activities && data.activities.length > 0 && (
        <section>
          <h2
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.activities}
          </h2>
          <div className={densityScale.itemGap}>
            {data.activities.map((act) => (
              <article key={act.id} className="cv-avoid-break">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-bold text-slate-950">
                    {act.organization}
                    {act.role && <span className="font-medium text-slate-700"> · {act.role}</span>}
                  </h3>
                  {act.period && (
                    <span className={`${densityScale.smallText} text-slate-600 tabular-nums shrink-0`}>
                      {act.period}
                    </span>
                  )}
                </div>
                {act.description && (
                  <p className="mt-1 text-slate-800 whitespace-pre-line">{act.description}</p>
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
            className={`cv-heading-keep ${densityScale.headingText} font-bold tracking-[0.08em] uppercase pb-1 mb-2 border-b border-slate-300`}
            style={{ color: accent }}
          >
            {labels.references}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.references.map((ref) => (
              <div key={ref.id}>
                <div className="font-semibold text-slate-950">{ref.name}</div>
                {ref.titleAndCompany && (
                  <div className={`${densityScale.smallText} text-slate-700`}>{ref.titleAndCompany}</div>
                )}
                {ref.contact && (
                  <div className={`${densityScale.smallText} text-slate-500 break-words`}>{ref.contact}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
