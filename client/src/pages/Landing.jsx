import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Zap,
  Users,
  CheckCircle2,
  Phone,
  Activity,
  BarChart3,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Layers,
  Star,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Send,
  Bell,
  Check,
  Building2,
  Menu,
  X
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const SPONSOR_PHONE = '+91 7359510771';
  const WHATSAPP_LINK_BASE = 'https://wa.me/917359510771';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const TESTIMONIALS = [
    {
      name: 'Vikram Singhania',
      role: 'Director, Odyssey Luxury Holidays, Mumbai',
      quote:
        'ActiLynq eliminated our biggest revenue leakage—quotations sent that nobody followed up on. Our booking conversion jumped 38% in the first 60 days.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80'
    },
    {
      name: 'Meera Joshi',
      role: 'Founder, Wanderlust Escapes, Ahmedabad',
      quote:
        'The Click-to-WhatsApp templates and Next-Action recommendations keep my 5 sales agents completely accountable without daily micromanagement.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80'
    },
    {
      name: 'Rohan Verma',
      role: 'Head of Sales, Royal India Journeys, New Delhi',
      quote:
        'The travel-specific fields—destinations, traveller count, flight dates, and stage progression—make generic corporate CRMs look completely outdated.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Top Banner: 14-Day Free Trial Announcement */}
      <div className="bg-slate-950 text-slate-300 py-2 px-4 text-xs border-b border-slate-800 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-semibold text-teal-400">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>New in ActiLynq 2.0:</span>
        </span>
        <span className="hidden sm:inline">14-Day Full Access Free Trial &bull; Real Google OAuth &bull; Dedicated Sales Agent Seats</span>
        <span className="sm:hidden">14-Day Free Trial Available</span>
        <Link
          to="/register"
          className="underline font-semibold text-white hover:text-teal-300 ml-1 transition-colors"
        >
          Claim Trial &rarr;
        </Link>
      </div>

      {/* Sticky Frosted Glass Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
            : 'bg-white/60 backdrop-blur-xs border-b border-slate-200/50 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-teal-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Acti<span className="text-teal-700">Lynq</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Travel CRM &amp; Co-pilot
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#pipeline" className="hover:text-teal-700 transition-colors">
              Sales Pipeline
            </a>
            <a href="#engine" className="hover:text-teal-700 transition-colors">
              Next-Action Engine
            </a>
            <a href="#features" className="hover:text-teal-700 transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-teal-700 transition-colors">
              Pricing Plans
            </a>
            <a href="#testimonials" className="hover:text-teal-700 transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="hover:text-teal-700 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-teal-800 px-3.5 py-2 rounded-lg hover:bg-slate-100/80 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold px-4 py-2.5 rounded-full bg-gradient-to-r from-teal-700 to-teal-900 text-white shadow-md shadow-teal-900/20 hover:shadow-teal-900/30 hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-xl">
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Sales Pipeline
            </a>
            <a
              href="#engine"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Next-Action Engine
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Pricing Plans
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Reviews
            </a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2 text-xs font-bold text-white bg-teal-800 rounded-lg"
              >
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION (Matches Reference Video Frame 2-5: Grid Mesh + Floating Micro-Cards) */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 bg-gradient-to-b from-teal-50/70 via-white to-slate-50 bg-grid-mesh overflow-hidden">
        {/* Soft Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-teal-200/80 shadow-xs mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <span className="text-[11px] font-bold tracking-wider text-teal-800 uppercase">
              No.1 Travel CRM &amp; Next-Action Co-pilot
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Empower Your Travel Team With{' '}
            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Smart Next-Action CRM
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate lost callbacks, accelerate quotation follow-ups on WhatsApp, and turn raw tourist enquiries into confirmed holiday bookings with deterministic sales intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white font-bold text-sm shadow-lg shadow-teal-900/25 hover:shadow-teal-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/90 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Explore Interactive Demo</span>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" /> Setup in under 2 minutes
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal-600 stroke-[3]" /> 2 Sales Agent Seats included
            </span>
          </div>

          {/* FLOATING MICRO-UI GLASS WIDGETS (Matching the reference video) */}
          <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto min-h-[260px] sm:min-h-[320px]">
            {/* Widget 1: Top Left - Deal Card */}
            <div className="sm:absolute sm:top-2 sm:left-6 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-200/90 text-left animate-float-slow max-w-xs mb-3 sm:mb-0">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                  Confirmed Deal
                </span>
                <span className="text-xs font-bold text-slate-900">₹2,40,000</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Bali 6N Luxury Honeymoon</p>
              <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Nilesh Travels &bull; Advance Paid</span>
              </p>
            </div>

            {/* Widget 2: Top Right - Rating Card */}
            <div className="sm:absolute sm:top-4 sm:right-8 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-200/90 text-left animate-float-reverse max-w-xs mb-3 sm:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-extrabold text-slate-900">98.4%</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800">On-Time Callback Rate</p>
              <p className="text-[10px] text-slate-500">Zero forgotten enquiries across team</p>
            </div>

            {/* Widget 3: Bottom Left - Sparkline Metrics */}
            <div className="sm:absolute sm:bottom-4 sm:left-12 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-slate-200/90 text-left animate-float-gentle max-w-xs mb-3 sm:mb-0">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Monthly Conversion</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-base font-bold text-slate-900">₹38,50,000</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +34.2%
                </span>
              </div>
              {/* Minimal SVG Sparkline */}
              <svg className="w-36 h-6 mt-2 text-emerald-500" viewBox="0 0 100 20" fill="none">
                <path
                  d="M0 16 Q 20 18, 35 11 T 70 6 T 100 2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Widget 4: Center - Donut Metric Pill */}
            <div className="sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white/95 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-teal-200/90 animate-float-slow text-center max-w-[210px] mb-3 sm:mb-0">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-600"
                    strokeDasharray="78, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-slate-900">
                  78.4%
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800">Booking Velocity</p>
              <p className="text-[10px] text-teal-700 font-semibold mt-0.5">High Intent Leads</p>
            </div>

            {/* Widget 5: Bottom Right - Urgent Follow-up Alert */}
            <div className="sm:absolute sm:bottom-2 sm:right-10 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-rose-200 text-left animate-float-reverse max-w-xs">
              <div className="flex items-center gap-1.5 mb-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Overdue Callback</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Aditi Sharma &bull; Switzerland</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Scheduled callback 15m ago &bull; 1-Click WhatsApp ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D PARTNER INTEGRATION TILES (Frame 4 from reference video) */}
      <section className="py-12 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Seamlessly Connected With Modern Travel &amp; Sales Channels
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              { label: 'WhatsApp', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: WhatsAppIcon },
              { label: 'Google Workspace', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Building2 },
              { label: 'Google Calendar', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Calendar },
              { label: 'Razorpay Advances', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Activity },
              { label: 'Portal Inward Leads', color: 'bg-teal-50 text-teal-700 border-teal-200', icon: Zap },
              { label: 'Click-to-Call Cloud', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Phone }
            ].map((partner, i) => {
              const Icon = partner.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${partner.color} shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default font-semibold text-xs`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{partner.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PIPELINE MANAGEMENT SHOWCASE (Frame 6-8 from reference video) */}
      <section id="pipeline" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Travel Sales Progression
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Full Visibility Across Every Stage of the Sales Journey
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Organize enquiries through 9 deterministic travel stages—from initial Instagram/website inquiry to customized quotation, follow-ups, and confirmed bookings.
            </p>
          </div>

          {/* Interactive Mock Dashboard Container */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden max-w-5xl mx-auto">
            {/* Window Topbar */}
            <div className="bg-slate-900 text-slate-400 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono font-medium text-slate-300 ml-2">
                  actilynq.app/leads/pipeline
                </span>
              </div>
              <span className="text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                Active Tenant: Nilesh Travels (INR)
              </span>
            </div>

            {/* Pipeline Stage Pills */}
            <div className="p-4 sm:p-6 bg-slate-50/80 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                9-Stage Progression Cycle
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 text-center text-[10px] font-semibold">
                {[
                  { name: '1. New Enquiry', active: false },
                  { name: '2. Contacted', active: false },
                  { name: '3. Requirements', active: false },
                  { name: '4. Package Prep', active: false },
                  { name: '5. Quote Sent', active: true },
                  { name: '6. Follow-up', active: false },
                  { name: '7. Negotiation', active: false },
                  { name: '8. Confirmed', active: false },
                  { name: '9. Trip Done', active: false }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`py-2 px-1.5 rounded-lg border transition-all ${
                      s.active
                        ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Content Mockup */}
            <div className="p-4 sm:p-8 grid md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Sample Lead Card */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/30 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                      Selected High-Intent Enquiry
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">₹3,20,000 Estimated Value</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Rahul &amp; Priya Patel</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Destination: <strong>Maldives (5 Nights Overwater Villa)</strong> &bull; 2 Travellers &bull; Departure: 15 Dec 2026
                  </p>

                  <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Last Confirmed Contact: <strong className="text-slate-800">2 days ago via Phone Call</strong>
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded">
                      Quotation Sent
                    </span>
                  </div>
                </div>

                {/* Next-Action Engine Prompt Card */}
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start gap-3 shadow-md">
                  <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Next-Action Co-pilot Recommendation
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-1 leading-relaxed">
                      Quotation was sent 2 days ago without subsequent customer contact. Follow up on WhatsApp to discuss hotel choices before prices increase.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={WHATSAPP_LINK_BASE}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Open WhatsApp Draft</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Analytics Metrics */}
              <div className="md:col-span-5 space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Active Enquiries in Funnel</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">48 Leads</p>
                  <p className="text-xs text-teal-700 font-semibold mt-1">₹62.8 Lakhs pipeline value</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Average Quote Turnaround</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">3.2 Hours</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">4.5x faster than market average</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Sales Executive Attribution</p>
                  <p className="text-xs text-slate-700 mt-1">
                    Multi-user team support with isolated sales seats &amp; audit trails.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL FEATURE CARDS: NOTIFICATIONS & AVAILABILITY (Frames 8-10 from reference video) */}
      <section id="engine" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Feature Card 1: Smart Notifications / Next-Action Engine */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Deterministic Next-Action Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Clear, rule-based business logic that highlights exactly what to do next on each enquiry—without AI hallucinations or guesswork.
                </p>
              </div>

              {/* Stacked Angled Notification Mockups (Matches Video Frame 9) */}
              <div className="mt-8 space-y-2.5">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-rose-200 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Overdue Callback &bull; Aditi Sharma</p>
                    <p className="text-slate-500 text-[11px]">Scheduled callback 15m ago &bull; Switzerland package</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl shadow-xs border border-amber-200 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Quotation Follow-Up &bull; Rahul Patel</p>
                    <p className="text-slate-500 text-[11px]">Quotation sent 2 days ago &bull; No contact recorded</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl shadow-xs border border-teal-200 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Missing Information &bull; Karan Johar</p>
                    <p className="text-slate-500 text-[11px]">Traveller count &amp; departure city required</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to="/register"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5"
                >
                  <span>See How Rule Precedence Works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature Card 2: Click-to-WhatsApp & Availability Management */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Instant WhatsApp Follow-ups &amp; Callbacks
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Start conversations directly with customers with pre-generated personalized itinerary messages. Schedule exact callback times so deals never go cold.
                </p>
              </div>

              {/* Time Scheduling Mockup (Matches Video Frame 9) */}
              <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Agent Working Hours &amp; Callbacks</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center font-mono font-medium">
                    09:30 AM
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center font-mono font-medium">
                    07:00 PM
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Dual Customer Contact Validation:</span>
                  <span className="font-bold text-teal-800">Calls &bull; WhatsApp &bull; Notes</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to="/register"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5"
                >
                  <span>Explore WhatsApp Integration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-COLUMN SOCIAL PROOF METRICS (Frame 9 from reference video) */}
      <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 tracking-tight">
                3.4x
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-2">Faster Enquiry Follow-ups</p>
              <p className="text-[11px] text-slate-400 mt-1">Next actions surfaced in under 1 second</p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 tracking-tight">
                0%
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-2">Forgotten Enquiries</p>
              <p className="text-[11px] text-slate-400 mt-1">Automatic alert triggers on overdue callbacks</p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 tracking-tight">
                ₹18Cr+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-2">Holiday Bookings Tracked</p>
              <p className="text-[11px] text-slate-400 mt-1">Across 250+ travel agency teams</p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 tracking-tight">
                100%
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-2">Deterministic Business Rules</p>
              <p className="text-[11px] text-slate-400 mt-1">Zero AI hallucinations or unpredictable drift</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENT PRICING SECTION (Frames 11-13 from reference video + Direct WhatsApp integration) */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-800 bg-teal-100 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Transparent Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Fair &amp; Predictable Pricing Built for Travel Agencies
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Start with a 14-day free trial. Choose a plan tailored to your agency size or chat with our founder directly on WhatsApp for custom setup.
            </p>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Card 1: Starter */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Starter Plan</h3>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Solo &bull; Boutique
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  For solo travel planners &amp; boutique holiday consultants.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                  or ₹9,990 / year (2 months free on annual)
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Plan Features Included:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span><strong>2 Sales Agent Seats</strong> included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>9-stage visual sales progression funnel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Deterministic Next-Action Engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Click-to-WhatsApp draft messaging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Standard email support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Start 14-Day Free Trial
                </button>
                <a
                  href={`${WHATSAPP_LINK_BASE}?text=Hi%2C%20I%20am%20interested%20in%20ActiLynq%20Starter%20Plan%20(%E2%82%B9999%2Fmo).`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 2: Growth (Featured - Most Popular) */}
            <div className="bg-gradient-to-b from-white to-teal-50/40 rounded-3xl p-6 sm:p-8 border-2 border-teal-600 shadow-xl relative flex flex-col justify-between">
              {/* Most Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-700 to-teal-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-300" />
                <span>Most Popular for Agencies</span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Growth Plan</h3>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    5 Agent Seats
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  For growing travel agencies with a dedicated sales team.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹2,499</span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                  or ₹24,990 / year (save ₹4,998)
                </p>

                <div className="mt-6 pt-6 border-t border-teal-100 space-y-3">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Everything in Starter, plus:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span><strong>Up to 5 Sales Agent Seats</strong> included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Automated overdue callback alerts &amp; radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Dual customer contact verification tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Team sales pipeline &amp; conversion reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Priority WhatsApp &amp; phone assistance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-800 text-white font-bold text-xs shadow-md hover:bg-teal-700 transition-colors"
                >
                  Start 14-Day Free Trial
                </button>
                <a
                  href={`${WHATSAPP_LINK_BASE}?text=Hi%2C%20I%20am%20interested%20in%20ActiLynq%20Growth%20Plan%20(%E2%82%B92499%2Fmo).`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Connect with Founder on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 3: Agency Pro */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Agency Pro</h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Multi-Branch
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  For established tour operators with large sales forces.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹4,999</span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>
                <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                  or ₹49,990 / year (+ ₹399/extra seat)
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Everything in Growth, plus:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span><strong>12 Sales Agent Seats</strong> included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Branch Manager role &amp; agent oversight</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Full enquiry audit logs &amp; reassignments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Custom agency branding &amp; currency setup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span>Dedicated Account Manager &amp; Phone Hotline</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Start 14-Day Free Trial
                </button>
                <a
                  href={`${WHATSAPP_LINK_BASE}?text=Hi%2C%20I%20am%20interested%20in%20ActiLynq%20Agency%20Pro%20Plan%20(%E2%82%B94999%2Fmo).`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sponsor Direct Contact Strip */}
          <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white border border-teal-200 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Need a custom deployment, multi-branch setup, or direct consultation?
                </p>
                <p className="text-[11px] text-slate-500">
                  Speak directly with our team at <strong className="text-slate-800 font-semibold">{SPONSOR_PHONE}</strong>.
                </p>
              </div>
            </div>
            <a
              href={`${WHATSAPP_LINK_BASE}?text=Hello%20ActiLynq%20Team%2C%20I%20want%20to%20discuss%20a%20custom%20plan%20for%20my%20travel%20agency.`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-xs"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp Founder</span>
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER SECTION (Frames 14-16 from reference video) */}
      <section id="testimonials" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Founder Reviews
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Trusted by 250+ Growing Travel Agencies
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                See how tour operators eliminate leakage and double booking conversions.
              </p>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))
                }
                className="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonialIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))
                }
                className="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => {
              const isSelected = idx === activeTestimonialIdx;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-teal-400 bg-gradient-to-br from-teal-50/50 to-white shadow-lg ring-1 ring-teal-400'
                      : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      Verified Agency
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                      <p className="text-[10px] text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-teal-800 bg-teal-100 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about setting up ActiLynq for your agency.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does the 14-day free trial work?',
                a: 'You get instant full access to the entire platform—including 2 sales agent seats, the Next-Action Engine, and WhatsApp drafts. No credit card is required. When your trial ends, you can renew by contacting our sponsor on WhatsApp or choosing one of our affordable plans.'
              },
              {
                q: 'Can multiple sales agents log in under the same business?',
                a: 'Yes! As the workspace owner, you can go to Settings -> Team Members and add multiple sales agents with their name, work email, and role. When they log in, they land directly on your agency dashboard with permissions suited to their role.'
              },
              {
                q: 'Does ActiLynq spam customers automatically?',
                a: 'No. ActiLynq generates personalized WhatsApp drafts with client names, dates, and destination details in one click, but the sales executive initiates the message. This ensures compliance with WhatsApp policies and maintains authentic customer trust.'
              },
              {
                q: 'Is the Next-Action Engine AI or rules?',
                a: 'ActiLynq uses a deterministic, rule-based engine. It checks 5 strict business conditions (overdue callbacks, quotation follow-up delays, missing travel details, stalled leads) with transparent reasoning explanations so your salespeople always know WHY an action is recommended.'
              },
              {
                q: 'How do I renew or upgrade my plan?',
                a: 'You can connect directly with our founder on WhatsApp (+91 7359510771) or use the contact button inside your workspace. We support UPI, Net Banking, and Credit Cards via Razorpay.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-teal-300 transition-colors cursor-pointer"
              >
                <summary className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm select-none outline-none">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* PRE-FOOTER HIGH-CONVERTING CTA BANNER (Frame 17-18 from reference video) */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Never Lose Another Travel Booking?
          </h2>
          <p className="mt-4 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start your 14-day free trial today. Join 250+ tour operators who follow up faster, close more itineraries, and grow their agency revenue.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <span>Create Free Agency Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`${WHATSAPP_LINK_BASE}?text=Hi%2C%20I%20am%20interested%20in%20ActiLynq%20Travel%20CRM.`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-xs transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Founder (+91 7359510771)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4-COLUMN FOOTER (Frame 18 from reference video) */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
            {/* Col 1: Brand & Tagline */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center">
                  <Compass className="w-4 h-4 text-teal-300" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">ActiLynq</span>
              </div>
              <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
                The high-performance sales action platform and Next-Action Co-pilot built specifically for modern travel agencies and holiday tour operators.
              </p>
              <div className="pt-2 text-slate-400">
                <p className="font-semibold text-slate-200">Sponsor / Direct Support:</p>
                <p className="font-mono text-teal-400">{SPONSOR_PHONE}</p>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Product</p>
              <ul className="space-y-1.5">
                <li><a href="#pipeline" className="hover:text-teal-400 transition-colors">Sales Pipeline</a></li>
                <li><a href="#engine" className="hover:text-teal-400 transition-colors">Next-Action Engine</a></li>
                <li><a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing Plans</a></li>
                <li><a href="#features" className="hover:text-teal-400 transition-colors">Team Access</a></li>
              </ul>
            </div>

            {/* Col 3: Integrations */}
            <div className="space-y-2.5">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Integrations</p>
              <ul className="space-y-1.5">
                <li><a href="#engine" className="hover:text-teal-400 transition-colors">WhatsApp Business</a></li>
                <li><a href="#features" className="hover:text-teal-400 transition-colors">Google OAuth</a></li>
                <li><a href="#features" className="hover:text-teal-400 transition-colors">Gmail SMTP</a></li>
                <li><a href="#features" className="hover:text-teal-400 transition-colors">Calendar Callbacks</a></li>
              </ul>
            </div>

            {/* Col 4: Account & Auth */}
            <div className="space-y-2.5">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Account</p>
              <ul className="space-y-1.5">
                <li><Link to="/login" className="hover:text-teal-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-teal-400 transition-colors">Start Free Trial</Link></li>
                <li><Link to="/forgot-password" className="hover:text-teal-400 transition-colors">Reset Password</Link></li>
                <li><a href={`${WHATSAPP_LINK_BASE}?text=Hi%20Nilesh%2C%20need%20help%20with%20ActiLynq.`} target="_blank" rel="noreferrer" className="hover:text-teal-400 transition-colors">WhatsApp Help</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <p>&copy; {new Date().getFullYear()} ActiLynq Travel CRM. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
