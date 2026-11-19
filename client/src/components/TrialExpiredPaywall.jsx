import React, { useState } from 'react';
import { Lock, AlertTriangle, Phone, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TrialExpiredPaywall({ business, onRefresh }) {
  const { refreshProfile } = useAuth();
  const [simulating, setSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState('');

  const sponsorPhone = '7359510771';
  const whatsappText = encodeURIComponent(
    `Hi, my ActiLynq 14-day trial has ended for my travel agency "${business?.name || 'Travel Agency'}". I would like to renew and activate my subscription.`
  );
  const whatsappUrl = `https://wa.me/91${sponsorPhone}?text=${whatsappText}`;

  const handleSimulateActive = async () => {
    setSimulating(true);
    setSimMessage('');
    try {
      await api.post('/business/simulate-trial', { daysRemaining: 14 });
      if (refreshProfile) await refreshProfile();
      if (onRefresh) onRefresh();
      setSimMessage('Trial restored to 14 active days!');
    } catch (err) {
      setSimMessage(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 sm:py-16 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 max-w-xl w-full p-6 sm:p-10 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-teal-600" />

        {/* Lock Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock className="w-8 h-8 text-rose-600" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-3 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          14-Day Free Trial Expired
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Your Free Trial Has Ended
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
          Access to customer enquiries, pipeline, and AI Next-Action recommendations is locked for <strong className="text-slate-900 font-semibold">{business?.name || 'your agency'}</strong>.
          <br className="hidden sm:inline" /> All your historical enquiry data is safely preserved.
        </p>

        {/* Renewal & Founder Contact Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-center space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            To Renew Your Plan, Contact Founder Support Directly:
          </div>
          <div className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-teal-600" />
            <span>+91 {sponsorPhone}</span>
          </div>
          <p className="text-xs text-slate-600">
            Reach out on WhatsApp or Call to activate your plan and immediately unlock full access to all your enquiries.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* WhatsApp Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-xs transition-all shadow-sm hover:opacity-95"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:+91${sponsorPhone}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Call +91 {sponsorPhone}</span>
            </a>
          </div>
        </div>

        {/* Only show academic restore toggle for Demo workspaces */}
        {business?.isDemo && (
          <div className="border-t border-slate-200/80 pt-4 text-center">
            <div className="text-[11px] text-slate-400 font-medium mb-2">
              Faculty Demonstration Tool (Visible only on Demo Account)
            </div>
            <button
              type="button"
              onClick={handleSimulateActive}
              disabled={simulating}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-lg border border-teal-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>{simulating ? 'Restoring...' : 'Simulate: Restore 14-Day Active Trial'}</span>
            </button>
            {simMessage && (
              <p className="text-[11px] text-teal-700 font-medium mt-1.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {simMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
