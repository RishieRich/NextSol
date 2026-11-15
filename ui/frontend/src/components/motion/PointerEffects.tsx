"use client";

import { useEffect } from "react";

const MAX_TILT_DEG = 8;
const MAX_PULL_PX = 6;

/**
 * One delegated pointer listener for the whole site (devices with a fine pointer and hover only):
 * - [data-spotlight] cards get --mx / --my for the radial spotlight and --tilt-x / --tilt-y for their emoji;
 * - [data-magnetic] buttons drift toward the pointer by up to 6 px.
 * Off under reduced motion. Writes CSS variables only, once per animation frame.
 * Separately, for every pointer type: [data-ripple] buttons get a press ripple from the press point.
 */
export function PointerEffects() {
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canHover.matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    let activeCard: HTMLElement | null = null;
    let activeMagnet: HTMLElement | null = null;

    const resetCard = (card: HTMLElement) => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
    const resetMagnet = (magnet: HTMLElement) => {
      magnet.style.setProperty("--pull-x", "0px");
      magnet.style.setProperty("--pull-y", "0px");
    };

    const apply = () => {
      frame = 0;
      const event = lastEvent;
      if (!event) return;
      const target = event.target instanceof Element ? event.target : null;

      const card = target?.closest<HTMLElement>("[data-spotlight]") ?? null;
      if (activeCard && activeCard !== card) resetCard(activeCard);
      activeCard = card;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        if (!reduce.matches) {
          card.style.setProperty("--tilt-y", `${((x - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
          card.style.setProperty("--tilt-x", `${((0.5 - y) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
        }
      }

      const magnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (activeMagnet && activeMagnet !== magnet) resetMagnet(activeMagnet);
      activeMagnet = magnet;
      if (magnet && !reduce.matches) {
        const rect = magnet.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        magnet.style.setProperty("--pull-x", `${(Math.max(-1, Math.min(1, dx)) * MAX_PULL_PX).toFixed(1)}px`);
        magnet.style.setProperty("--pull-y", `${(Math.max(-1, Math.min(1, dy)) * MAX_PULL_PX).toFixed(1)}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastEvent = event;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (activeCard) resetCard(activeCard);
      if (activeMagnet) resetMagnet(activeMagnet);
      activeCard = null;
      activeMagnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Press ripple on [data-ripple] buttons, for every pointer type (it is the tap feedback on phones).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onDown = (event: PointerEvent) => {
      if (reduce.matches || event.button !== 0) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-ripple]") : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // Big enough to reach the farthest corner from the press point.
      const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
      target.style.setProperty("--rx", `${x.toFixed(1)}px`);
      target.style.setProperty("--ry", `${y.toFixed(1)}px`);
      target.style.setProperty("--rs", `${(radius * 2).toFixed(1)}px`);
      target.dataset.ripple = target.dataset.ripple === "a" ? "b" : "a";
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
