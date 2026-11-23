import { useState } from 'react';
import type {
  CvData,
  CvSettings,
  EditorSectionKey,
  SectionVisibility,
} from '../../types/cv';
import { AccordionSection } from './AccordionSection';
import { PersonalSection } from './PersonalSection';
import { ExperienceSection } from './ExperienceSection';
import { ProjectsSection, EducationSection } from './ProjectsEducationSection';
import { SkillsSection, CertificatesSection } from './SkillsCertificatesSection';
import { ExtrasSection } from './ExtrasSection';

interface EditorPanelProps {
  data: CvData;
  settings: CvSettings;
  onChangeData: (updater: (prev: CvData) => CvData) => void;
  onChangeSettings: (patch: Partial<CvSettings>) => void;
  onNotify: (message: string) => void;
}

const SECTION_TABS: { key: EditorSectionKey; label: string }[] = [
  { key: 'personal', label: 'Cá nhân' },
  { key: 'summary', label: 'Mục tiêu' },
  { key: 'experience', label: 'Kinh nghiệm' },
  { key: 'projects', label: 'Dự án' },
  { key: 'education', label: 'Học vấn' },
  { key: 'skills', label: 'Kỹ năng' },
  { key: 'certificates', label: 'Chứng chỉ' },
  { key: 'extras', label: 'Mục thêm' },
];

export function EditorPanel({
  data,
  settings,
  onChangeData,
  onChangeSettings,
  onNotify,
}: EditorPanelProps) {
  const [openSections, setOpenSections] = useState<Record<EditorSectionKey, boolean>>({
    personal: true,
    summary: false,
    experience: true,
    projects: false,
    education: false,
    skills: false,
    certificates: false,
    extras: false,
  });

  const toggleOpen = (key: EditorSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const jumpToSection = (key: EditorSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: true }));
    requestAnimationFrame(() => {
      const target = document.getElementById(`section-heading-${key}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleVisibility = (key: keyof SectionVisibility) => {
    onChangeData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: !prev.visibility[key],
      },
    }));
  };

  const activeExtrasCount = [
    data.visibility.languages,
    data.visibility.activities,
    data.visibility.references,
  ].filter(Boolean).length;

  return (
    <aside
      aria-label="Trình chỉnh sửa nội dung CV"
      className="flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden"
    >
      {/* Quick Section Jump Strip */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 overflow-x-auto studio-scroll shrink-0">
        {SECTION_TABS.map((tab) => {
          const isOpen = openSections[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => jumpToSection(tab.key)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                isOpen
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Accordion List */}
      <div className="flex-1 overflow-y-auto studio-scroll">
        <AccordionSection
          id="personal"
          title="1. Thông tin cá nhân"
          isOpen={openSections.personal}
          onToggleOpen={() => toggleOpen('personal')}
        >
          <PersonalSection
            personal={data.personal}
            onChange={(personal) => onChangeData((prev) => ({ ...prev, personal }))}
            onNotify={onNotify}
          />
        </AccordionSection>

        <AccordionSection
          id="summary"
          title="2. Tóm tắt / Mục tiêu nghề nghiệp"
          isOpen={openSections.summary}
          onToggleOpen={() => toggleOpen('summary')}
          visible={data.visibility.summary}
          onToggleVisible={() => toggleVisibility('summary')}
        >
          <div>
            <label htmlFor="cv-summary-input" className="block text-xs font-medium text-slate-600 mb-1.5">
              Đoạn giới thiệu ngắn gọn (3–4 dòng thể hiện thế mạnh & định hướng)
            </label>
            <textarea
              id="cv-summary-input"
              rows={4}
              value={data.summary}
              onChange={(e) => onChangeData((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Tóm tắt số năm kinh nghiệm, chuyên môn cốt lõi và giá trị bạn mang lại..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-y"
            />
          </div>
        </AccordionSection>

        <AccordionSection
          id="experience"
          title="3. Kinh nghiệm làm việc"
          subtitle={`${data.experience.length} mục`}
          isOpen={openSections.experience}
          onToggleOpen={() => toggleOpen('experience')}
          visible={data.visibility.experience}
          onToggleVisible={() => toggleVisibility('experience')}
        >
          <ExperienceSection
            items={data.experience}
            onChange={(experience) => onChangeData((prev) => ({ ...prev, experience }))}
          />
        </AccordionSection>

        <AccordionSection
          id="projects"
          title="4. Dự án tiêu biểu"
          subtitle={`${data.projects.length} mục`}
          isOpen={openSections.projects}
          onToggleOpen={() => toggleOpen('projects')}
          visible={data.visibility.projects}
          onToggleVisible={() => toggleVisibility('projects')}
        >
          <ProjectsSection
            items={data.projects}
            onChange={(projects) => onChangeData((prev) => ({ ...prev, projects }))}
          />
        </AccordionSection>

        <AccordionSection
          id="education"
          title="5. Học vấn"
          subtitle={`${data.education.length} mục`}
          isOpen={openSections.education}
          onToggleOpen={() => toggleOpen('education')}
          visible={data.visibility.education}
          onToggleVisible={() => toggleVisibility('education')}
        >
          <EducationSection
            items={data.education}
            onChange={(education) => onChangeData((prev) => ({ ...prev, education }))}
          />
        </AccordionSection>

        <AccordionSection
          id="skills"
          title="6. Kỹ năng"
          subtitle={`${data.skills.length} nhóm`}
          isOpen={openSections.skills}
          onToggleOpen={() => toggleOpen('skills')}
          visible={data.visibility.skills}
          onToggleVisible={() => toggleVisibility('skills')}
        >
          <SkillsSection
            groups={data.skills}
            displayMode={settings.skillDisplayMode}
            onChangeGroups={(skills) => onChangeData((prev) => ({ ...prev, skills }))}
            onChangeDisplayMode={(skillDisplayMode) => onChangeSettings({ skillDisplayMode })}
          />
        </AccordionSection>

        <AccordionSection
          id="certificates"
          title="7. Chứng chỉ & Giải thưởng"
          subtitle={`${data.certificates.length} mục`}
          isOpen={openSections.certificates}
          onToggleOpen={() => toggleOpen('certificates')}
          visible={data.visibility.certificates}
          onToggleVisible={() => toggleVisibility('certificates')}
        >
          <CertificatesSection
            items={data.certificates}
            onChange={(certificates) => onChangeData((prev) => ({ ...prev, certificates }))}
          />
        </AccordionSection>

        <AccordionSection
          id="extras"
          title="8. Ngoại ngữ, Hoạt động & Tham chiếu"
          subtitle={`${activeExtrasCount}/3 đang hiện`}
          isOpen={openSections.extras}
          onToggleOpen={() => toggleOpen('extras')}
        >
          <ExtrasSection
            languages={data.languages}
            activities={data.activities}
            references={data.references}
            visibility={data.visibility}
            onChangeLanguages={(languages) => onChangeData((prev) => ({ ...prev, languages }))}
            onChangeActivities={(activities) => onChangeData((prev) => ({ ...prev, activities }))}
            onChangeReferences={(references) => onChangeData((prev) => ({ ...prev, references }))}
            onToggleVisibility={(key) => toggleVisibility(key)}
          />
        </AccordionSection>
      </div>
    </aside>
  );
}
