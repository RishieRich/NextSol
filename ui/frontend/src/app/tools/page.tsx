import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { ToolCards } from "@/components/tools/ToolCards";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { externalResources, tools, toolsHub } from "@/content/tools";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({ title: toolsHub.seoTitle, description: toolsHub.seoDescription, path: "/tools/" });

export default function ToolsHubPage() {
  return (
    <>
      <PageIntro title={toolsHub.title} lede={toolsHub.lede} />
      <section className={styles.section} aria-label="Free tools">
        <div className="container">
          <ToolCards items={tools} />
        </div>
      </section>
      {externalResources.length > 0 ? (
        <section className={styles.section} aria-labelledby="resources-title">
          <div className="container">
            <SectionHeader id="resources-title" title="Other free resources" />
            <ul className={styles.resources}>
              {externalResources.map((resource) => (
                <li key={resource.url}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.name}
                  </a>{" "}
                  {resource.note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <CtaBand />
    </>
  );
}
