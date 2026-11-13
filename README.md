# ActiLynq — Travel Sales Action Platform

> **"What should the salesperson do next for this travel enquiry, and why?"**

ActiLynq is an industry-specific sales action platform engineered for travel agencies. Built on the **MERN** stack (MongoDB, Express.js, React, Node.js), it combines flexible travel-specific lead management, activity timelines, a standardized 9-stage travel sales workflow, and a transparent rule-based **Next-Action Engine**.

Designed for an academic MCA final project demonstration and public deployment on Render.

---

## Key Features

1. **Deterministic Next-Action Engine:** Evaluates open enquiries against 5 predefined operational rules in strict priority order. Shows at most one highest-priority action per enquiry with an explainable *"Why this action?"* rationale.
2. **Flexible Incomplete Intake:** Enquiries can be created with unknown dates or traveller counts (`travellerCount` is nullable and never defaulted to 1). Stage progression gateways validate completeness before moving forward.
3. **Dual Activity Timestamps:** Separates `lastActivityAt` (updated on any activity, note, or stage update) from `lastCustomerContactAt` (updated *only* on confirmed customer contact).
4. **Two-Step Verified Customer Outreach:** Click-to-WhatsApp (`wa.me`) and click-to-dial (`tel:`) include an immediate post-action confirmation modal. Opening WhatsApp never automatically claims a message was sent.
5. **Strict Multi-Tenant Isolation:** Enforced strictly at the server middleware and query layer based on authenticated session context.
6. **Faculty Demonstration Mode:** Idempotent seeder with 11 evergreen, relative-date scenarios and dedicated demo reset protection.
7. **Single-Service Deployment:** Express serves the compiled React Vite SPA and `/api` routes from a single port/origin, completely eliminating CORS issues on Render.

---

## Tech Stack

- **Frontend:** React 18, Vite, React Router 6, Tailwind CSS, Lucide React, Recharts.
- **Backend:** Node.js (ES Modules), Express.js, Mongoose, Zod, Bcryptjs, JSON Web Tokens (JWT).
- **Security:** Helmet, Cookie-Parser (HttpOnly, SameSite cookies), Express-Rate-Limit, CORS.
- **Database:** MongoDB Atlas (M0 Free Tier) or local MongoDB.
- **Testing:** Native Node.js Test Runner (`node:test`, `node:assert`).

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)
- MongoDB Atlas connection URI or local MongoDB instance

### 2. Installation
Clone repository and install all dependencies:
```bash
npm run install:all
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/actilynq?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
SEED_DEMO_DATA=true
DEMO_EMAIL=demo@actilynq.com
DEMO_PASSWORD=DemoPassword123!
```

### 4. Running Locally
Run both backend server and frontend Vite dev server concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173` (proxies `/api` to port 5000)
- Backend API: `http://localhost:5000`

---

## Running Automated Tests

Run the full automated test suite (38 unit and security tests):
```bash
npm test
```
The test suite validates:
- All 5 Next-Action rules with mocked dates/time.
- Quotation follow-up timing and irrelevant internal note filtering.
- Two-step customer contact derivation.
- Flexible incomplete lead validation.
- Stage transition graph & terminal lead lock.
- Cross-tenant security isolation.

---

## Production Build & Single-Service Execution

Build the React client and run the unified Express production server:
```bash
npm run build
npm start
```
The Express server serves the compiled React app from `client/dist` and handles client-side routing on `http://localhost:5000` (or `process.env.PORT` on Render).

---

## Faculty Demonstration Quick-Fill Account

When `SEED_DEMO_DATA=true`, the server automatically seeds the demonstration workspace:
- **Email:** `demo@actilynq.com`
- **Password:** `DemoPassword123!`
- The login screen includes a **"Quick-Fill Demo Account"** button for immediate access during viva examinations.

---

## Faculty Documentation Index (`/docs`)

Comprehensive documentation prepared for academic evaluation:
1. [`PROJECT_OVERVIEW.md`](./docs/PROJECT_OVERVIEW.md) — Problem statement, target users, objectives, and scope.
2. [`SYSTEM_ARCHITECTURE.md`](./docs/SYSTEM_ARCHITECTURE.md) — MERN architecture, request flow, schemas, and tenant isolation.
3. [`NEXT_ACTION_RULES.md`](./docs/NEXT_ACTION_RULES.md) — Exact rules, priority order, trigger thresholds, and false-positive prevention.
4. [`FACULTY_PRESENTATION.md`](./docs/FACULTY_PRESENTATION.md) — 5-minute presentation script and likely viva Q&A.
5. [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Step-by-step Render and MongoDB Atlas deployment guide.
6. [`LIMITATIONS_AND_ROADMAP.md`](./docs/LIMITATIONS_AND_ROADMAP.md) — Clear boundary between MVP and future roadmap.
