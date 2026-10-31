"use client";

import { m } from "motion/react";
import { Fragment } from "react";

import { wordReveal } from "@/lib/motion";
import { useReveal } from "@/lib/useReveal";

/**
 * A heading's words revealing one by one. The real text stays in the heading for screen readers
 * and search (visually hidden); the split words are an aria-hidden visual copy.
 * `dot` adds Niket's blue full stop as a styled span.
 */
export function WordReveal({ text, dot = false, dotClassName }: { text: string; dot?: boolean; dotClassName?: string }) {
  const { ref, state } = useReveal<HTMLSpanElement>(0.4);
  const words = text.split(" ");

  return (
    <>
      <span className="visually-hidden">{dot ? `${text}.` : text}</span>
      <m.span ref={ref} aria-hidden="true" variants={wordReveal.container} initial={false} animate={state}>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <m.span variants={wordReveal.word} style={{ display: "inline-block" }}>
              {word}
              {index === words.length - 1 && dot ? <span className={dotClassName}>.</span> : null}
            </m.span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </m.span>
    </>
  );
}
