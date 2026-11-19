import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActiLynqLogo from '../components/ActiLynqLogo';
import {
  Compass,
  ArrowRight,
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Server,
  Database,
  CheckCircle2,
  Phone,
  Cpu,
  Layers,
  FileCheck,
  Zap,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function SecurityOverview() {
  const FOUNDER_PHONE = '+91 7359510771';
  const SECURITY_EMAIL = 'security@actilynq.app';
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Tenant Enterprise Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Security Overview
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            How ActiLynq safeguards over ₹18 Crores in holiday bookings, confidential traveler itineraries, and agency quotation databases with modern defense-in-depth principles.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational (99.9% Uptime)
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Encryption: TLS 1.3 &bull; AES-256
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
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              to="/security"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-teal-800 shadow-xs whitespace-nowrap"
            >
              Security Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Main Legal Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-12 space-y-12 leading-relaxed text-slate-700 text-sm sm:text-base">
          
          {/* Architecture Visual Mockup */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-300 ml-2">actilynq-security-mesh.config</span>
              </div>
              <span className="text-[11px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/60">
                ACTIVE MULTI-TENANCY GUARD
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs font-mono pt-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-teal-400 font-bold">1. Edge Ingress</p>
                <p className="text-slate-400">Strict TLS 1.3 encryption, DDoS mitigation, and HTTP security headers.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-amber-400 font-bold">2. JWT Scope Guard</p>
                <p className="text-slate-400">Cryptographically verified businessId injection; zero trust for client headers.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-emerald-400 font-bold">3. Database Isolation</p>
                <p className="text-slate-400">Query-level tenant partitioning with AES-256 at-rest volume encryption.</p>
              </div>
            </div>
          </div>

          {/* Section 1: Multi-Tenancy */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>Cryptographic Multi-Tenancy &amp; Data Isolation</span>
            </h2>
            <p>
              In B2B travel CRM operations, ensuring that <strong>Agency A never sees Agency B's holiday customer enquiries or customized quotation markups</strong> is our highest architectural mandate.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Signed JWT Authentication:</strong> Every HTTP session transmits a cryptographically signed JSON Web Token (HMAC-SHA256) containing an immutable <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">businessId</code> claim. The backend never accepts or trusts client-supplied tenant headers.
              </li>
              <li>
                <strong>Automated Database Query Scoping:</strong> Our backend middleware enforces mandatory scoping across 100% of lead lookups, quotation updates, stage transitions, and activity logs. A query without a validated tenant predicate is rejected by design.
              </li>
              <li>
                <strong>Demo Workspace Sandboxing:</strong> Academic and demo workspaces operate in strictly isolated tenant partitions and cannot cross-contaminate live commercial travel agency accounts.
              </li>
            </ul>
          </section>

          {/* Section 2: Encryption */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>Data Encryption In Transit &amp; At Rest</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4 pt-1">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <span>Encryption In Transit (TLS 1.3)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All browser-to-server and server-to-database communications are secured using modern TLS 1.3 protocols with Perfect Forward Secrecy (PFS). Plaintext HTTP traffic is rejected and automatically upgraded to HTTPS with HTTP Strict Transport Security (HSTS).
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>Encryption At Rest (AES-256)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All persistent database records, client quotation archives, and automated daily backups are encrypted at rest using industry-standard AES-256 encryption with securely managed cryptographic keys.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Password Security & Identity */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>Authentication, Identity &amp; Role-Based Access Control</span>
            </h2>
            <p>
              ActiLynq employs rigorous access governance to protect accounts from credential theft and unauthorized elevation of privilege:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>One-Way Password Hashing:</strong> Passwords are never stored in plaintext. We utilize industry-standard adaptive hashing (Bcrypt/Argon2) with high work factors and unique salts per user to prevent rainbow-table and dictionary attacks.
              </li>
              <li>
                <strong>Role-Based Access Control (RBAC):</strong> Three explicit authorization tiers are strictly enforced:
                <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                    <strong className="text-slate-900 block">Workspace Owner:</strong> Full agency oversight, team seat invitations, and billing authority.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                    <strong className="text-slate-900 block">Branch Manager:</strong> Pipeline monitoring, agent reassignments, and performance auditing.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                    <strong className="text-slate-900 block">Sales Agent:</strong> Managing assigned client enquiries, stage updates, and WhatsApp drafts.
                  </div>
                </div>
              </li>
              <li>
                <strong>Google OAuth 2.0 Identity:</strong> Optional passwordless login verified through Google's cryptographic token exchange endpoints.
              </li>
              <li>
                <strong>Time-Bound Password Reset Tokens:</strong> Password recovery utilizes single-use, cryptographically generated tokens with strict 1-hour expiration windows delivered directly to registered work emails.
              </li>
            </ul>
          </section>

          {/* Section 4: Application Hardening */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>Application Hardening &amp; Injection Defense</span>
            </h2>
            <p>
              Every payload submitted to our API is scrubbed and validated against strict schemas before execution:
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-xs text-slate-700 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Schema Validation:</span>
                Zod-driven input sanitization stripping unexpected fields and rejecting malformed trip dates or injection vectors.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Rate Limiting:</span>
                Automated IP and account rate limiting mitigating brute-force password guessing and scraping bots.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-900 block">Security Headers:</span>
                Hardened HTTP response headers including Content-Security-Policy (CSP), X-Frame-Options (DENY), and X-Content-Type-Options.
              </div>
            </div>
          </section>

          {/* Section 5: AI & Data Training Disclaimer */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <span>Deterministic Next-Action Engine &amp; Zero AI Model Training</span>
            </h2>
            <p>
              Unlike generic CRM tools that send your client prompts to external third-party language models:
            </p>
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-slate-800 space-y-2 text-xs sm:text-sm">
              <p className="font-bold text-teal-900 text-sm">
                ActiLynq's Next-Action Engine runs 100% on deterministic mathematical business rules:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Zero external LLM hallucinations or unpredictable automated drift.</li>
                <li>Zero transmission of customer budgets or traveler names to external AI model trainers.</li>
                <li>Your travel agency's customer data is never used to train, refine, or fine-tune public foundation models.</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Backups & Disaster Recovery */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
              <span>Backups, Disaster Recovery &amp; Availability</span>
            </h2>
            <p>
              To ensure zero data loss across tour operator sales cycles:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Automated Daily Backups:</strong> Point-in-time snapshots taken daily and stored in geo-redundant, air-gapped storage buckets.
              </li>
              <li>
                <strong>Containerized Failover:</strong> Production services run in health-monitored containers that automatically self-heal and restart in the event of hardware or node failures.
              </li>
              <li>
                <strong>Rapid Disaster Recovery:</strong> Target Recovery Point Objective (RPO) &lt; 24 hours and Recovery Time Objective (RTO) &lt; 2 hours.
              </li>
            </ul>
          </section>

          {/* Section 7: Security Inquiries & Disclosure */}
          <section className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              7. Security Incident Response &amp; Responsible Disclosure
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We welcome collaboration with cybersecurity researchers and enterprise IT auditors. If you believe you have discovered a potential security vulnerability, please report it immediately to our founder security desk:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold text-slate-900">Nilesh Dhankani</p>
                <p className="text-slate-500">Founder &amp; Security Principal &bull; ActiLynq</p>
                <p className="text-slate-700">
                  Security Hotline: <strong className="text-teal-700 font-mono font-bold">{FOUNDER_PHONE}</strong>
                </p>
                <p className="text-slate-700">
                  Direct Email: <a href={`mailto:${SECURITY_EMAIL}`} className="text-teal-700 underline font-semibold">{SECURITY_EMAIL}</a>
                </p>
              </div>

              <a
                href={`${WHATSAPP_LINK}?text=Hello%20Nilesh%2C%20I%20have%20a%20security%20or%20technical%20inquiry%20regarding%20ActiLynq.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Security Desk</span>
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
            <Link to="/terms" className="hover:text-slate-900">Terms of Service</Link>
            <Link to="/security" className="font-bold text-teal-800">Security Overview</Link>
            <Link to="/" className="hover:text-slate-900">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
