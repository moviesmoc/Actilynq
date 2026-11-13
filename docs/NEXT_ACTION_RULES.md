# ActiLynq — Next-Action Engine Rules & Logic Reference

The **Next-Action Engine** is the core operational differentiator of ActiLynq. Unlike generic CRM reminders, it executes transparent, explainable business logic tailored to travel agency operations. It does not use opaque AI or machine learning algorithms; its recommendations are 100% deterministic, testable, and based on factual database timestamps.

---

## Priority Order & Rules Matrix

When evaluating an open, non-terminal travel enquiry, rules are assessed in strict numerical order (1 through 5). The first rule whose trigger conditions are met—and is not actively snoozed—is emitted as the lead's recommendation (maximum of **one highest-priority recommendation per lead**).

```text
Priority 1: OVERDUE_CALLBACK (High Priority)
     ↓ (If not triggered or snoozed)
Priority 2: QUOTATION_FOLLOW_UP (High Priority)
     ↓ (If not triggered or snoozed)
Priority 3: MISSING_REQUIREMENTS (Medium Priority)
     ↓ (If not triggered or snoozed)
Priority 4: QUOTATION_PREPARATION (Medium Priority)
     ↓ (If not triggered or snoozed)
Priority 5: INACTIVE_ENQUIRY (Low Priority)
```

---

## Detailed Rule Specifications

### Rule 1: `OVERDUE_CALLBACK`
- **Priority:** High
- **Category:** Time-critical callback
- **Trigger Conditions:**
  1. Lead stage is not in terminal stages (`booking_confirmed`, `lost`).
  2. `lead.nextFollowUpAt` exists and `new Date(lead.nextFollowUpAt) < now`.
  3. No active `ActionOverride` exists with `snoozeUntil > now`.
- **Generated Explanation:**
  > *"Scheduled follow-up callback was due on [Date/Time] and is overdue by [X hours/days]."*
- **Primary CTA:** Click-to-dial (`tel:`) or WhatsApp draft.
- **Resolution:**
  - Logging a call outcome (connected or unsuccessful) and rescheduling or clearing `nextFollowUpAt`.
  - Snoozing the recommendation.

---

### Rule 2: `QUOTATION_FOLLOW_UP`
- **Priority:** High
- **Category:** Commercial pipeline follow-up
- **Trigger Conditions:**
  1. Lead stage is not in terminal stages.
  2. `lead.quotationSentAt` exists and `(now - lead.quotationSentAt >= 2 days)`.
  3. **Future Follow-up Protection:** `!lead.nextFollowUpAt || new Date(lead.nextFollowUpAt) <= now` (if the salesperson already has a future follow-up scheduled, this rule is suppressed until that date becomes due).
  4. **Qualifying Contact Check:** `!lead.lastCustomerContactAt || new Date(lead.lastCustomerContactAt) < new Date(lead.quotationSentAt)`.
  5. No active snooze override.
- **Why Internal Notes Do NOT Clear This Rule:**
  Internal notes, stage edits, or itinerary updates only update `lastActivityAt`. They do *not* represent verified customer contact. Only confirmed contact (`call` with `connected`, `whatsapp` with `sent`, `meeting`) updates `lastCustomerContactAt`.
- **Generated Explanation:**
  > *"Quotation was sent [X days] ago. No qualifying customer contact has been recorded since."*
- **Primary CTA:** Click-to-WhatsApp with prefilled travel draft.
- **Resolution:**
  - Logging a verified customer contact activity.
  - Setting a future follow-up callback date.
  - Advancing lead stage to Booking Confirmed or Lost.

---

### Rule 3: `MISSING_REQUIREMENTS`
- **Priority:** Medium
- **Category:** Data completeness
- **Trigger Conditions:**
  1. Lead stage is in `['new_enquiry', 'contacted']`.
  2. Missing one or more essential travel specifications:
     - `destination` is null or empty.
     - `travelStartDate` is null.
     - `travellerCount` is null.
  3. No active snooze override.
- **Budget Non-Blocking Behavior:**
  Client budget (`budgetAmount`) is optional and does *not* trigger Rule 3, allowing raw leads to progress even if customer is unsure of pricing.
- **Generated Explanation:**
  > *"Missing essential details: [destination, travel start date, traveller count]. Collect these trip parameters before preparing the package."*
- **Primary CTA:** Open Lead / Edit Trip Requirements.
- **Resolution:**
  - Updating the lead with the required destination, date, and passenger count.

---

### Rule 4: `QUOTATION_PREPARATION`
- **Priority:** Medium
- **Category:** Workflow bottleneck
- **Trigger Conditions:**
  1. Lead stage is explicitly in `['requirements_collected', 'package_preparation']`.
  2. `!lead.quotationSentAt` (no quotation sent yet).
  3. Essential specs (`destination`, `travelStartDate`, `travellerCount`) are present.
  4. No active snooze override.
- **Generated Explanation:**
  > *"Travel requirements have been gathered. Prepare custom itinerary package and share quotation."*
- **Primary CTA:** Open Lead / Prepare Quotation.
- **Resolution:**
  - Transitioning lead to `quotation_sent` with recorded `quotationAmount`.

---

### Rule 5: `INACTIVE_ENQUIRY`
- **Priority:** Low
- **Category:** Re-engagement / Hygiene
- **Trigger Conditions:**
  1. Lead stage is not terminal.
  2. `lead.lastActivityAt` exists and `(now - lead.lastActivityAt >= 7 days)`.
  3. No active snooze override.
- **Generated Explanation:**
  > *"No enquiry activity or note has been recorded for over [X days]. Review or check in with customer."*
- **Primary CTA:** Re-engage via WhatsApp or call.
- **Resolution:**
  - Logging any note, call, message, or stage update on the enquiry.

---

## False-Positive Prevention & Edge Cases

| Scenario | Handled By |
|---|---|
| Lead is Won or Lost | Excluded immediately by `TERMINAL_STAGES` check. |
| Salesperson already scheduled follow-up for tomorrow | Rule 2 (`QUOTATION_FOLLOW_UP`) is suppressed by future `nextFollowUpAt`. |
| Salesperson added an internal note after sending quote | Rule 2 remains active because internal notes do not update `lastCustomerContactAt`. |
| Salesperson opened WhatsApp but did not send message | Confirmed two-step modal logs unconfirmed; does not clear Rule 2. |
| Snooze is active | Lead action is omitted until `snoozeUntil` passes. |
