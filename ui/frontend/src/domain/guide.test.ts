import { describe, expect, it } from "vitest";

import { emoji } from "@/content/emoji";
import { products } from "@/content/products";
import { editions } from "@/content/tally";
import { buildEnquiry, enquiryNeeds } from "./enquiry";
import { allGuidePaths, GUIDE_START, guideMessage, guideNodes, type GuideNodeId } from "./guide";

const slugs = new Set(products.map((product) => product.slug));

describe("quick guide", () => {
  const paths = allGuidePaths();

  it("ends every path in a product that exists", () => {
    expect(paths.length).toBeGreaterThan(10);
    for (const path of paths) expect(slugs.has(path.result.product), path.answers.join(" > ")).toBe(true);
  });

  it("uses only enquiry needs the form knows", () => {
    for (const path of paths) expect(enquiryNeeds).toContain(path.result.need);
  });

  it("has no dead ends or unreachable questions", () => {
    const reached = new Set<GuideNodeId>([GUIDE_START]);
    for (const node of Object.values(guideNodes)) {
      expect(node.options.length, node.id).toBeGreaterThanOrEqual(2);
      for (const option of node.options) if ("node" in option.next) reached.add(option.next.node);
    }
    expect([...reached].sort()).toEqual(Object.keys(guideNodes).sort());
  });

  it("agrees with the licence advisor", () => {
    const solo = paths.find((p) => p.answers.join("|") === "Accounting and GST|Just one person|One place");
    const team = paths.find((p) => p.answers.join("|") === "Accounting and GST|Two or more people|One place");
    const branches = paths.find((p) => p.answers.join("|") === "Accounting and GST|Two or more people|More than one place");
    expect(solo?.result).toMatchObject({ product: "tally-prime", edition: "silver" });
    expect(team?.result).toMatchObject({ product: "tally-prime", edition: "gold" });
    expect(branches?.result.product).toBe("tally-on-cloud");
    for (const path of paths) if (path.result.edition) expect(Object.keys(editions)).toContain(path.result.edition);
  });

  it("sends a valid enquiry naming the product", () => {
    const path = paths[0]!;
    const text = guideMessage("TallyPrime", path.answers, "Silver");
    const enquiry = buildEnquiry({ name: "Asha", business: "", phone: "", need: path.result.need, message: text });
    expect(enquiry.ok).toBe(true);
    if (enquiry.ok) {
      expect(enquiry.text).toContain("TallyPrime (Silver)");
      expect(enquiry.text).toContain(path.answers[0]);
    }
  });
});

describe("products content", () => {
  it("has unique slugs", () => {
    expect(slugs.size).toBe(products.length);
  });

  it("uses only emoji keys that exist", () => {
    for (const product of products) {
      expect(emoji[product.emoji], product.slug).toBeDefined();
      for (const feature of product.features ?? []) expect(emoji[feature.emoji], `${product.slug}: ${feature.title}`).toBeDefined();
    }
  });

  it("relates only to products that exist", () => {
    for (const product of products) for (const slug of product.related) expect(slugs.has(slug), `${product.slug} -> ${slug}`).toBe(true);
  });

  it("gives every price a source", () => {
    for (const product of products) {
      if (!product.prices) continue;
      expect(product.prices.source.url).toMatch(/^https:\/\//);
      for (const item of product.prices.items) {
        expect(item.price.source.url, `${product.slug}: ${item.label}`).toMatch(/^https:\/\//);
        expect(item.price.source.asOf.length).toBeGreaterThan(0);
      }
    }
  });

  it("links product pages to their own route", () => {
    for (const product of products) if (product.page) expect(product.page).toMatch(/^\/[a-z-]+\/(#[a-z-]+)?$/);
  });
});
