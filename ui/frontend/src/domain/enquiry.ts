/**
 * Enquiries go out as a pre-filled WhatsApp message: no server, no inbox to check,
 * and it lands where Niket already talks to customers.
 * Validation happens here, before anything leaves the page.
 */

export const enquiryNeeds = [
  "New Tally licence",
  "Tally renewal or upgrade",
  "Tally customisation",
  "Tally on Cloud or Mobile",
  "Tally setup, training or support",
  "Billing or payroll software",
  "Website or app",
  "Design or marketing",
  "Computers, CCTV or barcode",
  "Something else",
] as const;

export type EnquiryNeed = (typeof enquiryNeeds)[number];

export type EnquiryInput = {
  name: string;
  business: string;
  phone: string;
  need: string;
  message: string;
};

export type EnquiryField = keyof EnquiryInput;

export type EnquiryResult =
  | { ok: true; text: string }
  | { ok: false; errors: Partial<Record<EnquiryField, string>> };

const MAX_MESSAGE = 600;

/** Accepts 10-digit Indian mobiles with or without +91, spaces or dashes. Empty is allowed. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, "").replace(/^\+?91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, "");
  if (digits === "") return "";
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

function isNeed(value: string): value is EnquiryNeed {
  return (enquiryNeeds as readonly string[]).includes(value);
}

export function buildEnquiry(input: EnquiryInput): EnquiryResult {
  const errors: Partial<Record<EnquiryField, string>> = {};
  const name = input.name.trim();
  const business = input.business.trim();
  const message = input.message.trim();
  const phone = normalisePhone(input.phone.trim());

  if (name.length < 2) errors.name = "Enter your name.";
  if (!isNeed(input.need)) errors.need = "Choose what you need help with.";
  if (phone === null) errors.phone = "Enter a 10-digit mobile number, or leave it blank.";
  if (message.length > MAX_MESSAGE) errors.message = `Keep the message under ${MAX_MESSAGE} characters.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const lines = [
    "Hello Next Solutions,",
    "",
    `I need help with: ${input.need}`,
    `Name: ${name}`,
    business ? `Business: ${business}` : null,
    phone ? `Mobile: ${phone}` : null,
    message ? "" : null,
    message || null,
  ].filter((line): line is string => line !== null);

  return { ok: true, text: lines.join("\n") };
}

/** A wa.me link that opens WhatsApp with the message typed in, ready to send. */
export function whatsappUrl(e164Digits: string, text?: string): string {
  const base = `https://wa.me/${e164Digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
