import React, { useState, useEffect } from 'react';
import {
  Settings,
  AlertCircle,
  CheckCircle2,
  Building2,
  BookOpen,
  RotateCcw,
  Save,
  Phone,
  Sparkles,
  Lock,
  Clock,
  Users,
  UserPlus,
  Trash2,
  Shield,
  X
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function SettingsPage() {
  const { business, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [simulating, setSimulating] = useState(false);

  // Multi-user Team state
  const [teamMembers, setTeamMembers] = useState([]);
  const [seatInfo, setSeatInfo] = useState({ maxUsers: 2, currentCount: 1, seatsRemaining: 1 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [addingMember, setAddingMember] = useState(false);

  const [formData, setFormData] = useState({
    name: business?.name || '',
    currency: business?.currency || 'INR',
    contactPhone: business?.contactPhone || ''
  });

  const sponsorPhone = '7359510771';
  const whatsappUrl = `https://wa.me/91${sponsorPhone}?text=${encodeURIComponent(
    `Hi, I am contacting you regarding my ActiLynq subscription for "${business?.name || 'Travel Agency'}".`
  )}`;

  const handleSimulate = async (expireNow) => {
    setSimulating(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/business/simulate-trial', { expireNow, daysRemaining: expireNow ? 0 : 14 });
      if (refreshProfile) await refreshProfile();
      setSuccess(expireNow ? 'Simulated trial expiry: Modal is now visible' : 'Restored trial: 14 active days remaining');
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await api.get('/business/users');
      if (res.data?.success) {
        setTeamMembers(res.data.users);
        setSeatInfo({
          maxUsers: res.data.maxUsers,
          currentCount: res.data.currentCount,
          seatsRemaining: res.data.seatsRemaining
        });
      }
    } catch (e) {
      console.warn('Could not load team members:', e);
    }
  };

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        currency: business.currency || 'INR',
        contactPhone: business.contactPhone || ''
      });
      fetchTeam();
    }
  }, [business]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddingMember(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/business/users', newMember);
      if (res.data?.success) {
        setSuccess(res.data.message || 'Team member added');
        setShowAddModal(false);
        setNewMember({ name: '', email: '', password: '', role: 'agent' });
        fetchTeam();
      }
    } catch (err) {
      setError(err.message || 'Failed to add team member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from your agency workspace?`)) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.delete(`/business/users/${userId}`);
      if (res.data?.success) {
        setSuccess(res.data.message || 'Team member removed');
        fetchTeam();
      }
    } catch (err) {
      setError(err.message || 'Failed to remove team member');
    }
  };

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

      {/* Team Members & Multi-User Management */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-700" />
              <span>Team Members & Sales Agents</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage salesperson access to your agency's enquiry queue and pipeline
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              seatInfo.seatsRemaining === 0
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}>
              {seatInfo.currentCount} / {seatInfo.maxUsers} Seats Used
            </span>
            {(user?.role === 'owner' || user?.role === 'admin') && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                disabled={seatInfo.seatsRemaining === 0}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Sales Agent</span>
              </button>
            )}
          </div>
        </div>

        {seatInfo.seatsRemaining === 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between gap-2">
            <span>You have reached your seat limit ({seatInfo.maxUsers} users). Need more sales executives?</span>
            <a
              href={`https://wa.me/917359510771?text=${encodeURIComponent(`Hi, I want to add more user seats for my agency ${business?.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-amber-900 whitespace-nowrap"
            >
              Contact +91 7359510771
            </a>
          </div>
        )}

        {/* Team Members List */}
        <div className="divide-y divide-slate-100">
          {teamMembers.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                  member.role === 'owner' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{member.name}</span>
                    {member.id === user?.id && (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">You</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{member.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
                  member.role === 'owner'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : member.role === 'admin'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {member.role === 'owner' ? 'Owner' : member.role === 'admin' ? 'Manager' : 'Sales Agent'}
                </span>

                {user?.role === 'owner' && member.role !== 'owner' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove user"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Team Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 my-auto animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <UserPlus className="w-4 h-4" />
                  <span>Add New Sales Agent</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agent Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Rao"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agent Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aditi@travelagency.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Password (min 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">The agent will use this password to sign in to your workspace.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role & Permissions
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="agent">Sales Agent (View/edit enquiries, calls, WhatsApp)</option>
                    <option value="admin">Branch Manager / Admin (Full enquiry + team view)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingMember}
                    className="btn-primary py-1.5 px-4 text-xs font-semibold disabled:opacity-50"
                  >
                    {addingMember ? 'Adding...' : 'Add Team Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Subscription & Sponsor Contact */}
      <div className="card border-teal-200 bg-gradient-to-br from-white to-teal-50/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-700" />
            <span>Subscription & Sponsor Support</span>
          </h2>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            business?.isTrialExpired
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-teal-100 text-teal-800 border border-teal-200'
          }`}>
            {business?.isTrialExpired ? 'Trial Expired' : `${business?.daysRemaining ?? 14} Days Left`}
          </span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Current Plan</span>
              <span className="font-bold text-slate-900 capitalize text-sm">{business?.subscriptionPlan || '14-Day Free Evaluation Trial'}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
              <span className={`font-bold ${business?.isTrialExpired ? 'text-rose-600' : 'text-emerald-700'}`}>
                {business?.isTrialExpired ? 'Expired - Renewal Required' : 'Active 14-Day Trial'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-700" />
              <span className="font-bold text-slate-900">Official Sponsor Contact:</span>
              <span className="font-bold text-teal-800">+91 {sponsorPhone}</span>
            </div>
            <p className="text-xs text-slate-600">
              For plan renewals, seat upgrades, or customized travel CRM integrations, reach out to our sponsor directly:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-white font-semibold text-xs shadow-xs hover:opacity-95 transition-opacity"
                style={{ backgroundColor: '#25D366' }}
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:+91${sponsorPhone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>Call +91 {sponsorPhone}</span>
              </a>
            </div>
          </div>

          {/* Demonstration Tool for Faculty Presentation (Only visible on Demo Account) */}
          {business?.isDemo && (
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Faculty Presentation Simulator (Demo Account Only)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulate(true)}
                  disabled={simulating}
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-md transition-colors"
                >
                  Simulate: Trigger Trial Expiry Paywall
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulate(false)}
                  disabled={simulating}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-colors"
                >
                  Restore: 14 Days Active Trial
                </button>
              </div>
            </div>
          )}
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
