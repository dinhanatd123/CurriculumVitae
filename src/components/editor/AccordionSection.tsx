import type { ReactNode } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  visible?: boolean;
  onToggleVisible?: () => void;
  children: ReactNode;
}

export function AccordionSection({
  id,
  title,
  subtitle,
  isOpen,
  onToggleOpen,
  visible,
  onToggleVisible,
  children,
}: AccordionSectionProps) {
  const hasVisibilityControl = typeof visible === 'boolean' && typeof onToggleVisible === 'function';

  return (
    <section
      aria-labelledby={`section-heading-${id}`}
      className="border-b border-slate-200/90 last:border-b-0 bg-white"
    >
      <div className="flex items-center justify-between gap-2 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
        <button
          id={`section-heading-${id}`}
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls={`section-panel-${id}`}
          className="flex flex-1 items-center gap-2.5 text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded"
        >
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0 flex items-baseline gap-2">
            <span
              className={`text-sm font-semibold truncate ${
                hasVisibilityControl && !visible ? 'text-slate-400 line-through' : 'text-slate-900'
              }`}
            >
              {title}
            </span>
            {subtitle && (
              <span className="text-xs text-slate-500 tabular-nums shrink-0">{subtitle}</span>
            )}
          </div>
        </button>

        {hasVisibilityControl && (
          <button
            type="button"
            onClick={onToggleVisible}
            aria-pressed={visible}
            aria-label={visible ? `Ẩn mục ${title} trên CV` : `Hiển thị mục ${title} trên CV`}
            title={visible ? 'Đang hiển thị trên CV' : 'Đang ẩn trên CV'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              visible
                ? 'text-slate-700 bg-slate-100 hover:bg-slate-200/80'
                : 'text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            {visible ? (
              <>
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hiện</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Đang ẩn</span>
              </>
            )}
          </button>
        )}
      </div>

      {isOpen && (
        <div id={`section-panel-${id}`} className="px-5 pb-5 pt-1">
          {children}
        </div>
      )}
    </section>
  );
}
