import { STAGES } from '../constants/workflow.js';

/**
 * Generates 11 realistic travel enquiry scenarios with relative timestamps.
 * Ensures Action Center, Dashboard, and Pipeline are immediately demonstrative for faculty evaluation.
 *
 * @param {Date} [referenceDate=new Date()]
 * @returns {Array<Object>}
 */
export function getDemoLeadScenarios(referenceDate = new Date()) {
  const now = referenceDate.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;

  return [
    // 1. New Enquiry with Missing Requirements (Rule 3: Missing travel dates & traveller count)
    {
      customerName: 'Rajesh & Priya Sharma',
      phone: '+919820112233',
      email: 'rajesh.sharma@example.com',
      destination: 'Switzerland Alps',
      departureCity: 'Mumbai',
      travelStartDate: null, // Missing!
      travelEndDate: null,
      travellerCount: null, // Missing!
      budgetAmount: 400000,
      budgetCurrency: 'INR',
      travelType: 'leisure',
      accommodationPreference: '4_star',
      specialRequirements: 'Prefers vegetarian food and scenic mountain train tickets.',
      leadSource: 'website',
      stage: STAGES.NEW_ENQUIRY,
      estimatedValue: 400000,
      lastActivityAt: new Date(now - 1 * dayMs)
    },

    // 2. Contacted Enquiry with Missing Destination (Rule 3: Incomplete intake)
    {
      customerName: 'Vikram Malhotra',
      phone: '+919811223344',
      email: 'vikram.m@example.com',
      destination: null, // Missing!
      departureCity: 'Delhi',
      travelStartDate: new Date(now + 45 * dayMs),
      travelEndDate: new Date(now + 52 * dayMs),
      travellerCount: 2,
      budgetAmount: 250000,
      budgetCurrency: 'INR',
      travelType: 'honeymoon',
      accommodationPreference: 'resort',
      specialRequirements: 'Looking for beach destination options like Bali or Phuket.',
      leadSource: 'referral',
      stage: STAGES.CONTACTED,
      estimatedValue: 250000,
      lastActivityAt: new Date(now - 12 * hourMs)
    },

    // 3. Requirements Collected, Quotation Pending (Rule 4: Ready for Quotation)
    {
      customerName: 'Ananya Iyer',
      phone: '+919845012345',
      email: 'ananya.iyer@example.com',
      destination: 'Dubai & Abu Dhabi',
      departureCity: 'Bengaluru',
      travelStartDate: new Date(now + 30 * dayMs),
      travelEndDate: new Date(now + 36 * dayMs),
      travellerCount: 4,
      budgetAmount: 350000,
      budgetCurrency: 'INR',
      travelType: 'family',
      accommodationPreference: '4_star',
      specialRequirements: 'Includes Burj Khalifa, Desert Safari, and Ferrari World passes.',
      leadSource: 'social',
      stage: STAGES.REQUIREMENTS_COLLECTED,
      estimatedValue: 350000,
      lastActivityAt: new Date(now - 18 * hourMs),
      lastCustomerContactAt: new Date(now - 18 * hourMs)
    },

    // 4. Package Preparation in Progress (Rule 4: Ready for Quotation)
    {
      customerName: 'Siddharth & Meera Rao',
      phone: '+919876543210',
      email: 'siddharth.rao@example.com',
      destination: 'Paris & Rome',
      departureCity: 'Hyderabad',
      travelStartDate: new Date(now + 60 * dayMs),
      travelEndDate: new Date(now + 70 * dayMs),
      travellerCount: 2,
      budgetAmount: 500000,
      budgetCurrency: 'INR',
      travelType: 'honeymoon',
      accommodationPreference: '4_star',
      specialRequirements: 'Romantic Seine dinner cruise and Colosseum guided tour.',
      leadSource: 'website',
      stage: STAGES.PACKAGE_PREPARATION,
      estimatedValue: 500000,
      lastActivityAt: new Date(now - 8 * hourMs),
      lastCustomerContactAt: new Date(now - 8 * hourMs)
    },

    // 5. Quotation Sent 3 Days Ago, No Contact Recorded (Rule 2: Quotation Follow-up)
    {
      customerName: 'Amitabh Sen',
      phone: '+919830098765',
      email: 'amitabh.sen@example.com',
      destination: 'Singapore & Sentosa',
      departureCity: 'Kolkata',
      travelStartDate: new Date(now + 25 * dayMs),
      travelEndDate: new Date(now + 30 * dayMs),
      travellerCount: 3,
      budgetAmount: 280000,
      budgetCurrency: 'INR',
      travelType: 'family',
      accommodationPreference: '4_star',
      specialRequirements: 'Universal Studios VIP passes and Night Safari included.',
      leadSource: 'manual',
      stage: STAGES.QUOTATION_SENT,
      estimatedValue: 280000,
      quotationAmount: 275000,
      quotationSentAt: new Date(now - 3 * dayMs), // Sent 3 days ago
      lastActivityAt: new Date(now - 3 * dayMs),
      lastCustomerContactAt: new Date(now - 3 * dayMs), // No subsequent contact!
      nextFollowUpAt: null
    },

    // 6. Follow-up Scheduled Callback Overdue (Rule 1: Overdue Callback - Highest Priority!)
    {
      customerName: 'Dr. Sneha Kulkarni',
      phone: '+919822055667',
      email: 'sneha.k@example.com',
      destination: 'Maldives Overwater Villa',
      departureCity: 'Pune',
      travelStartDate: new Date(now + 20 * dayMs),
      travelEndDate: new Date(now + 25 * dayMs),
      travellerCount: 2,
      budgetAmount: 380000,
      budgetCurrency: 'INR',
      travelType: 'honeymoon',
      accommodationPreference: 'resort',
      specialRequirements: 'All-inclusive water villa with seaplane transfers.',
      leadSource: 'referral',
      stage: STAGES.FOLLOW_UP,
      estimatedValue: 380000,
      quotationAmount: 365000,
      quotationSentAt: new Date(now - 4 * dayMs),
      lastActivityAt: new Date(now - 1 * dayMs),
      lastCustomerContactAt: new Date(now - 1 * dayMs),
      nextFollowUpAt: new Date(now - 5 * hourMs) // Due 5 hours ago!
    },

    // 7. Quotation Sent but with Future Scheduled Callback (Rule 2 Suppressed)
    {
      customerName: 'Rohan & Tanya Kapoor',
      phone: '+919910022334',
      email: 'rohan.kapoor@example.com',
      destination: 'Thailand (Phuket & Krabi)',
      departureCity: 'Delhi',
      travelStartDate: new Date(now + 40 * dayMs),
      travelEndDate: new Date(now + 47 * dayMs),
      travellerCount: 2,
      budgetAmount: 180000,
      budgetCurrency: 'INR',
      travelType: 'leisure',
      accommodationPreference: '4_star',
      specialRequirements: 'Island hopping speedboat tours included.',
      leadSource: 'social',
      stage: STAGES.QUOTATION_SENT,
      estimatedValue: 180000,
      quotationAmount: 175000,
      quotationSentAt: new Date(now - 3 * dayMs),
      lastActivityAt: new Date(now - 1 * dayMs),
      lastCustomerContactAt: new Date(now - 1 * dayMs),
      nextFollowUpAt: new Date(now + 2 * dayMs) // Future follow-up scheduled! Suppresses Rule 2.
    },

    // 8. Inactive Lead (Rule 5: Inactive Enquiry >= 7 days)
    {
      customerName: 'Sunil Narang',
      phone: '+919810177889',
      email: 'sunil.narang@example.com',
      destination: 'Kashmir Valley & Gulmarg',
      departureCity: 'Chandigarh',
      travelStartDate: new Date(now + 50 * dayMs),
      travelEndDate: new Date(now + 56 * dayMs),
      travellerCount: 5,
      budgetAmount: 220000,
      budgetCurrency: 'INR',
      travelType: 'family',
      accommodationPreference: '3_star',
      specialRequirements: 'Houseboat stay in Dal Lake and Gondola Phase 2 tickets.',
      leadSource: 'phone',
      stage: STAGES.CONTACTED,
      estimatedValue: 220000,
      lastActivityAt: new Date(now - 8 * dayMs) // Inactive for 8 days!
    },

    // 9. Active Negotiation (Healthy enquiry in progress)
    {
      customerName: 'Manish & Pooja Verma',
      phone: '+919871144556',
      email: 'manish.verma@example.com',
      destination: 'Vietnam & Cambodia Explorer',
      departureCity: 'Ahmedabad',
      travelStartDate: new Date(now + 35 * dayMs),
      travelEndDate: new Date(now + 45 * dayMs),
      travellerCount: 2,
      budgetAmount: 320000,
      budgetCurrency: 'INR',
      travelType: 'adventure',
      accommodationPreference: '4_star',
      specialRequirements: 'Halong Bay 5-star cruise and Angkor Wat sunrise tour.',
      leadSource: 'website',
      stage: STAGES.NEGOTIATION,
      estimatedValue: 320000,
      quotationAmount: 310000,
      quotationSentAt: new Date(now - 5 * dayMs),
      lastActivityAt: new Date(now - 6 * hourMs),
      lastCustomerContactAt: new Date(now - 6 * hourMs), // Contacted 6 hours ago
      nextFollowUpAt: new Date(now + 1 * dayMs)
    },

    // 10. Booking Confirmed (Terminal Won — Excluded from Action Center)
    {
      customerName: 'Arjun Singhania',
      phone: '+919820066778',
      email: 'arjun.singhania@example.com',
      destination: 'London & Scotland Heritage Tour',
      departureCity: 'Mumbai',
      travelStartDate: new Date(now + 15 * dayMs),
      travelEndDate: new Date(now + 26 * dayMs),
      travellerCount: 2,
      budgetAmount: 650000,
      budgetCurrency: 'INR',
      travelType: 'leisure',
      accommodationPreference: '5_star',
      specialRequirements: 'Flight tickets, Heathrow transfers, and Edinburgh Castle tour confirmed.',
      leadSource: 'referral',
      stage: STAGES.BOOKING_CONFIRMED,
      estimatedValue: 650000,
      quotationAmount: 640000,
      quotationSentAt: new Date(now - 10 * dayMs),
      lastActivityAt: new Date(now - 1 * dayMs),
      lastCustomerContactAt: new Date(now - 1 * dayMs)
    },

    // 11. Lost Enquiry (Terminal Closed — Excluded from Action Center)
    {
      customerName: 'Karan Grover',
      phone: '+919818833445',
      email: 'karan.grover@example.com',
      destination: 'South Africa Safari',
      departureCity: 'Delhi',
      travelStartDate: new Date(now + 60 * dayMs),
      travelEndDate: new Date(now + 70 * dayMs),
      travellerCount: 4,
      budgetAmount: 750000,
      budgetCurrency: 'INR',
      travelType: 'adventure',
      accommodationPreference: 'resort',
      specialRequirements: 'Kruger National Park luxury lodge requested.',
      leadSource: 'social',
      stage: STAGES.LOST,
      estimatedValue: 750000,
      quotationAmount: 740000,
      quotationSentAt: new Date(now - 12 * dayMs),
      lastActivityAt: new Date(now - 4 * dayMs),
      lastCustomerContactAt: new Date(now - 4 * dayMs),
      lostReason: 'Customer postponed travel plans to next year due to professional commitments.'
    }
  ];
}
