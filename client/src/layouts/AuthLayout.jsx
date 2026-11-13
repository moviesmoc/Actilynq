import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, CheckCircle2 } from 'lucide-react';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-700 text-white shadow-sm mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Acti<span className="text-brand-700">Lynq</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Sales action platform for travel agencies
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-sm border border-neutral-200 rounded-xl max-w-full overflow-hidden">
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
