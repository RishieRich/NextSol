import { ToolCards } from "@/components/tools/ToolCards";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { tools } from "@/content/tools";
import styles from "./FreeToolsStrip.module.css";

/** Home page: one row linking to every free tool. */
export function FreeToolsStrip() {
  return (
    <section className={styles.section} aria-labelledby="free-tools-title">
      <div className="container">
        <SectionHeader
          id="free-tools-title"
          label="free tools"
          title="Free tools for your business"
          dot
          intro="GST, invoices and payment checks that run in your browser."
          aside={
            <ButtonLink href="/tools/" variant="secondary">
              All free tools
            </ButtonLink>
          }
        />
        <ToolCards items={tools} variant="strip" />
      </div>
    </section>
  );
}
