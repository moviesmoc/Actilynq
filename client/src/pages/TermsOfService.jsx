import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActiLynqLogo from '../components/ActiLynqLogo';
import {
  Compass,
  ArrowRight,
  FileText,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Scale,
  Users,
  CreditCard,
  Ban,
  Clock,
  HelpCircle
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function TermsOfService() {
  const FOUNDER_PHONE = '+91 7359510771';
  const SUPPORT_EMAIL = 'support@actilynq.app';
  const WHATSAPP_LINK = 'https://wa.me/917359510771';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ActiLynqLogo size="sm" theme="light" to="/" subtitle="Trust & Legal Center" />

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors hidden sm:inline-block"
            >
              &larr; Back to Home
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-teal-800 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold px-4 py-2 rounded-full bg-teal-800 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Banner */}
      <div className="bg-white border-b border-slate-200/90 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>Commercial Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing or registering your travel agency workspace on the ActiLynq sales platform.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Effective Date: November 19, 2026
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Contract Version: 2.4 (B2B Travel Platform)
            </span>
          </div>

          {/* Sub-nav Legal Switcher */}
          <div className="mt-10 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/90 max-w-full overflow-x-auto">
            <Link
              to="/privacy"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-teal-800 shadow-xs whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              to="/security"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Security Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-12 space-y-12 leading-relaxed text-slate-700 text-sm sm:text-base">
          
          {/* Executive Summary Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/60 border border-teal-200 text-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-700 flex-shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Quick Summary for Agency Owners
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              You maintain <strong>100% intellectual property and commercial ownership of all customer leads, itineraries, and quotations</strong> entered into ActiLynq. We provide the software, the deterministic Next-Action Engine, and the 9-stage pipeline. We will never sell your client data or compete with your travel agency. You can cancel your subscription and export all your data at any time.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>Acceptance &amp; Eligibility</span>
            </h2>
            <p>
              By registering an account, accessing, or using the ActiLynq website (<code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">actilynq.app</code>) or services, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
            </p>
            <p>
              You represent and warrant that you are at least 18 years of age, possess the legal capacity to enter into binding agreements, and have the full authority to bind your travel agency, tour operating firm, or legal entity to these Terms. If you do not agree to these Terms, you must not access or use the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>Description of Service</span>
            </h2>
            <p>
              ActiLynq provides a proprietary B2B SaaS platform specifically engineered for the travel agency and holiday packaging industry. Features include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>9-Stage Travel Sales Progression Funnel:</strong> Tracking enquiries from initial tourist discovery to quotation, follow-up, negotiation, confirmation, and completed holiday.
              </li>
              <li>
                <strong>Deterministic Next-Action Engine:</strong> Real-time rule evaluation alerting agents to overdue callbacks, quote follow-up lapses, missing trip requirements, and inactive enquiries.
              </li>
              <li>
                <strong>Click-to-WhatsApp Integration:</strong> Generating personalized client draft greetings with client names and package details.
              </li>
              <li>
                <strong>Multi-User Seat Governance:</strong> Isolated workspace roles (Super Admin / Workspace Owner, Branch Manager, Sales Agent) with activity auditing.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>14-Day Free Evaluation Trial</span>
            </h2>
            <p>
              We provide new travel agencies with an unrestricted <strong>14-Day Full Access Free Trial</strong>:
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-700 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">No Credit Card Required:</span>
                Zero financial commitments or credit card details are needed to start your evaluation.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Zero Surprise Charges:</span>
                You will never be automatically billed when your 14-day evaluation expires.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Lead Preservation:</span>
                If your trial ends, your client data remains safely saved in read-only mode for 60 days.
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>Subscription Plans, Billing &amp; Renewals</span>
            </h2>
            <p>
              Following your free trial, continued access requires an active paid subscription plan:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Starter Plan (₹999 / month or ₹9,990 / year):</strong> Includes 2 sales agent seats, 9-stage progression, Next-Action Engine, and standard email support.
              </li>
              <li>
                <strong>Growth Plan (₹2,499 / month or ₹24,990 / year):</strong> Includes up to 5 sales agent seats, automated overdue callback radar, team conversion reports, and priority WhatsApp founder assistance.
              </li>
              <li>
                <strong>Agency Pro Plan (₹4,999 / month or ₹49,990 / year):</strong> Includes 12 sales agent seats, multi-branch management, full enquiry audit logs, and dedicated account manager support. Extra seats are available at ₹399/seat/month.
              </li>
            </ul>
            <p className="text-xs text-slate-500">
              All subscription fees are non-refundable once billed, except where required by applicable law. Taxes (such as Indian GST) will be charged where applicable.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <span>Agency Data Ownership &amp; Intellectual Property</span>
            </h2>
            <p>
              <strong>Your Customer Data is Yours:</strong> You retain 100% full, exclusive ownership of all tourist enquiries, passenger names, phone numbers, destinations, hotel itineraries, and quotation prices uploaded to your workspace. ActiLynq acquires no ownership rights over your customer data.
            </p>
            <p>
              <strong>ActiLynq Intellectual Property:</strong> ActiLynq and its licensors own all intellectual property rights in the software, algorithms (including the Next-Action Engine rule evaluation graph), interface design, logos, trademarks, and documentation. You may not copy, reverse-engineer, decompile, or create derivative works from the platform.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
              <span>Acceptable Use &amp; WhatsApp Messaging Compliance</span>
            </h2>
            <p>You agree not to misuse ActiLynq services. You strictly agree that you will not:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                Use the platform to send unsolicited marketing spam, illegal travel offers, or deceptive visa promises.
              </li>
              <li>
                Violate Meta / WhatsApp Business policies. <strong>ActiLynq generates client-side pre-filled message drafts initiated manually by your sales agent.</strong> You are responsible for ensuring your team only communicates with customers who have consented to be contacted regarding holiday packages.
              </li>
              <li>
                Attempt to bypass multi-tenant isolation, probe our network infrastructure, or inject malicious scripts into lead notes.
              </li>
              <li>
                Resell, sub-license, or share your agency seats with unrelated third-party businesses without written approval.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
              <span>Service Level, Uptime &amp; Disclaimers</span>
            </h2>
            <p>
              ActiLynq strives to maintain a <strong>99.9% platform availability</strong> target. However, the service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that operation will be entirely uninterrupted or error-free.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Advisory Tool Disclaimer:</strong> ActiLynq's Next-Action recommendations are sales assistance prompts. The travel agency remains solely responsible for the actual fulfillment of travel packages, airline booking confirmations, hotel vouchers, pricing accuracy, and customer service delivery.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">8</span>
              <span>Limitation of Liability</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To the maximum extent permitted by applicable law, in no event shall ActiLynq Technologies, its founder Nilesh Dhankani, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, tourist bookings, agency goodwill, or data loss) arising out of or related to your use of the platform. In all cases, our total aggregate liability under these Terms shall not exceed the total fees actually paid by your agency to ActiLynq during the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">9</span>
              <span>Termination &amp; 30-Day Export Guarantee</span>
            </h2>
            <p>
              You may terminate your account at any time from your Workspace Settings or by contacting our founder support desk.
            </p>
            <p>
              <strong>Data Export Guarantee:</strong> Upon termination or plan cancellation, we provide your agency with a thirty (30) day grace window during which you can export all your customer leads, trip itineraries, and historical stage logs. Following this window, your workspace database will be permanently purged in accordance with our Privacy Policy.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">10</span>
              <span>Governing Law &amp; Dispute Resolution</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, without regard to its conflict of law principles. Any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gujarat, India</strong>.
            </p>
          </section>

          {/* Contact Section */}
          <section className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              11. Commercial &amp; Legal Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              For contract clarifications, custom agency agreements, or enterprise deployments, please contact our founder directly:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold text-slate-900">Nilesh Dhankani</p>
                <p className="text-slate-500">Founder &amp; Principal &bull; ActiLynq</p>
                <p className="text-slate-700">
                  Direct Hotline: <strong className="text-teal-700 font-mono font-bold">{FOUNDER_PHONE}</strong>
                </p>
                <p className="text-slate-700">
                  Legal Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-700 underline font-semibold">{SUPPORT_EMAIL}</a>
                </p>
              </div>

              <a
                href={`${WHATSAPP_LINK}?text=Hello%20Nilesh%2C%20I%20have%20a%20legal%20or%20terms%20question%20regarding%20ActiLynq.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Founder Desk</span>
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p>&copy; {new Date().getFullYear()} ActiLynq Travel CRM. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600">
            <Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link to="/terms" className="font-bold text-teal-800">Terms of Service</Link>
            <Link to="/security" className="hover:text-slate-900">Security Overview</Link>
            <Link to="/" className="hover:text-slate-900">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
