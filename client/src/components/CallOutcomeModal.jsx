import React, { useState } from 'react';
import { Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function CallOutcomeModal({
  isOpen = true,
  onClose,
  lead,
  action,
  onActivityLogged,
  onConfirm
}) {
  const currentLead = lead || action;
  const [outcome, setOutcome] = useState('connected');
  const [note, setNote] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !currentLead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isConnected = outcome === 'connected';

      await api.post(`/leads/${currentLead._id || currentLead.leadId}/activities`, {
        type: 'call',
        title: isConnected ? 'Phone Call Connected' : `Call Unsuccessful (${outcome.replace('_', ' ')})`,
        description: note || (isConnected ? 'Discussed trip requirements and itinerary.' : 'Attempted to reach customer.'),
        contactOutcome: outcome, // Server derives isCustomerContact based on this!
        nextFollowUpAt: nextFollowUpAt || null,
        clearFollowUp: isConnected && !nextFollowUpAt // If connected and no new date chosen, clear old callback
      });

      if (onActivityLogged) onActivityLogged();
      if (onConfirm) onConfirm();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to log call outcome');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-teal-700 mb-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Record Call Outcome</h3>
            <p className="text-xs text-slate-500">For {currentLead.customerName} ({currentLead.phone})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              What was the call result?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOutcome('connected')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  outcome === 'connected'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Connected</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('busy')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  outcome === 'busy'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Line Busy</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('not_reachable')}
                className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                  outcome === 'not_reachable'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Unreachable</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Discussion Notes:
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={outcome === 'connected' ? 'Customer confirmed budget of 3L, wants 4-star hotels in South Bali' : 'Tried calling, phone switched off.'}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {outcome === 'connected' ? 'Schedule Next Follow-up (optional):' : 'Schedule Retry Callback:'}
            </label>
            <input
              type="datetime-local"
              value={nextFollowUpAt}
              onChange={(e) => setNextFollowUpAt(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
              {submitting ? 'Saving...' : 'Save Call Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
