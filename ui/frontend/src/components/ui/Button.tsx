import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, type IconName } from "./Icon";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "outlineOnColor";
type Size = "sm" | "md" | "lg";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Icon after the label instead of before it. */
  iconEnd?: IconName;
  className?: string;
  ariaLabel?: string;
};

function classes(variant: Variant, size: Size, className?: string) {
  return [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
}

/** Primary buttons get the magnetic pull (PointerEffects) and the shine sweep. */
const magnetic = (variant: Variant) => (variant === "primary" || variant === "onDark" ? { "data-magnetic": "" } : {});

/** Internal routes use Next's Link; tel:, wa.me and other external links use a plain anchor. */
export function ButtonLink({ href, children, variant = "primary", size = "md", icon, iconEnd, className, ariaLabel }: ButtonLinkProps) {
  const iconSize = size === "lg" ? 20 : 18;
  const content = (
    <>
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      <span>{children}</span>
      {iconEnd ? <Icon name={iconEnd} size={iconSize} className={styles.iconEnd} /> : null}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes(variant, size, className)} aria-label={ariaLabel} {...magnetic(variant)}>
        {content}
      </Link>
    );
  }

  const isWeb = href.startsWith("http");
  return (
    <a
      href={href}
      className={classes(variant, size, className)}
      aria-label={ariaLabel}
      {...magnetic(variant)}
      {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

type ButtonProps = Omit<ButtonLinkProps, "href"> & {
  type?: "button" | "submit";
  onClick?: () => void;
  ariaPressed?: boolean;
};

export function Button({ children, variant = "primary", size = "md", icon, iconEnd, className, type = "button", onClick, ariaPressed, ariaLabel }: ButtonProps) {
  const iconSize = size === "lg" ? 20 : 18;
  return (
    <button
      type={type}
      onClick={onClick}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      className={classes(variant, size, className)}
      {...magnetic(variant)}
    >
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      <span>{children}</span>
      {iconEnd ? <Icon name={iconEnd} size={iconSize} className={styles.iconEnd} /> : null}
    </button>
  );
}
