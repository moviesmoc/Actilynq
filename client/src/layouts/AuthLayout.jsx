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
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <ActiLynqLogo
          size="lg"
          theme="light"
          to="/"
          subtitle="Sales action platform for travel agencies"
          className="justify-center"
        />
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div key={location.pathname} className="page-transition bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-sm border border-neutral-200 rounded-xl max-w-full overflow-hidden">
          <Outlet />
        </div>

        {/* Value Proposition bullets */}
        <div className="mt-8 text-center text-xs text-neutral-600 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <span>Rule-based Next-Action Engine with transparent explanations</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <span>Travel-specific lead management and sales workflow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
