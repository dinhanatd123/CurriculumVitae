import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import type { ProjectItem, EducationItem } from '../../types/cv';
import { createId, moveItem } from '../../utils/cvHelpers';

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';
const LABEL_CLASS = 'block text-xs font-medium text-slate-600 mb-1';

interface ProjectsSectionProps {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
}

export function ProjectsSection({ items, onChange }: ProjectsSectionProps) {
  const handleAdd = () => {
    onChange([
      ...items,
      {
        id: createId('proj'),
        name: '',
        role: '',
        period: '',
        technologies: '',
        description: '',
        link: '',
      },
    ]);
  };

  const handleUpdate = (index: number, patch: Partial<ProjectItem>) => {
    onChange(items.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-xs text-slate-500 py-2">
          Chưa có dự án nào. Hãy thêm các dự án nổi bật để tăng sức thuyết phục cho CV.
        </p>
      )}

      {items.map((proj, idx) => (
        <div
          key={proj.id}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
            <span className="text-xs font-semibold text-slate-700 truncate">
              {proj.name || `Dự án #${idx + 1}`}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onChange(moveItem(items, idx, 'up'))}
                disabled={idx === 0}
                aria-label={`Di chuyển dự án ${proj.name || idx + 1} lên`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, idx, 'down'))}
                disabled={idx === items.length - 1}
                aria-label={`Di chuyển dự án ${proj.name || idx + 1} xuống`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                aria-label={`Xóa dự án ${proj.name || idx + 1}`}
                className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`proj-name-${proj.id}`} className={LABEL_CLASS}>
                Tên dự án
              </label>
              <input
                id={`proj-name-${proj.id}`}
                type="text"
                value={proj.name}
                onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                placeholder="VD: Nền tảng Quản trị Dòng tiền"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`proj-role-${proj.id}`} className={LABEL_CLASS}>
                Vai trò
              </label>
              <input
                id={`proj-role-${proj.id}`}
                type="text"
                value={proj.role}
                onChange={(e) => handleUpdate(idx, { role: e.target.value })}
                placeholder="VD: Frontend Tech Lead"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`proj-period-${proj.id}`} className={LABEL_CLASS}>
                Thời gian
              </label>
              <input
                id={`proj-period-${proj.id}`}
                type="text"
                value={proj.period}
                onChange={(e) => handleUpdate(idx, { period: e.target.value })}
                placeholder="06/2023 – 01/2024"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`proj-link-${proj.id}`} className={LABEL_CLASS}>
                Link dự án (tùy chọn)
              </label>
              <input
                id={`proj-link-${proj.id}`}
                type="text"
                value={proj.link}
                onChange={(e) => handleUpdate(idx, { link: e.target.value })}
                placeholder="https://github.com/..."
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`proj-tech-${proj.id}`} className={LABEL_CLASS}>
              Công nghệ / Công cụ sử dụng
            </label>
            <input
              id={`proj-tech-${proj.id}`}
              type="text"
              value={proj.technologies}
              onChange={(e) => handleUpdate(idx, { technologies: e.target.value })}
              placeholder="React, TypeScript, Tailwind CSS..."
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor={`proj-desc-${proj.id}`} className={LABEL_CLASS}>
              Mô tả ngắn & kết quả
            </label>
            <textarea
              id={`proj-desc-${proj.id}`}
              rows={3}
              value={proj.description}
              onChange={(e) => handleUpdate(idx, { description: e.target.value })}
              placeholder="Mô tả bài toán, giải pháp và kết quả nổi bật..."
              className={`${INPUT_CLASS} resize-y`}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Thêm dự án tiêu biểu</span>
      </button>
    </div>
  );
}

interface EducationSectionProps {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export function EducationSection({ items, onChange }: EducationSectionProps) {
  const handleAdd = () => {
    onChange([
      ...items,
      {
        id: createId('edu'),
        school: '',
        major: '',
        period: '',
        gpaOrHonors: '',
      },
    ]);
  };

  const handleUpdate = (index: number, patch: Partial<EducationItem>) => {
    onChange(items.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-xs text-slate-500 py-2">
          Chưa có thông tin học vấn. Nhấn nút bên dưới để thêm trường học.
        </p>
      )}

      {items.map((edu, idx) => (
        <div
          key={edu.id}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
            <span className="text-xs font-semibold text-slate-700 truncate">
              {edu.school || `Học vấn #${idx + 1}`}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onChange(moveItem(items, idx, 'up'))}
                disabled={idx === 0}
                aria-label={`Di chuyển học vấn ${edu.school || idx + 1} lên`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, idx, 'down'))}
                disabled={idx === items.length - 1}
                aria-label={`Di chuyển học vấn ${edu.school || idx + 1} xuống`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                aria-label={`Xóa học vấn ${edu.school || idx + 1}`}
                className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor={`edu-school-${edu.id}`} className={LABEL_CLASS}>
                Tên trường / Học viện
              </label>
              <input
                id={`edu-school-${edu.id}`}
                type="text"
                value={edu.school}
                onChange={(e) => handleUpdate(idx, { school: e.target.value })}
                placeholder="VD: Đại học Bách Khoa TP.HCM"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`edu-major-${edu.id}`} className={LABEL_CLASS}>
                Chuyên ngành / Bằng cấp
              </label>
              <input
                id={`edu-major-${edu.id}`}
                type="text"
                value={edu.major}
                onChange={(e) => handleUpdate(idx, { major: e.target.value })}
                placeholder="VD: Kỹ sư Khoa học Máy tính"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`edu-period-${edu.id}`} className={LABEL_CLASS}>
                Thời gian
              </label>
              <input
                id={`edu-period-${edu.id}`}
                type="text"
                value={edu.period}
                onChange={(e) => handleUpdate(idx, { period: e.target.value })}
                placeholder="2015 – 2020"
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`edu-gpa-${edu.id}`} className={LABEL_CLASS}>
                GPA / Thành tích nổi bật
              </label>
              <input
                id={`edu-gpa-${edu.id}`}
                type="text"
                value={edu.gpaOrHonors}
                onChange={(e) => handleUpdate(idx, { gpaOrHonors: e.target.value })}
                placeholder="VD: GPA: 3.56 / 4.0 · Học bổng Khuyến khích Học tập"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Thêm học vấn</span>
      </button>
    </div>
  );
}
