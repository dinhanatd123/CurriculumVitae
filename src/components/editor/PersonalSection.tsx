import { useRef, type ChangeEvent } from 'react';
import { Upload, Trash2, RotateCcw } from 'lucide-react';
import type { PersonalInfo } from '../../types/cv';
import { SAMPLE_AVATAR_URL } from '../../data/sampleCv';

interface PersonalSectionProps {
  personal: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
  onNotify: (message: string) => void;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';
const LABEL_CLASS = 'block text-xs font-medium text-slate-600 mb-1';

export function PersonalSection({ personal, onChange, onNotify }: PersonalSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
    onChange({ ...personal, [field]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('Vui lòng chọn tệp hình ảnh (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      onNotify('Ảnh quá lớn (tối đa 4MB). Vui lòng chọn ảnh nhẹ hơn để lưu ổn định.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...personal, avatarUrl: reader.result, showAvatar: true });
        onNotify('Đã cập nhật ảnh đại diện.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Avatar Controls */}
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-slate-100">
        <div
          className={`w-16 h-16 shrink-0 overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center ${
            personal.avatarShape === 'circle' ? 'rounded-full' : 'rounded-xl'
          }`}
        >
          {personal.avatarUrl ? (
            <img
              src={personal.avatarUrl}
              alt="Ảnh đại diện hiện tại"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-top ${
                personal.showAvatar ? 'opacity-100' : 'opacity-35 grayscale'
              }`}
            />
          ) : (
            <span className="text-xs font-semibold text-slate-400">Chưa có ảnh</span>
          )}
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-file-upload"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tải ảnh lên</span>
            </button>

            {personal.avatarUrl && (
              <button
                type="button"
                onClick={() => updateField('avatarUrl', '')}
                aria-label="Xóa ảnh đại diện"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Xóa ảnh</span>
              </button>
            )}

            {personal.avatarUrl !== SAMPLE_AVATAR_URL && (
              <button
                type="button"
                onClick={() => onChange({ ...personal, avatarUrl: SAMPLE_AVATAR_URL, showAvatar: true })}
                aria-label="Dùng lại ảnh mẫu"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ảnh mẫu</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={personal.showAvatar}
                onChange={(e) => updateField('showAvatar', e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Hiển thị ảnh trên CV</span>
            </label>

            <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
              <button
                type="button"
                onClick={() => updateField('avatarShape', 'circle')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  personal.avatarShape === 'circle'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Khung tròn
              </button>
              <button
                type="button"
                onClick={() => updateField('avatarShape', 'rounded')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  personal.avatarShape === 'rounded'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bo góc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Identity Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="personal-fullName" className={LABEL_CLASS}>
            Họ và tên
          </label>
          <input
            id="personal-fullName"
            type="text"
            value={personal.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="VD: Nguyễn Minh Khôi"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-jobTitle" className={LABEL_CLASS}>
            Vị trí ứng tuyển
          </label>
          <input
            id="personal-jobTitle"
            type="text"
            value={personal.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            placeholder="VD: Senior Frontend Engineer"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-phone" className={LABEL_CLASS}>
            Số điện thoại
          </label>
          <input
            id="personal-phone"
            type="tel"
            value={personal.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="0912 345 678"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-email" className={LABEL_CLASS}>
            Email
          </label>
          <input
            id="personal-email"
            type="email"
            value={personal.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="ten.ban@email.vn"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-address" className={LABEL_CLASS}>
            Địa chỉ
          </label>
          <input
            id="personal-address"
            type="text"
            value={personal.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Quận 3, TP. Hồ Chí Minh"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-dob" className={LABEL_CLASS}>
            Ngày sinh (tùy chọn)
          </label>
          <input
            id="personal-dob"
            type="text"
            value={personal.dateOfBirth}
            onChange={(e) => updateField('dateOfBirth', e.target.value)}
            placeholder="14/08/1997"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="personal-linkedin" className={LABEL_CLASS}>
            LinkedIn
          </label>
          <input
            id="personal-linkedin"
            type="text"
            value={personal.linkedin}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="linkedin.com/in/..."
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-github" className={LABEL_CLASS}>
            GitHub
          </label>
          <input
            id="personal-github"
            type="text"
            value={personal.github}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="github.com/..."
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="personal-portfolio" className={LABEL_CLASS}>
            Portfolio / Website
          </label>
          <input
            id="personal-portfolio"
            type="text"
            value={personal.portfolio}
            onChange={(e) => updateField('portfolio', e.target.value)}
            placeholder="tenban.dev"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </div>
  );
}
