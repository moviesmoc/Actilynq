import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../api/client';
import {
  LayoutDashboard,
  Zap,
  Users,
  Kanban,
  Menu,
  Compass
} from 'lucide-react';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [actionCount, setActionCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch pending action count for sidebar & bottom bar badges
  const fetchActionCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/actions');
      if (res.data?.success) {
        setActionCount(res.data.total || (res.data.recommendations ? res.data.recommendations.length : 0));
      }
    } catch (e) {
      // Silently ignore badge error
    }
  };

  useEffect(() => {
    fetchActionCount();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 w-full max-w-full">
        <div className="flex flex-col items-center gap-4 text-center animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-glow-teal">
            <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-wide">Acti<span className="text-teal-400">Lynq</span></div>
            <div className="text-xs text-slate-400 mt-1">Preparing travel sales console...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const BOTTOM_NAV = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/app/actions', label: 'Actions', icon: Zap, hasBadge: true },
    { to: '/app/leads', label: 'Enquiries', icon: Users },
    { to: '/app/pipeline', label: 'Pipeline', icon: Kanban },
  ];

  return (
    <div className="min-h-screen bg-slate-50 w-full relative">
      {/* Sidebar (Desktop Persistent Fixed + Mobile Slide-out Drawer) */}
      <Sidebar
        actionCount={actionCount}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main View Area (offset by fixed sidebar width md:pl-64 on desktop) */}
      <div className="md:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          actionCount={actionCount}
        />

        {/* Content area: extra bottom padding on mobile for bottom navigation bar */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl w-full mx-auto pb-24 md:pb-8 min-w-0">
          <Outlet context={{
            refreshActionCount: () => {
              fetchActionCount();
              setActionCount((c) => Math.max(0, c - 1));
            }
          }} />
        </main>

        {/* Mobile Sticky Bottom Navigation Bar (< 768px) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around w-full max-w-full">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all relative ${
                    isActive
                      ? 'text-teal-700 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
                  {item.hasBadge && actionCount > 0 && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-xs">
                      {actionCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* More / Menu Drawer trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition-all"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
