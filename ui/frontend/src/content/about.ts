/** About page: Niket's three values (from his site) and a timeline built only from real facts. */

import type { EmojiKey } from "./emoji";

export const values: { emoji: EmojiKey; title: string; body: string }[] = [
  {
    emoji: "heart",
    title: "Respect and faith",
    body: "We treat every customer with respect, and keep the faith they put in us.",
  },
  {
    emoji: "idea",
    title: "Creativity and innovation",
    body: "We grow through creativity and innovation.",
  },
  {
    emoji: "support",
    title: "Honesty and ethics",
    body: "Honesty and ethics in every dealing.",
  },
];

/**
 * Milestones only from real facts: founded in 2015, and the product lines he carries today.
 * No invented years: undated steps say "Since then".
 */
export const timeline: { when: string; title: string; body: string; emoji: EmojiKey }[] = [
  {
    when: "2015",
    title: "Next Solutions opens in Vapi",
    body: "Niket Naik starts the business to sell, implement and customise Tally for local businesses.",
    emoji: "rocket",
  },
  {
    when: "Since then",
    title: "More software for more kinds of business",
    body: "Saral Billing and Accounts, Saral PayPack payroll, Busy, Vyapar and a Real Estate CRM join TallyPrime.",
    emoji: "saral",
  },
  {
    when: "Since then",
    title: "Tally beyond the office",
    body: "Tally on Cloud, Tally on Mobile with Biz Analyst, and scheduled Tally backups.",
    emoji: "cloud",
  },
  {
    when: "Since then",
    title: "Design, marketing and IT",
    body: "Social media marketing, logo and packaging design, websites, apps, barcode solutions, computers and CCTV.",
    emoji: "marketing",
  },
  {
    when: "Today",
    title: "One shop for the whole setup",
    body: "A local team at GIDC, Vapi, looking after software, design and IT for the businesses around it.",
    emoji: "location",
  },
];
