import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AmountInWords } from "@/components/tools/AmountInWords";
import { GstCalculator } from "@/components/tools/GstCalculator";
import { GstinChecker } from "@/components/tools/GstinChecker";
import { InvoiceGenerator } from "@/components/tools/InvoiceGenerator";
import { MsmeInterest } from "@/components/tools/MsmeInterest";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { gstRates, msmedSource, rbiBankRate, toolHref, tools, type ToolId } from "@/content/tools";
import { pageMetadata, toolJsonLd } from "@/lib/seo";

type SourceLike = { label: string; url: string; asOf?: string };

const pages: Record<ToolId, { component: ReactNode; sources: SourceLike[] }> = {
  "gst-calculator": { component: <GstCalculator />, sources: [gstRates.source] },
  "gst-invoice-generator": { component: <InvoiceGenerator />, sources: [gstRates.source] },
  "gstin-checker": { component: <GstinChecker />, sources: [] },
  "msme-payment-interest": { component: <MsmeInterest />, sources: [msmedSource, rbiBankRate.source] },
  "amount-in-words": { component: <AmountInWords />, sources: [] },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) return {};
  return pageMetadata({ title: tool.seoTitle, description: tool.seoDescription, path: toolHref(tool) });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);
  if (!tool) notFound();
  const page = pages[tool.id];

  return (
    <>
      <ToolLayout tool={tool} sources={page.sources}>
        {page.component}
      </ToolLayout>
      <script
        type="application/ld+json"
        // JSON-LD must be inline; the data comes only from our own content files.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd({ ...tool, path: toolHref(tool) })) }}
      />
    </>
  );
}
