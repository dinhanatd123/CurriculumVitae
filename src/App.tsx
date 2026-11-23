import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import type { CvData, CvSettings, CvState, ProjectItem } from './types/cv';
import { createSampleCvState } from './data/sampleCv';
import { CV_LABELS, PORTFOLIO_UI_LABELS } from './data/i18n';
import {
  INTRO_SESSION_KEY,
  STORAGE_KEY,
  buildPdfDocumentTitle,
  validateAndNormalizeCvState,
} from './utils/cvHelpers';
import { SplashScreen } from './components/portfolio/SplashScreen';
import { StickyHeader } from './components/portfolio/StickyHeader';
import { ScrollHero } from './components/portfolio/ScrollHero';
import { MarqueeBanner } from './components/portfolio/MarqueeBanner';
import { PortfolioSections } from './components/portfolio/PortfolioSections';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { ContactBannerFooter } from './components/portfolio/ContactBannerFooter';
import { EditDrawer } from './components/EditDrawer';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { CvDocument } from './components/preview/CvDocument';

interface ToastState {
  message: string;
  undoState?: CvState;
}

function loadInitialState(): CvState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem('cv_studio_state_v1');
    if (!raw) return createSampleCvState();
    const parsed = JSON.parse(raw);
    const validated = validateAndNormalizeCvState(parsed);
    return validated.ok ? validated.state : createSampleCvState();
  } catch {
    return createSampleCvState();
  }
}

function shouldShowSplashInitially(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') return false;
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const [cvState, setCvState] = useState<CvState>(() => loadInitialState());
  const [showSplash, setShowSplash] = useState<boolean>(() => shouldShowSplashInitially());
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
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
      // Ignore storage quota errors
    }
  }, [cvState]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleDismissSplash = useCallback(() => {
    setShowSplash(false);
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleReplaySplash = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setShowSplash(true);
    try {
      window.sessionStorage.removeItem(INTRO_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
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
    setPrintPreviewOpen(false);
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

  const cvLabels = CV_LABELS[cvState.settings.language];
  const uiLabels = PORTFOLIO_UI_LABELS[cvState.settings.language];

  // Ensure print template stays on Modern 2-col or Classic 1-col ATS
  const printSettings: CvSettings = {
    ...cvState.settings,
    template: cvState.settings.template === 'classic' ? 'classic' : 'modern',
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Full-Screen Intro Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            personal={cvState.data.personal}
            story={cvState.data.story}
            uiLabels={uiLabels}
            onEnter={handleDismissSplash}
          />
        )}
      </AnimatePresence>

      {/* Main Interactive Scroll-Telling CV Portfolio (Hidden completely in @media print) */}
      <div className="no-print min-h-[100dvh] flex flex-col bg-[#F8FAFC]">
        <StickyHeader
          candidateName={cvState.data.personal.fullName}
          uiLabels={uiLabels}
          onOpenEditor={() => setEditDrawerOpen(true)}
          onOpenPrintPreview={() => setPrintPreviewOpen(true)}
        />

        <main className="flex-1">
          <ScrollHero
            personal={cvState.data.personal}
            story={cvState.data.story}
            uiLabels={uiLabels}
            onOpenPrintPreview={() => setPrintPreviewOpen(true)}
          />

          <MarqueeBanner data={cvState.data} />

          <PortfolioSections
            data={cvState.data}
            settings={cvState.settings}
            cvLabels={cvLabels}
            uiLabels={uiLabels}
            onSelectProject={setSelectedProject}
          />

          <ContactBannerFooter
            personal={cvState.data.personal}
            uiLabels={uiLabels}
            onOpenPrintPreview={() => setPrintPreviewOpen(true)}
            onReplaySplash={handleReplaySplash}
          />
        </main>
      </div>

      {/* Interactive Modals & Live Editor Drawer (All hidden in @media print) */}
      <ProjectModal
        project={selectedProject}
        labels={cvLabels}
        onClose={() => setSelectedProject(null)}
      />

      <EditDrawer
        isOpen={editDrawerOpen}
        data={cvState.data}
        settings={cvState.settings}
        onClose={() => setEditDrawerOpen(false)}
        onChangeData={handleChangeData}
        onChangeSettings={handleChangeSettings}
        onLoadSample={handleLoadSample}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenPrintPreview={() => setPrintPreviewOpen(true)}
        onNotify={(msg) => showToast(msg)}
      />

      <PrintPreviewModal
        isOpen={printPreviewOpen}
        data={cvState.data}
        settings={printSettings}
        pdfTitle={pdfTitle}
        onChangeSettings={handleChangeSettings}
        onClose={() => setPrintPreviewOpen(false)}
        onConfirmPrint={handleConfirmPrint}
      />

      {/* Dedicated Unscaled Flat A4 Print Root (Visible ONLY in @media print) */}
      <div id="cv-print-portal" className="hidden print:block">
        <CvDocument data={cvState.data} settings={printSettings} />
      </div>

      {/* Non-Intrusive Feedback Toast with Optional Undo */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0B1F3A] text-white text-xs font-medium shadow-xl"
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
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
    </MotionConfig>
  );
}
