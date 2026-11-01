import type { ReactNode } from "react";

import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { tools, type Tool } from "@/content/tools";
import { SourceNote } from "./SourceNote";
import { ToolCards } from "./ToolCards";
import styles from "./ToolLayout.module.css";

type SourceLike = { label: string; url: string; asOf?: string };

/** Every tool page: the h1, the tool, how it is calculated (with sources), related tools, and the pitch. */
export function ToolLayout({ tool, sources, children }: { tool: Tool; sources: SourceLike[]; children: ReactNode }) {
  const related = tools.filter((item) => item.id !== tool.id);

  return (
    <>
      <PageIntro title={tool.name} lede={tool.summary} />

      <section className={styles.tool} aria-label={tool.name}>
        <div className="container">{children}</div>
      </section>

      <section className={styles.section} aria-labelledby="method-title">
        <div className="container">
          <div className={styles.method}>
            <h2 id="method-title" className={styles.methodTitle}>
              How this is calculated
            </h2>
            <ol className={styles.steps}>
              {tool.method.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className={styles.sources}>
              {sources.map((source) => (
                <SourceNote key={source.url} source={source} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="related-title">
        <div className="container">
          <SectionHeader id="related-title" title="More free tools" />
          <ToolCards items={related} headingLevel={3} />
        </div>
      </section>

      <CtaBand
        title={`Need this inside Tally? ${tool.relatedService.label}`}
        text={tool.pitch}
        whatsappText={`Hi, I used the ${tool.name} on your website. I'd like help with ${tool.relatedService.label.toLowerCase()}.`}
        link={{ label: `See ${tool.relatedService.label.toLowerCase()}`, href: tool.relatedService.href }}
      />
    </>
  );
}
