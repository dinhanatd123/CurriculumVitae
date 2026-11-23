import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Check, CheckCircle2 } from 'lucide-react';
import type {
  CvData,
  CvLanguage,
  CvSettings,
  DensityId,
  FontFamilyId,
  PrintTemplateId,
} from '../types/cv';
import { PRESET_COLORS } from '../data/i18n';
import { LivePreviewStage } from './preview/LivePreviewStage';

interface PrintPreviewModalProps {
  isOpen: boolean;
  data: CvData;
  settings: CvSettings;
  pdfTitle: string;
  onChangeSettings: (patch: Partial<CvSettings>) => void;
  onClose: () => void;
  onConfirmPrint: () => void;
}

const PRINT_TEMPLATES: { id: PrintTemplateId; label: string; desc: string }[] = [
  {
    id: 'modern',
    label: 'Hiện đại 2 cột',
    desc: 'Sidebar màu navy / xanh ngọc nổi bật',
  },
  {
    id: 'classic',
    label: 'Tối giản 1 cột ATS',
    desc: 'Chuẩn lọc CV tự động, sạch gọn',
  },
];

const DENSITIES: { id: DensityId; label: string }[] = [
  { id: 'compact', label: 'Gọn' },
  { id: 'standard', label: 'Tiêu chuẩn' },
  { id: 'spacious', label: 'Thoáng' },
];

export function PrintPreviewModal({
  isOpen,
  data,
  settings,
  pdfTitle,
  onChangeSettings,
  onClose,
  onConfirmPrint,
}: PrintPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const activePrintTemplate: PrintTemplateId =
    settings.template === 'classic' ? 'classic' : 'modern';

  const effectivePrintSettings: CvSettings = {
    ...settings,
    template: activePrintTemplate,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/60 backdrop-blur-[2px] p-2 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-preview-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl h-[92dvh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Top Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div>
                <h2
                  id="print-preview-title"
                  className="font-display text-base sm:text-lg font-extrabold text-[#0B1F3A]"
                >
                  Xem trước &amp; Xuất CV chuẩn A4 (PDF Vector)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-mono truncate max-w-[260px] sm:max-w-lg">
                  {pdfTitle}.pdf
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng hộp thoại xuất PDF"
                className="w-10 h-10 rounded-full text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body: Left Print Settings + Right Live A4 Preview */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
              {/* Left Settings & Print Checklist */}
              <div className="w-full lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white overflow-y-auto studio-scroll p-5 space-y-5">
                {/* 2 Print Templates */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mẫu bản in A4
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    {PRINT_TEMPLATES.map((tpl) => {
                      const active = activePrintTemplate === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => onChangeSettings({ template: tpl.id })}
                          aria-pressed={active}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            active
                              ? 'border-[#0284C7] bg-sky-50/70 ring-1 ring-[#0284C7]/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#0B1F3A]">{tpl.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{tpl.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Màu nhấn bản in
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map((c) => {
                      const isSelected =
                        settings.primaryColor.toLowerCase() === c.value.toLowerCase();
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => onChangeSettings({ primaryColor: c.value })}
                          aria-label={`Màu in ${c.name}`}
                          aria-pressed={isSelected}
                          title={c.name}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                            isSelected ? 'ring-2 ring-offset-2 ring-[#0B1F3A] scale-105' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.value }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />}
                        </button>
                      );
                    })}

                    <label
                      title="Màu tùy chỉnh"
                      className="relative w-6 h-6 rounded-full border border-slate-300 bg-white overflow-hidden cursor-pointer flex items-center justify-center"
                    >
                      <span className="sr-only">Màu in tùy chỉnh</span>
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => onChangeSettings({ primaryColor: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          background:
                            'conic-gradient(from 0deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)',
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Font, Density & VI/EN */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="print-font-select"
                      className="block text-xs font-semibold text-slate-600 mb-1"
                    >
                      Font chữ in
                    </label>
                    <select
                      id="print-font-select"
                      value={settings.fontFamily}
                      onChange={(e) =>
                        onChangeSettings({ fontFamily: e.target.value as FontFamilyId })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800"
                    >
                      <option value="be-vietnam">Be Vietnam Pro</option>
                      <option value="inter">Inter</option>
                      <option value="merriweather">Merriweather</option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-600 mb-1">
                      Tiêu đề CV
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg">
                      {(['vi', 'en'] as CvLanguage[]).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => onChangeSettings({ language: lang })}
                          className={`py-1 rounded-md text-xs font-bold cursor-pointer ${
                            settings.language === lang
                              ? 'bg-white text-[#0B1F3A] shadow-xs'
                              : 'text-slate-500'
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-600 mb-1">
                    Mật độ chữ
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-lg">
                    {DENSITIES.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => onChangeSettings({ density: d.id })}
                        className={`py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          settings.density === d.id
                            ? 'bg-white text-[#0B1F3A] shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Print Guide Checklist */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-[#0B1F3A]">Lưu ý khi Lưu thành PDF:</div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      Chọn khổ <strong className="text-slate-900">A4</strong>, lề{' '}
                      <strong className="text-slate-900">Không (None)</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      <strong className="text-slate-900">Bật Đồ họa nền</strong> (Background graphics) và{' '}
                      <strong className="text-slate-900">Tắt Đầu/Chân trang</strong>.
                    </span>
                  </div>
                </div>

                {/* Primary Print Action */}
                <button
                  type="button"
                  onClick={onConfirmPrint}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#0B1F3A] via-[#0284C7] to-[#10B981] text-white text-sm font-bold shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  <span>Xuất PDF A4 ngay</span>
                </button>
              </div>

              {/* Right Live Flat A4 Sheet Preview */}
              <div className="flex-1 min-h-[320px] overflow-hidden">
                <LivePreviewStage data={data} settings={effectivePrintSettings} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
