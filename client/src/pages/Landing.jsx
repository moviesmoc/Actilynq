import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ChevronDown,
  ArrowRight,
  Zap,
  Users,
  MessageCircle,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  Phone,
  Activity,
  BarChart3,
  MapPin,
  Calendar,
  HelpCircle,
  Menu,
  X,
  Kanban,
  Sparkles
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-neutral-200/50 shadow-sm' : 'bg-white border-b border-neutral-200'}`}>
        <div className="section-container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-brand-700 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Acti<span className="text-brand-700">Lynq</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-sm font-medium text-neutral-700 hover:text-brand-700 transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-brand-700 transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium text-neutral-700 hover:text-brand-700 transition-colors">
              Features
            </a>
            <a href="#faq" className="text-sm font-medium text-neutral-700 hover:text-brand-700 transition-colors">
              FAQ
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-700 hover:text-brand-700 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary btn-sm"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-neutral-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <div className="section-container py-4 space-y-3">
              <a href="#product" className="block text-sm font-medium text-neutral-700 hover:text-brand-700">
                Product
              </a>
              <a href="#how-it-works" className="block text-sm font-medium text-neutral-700 hover:text-brand-700">
                How It Works
              </a>
              <a href="#features" className="block text-sm font-medium text-neutral-700 hover:text-brand-700">
                Features
              </a>
              <a href="#faq" className="block text-sm font-medium text-neutral-700 hover:text-brand-700">
                FAQ
              </a>
              <div className="pt-3 border-t border-neutral-200 space-y-2">
                <Link
                  to="/login"
                  className="block text-sm font-medium text-neutral-700 hover:text-brand-700"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full btn-primary btn-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-neutral-50 via-neutral-50 to-brand-50/20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>

        <div className="section-container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full w-fit">
                <Sparkles className="w-4 h-4 text-brand-700" />
                <span className="text-xs font-medium text-brand-700">Next-Action Engine inside</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-neutral-900">
                  Keep every travel enquiry <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-600">moving</span>.
                </h1>
              </div>

              <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
                ActiLynq tells your team exactly what to do next. Organize enquiries, track activities, and never miss a follow-up.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold hover:shadow-lg hover:shadow-brand-700/20 transition-all duration-200 group"
                >
                  Create Your Workspace
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/login"
                  className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold hover:shadow-md transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-6 text-sm text-neutral-600 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>No card required</span>
                </div>
              </div>
            </div>

            {/* Hero Visual: Product Preview */}
            <div className="relative group animate-in fade-in slide-in-from-right duration-700 delay-200">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500 pointer-events-none" />

              <div className="relative bg-white rounded-2xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500 group-hover:border-brand-200/50">
                <div className="space-y-6">
                  {/* Action Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
                    <div>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Next Recommended Action</p>
                      <h3 className="text-lg font-bold text-neutral-900 mt-2">Follow up with Rahul Patel</h3>
                    </div>
                    <div className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 animate-pulse">
                      High Priority
                    </div>
                  </div>

                  {/* Customer Details - Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                      <p className="text-xs text-neutral-500 font-semibold mb-1">Customer</p>
                      <p className="text-sm font-bold text-neutral-900">Rahul Patel</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                      <p className="text-xs text-neutral-500 font-semibold mb-1">Destination</p>
                      <p className="text-sm font-bold text-neutral-900">Dubai, UAE</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                      <p className="text-xs text-neutral-500 font-semibold mb-1">Travellers</p>
                      <p className="text-sm font-bold text-neutral-900">4 pax</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                      <p className="text-xs text-neutral-500 font-semibold mb-1">Est. Value</p>
                      <p className="text-sm font-bold text-neutral-900">₹80,000</p>
                    </div>
                  </div>

                  {/* Why this action */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Why:</span> Quotation sent 3 days ago. No customer contact since then.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 active:scale-95 transition-all duration-200 group/btn shadow-md hover:shadow-lg">
                      <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      WhatsApp
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-900 text-sm font-semibold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all duration-200 group/btn">
                      <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="product" data-animate="problems" className="py-20 md:py-32 bg-white border-t border-neutral-200">
        <div className="section-container">
          <div className="mb-16" data-animate="problems-header">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
              The challenge travel agencies face.
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl">
              Without a clear system, important leads slip through the cracks and revenue stays on the table.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'Multiple enquiry sources',
                description: 'Enquiries arrive through websites, calls, referrals and walk-ins. Tracking them in one place is difficult.'
              },
              {
                icon: Users,
                title: 'Incomplete travel requirements',
                description: 'Customers don\'t always provide all details upfront. Managing incomplete enquiries adds complexity.'
              },
              {
                icon: Clock,
                title: 'Quotations need timely follow-ups',
                description: 'Without reminders, quotations go unacknowledged and potential sales are lost to forgotten callbacks.'
              },
              {
                icon: TrendingUp,
                title: 'Limited visibility into pipeline',
                description: 'Agencies struggle to see which enquiries are advancing and which need immediate attention.'
              }
            ].map((problem, i) => {
              const Icon = problem.icon;
              return (
                <div
                  key={i}
                  className="flex gap-4 group p-6 rounded-xl hover:bg-neutral-50 transition-all duration-300 border border-transparent hover:border-brand-200 animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-brand-50 group-hover:bg-brand-100 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-brand-700 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900">{problem.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-animate="how-it-works" className="py-20 md:py-32 bg-neutral-50 border-t border-neutral-200">
        <div className="section-container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">How ActiLynq works.</h2>
            <p className="text-xl text-neutral-600 max-w-2xl">
              A clear workflow that keeps every enquiry moving forward.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { number: '1', title: 'Capture enquiry', description: 'Log a new customer enquiry with available information.' },
              { number: '2', title: 'Collect requirements', description: 'Gradually gather travel details through conversations and interactions.' },
              { number: '3', title: 'Track progress', description: 'Record all activities, notes, and updates in one timeline.' },
              { number: '4', title: 'Next-Action Engine evaluates', description: 'The system analyzes the enquiry status and determines the next recommended action.' },
              { number: '5', title: 'Action Center shows recommendation', description: 'Salespeople see prioritized actions they should take today.' },
              { number: '6', title: 'Record outcome', description: 'Log the result and move the enquiry forward in the sales workflow.' }
            ].map((item, idx) => (
              <div
                key={item.number}
                className="flex gap-6 items-start p-6 rounded-xl bg-white border border-neutral-200 hover:border-brand-200 hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-left duration-500"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-brand-700 to-teal-600 text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300 shadow-md">
                    {item.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-neutral-900">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Workflow Section */}
      <section data-animate="workflow" className="py-20 md:py-32 bg-white border-t border-neutral-200">
        <div className="section-container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">The travel sales workflow.</h2>
            <p className="text-xl text-neutral-600">Nine stages from first enquiry to confirmed booking.</p>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-flex gap-3 pb-6 min-w-full md:min-w-auto md:justify-between md:gap-0">
              {[
                'New Enquiry',
                'Contacted',
                'Requirements\nCollected',
                'Package\nPreparation',
                'Quotation\nSent',
                'Follow-up',
                'Negotiation',
                'Booking\nConfirmed'
              ].map((stage, i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0 md:flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-700 to-teal-600 text-white flex items-center justify-center text-sm font-bold mb-3 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                      <span className="group-hover:scale-110 transition-transform duration-300">{i + 1}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-center text-neutral-900 whitespace-pre-line min-h-10 md:min-h-auto">
                    {stage}
                  </p>
                  {i < 7 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-[calc(100%-3rem)] h-1 bg-gradient-to-r from-brand-300 to-teal-300 rounded-full" style={{ marginLeft: '3rem', width: 'calc(100% - 2rem)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next-Action Engine Section (Core Product) */}
      <section data-animate="engine" className="py-20 md:py-32 bg-neutral-50 border-t border-neutral-200">
        <div className="section-container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">The Next-Action Engine.</h2>
            <p className="text-xl text-neutral-600 max-w-2xl">
              A rule-based system that tells salespeople exactly what to do next—and why.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Identifies priority situations:</h3>
                <ul className="space-y-3">
                  {[
                    'Missing travel information that blocks progress',
                    'Quotations waiting to be prepared',
                    'Quotations sent but not followed up on',
                    'Scheduled callbacks that are overdue',
                    'Enquiries inactive for too long'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start group cursor-default">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-neutral-700 leading-relaxed group-hover:text-neutral-900 transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:shadow-md transition-shadow duration-300">
                <p className="text-neutral-700 leading-relaxed">
                  <span className="font-semibold text-blue-900">How it works:</span> The engine uses clear, predefined business rules—not AI or machine learning. It's transparent and deterministic.
                </p>
              </div>
            </div>

            {/* Engine Example Card */}
            <div className="relative group animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500 pointer-events-none" />

              <div className="relative bg-white rounded-2xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-brand-200/50 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Example Recommendation</p>
                  <h3 className="text-2xl font-bold text-neutral-900">Follow up with Rahul Patel today.</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Customer</p>
                    <p className="text-sm font-bold text-neutral-900">Rahul Patel</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Destination</p>
                    <p className="text-sm font-bold text-neutral-900">Dubai, UAE</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Status</p>
                    <p className="text-sm font-bold text-neutral-900">Quotation Sent</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3 hover:bg-brand-50 transition-colors duration-300">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Last Contact</p>
                    <p className="text-sm font-bold text-neutral-900">3 days ago</p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    <span className="font-semibold text-neutral-900">Why:</span> Quotation sent three days ago. No customer contact recorded since then.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate="features" className="py-20 md:py-32 bg-white border-t border-neutral-200">
        <div className="section-container">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">Built for travel sales.</h2>
            <p className="text-xl text-neutral-600 max-w-2xl">
              Everything travel agencies need to manage enquiries efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Travel-Specific Lead Management', description: 'Designed for travel enquiries with fields for destinations, traveller counts, and dates.' },
              { icon: Activity, title: 'Activity Timeline', description: 'Complete record of every interaction, note, and milestone in the sales process.' },
              { icon: Kanban, title: 'Sales Pipeline', description: 'Visual workflow showing where each enquiry stands in the 9-stage sales process.' },
              { icon: Zap, title: 'Next-Action Engine', description: 'Rule-based system that automatically identifies the next priority action.' },
              { icon: Target, title: 'Action Center', description: 'Prioritized queue of recommended actions updated in real time.' },
              { icon: Clock, title: 'Follow-up Scheduling', description: 'Set reminders for follow-ups, callbacks, and scheduled touchpoints.' },
              { icon: MessageCircle, title: 'Click-to-WhatsApp', description: 'Quick access to customer WhatsApp from any screen in the platform.' },
              { icon: BarChart3, title: 'Dashboard & Reports', description: 'Visibility into enquiry flow, conversion rates, and team performance.' }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col p-6 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-brand-200 hover:shadow-lg transition-all duration-300 group cursor-default animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-brand-700 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-900">{feature.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" data-animate="faq" className="py-20 md:py-32 bg-neutral-50 border-t border-neutral-200">
        <div className="section-container">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">Frequently asked questions.</h2>
            <p className="text-xl text-neutral-600">Everything you need to know about ActiLynq.</p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {[
              {
                q: 'What is ActiLynq?',
                a: 'ActiLynq is a sales action platform designed specifically for travel agencies. It helps manage customer enquiries, track interactions, and automatically recommend the next actions salespeople should take.'
              },
              {
                q: 'Who can use ActiLynq?',
                a: 'ActiLynq is designed for travel agency owners, managers, and sales executives who need to manage customer enquiries and follow-up actions efficiently.'
              },
              {
                q: 'Does it automatically send WhatsApp messages?',
                a: 'No. ActiLynq provides quick links to start WhatsApp conversations, but it does not automatically send messages. All communication is initiated by the salesperson.'
              },
              {
                q: 'Is the Next-Action Engine AI-powered?',
                a: 'No. The engine is rule-based and deterministic. It uses clear, predefined business logic to identify priority situations—not machine learning or AI.'
              },
              {
                q: 'Does it book flights and hotels?',
                a: 'No. ActiLynq is not a booking engine. It is a sales management platform. It helps agencies track enquiries and manage follow-ups, not book travel services.'
              },
              {
                q: 'Can we manage incomplete enquiries?',
                a: 'Yes. ActiLynq supports incomplete enquiries. Travel requirements can be added gradually as you learn more about the customer\'s needs.'
              },
              {
                q: 'How are recommended actions generated?',
                a: 'Actions are generated using predefined business rules that evaluate the enquiry stage, customer contact history, follow-up dates, and travel information completeness.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md hover:border-brand-200 transition-all duration-300 cursor-pointer animate-in fade-in duration-500"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <summary className="flex items-center justify-between font-semibold text-neutral-900 select-none outline-none">
                  <span className="group-hover:text-brand-700 transition-colors duration-300">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-neutral-600 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <p className="mt-4 text-neutral-700 leading-relaxed group-open:animate-in group-open:fade-in group-open:duration-300">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white via-neutral-50 to-brand-50/30 border-t border-neutral-200">
        <div className="section-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
            Ready to keep every enquiry moving?
          </h2>
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start your 14-day free trial today. No credit card required. Full access to all features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold hover:shadow-lg hover:shadow-brand-700/20 transition-all duration-200 group"
            >
              Create Your Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <Link
              to="/login"
              className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold hover:shadow-md transition-all duration-200"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800">
        <div className="section-container py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-bold text-white">ActiLynq</span>
              </div>
              <p className="text-sm">
                Sales action platform for travel agencies.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-brand-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-brand-400 transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-brand-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-brand-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-brand-400 transition-colors">Register</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <p>&copy; 2026 ActiLynq. All rights reserved.</p>
            <p>Built for travel agencies worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
