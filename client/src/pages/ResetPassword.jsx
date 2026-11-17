import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../api/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Password reset token is required');
      return;
    }

    if (password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        token: token.trim(),
        password
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Token may be expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 mb-3 shadow-2xs">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Set New Password</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Create a strong, new password for your ActiLynq workspace.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Password Reset Successfully!</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Your password has been updated. Redirecting you to sign in with your new credentials...
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>Sign In Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromUrl && (
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token from reset email"
                className="input-base text-xs font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              New Password (min 8 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Resetting password...' : 'Update Password'}</span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900">
              Cancel and return to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
