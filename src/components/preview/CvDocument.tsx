import type { CvData, CvSettings, DensityId, FontFamilyId } from '../../types/cv';
import { CV_LABELS } from '../../data/i18n';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';

interface CvDocumentProps {
  data: CvData;
  settings: CvSettings;
}

const FONT_CLASS_MAP: Record<FontFamilyId, string> = {
  'be-vietnam': 'cv-font-be-vietnam',
  inter: 'cv-font-inter',
  merriweather: 'cv-font-merriweather',
};

const DENSITY_MAP: Record<
  DensityId,
  {
    pagePad: string;
    sectionGap: string;
    itemGap: string;
    bodyText: string;
    smallText: string;
    headingText: string;
    nameText: string;
    titleText: string;
    lineHeight: string;
  }
> = {
  compact: {
    pagePad: 'p-6',
    sectionGap: 'space-y-3.5',
    itemGap: 'space-y-2.5',
    bodyText: 'text-[11.5px]',
    smallText: 'text-[10.5px]',
    headingText: 'text-[11.5px]',
    nameText: 'text-[22px]',
    titleText: 'text-[13px]',
    lineHeight: 'leading-[1.42]',
  },
  standard: {
    pagePad: 'p-7',
    sectionGap: 'space-y-4',
    itemGap: 'space-y-3',
    bodyText: 'text-[12px]',
    smallText: 'text-[11px]',
    headingText: 'text-[12px]',
    nameText: 'text-[24px]',
    titleText: 'text-[13.5px]',
    lineHeight: 'leading-[1.48]',
  },
  spacious: {
    pagePad: 'p-10',
    sectionGap: 'space-y-6',
    itemGap: 'space-y-4.5',
    bodyText: 'text-[13.5px]',
    smallText: 'text-[12px]',
    headingText: 'text-[13px]',
    nameText: 'text-[28px]',
    titleText: 'text-[15px]',
    lineHeight: 'leading-[1.62]',
  },
};

export function CvDocument({ data, settings }: CvDocumentProps) {
  const labels = CV_LABELS[settings.language];
  const fontClass = FONT_CLASS_MAP[settings.fontFamily];
  const densityScale = DENSITY_MAP[settings.density];

  return (
    <div className={fontClass} data-template={settings.template} data-language={settings.language}>
      {settings.template === 'modern' && (
        <ModernTemplate data={data} settings={settings} labels={labels} densityScale={densityScale} />
      )}
      {settings.template === 'classic' && (
        <ClassicTemplate data={data} settings={settings} labels={labels} densityScale={densityScale} />
      )}
      {settings.template === 'executive' && (
        <ExecutiveTemplate data={data} settings={settings} labels={labels} densityScale={densityScale} />
      )}
    </div>
  );
}
