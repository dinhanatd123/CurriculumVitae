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

export interface PortfolioUiLabels {
  nav: {
    intro: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    contact: string;
  };
  actions: {
    editCv: string;
    exportPdf: string;
    downloadPdf: string;
    viewProjects: string;
    exploreProfile: string;
    tapToStart: string;
    scrollToDetails: string;
    viewProjectDetail: string;
  };
  eyebrows: {
    experience: string;
    projects: string;
    skills: string;
    education: string;
    contact: string;
  };
  headings: {
    experienceSolid: string;
    experienceOutline: string;
    projectsSolid: string;
    projectsOutline: string;
    skillsSolid: string;
    skillsOutline: string;
    educationSolid: string;
    educationOutline: string;
    contactTitle: string;
    contactSubtitle: string;
  };
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

export const PORTFOLIO_UI_LABELS: Record<CvLanguage, PortfolioUiLabels> = {
  vi: {
    nav: {
      intro: 'Giới thiệu',
      experience: 'Kinh nghiệm',
      projects: 'Dự án',
      skills: 'Kỹ năng',
      education: 'Học vấn',
      contact: 'Liên hệ',
    },
    actions: {
      editCv: 'Chỉnh sửa CV',
      exportPdf: 'Xuất PDF',
      downloadPdf: 'Tải CV PDF',
      viewProjects: 'Xem dự án',
      exploreProfile: 'Khám phá hồ sơ',
      tapToStart: 'CHẠM ĐỂ BẮT ĐẦU',
      scrollToDetails: 'Xem chi tiết hồ sơ',
      viewProjectDetail: 'Xem chi tiết',
    },
    eyebrows: {
      experience: '01 / KINH NGHIỆM',
      projects: '02 / DỰ ÁN TIÊU BIỂU',
      skills: '03 / KỸ NĂNG',
      education: '04 / HỌC VẤN & CHỨNG CHỈ',
      contact: 'KẾT NỐI & HỢP TÁC',
    },
    headings: {
      experienceSolid: 'Hành trình',
      experienceOutline: 'Nghề nghiệp',
      projectsSolid: 'Sản phẩm',
      projectsOutline: 'Đã triển khai',
      skillsSolid: 'Năng lực',
      skillsOutline: '& Công cụ',
      educationSolid: 'Nền tảng',
      educationOutline: '& Chứng nhận',
      contactTitle: 'Sẵn sàng đồng hành cùng đội ngũ của bạn',
      contactSubtitle:
        'Kết nối trực tiếp qua các kênh bên dưới hoặc tải ngay bản CV định dạng A4 chuẩn ATS để trao đổi về cơ hội hợp tác.',
    },
  },
  en: {
    nav: {
      intro: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
    },
    actions: {
      editCv: 'Edit CV',
      exportPdf: 'Export PDF',
      downloadPdf: 'Download PDF',
      viewProjects: 'View Projects',
      exploreProfile: 'Explore Portfolio',
      tapToStart: 'TAP TO BEGIN',
      scrollToDetails: 'Explore Full Profile',
      viewProjectDetail: 'View Details',
    },
    eyebrows: {
      experience: '01 / WORK EXPERIENCE',
      projects: '02 / FEATURED PROJECTS',
      skills: '03 / SKILLS & TOOLS',
      education: '04 / EDUCATION & CERTIFICATIONS',
      contact: 'LET’S COLLABORATE',
    },
    headings: {
      experienceSolid: 'Career',
      experienceOutline: 'Trajectory',
      projectsSolid: 'Selected',
      projectsOutline: 'Case Studies',
      skillsSolid: 'Core',
      skillsOutline: 'Capabilities',
      educationSolid: 'Academic',
      educationOutline: '& Credentials',
      contactTitle: 'Ready to build high-impact products together',
      contactSubtitle:
        'Reach out directly through any channel below or download my crisp ATS-ready A4 PDF resume.',
    },
  },
};

export const PRESET_COLORS = [
  { name: 'Xanh Navy', value: '#0B1F3A' },
  { name: 'Xanh Ngọc Đậm', value: '#0F5C5C' },
  { name: 'Xanh Dương Đậm', value: '#0369A1' },
  { name: 'Xám Than', value: '#27303F' },
  { name: 'Rêu Trầm', value: '#2F4F3E' },
  { name: 'Đỏ Đô', value: '#881337' },
] as const;
