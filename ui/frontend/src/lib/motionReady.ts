/**
 * Runs in <head> before first paint. Hidden starting states in CSS and Motion apply only under
 * `motion-ready`, so without JavaScript (and for crawlers) every page renders in its final state.
 * `save-data` turns off decorative loops for visitors who asked their browser to save data.
 */
export function applyMotionReady(): void {
  const root = document.documentElement;
  root.classList.add("motion-ready");
  try {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) root.classList.add("save-data");
  } catch {
    // Network Information API unavailable: keep loops on.
  }
}

/** The same function as an inline script for layout.tsx. */
export const MOTION_READY_SCRIPT = `(${applyMotionReady.toString()})()`;
