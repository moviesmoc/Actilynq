import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Register() {
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        businessName,
        name,
        email,
        password
      });
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-5 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
          Create your workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Start your 14-day free trial &bull; 2 Sales Agent Seats included
        </p>
      </div>

      {/* Error Message */}
      {error && (
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
          Or register with email
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 mb-5 sm:mb-6">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            Travel Agency Name
          </label>
          <input
            type="text"
            required
            autoComplete="organization"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Blue Horizon Holidays"
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            Your Full Name
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Varma"
            className="input-base"
          />
        </div>

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
            placeholder="ramesh@bluehorizon.com"
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            Password (min 8 characters)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
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

        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="w-9 h-9 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 active:scale-95 transition-all rounded-md"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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
          <span>{submitting ? 'Creating workspace...' : 'Start 14-Day Free Trial'}</span>
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="border-t border-slate-200 pt-5 text-center text-xs sm:text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 transition-colors underline sm:no-underline sm:hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
}
