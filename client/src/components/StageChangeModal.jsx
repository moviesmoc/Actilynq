import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle, Check } from 'lucide-react';
import { STAGES, STAGE_CONFIG } from '../utils/constants';
import api from '../api/client';

export default function StageChangeModal({
  isOpen,
  onClose,
  lead,
  targetStage,
  onStageUpdated
}) {
  const [quotationAmount, setQuotationAmount] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [note, setNote] = useState('');
  
  // Prerequisite inputs if missing
  const [destination, setDestination] = useState('');
  const [travelStartDate, setTravelStartDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (lead) {
      setQuotationAmount(lead.quotationAmount || lead.estimatedValue || '');
      setDestination(lead.destination || '');
      setTravelStartDate(lead.travelStartDate ? lead.travelStartDate.split('T')[0] : '');
      setTravellerCount(lead.travellerCount || '');
      setLostReason('');
      setNote('');
      setErrorMessage('');
    }
  }, [lead, targetStage]);

  if (!isOpen || !lead || !targetStage) return null;

  const targetConfig = STAGE_CONFIG[targetStage] || { label: targetStage };
  const currentConfig = STAGE_CONFIG[lead.stage] || { label: lead.stage };

  const isCollectingRequirements =
    targetStage === STAGES.REQUIREMENTS_COLLECTED ||
    targetStage === STAGES.PACKAGE_PREPARATION;

  const isQuotationSent = targetStage === STAGES.QUOTATION_SENT;
  const isLost = targetStage === STAGES.LOST;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      // If missing requirements need to be filled first, update lead details first
      if (isCollectingRequirements) {
        if (!destination.trim() || !travelStartDate || !travellerCount) {
          throw new Error('Destination, travel start date, and traveller count are required before moving to this stage.');
        }

        await api.put(`/leads/${lead._id}`, {
          destination: destination.trim(),
          travelStartDate: new Date(travelStartDate).toISOString(),
          travellerCount: Number(travellerCount)
        });
      }

      // Now update stage
      const payload = {
        toStage: targetStage,
        note
      };

      if (isQuotationSent) {
        if (!quotationAmount || Number(quotationAmount) <= 0) {
          throw new Error('Please enter a valid quotation amount greater than 0.');
        }
        payload.quotationAmount = Number(quotationAmount);
      }

      if (isLost) {
        if (!lostReason.trim()) {
          throw new Error('Please specify the reason for marking this enquiry as lost.');
        }
        payload.lostReason = lostReason.trim();
      }

      const res = await api.put(`/leads/${lead._id}/stage`, payload);
      if (onStageUpdated) onStageUpdated(res.data.lead);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update stage');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 text-slate-800 mb-2 font-semibold text-base">
          <span>{currentConfig.label}</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-teal-700">{targetConfig.label}</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Updating workflow stage for <strong className="text-slate-800">{lead.customerName}</strong>
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Missing requirements inputs */}
          {isCollectingRequirements && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600" />
                Required Travel Specs
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Switzerland or Bali"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={travelStartDate}
                    onChange={(e) => setTravelStartDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Traveller Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={travellerCount}
                    onChange={(e) => setTravellerCount(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quotation amount required for Quotation Sent */}
          {isQuotationSent && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Final Quotation Amount ({lead.budgetCurrency || 'INR'}) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quotationAmount}
                onChange={(e) => setQuotationAmount(e.target.value)}
                placeholder="e.g. 250000"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Records quotation amount and sent timestamp. Note: ActiLynq tracks quotation commercials; it does not generate PDF itineraries.
              </p>
            </div>
          )}

          {/* Lost reason required for Lost */}
          {isLost && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Lost Enquiry *
              </label>
              <textarea
                required
                rows={2}
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                placeholder="e.g. Customer decided to postpone holiday to next winter"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Transition Note (optional):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Discussed revised package with customer"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : `Advance to ${targetConfig.label}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
