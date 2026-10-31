"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import styles from "./ToolForm.module.css";

type State = "idle" | "copied" | "failed";

/** Copies a result with the Clipboard API. Blocked or missing clipboard shows a fallback hint instead of failing silently. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <span className={styles.actions}>
      <Button variant="secondary" icon="copy" onClick={copy}>
        {label}
      </Button>
      <span role="status">
        {state === "copied" ? <span className={styles.copied}>Copied</span> : null}
        {state === "failed" ? <span className={styles.copyFailed}>Copy did not work here. Select the text and copy it.</span> : null}
      </span>
    </span>
  );
}
