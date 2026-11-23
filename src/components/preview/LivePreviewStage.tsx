import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { CvData, CvSettings } from '../../types/cv';
import { computeAutoZoomScale } from '../../utils/cvHelpers';
import { CvDocument } from './CvDocument';

interface LivePreviewStageProps {
  data: CvData;
  settings: CvSettings;
}

const A4_WIDTH_PX = 794; // 210mm at 96dpi
const A4_HEIGHT_PX = 1123; // 297mm at 96dpi

export function LivePreviewStage({ data, settings }: LivePreviewStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperMeasureRef = useRef<HTMLDivElement>(null);

  const [autoScale, setAutoScale] = useState(0.82);
  const [manualScale, setManualScale] = useState<number | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState(A4_HEIGHT_PX);

  const effectiveScale = manualScale ?? autoScale;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      setAutoScale(computeAutoZoomScale(el.clientWidth, A4_WIDTH_PX));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const paperEl = paperMeasureRef.current;
    if (!paperEl) return;

    const updateHeight = () => {
      setMeasuredHeight(Math.max(A4_HEIGHT_PX, paperEl.scrollHeight));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(paperEl);
    return () => observer.disconnect();
  }, [data, settings]);

  const handleZoomOut = () => {
    setManualScale((prev) => {
      const current = prev ?? autoScale;
      return Math.max(0.4, Math.round((current - 0.1) * 100) / 100);
    });
  };

  const handleZoomIn = () => {
    setManualScale((prev) => {
      const current = prev ?? autoScale;
      return Math.min(1.25, Math.round((current + 0.1) * 100) / 100);
    });
  };

  const handleResetZoom = () => {
    setManualScale(null);
  };

  const estimatedPages = Math.max(1, Math.ceil((measuredHeight - 8) / A4_HEIGHT_PX));

  return (
    <section
      ref={containerRef}
      aria-label="Khung xem trước CV khổ A4"
      className="relative flex flex-col h-full bg-[#ECEFF4] overflow-hidden"
    >
      {/* Subtle Preview Stage Header */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 py-2 bg-[#ECEFF4]/95 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 tabular-nums whitespace-nowrap min-w-0">
          <span className="font-semibold text-slate-800">
            <span className="hidden sm:inline">Xem trước </span>A4
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline">210 × 297 mm</span>
          <span aria-hidden="true">·</span>
          <span>{estimatedPages} trang</span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Thu nhỏ khung xem trước"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Tự động vừa khung nhìn"
            className="px-2 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-white/80 transition-colors tabular-nums whitespace-nowrap"
          >
            {Math.round(effectiveScale * 100)}%
            {manualScale === null && <span className="hidden sm:inline"> (Tự động)</span>}
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Phóng to khung xem trước"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {manualScale !== null && (
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Khôi phục thu phóng tự động"
              title="Vừa khung nhìn"
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable A4 Paper Canvas */}
      <div className="flex-1 overflow-auto studio-scroll py-5 sm:py-6 px-3 sm:px-7">
        <div className="flex justify-center">
          <div
            className="relative shrink-0"
            style={{
              width: `${Math.round(A4_WIDTH_PX * effectiveScale)}px`,
              height: `${Math.round(measuredHeight * effectiveScale)}px`,
            }}
          >
            <div
              ref={paperMeasureRef}
              data-testid="cv-preview-paper"
              className="origin-top-left shadow-[0_14px_38px_-12px_rgba(15,23,42,0.22),0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/5 bg-white"
              style={{
                width: '210mm',
                transform: `scale(${effectiveScale})`,
              }}
            >
              <CvDocument data={data} settings={settings} />

              {/* Subtle Visual Page Break Guide on Screen Only when > 1 page */}
              {estimatedPages > 1 &&
                Array.from({ length: estimatedPages - 1 }).map((_, idx) => (
                  <div
                    key={idx}
                    aria-hidden="true"
                    className="no-print pointer-events-none absolute left-0 right-0 border-t border-dashed border-slate-400/65 flex justify-end"
                    style={{ top: `${(idx + 1) * 297}mm` }}
                  >
                    <span className="bg-slate-800/85 text-white text-[10px] font-medium px-2 py-0.5 rounded-bl tracking-wide">
                      Trang {idx + 2}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
