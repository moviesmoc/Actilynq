import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ActiLynqLogo from '../components/ActiLynqLogo';
import ActiLynqPreloader from '../components/ActiLynqPreloader';
import { CheckCircle2 } from 'lucide-react';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ActiLynqPreloader message="Verifying session..." theme="light" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <ActiLynqLogo
          size="lg"
          theme="light"
          layout="vertical"
          to="/"
          subtitle="Travel CRM &bull; Next-Action Co-pilot"
          className="mx-auto"
        />
      </div>

      <div className="mt-5 sm:mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div key={location.pathname} className="bg-white py-5 px-4 sm:py-8 sm:px-8 shadow-sm border border-slate-200/90 rounded-2xl max-w-full overflow-hidden">
          <Outlet />
        </div>

        {/* Value Proposition bullets */}
        <div className="mt-6 sm:mt-8 max-w-sm mx-auto text-xs text-slate-500 space-y-2 px-2">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">Rule-based Next-Action Engine with transparent explanations</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">Travel-specific lead management and sales workflow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
