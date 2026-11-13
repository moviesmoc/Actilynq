import React, { useState } from 'react';
import { MessageCircle, Check, X, Calendar } from 'lucide-react';
import api from '../api/client';

export default function WhatsAppConfirmModal({
  isOpen = true,
  onClose,
  lead,
  action,
  onActivityLogged,
  onConfirm
}) {
  const currentLead = lead || action;
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState('');
  const [scheduleNextFollowUp, setScheduleNextFollowUp] = useState(false);
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');

  if (!isOpen || !currentLead) return null;

  const handleConfirmSent = async () => {
    setSubmitting(true);
    try {
      await api.post(`/leads/${currentLead._id || currentLead.leadId}/activities`, {
        type: 'whatsapp',
        title: 'WhatsApp Message Sent',
        description: note || 'Shared trip details and followed up via WhatsApp.',
        contactOutcome: 'sent', // Derives isCustomerContact = true on backend!
        nextFollowUpAt: scheduleNextFollowUp && nextFollowUpAt ? nextFollowUpAt : null,
        clearFollowUp: !scheduleNextFollowUp // Clear existing overdue callback if not scheduling new one
      });
      if (onActivityLogged) onActivityLogged();
      if (onConfirm) onConfirm();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to record WhatsApp activity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-4 sm:p-6 my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-emerald-700 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">WhatsApp Outreach</h3>
            <p className="text-xs text-slate-500">Confirm communication status</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          WhatsApp was opened in a new tab with a prefilled message for{' '}
          <strong className="text-slate-900">{currentLead.customerName}</strong>. Did you send the message?
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Add note or customer response (optional):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Shared revised quotation and asked for preferred dates"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={scheduleNextFollowUp}
                onChange={(e) => setScheduleNextFollowUp(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Schedule next follow-up callback
              </span>
            </label>

            {scheduleNextFollowUp && (
              <input
                type="datetime-local"
                value={nextFollowUpAt}
                onChange={(e) => setNextFollowUpAt(e.target.value)}
                className="mt-2 w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            No, Cancelled
          </button>
          <button
            type="button"
            onClick={handleConfirmSent}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{submitting ? 'Recording...' : 'Yes, Message Sent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
