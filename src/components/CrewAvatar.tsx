import React, { useState } from 'react';
import { getCrewAvatarUrl } from '../utils/crewAvatars';

interface CrewAvatarProps {
  crew: {
    id?: string;
    name: string;
    avatarUrl?: string;
    department?: string;
    role?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackBorderColor?: string;
}

export const CrewAvatar: React.FC<CrewAvatarProps> = ({
  crew,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const avatarUrl = getCrewAvatarUrl(crew);

  const sizeClasses = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
  }[size] || 'w-9 h-9 rounded-xl';

  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-glass-border)] shrink-0 flex items-center justify-center ${sizeClasses} ${className}`}
    >
      {!hasError && avatarUrl ? (
        <img
          src={avatarUrl}
          alt={crew.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="font-extrabold text-[var(--text-main)] text-xs select-none">
          {crew.name.charAt(0)}
        </span>
      )}
    </div>
  );
};
