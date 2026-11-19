import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActiLynqLogo from '../components/ActiLynqLogo';
import {
  Compass,
  ArrowRight,
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  Eye,
  Database,
  UserCheck,
  Server,
  AlertCircle
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function PrivacyPolicy() {
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
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            <span>Compliance &amp; Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            How ActiLynq protects your agency's tourist enquiries, customer itineraries, quotation details, and team data with strict multi-tenant isolation and DPDP Act 2023 compliance.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Effective Date: November 19, 2026
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Version: 2.4 (Enterprise B2B Edition)
            </span>
          </div>

          {/* Sub-nav Legal Switcher */}
          <div className="mt-10 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/90 max-w-full overflow-x-auto">
            <Link
              to="/privacy"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-teal-800 shadow-xs whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
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
          
          {/* Executive Commitment Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/60 border border-teal-200 text-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-700 flex-shrink-0" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Our Core Privacy Guarantee to Travel Operators
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              ActiLynq operates exclusively as a B2B Software-as-a-Service sales tool. <strong>We never sell, rent, monetize, or broker your customer leads or holiday quotation pricing to any third party, marketing network, OTA, or competing travel agency.</strong> Your tourist enquiries belong 100% to your agency. Furthermore, we do not train generative public AI models on your proprietary booking data.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>Introduction &amp; Scope</span>
            </h2>
            <p>
              ActiLynq ("ActiLynq Technologies", "we", "our", or "us"), founded by Nilesh Dhankani, provides a multi-tenant cloud sales action platform and Next-Action Co-pilot tailored specifically for modern travel agencies, holiday tour operators, and destination management companies (DMCs).
            </p>
            <p>
              This Privacy Policy explains how we collect, process, store, and safeguard data when you create an agency account, use our dashboard, add team sales agents, or input customer holiday enquiries. Under data protection regulations, including the <strong>Digital Personal Data Protection Act, 2023 (India)</strong>, ActiLynq acts as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Data Controller</strong> for your travel agency's workspace account information (business name, owner email, billing address, agent credentials).
              </li>
              <li>
                <strong>Data Processor</strong> for the customer lead data, tourist inquiries, and passenger records you manage inside your private tenant database. You remain the primary Data Fiduciary/Controller for your clients' details.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>Information We Collect</span>
            </h2>
            <p>We collect information strictly necessary to provide high-performance CRM operations and Next-Action sales assistance:</p>
            
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-teal-700" />
                  <span>Agency &amp; Team Data</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Registered travel agency name, owner contact email, WhatsApp/phone number, state/country, user seat allocations, agent usernames, role assignments (Super Admin, Branch Manager, Sales Agent), and authentication tokens.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>Travel Customer Enquiry Data</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Customer lead names, primary phone/WhatsApp numbers, destination preferences (e.g. Bali, Switzerland, Dubai), passenger count, proposed departure dates, hotel tier notes, quotation amounts, and scheduled callback timestamps.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Eye className="w-4 h-4 text-teal-700" />
                  <span>Integration &amp; Communication Data</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Google OAuth identity profiles (for 1-click team sign-in), transactional Gmail SMTP verification data, and client-side Click-to-WhatsApp draft intent logs. We do NOT read or store your personal end-to-end WhatsApp conversations.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Server className="w-4 h-4 text-teal-700" />
                  <span>Technical &amp; Audit Logs</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  IP addresses, session duration, browser user-agent strings, timestamped stage transitions, and audit records for enquiry reassignments across team agents.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>How We Use Your Data</span>
            </h2>
            <p>Your data is processed strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Powering the Next-Action Engine:</strong> Calculating overdue callbacks, quotation follow-up delays, missing traveler parameters, and inactive enquiries through deterministic logic.
              </li>
              <li>
                <strong>Generating Click-to-WhatsApp Itinerary Drafts:</strong> Assembling personalized greeting messages with customer names and trip dates that your sales agents can trigger with one click.
              </li>
              <li>
                <strong>Workspace Isolation &amp; Team Management:</strong> Enabling agency owners to allocate sales agent seats, restrict permissions, and review booking conversion metrics.
              </li>
              <li>
                <strong>Billing &amp; Account Lifecycles:</strong> Administering the 14-day evaluation trial, handling renewals, and managing subscription plans.
              </li>
              <li>
                <strong>Service Integrity &amp; Security:</strong> Mitigating unauthorized access, detecting abnormal login locations, and enforcing rate limiting.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>Multi-Tenant Architecture &amp; Data Isolation</span>
            </h2>
            <p>
              ActiLynq is engineered from the ground up on a multi-tenant security model:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs sm:text-sm font-mono space-y-2">
              <p className="text-teal-400 font-bold font-sans">Strict Logical Query Scoping:</p>
              <p>
                Every API call verifies signed JWT signatures containing an immutable <span className="text-amber-300">businessId</span> claim. All database queries automatically filter through:
              </p>
              <p className="text-slate-400 bg-slate-950 p-2 rounded">
                WHERE businessId = authenticatedUser.businessId
              </p>
              <p className="text-slate-300 font-sans text-xs">
                It is mathematically and architecturally impossible for any external agency or competitor to query or view your client records.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <span>Third-Party Service Providers</span>
            </h2>
            <p>
              We only engage trusted infrastructure vendors that adhere to strict data security standards:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Cloud Hosting &amp; Database Infrastructure:</strong> Enterprise-grade encrypted servers with automated point-in-time snapshots and TLS 1.3 encryption.
              </li>
              <li>
                <strong>Razorpay:</strong> PCI-DSS compliant payment gateway for processing optional subscription plans and plan renewals. ActiLynq never stores your credit card numbers or banking passwords.
              </li>
              <li>
                <strong>Google Identity Services:</strong> Facilitating secure OAuth 2.0 authentication for agency teams without storing raw Google account passwords.
              </li>
              <li>
                <strong>Transactional Mailers:</strong> Providing automated password reset verification tokens directly to your registered work email.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
              <span>Data Retention &amp; Deletion Policy</span>
            </h2>
            <p>
              Your agency owns its data throughout its operational lifecycle:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Active Workspaces:</strong> Data is retained indefinitely while your workspace remains active, enabling historical sales analytics and returning tourist inquiries.
              </li>
              <li>
                <strong>14-Day Free Trial Expiry:</strong> When a trial expires without immediate renewal, all your historical enquiry data is locked in read-only mode and preserved safely for 60 days. This allows you time to reactivate without losing quotes or leads.
              </li>
              <li>
                <strong>Right to Deletion:</strong> Workspace owners may request permanent, unrecoverable deletion of their entire agency database at any time by contacting our founder support desk.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
              <span>Your Rights Under DPDP Act 2023</span>
            </h2>
            <p>
              As an agency owner or authorized representative, you have the following enforceable rights:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="block text-slate-900 mb-1">Right to Access &amp; Summary:</strong>
                Inspect all personal and operational data stored about your agency.
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="block text-slate-900 mb-1">Right to Correction &amp; Erasure:</strong>
                Update inaccurate records or request full deletion of lead records.
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="block text-slate-900 mb-1">Right of Grievance Redressal:</strong>
                Direct access to our dedicated Grievance Officer with 48-hour SLA.
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <strong className="block text-slate-900 mb-1">Right to Nominate:</strong>
                Nominate a successor administrator in case of business transfer.
              </div>
            </div>
          </section>

          {/* Section 8: Grievance Officer & Contact */}
          <section className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              8. Grievance Officer &amp; Support Contact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              For any questions regarding this Privacy Policy, data requests, or compliance inquiries, please contact our designated Grievance &amp; Data Protection Officer directly:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold text-slate-900">Nilesh Dhankani</p>
                <p className="text-slate-500">Founder &amp; Data Protection Officer &bull; ActiLynq</p>
                <p className="text-slate-700">
                  Direct Hotline: <strong className="text-teal-700 font-mono font-bold">{FOUNDER_PHONE}</strong>
                </p>
                <p className="text-slate-700">
                  Compliance Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-700 underline font-semibold">{SUPPORT_EMAIL}</a>
                </p>
              </div>

              <a
                href={`${WHATSAPP_LINK}?text=Hello%20Nilesh%2C%20I%20have%20a%20privacy%20question%20regarding%20ActiLynq.`}
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
            <Link to="/privacy" className="font-bold text-teal-800">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms of Service</Link>
            <Link to="/security" className="hover:text-slate-900">Security Overview</Link>
            <Link to="/" className="hover:text-slate-900">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
