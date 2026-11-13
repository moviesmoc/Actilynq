import React, { useState } from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';
import { STAGES, STAGE_CONFIG } from '../utils/constants';
import api from '../api/client';

export default function ReopenModal({
  isOpen,
  onClose,
  lead,
  onReopened
}) {
  const [targetStage, setTargetStage] = useState(STAGES.FOLLOW_UP);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !lead) return null;

  const REOPEN_OPTIONS = [
    { value: STAGES.FOLLOW_UP, label: 'Follow-up' },
    { value: STAGES.NEGOTIATION, label: 'Negotiation' },
    { value: STAGES.QUOTATION_SENT, label: 'Quotation Sent' },
    { value: STAGES.PACKAGE_PREPARATION, label: 'Package Preparation' },
    { value: STAGES.REQUIREMENTS_COLLECTED, label: 'Requirements Collected' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for reopening this enquiry.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/leads/${lead._id}/reopen`, {
        targetStage,
        reason: reason.trim()
      });
      if (onReopened) onReopened(res.data.lead);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reopen lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-amber-700 mb-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Reopen Terminal Enquiry</h3>
            <p className="text-xs text-slate-500">Deliberate workflow reactivation</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          This enquiry for <strong className="text-slate-800">{lead.customerName}</strong> is currently closed as{' '}
          <strong className="text-slate-800">{STAGE_CONFIG[lead.stage]?.label || lead.stage}</strong>. Reopening will restore it to the active sales pipeline and Action Center.
        </p>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Reactivation Stage:
            </label>
            <select
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {REOPEN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reopening Rationale *:
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer reached back out wanting to reconsider the Switzerland quote"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? 'Reopening...' : 'Reopen Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
