/**
 * "Quick guide: find the right software". A scripted, deterministic decision tree: no model, no guessing.
 * Every path ends in a recommendation that names a product slug from content/products.ts
 * (domain/guide.test.ts walks every path to prove it).
 *
 * Accounting questions reuse adviseLicence, so the guide and the licence advisor never disagree.
 */

import type { EditionId } from "@/content/tally";
import type { EnquiryNeed } from "./enquiry";
import { adviseLicence, type Locations, type UsersAtOnce } from "./licence";

export type GuideResult = {
  /** A slug in content/products.ts. */
  product: string;
  /** Shown with the recommendation. When absent, the UI shows the product's own one-liner. */
  reason?: string;
  edition?: EditionId;
  /** Pre-selects the enquiry topic in the WhatsApp message. */
  need: EnquiryNeed;
};

export type GuideNext = { node: GuideNodeId } | { result: GuideResult };
export type GuideOption = { id: string; label: string; next: GuideNext };
export type GuideNode = { id: GuideNodeId; prompt: string; options: GuideOption[] };

export type GuideNodeId =
  | "start"
  | "accounting-users"
  | "accounting-locations-one"
  | "accounting-locations-several"
  | "shop-kind"
  | "shop-gst"
  | "away"
  | "marketing"
  | "web"
  | "it";

export const GUIDE_START: GuideNodeId = "start";

function accountingResult(usersAtOnce: UsersAtOnce, locations: Locations): GuideResult {
  const advice = adviseLicence({ usersAtOnce, locations });
  if (advice.kind === "consult") {
    return { product: "tally-on-cloud", reason: advice.reason, need: "Tally on Cloud or Mobile" };
  }
  return { product: "tally-prime", edition: advice.edition, reason: advice.reason, need: "New Tally licence" };
}

const locationsNode = (id: GuideNodeId, usersAtOnce: UsersAtOnce): GuideNode => ({
  id,
  prompt: "Does everyone work from one place, or from more than one office or branch?",
  options: [
    { id: "one-place", label: "One place", next: { result: accountingResult(usersAtOnce, "one") } },
    { id: "several-places", label: "More than one place", next: { result: accountingResult(usersAtOnce, "several") } },
  ],
});

export const guideNodes: Record<GuideNodeId, GuideNode> = {
  start: {
    id: "start",
    prompt: "Hi! Answer two or three quick questions and we will point you to the right software. What do you need?",
    options: [
      { id: "accounting", label: "Accounting and GST", next: { node: "accounting-users" } },
      { id: "shop", label: "Billing for a shop", next: { node: "shop-kind" } },
      { id: "payroll", label: "Payroll", next: { result: { product: "saral-payroll-software", need: "Billing or payroll software" } } },
      { id: "away", label: "Tally on my phone or away from the office", next: { node: "away" } },
      { id: "marketing", label: "Marketing and design", next: { node: "marketing" } },
      { id: "web", label: "A website or app", next: { node: "web" } },
      { id: "it", label: "Computers or CCTV", next: { node: "it" } },
    ],
  },
  "accounting-users": {
    id: "accounting-users",
    prompt: "How many people need to work in the accounts at the same time?",
    options: [
      { id: "one-user", label: "Just one person", next: { node: "accounting-locations-one" } },
      { id: "several-users", label: "Two or more people", next: { node: "accounting-locations-several" } },
    ],
  },
  "accounting-locations-one": locationsNode("accounting-locations-one", "one"),
  "accounting-locations-several": locationsNode("accounting-locations-several", "several"),
  "shop-kind": {
    id: "shop-kind",
    prompt: "What kind of shop is it?",
    options: [
      { id: "retail", label: "Retail or FMCG, with a lot of stock", next: { result: { product: "busy", need: "Billing or payroll software" } } },
      { id: "simple", label: "A simple billing setup", next: { node: "shop-gst" } },
    ],
  },
  "shop-gst": {
    id: "shop-gst",
    prompt: "Do you also want GST returns and stock by batch or expiry in the same software?",
    options: [
      { id: "gst-yes", label: "Yes, billing and accounts together", next: { result: { product: "saral-billing", need: "Billing or payroll software" } } },
      { id: "gst-no", label: "No, just quick bills", next: { result: { product: "vyapar", need: "Billing or payroll software" } } },
    ],
  },
  away: {
    id: "away",
    prompt: "Where do you want your Tally?",
    options: [
      { id: "phone", label: "On my phone", next: { result: { product: "tally-on-mobile", need: "Tally on Cloud or Mobile" } } },
      { id: "anywhere", label: "On computers at a branch or at home", next: { result: { product: "tally-on-cloud", need: "Tally on Cloud or Mobile" } } },
      { id: "backup", label: "I just want my data backed up", next: { result: { product: "tally-autobackup", need: "Tally setup, training or support" } } },
    ],
  },
  marketing: {
    id: "marketing",
    prompt: "Which of these is closest?",
    options: [
      { id: "social", label: "Social media pages and ads", next: { result: { product: "social-media-marketing", need: "Design or marketing" } } },
      { id: "design", label: "A logo, packaging or brochure", next: { result: { product: "design", need: "Design or marketing" } } },
      { id: "whatsapp", label: "WhatsApp messages to many customers", next: { result: { product: "bulk-whatsapp", need: "Design or marketing" } } },
    ],
  },
  web: {
    id: "web",
    prompt: "Which one?",
    options: [
      { id: "website", label: "A website or online store", next: { result: { product: "web-and-ecommerce", need: "Website or app" } } },
      { id: "app", label: "A mobile app", next: { result: { product: "mobile-apps", need: "Website or app" } } },
    ],
  },
  it: {
    id: "it",
    prompt: "What do you need?",
    options: [
      { id: "computers", label: "Computers or laptops", next: { result: { product: "computers", need: "Computers, CCTV or barcode" } } },
      { id: "cctv", label: "CCTV cameras", next: { result: { product: "cctv", need: "Computers, CCTV or barcode" } } },
      { id: "barcode", label: "Barcode scanning and labels", next: { result: { product: "barcode-solutions", need: "Computers, CCTV or barcode" } } },
    ],
  },
};

export function guideNode(id: GuideNodeId): GuideNode {
  return guideNodes[id];
}

/** Every path through the tree, as the labels chosen and where it ends. Used by tests. */
export function allGuidePaths(): { answers: string[]; result: GuideResult }[] {
  const paths: { answers: string[]; result: GuideResult }[] = [];
  const walk = (id: GuideNodeId, answers: string[], seen: Set<GuideNodeId>) => {
    if (seen.has(id)) throw new Error(`Guide loops at ${id}`);
    const next = new Set(seen).add(id);
    for (const option of guideNodes[id].options) {
      const chosen = [...answers, option.label];
      if ("result" in option.next) paths.push({ answers: chosen, result: option.next.result });
      else walk(option.next.node, chosen, next);
    }
  };
  walk(GUIDE_START, [], new Set());
  return paths;
}

/** The free-text part of the WhatsApp message: what was recommended and the answers that led there. */
export function guideMessage(productName: string, answers: readonly string[], edition?: string): string {
  const pick = edition ? `${productName} (${edition})` : productName;
  return [`The quick guide on your website suggested ${pick}.`, `My answers: ${answers.join("; ")}.`].join("\n");
}
