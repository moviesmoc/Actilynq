import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, AlertCircle, Eye, EyeOff, Mail, CheckCircle2, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // OTP Verification State
  const [otp, setOtp] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [devNotice, setDevNotice] = useState('');

  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  // If redirected with ?verify=true&email=...
  useEffect(() => {
    const isVerify = searchParams.get('verify') === 'true';
    const emailParam = searchParams.get('email');
    if (isVerify && emailParam) {
      setVerifyEmail(emailParam);
      setEmail(emailParam);
      setStep('verify');
    }
  }, [searchParams]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer = null;
    if (step === 'verify' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendCountdown]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDevNotice('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Basic client phone validation
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 7) {
      setError('Please enter a valid WhatsApp or phone number');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({
        businessName,
        name,
        email: email.trim(),
        phone: cleanPhone,
        password
      });

      if (res?.requiresVerification) {
        setVerifyEmail(email.trim());
        setStep('verify');
        setResendCountdown(60);

        if (res.devOtp) {
          setOtp(res.devOtp);
          setDevNotice(`Instant Verification Code: ${res.devOtp} (Pre-filled below so you can proceed immediately without waiting for email delivery)`);
        } else if (res.emailError) {
          setError(`Email dispatch note: ${res.emailError}. Check server SMTP credentials or spam folder.`);
        } else {
          setOtp('');
        }
      } else {
        navigate('/app');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendSuccess('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp(verifyEmail, cleanOtp);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0 || resendLoading) return;
    setError('');
    setResendSuccess('');
    setResendLoading(true);

    try {
      const res = await resendOtp(verifyEmail);
      setResendCountdown(60);

      if (res?.devOtp) {
        setOtp(res.devOtp);
        setDevNotice(`Instant Verification Code: ${res.devOtp} (Pre-filled below so you can proceed immediately without waiting for email delivery)`);
      } else if (res?.emailError) {
        setError(`Email dispatch note: ${res.emailError}. Check server SMTP credentials or spam folder.`);
      }

      setResendSuccess(res?.message || 'A fresh verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  // STEP 2: VERIFICATION OTP SCREEN
  if (step === 'verify') {
    return (
      <div className="animate-in fade-in duration-200">
        <div className="mb-5 sm:mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Mail className="w-6 h-6 text-teal-700" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Verify Your Email
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            We sent a 6-digit verification code to
          </p>
          <p className="text-xs sm:text-sm font-bold text-teal-800 break-all mt-0.5">
            {verifyEmail}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Instant Verification Code Card when email delivery is delayed on cloud hosts */}
        {devNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-teal-50/90 border-2 border-teal-500/40 text-xs text-teal-950 flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
            <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-extrabold text-teal-900 uppercase tracking-wide text-[11px] block mb-0.5">Instant Verification Code:</span>
              <span className="font-medium text-teal-800">{devNotice}</span>
            </div>
          </div>
        )}

        {/* Spam / Junk Folder Tip */}
        <div className="mb-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
          <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Can't find the email?</strong> Please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> tab. Automated verification emails often land there on first delivery.
          </div>
        </div>

        {/* Resend Success Notification */}
        {resendSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{resendSuccess}</span>
          </div>
        )}

        <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              required
              autoFocus
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••••"
              className="w-full text-center font-mono font-extrabold text-2xl sm:text-3xl tracking-[0.4em] py-3.5 px-4 rounded-xl border-2 border-teal-500/80 bg-teal-50/20 text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-700 transition-all placeholder:text-slate-300"
            />
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 inline" />
              <span>Expires in 15 minutes &bull; Check spam folder if not received</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || otp.trim().length !== 6}
            className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-md shadow-teal-900/15 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Verifying code...' : 'Verify & Launch Workspace'}</span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2.5 pt-3 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Didn't receive the email?</span>
            {resendCountdown > 0 ? (
              <span className="font-semibold text-slate-400">
                Resend in {resendCountdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 underline"
              >
                {resendLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>Resend Code</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setStep('form');
              setError('');
              setResendSuccess('');
            }}
            className="text-slate-500 hover:text-slate-800 text-xs font-semibold inline-flex items-center gap-1 transition-colors mt-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Change email or agency details</span>
          </button>
        </div>
      </div>
    );
  }

  // STEP 1: REGISTRATION DETAILS FORM
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
      <form onSubmit={handleRegisterSubmit} className="space-y-3.5 sm:space-y-4 mb-5 sm:mb-6">
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp / Mobile Number</span>
            </label>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              For Lead Alerts
            </span>
          </div>
          <input
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="input-base font-medium"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Used for WhatsApp lead notifications and 1-on-1 CRM onboarding
          </p>
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
          <span>{submitting ? 'Sending verification code...' : 'Continue to Verification'}</span>
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* Direct link for users with an existing unverified code */}
      <div className="text-center mb-3">
        <button
          type="button"
          onClick={() => {
            if (email.trim()) {
              setVerifyEmail(email.trim());
              setStep('verify');
            } else {
              setError('Please enter your email address above, then click here to enter your 6-digit code.');
            }
          }}
          className="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline transition-colors cursor-pointer"
        >
          Already have a verification code? Click to enter code
        </button>
      </div>

      {/* Sign In Link */}
      <div className="border-t border-slate-200 pt-4 text-center text-xs sm:text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 transition-colors underline sm:no-underline sm:hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
}
