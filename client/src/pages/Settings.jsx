import React, { useState, useEffect } from 'react';
import {
  Settings,
  AlertCircle,
  CheckCircle2,
  Building2,
  BookOpen,
  RotateCcw,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function SettingsPage() {
  const { business, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: business?.name || '',
    currency: business?.currency || 'INR',
    contactPhone: business?.contactPhone || ''
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        currency: business.currency || 'INR',
        contactPhone: business.contactPhone || ''
      });
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/business', formData);
      if (res.data?.success) {
        setSuccess('Settings saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoReset = async () => {
    if (!window.confirm('This will reset all demo data. Are you sure?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/demo/reset');
      if (res.data?.success) {
        setSuccess('Demo workspace reset successfully');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 mb-1 flex items-center gap-2">
          <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-brand-700 flex-shrink-0" />
          <span>Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">Manage your workspace and business information</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-800 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-emerald-900">{success}</p>
        </div>
      )}

      {/* Business Settings */}
      <div className="card">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-700" />
          Business Settings
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Workspace Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-base text-sm"
            />
            <p className="text-xs text-neutral-500 mt-1">
              The name of your travel agency or business
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Default Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-base text-sm"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="AED">UAE Dirham (د.إ)</option>
              <option value="SGD">Singapore Dollar (S$)</option>
            </select>
            <p className="text-xs text-neutral-500 mt-1">
              Used for all financial displays
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Contact Phone (Optional)
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="input-base text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* User Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Your Account</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-neutral-700">Name</p>
            <p className="text-base text-neutral-900 mt-1">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-700">Email</p>
            <p className="text-base text-neutral-900 mt-1">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-700">Role</p>
            <p className="text-base text-neutral-900 mt-1 capitalize">{user?.role || 'Owner'}</p>
          </div>
        </div>
      </div>

      {/* Next-Action Engine Rules */}
      <div className="card">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-700" />
          Next-Action Engine Rules
        </h2>

        <div className="space-y-4 text-sm text-neutral-700">
          <div>
            <p className="font-semibold text-neutral-900 mb-1">Rule 1: Missing Requirements</p>
            <p>If destination, traveller count, or travel dates are missing, recommend collecting this information.</p>
          </div>

          <div>
            <p className="font-semibold text-neutral-900 mb-1">Rule 2: Quotation Preparation</p>
            <p>If requirements are collected but no quotation has been sent, recommend preparing and sending a quotation.</p>
          </div>

          <div>
            <p className="font-semibold text-neutral-900 mb-1">Rule 3: Quotation Follow-up</p>
            <p>If a quotation was sent 2+ days ago without subsequent customer contact, recommend following up.</p>
          </div>

          <div>
            <p className="font-semibold text-neutral-900 mb-1">Rule 4: Overdue Callback</p>
            <p>If a scheduled callback date has passed without being completed, flag as overdue and recommend immediate follow-up.</p>
          </div>

          <div>
            <p className="font-semibold text-neutral-900 mb-1">Rule 5: Inactive Enquiry</p>
            <p>If no activity has been recorded for 7+ days, recommend checking in to keep the enquiry alive.</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <span className="font-semibold">Note:</span> These rules are deterministic and rule-based. They evaluate lead stage, requirements, contact history, and timing to generate recommendations.
          </p>
        </div>
      </div>

      {/* Demo Reset (only for demo workspaces) */}
      {business?.isDemo && (
        <div className="card border-amber-200 bg-amber-50">
          <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <RotateCcw className="w-6 h-6" />
            Demo Workspace
          </h2>

          <p className="text-sm text-amber-800 mb-4">
            This is a demonstration workspace. You can reset it to return to the initial demo state with sample data.
          </p>

          <button
            onClick={handleDemoReset}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm py-2.5 px-4 rounded-md shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {loading ? 'Resetting...' : 'Reset Demo Workspace'}
          </button>
        </div>
      )}
    </div>
  );
}
