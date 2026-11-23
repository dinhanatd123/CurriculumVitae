import type {
  CvState,
  DensityId,
  FontFamilyId,
  TemplateId,
  CvLanguage,
  AvatarShape,
  SkillDisplayMode,
} from '../types/cv';
import { createSampleCvState } from '../data/sampleCv';

export const STORAGE_KEY = 'cv_studio_state_v1';

/**
 * Strips Vietnamese diacritics (including đ/Đ) and converts text into a safe filename token.
 */
export function slugifyVietnameseFilenamePart(input: string): string {
  const cleaned = input
    .trim()
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  return cleaned;
}

/**
 * Builds a clean PDF export document title in the format `CV_[Ho_Ten]_[Vi_Tri]`.
 */
export function buildPdfDocumentTitle(fullName: string, jobTitle: string): string {
  const namePart = slugifyVietnameseFilenamePart(fullName);
  const rolePart = slugifyVietnameseFilenamePart(jobTitle);

  if (namePart && rolePart) {
    return `CV_${namePart}_${rolePart}`;
  }
  if (namePart) {
    return `CV_${namePart}`;
  }
  if (rolePart) {
    return `CV_${rolePart}`;
  }
  return 'CV_Chuyen_Nghiep';
}

/**
 * Pure immutable array reordering helper for moving an item up or down.
 */
export function moveItem<T>(items: T[], index: number, direction: 'up' | 'down'): T[] {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || index >= items.length || targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

/**
 * Generates a compact unique ID for repeatable CV entries.
 */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Computes an appropriate preview zoom scale so the 210mm A4 sheet (~794px at 96dpi)
 * fits neatly inside the available preview viewport width.
 */
export function computeAutoZoomScale(containerWidthPx: number, a4WidthPx = 794): number {
  if (containerWidthPx <= 0 || a4WidthPx <= 0) {
    return 1;
  }
  const horizontalPadding = containerWidthPx < 500 ? 24 : 56;
  const available = Math.max(240, containerWidthPx - horizontalPadding);
  const rawScale = available / a4WidthPx;
  const clamped = Math.min(1.05, Math.max(0.35, rawScale));
  return Math.round(clamped * 100) / 100;
}

/**
 * Parses a 6-digit hex color and determines whether white or dark ink achieves better WCAG contrast.
 */
export function getContrastTextColor(hexColor: string): '#FFFFFF' | '#0F172A' {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor.trim());
  if (!match) {
    return '#FFFFFF';
  }
  const r = parseInt(match[1], 16) / 255;
  const g = parseInt(match[2], 16) / 255;
  const b = parseInt(match[3], 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.42 ? '#0F172A' : '#FFFFFF';
}

/**
 * Converts a hex color into an rgba() tint string for subtle tags and secondary fills.
 */
export function hexToRgba(hexColor: string, alpha: number): string {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor.trim());
  if (!match) {
    return `rgba(30, 58, 95, ${alpha})`;
  }
  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Normalizes a URL for clean display while keeping full href clickable.
 */
export function formatDisplayUrl(url: string): string {
  return url.trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

export function normalizeHref(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const VALID_TEMPLATES: TemplateId[] = ['modern', 'classic', 'executive'];
const VALID_FONTS: FontFamilyId[] = ['be-vietnam', 'inter', 'merriweather'];
const VALID_DENSITIES: DensityId[] = ['compact', 'standard', 'spacious'];
const VALID_LANGUAGES: CvLanguage[] = ['vi', 'en'];
const VALID_AVATAR_SHAPES: AvatarShape[] = ['circle', 'rounded'];
const VALID_SKILL_MODES: SkillDisplayMode[] = ['tags', 'bars'];

const asString = (val: unknown, fallback = ''): string =>
  typeof val === 'string' ? val : fallback;

const asBoolean = (val: unknown, fallback: boolean): boolean =>
  typeof val === 'boolean' ? val : fallback;

const asNumber = (val: unknown, fallback: number, min: number, max: number): number => {
  if (typeof val !== 'number' || Number.isNaN(val)) return fallback;
  return Math.min(max, Math.max(min, Math.round(val)));
};

/**
 * Validates and normalizes imported JSON or persisted localStorage payloads into a safe CvState.
 */
export function validateAndNormalizeCvState(
  raw: unknown
): { ok: true; state: CvState } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Tệp JSON không hợp lệ (cần một đối tượng dữ liệu CV).' };
  }

  const record = raw as Record<string, unknown>;
  const rawData = (record.data ?? record) as Record<string, unknown>;

  if (!rawData || typeof rawData !== 'object' || !rawData.personal || typeof rawData.personal !== 'object') {
    return {
      ok: false,
      error: 'Cấu trúc tệp không khớp định dạng CV Studio (thiếu mục thông tin cá nhân).',
    };
  }

  const defaults = createSampleCvState();
  const p = rawData.personal as Record<string, unknown>;
  const rawSettings = (record.settings ?? {}) as Record<string, unknown>;
  const rawVisibility = (rawData.visibility ?? {}) as Record<string, unknown>;

  const template = VALID_TEMPLATES.includes(rawSettings.template as TemplateId)
    ? (rawSettings.template as TemplateId)
    : defaults.settings.template;
  const fontFamily = VALID_FONTS.includes(rawSettings.fontFamily as FontFamilyId)
    ? (rawSettings.fontFamily as FontFamilyId)
    : defaults.settings.fontFamily;
  const density = VALID_DENSITIES.includes(rawSettings.density as DensityId)
    ? (rawSettings.density as DensityId)
    : defaults.settings.density;
  const language = VALID_LANGUAGES.includes(rawSettings.language as CvLanguage)
    ? (rawSettings.language as CvLanguage)
    : defaults.settings.language;
  const skillDisplayMode = VALID_SKILL_MODES.includes(rawSettings.skillDisplayMode as SkillDisplayMode)
    ? (rawSettings.skillDisplayMode as SkillDisplayMode)
    : defaults.settings.skillDisplayMode;
  const primaryColor =
    typeof rawSettings.primaryColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(rawSettings.primaryColor)
      ? rawSettings.primaryColor
      : defaults.settings.primaryColor;

  const avatarShape = VALID_AVATAR_SHAPES.includes(p.avatarShape as AvatarShape)
    ? (p.avatarShape as AvatarShape)
    : 'circle';

  const normalized: CvState = {
    version: 1,
    settings: {
      template,
      primaryColor,
      fontFamily,
      density,
      language,
      skillDisplayMode,
    },
    data: {
      personal: {
        fullName: asString(p.fullName, ''),
        jobTitle: asString(p.jobTitle, ''),
        phone: asString(p.phone, ''),
        email: asString(p.email, ''),
        address: asString(p.address, ''),
        dateOfBirth: asString(p.dateOfBirth, ''),
        linkedin: asString(p.linkedin, ''),
        github: asString(p.github, ''),
        portfolio: asString(p.portfolio, ''),
        avatarUrl: asString(p.avatarUrl, ''),
        showAvatar: asBoolean(p.showAvatar, true),
        avatarShape,
      },
      summary: asString(rawData.summary, ''),
      experience: Array.isArray(rawData.experience)
        ? rawData.experience.map((item, idx) => {
            const e = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(e.id, `exp-${idx + 1}`),
              company: asString(e.company, ''),
              position: asString(e.position, ''),
              startDate: asString(e.startDate, ''),
              endDate: asString(e.endDate, ''),
              isCurrent: asBoolean(e.isCurrent, false),
              location: asString(e.location, ''),
              bullets: Array.isArray(e.bullets)
                ? e.bullets.filter((b): b is string => typeof b === 'string')
                : [],
            };
          })
        : [],
      projects: Array.isArray(rawData.projects)
        ? rawData.projects.map((item, idx) => {
            const pr = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(pr.id, `proj-${idx + 1}`),
              name: asString(pr.name, ''),
              role: asString(pr.role, ''),
              period: asString(pr.period, ''),
              technologies: asString(pr.technologies, ''),
              description: asString(pr.description, ''),
              link: asString(pr.link, ''),
            };
          })
        : [],
      education: Array.isArray(rawData.education)
        ? rawData.education.map((item, idx) => {
            const ed = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(ed.id, `edu-${idx + 1}`),
              school: asString(ed.school, ''),
              major: asString(ed.major, ''),
              period: asString(ed.period, ''),
              gpaOrHonors: asString(ed.gpaOrHonors, ''),
            };
          })
        : [],
      skills: Array.isArray(rawData.skills)
        ? rawData.skills.map((group, gIdx) => {
            const sg = (group ?? {}) as Record<string, unknown>;
            return {
              id: asString(sg.id, `sg-${gIdx + 1}`),
              category: asString(sg.category, ''),
              items: Array.isArray(sg.items)
                ? sg.items.map((sk, sIdx) => {
                    const s = (sk ?? {}) as Record<string, unknown>;
                    return {
                      id: asString(s.id, `sk-${gIdx + 1}-${sIdx + 1}`),
                      name: asString(s.name, ''),
                      level: asNumber(s.level, 4, 1, 5),
                    };
                  })
                : [],
            };
          })
        : [],
      certificates: Array.isArray(rawData.certificates)
        ? rawData.certificates.map((item, idx) => {
            const c = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(c.id, `cert-${idx + 1}`),
              name: asString(c.name, ''),
              issuer: asString(c.issuer, ''),
              year: asString(c.year, ''),
            };
          })
        : [],
      languages: Array.isArray(rawData.languages)
        ? rawData.languages.map((item, idx) => {
            const l = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(l.id, `lang-${idx + 1}`),
              name: asString(l.name, ''),
              proficiency: asString(l.proficiency, ''),
            };
          })
        : [],
      activities: Array.isArray(rawData.activities)
        ? rawData.activities.map((item, idx) => {
            const a = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(a.id, `act-${idx + 1}`),
              organization: asString(a.organization, ''),
              role: asString(a.role, ''),
              period: asString(a.period, ''),
              description: asString(a.description, ''),
            };
          })
        : [],
      references: Array.isArray(rawData.references)
        ? rawData.references.map((item, idx) => {
            const r = (item ?? {}) as Record<string, unknown>;
            return {
              id: asString(r.id, `ref-${idx + 1}`),
              name: asString(r.name, ''),
              titleAndCompany: asString(r.titleAndCompany, ''),
              contact: asString(r.contact, ''),
            };
          })
        : [],
      visibility: {
        summary: asBoolean(rawVisibility.summary, true),
        experience: asBoolean(rawVisibility.experience, true),
        projects: asBoolean(rawVisibility.projects, true),
        education: asBoolean(rawVisibility.education, true),
        skills: asBoolean(rawVisibility.skills, true),
        certificates: asBoolean(rawVisibility.certificates, true),
        languages: asBoolean(rawVisibility.languages, true),
        activities: asBoolean(rawVisibility.activities, false),
        references: asBoolean(rawVisibility.references, false),
      },
    },
  };

  return { ok: true, state: normalized };
}
