import { useState, useEffect } from 'react';
import type { AvatarShape } from '../../types/cv';

interface CvAvatarProps {
  src: string;
  fullName: string;
  shape: AvatarShape;
  sizeClass: string;
  accentColor: string;
  contrastInk: string;
  ringClass?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function CvAvatar({
  src,
  fullName,
  shape,
  sizeClass,
  accentColor,
  contrastInk,
  ringClass = '',
}: CvAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  if (!src || hasError) {
    return (
      <div
        className={`${sizeClass} ${shapeClass} ${ringClass} flex shrink-0 items-center justify-center font-semibold tracking-tight select-none`}
        style={{ backgroundColor: accentColor, color: contrastInk }}
        aria-label={`Ảnh đại diện ${fullName || 'ứng viên'}`}
      >
        <span className="text-xl">{getInitials(fullName)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Ảnh chân dung ${fullName || 'ứng viên'}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${sizeClass} ${shapeClass} ${ringClass} shrink-0 object-cover object-top bg-slate-200`}
    />
  );
}
