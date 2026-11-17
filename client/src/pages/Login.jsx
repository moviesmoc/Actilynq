import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Sign in to your workspace</h1>
        <p className="text-sm text-neutral-600">
          Access your travel enquiry queue and Next-Action recommendations
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <div className="mb-5">
        <GoogleLoginButton onError={(msg) => setError(msg)} />
      </div>

      <div className="relative flex py-2 items-center mb-5">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">Or with email</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="agent@travelagency.com"
            className="input-base text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-neutral-900">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
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
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="border-t border-neutral-200 pt-6 text-center text-sm text-neutral-600">
        New to ActiLynq?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-600 transition-colors">
          Start 14-Day Free Trial
        </Link>
      </div>
    </div>
  );
}

