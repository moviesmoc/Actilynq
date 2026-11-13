# ActiLynq — Project Overview

**Course / Project:** Master of Computer Applications (MCA) Final Project  
**Project Title:** ActiLynq — Industry-Specific Sales Action Platform for Travel Agencies  
**Technology Stack:** MERN (MongoDB, Express.js, React, Node.js)

---

## 1. Problem Statement

Small to mid-sized travel agencies face distinct sales operational friction:
- Customer travel enquiries come in across phone, walk-in, website, and messaging channels.
- Enquiries frequently arrive incomplete (e.g. unknown travel dates, undecided destination, or uncertain passenger count).
- Existing generic CRMs (HubSpot, Salesforce) are either prohibitively expensive or too generic, demanding extensive custom property configuration and workflow logic.
- Sales agents lose deals because they forget to follow up after sending customized package itineraries, miss callback commitments, or let cold enquiries languish without attention.
- Most importantly, salespeople often struggle with the question: **"What should I do next for this travel enquiry, and why?"**

---

## 2. Target Users

1. **Travel Agency Owners / Managers:** Require visibility into active enquiries, conversion win rates, pipeline value, and team responsiveness.
2. **Travel Sales Consultants / Agents:** Need an action-oriented daily queue that highlights which customer needs outreach today, explains the underlying reason, and allows rapid click-to-WhatsApp and dialler interaction.

---

## 3. Proposed Solution

ActiLynq provides an end-to-end, industry-specific sales action platform designed from the ground up for travel agencies:
- **Travel-Specific Data Model:** Captures destinations, departure cities, travel dates, passenger count, travel type (honeymoon, leisure, family, adventure), hotel preferences, and customized special requests.
- **Flexible Lead Intake:** Raw enquiries can be logged with partial requirements and completed during the sales discovery process.
- **9-Stage Travel Sales Progression Pipeline:** Standardized travel workflow from New Enquiry to Booking Confirmed or Lost.
- **Transparent Rule-Based Next-Action Engine:** Evaluates lead state, timestamps, and customer contact history to generate prioritized next best actions with human-readable rationales.
- **Two-Step Verified Customer Contact Logging:** Opening WhatsApp or dialling a customer does *not* automatically claim a message was sent or a call was answered. The salesperson explicitly logs the outcome, ensuring follow-up rules update accurately.
- **Multi-Tenant Data Isolation:** Enforced strictly at the server middleware and query layer based on authenticated session context.

---

## 4. Key Modules & Scope

### Implemented in this MVP
1. **Authentication & Tenant Isolation:** Secure HttpOnly JWT cookie authentication, bcrypt password hashing, and automatic business-scoped query isolation.
2. **Travel Lead Management:** Create, view, search, filter, and archive travel enquiries with flexible trip specifications.
3. **Stage Progression Gateways:** Enforces prerequisite requirements before advancing to stages such as Requirements Collected, Package Preparation, or Quotation Sent.
4. **Deterministic Next-Action Engine:** Deduped, highest-priority recommendations across 5 transparent business rules.
5. **Action Center:** Priority-sorted action queue with "Why this action?" explanations and snoozing.
6. **Activity Timeline:** Chronological audit trail distinguishing general activities from verified customer contact.
7. **Interactive Pipeline Board:** Kanban-style visual pipeline.
8. **Dashboard & Analytics:** Real-time metrics computed directly from database records.
9. **Faculty Demo Mode:** Pre-configured demo dataset with 11 evergreen, relative-date scenarios and dedicated demo reset protection.

### Explicit Scope Boundaries (Deferred to Future Roadmap)
- WhatsApp Business Cloud API / Automated message bots.
- Meta Lead Ads & Google Ads OAuth integrations.
- AI/LLM predictive scoring or automated chatbots.
- Live GDS/CRS travel booking inventory (Amadeus / Sabre).
- Automated quotation PDF generation.
- Payment gateway integration / SaaS billing tiers.
