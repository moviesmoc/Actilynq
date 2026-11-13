import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Plus,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  AlertTriangle,
  FileText,
  Plane,
  Compass,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import StageStepper from '../components/StageStepper';
import ActivityTimeline from '../components/ActivityTimeline';
import LogActivityModal from '../components/LogActivityModal';
import WhatsAppConfirmModal from '../components/WhatsAppConfirmModal';
import CallOutcomeModal from '../components/CallOutcomeModal';
import StageChangeModal from '../components/StageChangeModal';
import ReopenModal from '../components/ReopenModal';
import { formatDate, formatDateTime, formatCurrency, formatRelativeTime } from '../utils/formatters';
import { createWhatsAppUrl, createTelUrl } from '../utils/whatsapp';
import { TERMINAL_STAGES, STAGES } from '../utils/constants';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [targetStage, setTargetStage] = useState(null);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [leadRes, activitiesRes, actionsRes] = await Promise.all([
        api.get(`/leads/${id}`),
        api.get(`/leads/${id}/activities`),
        api.get('/actions')
      ]);

      if (leadRes.data?.success) {
        setLead(leadRes.data.lead);
      }
      if (activitiesRes.data?.success) {
        setActivities(activitiesRes.data.activities || []);
      }
      if (actionsRes.data?.success) {
        // Find recommendation specific to this lead
        const activeRec = (actionsRes.data.recommendations || []).find(
          (r) => r.leadId === id || r.leadId?._id === id
        );
        setRecommendation(activeRec || null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!lead) return;
    const draft = recommendation?.suggestedMessage || `Hi ${lead.customerName}, following up regarding your travel enquiry${lead.destination ? ` for ${lead.destination}` : ''}.`;
    const url = createWhatsAppUrl(lead.phone, draft);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    setIsWhatsAppModalOpen(true);
  };

  const handleCallClick = () => {
    if (!lead) return;
    const url = createTelUrl(lead.phone);
    if (url) window.location.href = url;
    setIsCallModalOpen(true);
  };

  const handleStageSelect = (stageKey) => {
    setTargetStage(stageKey);
    setIsStageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shadow-sm">
          <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '2s' }} />
        </div>
        <div className="text-xs font-semibold text-slate-500">Loading travel enquiry dossier...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
        {error || 'Enquiry record not found or access denied.'}
      </div>
    );
  }

  const isTerminal = TERMINAL_STAGES.includes(lead.stage);

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-start gap-3">
          <Link
            to="/app/leads"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors mt-0.5"
            title="Back to all enquiries"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {lead.customerName}
              </h1>
              <StatusBadge stage={lead.stage} />
              {lead.isArchived && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-bold uppercase">
                  Archived
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{lead.phone}</span>
              </span>
              {lead.email && <span className="text-slate-600">• {lead.email}</span>}
              <span className="text-slate-400">• Source: <strong className="text-slate-700 capitalize font-medium">{lead.leadSource}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-lg shadow-xs transition-all active:scale-[0.97]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCallClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all active:scale-[0.97]"
          >
            <Phone className="w-4 h-4 text-slate-500" />
            <span>Call</span>
          </button>

          <Link
            to={`/app/leads/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          {isTerminal && (
            <button
              type="button"
              onClick={() => setIsReopenModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Next-Action Recommendation Callout */}
      {recommendation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/90 via-white to-blue-50/80 border border-teal-300/80 shadow-xs flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                  Co-pilot Next Action
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                  {recommendation.priority} Urgency
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {recommendation.actionTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                <strong className="text-slate-900">Why this action: </strong>
                {recommendation.explanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="btn-primary text-xs font-bold py-2 px-4 shadow-sm"
            >
              Take Recommended Action
            </button>
          </div>
        </div>
      )}

      {/* Sales Progression Pipeline Stepper */}
      <StageStepper
        currentStage={lead.stage}
        onSelectTargetStage={handleStageSelect}
      />

      {/* 2-Column Working Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Trip Specs & Commercials */}
        <div className="space-y-6">
          {/* Trip Specifications Manifest Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-teal-700 -rotate-45" />
                Trip Manifest
              </h2>
              <Link to={`/app/leads/${id}/edit`} className="text-xs font-bold text-teal-700 hover:underline">
                Edit Specs
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Destination</span>
                <span className="font-extrabold text-slate-900 text-base flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{lead.destination || <em className="text-slate-400 font-normal">Destination TBD</em>}</span>
                </span>
                {lead.departureCity && (
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Departing from: <strong className="text-slate-700">{lead.departureCity}</strong>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Departure Date</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{lead.travelStartDate ? formatDate(lead.travelStartDate) : <em className="text-slate-400 font-normal">TBD</em>}</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Return Date</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5">
                    {lead.travelEndDate ? formatDate(lead.travelEndDate) : <em className="text-slate-400 font-normal">—</em>}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Travellers</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{lead.travellerCount !== null && lead.travellerCount !== undefined ? `${lead.travellerCount} pax` : <em className="text-slate-400 font-normal">TBD</em>}</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Trip Type</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 capitalize">{lead.travelType}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Accommodation Preference</span>
                <span className="font-semibold text-slate-800 text-xs capitalize mt-0.5 block">
                  {lead.accommodationPreference ? lead.accommodationPreference.replace('_', ' ') : 'Standard'}
                </span>
              </div>

              {lead.specialRequirements && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Preferences & Notes</span>
                  <p className="text-slate-700 leading-relaxed mt-1 text-xs whitespace-pre-wrap">{lead.specialRequirements}</p>
                </div>
              )}
            </div>
          </div>

          {/* Commercials Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-teal-700" />
              Commercials & Quotation
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Client Budget:</span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(lead.budgetAmount, lead.budgetCurrency)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated Pipeline:</span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(lead.estimatedValue, lead.budgetCurrency)}
                </span>
              </div>

              {lead.quotationAmount && (
                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-950">Official Quote:</span>
                    <span className="font-extrabold text-purple-950 text-sm">
                      {formatCurrency(lead.quotationAmount, lead.budgetCurrency)}
                    </span>
                  </div>
                  {lead.quotationSentAt && (
                    <div className="text-[11px] text-purple-700">
                      Dispatched on {formatDate(lead.quotationSentAt)} ({formatRelativeTime(lead.quotationSentAt)})
                    </div>
                  )}
                </div>
              )}

              {lead.lostReason && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block text-[11px]">Reason Closed Lost:</span>
                  <p className="text-xs text-rose-800">{lead.lostReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Follow-up Timing Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-teal-700" />
              Follow-up & Contact Status
            </h2>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Scheduled Callback</span>
                <span className={`font-bold block mt-0.5 ${lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date() ? 'text-rose-600' : 'text-slate-900'}`}>
                  {lead.nextFollowUpAt ? formatDateTime(lead.nextFollowUpAt) : 'No pending callback'}
                </span>
                {lead.nextFollowUpAt && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ({formatRelativeTime(lead.nextFollowUpAt)})
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Verified Contact:</span>
                <span className="text-slate-700 font-semibold">
                  {lead.lastCustomerContactAt ? formatRelativeTime(lead.lastCustomerContactAt) : 'None logged'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2 Cols): Activity Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Activity & Contact Timeline ({activities.length})
            </h2>
            <button
              type="button"
              onClick={() => setIsActivityModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Activity</span>
            </button>
          </div>

          {/* Chronological Activity Feed */}
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Mobile Sticky Quick Action Bar (< 768px) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md p-2.5 border-t border-slate-200/90 shadow-lg flex items-center justify-around gap-2">
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCallClick}
          className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1"
        >
          <Phone className="w-4 h-4 text-slate-600" />
          <span>Call</span>
        </button>

        <button
          type="button"
          onClick={() => setIsActivityModalOpen(true)}
          className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Log</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <LogActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        lead={lead}
        onActivityLogged={fetchLeadData}
      />

      <WhatsAppConfirmModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        lead={lead}
        onActivityLogged={fetchLeadData}
      />

      <CallOutcomeModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        lead={lead}
        onActivityLogged={fetchLeadData}
      />

      <StageChangeModal
        isOpen={isStageModalOpen}
        onClose={() => {
          setIsStageModalOpen(false);
          setTargetStage(null);
        }}
        lead={lead}
        targetStage={targetStage}
        onStageUpdated={(updated) => {
          setLead(updated);
          fetchLeadData();
        }}
      />

      <ReopenModal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        lead={lead}
        onReopened={(reopened) => {
          setLead(reopened);
          fetchLeadData();
        }}
      />
    </div>
  );
}
