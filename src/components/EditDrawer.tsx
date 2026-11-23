import { useEffect, useRef, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Download, Upload, FileDown, Palette, Check } from 'lucide-react';
import type { CvData, CvLanguage, CvSettings, WebThemeId } from '../types/cv';
import { WEB_THEMES } from '../data/themes';
import { EditorPanel } from './editor/EditorPanel';

interface EditDrawerProps {
  isOpen: boolean;
  data: CvData;
  settings: CvSettings;
  onClose: () => void;
  onChangeData: (updater: (prev: CvData) => CvData) => void;
  onChangeSettings: (patch: Partial<CvSettings>) => void;
  onSelectTheme: (themeId: WebThemeId) => void;
  onLoadSample: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onOpenPrintPreview: () => void;
  onNotify: (message: string) => void;
}

export function EditDrawer({
  isOpen,
  data,
  settings,
  onClose,
  onChangeData,
  onChangeSettings,
  onSelectTheme,
  onLoadSample,
  onExportJson,
  onImportJson,
  onOpenPrintPreview,
  onNotify,
}: EditDrawerProps) {
  const jsonInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleJsonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImportJson(file);
    e.target.value = '';
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
          className="no-print fixed inset-0 z-50 flex justify-end bg-[#0B1F3A]/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-drawer-title"
        >
          <input
            ref={jsonInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleJsonChange}
            className="hidden"
            aria-label="Nhập tệp JSON khôi phục CV"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl h-[100dvh] bg-white shadow-2xl flex flex-col overflow-hidden safe-top safe-bottom"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div>
                <h2 id="edit-drawer-title" className="font-display text-base sm:text-lg font-extrabold text-[#0B1F3A]">
                  Chỉnh sửa CV trực tiếp
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tự động lưu &amp; cập nhật đồng thời trên trang web và bản in A4
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng trình chỉnh sửa CV"
                className="w-10 h-10 rounded-full text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Utility Controls Bar: VI/EN, Sample Data, JSON Backup */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={onLoadSample}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dữ liệu mẫu</span>
                </button>
                <button
                  type="button"
                  onClick={onExportJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Xuất JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => jsonInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Nhập JSON</span>
                </button>
              </div>

              {/* Bilingual VI / EN Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Tiêu đề:</span>
                <div
                  className="inline-flex items-center gap-0.5 p-0.5 bg-slate-200/80 rounded-md"
                  role="group"
                  aria-label="Chuyển ngôn ngữ tiêu đề CV VI hoặc EN"
                >
                  {(['vi', 'en'] as CvLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => onChangeSettings({ language: lang })}
                      aria-pressed={settings.language === lang}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                        settings.language === lang
                          ? 'bg-white text-[#0B1F3A] shadow-xs'
                          : 'text-slate-600 hover:text-[#0B1F3A]'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Youthful Web Color Theme Selector Bar */}
            <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Palette className="w-3.5 h-3.5 text-theme-accent" aria-hidden="true" />
                <span>Màu chủ đạo web:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {WEB_THEMES.map((theme) => {
                  const isSelected = settings.webTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onSelectTheme(theme.id)}
                      title={theme.nameVi}
                      aria-label={`Chọn màu ${theme.nameVi}`}
                      aria-pressed={isSelected}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white transition-transform cursor-pointer ${
                        isSelected
                          ? 'scale-110 ring-2 ring-offset-2 ring-slate-800'
                          : 'hover:scale-105 opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${theme.swatchFrom}, ${theme.swatchTo})`,
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Modular CV Editor */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <EditorPanel
                data={data}
                settings={settings}
                onChangeData={onChangeData}
                onChangeSettings={onChangeSettings}
                onNotify={onNotify}
              />
            </div>

            {/* Sticky Bottom Bar */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrintPreview();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full theme-gradient-bg text-white text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity whitespace-nowrap cursor-pointer"
              >
                <FileDown className="w-4 h-4" aria-hidden="true" />
                <span>Xem trước &amp; Xuất PDF A4</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full theme-ink-bg text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
