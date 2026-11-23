import { useEffect } from 'react';
import { Printer, X, CheckCircle2, FileDown } from 'lucide-react';

interface PrintGuideModalProps {
  isOpen: boolean;
  pdfTitle: string;
  onClose: () => void;
  onConfirmPrint: () => void;
}

export function PrintGuideModal({
  isOpen,
  pdfTitle,
  onClose,
  onConfirmPrint,
}: PrintGuideModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-guide-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <FileDown className="w-5 h-5 text-slate-900" aria-hidden="true" />
            <h2 id="print-guide-title" className="text-base font-bold text-slate-950">
              Xuất CV chuẩn A4 (PDF Vector)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hướng dẫn xuất PDF"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-3">
            <div className="text-xs font-medium text-slate-500">Tên tệp PDF tự động gợi ý</div>
            <div className="mt-1 text-sm font-semibold text-slate-900 font-mono break-all">
              {pdfTitle}.pdf
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Thiết lập nhanh trong hộp thoại In để đẹp nhất
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  Chọn đích đến <strong className="text-slate-950">Lưu dưới dạng PDF (Save as PDF)</strong>, khổ giấy{' '}
                  <strong className="text-slate-950">A4</strong> và lề <strong className="text-slate-950">Không (None)</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-slate-950">Bật “Đồ họa nền” (Background graphics)</strong> để giữ trọn vẹn màu thanh bên, thanh kỹ năng và header.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-slate-950">Tắt “Đầu trang và chân trang” (Headers and footers)</strong> để loại bỏ ngày tháng và đường dẫn thừa ở mép trang.
                </span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            File PDF xuất ra giữ nguyên dạng vector chuẩn ATS — bôi đen/sao chép chữ chính xác và hiển thị sắc nét đầy đủ dấu tiếng Việt.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/70 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={onConfirmPrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>In / Lưu thành PDF ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
