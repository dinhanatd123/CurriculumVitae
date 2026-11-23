import { ArrowUp, ArrowDown, Trash2, Plus, X } from 'lucide-react';
import type { CertificateItem, SkillDisplayMode, SkillGroup } from '../../types/cv';
import { createId, moveItem } from '../../utils/cvHelpers';

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';
const LABEL_CLASS = 'block text-xs font-medium text-slate-600 mb-1';

interface SkillsSectionProps {
  groups: SkillGroup[];
  displayMode: SkillDisplayMode;
  onChangeGroups: (groups: SkillGroup[]) => void;
  onChangeDisplayMode: (mode: SkillDisplayMode) => void;
}

export function SkillsSection({
  groups,
  displayMode,
  onChangeGroups,
  onChangeDisplayMode,
}: SkillsSectionProps) {
  const handleAddGroup = () => {
    onChangeGroups([
      ...groups,
      {
        id: createId('sg'),
        category: '',
        items: [{ id: createId('sk'), name: '', level: 4 }],
      },
    ]);
  };

  const handleUpdateCategory = (gIdx: number, category: string) => {
    onChangeGroups(groups.map((g, idx) => (idx === gIdx ? { ...g, category } : g)));
  };

  const handleAddSkill = (gIdx: number) => {
    onChangeGroups(
      groups.map((g, idx) =>
        idx === gIdx
          ? { ...g, items: [...g.items, { id: createId('sk'), name: '', level: 4 }] }
          : g
      )
    );
  };

  const handleUpdateSkill = (
    gIdx: number,
    sIdx: number,
    patch: { name?: string; level?: number }
  ) => {
    onChangeGroups(
      groups.map((g, idx) =>
        idx === gIdx
          ? {
              ...g,
              items: g.items.map((sk, i) => (i === sIdx ? { ...sk, ...patch } : sk)),
            }
          : g
      )
    );
  };

  const handleDeleteSkill = (gIdx: number, sIdx: number) => {
    onChangeGroups(
      groups.map((g, idx) =>
        idx === gIdx ? { ...g, items: g.items.filter((_, i) => i !== sIdx) } : g
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Display Mode Switcher */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <span className="text-xs font-medium text-slate-600">Kiểu hiển thị kỹ năng trên CV</span>
        <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => onChangeDisplayMode('tags')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              displayMode === 'tags'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thẻ tag
          </button>
          <button
            type="button"
            onClick={() => onChangeDisplayMode('bars')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              displayMode === 'bars'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thanh mức độ
          </button>
        </div>
      </div>

      {groups.length === 0 && (
        <p className="text-xs text-slate-500 py-2">
          Chưa có nhóm kỹ năng nào. Nhấn nút bên dưới để thêm nhóm mới.
        </p>
      )}

      {groups.map((group, gIdx) => (
        <div
          key={group.id}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              aria-label={`Tên nhóm kỹ năng ${gIdx + 1}`}
              value={group.category}
              onChange={(e) => handleUpdateCategory(gIdx, e.target.value)}
              placeholder="Tên nhóm (VD: Chuyên môn, Công cụ, Kỹ năng mềm)"
              className={`${INPUT_CLASS} font-medium`}
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onChangeGroups(moveItem(groups, gIdx, 'up'))}
                disabled={gIdx === 0}
                aria-label={`Di chuyển nhóm kỹ năng ${group.category || gIdx + 1} lên`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChangeGroups(moveItem(groups, gIdx, 'down'))}
                disabled={gIdx === groups.length - 1}
                aria-label={`Di chuyển nhóm kỹ năng ${group.category || gIdx + 1} xuống`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChangeGroups(groups.filter((_, i) => i !== gIdx))}
                aria-label={`Xóa nhóm kỹ năng ${group.category || gIdx + 1}`}
                className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {group.items.map((sk, sIdx) => (
              <div key={sk.id} className="flex items-center gap-2">
                <input
                  type="text"
                  aria-label={`Kỹ năng ${sIdx + 1} trong nhóm ${group.category || gIdx + 1}`}
                  value={sk.name}
                  onChange={(e) => handleUpdateSkill(gIdx, sIdx, { name: e.target.value })}
                  placeholder="Tên kỹ năng (VD: React, Figma...)"
                  className={INPUT_CLASS}
                />
                {displayMode === 'bars' && (
                  <select
                    aria-label={`Mức độ kỹ năng ${sk.name || sIdx + 1}`}
                    value={sk.level}
                    onChange={(e) =>
                      handleUpdateSkill(gIdx, sIdx, { level: Number(e.target.value) })
                    }
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 tabular-nums shrink-0 focus:border-slate-900 focus:outline-none"
                  >
                    <option value={1}>1/5</option>
                    <option value={2}>2/5</option>
                    <option value={3}>3/5</option>
                    <option value={4}>4/5</option>
                    <option value={5}>5/5</option>
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(gIdx, sIdx)}
                  aria-label={`Xóa kỹ năng ${sk.name || sIdx + 1}`}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleAddSkill(gIdx)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-950"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Thêm kỹ năng vào nhóm</span>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddGroup}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:border-slate-500 hover:bg-slate-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Thêm nhóm kỹ năng</span>
      </button>
    </div>
  );
}

interface CertificatesSectionProps {
  items: CertificateItem[];
  onChange: (items: CertificateItem[]) => void;
}

export function CertificatesSection({ items, onChange }: CertificatesSectionProps) {
  const handleAdd = () => {
    onChange([
      ...items,
      { id: createId('cert'), name: '', issuer: '', year: '' },
    ]);
  };

  const handleUpdate = (index: number, patch: Partial<CertificateItem>) => {
    onChange(items.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-xs text-slate-500 py-2">
          Chưa có chứng chỉ hay giải thưởng nào.
        </p>
      )}

      {items.map((cert, idx) => (
        <div
          key={cert.id}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 truncate">
              {cert.name || `Chứng chỉ #${idx + 1}`}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onChange(moveItem(items, idx, 'up'))}
                disabled={idx === 0}
                aria-label={`Di chuyển chứng chỉ ${cert.name || idx + 1} lên`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, idx, 'down'))}
                disabled={idx === items.length - 1}
                aria-label={`Di chuyển chứng chỉ ${cert.name || idx + 1} xuống`}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-35 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                aria-label={`Xóa chứng chỉ ${cert.name || idx + 1}`}
                className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_92px] gap-2.5">
            <div>
              <label htmlFor={`cert-name-${cert.id}`} className={LABEL_CLASS}>
                Tên chứng chỉ / Giải thưởng
              </label>
              <input
                id={`cert-name-${cert.id}`}
                type="text"
                value={cert.name}
                onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                placeholder="VD: AWS Certified..."
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`cert-issuer-${cert.id}`} className={LABEL_CLASS}>
                Đơn vị cấp
              </label>
              <input
                id={`cert-issuer-${cert.id}`}
                type="text"
                value={cert.issuer}
                onChange={(e) => handleUpdate(idx, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor={`cert-year-${cert.id}`} className={LABEL_CLASS}>
                Năm
              </label>
              <input
                id={`cert-year-${cert.id}`}
                type="text"
                value={cert.year}
                onChange={(e) => handleUpdate(idx, { year: e.target.value })}
                placeholder="2024"
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
        <span>Thêm chứng chỉ / giải thưởng</span>
      </button>
    </div>
  );
}
