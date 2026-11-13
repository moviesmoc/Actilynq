import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  Zap,
  ArrowRight,
  RefreshCw,
  Activity,
  PlusCircle,
  Compass,
  Phone,
  MessageCircle,
  Plane,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import ActionCard from '../components/ActionCard';
import StatusBadge from '../components/StatusBadge';
import WhatsAppConfirmModal from '../components/WhatsAppConfirmModal';
import CallOutcomeModal from '../components/CallOutcomeModal';
import SnoozeModal from '../components/SnoozeModal';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard/summary');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse max-w-full">
        <div className="h-20 bg-slate-200/80 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 sm:h-28 bg-slate-200/80 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200/80 rounded-xl" />
          <div className="h-64 bg-slate-200/80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 max-w-full">
        <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-rose-900 text-sm sm:text-base">Unable to load dashboard</h3>
          <p className="text-xs text-rose-800 mt-1">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const summary = data?.summary || data || {};
  const priorityActions = data?.urgentRecommendations || (Array.isArray(data?.actionsRequiringAttention) ? data.actionsRequiringAttention : []);
  const stageItems = Array.isArray(data?.stageBreakdown)
    ? data.stageBreakdown
    : (data?.stageBreakdown ? Object.entries(data.stageBreakdown).map(([stage, count]) => ({ stage, count })) : []);

  const totalLeadsInBreakdown = stageItems.reduce((acc, item) => acc + (item.count || 0), 0) || 1;

  // Helper for activity icons
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-blue-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'quotation':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case 'booking':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in max-w-full">
      {/* Hero Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-4 sm:p-6 rounded-2xl text-white shadow-md relative overflow-hidden max-w-full">
        {/* Subtle background decorative shapes */}
        <div className="absolute -right-6 -bottom-8 w-44 h-44 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-10 w-36 h-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 min-w-0">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping flex-shrink-0" />
            <span>Next-Action Engine Active</span>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Agent'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            You have <strong className="text-teal-300 font-bold">{priorityActions.length} prioritized actions</strong> needing your attention today across the travel sales pipeline.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <Link
            to="/app/leads/new"
            className="btn-primary text-xs font-bold py-2 px-3 sm:px-3.5 shadow-sm hover:shadow-glow-teal flex-1 sm:flex-none justify-center"
          >
            <PlusCircle className="w-4 h-4 flex-shrink-0" />
            <span>New Travel Enquiry</span>
          </Link>
          <Link
            to="/app/actions"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors flex-1 sm:flex-none"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Action Queue</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 max-w-full">
        {/* Active Enquiries */}
        <div className="interactive-card p-3 sm:p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Active Enquiries</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
            {summary.totalOpen ?? 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="truncate">Open & progressing</span>
          </div>
        </div>

        {/* Quotations Sent */}
        <div className="interactive-card p-3 sm:p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Quotes Sent</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
            {summary.quotationsSent ?? 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="truncate">Awaiting decision</span>
          </div>
        </div>

        {/* Confirmed Won */}
        <div className="interactive-card p-3 sm:p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Won Bookings</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {summary.confirmedWon ?? 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Completed tours</span>
          </div>
        </div>

        {/* Overdue Callbacks */}
        <div className="interactive-card p-3 sm:p-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-600" />
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Overdue Tasks</span>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${summary.overdueCallbacks > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${summary.overdueCallbacks > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {summary.overdueCallbacks ?? 0}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${summary.overdueCallbacks > 0 ? 'bg-rose-500' : 'bg-slate-400'}`} />
            <span className="truncate">{summary.overdueCallbacks > 0 ? 'Urgent contact' : 'Up to date'}</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="interactive-card p-3 sm:p-4 relative overflow-hidden group col-span-2 sm:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-700" />
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">Pipeline Value</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
            {formatCurrency(summary.pipelineEstimatedValue || 0, summary.currency)}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
            <span className="truncate">Active tour estimates</span>
          </div>
        </div>
      </div>

      {/* Main Content: Priority Actions & Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-full">
        {/* Priority Actions Column (2 Cols on Desktop) */}
        <div className="lg:col-span-2 space-y-3.5 sm:space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate">
                Priority Action Queue
              </h2>
              {priorityActions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 flex-shrink-0">
                  {priorityActions.length} Due
                </span>
              )}
            </div>

            <Link
              to="/app/actions"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline flex-shrink-0"
            >
              <span>View full queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Action Cards List */}
          {priorityActions.length > 0 ? (
            <div className="space-y-3 sm:space-y-3.5">
              {priorityActions.slice(0, 3).map((action) => (
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
          ) : (
            <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">All clear on your flight deck!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No recommended actions are pending right now. All enquiry follow-ups and quotations are up to date.
              </p>
              <Link to="/app/leads/new" className="mt-4 btn-secondary btn-sm inline-flex">
                <PlusCircle className="w-3.5 h-3.5 text-teal-700" />
                <span>Create new enquiry</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar: Pipeline Stage Funnel & Activity */}
        <div className="space-y-4 sm:space-y-6 min-w-0">
          {/* Pipeline Stage Distribution */}
          <div className="card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700 flex-shrink-0" />
                <span>Pipeline by Stage</span>
              </h3>
              <Link to="/app/pipeline" className="text-xs font-bold text-teal-700 hover:underline">
                Board View
              </Link>
            </div>

            {stageItems.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                {stageItems.map((item) => {
                  const pct = Math.round((item.count / totalLeadsInBreakdown) * 100);
                  return (
                    <div key={item.stage} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <StatusBadge stage={item.stage} size="sm" />
                        <span className="font-bold text-slate-800">{item.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-700 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(item.count > 0 ? 5 : 0, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No active stage data yet</p>
            )}
          </div>

          {/* Recent Travel Activity Stream */}
          <div className="card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Recent Activities</span>
              </h3>
              <Link to="/app/leads" className="text-xs font-bold text-teal-700 hover:underline">
                All Leads
              </Link>
            </div>

            {data?.recentActivities && data.recentActivities.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                {data.recentActivities.slice(0, 5).map((activity, i) => {
                  const custName = activity.leadId?.customerName || activity.customerName || 'Customer';
                  const leadDest = activity.leadId?.destination;
                  return (
                    <div key={activity._id || i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {custName}
                          </p>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {formatRelativeTime(activity.occurredAt || activity.createdAt)}
                          </span>
                        </div>
                        {leadDest && (
                          <div className="text-[10px] text-teal-700 font-semibold flex items-center gap-0.5">
                            <Plane className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">{leadDest}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 truncate mt-0.5">
                          {activity.title || activity.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No logged activity yet</p>
            )}
          </div>
        </div>
      </div>

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
            setActiveModal(null);
            setSelectedAction(null);
            fetchDashboardData();
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
            setActiveModal(null);
            setSelectedAction(null);
            fetchDashboardData();
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
            setActiveModal(null);
            setSelectedAction(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
