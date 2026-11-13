import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Phone,
  Moon,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Plane,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Compass
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { PRIORITY_CONFIG } from '../utils/constants';
import { createWhatsAppUrl, createTelUrl } from '../utils/whatsapp';

export default function ActionCard({
  action,
  onWhatsAppClick,
  onCallClick,
  onSnoozeClick
}) {
  const [showDraft, setShowDraft] = useState(false);
  const priorityInfo = PRIORITY_CONFIG[action.priority] || PRIORITY_CONFIG.medium;
  const isUrgent = action.priority === 'high' || action.ruleId === 'OVERDUE_CALLBACK';

  const handleWhatsApp = () => {
    const url = createWhatsAppUrl(action.phone, action.suggestedMessage);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    if (onWhatsAppClick) {
      onWhatsAppClick(action);
    }
  };

  const handleCall = () => {
    const url = createTelUrl(action.phone);
    if (url) {
      window.location.href = url;
    }
    if (onCallClick) {
      onCallClick(action);
    }
  };

  return (
    <div className={`relative bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-card-hover group max-w-full ${
      isUrgent
        ? 'border-rose-200/90 hover:border-rose-300'
        : 'border-slate-200/90 hover:border-teal-300'
    }`}>
      {/* Priority Left Indicator Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          isUrgent ? 'bg-gradient-to-b from-rose-500 to-amber-500' : 'bg-gradient-to-b from-teal-500 to-teal-700'
        }`}
      />

      {/* Main Card Content */}
      <div className="pl-3.5 sm:pl-5 pr-3.5 sm:pr-6 py-3.5 sm:py-5 min-w-0">
        {/* Top Header: Customer + Destination + Priority + Stage */}
        <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 xs:gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Link
                to={`/app/leads/${action.leadId}`}
                className="text-sm sm:text-base font-bold text-slate-900 hover:text-teal-700 transition-colors flex items-center gap-1.5 group-hover:underline max-w-full"
              >
                <span className="truncate">{action.customerName}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-teal-600 transition-opacity flex-shrink-0" />
              </Link>

              {/* Destination Tag */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Plane className="w-3 h-3 text-teal-600 -rotate-45 flex-shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[140px]">{action.destination || 'Destination TBD'}</span>
              </span>

              {action.travellerCount !== null && action.travellerCount !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600">
                  <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span>{action.travellerCount} pax</span>
                </span>
              )}
            </div>

            {/* Timing & Due badge */}
            {action.dueText && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mt-1">
                <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${isUrgent ? 'text-rose-500' : 'text-slate-400'}`} />
                <span className={isUrgent ? 'text-rose-700 font-semibold' : ''}>
                  {action.dueText}
                </span>
              </div>
            )}
          </div>

          {/* Right Badges */}
          <div className="flex items-center gap-1.5 flex-wrap xs:flex-nowrap flex-shrink-0 self-start xs:self-auto">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold ${priorityInfo.badgeClass}`}>
              {isUrgent && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />}
              <span>{priorityInfo.label}</span>
            </span>
            <StatusBadge stage={action.stage} size="sm" />
          </div>
        </div>

        {/* Action Title & Co-pilot Rationale */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 inline-flex items-center gap-1">
              <Compass className="w-3 h-3 text-teal-600 flex-shrink-0" />
              <span>Recommended Travel Action</span>
            </span>
          </div>

          <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 mt-1">
            {action.actionTitle}
          </h3>

          {/* Intelligent Dispatch Explanation Box */}
          <div className="mt-2 p-2.5 sm:p-3.5 rounded-xl bg-gradient-to-r from-slate-50 to-teal-50/40 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[9px]">
                i
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900">Why now: </span>
                <span>{action.explanation}</span>
              </div>
            </div>

            {/* Optional suggested WhatsApp message toggle */}
            {action.suggestedMessage && (
              <div className="mt-2 pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setShowDraft(!showDraft)}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{showDraft ? 'Hide prefilled WhatsApp message' : 'Preview prefilled WhatsApp message'}</span>
                  {showDraft ? <ChevronUp className="w-3 h-3 flex-shrink-0" /> : <ChevronDown className="w-3 h-3 flex-shrink-0" />}
                </button>

                {showDraft && (
                  <div className="mt-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs font-mono text-emerald-950 whitespace-pre-wrap break-words animate-fadeIn">
                    {action.suggestedMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Toolbar (Mobile Responsive) */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1 min-w-0">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-xs hover:shadow transition-all active:scale-[0.97]"
              title="Open WhatsApp with prefilled message"
            >
              <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCall}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all active:scale-[0.97]"
              title="Open Phone dialler"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Call</span>
            </button>

            {action.isSnoozable && (
              <button
                type="button"
                onClick={() => onSnoozeClick && onSnoozeClick(action)}
                className="inline-flex items-center justify-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Snooze this recommendation"
              >
                <Moon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xs:inline">Snooze</span>
              </button>
            )}
          </div>

          <Link
            to={`/app/leads/${action.leadId}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors ml-auto flex-shrink-0"
          >
            <span>View Enquiry</span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
