import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Users,
  Kanban,
  BarChart3,
  Settings,
  PlusCircle,
  Compass,
  LogOut,
  X,
  ShieldCheck,
  Plane
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/app/actions', label: 'Action Center', icon: Zap, hasBadge: true },
  { to: '/app/leads', label: 'Enquiries', icon: Users },
  { to: '/app/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ actionCount = 0, isOpen = false, onClose }) {
  const { logout, business, user } = useAuth();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40">
        <Link
          to="/app"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1">
              <span>Acti<span className="text-teal-400">Lynq</span></span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">PRO</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase flex items-center gap-1">
              <Plane className="w-2.5 h-2.5 text-teal-400 inline" />
              <span>Travel Sales Action</span>
            </div>
          </div>
        </Link>

        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Action Dispatch Button */}
      <div className="p-3.5">
        <Link
          to="/app/leads/new"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-lg shadow-sm hover:shadow-glow-teal transition-all duration-200 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>New Travel Enquiry</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Sales Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400 pl-2.5 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 flex-shrink-0 transition-colors group-hover:text-teal-400" />
                <span>{item.label}</span>
              </div>
              {item.hasBadge && actionCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  {actionCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Workspace Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/30 space-y-2">
        {business && (
          <div className="px-2.5 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agency Workspace</span>
              {business.isDemo && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Demo
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-white truncate mt-0.5">
              {business.name}
            </p>
            <p className="text-[10px] text-teal-400 font-medium">
              Currency: {business.currency || 'INR'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400">
          <span className="truncate">{user?.name || 'Agent'}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 px-2 py-1 rounded transition-colors"
            title="Sign out of ActiLynq"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 min-h-screen sticky top-0 h-screen z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer (Slide-out Sheet) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Pane */}
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-2xl animate-slide-up">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
