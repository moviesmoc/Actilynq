import React, { useState } from 'react';
import { Phone, Clock, AlertTriangle, ChevronRight, X, Sparkles } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TrialStatusBar({ business, onRefresh }) {
  const { refreshProfile } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [toggling, setToggling] = useState(false);

  if (!business || dismissed) return null;

  const sponsorPhone = '7359510771';
  const isExpired = Boolean(business.isTrialExpired);
  const daysRemaining = business.daysRemaining ?? 14;

  const whatsappText = encodeURIComponent(
    `Hi, I am contacting you regarding my ActiLynq travel CRM subscription for "${business?.name || 'Travel Agency'}".`
  );
  const whatsappUrl = `https://wa.me/91${sponsorPhone}?text=${whatsappText}`;

  const handleToggleExpiry = async () => {
    setToggling(true);
    try {
      await api.post('/business/simulate-trial', { expireNow: !isExpired, daysRemaining: isExpired ? 14 : 0 });
      if (refreshProfile) await refreshProfile();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to toggle trial simulation:', err);
    } finally {
      setToggling(false);
    }
  };

  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white px-3 sm:px-6 py-2 text-xs font-medium shadow-sm flex flex-wrap items-center justify-between gap-2 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span className="font-bold">14-Day Free Trial Expired:</span>
          <span className="truncate">Your workspace evaluation has ended. Please renew to continue closing travel deals.</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-2xs text-[11px]"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Sponsor</span>
          </a>
          <a
            href={`tel:+91${sponsorPhone}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/60 hover:bg-slate-900 text-white font-bold transition-colors text-[11px]"
          >
            <Phone className="w-3 h-3 text-teal-300" />
            <span>Call {sponsorPhone}</span>
          </a>
          <button
            type="button"
            onClick={handleToggleExpiry}
            disabled={toggling}
            className="text-[10px] text-amber-200 underline hover:text-white ml-1"
            title="Faculty Demo Switcher"
          >
            {toggling ? '...' : '[Demo: Restore 14d]'}
          </button>
        </div>
      </div>
    );
  }

  // Active trial bar
  return (
    <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-slate-200 px-3 sm:px-6 py-1.5 text-xs font-medium border-b border-teal-800/40 flex flex-wrap items-center justify-between gap-2 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
        <span className="font-bold text-teal-300">14-Day Free Evaluation Trial:</span>
        <span className="text-slate-300">
          <strong className="text-white font-semibold">{daysRemaining} days remaining</strong> for {business.name}
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>WhatsApp Us</span>
        </a>
        <span className="text-slate-600">•</span>
        <a
          href={`tel:+91${sponsorPhone}`}
          className="inline-flex items-center gap-1 text-[11px] text-teal-300 hover:text-teal-200 transition-colors font-semibold"
        >
          <Phone className="w-3 h-3" />
          <span>Call: {sponsorPhone}</span>
        </a>
        <button
          type="button"
          onClick={handleToggleExpiry}
          disabled={toggling}
          className="text-[10px] text-slate-400 hover:text-amber-300 ml-1 transition-colors"
          title="Simulate what faculty sees when trial expires"
        >
          {toggling ? '...' : '[Demo: Test Expiry]'}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors ml-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
