export type TemplateId = 'modern' | 'classic' | 'executive';
export type PrintTemplateId = 'modern' | 'classic';
export type FontFamilyId = 'be-vietnam' | 'inter' | 'merriweather';
export type DensityId = 'compact' | 'standard' | 'spacious';
export type CvLanguage = 'vi' | 'en';
export type AvatarShape = 'circle' | 'rounded';
export type SkillDisplayMode = 'tags' | 'bars';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  linkedin: string;
  github: string;
  portfolio: string;
  avatarUrl: string;
  showAvatar: boolean;
  avatarShape: AvatarShape;
}

export interface HeroStatItem {
  id: string;
  value: string;
  label: string;
}

export interface PortfolioStory {
  statusBadge: string;
  slogan: string;
  strengths: string[];
  heroStats: HeroStatItem[];
  floatingBadges: [string, string];
  act2Solid: string;
  act2Outline: string;
  act2Description: string;
  act3Headline: string;
  act3Subtext: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  period: string;
  technologies: string;
  description: string;
  link: string;
  imageUrl?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  period: string;
  gpaOrHonors: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1 to 5
}

export interface SkillGroup {
  id: string;
  category: string;
  items: SkillItem[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface ActivityItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  description: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  titleAndCompany: string;
  contact: string;
}

export interface SectionVisibility {
  summary: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  skills: boolean;
  certificates: boolean;
  languages: boolean;
  activities: boolean;
  references: boolean;
}

export interface CvSettings {
  template: TemplateId;
  primaryColor: string;
  fontFamily: FontFamilyId;
  density: DensityId;
  language: CvLanguage;
  skillDisplayMode: SkillDisplayMode;
}

export interface CvData {
  personal: PersonalInfo;
  story: PortfolioStory;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  certificates: CertificateItem[];
  languages: LanguageItem[];
  activities: ActivityItem[];
  references: ReferenceItem[];
  visibility: SectionVisibility;
}

export interface CvState {
  version: number;
  data: CvData;
  settings: CvSettings;
}

export type EditorSectionKey =
  | 'personal'
  | 'story'
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'certificates'
  | 'extras';
