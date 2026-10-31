import type { Metadata } from "next";

import { business } from "@/content/business";
import { config } from "./config";

type PageMeta = { title: string; description: string; path: string };

/** Per-page metadata with canonical URL and social previews, built the same way everywhere. */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const url = new URL(path, config.siteUrl).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: business.name,
      locale: "en_IN",
      type: "website",
    },
  };
}

/** schema.org LocalBusiness data so search engines show the right name, address, phone and hours. */
export function localBusinessJsonLd(): Record<string, unknown> {
  const { address, hours } = business;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: business.name,
    alternateName: business.shortName,
    url: config.siteUrl,
    logo: new URL("/brand/logo.webp", config.siteUrl).toString(),
    image: new URL("/brand/logo.webp", config.siteUrl).toString(),
    email: business.email ?? undefined,
    telephone: `+${business.phoneE164}`,
    foundingDate: String(business.foundedYear),
    founder: { "@type": "Person", name: business.founder },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: business.serviceArea,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: hours.open,
        closes: hours.close,
      },
    ],
    sameAs: Object.values(business.links),
  };
}

/** schema.org WebApplication for a free tool page. */
export function toolJsonLd(tool: { name: string; seoDescription: string; path: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.seoDescription,
    url: new URL(tool.path, config.siteUrl).toString(),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: { "@type": "Organization", name: business.name, url: config.siteUrl },
  };
}

/** schema.org Service for a product page, with the business as provider. */
export function serviceJsonLd(product: { name: string; oneLiner: string; page?: string; vendor?: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.name,
    description: product.oneLiner,
    url: product.page ? new URL(product.page, config.siteUrl).toString() : config.siteUrl,
    ...(product.vendor ? { brand: { "@type": "Brand", name: product.vendor } } : {}),
    areaServed: business.serviceArea,
    provider: {
      "@type": "ProfessionalService",
      name: business.name,
      url: config.siteUrl,
      telephone: `+${business.phoneE164}`,
    },
  };
}

/** Google Maps search link for the canonical address. No embed, so no third-party script on the page. */
export function mapsUrl(): string {
  const { address } = business;
  const query = [business.name, address.line1, address.line2, address.city, address.state, address.postalCode].join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
