import { ArrowUp, ArrowDown, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import type {
  ActivityItem,
  LanguageItem,
  ReferenceItem,
  SectionVisibility,
} from '../../types/cv';
import { createId, moveItem } from '../../utils/cvHelpers';

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';

interface ExtrasSectionProps {
  languages: LanguageItem[];
  activities: ActivityItem[];
  references: ReferenceItem[];
  visibility: SectionVisibility;
  onChangeLanguages: (items: LanguageItem[]) => void;
  onChangeActivities: (items: ActivityItem[]) => void;
  onChangeReferences: (items: ReferenceItem[]) => void;
  onToggleVisibility: (key: 'languages' | 'activities' | 'references') => void;
}

export function ExtrasSection({
  languages,
  activities,
  references,
  visibility,
  onChangeLanguages,
  onChangeActivities,
  onChangeReferences,
  onToggleVisibility,
}: ExtrasSectionProps) {
  return (
    <div className="space-y-6">
      {/* Languages Block */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Ngoại ngữ
          </h3>
          <button
            type="button"
            onClick={() => onToggleVisibility('languages')}
            aria-pressed={visibility.languages}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              visibility.languages
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600'
            }`}
          >
            {visibility.languages ? (
              <>
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hiện trên CV</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Đang ẩn</span>
              </>
            )}
          </button>
        </div>

        {languages.map((lang, idx) => (
          <div key={lang.id} className="flex items-center gap-2">
            <input
              type="text"
              aria-label={`Tên ngoại ngữ ${idx + 1}`}
              value={lang.name}
              onChange={(e) =>
                onChangeLanguages(
                  languages.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                )
              }
              placeholder="VD: Tiếng Anh"
              className={`${INPUT_CLASS} max-w-[150px]`}
            />
            <input
              type="text"
              aria-label={`Trình độ ngoại ngữ ${lang.name || idx + 1}`}
              value={lang.proficiency}
              onChange={(e) =>
                onChangeLanguages(
                  languages.map((item, i) =>
                    i === idx ? { ...item, proficiency: e.target.value } : item
                  )
                )
              }
              placeholder="VD: IELTS 7.5 / Giao tiếp thành thạo"
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => onChangeLanguages(moveItem(languages, idx, 'up'))}
              disabled={idx === 0}
              aria-label={`Di chuyển ngoại ngữ ${lang.name || idx + 1} lên`}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 disabled:opacity-30 shrink-0"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguages(moveItem(languages, idx, 'down'))}
              disabled={idx === languages.length - 1}
              aria-label={`Di chuyển ngoại ngữ ${lang.name || idx + 1} xuống`}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 disabled:opacity-30 shrink-0"
            >
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguages(languages.filter((_, i) => i !== idx))}
              aria-label={`Xóa ngoại ngữ ${lang.name || idx + 1}`}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            onChangeLanguages([
              ...languages,
              { id: createId('lang'), name: '', proficiency: '' },
            ])
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Thêm ngoại ngữ</span>
        </button>
      </div>

      {/* Activities Block */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Hoạt động ngoại khóa
          </h3>
          <button
            type="button"
            onClick={() => onToggleVisibility('activities')}
            aria-pressed={visibility.activities}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              visibility.activities
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600'
            }`}
          >
            {visibility.activities ? (
              <>
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hiện trên CV</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Đang ẩn</span>
              </>
            )}
          </button>
        </div>

        {activities.map((act, idx) => (
          <div
            key={act.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 truncate">
                {act.organization || `Hoạt động #${idx + 1}`}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onChangeActivities(moveItem(activities, idx, 'up'))}
                  disabled={idx === 0}
                  aria-label={`Di chuyển hoạt động ${act.organization || idx + 1} lên`}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-35"
                >
                  <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeActivities(moveItem(activities, idx, 'down'))}
                  disabled={idx === activities.length - 1}
                  aria-label={`Di chuyển hoạt động ${act.organization || idx + 1} xuống`}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-35"
                >
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeActivities(activities.filter((_, i) => i !== idx))}
                  aria-label={`Xóa hoạt động ${act.organization || idx + 1}`}
                  className="p-1.5 rounded-md text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                aria-label={`Tổ chức hoạt động ${idx + 1}`}
                value={act.organization}
                onChange={(e) =>
                  onChangeActivities(
                    activities.map((item, i) =>
                      i === idx ? { ...item, organization: e.target.value } : item
                    )
                  )
                }
                placeholder="Tên tổ chức / CLB"
                className={INPUT_CLASS}
              />
              <input
                type="text"
                aria-label={`Vai trò hoạt động ${idx + 1}`}
                value={act.role}
                onChange={(e) =>
                  onChangeActivities(
                    activities.map((item, i) =>
                      i === idx ? { ...item, role: e.target.value } : item
                    )
                  )
                }
                placeholder="Vai trò"
                className={INPUT_CLASS}
              />
            </div>
            <input
              type="text"
              aria-label={`Thời gian hoạt động ${idx + 1}`}
              value={act.period}
              onChange={(e) =>
                onChangeActivities(
                  activities.map((item, i) =>
                    i === idx ? { ...item, period: e.target.value } : item
                  )
                )
              }
              placeholder="Thời gian (VD: 2022 – Hiện tại)"
              className={INPUT_CLASS}
            />
            <textarea
              rows={2}
              aria-label={`Mô tả hoạt động ${idx + 1}`}
              value={act.description}
              onChange={(e) =>
                onChangeActivities(
                  activities.map((item, i) =>
                    i === idx ? { ...item, description: e.target.value } : item
                  )
                )
              }
              placeholder="Mô tả đóng góp của bạn..."
              className={`${INPUT_CLASS} resize-y`}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            onChangeActivities([
              ...activities,
              { id: createId('act'), organization: '', role: '', period: '', description: '' },
            ])
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Thêm hoạt động ngoại khóa</span>
        </button>
      </div>

      {/* References Block */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Người tham chiếu
          </h3>
          <button
            type="button"
            onClick={() => onToggleVisibility('references')}
            aria-pressed={visibility.references}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              visibility.references
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600'
            }`}
          >
            {visibility.references ? (
              <>
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hiện trên CV</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Đang ẩn</span>
              </>
            )}
          </button>
        </div>

        {references.map((ref, idx) => (
          <div
            key={ref.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 truncate">
                {ref.name || `Người tham chiếu #${idx + 1}`}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onChangeReferences(moveItem(references, idx, 'up'))}
                  disabled={idx === 0}
                  aria-label={`Di chuyển người tham chiếu ${ref.name || idx + 1} lên`}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-35"
                >
                  <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeReferences(moveItem(references, idx, 'down'))}
                  disabled={idx === references.length - 1}
                  aria-label={`Di chuyển người tham chiếu ${ref.name || idx + 1} xuống`}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 disabled:opacity-35"
                >
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeReferences(references.filter((_, i) => i !== idx))}
                  aria-label={`Xóa người tham chiếu ${ref.name || idx + 1}`}
                  className="p-1.5 rounded-md text-slate-500 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <input
              type="text"
              aria-label={`Họ tên người tham chiếu ${idx + 1}`}
              value={ref.name}
              onChange={(e) =>
                onChangeReferences(
                  references.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                )
              }
              placeholder="Họ và tên (VD: Trần Quốc Bảo)"
              className={INPUT_CLASS}
            />
            <input
              type="text"
              aria-label={`Chức vụ và công ty người tham chiếu ${idx + 1}`}
              value={ref.titleAndCompany}
              onChange={(e) =>
                onChangeReferences(
                  references.map((item, i) =>
                    i === idx ? { ...item, titleAndCompany: e.target.value } : item
                  )
                )
              }
              placeholder="Chức vụ & Công ty"
              className={INPUT_CLASS}
            />
            <input
              type="text"
              aria-label={`Liên hệ người tham chiếu ${idx + 1}`}
              value={ref.contact}
              onChange={(e) =>
                onChangeReferences(
                  references.map((item, i) =>
                    i === idx ? { ...item, contact: e.target.value } : item
                  )
                )
              }
              placeholder="Email / Số điện thoại"
              className={INPUT_CLASS}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            onChangeReferences([
              ...references,
              { id: createId('ref'), name: '', titleAndCompany: '', contact: '' },
            ])
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Thêm người tham chiếu</span>
        </button>
      </div>
    </div>
  );
}
