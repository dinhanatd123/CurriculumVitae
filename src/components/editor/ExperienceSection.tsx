import { ArrowUp, ArrowDown, Trash2, Plus, X } from 'lucide-react';
import type { ExperienceItem } from '../../types/cv';
import { createId, moveItem } from '../../utils/cvHelpers';

interface ExperienceSectionProps {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';
const LABEL_CLASS = 'block text-xs font-medium text-slate-600 mb-1';

export function ExperienceSection({ items, onChange }: ExperienceSectionProps) {
  const handleAdd = () => {
    onChange([
      ...items,
      {
        id: createId('exp'),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        location: '',
        bullets: [''],
      },
    ]);
  };

  const handleUpdate = (index: number, patch: Partial<ExperienceItem>) => {
    const next = items.map((item, idx) => (idx === index ? { ...item, ...patch } : item));
    onChange(next);
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleMove = (index: number, dir: 'up' | 'down') => {
    onChange(moveItem(items, index, dir));
  };

  const handleBulletChange = (expIdx: number, bulletIdx: number, val: string) => {
    const exp = items[expIdx];
    const nextBullets = exp.bullets.map((b, idx) => (idx === bulletIdx ? val : b));
    handleUpdate(expIdx, { bullets: nextBullets });
  };

  const handleAddBullet = (expIdx: number) => {
    const exp = items[expIdx];
    handleUpdate(expIdx, { bullets: [...exp.bullets, ''] });
  };

  const handleDeleteBullet = (expIdx: number, bulletIdx: number) => {
    const exp = items[expIdx];
    const nextBullets = exp.bullets.filter((_, idx) => idx !== bulletIdx);
    handleUpdate(expIdx, { bullets: nextBullets.length > 0 ? nextBullets : [''] });
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-xs text-slate-500 py-2">
          Chưa có kinh nghiệm làm việc nào. Nhấn nút bên dưới để thêm mới.
        </p>
      )}

      {items.map((exp, idx) => (
        <div
          key={exp.id}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
            <span className="text-xs font-semibold text-slate-700 truncate">
              {exp.position || exp.company || `Kinh nghiệm #${idx + 1}`}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                aria-label={`Di chuyển kinh nghiệm ${exp.position || idx + 1} lên`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === items.length - 1}
                aria-label={`Di chuyển kinh nghiệm ${exp.position || idx + 1} xuống`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                aria-label={`Xóa kinh nghiệm ${exp.position || idx + 1}`}
                className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`exp-pos-${exp.id}`} className={LABEL_CLASS}>
                Chức danh
              </label>
              <input
                id={`exp-pos-${exp.id}`}
                type="text"
                value={exp.position}
                onChange={(e) => handleUpdate(idx, { position: e.target.value })}
                placeholder="VD: Senior Frontend Engineer"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`exp-comp-${exp.id}`} className={LABEL_CLASS}>
                Tên công ty
              </label>
              <input
                id={`exp-comp-${exp.id}`}
                type="text"
                value={exp.company}
                onChange={(e) => handleUpdate(idx, { company: e.target.value })}
                placeholder="VD: Công ty ABC"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`exp-start-${exp.id}`} className={LABEL_CLASS}>
                Từ thời gian
              </label>
              <input
                id={`exp-start-${exp.id}`}
                type="text"
                value={exp.startDate}
                onChange={(e) => handleUpdate(idx, { startDate: e.target.value })}
                placeholder="03/2023"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={`exp-end-${exp.id}`} className="text-xs font-medium text-slate-600">
                  Đến thời gian
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) => handleUpdate(idx, { isCurrent: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>Hiện tại</span>
                </label>
              </div>
              <input
                id={`exp-end-${exp.id}`}
                type="text"
                value={exp.isCurrent ? 'Hiện tại' : exp.endDate}
                disabled={exp.isCurrent}
                onChange={(e) => handleUpdate(idx, { endDate: e.target.value })}
                placeholder="02/2025"
                className={`${INPUT_CLASS} disabled:bg-slate-100 disabled:text-slate-500`}
              />
            </div>
          </div>

          <div>
            <label htmlFor={`exp-loc-${exp.id}`} className={LABEL_CLASS}>
              Địa điểm
            </label>
            <input
              id={`exp-loc-${exp.id}`}
              type="text"
              value={exp.location}
              onChange={(e) => handleUpdate(idx, { location: e.target.value })}
              placeholder="TP. Hồ Chí Minh"
              className={INPUT_CLASS}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Mô tả công việc & thành tựu đo lường được
              </span>
              <button
                type="button"
                onClick={() => handleAddBullet(idx)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-950"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Thêm gạch đầu dòng</span>
              </button>
            </div>
            {exp.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-start gap-2">
                <textarea
                  rows={2}
                  aria-label={`Mô tả thành tựu ${bIdx + 1} tại ${exp.company || 'công ty'}`}
                  value={bullet}
                  onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                  placeholder="VD: Giảm 40% thời gian tải trang nhờ tối ưu bundle..."
                  className={`${INPUT_CLASS} resize-y min-h-[54px]`}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteBullet(idx, bIdx)}
                  aria-label={`Xóa gạch đầu dòng ${bIdx + 1}`}
                  className="p-1.5 mt-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Thêm kinh nghiệm làm việc</span>
      </button>
    </div>
  );
}
