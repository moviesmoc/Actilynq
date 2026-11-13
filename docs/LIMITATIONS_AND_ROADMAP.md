# ActiLynq — Current Limitations & Future Roadmap

To preserve academic integrity and provide an accurate evaluation for faculty examiners, this document clearly delineates what is implemented in the current MVP versus deferred features planned for future releases.

---

## 1. Implemented in this MVP (v1.0.0)

| Feature Area | Implementation Detail |
|---|---|
| **Multi-Tenant Architecture** | Isolated business accounts with server-enforced `businessId` query scoping. |
| **Authentication** | Bcrypt password hashing, signed JWT in secure HttpOnly cookies, rate limiting on auth endpoints. |
| **Travel Lead Capture** | Flexible schema supporting raw incomplete intake (`travellerCount` nullable, dates optional). |
| **Sales Workflow** | 9 travel-specific stages with prerequisite gateways and explicit transition graph. |
| **Activity Audit Trail** | Chronological timeline distinguishing internal notes from confirmed customer contact. |
| **Next-Action Engine** | Dedicated, deterministic backend service evaluating 5 rules with injectable timestamps. |
| **Action Center** | Hero dashboard displaying highest-priority actions with "Why this action?" rationales and snoozing. |
| **Outreach Utilities** | Normalized click-to-WhatsApp drafts (`wa.me`) and click-to-dial links (`tel:`) with two-step outcome confirmation. |
| **Reports & Analytics** | Conversion win rates, stage distributions, and source breakdown computed from MongoDB records using Recharts. |
| **Demo Environment** | Idempotent seeder with 11 relative-date scenarios and isolated demo workspace reset. |
| **Deployment Setup** | Unified single-service Render hosting with Express static asset serving and SPA fallback. |

---

## 2. Explicitly Excluded Features & Current Limitations

1. **No WhatsApp Business Cloud API / Webhooks:**
   - ActiLynq opens prefilled WhatsApp links in the salesperson's browser or mobile app.
   - It does *not* receive automated delivery receipts, blue ticks (read status), or incoming customer replies.
   - *Rationale:* WhatsApp Business API requires official Meta Business verification, credit card billing per conversation, and pre-approved message templates.

2. **No Automated Phone Call Tracking:**
   - Phone calls are triggered using the browser `tel:` protocol.
   - Telecom network call duration and voice recording are not captured automatically; outcome logging is performed manually by the agent.

3. **No Automated Quotation PDF Generator:**
   - The platform tracks quotation amounts, pricing milestones, and sent timestamps.
   - It does *not* generate dynamic multi-page PDF brochures or flight vouchers.

4. **No Live Travel Booking Inventory / GDS APIs:**
   - ActiLynq does not integrate with Amadeus, Sabre, or Galileo global distribution systems for live flight seat availability or real-time hotel rates.

5. **No AI / LLM Claims:**
   - The Next-Action Engine is purely deterministic and rule-based. It does not invoke OpenAI, Gemini, or statistical machine learning models.

6. **No Multi-Agent Team Collaboration / Roles:**
   - For this MVP, each registered account is owned and operated by an agency owner. Multi-user team invitations and granular role-based access control (RBAC) are deferred.

---

## 3. Future Roadmap

### Version 1.1: Operational Enhancements
- **CSV Enquiry Bulk Import:** Allow uploading CSV files with travel leads from exhibition dropboxes.
- **Custom Itinerary PDF Export:** Generate standard quotation summaries with agency branding.
- **Email Dispatch via SMTP:** Send itinerary drafts directly from the app using agency email credentials.

### Version 1.2: Team & Collaboration Features
- **Sales Consultant Invitations:** Agency owners can invite multiple sales consultants to the same business workspace.
- **Lead Assignment:** Assign leads to specific sales consultants with individual action center queues.

### Version 2.0: Deep Platform Integrations
- **WhatsApp Cloud API Integration:** Official Meta webhook support for automated read receipts and two-way chat in-app.
- **Hotel & Flight Rate Aggregators:** Search B2B travel consolidator APIs for package pricing estimates.
