"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { founderPhoto } from "@/content/brand";
import { business } from "@/content/business";
import { aboutTeaser } from "@/content/home";
import styles from "./AboutTeaser.module.css";

/** Niket's photo with a gentle scroll parallax (desktop only), his heading, two lines of story and a link to About. */
export function AboutTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section className={styles.section} aria-labelledby="about-teaser-title">
      <div className={`container ${styles.grid}`}>
        <div ref={ref} className={styles.photoWrap}>
          <m.div className={styles.photo} style={reduce ? undefined : { y }}>
            <Image
              src={founderPhoto.src}
              width={founderPhoto.width}
              height={founderPhoto.height}
              alt={`${business.founder}, founder of ${business.name}`}
              sizes="(max-width: 860px) 80vw, 440px"
            />
          </m.div>
          <span className={styles.badge}>
            <strong>{business.foundedYear}</strong> started in {business.address.city}
          </span>
        </div>
        <Reveal className={styles.copy}>
          <SectionHeader id="about-teaser-title" label={aboutTeaser.label} title={aboutTeaser.title} dot />
          {aboutTeaser.body.map((line) => (
            <p key={line} className={styles.body}>
              {line}
            </p>
          ))}
          <ButtonLink href="/about/" variant="secondary" iconEnd="arrowRight">
            More about us
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
