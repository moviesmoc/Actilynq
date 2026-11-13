import React from 'react';
import { STAGE_CONFIG } from '../utils/constants';

export default function StatusBadge({ stage, size = 'sm' }) {
  const config = STAGE_CONFIG[stage] || {
    label: stage || 'Unknown',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400'
  };

  const sizeClasses = size === 'xs'
    ? 'text-xs px-2 py-0.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.badgeClass} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}></span>
      <span>{config.label}</span>
    </span>
  );
}
