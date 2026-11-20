import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import api from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccessData(res.data);
    } catch (err) {
      setError(err.message || 'Unable to process password reset request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 mb-3 shadow-2xs">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Forgot Password</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Enter your registered work email to receive password reset instructions.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successData ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Email Sent to Your Inbox!</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              We have sent a secure password reset email to <strong className="font-semibold">{email}</strong>. Please check your inbox and click the reset button to set a new password.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Didn't receive the email?</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500">
              <li>Check your Spam / Junk folder.</li>
              <li>Ensure the email address was spelled correctly.</li>
              <li>The reset link remains valid for 1 hour.</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <Link to="/login" className="w-full btn-primary block text-center py-2 text-xs">
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Registered Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@travelagency.com"
                className="input-base pl-9.5"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Generating link...' : 'Generate Reset Link'}</span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      )}
    </div>
  );
}
