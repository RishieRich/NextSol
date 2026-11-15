"use client";

import { m } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { cascade, fadeUp, scaleIn, softReveal } from "@/lib/motion";
import { useReveal } from "@/lib/useReveal";

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "aside" | "p" | "figure" | "dl";

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  variant?: "fadeUp" | "scaleIn" | "soft";
  /** Seconds to wait after the element enters view; use motionTokens for sequences. */
  delay?: number;
  id?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
};

const variantsFor = { fadeUp, scaleIn, soft: softReveal };

/** One element that fades up the first time it scrolls into view. Visible without JavaScript. */
export function Reveal({ children, as = "div", className, style, variant = "fadeUp", delay = 0, ...rest }: RevealProps) {
  const { ref, state } = useReveal<HTMLElement>();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={style}
      variants={variantsFor[variant]}
      custom={delay}
      initial={false}
      animate={state}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** A list or grid whose children (CascadeItem) reveal one after another, once. */
export function Cascade({ children, as = "ul", className, style, ...rest }: Omit<RevealProps, "variant">) {
  const { ref, state } = useReveal<HTMLElement>(0.1);
  const Component = m[as] as typeof m.ul;
  return (
    <Component
      ref={ref as React.Ref<HTMLUListElement>}
      className={className}
      style={style}
      variants={cascade.container}
      initial={false}
      animate={state}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CascadeItem({
  children,
  as = "li",
  className,
  style,
  id,
  spotlight = false,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "aria-label"?: string;
  /** Pointer spotlight and emoji tilt (PointerEffects), for .fx-card items. */
  spotlight?: boolean;
}) {
  const Component = m[as] as typeof m.li;
  return (
    <Component
      className={className}
      style={style}
      variants={cascade.item}
      id={id}
      aria-label={ariaLabel}
      data-spotlight={spotlight ? "" : undefined}
    >
      {children}
    </Component>
  );
}
