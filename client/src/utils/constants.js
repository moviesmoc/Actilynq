export const STAGES = {
  NEW_ENQUIRY: 'new_enquiry',
  CONTACTED: 'contacted',
  REQUIREMENTS_COLLECTED: 'requirements_collected',
  PACKAGE_PREPARATION: 'package_preparation',
  QUOTATION_SENT: 'quotation_sent',
  FOLLOW_UP: 'follow_up',
  NEGOTIATION: 'negotiation',
  BOOKING_CONFIRMED: 'booking_confirmed',
  LOST: 'lost'
};

export const STAGE_CONFIG = {
  [STAGES.NEW_ENQUIRY]: {
    label: 'New Enquiry',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500'
  },
  [STAGES.CONTACTED]: {
    label: 'Contacted',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500'
  },
  [STAGES.REQUIREMENTS_COLLECTED]: {
    label: 'Requirements Collected',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500'
  },
  [STAGES.PACKAGE_PREPARATION]: {
    label: 'Package Preparation',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500'
  },
  [STAGES.QUOTATION_SENT]: {
    label: 'Quotation Sent',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500'
  },
  [STAGES.FOLLOW_UP]: {
    label: 'Follow-up',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    dotClass: 'bg-teal-500'
  },
  [STAGES.NEGOTIATION]: {
    label: 'Negotiation',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    dotClass: 'bg-orange-500'
  },
  [STAGES.BOOKING_CONFIRMED]: {
    label: 'Booking Confirmed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  [STAGES.LOST]: {
    label: 'Lost',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    dotClass: 'bg-slate-400'
  }
};

export const TERMINAL_STAGES = [STAGES.BOOKING_CONFIRMED, STAGES.LOST];

export const TRAVEL_TYPES = [
  { value: 'leisure', label: 'Leisure Vacation' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'family', label: 'Family Trip' },
  { value: 'adventure', label: 'Adventure / Trekking' },
  { value: 'business', label: 'Business / Corporate' },
  { value: 'group', label: 'Group Tour' },
  { value: 'other', label: 'Other' }
];

export const ACCOMMODATION_PREFERENCES = [
  { value: 'any', label: 'No Specific Preference' },
  { value: 'budget', label: 'Budget / Standard' },
  { value: '3_star', label: '3-Star Hotel' },
  { value: '4_star', label: '4-Star Premium' },
  { value: '5_star', label: '5-Star Luxury' },
  { value: 'resort', label: 'Resort / Villa' },
  { value: 'homestay', label: 'Boutique Homestay' }
];

export const LEAD_SOURCES = [
  { value: 'manual', label: 'Direct Walk-in / Manual' },
  { value: 'website', label: 'Agency Website' },
  { value: 'referral', label: 'Customer Referral' },
  { value: 'phone', label: 'Inbound Phone Call' },
  { value: 'social', label: 'Social Media' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'other', label: 'Other Source' }
];

export const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    barClass: 'bg-rose-600'
  },
  medium: {
    label: 'Medium Priority',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    barClass: 'bg-amber-500'
  },
  low: {
    label: 'Low Priority',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    barClass: 'bg-slate-400'
  }
};
