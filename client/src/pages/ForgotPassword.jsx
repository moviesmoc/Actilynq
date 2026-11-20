import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Copy, Check, ExternalLink } from 'lucide-react';
import api from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      setSuccessData(res.data);
    } catch (err) {
      setError(err.message || 'Unable to process password reset request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!successData?.resetUrl) return;
    try {
      navigator.clipboard.writeText(successData.resetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  // Convert absolute reset URL to relative path for client SPA router navigation if on same origin
  const getRelativeResetPath = (url) => {
    if (!url) return '/login';
    try {
      const parsed = new URL(url);
      return `${parsed.pathname}${parsed.search}`;
    } catch {
      return url;
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
        <div className="space-y-4 animate-in fade-in duration-150">
          {successData.emailSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reset Email Dispatched!</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                A secure password reset link was sent to <strong className="font-semibold">{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Cloud SMTP Blocked on Render</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Render's cloud container blocked outgoing SMTP traffic to Gmail. To ensure you are never locked out, your secure reset link is available right below.
              </p>
            </div>
          )}

          {/* Instant Reset Action Card (Guaranteed Zero-Friction Fallback) */}
          {successData.resetUrl && (
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  Instant Reset Action
                </span>
                <span className="text-[11px] text-teal-700 font-medium">Valid for 1 hour</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Click below to set your new password immediately without waiting for email delivery:
              </p>

              <Link
                to={getRelativeResetPath(successData.resetUrl)}
                className="w-full btn-primary py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold shadow-xs active:scale-[0.99]"
              >
                <span>Reset Your Password Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 border-t border-teal-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] truncate max-w-[200px] sm:max-w-[240px]">
                  {successData.resetUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 transition-colors ml-2 flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Troubleshooting Tips:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500">
              <li>If expecting an email, check your <strong>Spam</strong> or <strong>Junk</strong> folder.</li>
              <li>Add <code>RESEND_API_KEY</code> in Render Environment for 100% cloud email delivery.</li>
              <li>Or click the <strong>Reset Your Password Now</strong> button above directly.</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <Link to="/login" className="w-full btn-secondary block text-center py-2 text-xs font-semibold">
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
