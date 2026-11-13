import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Users,
  FileText,
  Calendar,
  X,
  Check
} from 'lucide-react';
import api from '../api/client';
import WhatsAppIcon from './WhatsAppIcon';

export default function LogActivityModal({
  isOpen,
  onClose,
  lead,
  onActivityLogged
}) {
  const [type, setType] = useState('call');
  const [contactOutcome, setContactOutcome] = useState('connected');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');
  const [clearFollowUp, setClearFollowUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !lead) return null;

  const ACTIVITY_OPTIONS = [
    { type: 'call', label: 'Phone Call', icon: Phone },
    { type: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'meeting', label: 'Meeting', icon: Users },
    { type: 'note', label: 'Internal Note', icon: FileText }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const activityTitle = title.trim() || `${ACTIVITY_OPTIONS.find((a) => a.type === type)?.label || 'Activity'}`;

      let formattedFollowUp = null;
      if (!clearFollowUp && nextFollowUpAt) {
        const d = new Date(nextFollowUpAt);
        formattedFollowUp = !isNaN(d.getTime()) ? d.toISOString() : nextFollowUpAt;
      }

      await api.post(`/leads/${lead._id}/activities`, {
        type,
        title: activityTitle,
        description: description.trim(),
        contactOutcome: type === 'note' ? undefined : contactOutcome,
        nextFollowUpAt: formattedFollowUp,
        clearFollowUp
      });

      if (onActivityLogged) onActivityLogged();
      onClose();
    } catch (err) {
      const errorMsg =
        (err.details && Array.isArray(err.details) && err.details[0]?.message) ||
        err.message ||
        'Failed to record activity';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-4 sm:p-6 my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Record Activity</h3>
            <p className="text-xs text-slate-500">For {lead.customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Activity Type:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ACTIVITY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = type === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setType(opt.type);
                      if (opt.type === 'call') setContactOutcome('connected');
                      if (opt.type === 'whatsapp') setContactOutcome('sent');
                      if (opt.type === 'email') setContactOutcome('sent');
                      if (opt.type === 'meeting') setContactOutcome('completed');
                    }}
                    className={`p-2 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outcome selector if customer contact type */}
          {type === 'call' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Call Result:
              </label>
              <select
                value={contactOutcome}
                onChange={(e) => setContactOutcome(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="connected">Connected & Discussed (Counts as Customer Contact)</option>
                <option value="busy">Busy / Call Waiting (No contact)</option>
                <option value="not_reachable">Not Reachable / Switched Off (No contact)</option>
              </select>
            </div>
          )}

          {type === 'whatsapp' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                WhatsApp Outcome:
              </label>
              <select
                value={contactOutcome}
                onChange={(e) => setContactOutcome(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="sent">Message Sent (Counts as Customer Contact)</option>
                <option value="unconfirmed">Draft Opened Only / Unconfirmed</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Discussed Switzerland Itinerary or Revised Hotel Preferences"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description / Notes:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed notes of what was discussed, customer objections, or next steps..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Follow-up callback control */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Scheduled Follow-up Callback
              </label>
              <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearFollowUp}
                  onChange={(e) => {
                    setClearFollowUp(e.target.checked);
                    if (e.target.checked) setNextFollowUpAt('');
                  }}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Clear current follow-up
              </label>
            </div>

            {!clearFollowUp && (
              <input
                type="datetime-local"
                value={nextFollowUpAt}
                onChange={(e) => setNextFollowUpAt(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
