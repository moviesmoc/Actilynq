import React, { useId } from 'react';
import { Link } from 'react-router-dom';

/**
 * ActiLynqMark - Concept 1: The "Lynq" Node Compass
 * Interlocking circular data link with an interior 4-point directional navigation star.
 */
export function ActiLynqMark({ size = 'md', className = '', animated = false }) {
  const uniqueId = useId().replace(/:/g, '');

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-14 h-14 rounded-2xl',
    '2xl': 'w-16 h-16 rounded-2xl'
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10'
  };

  const containerClass = sizeClasses[size] || sizeClasses.md;
  const iconClass = iconSizes[size] || iconSizes.md;

  return (
    <div
      className={`${containerClass} bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 flex items-center justify-center shadow-md shadow-teal-900/25 flex-shrink-0 ${className}`}
    >
      <svg
        className={`${iconClass} ${animated ? 'animate-pulse' : ''}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`grad-a-${uniqueId}`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id={`grad-b-${uniqueId}`} x1="28" y1="4" x2="4" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>

        {/* Interlocking Link Outer Ring */}
        <path
          d="M16 4C9.37 4 4 9.37 4 16C4 20.25 6.2 23.98 9.5 26.1L12.2 22.4C10.2 21 8.8 18.66 8.8 16C8.8 12.02 12.02 8.8 16 8.8C19.98 8.8 23.2 12.02 23.2 16C23.2 18.66 21.8 21 19.8 22.4L22.5 26.1C25.8 23.98 28 20.25 28 16C28 9.37 22.63 4 16 4Z"
          fill={`url(#grad-a-${uniqueId})`}
          opacity="0.95"
        />

        {/* 4-Point Directional Compass Core Needle */}
        <polygon
          points="16,7 18.5,13.5 25,16 18.5,18.5 16,25 13.5,18.5 7,16 13.5,13.5"
          fill={`url(#grad-b-${uniqueId})`}
          className={animated ? 'origin-center animate-spin' : ''}
          style={animated ? { animationDuration: '6s', transformOrigin: '16px 16px' } : undefined}
        />

        {/* Center Node */}
        <circle cx="16" cy="16" r="2.2" fill="#ffffff" />
      </svg>
    </div>
  );
}

/**
 * ActiLynqLogo - Full Brand Lockup with Typography & Subtitle
 */
export default function ActiLynqLogo({
  size = 'md',
  theme = 'light',
  subtitle = 'Travel CRM & Co-pilot',
  to = null,
  onClick = null,
  showBadge = false,
  badgeText = 'PRO',
  className = ''
}) {
  const isDark = theme === 'dark';

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs'
  };

  const textSize = textSizes[size] || textSizes.md;
  const subSize = subSizes[size] || subSizes.md;

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <ActiLynqMark size={size} className="group-hover:scale-105 transition-transform duration-200" />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${textSize} font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Acti<span className={isDark ? 'text-teal-400' : 'text-teal-700'}>Lynq</span>
          </span>
          {showBadge && (
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                isDark
                  ? 'bg-teal-950/80 text-teal-300 border-teal-700/60'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <span
            className={`${subSize} font-semibold uppercase tracking-wider mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
