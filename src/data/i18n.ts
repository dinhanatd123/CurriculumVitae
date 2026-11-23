import type { CvLanguage } from '../types/cv';

export interface CvSectionLabels {
  contact: string;
  summary: string;
  experience: string;
  projects: string;
  education: string;
  skills: string;
  certificates: string;
  languages: string;
  activities: string;
  references: string;
  present: string;
  dob: string;
  technologies: string;
  role: string;
}

export const CV_LABELS: Record<CvLanguage, CvSectionLabels> = {
  vi: {
    contact: 'Thông tin liên hệ',
    summary: 'Mục tiêu nghề nghiệp',
    experience: 'Kinh nghiệm làm việc',
    projects: 'Dự án tiêu biểu',
    education: 'Học vấn',
    skills: 'Kỹ năng',
    certificates: 'Chứng chỉ & Giải thưởng',
    languages: 'Ngoại ngữ',
    activities: 'Hoạt động ngoại khóa',
    references: 'Người tham chiếu',
    present: 'Hiện tại',
    dob: 'Ngày sinh',
    technologies: 'Công nghệ',
    role: 'Vai trò',
  },
  en: {
    contact: 'Contact',
    summary: 'Professional Summary',
    experience: 'Work Experience',
    projects: 'Featured Projects',
    education: 'Education',
    skills: 'Skills',
    certificates: 'Certifications & Awards',
    languages: 'Languages',
    activities: 'Extracurricular Activities',
    references: 'References',
    present: 'Present',
    dob: 'DOB',
    technologies: 'Tech Stack',
    role: 'Role',
  },
};

export const PRESET_COLORS = [
  { name: 'Xanh Navy', value: '#1E3A5F' },
  { name: 'Xanh Ngọc Đậm', value: '#0F5C5C' },
  { name: 'Xám Than', value: '#27303F' },
  { name: 'Xanh Cobalt', value: '#1D4ED8' },
  { name: 'Đỏ Đô', value: '#881337' },
  { name: 'Rêu Trầm', value: '#2F4F3E' },
] as const;
