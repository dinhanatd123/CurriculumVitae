import { useEffect, useState, useCallback, useRef } from 'react';
import type { CvData, CvSettings, CvState } from './types/cv';
import { createSampleCvState } from './data/sampleCv';
import {
  STORAGE_KEY,
  buildPdfDocumentTitle,
  validateAndNormalizeCvState,
} from './utils/cvHelpers';
import { TopToolbar } from './components/TopToolbar';
import { EditorPanel } from './components/editor/EditorPanel';
import { LivePreviewStage } from './components/preview/LivePreviewStage';
import { CvDocument } from './components/preview/CvDocument';
import { PrintGuideModal } from './components/PrintGuideModal';

interface ToastState {
  message: string;
  undoState?: CvState;
}

function loadInitialState(): CvState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSampleCvState();
    const parsed = JSON.parse(raw);
    const validated = validateAndNormalizeCvState(parsed);
    return validated.ok ? validated.state : createSampleCvState();
  } catch {
    return createSampleCvState();
  }
}

export default function App() {
  const [cvState, setCvState] = useState<CvState>(() => loadInitialState());
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, undoState?: CvState) => {
    setToast({ message, undoState });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, undoState ? 6000 : 3200);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cvState));
    } catch {
      // Ignore storage quota errors silently to avoid interrupting editing
    }
  }, [cvState]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleChangeData = useCallback((updater: (prev: CvData) => CvData) => {
    setCvState((prev) => ({
      ...prev,
      data: updater(prev.data),
    }));
  }, []);

  const handleChangeSettings = useCallback((patch: Partial<CvSettings>) => {
    setCvState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const handleLoadSample = useCallback(() => {
    const previous = cvState;
    const sample = createSampleCvState();
    setCvState({
      ...sample,
      settings: {
        ...sample.settings,
        template: previous.settings.template,
        primaryColor: previous.settings.primaryColor,
        fontFamily: previous.settings.fontFamily,
        density: previous.settings.density,
        language: previous.settings.language,
      },
    });
    showToast('Đã nạp bộ dữ liệu mẫu tiếng Việt.', previous);
  }, [cvState, showToast]);

  const handleExportJson = useCallback(() => {
    const filename = `${buildPdfDocumentTitle(
      cvState.data.personal.fullName,
      cvState.data.personal.jobTitle
    )}.json`;
    const blob = new Blob([JSON.stringify(cvState, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Đã xuất tệp sao lưu ${filename}`);
  }, [cvState, showToast]);

  const handleImportJson = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result ?? ''));
          const result = validateAndNormalizeCvState(parsed);
          if (!result.ok) {
            showToast(result.error);
            return;
          }
          const previous = cvState;
          setCvState(result.state);
          showToast('Đã khôi phục dữ liệu CV từ tệp JSON.', previous);
        } catch {
          showToast('Không thể đọc tệp JSON. Vui lòng kiểm tra lại định dạng tệp.');
        }
      };
      reader.readAsText(file);
    },
    [cvState, showToast]
  );

  const pdfTitle = buildPdfDocumentTitle(
    cvState.data.personal.fullName,
    cvState.data.personal.jobTitle
  );

  const handleConfirmPrint = useCallback(() => {
    setPrintModalOpen(false);
    const originalTitle = document.title;
    document.title = pdfTitle;

    let restored = false;
    const restoreTitle = () => {
      if (restored) return;
      restored = true;
      document.title = originalTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);

    requestAnimationFrame(() => {
      window.print();
      window.setTimeout(restoreTitle, 1500);
    });
  }, [pdfTitle]);

  return (
    <>
      {/* Main Interactive Studio Shell (Hidden when printing) */}
      <div className="no-print h-dvh flex flex-col overflow-hidden bg-[#F1F4F8]">
        <TopToolbar
          settings={cvState.settings}
          onChangeSettings={handleChangeSettings}
          onLoadSample={handleLoadSample}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onOpenPrintModal={() => setPrintModalOpen(true)}
          mobileView={mobileView}
          onChangeMobileView={setMobileView}
        />

        {/* Responsive Split-Screen Workspace: 45% Editor / 55% Live Preview */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          <div
            className={`w-full lg:w-[45%] h-full min-h-0 ${
              mobileView === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            <EditorPanel
              data={cvState.data}
              settings={cvState.settings}
              onChangeData={handleChangeData}
              onChangeSettings={handleChangeSettings}
              onNotify={(msg) => showToast(msg)}
            />
          </div>

          <div
            className={`w-full lg:w-[55%] h-full min-h-0 ${
              mobileView === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <LivePreviewStage data={cvState.data} settings={cvState.settings} />
          </div>
        </div>
      </div>

      {/* Dedicated Unscaled A4 Print Root (Visible only in @media print) */}
      <div id="cv-print-portal" className="hidden print:block">
        <CvDocument data={cvState.data} settings={cvState.settings} />
      </div>

      {/* Print Guide Modal */}
      <PrintGuideModal
        isOpen={printModalOpen}
        pdfTitle={pdfTitle}
        onClose={() => setPrintModalOpen(false)}
        onConfirmPrint={handleConfirmPrint}
      />

      {/* Non-Intrusive Feedback Toast with Optional Undo */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg"
        >
          <span>{toast.message}</span>
          {toast.undoState && (
            <button
              type="button"
              onClick={() => {
                if (toast.undoState) {
                  setCvState(toast.undoState);
                  setToast(null);
                }
              }}
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors whitespace-nowrap"
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
    </>
  );
}
