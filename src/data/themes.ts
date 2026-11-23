import type { WebThemeId } from '../types/cv';

export interface WebThemePreset {
  id: WebThemeId;
  nameVi: string;
  nameEn: string;
  taglineVi: string;
  swatchFrom: string;
  swatchTo: string;
  ink: string;
  pdfPrimaryColor: string;
}

export const WEB_THEMES: WebThemePreset[] = [
  {
    id: 'ocean-mint',
    nameVi: 'Xanh Đại Dương',
    nameEn: 'Ocean Mint',
    taglineVi: 'Chuyên nghiệp · Tươi sáng',
    swatchFrom: '#0284C7',
    swatchTo: '#10B981',
    ink: '#0B1F3A',
    pdfPrimaryColor: '#0B1F3A',
  },
  {
    id: 'sunset-coral',
    nameVi: 'Cam San Hô',
    nameEn: 'Sunset Coral',
    taglineVi: 'Trẻ trung · Năng lượng',
    swatchFrom: '#F97316',
    swatchTo: '#EC4899',
    ink: '#24142C',
    pdfPrimaryColor: '#C2410C',
  },
  {
    id: 'electric-violet',
    nameVi: 'Tím Điện Tử',
    nameEn: 'Electric Violet',
    taglineVi: 'Sáng tạo · Hiện đại',
    swatchFrom: '#7C3AED',
    swatchTo: '#06B6D4',
    ink: '#191538',
    pdfPrimaryColor: '#5B21B6',
  },
  {
    id: 'berry-pop',
    nameVi: 'Hồng Berry',
    nameEn: 'Berry Pop',
    taglineVi: 'Nổi bật · Cá tính',
    swatchFrom: '#E11D48',
    swatchTo: '#8B5CF6',
    ink: '#2B1028',
    pdfPrimaryColor: '#BE123C',
  },
  {
    id: 'matcha-lime',
    nameVi: 'Xanh Matcha',
    nameEn: 'Matcha Citrus',
    taglineVi: 'Tươi mát · Tinh tế',
    swatchFrom: '#059669',
    swatchTo: '#84CC16',
    ink: '#0E2A1F',
    pdfPrimaryColor: '#047857',
  },
  {
    id: 'royal-amber',
    nameVi: 'Xanh Hoàng Hôn',
    nameEn: 'Royal Amber',
    taglineVi: 'Công nghệ · Bứt phá',
    swatchFrom: '#2563EB',
    swatchTo: '#F59E0B',
    ink: '#0F172A',
    pdfPrimaryColor: '#1D4ED8',
  },
  {
    id: 'sakura-sky',
    nameVi: 'Hồng Anh Đào',
    nameEn: 'Sakura Sky',
    taglineVi: 'Tươi tắn · Thời thượng',
    swatchFrom: '#EC4899',
    swatchTo: '#0EA5E9',
    ink: '#1E1B3A',
    pdfPrimaryColor: '#BE185D',
  },
];

export const VALID_WEB_THEMES: WebThemeId[] = WEB_THEMES.map((t) => t.id);

export function getWebThemePreset(id: WebThemeId): WebThemePreset {
  return WEB_THEMES.find((t) => t.id === id) ?? WEB_THEMES[0];
}
