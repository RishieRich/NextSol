"use client";

import { AnimatePresence, m, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";

import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Emoji } from "@/components/ui/Emoji";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/content/business";
import { megaMenu, primaryNav, quoteHref } from "@/content/navigation";
import { getProduct, productPages, type Product } from "@/content/products";
import { telHref } from "@/domain/format";
import { cascade } from "@/lib/motion";
import styles from "./Header.module.css";

const megaColumns = megaMenu.map((column) => ({ ...column, products: column.slugs.map(getProduct) }));
const productHref = (product: Product) => product.page ?? `/services/#${product.slug}`;
const productPagePaths = productPages.map((product) => product.page?.replace(/\/$/, "") ?? "").filter(Boolean);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const megaButton = useRef<HTMLButtonElement>(null);
  const megaWrap = useRef<HTMLLIElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const megaId = useId();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  // Close menus whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setMegaOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMega = useCallback((returnFocus: boolean) => {
    setMegaOpen(false);
    if (returnFocus) megaButton.current?.focus();
  }, []);

  // Mega-menu: Escape closes and returns focus; a click or focus outside closes.
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMega(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (megaWrap.current && !megaWrap.current.contains(event.target as Node)) closeMega(false);
    };
    const onFocus = (event: FocusEvent) => {
      if (megaWrap.current && !megaWrap.current.contains(event.target as Node)) closeMega(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocus);
    };
  }, [megaOpen, closeMega]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Hover intent on devices with a mouse: open after a beat, close after leaving for a moment.
  const hoverOpen = (open: boolean) => (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMegaOpen(open), open ? 90 : 220);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")));
  const productsActive = isActive("/services/") || productPagePaths.some((path) => pathname.startsWith(path));

  return (
    <>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <ul className={styles.topbarList}>
            {business.email ? (
              <li>
                <a href={`mailto:${business.email}`}>
                  <Icon name="mail" size={16} />
                  {business.email}
                </a>
              </li>
            ) : null}
            <li>
              <a href={telHref(business.phoneE164)}>
                <Icon name="phone" size={16} />
                {business.phoneDisplay}
              </a>
            </li>
            <li className={styles.topbarAddress}>
              <Icon name="pin" size={16} />
              {business.address.line1}, {business.address.line2}, {business.address.city}
            </li>
          </ul>
          <ul className={styles.social}>
            <li>
              <a href={business.links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Next Solutions on Facebook">
                <Icon name="facebook" size={16} />
              </a>
            </li>
            <li>
              <a href={business.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Next Solutions on LinkedIn">
                <Icon name="linkedin" size={16} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <header className={styles.header} data-scrolled={scrolled}>
        <div className={styles.bar} aria-hidden="true" />
        <div className={`container ${styles.inner}`}>
          <span className={styles.logoWrap}>
            <Logo intro height={56} />
          </span>

          <nav aria-label="Main" className={styles.nav}>
            <ul className={styles.navList}>
              {primaryNav.map((item) =>
                item.mega ? (
                  <li
                    key={item.href}
                    ref={megaWrap}
                    className={styles.megaItem}
                    onPointerEnter={hoverOpen(true)}
                    onPointerLeave={hoverOpen(false)}
                  >
                    <button
                      ref={megaButton}
                      type="button"
                      className={styles.navLink}
                      aria-expanded={megaOpen}
                      aria-controls={megaId}
                      data-active={productsActive}
                      onClick={() => setMegaOpen((open) => !open)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setMegaOpen(true);
                          window.requestAnimationFrame(() =>
                            document.getElementById(megaId)?.querySelector<HTMLElement>("a")?.focus(),
                          );
                        }
                      }}
                    >
                      {item.label}
                      <Icon name="chevronDown" size={16} className={styles.chevron} />
                    </button>

                    <AnimatePresence>
                      {megaOpen ? (
                        <m.div
                          id={megaId}
                          className={styles.mega}
                          initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -6, filter: "blur(2px)", transition: { duration: 0.16 } }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className={styles.megaColumns}>
                            {megaColumns.map((column) => (
                              <div key={column.title}>
                                <p className={styles.megaTitle}>{column.title}</p>
                                <m.ul className={styles.megaList} variants={cascade.container} initial="hidden" animate="show">
                                  {column.products.map((product) => (
                                    <m.li key={product.slug} variants={cascade.item}>
                                      <Link href={productHref(product)} className={styles.megaLink} onClick={() => setMegaOpen(false)}>
                                        <Emoji name={product.emoji} size={40} shadow={false} />
                                        <span>
                                          <span className={styles.megaName}>{product.name}</span>
                                          <span className={styles.megaNote}>{product.oneLiner}</span>
                                        </span>
                                      </Link>
                                    </m.li>
                                  ))}
                                </m.ul>
                              </div>
                            ))}
                          </div>
                          <div className={styles.megaFoot}>
                            <Link href="/services/" className={styles.megaAll} onClick={() => setMegaOpen(false)}>
                              All products and services
                              <Icon name="arrowRight" size={16} />
                            </Link>
                          </div>
                        </m.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.navLink} aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a href={telHref(business.phoneE164)} className={styles.question}>
              <span className={styles.questionIcon} aria-hidden="true">
                <Icon name="phone" size={18} />
              </span>
              <span>
                <span className={styles.questionLabel}>Have any questions?</span>
                <span className={styles.questionPhone}>{business.phoneDisplay}</span>
              </span>
            </a>
            <ButtonLink href={quoteHref} iconEnd="plus">
              Get a quote
            </ButtonLink>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
            <span className="visually-hidden">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>

        <m.div className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />

        <div id="mobile-menu" className={styles.sheet} data-open={menuOpen} hidden={!menuOpen}>
          <nav aria-label="Mobile">
            <ul className={styles.sheetList}>
              {primaryNav.map((item, index) => (
                <li key={item.href} style={{ "--i": index } as CSSProperties}>
                  {item.mega ? (
                    <>
                      <button
                        type="button"
                        className={styles.sheetLink}
                        aria-expanded={mobileProductsOpen}
                        aria-controls="mobile-products"
                        onClick={() => setMobileProductsOpen((open) => !open)}
                      >
                        {item.label}
                        <Icon name="chevronDown" size={22} className={styles.chevron} />
                      </button>
                      <ul id="mobile-products" className={styles.sheetProducts} hidden={!mobileProductsOpen}>
                        {megaColumns
                          .flatMap((column) => column.products)
                          .map((product) => (
                            <li key={product.slug}>
                              <Link href={productHref(product)} className={styles.sheetProduct}>
                                <Emoji name={product.emoji} size={28} shadow={false} />
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        <li>
                          <Link href="/services/" className={styles.sheetProduct}>
                            All products and services
                          </Link>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <Link href={item.href} className={styles.sheetLink} aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.sheetActions}>
            <ButtonLink href={quoteHref} size="lg" iconEnd="plus">
              Get a quote
            </ButtonLink>
          </div>
          <p className={styles.sheetMeta}>{business.hours.display}</p>
        </div>
      </header>
    </>
  );
}
