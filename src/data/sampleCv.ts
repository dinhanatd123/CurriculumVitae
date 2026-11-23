import type { CvState } from '../types/cv';

export const SAMPLE_AVATAR_URL = './src/assets/images/sample_cv_avatar_1795430849384.jpg';
export const SAMPLE_PROJECT_IMAGES = {
  finboard: './src/assets/images/project_finboard_ui_1795432435511.jpg',
  medsync: './src/assets/images/project_medsync_ui_1795432436063.jpg',
  designsystem: './src/assets/images/project_designsystem_ui_1795432437282.jpg',
} as const;

export function createSampleCvState(): CvState {
  return {
    version: 2,
    settings: {
      template: 'modern',
      primaryColor: '#0B1F3A',
      fontFamily: 'be-vietnam',
      density: 'standard',
      language: 'vi',
      skillDisplayMode: 'bars',
    },
    data: {
      personal: {
        fullName: 'Nguyễn Minh Khôi',
        jobTitle: 'Senior Frontend Engineer',
        phone: '0912 845 620',
        email: 'minhkhoi.nguyen@email.vn',
        address: 'Quận 3, TP. Hồ Chí Minh',
        dateOfBirth: '14/08/1997',
        linkedin: 'linkedin.com/in/nguyenminhkhoi-dev',
        github: 'github.com/minhkhoi-fe',
        portfolio: 'minhkhoi.dev',
        avatarUrl: SAMPLE_AVATAR_URL,
        showAvatar: true,
        avatarShape: 'circle',
      },
      story: {
        statusBadge: 'Sẵn sàng nhận việc',
        slogan:
          'Kiến tạo giao diện web tốc độ 60fps, kiến trúc Design System bền vững và trải nghiệm người dùng sắc sảo.',
        strengths: ['React & TypeScript', 'Design Systems', 'Hiệu năng Web 60fps'],
        heroStats: [
          { id: 'stat-1', value: '5+ năm', label: 'Kinh nghiệm Frontend' },
          { id: 'stat-2', value: '18+ dự án', label: 'Sản phẩm thực chiến' },
          { id: 'stat-3', value: 'LCP 1.4s', label: 'Tối ưu hiệu năng' },
        ],
        floatingBadges: ['WCAG AA & ATS Ready', 'React 19 · Vite · Motion'],
        act2Solid: 'Biến bài toán phức tạp thành',
        act2Outline: 'Trải nghiệm mượt mà',
        act2Description:
          'Kết hợp tư duy kỹ thuật hệ thống với thẩm mỹ tinh gọn — từ kiến trúc component chuẩn mực đến từng chuyển động vi mô trên desktop lẫn di động.',
        act3Headline: 'Sẵn sàng tạo giá trị thực ngay từ tuần đầu tiên.',
        act3Subtext:
          'Khám phá chi tiết hành trình nghề nghiệp, sản phẩm tiêu biểu và nền tảng chuyên môn bên dưới.',
      },
      summary:
        'Kỹ sư Frontend với hơn 5 năm kinh nghiệm xây dựng sản phẩm web quy mô lớn bằng React, TypeScript và kiến trúc Design System. Thế mạnh về tối ưu hiệu năng hiển thị (Core Web Vitals), trải nghiệm người dùng mượt mà và dẫn dắt đội ngũ kỹ thuật chuyển đổi hệ thống cũ sang kiến trúc hiện đại, dễ mở rộng.',
      experience: [
        {
          id: 'exp-1',
          company: 'Công ty Công nghệ FinCore Việt Nam',
          position: 'Senior Frontend Engineer',
          startDate: '03/2023',
          endDate: '',
          isCurrent: true,
          location: 'TP. Hồ Chí Minh',
          bullets: [
            'Thiết kế và triển khai thư viện UI Design System gồm 48 component chuẩn WCAG AA, rút ngắn 35% thời gian phát triển tính năng mới cho 4 nhóm sản phẩm.',
            'Tối ưu hóa tốc độ tải trang (LCP giảm từ 3.8s xuống 1.4s) bằng kỹ thuật code-splitting, ảo hóa danh sách giao dịch và tối ưu bundle Vite.',
            'Phối hợp với Product Manager và Backend xây dựng cổng quản trị thanh toán doanh nghiệp phục vụ hơn 18.000 khách hàng hoạt động hàng tháng.',
            'Hướng dẫn chuyên môn (mentor) cho 3 kỹ sư Junior/Middle và thiết lập quy trình review code kèm kiểm thử tự động.',
          ],
        },
        {
          id: 'exp-2',
          company: 'KiotCloud Solutions',
          position: 'Frontend Developer',
          startDate: '07/2020',
          endDate: '02/2023',
          isCurrent: false,
          location: 'TP. Hồ Chí Minh',
          bullets: [
            'Phát triển ứng dụng quản lý bán hàng đa kênh (POS Web App) hoạt động ổn định cả khi mất kết nối mạng nhờ đồng bộ IndexedDB.',
            'Xây dựng hệ thống biểu đồ báo cáo doanh thu thời gian thực, giảm 40% lượng truy vấn lặp lại nhờ chiến lược caching thông minh.',
            'Cải thiện tỷ lệ hoàn tất đơn hàng trên thiết bị di động tăng 22% sau khi tái thiết kế quy trình thanh toán.',
          ],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Nền tảng Quản trị Dòng tiền FinBoard',
          role: 'Frontend Tech Lead',
          period: '06/2023 – 01/2024',
          technologies: 'React 19, TypeScript, Tailwind CSS, TanStack Query, ECharts',
          description:
            'Hệ thống đối soát công nợ và dự báo dòng tiền tự động cho doanh nghiệp SME. Hỗ trợ xuất báo cáo tài chính đa định dạng, phân quyền chi tiết theo phòng ban và phản hồi tức thì với bảng dữ liệu hơn 50.000 dòng.',
          link: 'https://github.com/minhkhoi-fe/finboard-ui',
          imageUrl: SAMPLE_PROJECT_IMAGES.finboard,
        },
        {
          id: 'proj-2',
          name: 'Hệ thống Đặt lịch Phòng khám MedSync',
          role: 'Full-stack Developer',
          period: '09/2021 – 05/2022',
          technologies: 'React, Node.js, PostgreSQL, WebSocket, PWA',
          description:
            'Ứng dụng điều phối lịch hẹn bác sĩ và quản lý hồ sơ bệnh án điện tử cho chuỗi 6 phòng khám, tích hợp thông báo thời gian thực giúp giảm 50% thời gian chờ tại quầy tiếp nhận.',
          link: 'https://minhkhoi.dev/projects/medsync',
          imageUrl: SAMPLE_PROJECT_IMAGES.medsync,
        },
        {
          id: 'proj-3',
          name: 'Hệ thống Thiết kế CoreUI Design System',
          role: 'Core Maintainer',
          period: '04/2023 – Hiện tại',
          technologies: 'TypeScript, Storybook, Radix Primitives, Tailwind CSS, Playwright',
          description:
            'Bộ thư viện giao diện nội bộ gồm 48 component chuẩn truy cập WCAG AA, tự động kiểm thử trực quan và tài liệu hóa tương tác giúp thống nhất trải nghiệm trên 4 sản phẩm lõi.',
          link: 'https://github.com/minhkhoi-fe/coreui-kit',
          imageUrl: SAMPLE_PROJECT_IMAGES.designsystem,
        },
      ],
      education: [
        {
          id: 'edu-1',
          school: 'Đại học Bách Khoa – ĐHQG TP. Hồ Chí Minh',
          major: 'Kỹ sư Khoa học Máy tính',
          period: '2015 – 2020',
          gpaOrHonors: 'GPA: 3.56 / 4.0 · Học bổng Khuyến khích Học tập 4 học kỳ liên tiếp',
        },
      ],
      skills: [
        {
          id: 'sg-1',
          category: 'Chuyên môn Frontend',
          items: [
            { id: 'sk-1', name: 'TypeScript / ES2024', level: 5 },
            { id: 'sk-2', name: 'React & Next.js', level: 5 },
            { id: 'sk-3', name: 'Tailwind CSS & Motion', level: 5 },
            { id: 'sk-4', name: 'Web Performance & WCAG AA', level: 4 },
          ],
        },
        {
          id: 'sg-2',
          category: 'Công cụ & Kiến trúc',
          items: [
            { id: 'sk-5', name: 'Vite / CI-CD / GitHub Pages', level: 5 },
            { id: 'sk-6', name: 'Playwright / Vitest', level: 4 },
            { id: 'sk-7', name: 'REST API & GraphQL', level: 4 },
            { id: 'sk-8', name: 'Figma & Design Systems', level: 4 },
          ],
        },
        {
          id: 'sg-3',
          category: 'Kỹ năng mềm',
          items: [
            { id: 'sk-9', name: 'Dẫn dắt & Mentor đội nhóm', level: 4 },
            { id: 'sk-10', name: 'Tư duy sản phẩm & UX', level: 5 },
          ],
        },
      ],
      certificates: [
        {
          id: 'cert-1',
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          year: '2024',
        },
        {
          id: 'cert-2',
          name: 'Giải Nhất Thiết kế Sản phẩm Số VietHack',
          issuer: 'Hội Tin học TP.HCM',
          year: '2022',
        },
        {
          id: 'cert-3',
          name: 'Meta Front-End Developer Professional',
          issuer: 'Coursera · Meta',
          year: '2023',
        },
      ],
      languages: [
        {
          id: 'lang-1',
          name: 'Tiếng Việt',
          proficiency: 'Bản ngữ',
        },
        {
          id: 'lang-2',
          name: 'Tiếng Anh',
          proficiency: 'IELTS 7.5 (Đọc hiểu tài liệu & giao tiếp kỹ thuật thành thạo)',
        },
      ],
      activities: [
        {
          id: 'act-1',
          organization: 'Cộng đồng React Vietnam',
          role: 'Diễn giả & Biên tập viên kỹ thuật',
          period: '2022 – Hiện tại',
          description:
            'Chia sẻ 6 buổi workshop về tối ưu hiệu năng React và viết hơn 20 bài hướng dẫn chuyên sâu cho cộng đồng lập trình viên.',
        },
      ],
      references: [
        {
          id: 'ref-1',
          name: 'Trần Quốc Bảo',
          titleAndCompany: 'Engineering Manager · Công ty Công nghệ FinCore Việt Nam',
          contact: 'bao.tran@fincore.vn · 0908 112 349',
        },
      ],
      visibility: {
        summary: true,
        experience: true,
        projects: true,
        education: true,
        skills: true,
        certificates: true,
        languages: true,
        activities: false,
        references: false,
      },
    },
  };
}
