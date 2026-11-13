import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, ShieldCheck, Menu } from 'lucide-react';

export default function Navbar({ onToggleMobileMenu, actionCount = 0 }) {
  const { user, business } = useAuth();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 w-full max-w-full overflow-hidden">
      {/* Left: Mobile hamburger + Agency info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs flex-shrink-0">
          <Building2 className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">{business?.name || 'Travel Agency'}</span>
            {business?.isDemo && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-full flex-shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-600" />
                <span className="hidden xs:inline">Demo</span>
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-teal-700 bg-teal-50 px-1 rounded">
              {business?.currency || 'INR'}
            </span>
            <span className="hidden sm:inline text-slate-400">• Sales Co-pilot Active</span>
          </div>
        </div>
      </div>

      {/* Right: User identity & Status */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Next-action pulse badge on mobile */}
        {actionCount > 0 && (
          <div className="md:hidden inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>{actionCount}</span>
          </div>
        )}

        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-700">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AG'}
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-bold text-slate-900">{user?.name || 'Travel Agent'}</div>
          <div className="text-[10px] text-slate-500 capitalize">{user?.role || 'Sales Lead'}</div>
        </div>
      </div>
    </header>
  );
}
