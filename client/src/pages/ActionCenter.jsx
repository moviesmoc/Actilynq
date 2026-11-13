import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Zap,
  Info,
  Filter,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Clock,
  Compass,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import ActionCard from '../components/ActionCard';
import WhatsAppConfirmModal from '../components/WhatsAppConfirmModal';
import CallOutcomeModal from '../components/CallOutcomeModal';
import SnoozeModal from '../components/SnoozeModal';

export default function ActionCenter() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [showEngineInfo, setShowEngineInfo] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const { refreshActionCount } = useOutletContext() || {};

  const fetchActionQueue = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/actions');
      if (res.data?.success) {
        setRecommendations(res.data.recommendations || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionQueue();
  }, []);

  const handleActionComplete = () => {
    fetchActionQueue();
    if (refreshActionCount) refreshActionCount();
  };

  // Filter recommendations
  const filteredList = recommendations.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'HIGH') return item.priority === 'high';
    if (selectedFilter === 'QUOTATION') return item.ruleId === 'QUOTATION_FOLLOW_UP' || item.ruleId === 'QUOTATION_PREPARATION';
    if (selectedFilter === 'CALLBACK') return item.ruleId === 'OVERDUE_CALLBACK';
    if (selectedFilter === 'REQUIREMENTS') return item.ruleId === 'MISSING_REQUIREMENTS';
    return item.ruleId === selectedFilter;
  });

  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
  const quoteActionCount = recommendations.filter(r => r.ruleId === 'QUOTATION_FOLLOW_UP' || r.ruleId === 'QUOTATION_PREPARATION').length;
  const callbackCount = recommendations.filter(r => r.ruleId === 'OVERDUE_CALLBACK').length;

  const filterOptions = [
    { id: 'ALL', label: 'All Actions', count: recommendations.length },
    { id: 'HIGH', label: 'High Priority', count: highPriorityCount, highlight: highPriorityCount > 0 },
    { id: 'CALLBACK', label: 'Callbacks', count: callbackCount },
    { id: 'QUOTATION', label: 'Quotations', count: quoteActionCount },
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-slate-200/80 rounded-2xl" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-slate-200/80 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200/80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Engine Beacon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-2xs">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Action Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>Engine Active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prioritized next steps determined by travel sales stages, quotation ages, and confirmed contact history.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowEngineInfo(!showEngineInfo)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>How it works</span>
            {showEngineInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={fetchActionQueue}
            className="btn-secondary btn-sm"
            title="Recalculate and refresh actions"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Expandable Next-Action Engine Rules Explainer */}
      {showEngineInfo && (
        <div className="p-4 sm:p-5 bg-gradient-to-br from-teal-50/70 via-white to-blue-50/50 border border-teal-200/90 rounded-2xl text-xs text-slate-700 space-y-3 animate-slide-up shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Transparent Next-Action Rules Architecture
            </h3>
            <span className="text-[10px] font-mono text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded">
              Deterministic Logic
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            ActiLynq evaluates every active enquiry against 5 deterministic rules in strict precedence order. At most <strong>one highest-priority recommendation</strong> is surfaced per lead:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <div className="font-bold text-rose-800 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Rule 1: Overdue Callback
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Scheduled callback timestamp has elapsed without confirmed contact.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <div className="font-bold text-rose-800 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Rule 2: Quotation Follow-up
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Quote sent &ge; 2 days ago with no qualifying customer contact since.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <div className="font-bold text-amber-800 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Rule 3: Missing Requirements
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Destination, dates, or passenger count missing on early-stage enquiries.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
              <div className="font-bold text-amber-800 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Rule 4: Quotation Preparation
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Specs collected but package quotation has not yet been prepared.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs sm:col-span-2 lg:col-span-1">
              <div className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Rule 5: Inactive Enquiry
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">No logged activity of any kind for &ge; 7 days on an open enquiry.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-rose-900">Failed to fetch recommendations</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Touch-Friendly Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full max-w-full min-w-0 custom-scroll">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0 hidden xs:inline" />
        <div className="flex gap-1.5 sm:gap-2 flex-nowrap sm:flex-wrap min-w-min">
          {filterOptions.map((opt) => {
            const isSelected = selectedFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-slate-800 text-teal-300'
                      : opt.highlight
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations Feed */}
      {filteredList.length === 0 ? (
        <div className="p-10 sm:p-14 bg-white border border-slate-200/90 rounded-2xl text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All caught up!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {selectedFilter !== 'ALL'
              ? 'No recommendations match this specific filter. Switch to "All Actions" to see the full queue.'
              : 'Every open enquiry has been attended to according to the Next-Action Engine.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link to="/app/leads/new" className="btn-primary btn-sm">
              Create New Enquiry
            </Link>
            <Link to="/app/pipeline" className="btn-secondary btn-sm">
              View Sales Pipeline
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((action) => (
            <ActionCard
              key={action.leadId}
              action={action}
              onWhatsAppClick={() => {
                setSelectedAction(action);
                setActiveModal('whatsapp');
              }}
              onCallClick={() => {
                setSelectedAction(action);
                setActiveModal('call');
              }}
              onSnoozeClick={(act) => {
                setSelectedAction(act || action);
                setActiveModal('snooze');
              }}
            />
          ))}
        </div>
      )}

      {/* Modals for 2-step verification and snoozing */}
      {activeModal === 'whatsapp' && selectedAction && (
        <WhatsAppConfirmModal
          isOpen={true}
          action={selectedAction}
          lead={selectedAction}
          onClose={() => {
            setActiveModal(null);
            setSelectedAction(null);
          }}
          onConfirm={() => {
            handleActionComplete();
            setActiveModal(null);
            setSelectedAction(null);
          }}
        />
      )}

      {activeModal === 'call' && selectedAction && (
        <CallOutcomeModal
          isOpen={true}
          action={selectedAction}
          lead={selectedAction}
          onClose={() => {
            setActiveModal(null);
            setSelectedAction(null);
          }}
          onConfirm={() => {
            handleActionComplete();
            setActiveModal(null);
            setSelectedAction(null);
          }}
        />
      )}

      {activeModal === 'snooze' && selectedAction && (
        <SnoozeModal
          isOpen={true}
          action={selectedAction}
          recommendation={selectedAction}
          onClose={() => {
            setActiveModal(null);
            setSelectedAction(null);
          }}
          onConfirm={() => {
            handleActionComplete();
            setActiveModal(null);
            setSelectedAction(null);
          }}
        />
      )}
    </div>
  );
}
