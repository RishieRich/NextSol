"use client";

import { OPEN_GUIDE_EVENT } from "@/components/guide/Guide";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/content/business";
import { telHref } from "@/domain/format";
import { whatsappUrl } from "@/domain/enquiry";
import styles from "./MobileActionBar.module.css";

/** Phone-only bar: call, WhatsApp, or open the quick guide, each in one tap. */
export function MobileActionBar() {
  return (
    <div className={styles.bar} role="region" aria-label="Quick contact">
      <a href={telHref(business.phoneE164)} className={`${styles.action} ${styles.call}`}>
        <Icon name="phone" size={20} />
        Call
      </a>
      <button type="button" className={`${styles.action} ${styles.guide}`} onClick={() => window.dispatchEvent(new Event(OPEN_GUIDE_EVENT))}>
        <Icon name="compass" size={20} />
        Guide
      </button>
      <a
        href={whatsappUrl(business.whatsappE164)}
        className={`${styles.action} ${styles.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="chat" size={20} />
        WhatsApp
      </a>
    </div>
  );
}
