# ActiLynq — Faculty Presentation Guide & Viva Q&A

**Demonstration Duration:** 5–7 Minutes  
**Audience:** External Faculty Reviewers / MCA Project Examiners  
**Core Thesis:** Moving from passive CRM storage to an **action-oriented, travel-specific workflow** with a transparent, explainable Next-Action Engine.

---

## 5-Minute Demonstration Sequence

### Step 1: Login & The Central Question (0:00 – 1:00)
1. Open the application at the deployed URL or `http://localhost:5000`.
2. Click **"Quick-Fill Demo Account"** (`demo@actilynq.com` / `DemoPassword123!`).
3. Explain the problem statement:
   > *"Most travel agencies drown in open enquiries. The central question ActiLynq answers every morning for the salesperson is: **What should I do next for this travel enquiry, and why?**"*

### Step 2: The Action Center & Rule Transparency (1:00 – 2:30)
1. Navigate directly to **Action Center** (`/actions`).
2. Show that each card has an explicit **"Why this action"** explanation box:
   - **Overdue Callback:** Due 5 hours ago for *Dr. Sneha Kulkarni*.
   - **Quotation Follow-up:** Quotation sent 3 days ago for *Amitabh Sen* (Singapore trip) with no customer contact since.
   - **Missing Requirements:** *Rajesh & Priya Sharma* (Switzerland trip) missing travel dates and traveller count.
3. Demonstrate **Filter Chips** (High Priority, Quotations, Incomplete Specs).
4. Highlight that there is **at most one highest-priority action per lead** to prevent conflicting tasks.

### Step 3: Two-Step Verified Outreach (2:30 – 3:30)
1. Click **WhatsApp** on the quotation follow-up lead (*Amitabh Sen*).
2. Show that WhatsApp opens in a new tab with a prefilled, personalized draft:
   `https://wa.me/919830098765?text=...`
3. Return to the application and show the in-app prompt:
   > *"Did you send the message to Amitabh Sen?"*
4. Explain to faculty:
   > *"ActiLynq does not pretend to be the WhatsApp Business API. It uses click-to-chat, but verifies whether the message was sent before updating the database. Only verified contact updates `lastCustomerContactAt`."*
5. Click **"Yes, Message Sent"** $\rightarrow$ Show that the recommendation immediately recalculates and clears from the queue!

### Step 4: Lead Record & Stage Progression Gateway (3:30 – 4:30)
1. Open *Rajesh & Priya Sharma* (`/leads/:id`).
2. Show the **Stage Stepper**. Attempt to move stage from `New Enquiry` to `Requirements Collected`.
3. The application displays a prerequisite modal:
   > *"Destination, travel start date, and traveller count are required before moving to this stage."*
4. Enter the dates and 2 travellers $\rightarrow$ The lead successfully advances and Rule 3 is resolved!

### Step 5: Real-Time Reports & Settings (4:30 – 5:00)
1. Navigate to **Reports** (`/reports`). Show the conversion rate, pipeline value, and Recharts stage/source distributions computed from actual MongoDB documents.
2. Navigate to **Settings** (`/settings`). Show the Next-Action Rules reference and the **"Reset Demo Dataset"** button (which allows resetting all 11 scenarios to fresh relative dates at the push of a button).

---

## Likely External Viva Questions & Honest Answers

### Q1: Is the Next-Action Engine using Machine Learning or AI?
> **Answer:** *"No, and that is a deliberate architectural decision. In high-velocity travel sales, salespeople need deterministic, explainable rules, not opaque statistical scores. ActiLynq uses a transparent rule-based engine written in JavaScript with strict priority precedence and injectable timestamps. If an action appears, the salesperson sees the exact reason based on factual database dates."*

### Q2: How does ActiLynq prevent cross-tenant data leakage?
> **Answer:** *"Tenant isolation is enforced strictly on the backend. The client browser is never trusted to supply `businessId`. All database queries, updates, and aggregations filter strictly by `req.user.businessId`, which is derived from the verified HttpOnly JWT session cookie. We have automated unit and integration tests proving that Business A cannot read or modify Business B's leads."*

### Q3: Why did you separate `lastActivityAt` and `lastCustomerContactAt`?
> **Answer:** *"Because internal agency activities—like adding an internal note, adjusting a budget, or moving a stage—do not mean the customer was contacted. If a salesperson sends a quotation and then updates a note the next day, the customer still has not received a follow-up. Using `lastCustomerContactAt` prevents false-positive clearance of the quotation follow-up rule."*

### Q4: Why doesn't the app automatically detect when a WhatsApp message is delivered?
> **Answer:** *"Tracking delivery or read receipts requires the official WhatsApp Business Cloud API with approved Meta business templates and webhooks. For small travel agencies, click-to-WhatsApp via `wa.me` is zero-cost and instant. However, to maintain data integrity, we introduced a two-step confirmation modal where the agent confirms the outcome upon returning to the app."*

### Q5: Can a lead skip stages or jump from New Enquiry directly to Won?
> **Answer:** *"No. We defined a strict stage transition graph (`ALLOWED_STAGE_TRANSITIONS`). Jumping from New Enquiry to Quotation Sent is blocked. Furthermore, moving to terminal stages like Booking Confirmed or Lost locks ordinary stage edits; a terminal lead can only be reactivated through a deliberate, audited 'Reopen' operation with a required rationale."*
