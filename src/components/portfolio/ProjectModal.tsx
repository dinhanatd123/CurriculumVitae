import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Calendar, UserCheck, Layers } from 'lucide-react';
import type { ProjectItem } from '../../types/cv';
import type { CvSectionLabels } from '../../data/i18n';
import { formatDisplayUrl, normalizeHref } from '../../utils/cvHelpers';

interface ProjectModalProps {
  project: ProjectItem | null;
  labels: CvSectionLabels;
  onClose: () => void;
}

export function ProjectModal({ project, labels, onClose }: ProjectModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id, project?.imageUrl]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  const techTokens = project
    ? project.technologies
        .split(/[,·•]/)
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/60 backdrop-blur-[2px] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto studio-scroll rounded-3xl bg-white border border-slate-200 shadow-2xl"
          >
            {/* Visual Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#0369A1] to-[#0D9488]">
              {project.imageUrl && !imgError ? (
                <img
                  src={project.imageUrl}
                  alt={`Minh họa dự án ${project.name}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                  <Layers className="w-10 h-10 mb-3 opacity-80" aria-hidden="true" />
                  <span className="font-display text-xl font-bold">{project.name}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng chi tiết dự án"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 text-[#0B1F3A] flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Project Content */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h2
                  id="project-modal-title"
                  className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight"
                >
                  {project.name}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600">
                  {project.role && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#0284C7]">
                      <UserCheck className="w-4 h-4" aria-hidden="true" />
                      <span>{project.role}</span>
                    </span>
                  )}
                  {project.period && (
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      <span>{project.period}</span>
                    </span>
                  )}
                </div>
              </div>

              {project.description && (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              )}

              {techTokens.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {labels.technologies}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techTokens.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold text-[#0B1F3A]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {project.link ? (
                  <a
                    href={normalizeHref(project.link)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#10B981] text-white text-sm font-semibold hover:opacity-95 transition-opacity break-all"
                  >
                    <span>{formatDisplayUrl(project.link)}</span>
                    <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Dự án nội bộ / chưa công khai liên kết</span>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
