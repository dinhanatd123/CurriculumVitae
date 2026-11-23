import { useRef, useState, type ChangeEvent } from 'react';
import {
  FileText,
  Printer,
  RotateCcw,
  Download,
  Upload,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';
import type {
  CvLanguage,
  CvSettings,
  DensityId,
  FontFamilyId,
  TemplateId,
} from '../types/cv';
import { PRESET_COLORS } from '../data/i18n';

interface TopToolbarProps {
  settings: CvSettings;
  onChangeSettings: (patch: Partial<CvSettings>) => void;
  onLoadSample: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onOpenPrintModal: () => void;
  mobileView: 'editor' | 'preview';
  onChangeMobileView: (view: 'editor' | 'preview') => void;
}

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'modern', label: 'Hiện đại' },
  { id: 'classic', label: 'Tối giản ATS' },
  { id: 'executive', label: 'Chuyên nghiệp' },
];

const DENSITIES: { id: DensityId; label: string }[] = [
  { id: 'compact', label: 'Gọn' },
  { id: 'standard', label: 'Tiêu chuẩn' },
  { id: 'spacious', label: 'Thoáng' },
];

export function TopToolbar({
  settings,
  onChangeSettings,
  onLoadSample,
  onExportJson,
  onImportJson,
  onOpenPrintModal,
  mobileView,
  onChangeMobileView,
}: TopToolbarProps) {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [mobileStyleOpen, setMobileStyleOpen] = useState(false);
  const [dataMenuOpen, setDataMenuOpen] = useState(false);

  const handleJsonFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
    e.target.value = '';
    setDataMenuOpen(false);
  };

  return (
    <header className="no-print shrink-0 bg-white border-b border-slate-200 z-30">
      <input
        ref={jsonInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleJsonFile}
        className="hidden"
        aria-label="Chọn tệp JSON để khôi phục CV"
      />

      {/* Row 1: Primary Studio Navbar */}
      <div className="h-12 sm:h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-950 whitespace-nowrap">
            CV Studio
          </span>
        </div>

        {/* Zone 2: Desktop Template Switcher */}
        <nav
          aria-label="Chọn mẫu CV"
          className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0"
        >
          {TEMPLATES.map((tpl) => {
            const active = settings.template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChangeSettings({ template: tpl.id })}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {tpl.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Primary Export PDF CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop Data Actions */}
          <div className="hidden xl:flex items-center gap-1.5">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dữ liệu mẫu</span>
            </button>
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Xuất JSON</span>
            </button>
            <button
              type="button"
              onClick={() => jsonInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nhập JSON</span>
            </button>
          </div>

          {/* Compact Data Dropdown for < xl */}
          <div className="relative xl:hidden">
            <button
              type="button"
              onClick={() => setDataMenuOpen((v) => !v)}
              aria-expanded={dataMenuOpen}
              aria-label="Quản lý dữ liệu JSON và mẫu"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Dữ liệu</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {dataMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDataMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadSample();
                      setDataMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Nạp dữ liệu mẫu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onExportJson();
                      setDataMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Xuất tệp JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => jsonInputRef.current?.click()}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Nhập tệp JSON</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Primary CTA: Export PDF */}
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Xuất PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* Row 2 (Desktop): Formatting & Design Strip */}
      <div className="hidden lg:flex items-center justify-between gap-4 px-6 py-2 bg-slate-50/85 border-t border-slate-200/80 text-xs">
        <div className="flex items-center gap-5 flex-wrap">
          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600 whitespace-nowrap">Màu chủ đạo</span>
            <div className="flex items-center gap-1.5" role="group" aria-label="Chọn màu chủ đạo">
              {PRESET_COLORS.map((c) => {
                const isSelected = settings.primaryColor.toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onChangeSettings({ primaryColor: c.value })}
                    aria-label={`Màu ${c.name}`}
                    aria-pressed={isSelected}
                    title={c.name}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-105' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                  </button>
                );
              })}

              <label
                title="Chọn màu tùy chỉnh"
                className="relative w-5 h-5 rounded-full border border-slate-300 bg-white overflow-hidden cursor-pointer flex items-center justify-center hover:border-slate-500 ml-0.5"
              >
                <span className="sr-only">Màu tùy chỉnh</span>
                <input
                  type="color"
                  aria-label="Chọn mã màu tùy chỉnh"
                  value={settings.primaryColor}
                  onChange={(e) => onChangeSettings({ primaryColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)',
                  }}
                />
              </label>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200" aria-hidden="true" />

          {/* Font Family Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="cv-font-select" className="font-medium text-slate-600 whitespace-nowrap">
              Font chữ
            </label>
            <select
              id="cv-font-select"
              value={settings.fontFamily}
              onChange={(e) => onChangeSettings({ fontFamily: e.target.value as FontFamilyId })}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
            >
              <option value="be-vietnam">Be Vietnam Pro</option>
              <option value="inter">Inter</option>
              <option value="merriweather">Merriweather (Serif)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" aria-hidden="true" />

          {/* Density Selector */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600 whitespace-nowrap">Mật độ</span>
            <div className="inline-flex items-center gap-0.5 p-0.5 bg-slate-200/70 rounded-md">
              {DENSITIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChangeSettings({ density: d.id })}
                  aria-pressed={settings.density === d.id}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                    settings.density === d.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bilingual Section Labels Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-medium text-slate-600 whitespace-nowrap">Tiêu đề CV</span>
          <div
            className="inline-flex items-center gap-0.5 p-0.5 bg-slate-200/70 rounded-md"
            role="group"
            aria-label="Chuyển ngôn ngữ tiêu đề CV"
          >
            {(['vi', 'en'] as CvLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onChangeSettings({ language: lang })}
                aria-pressed={settings.language === lang}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
                  settings.language === lang
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Compact Mode Switcher + Collapsible Style Drawer Trigger */}
      <div className="lg:hidden flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-50 border-t border-slate-200/80">
        <div className="inline-flex items-center gap-1 p-0.5 bg-slate-200/75 rounded-lg flex-1">
          <button
            type="button"
            onClick={() => onChangeMobileView('editor')}
            aria-pressed={mobileView === 'editor'}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              mobileView === 'editor'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Chỉnh sửa
          </button>
          <button
            type="button"
            onClick={() => onChangeMobileView('preview')}
            aria-pressed={mobileView === 'preview'}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              mobileView === 'preview'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Xem trước A4
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileStyleOpen((v) => !v)}
          aria-expanded={mobileStyleOpen}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            mobileStyleOpen
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Giao diện</span>
        </button>
      </div>

      {/* Mobile Collapsible Style Panel */}
      {mobileStyleOpen && (
        <div className="lg:hidden px-4 py-3.5 bg-white border-t border-slate-200 space-y-3 text-xs shadow-sm">
          <div>
            <span className="block font-medium text-slate-600 mb-1.5">Mẫu CV</span>
            <div className="grid grid-cols-3 gap-1.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => onChangeSettings({ template: tpl.id })}
                  className={`py-1.5 px-2 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${
                    settings.template === tpl.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-slate-600">Màu chủ đạo</span>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => {
                const isSelected = settings.primaryColor.toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onChangeSettings({ primaryColor: c.value })}
                    aria-label={`Màu ${c.name}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                  </button>
                );
              })}
              <label className="relative w-6 h-6 rounded-full border border-slate-300 bg-white overflow-hidden flex items-center justify-center">
                <span className="sr-only">Màu tùy chỉnh</span>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => onChangeSettings({ primaryColor: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mobile-font-select" className="block font-medium text-slate-600 mb-1">
                Font chữ
              </label>
              <select
                id="mobile-font-select"
                value={settings.fontFamily}
                onChange={(e) => onChangeSettings({ fontFamily: e.target.value as FontFamilyId })}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800"
              >
                <option value="be-vietnam">Be Vietnam Pro</option>
                <option value="inter">Inter</option>
                <option value="merriweather">Merriweather</option>
              </select>
            </div>

            <div>
              <span className="block font-medium text-slate-600 mb-1">Tiêu đề CV</span>
              <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-md">
                {(['vi', 'en'] as CvLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => onChangeSettings({ language: lang })}
                    className={`py-1 rounded text-xs font-semibold ${
                      settings.language === lang
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="block font-medium text-slate-600 mb-1">Mật độ chữ</span>
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-md">
              {DENSITIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChangeSettings({ density: d.id })}
                  className={`py-1 rounded text-xs font-medium ${
                    settings.density === d.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
