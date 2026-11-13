import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Kanban,
  AlertCircle,
  RefreshCw,
  Users,
  MapPin,
  Calendar,
  Plane,
  Clock,
  Sparkles,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import api from '../api/client';
import { STAGES, STAGE_CONFIG } from '../utils/constants';
import { formatCurrency, formatRelativeTime, formatDate } from '../utils/formatters';

export default function Pipeline() {
  const [leads, setLeads] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMobileStage, setActiveMobileStage] = useState('ALL');

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/leads?limit=1000');
      if (res.data?.success) {
        // Group leads by stage
        const grouped = {};
        Object.values(STAGES).forEach((stage) => {
          grouped[stage] = [];
        });

        res.data.leads.forEach((lead) => {
          if (grouped[lead.stage]) {
            grouped[lead.stage].push(lead);
          }
        });

        setLeads(grouped);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const stageOrder = [
    STAGES.NEW_ENQUIRY,
    STAGES.CONTACTED,
    STAGES.REQUIREMENTS_COLLECTED,
    STAGES.PACKAGE_PREPARATION,
    STAGES.QUOTATION_SENT,
    STAGES.FOLLOW_UP,
    STAGES.NEGOTIATION,
    STAGES.BOOKING_CONFIRMED,
    STAGES.LOST
  ];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-slate-200/80 rounded-xl" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-72 flex-shrink-0 space-y-3">
              <div className="h-10 bg-slate-200/80 rounded-lg" />
              <div className="h-32 bg-slate-200/80 rounded-xl" />
              <div className="h-32 bg-slate-200/80 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxStageCount = Math.max(1, ...Object.values(leads).map((s) => s.length));

  // Determine visible stages based on mobile filter
  const visibleStages = activeMobileStage === 'ALL'
    ? stageOrder
    : stageOrder.filter((s) => s === activeMobileStage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sales Pipeline
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Kanban Board
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize customer enquiries as they progress through travel qualification, quotation, and confirmation.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPipeline}
          className="btn-secondary btn-sm self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-rose-900">Error loading pipeline</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Mobile Stage Selector Tabs (< 1024px) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveMobileStage('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeMobileStage === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Stages ({Object.values(leads).reduce((a, b) => a + b.length, 0)})
        </button>

        {stageOrder.map((stage) => {
          const config = STAGE_CONFIG[stage];
          const count = leads[stage]?.length || 0;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveMobileStage(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                activeMobileStage === stage
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{config.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeMobileStage === stage ? 'bg-teal-800 text-teal-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Kanban Track */}
      <div className="overflow-x-auto pb-4 pt-1 snap-x snap-mandatory">
        <div className="flex gap-4 min-w-min">
          {visibleStages.map((stage) => {
            const config = STAGE_CONFIG[stage];
            const stageLeads = leads[stage] || [];
            const pct = Math.min(100, Math.round((stageLeads.length / maxStageCount) * 100));

            return (
              <div
                key={stage}
                className="flex-shrink-0 w-72 sm:w-80 bg-slate-100/70 p-3 rounded-2xl border border-slate-200/90 snap-start flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Stage Header */}
                <div className="mb-3 px-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {config.label}
                      </h3>
                    </div>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-white text-slate-700 shadow-2xs border border-slate-200">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Stage count bar */}
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${config.dotClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Lead Cards in Stage Column */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scroll">
                  {stageLeads.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center bg-white/40">
                      <p className="text-xs text-slate-400">No enquiries in this stage</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <Link
                        key={lead._id}
                        to={`/app/leads/${lead._id}`}
                        className="block p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:shadow-card-hover hover:border-teal-400/60 transition-all group"
                      >
                        {/* Customer Name */}
                        <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition-colors flex items-center justify-between mb-1.5">
                          <span className="truncate">{lead.customerName}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors flex-shrink-0" />
                        </div>

                        {/* Destination & Pax Badge */}
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Plane className="w-3 h-3 text-teal-600 -rotate-45 flex-shrink-0" />
                            <span className="truncate">{lead.destination || <em className="text-slate-400">Destination TBD</em>}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            {lead.travellerCount ? (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span>{lead.travellerCount} pax</span>
                              </span>
                            ) : (
                              <span>Flexible pax</span>
                            )}

                            {lead.travelStartDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{formatDate(lead.travelStartDate)}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Commercials / Value */}
                        {(lead.quotationAmount || lead.estimatedValue) && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-slate-400 font-medium uppercase">Value:</span>
                            <span className="font-bold text-slate-900">
                              {formatCurrency(lead.quotationAmount || lead.estimatedValue, lead.budgetCurrency)}
                            </span>
                          </div>
                        )}

                        {/* Time since last activity */}
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatRelativeTime(lead.lastActivityAt)}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
