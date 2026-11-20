import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, AlertCircle, Eye, EyeOff, Mail } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRequiresVerification(false);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      if (err.requiresVerification) {
        setRequiresVerification(true);
        setUnverifiedEmail(err.email || email);
      }
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-5 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
          Sign in to your workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Access your travel enquiry queue and Next-Action recommendations
        </p>
      </div>

      {/* Verification Required Action Banner */}
      {requiresVerification && (
        <div className="mb-5 p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs sm:text-sm text-teal-900 flex flex-col gap-2.5 shadow-xs">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <span className="font-semibold leading-snug">
              Account verification required. Enter the 6-digit code sent to your inbox to unlock your workspace:
            </span>
          </div>
          <Link
            to={`/register?verify=true&email=${encodeURIComponent(unverifiedEmail || email)}`}
            className="w-full py-2.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Enter 6-Digit Verification Code</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Error Message */}
      {error && !requiresVerification && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="mb-5 w-full flex justify-center">
        <GoogleLoginButton onError={(msg) => setError(msg)} />
      </div>

      <div className="relative flex py-2 items-center mb-5">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-3 text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold select-none">
          Or with email
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-5 sm:mb-6">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            Work Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="agent@travelagency.com"
            className="input-base"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="w-9 h-9 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 active:scale-95 transition-all rounded-md"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-md shadow-teal-900/15 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <span>{submitting ? 'Signing in...' : 'Sign In to Workspace'}</span>
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="border-t border-slate-200 pt-5 text-center text-xs sm:text-sm text-slate-600">
        New to ActiLynq?{' '}
        <Link to="/register" className="font-bold text-teal-700 hover:text-teal-900 transition-colors underline sm:no-underline sm:hover:underline ml-1">
          Start 14-Day Free Trial
        </Link>
      </div>
    </div>
  );
}
