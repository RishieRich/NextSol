import { describe, expect, it } from "vitest";

import { business } from "@/content/business";
import { editions } from "@/content/tally";
import { buildEnquiry, normalisePhone, whatsappUrl } from "./enquiry";
import { formatInr, formatPrice, telHref, yearsSince } from "./format";
import { adviseLicence } from "./licence";

describe("adviseLicence", () => {
  it("recommends Silver for one user in one place", () => {
    const advice = adviseLicence({ usersAtOnce: "one", locations: "one" });
    expect(advice).toMatchObject({ kind: "edition", edition: "silver" });
  });

  it("recommends Gold for several users on one network", () => {
    const advice = adviseLicence({ usersAtOnce: "several", locations: "one" });
    expect(advice).toMatchObject({ kind: "edition", edition: "gold" });
  });

  it("asks for a conversation when several locations share the books", () => {
    expect(adviseLicence({ usersAtOnce: "one", locations: "several" }).kind).toBe("consult");
    expect(adviseLicence({ usersAtOnce: "several", locations: "several" }).kind).toBe("consult");
  });
});

describe("formatting", () => {
  it("uses Indian digit grouping", () => {
    expect(formatInr(270000)).toBe("₹2,70,000");
    expect(formatInr(67500)).toBe("₹67,500");
  });

  it("adds the price basis", () => {
    expect(formatPrice(editions.silver.rentalFrom)).toBe("₹750 a month");
    expect(formatPrice(editions.gold.tssRenewal)).toBe("₹13,500 a year");
    expect(formatPrice(editions.silver.lifetime)).toBe("₹22,500");
  });

  it("refuses invalid amounts instead of printing a plausible number", () => {
    expect(() => formatInr(-1)).toThrow(RangeError);
    expect(() => formatInr(Number.NaN)).toThrow(RangeError);
  });

  it("counts years in business and never goes negative", () => {
    expect(yearsSince(2015, new Date("2026-10-27"))).toBe(11);
    expect(yearsSince(2030, new Date("2026-10-27"))).toBe(0);
  });

  it("builds a tel link from the business record", () => {
    expect(telHref(business.phoneE164)).toBe("tel:+919727671017");
  });
});

describe("normalisePhone", () => {
  it.each([
    ["9727671017", "9727671017"],
    ["+91 97276 71017", "9727671017"],
    ["09727671017", "9727671017"],
    ["97276-71017", "9727671017"],
    ["", ""],
  ])("accepts %s", (raw, expected) => {
    expect(normalisePhone(raw)).toBe(expected);
  });

  it.each(["12345", "5727671017", "97276710171", "abcdefghij"])("rejects %s", (raw) => {
    expect(normalisePhone(raw)).toBeNull();
  });
});

describe("buildEnquiry", () => {
  const valid = {
    name: "Pawan",
    business: "Pawan Engineering",
    phone: "+91 98250 00000",
    need: "Tally customisation",
    message: "Need a production report.",
  };

  it("builds the WhatsApp message from valid input", () => {
    const result = buildEnquiry(valid);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.text).toContain("I need help with: Tally customisation");
    expect(result.text).toContain("Business: Pawan Engineering");
    expect(result.text).toContain("Mobile: 9825000000");
    expect(result.text.endsWith("Need a production report.")).toBe(true);
  });

  it("leaves out optional lines that were not filled in", () => {
    const result = buildEnquiry({ ...valid, business: "", phone: "", message: "" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.text).not.toContain("Business:");
    expect(result.text).not.toContain("Mobile:");
  });

  it("reports every invalid field at once", () => {
    const result = buildEnquiry({ name: " ", business: "", phone: "123", need: "Pizza", message: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["name", "need", "phone"]);
  });

  it("caps very long messages", () => {
    const result = buildEnquiry({ ...valid, message: "x".repeat(601) });
    expect(result.ok).toBe(false);
  });
});

describe("whatsappUrl", () => {
  it("encodes the message so line breaks and symbols survive", () => {
    const url = whatsappUrl("919727671017", "Hello\nTally & GST");
    expect(url).toBe("https://wa.me/919727671017?text=Hello%0ATally%20%26%20GST");
  });

  it("opens a plain chat when there is no message", () => {
    expect(whatsappUrl("919727671017")).toBe("https://wa.me/919727671017");
  });
});
