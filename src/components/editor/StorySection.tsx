import type { PortfolioStory } from '../../types/cv';

interface StorySectionProps {
  story: PortfolioStory;
  onChange: (updated: PortfolioStory) => void;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';
const LABEL_CLASS = 'block text-xs font-medium text-slate-600 mb-1';

export function StorySection({ story, onChange }: StorySectionProps) {
  const update = <K extends keyof PortfolioStory>(key: K, val: PortfolioStory[K]) => {
    onChange({ ...story, [key]: val });
  };

  const updateStat = (idx: number, field: 'value' | 'label', val: string) => {
    const nextStats = story.heroStats.map((st, i) => (i === idx ? { ...st, [field]: val } : st));
    update('heroStats', nextStats);
  };

  const updateStrength = (idx: number, val: string) => {
    const next = [...story.strengths];
    next[idx] = val;
    update('strengths', next);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="story-statusBadge" className={LABEL_CLASS}>
            Nhãn trạng thái nhận việc
          </label>
          <input
            id="story-statusBadge"
            type="text"
            value={story.statusBadge}
            onChange={(e) => update('statusBadge', e.target.value)}
            placeholder="VD: Sẵn sàng nhận việc"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="story-float1" className={LABEL_CLASS}>
            Badge nổi trên thẻ 3D
          </label>
          <input
            id="story-float1"
            type="text"
            value={story.floatingBadges[0]}
            onChange={(e) => update('floatingBadges', [e.target.value, story.floatingBadges[1]])}
            placeholder="WCAG AA & ATS Ready"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="story-slogan" className={LABEL_CLASS}>
          Slogan nghề nghiệp (Màn hình mở đầu & Chặng 01)
        </label>
        <textarea
          id="story-slogan"
          rows={2}
          value={story.slogan}
          onChange={(e) => update('slogan', e.target.value)}
          className={`${INPUT_CLASS} resize-y`}
        />
      </div>

      <div>
        <span className={LABEL_CLASS}>3 Thế mạnh nổi bật (Chặng 01)</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[0, 1, 2].map((idx) => (
            <input
              key={idx}
              type="text"
              aria-label={`Thế mạnh nổi bật ${idx + 1}`}
              value={story.strengths[idx] ?? ''}
              onChange={(e) => updateStrength(idx, e.target.value)}
              placeholder={`Thế mạnh ${idx + 1}`}
              className={INPUT_CLASS}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className={LABEL_CLASS}>3 Con số nổi bật trên thẻ 3D</span>
        <div className="space-y-2">
          {story.heroStats.slice(0, 3).map((st, idx) => (
            <div key={st.id} className="grid grid-cols-[120px_1fr] gap-2">
              <input
                type="text"
                aria-label={`Giá trị chỉ số ${idx + 1}`}
                value={st.value}
                onChange={(e) => updateStat(idx, 'value', e.target.value)}
                placeholder="5+ năm"
                className={`${INPUT_CLASS} font-semibold`}
              />
              <input
                type="text"
                aria-label={`Mô tả chỉ số ${idx + 1}`}
                value={st.label}
                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                placeholder="Kinh nghiệm Frontend"
                className={INPUT_CLASS}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 space-y-3">
        <span className="text-xs font-semibold text-slate-700">Nội dung Chặng 02 &amp; Chặng 03</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="story-act2-solid" className={LABEL_CLASS}>
              Tiêu đề Chặng 02 (Chữ đặc)
            </label>
            <input
              id="story-act2-solid"
              type="text"
              value={story.act2Solid}
              onChange={(e) => update('act2Solid', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="story-act2-outline" className={LABEL_CLASS}>
              Tiêu đề Chặng 02 (Chữ rỗng viền nét)
            </label>
            <input
              id="story-act2-outline"
              type="text"
              value={story.act2Outline}
              onChange={(e) => update('act2Outline', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div>
          <label htmlFor="story-act3" className={LABEL_CLASS}>
            Câu chốt ấn tượng (Chặng 03)
          </label>
          <input
            id="story-act3"
            type="text"
            value={story.act3Headline}
            onChange={(e) => update('act3Headline', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </div>
  );
}
