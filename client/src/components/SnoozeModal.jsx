import React, { useState } from 'react';
import { Moon, Clock } from 'lucide-react';
import api from '../api/client';

export default function SnoozeModal({
  isOpen = true,
  onClose,
  recommendation,
  action,
  lead,
  onSnoozed,
  onConfirm
}) {
  const currentRec = recommendation || action || lead;
  const [snoozeHours, setSnoozeHours] = useState(24);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !currentRec) return null;

  const leadId = currentRec.leadId || currentRec._id;
  const ruleId = currentRec.ruleId || 'GENERAL_FOLLOW_UP';

  const handleSnooze = async () => {
    setSubmitting(true);
    try {
      await api.post(`/actions/${leadId}/snooze`, {
        ruleId,
        snoozeHours: Number(snoozeHours),
        reason
      });
      if (onSnoozed) onSnoozed();
      if (onConfirm) onConfirm();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to snooze action');
    } finally {
      setSubmitting(false);
    }
  };

  const OPTIONS = [
    { hours: 4, label: '4 Hours', desc: 'Later today' },
    { hours: 24, label: '1 Day', desc: 'Tomorrow' },
    { hours: 48, label: '2 Days', desc: 'In 2 days' },
    { hours: 72, label: '3 Days', desc: 'In 3 days' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-indigo-700 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Snooze Recommendation</h3>
            <p className="text-xs text-slate-500">Temporarily hide from Action Center</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          Hide <strong className="text-slate-800">{currentRec.actionTitle || 'this recommendation'}</strong> for{' '}
          <strong className="text-slate-800">{currentRec.customerName || 'Customer'}</strong>. The action will reappear automatically once the snooze expires.
        </p>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-semibold text-slate-700">
            Snooze duration:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.hours}
                type="button"
                onClick={() => setSnoozeHours(opt.hours)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  snoozeHours === opt.hours
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-500">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Reason (optional):
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer is travelling this afternoon"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSnooze}
            disabled={submitting}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            {submitting ? 'Snoozing...' : 'Snooze'}
          </button>
        </div>
      </div>
    </div>
  );
}
