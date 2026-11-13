import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Phone
} from 'lucide-react';
import api from '../api/client';
import { TRAVEL_TYPES, ACCOMMODATION_PREFERENCES, LEAD_SOURCES } from '../utils/constants';

export default function LeadForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    destination: '',
    departureCity: '',
    travelStartDate: '',
    travelEndDate: '',
    travellerCount: '', // Nullable by default
    budgetAmount: '',
    budgetCurrency: 'INR',
    travelType: 'leisure',
    accommodationPreference: 'any',
    specialRequirements: '',
    leadSource: 'manual',
    estimatedValue: '',
    nextFollowUpAt: ''
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      async function loadLead() {
        try {
          const res = await api.get(`/leads/${id}`);
          if (res.data?.success) {
            const l = res.data.lead;
            setFormData({
              customerName: l.customerName || '',
              phone: l.phone || '',
              email: l.email || '',
              destination: l.destination || '',
              departureCity: l.departureCity || '',
              travelStartDate: l.travelStartDate ? l.travelStartDate.split('T')[0] : '',
              travelEndDate: l.travelEndDate ? l.travelEndDate.split('T')[0] : '',
              travellerCount: l.travellerCount !== null && l.travellerCount !== undefined ? l.travellerCount : '',
              budgetAmount: l.budgetAmount || '',
              budgetCurrency: l.budgetCurrency || 'INR',
              travelType: l.travelType || 'leisure',
              accommodationPreference: l.accommodationPreference || 'any',
              specialRequirements: l.specialRequirements || '',
              leadSource: l.leadSource || 'manual',
              estimatedValue: l.estimatedValue || '',
              nextFollowUpAt: l.nextFollowUpAt ? l.nextFollowUpAt.slice(0, 16) : ''
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to load lead details');
        } finally {
          setLoading(false);
        }
      }
      loadLead();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Build clean payload with null for empty optional fields
      const payload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        destination: formData.destination.trim() || null,
        departureCity: formData.departureCity.trim() || null,
        travelStartDate: formData.travelStartDate ? new Date(formData.travelStartDate).toISOString() : null,
        travelEndDate: formData.travelEndDate ? new Date(formData.travelEndDate).toISOString() : null,
        travellerCount: formData.travellerCount !== '' ? Number(formData.travellerCount) : null,
        budgetAmount: formData.budgetAmount !== '' ? Number(formData.budgetAmount) : null,
        budgetCurrency: formData.budgetCurrency || 'INR',
        travelType: formData.travelType,
        accommodationPreference: formData.accommodationPreference,
        specialRequirements: formData.specialRequirements.trim() || null,
        leadSource: formData.leadSource,
        estimatedValue: formData.estimatedValue !== '' ? Number(formData.estimatedValue) : null,
        nextFollowUpAt: formData.nextFollowUpAt ? new Date(formData.nextFollowUpAt).toISOString() : null
      };

      let leadId = id;
      if (isEdit) {
        await api.put(`/leads/${id}`, payload);
      } else {
        const res = await api.post('/leads', payload);
        leadId = res.data.lead._id;
      }

      navigate(`/app/leads/${leadId}`);
    } catch (err) {
      const errorMsg =
        (err.details && Array.isArray(err.details) && err.details[0]?.message) ||
        err.message ||
        'Failed to save enquiry';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-medium text-slate-500">Loading enquiry form...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 w-full max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={isEdit ? `/app/leads/${id}` : '/app/leads'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {isEdit ? 'Edit Travel Enquiry' : 'Capture New Travel Enquiry'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update customer requirements and trip parameters' : 'Fast intake: Trip specs can be captured now or collected later during sales calls'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer Contact Info (Required) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Phone className="w-4 h-4 text-teal-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              1. Customer Contact Details (Mandatory)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer / Group Name *
              </label>
              <input
                type="text"
                required
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Varma or Sharma Family"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Travel Specifications (Flexible Intake) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Travel Requirements (Flexible / Optional for raw leads)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              Can remain blank if customer hasn't decided yet
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Switzerland, Bali, Dubai"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Departure City
              </label>
              <input
                type="text"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                placeholder="e.g. Mumbai or Delhi"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Traveller Count
              </label>
              <input
                type="number"
                min="1"
                name="travellerCount"
                value={formData.travellerCount}
                onChange={handleChange}
                placeholder="Leave blank if unknown (never assumes 1)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Travel Start Date
              </label>
              <input
                type="date"
                name="travelStartDate"
                value={formData.travelStartDate}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Travel End Date
              </label>
              <input
                type="date"
                name="travelEndDate"
                value={formData.travelEndDate}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Travel Type
              </label>
              <select
                name="travelType"
                value={formData.travelType}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {TRAVEL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Accommodation Preference
              </label>
              <select
                name="accommodationPreference"
                value={formData.accommodationPreference}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {ACCOMMODATION_PREFERENCES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Enquiry Source
              </label>
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {LEAD_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Special Preferences & Notes
            </label>
            <textarea
              rows={2}
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              placeholder="e.g. Vegetarian food preferences, senior citizen travelling, mountain view rooms, seaplane transfer"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Section 3: Commercials & Follow-up Scheduling */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-teal-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              3. Commercials & Callback Scheduling
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Client Budget (Optional)
              </label>
              <input
                type="number"
                min="0"
                name="budgetAmount"
                value={formData.budgetAmount}
                onChange={handleChange}
                placeholder="e.g. 350000 (Does not block quotes)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Estimated Deal Value
              </label>
              <input
                type="number"
                min="0"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleChange}
                placeholder="e.g. 380000"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Next Follow-up Callback
              </label>
              <input
                type="datetime-local"
                name="nextFollowUpAt"
                value={formData.nextFollowUpAt}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-3 pt-2">
          <Link
            to={isEdit ? `/app/leads/${id}` : '/app/leads'}
            className="flex-1 sm:flex-none text-center px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 sm:flex-none justify-center px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Enquiry'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
