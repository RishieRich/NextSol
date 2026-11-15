import { motionTokens } from "@/lib/motion";

/** cubic-bezier(0.16, 1, 0.3, 1), the `easeOut` token, close enough as an expo-out curve for a scroll glide. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

let cancelCurrent: (() => void) | null = null;

/**
 * Takes the page back to the top in under a second, however far down the visitor is
 * (the browser's own smooth scroll takes over two seconds from the footer of the home page).
 * Instant under reduced motion. Any wheel, touch or key press hands control straight back to the visitor.
 * Moves focus to <main> so keyboard users continue from the top.
 */
export function scrollToTop(): void {
  cancelCurrent?.();
  const main = document.getElementById("main");
  const start = window.scrollY;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || start < 2) {
    window.scrollTo({ top: 0, behavior: "instant" });
    main?.focus({ preventScroll: true });
    return;
  }

  // Short trips stay short; long ones are capped, so the footer is no slower than the fold.
  const duration = Math.min(motionTokens.dur4, Math.max(motionTokens.dur3, start / 6000)) * 1000;
  const began = performance.now();
  let frame = 0;

  const stop = () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    cancelCurrent = null;
  };

  const step = (now: number) => {
    const t = Math.min(1, (now - began) / duration);
    window.scrollTo({ top: Math.round(start * (1 - easeOutExpo(t))), behavior: "instant" });
    if (t < 1) frame = window.requestAnimationFrame(step);
    else stop();
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  cancelCurrent = stop;
  frame = window.requestAnimationFrame(step);
  main?.focus({ preventScroll: true });
}
