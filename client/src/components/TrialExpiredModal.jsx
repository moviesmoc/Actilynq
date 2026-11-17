import React, { useState } from 'react';
import { AlertTriangle, Phone, RefreshCw, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TrialExpiredModal({ isOpen, business, onRefresh }) {
  const { refreshProfile } = useAuth();
  const [simulating, setSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState('');

  if (!isOpen) return null;

  const sponsorPhone = '7359510771';
  const whatsappText = encodeURIComponent(
    `Hi, my ActiLynq trial has ended for my travel agency "${business?.name || 'Travel Agency'}". I would like to renew and activate my subscription.`
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 my-auto relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-teal-600" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-2 uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            14-Day Free Trial Expired
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Your Free Evaluation Has Ended
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md leading-relaxed">
            Your agency workspace <strong className="text-slate-900 font-semibold">{business?.name || 'Your Travel Agency'}</strong> has completed its 14-day evaluation period. All your customer enquiries, quotes, and trip itineraries remain safely saved.
          </p>
        </div>

        {/* Sponsor Contact Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 text-center space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Official ActiLynq Sponsor & Support
          </div>
          <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-teal-600" />
            <span>+91 {sponsorPhone}</span>
          </div>
          <p className="text-xs text-slate-600">
            Contact our sponsor directly to renew your subscription and unlock full CRM access.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* WhatsApp Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-xs transition-all shadow-sm hover:opacity-95"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:+91${sponsorPhone}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Call Us Directly</span>
            </a>
          </div>
        </div>

        {/* Faculty Demonstration Controls */}
        <div className="border-t border-slate-200/80 pt-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Academic / Faculty Evaluation Tool</span>
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
      </div>
    </div>
  );
}
