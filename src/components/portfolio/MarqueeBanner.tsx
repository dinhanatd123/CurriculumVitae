import type { CvData } from '../../types/cv';
import { buildMarqueeItems } from '../../utils/cvHelpers';

interface MarqueeBannerProps {
  data: CvData;
}

export function MarqueeBanner({ data }: MarqueeBannerProps) {
  const items = buildMarqueeItems(data);

  return (
    <div
      aria-label="Kỹ năng và công nghệ nổi bật"
      className="no-print marquee-container relative w-full overflow-hidden theme-ink-bg py-4 sm:py-5 border-y border-white/10 select-none"
    >
      <div className="marquee-track flex items-center">
        {[0, 1].map((dupIdx) => (
          <div
            key={dupIdx}
            aria-hidden={dupIdx === 1}
            className="flex items-center shrink-0"
          >
            {items.map((item, idx) => (
              <div key={`${dupIdx}-${idx}`} className="flex items-center shrink-0">
                <span className="font-display text-sm sm:text-base font-semibold tracking-wide text-white/95 whitespace-nowrap px-5 sm:px-7">
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="text-xs font-bold select-none opacity-85"
                  style={{ color: 'var(--theme-accent-2)' }}
                >
                  ✦
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
