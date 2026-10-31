/** Site navigation, in Niket's order: Home, About, Products & Services, Digital Marketing, Contact. */

export type NavItem = { href: string; label: string; mega?: boolean };

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/services/", label: "Products & Services", mega: true },
  { href: "/portfolio/", label: "Digital marketing" },
  { href: "/tools/", label: "Free tools" },
  { href: "/contact/", label: "Contact" },
];

/** Mega-menu columns: product slugs from products.ts. */
export const megaMenu: { title: string; slugs: string[] }[] = [
  { title: "Tally and accounting", slugs: ["tally-prime", "tally-on-cloud", "tally-on-mobile", "tally-autobackup", "tally-customisation"] },
  { title: "Billing, payroll and more", slugs: ["saral-billing", "saral-payroll-software", "busy", "vyapar", "bulk-whatsapp"] },
];

/** Footer quick links, his pattern. */
export const footerLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/tally-prime/", label: "TallyPrime" },
  { href: "/tally-on-cloud/", label: "Tally on Cloud" },
  { href: "/tally-on-mobile/", label: "Tally on Mobile" },
  { href: "/saral-billing/", label: "Saral Billing" },
  { href: "/saral-payroll-software/", label: "Saral Payroll" },
  { href: "/portfolio/", label: "Digital marketing" },
  { href: "/tools/", label: "Free tools" },
  { href: "/contact/", label: "Contact" },
];

/** "Get a quote" opens the enquiry form on the contact page. */
export const quoteHref = "/contact/#enquiry";
