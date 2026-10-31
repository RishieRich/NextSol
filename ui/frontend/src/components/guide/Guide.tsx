"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";

import { Emoji } from "@/components/ui/Emoji";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/content/business";
import { getProduct } from "@/content/products";
import { editions } from "@/content/tally";
import { buildEnquiry, whatsappUrl } from "@/domain/enquiry";
import { GUIDE_START, guideMessage, guideNode, type GuideNodeId, type GuideOption, type GuideResult } from "@/domain/guide";
import { motionTokens } from "@/lib/motion";
import styles from "./Guide.module.css";

export const OPEN_GUIDE_EVENT = "ns:open-guide";

const TYPING_MS = 600;
const ABOVE_FOLD_DELAY_MS = 4000;

type Step = { node: GuideNodeId; answer?: string };

/**
 * "Quick guide: find the right software". A scripted chat-style panel over the decision tree in domain/guide.ts.
 * Not AI: every question and answer is written down in advance.
 * Opens from a floating button (desktop) or the mobile action bar. Focus moves in and is trapped,
 * Escape closes, new messages are announced politely.
 */
export function Guide() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [steps, setSteps] = useState<Step[]>([{ node: GUIDE_START }]);
  const [result, setResult] = useState<{ result: GuideResult; answers: string[] } | null>(null);
  const [typing, setTyping] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Floating button: right away once the visitor scrolls, otherwise after 4 s at the top of the page.
  useEffect(() => {
    const reveal = () => setShowButton(true);
    const timer = window.setTimeout(reveal, ABOVE_FOLD_DELAY_MS);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const show = useCallback(() => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  useEffect(() => {
    const onOpen = () => show();
    window.addEventListener(OPEN_GUIDE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_GUIDE_EVENT, onOpen);
  }, [show]);

  // Close on navigation (a "View details" link was followed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Focus into the panel on open; trap Tab; Escape closes.
  useEffect(() => {
    if (!open) return;
    const node = panel.current;
    window.requestAnimationFrame(() => node?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const focusable = [...node.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex]:not([tabindex='-1'])")].filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Keep the newest message in view.
  useEffect(() => {
    const node = log.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [steps, typing, result]);

  const answers = steps.map((step) => step.answer).filter((a): a is string => Boolean(a));
  const current = steps[steps.length - 1];
  const currentNode = current ? guideNode(current.node) : null;

  const typeThen = (fn: () => void) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        fn();
        window.requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
      },
      reduce ? 0 : TYPING_MS,
    );
  };

  const choose = (option: GuideOption) => {
    const chosen = [...answers, option.label];
    if ("result" in option.next) {
      const outcome = option.next.result;
      setSteps((s) => [...s.slice(0, -1), { ...s[s.length - 1]!, answer: option.label }]);
      typeThen(() => setResult({ result: outcome, answers: chosen }));
    } else {
      const nextNode = option.next.node;
      setSteps((s) => [...s.slice(0, -1), { ...s[s.length - 1]!, answer: option.label }]);
      typeThen(() => setSteps((s) => [...s, { node: nextNode }]));
    }
  };

  const back = () => {
    if (result) {
      setResult(null);
      setSteps((s) => [...s.slice(0, -1), { node: s[s.length - 1]!.node }]);
    } else if (steps.length > 1) {
      setSteps((s) => {
        const trimmed = s.slice(0, -1);
        return [...trimmed.slice(0, -1), { node: trimmed[trimmed.length - 1]!.node }];
      });
    }
    window.requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
  };

  const restart = () => {
    setResult(null);
    setName("");
    setNameError(null);
    setSteps([{ node: GUIDE_START }]);
    window.requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
  };

  const product = result ? getProduct(result.result.product) : null;
  const editionName = result?.result.edition ? editions[result.result.edition].name : undefined;

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!result || !product) return;
    const enquiry = buildEnquiry({
      name,
      business: "",
      phone: "",
      need: result.result.need,
      message: guideMessage(product.name, result.answers, editionName),
    });
    if (!enquiry.ok) {
      setNameError(enquiry.errors.name ?? "Check your name.");
      return;
    }
    setNameError(null);
    window.open(whatsappUrl(business.whatsappE164, enquiry.text), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        data-visible={showButton && !open}
        aria-hidden={!showButton || open}
        tabIndex={showButton && !open ? 0 : -1}
        onClick={show}
      >
        <Emoji name="search" size={28} shadow={false} />
        <span>Find the right software</span>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <m.div
              className={styles.scrim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden="true"
            />
            <m.div
              ref={panel}
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: motionTokens.dur1 } }}
              transition={{ duration: motionTokens.dur2, ease: motionTokens.easeOut }}
            >
              <header className={styles.head}>
                <Emoji name="search" size={36} shadow={false} />
                <div>
                  <h2 id={titleId} className={styles.title}>
                    Quick guide: find the right software
                  </h2>
                  <p className={styles.sub}>A few set questions from {business.name}. Not AI, just our usual advice.</p>
                </div>
                <button type="button" className={styles.close} onClick={close}>
                  <Icon name="close" size={20} />
                  <span className="visually-hidden">Close the guide</span>
                </button>
              </header>

              <div ref={log} className={styles.log} aria-live="polite" aria-relevant="additions">
                {steps.map((step, index) => {
                  const node = guideNode(step.node);
                  return (
                    <div key={`${step.node}-${index}`} className={styles.turn}>
                      <p className={styles.bot}>{node.prompt}</p>
                      {step.answer ? <p className={styles.me}>{step.answer}</p> : null}
                    </div>
                  );
                })}

                {typing ? (
                  <p className={styles.typing}>
                    <span className="visually-hidden">Typing</span>
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                  </p>
                ) : null}

                {result && product ? (
                  <div className={styles.result}>
                    <p className={styles.bot}>Here is what we would suggest:</p>
                    <div className={styles.card}>
                      <Emoji name={product.emoji} size={56} />
                      <div>
                        <p className={styles.cardName}>{editionName ?? product.name}</p>
                        <p className={styles.cardReason}>{result.result.reason ?? product.oneLiner}</p>
                        {product.page ? (
                          <Link href={product.page} className={styles.cardLink}>
                            View {product.name} <Icon name="arrowRight" size={16} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    <form className={styles.send} onSubmit={send} noValidate>
                      <label htmlFor="guide-name">Your name</label>
                      <div className={styles.sendRow}>
                        <input
                          id="guide-name"
                          data-autofocus=""
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          autoComplete="name"
                          aria-invalid={Boolean(nameError)}
                          aria-describedby={nameError ? "guide-name-error" : undefined}
                        />
                        <button type="submit" className={styles.sendButton}>
                          <Icon name="chat" size={18} />
                          Send on WhatsApp
                        </button>
                      </div>
                      {nameError ? (
                        <p id="guide-name-error" className={styles.error}>
                          {nameError}
                        </p>
                      ) : null}
                    </form>
                  </div>
                ) : null}
              </div>

              <footer className={styles.foot}>
                {!result && !typing && currentNode ? (
                  <div className={styles.options} role="group" aria-label="Your answer">
                    {currentNode.options.map((option, index) => (
                      <button
                        key={option.id}
                        type="button"
                        className={styles.option}
                        onClick={() => choose(option)}
                        data-autofocus={index === 0 ? "" : undefined}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className={styles.nav}>
                  <button type="button" className={styles.navButton} onClick={back} disabled={typing || (steps.length <= 1 && !result)}>
                    <Icon name="arrowLeft" size={16} />
                    Back
                  </button>
                  <button type="button" className={styles.navButton} onClick={restart} disabled={typing || (steps.length <= 1 && !result)}>
                    Start over
                  </button>
                </div>
              </footer>
            </m.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
