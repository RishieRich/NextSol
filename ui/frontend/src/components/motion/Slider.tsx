"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";

import { Icon } from "@/components/ui/Icon";
import { useDecorativeMotion, usePageVisible } from "@/lib/useReveal";
import styles from "./Slider.module.css";

const AUTOPLAY_MS = 4500;

/**
 * Every slider on the site (Embla). Loop, drag and swipe; autoplay every 4.5 s that pauses on hover,
 * focus, off-screen and hidden tabs, and stops for good once the visitor drags or uses a control.
 * Round prev and next buttons, dot buttons with aria-current, a thin progress bar, and arrow keys.
 * Autoplay is off under reduced motion and Save-Data.
 */
export function Slider({ label, children, autoplay = true }: { label: string; children: ReactNode; autoplay?: boolean }) {
  const slides = Children.toArray(children);
  const motionOk = useDecorativeMotion();
  const pageVisible = usePageVisible();
  const [autoplayPlugin] = useState(() =>
    Autoplay({ delay: AUTOPLAY_MS, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false }),
  );
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false }, [autoplayPlugin]);

  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [userStopped, setUserStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    const onInit = () => {
      setSnaps(api.scrollSnapList());
      onSelect();
    };
    const onScroll = () => {
      const bar = progressRef.current;
      if (bar) bar.style.transform = `scaleX(${Math.max(0, Math.min(1, api.scrollProgress())).toFixed(4)})`;
    };
    const onPointerDown = () => setUserStopped(true);
    onInit();
    onScroll();
    api.on("select", onSelect).on("reInit", onInit).on("scroll", onScroll).on("reInit", onScroll).on("pointerDown", onPointerDown);
    return () => {
      api.off("select", onSelect).off("reInit", onInit).off("scroll", onScroll).off("reInit", onScroll).off("pointerDown", onPointerDown);
    };
  }, [api]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = autoplay && motionOk && !userStopped && !hovered && !focused && onScreen && pageVisible;

  useEffect(() => {
    if (!api) return;
    if (shouldPlay) autoplayPlugin.play();
    else autoplayPlugin.stop();
  }, [api, autoplayPlugin, shouldPlay]);

  const prev = () => {
    setUserStopped(true);
    api?.scrollPrev();
  };
  const next = () => {
    setUserStopped(true);
    api?.scrollNext();
  };

  return (
    <div
      ref={root}
      className={styles.slider}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          prev();
        }
      }}
    >
      <div ref={viewportRef} className={styles.viewport}>
        <ul className={styles.container}>
          {slides.map((slide, index) => (
            <li
              key={index}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {slide}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.controls}>
        <div className={styles.dots}>
          {snaps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={styles.dot}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected ? "true" : undefined}
              onClick={() => {
                setUserStopped(true);
                api?.scrollTo(index);
              }}
            />
          ))}
        </div>
        <span className={styles.progress} aria-hidden="true">
          <span ref={progressRef} className={styles.progressBar} />
        </span>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={prev} aria-label="Previous slide">
            <Icon name="arrowLeft" size={20} />
          </button>
          <button type="button" className={styles.arrow} onClick={next} aria-label="Next slide">
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
