import React from 'react';
import { ActiLynqMark } from './ActiLynqLogo';

export default function ActiLynqPreloader({
  message = 'Preparing travel sales console...',
  theme = 'dark',
  fullScreen = true
}) {
  const isDark = theme === 'dark';

  const containerClasses = fullScreen
    ? `min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} flex items-center justify-center p-4 w-full max-w-full fixed inset-0 z-50`
    : `py-12 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} flex items-center justify-center p-4 w-full`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4 text-center max-w-xs mx-auto animate-fade-in">
        {/* Pulsing Aura & Glowing Animated Mark */}
        <div className="relative">
          <div className="absolute -inset-2 bg-teal-400/20 rounded-3xl blur-xl animate-pulse pointer-events-none" />
          <ActiLynqMark size="xl" animated={true} className="relative z-10 shadow-xl shadow-teal-900/30 ring-2 ring-teal-400/30" />
        </div>

        {/* Wordmark & Dynamic Status Message */}
        <div>
          <div className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Acti<span className={isDark ? 'text-teal-400' : 'text-teal-700'}>Lynq</span>
          </div>
          <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {message}
          </p>
        </div>

        {/* Minimal Progress Line Indicator */}
        <div className="w-24 h-1 bg-slate-200/40 rounded-full overflow-hidden mt-1">
          <div className="w-full h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
