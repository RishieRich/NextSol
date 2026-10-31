/**
 * The one source of truth for who Next Solutions is and how to reach them.
 * Header, footer, contact page, enquiry links and search-engine data all read from here,
 * so a phone number or address changes in exactly one place.
 *
 * Facts read from nxtsolutions.in on 31 October 2026. Items marked CONFIRM are in HANDOFF.md.
 */

export const business = {
  name: "Next Solutions",
  shortName: "NXT Solutions",
  legalForm: "Proprietorship",
  founder: "Niket Naik",
  foundedYear: 2015,
  gstin: "24AQJPN0910D1ZD",

  /** International format, digits only. Used to build tel: and WhatsApp links. */
  phoneE164: "919727671017",
  /** How the number is shown to people. */
  phoneDisplay: "+91 97276 71017",
  /** CONFIRM: assumed to be the same number as the phone line. */
  whatsappE164: "919727671017",
  email: "info@nxtsolutions.in" as string | null,
  /** CONFIRM: listed on his site for sales; check it is still read. */
  salesEmail: "nextsolutions.service@gmail.com" as string | null,

  /** Matches his site and his Google listing. */
  address: {
    line1: "Shop No. 16, Bass Complex",
    line2: "GIDC",
    city: "Vapi",
    district: "Valsad",
    state: "Gujarat",
    postalCode: "396191",
    country: "IN",
  },

  hours: {
    days: "Monday to Saturday",
    open: "09:00",
    close: "19:00",
    display: "Monday to Saturday, 9 AM to 7 PM",
    closedDisplay: "Closed on Sundays",
  },

  serviceArea: "Vapi and nearby industrial areas",

  links: {
    facebook: "https://www.facebook.com/NextSolutions7",
    linkedin: "https://www.linkedin.com/company/nxtsolutions/",
    founderLinkedin: "https://www.linkedin.com/in/niketnaik-founder/",
    indiamart: "https://www.indiamart.com/next-solutions-vapi/",
  },
} as const;

export type Business = typeof business;
