import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ActionCenter from './pages/ActionCenter';
import LeadsList from './pages/LeadsList';
import LeadForm from './pages/LeadForm';
import LeadDetail from './pages/LeadDetail';
import Pipeline from './pages/Pipeline';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated Tenant App Routes */}
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/actions" element={<ActionCenter />} />
            <Route path="/app/leads" element={<LeadsList />} />
            <Route path="/app/leads/new" element={<LeadForm />} />
            <Route path="/app/leads/:id" element={<LeadDetail />} />
            <Route path="/app/leads/:id/edit" element={<LeadForm />} />
            <Route path="/app/pipeline" element={<Pipeline />} />
            <Route path="/app/reports" element={<Reports />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>

          {/* Backward compatibility redirects */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/actions" element={<Navigate to="/app/actions" replace />} />
          <Route path="/leads" element={<Navigate to="/app/leads" replace />} />
          <Route path="/leads/new" element={<Navigate to="/app/leads/new" replace />} />
          <Route path="/leads/:id" element={<Navigate to="/app/leads/:id" replace />} />
          <Route path="/pipeline" element={<Navigate to="/app/pipeline" replace />} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
