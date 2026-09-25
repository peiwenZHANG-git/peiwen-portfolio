"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { MusicToggle } from "./music-toggle";
import { usePageTransition } from "./page-transition";
import styles from "./site-header.module.css";

/**
 * The site header: logo (branch icon + name + role line), primary nav and the
 * language toggle. Ported 1:1 from experience-v2/experience-prototype-v2.html via
 * app/experience/experience-page.tsx, which used to own this markup directly.
 *
 * Shared by every route that shows the full site chrome (currently /, /experience and
 * /about) so there is exactly one copy to keep in sync. Route-specific bits (the skip
 * link target, the "Skip to content" href) stay in each route's own page component,
 * since those differ per route.
 *
 * 2026-09-22: every internal link here (brand + nav items) now routes through the
 * shared page-transition wash (components/page-transition.tsx) instead of a plain
 * `<Link>` navigation — `onClick` calls `preventDefault` and hands off to
 * `usePageTransition().navigate()` with the click's own coordinates, so the wash blooms
 * from wherever the person actually clicked. This is a client component now (it wasn't
 * before) because of that hook; nothing else about it changed.
 */

const NAV_ITEMS = [
  { key: "home", href: "/", label: "Home" },
  { key: "experience", href: "/experience", label: "Experience" },
  { key: "projects", href: "/#projects", label: "Projects", scroll: false },
  { key: "playground", href: "/#playground", label: "Playground", scroll: false },
  { key: "about", href: "/about", label: "About me" },
] as const;

export type SiteHeaderCurrent = (typeof NAV_ITEMS)[number]["key"];

export function SiteHeader({ current }: { current?: SiteHeaderCurrent }) {
  const { navigate } = usePageTransition();

  /** Shared by the brand link and every nav item. Lets a modified click (open in new
      tab/window, middle-click) through untouched — only a plain left-click gets the
      wash treatment, since those other gestures aren't really "staying on this site". */
  function handleClick(href: string, scroll: boolean | undefined, event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href, { scroll, originX: event.clientX, originY: event.clientY });
  }

  return (
    <header className={styles.siteHeader}>
      <Link
        className={styles.brand}
        href="/"
        aria-label="Peiwen Zhang home"
        onClick={(e) => handleClick("/", undefined, e)}
      >
        <svg viewBox="0 0 22 34" fill="none" stroke="#7d8566" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
          <path d="M11 33V5" />
          <path d="M11 12c-4-1-7-4-7-8 4 0 7 3 7 7" />
          <path d="M11 18c4-1 7-4 7-8-4 0-7 3-7 7" />
          <path d="M11 25c-4-1-7-4-7-8 4 0 7 3 7 7" />
          <path d="M11 9c2-2 3-4 3-7-2 1-3 3-3 6" />
        </svg>
        <span>
          <span className={styles.brandName}>Peiwen Zhang</span>
          <span className={styles.brandRole}>HCI · PRODUCT · CREATIVE TECH</span>
        </span>
      </Link>
      <nav className={styles.nav} aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const isCurrent = item.key === current;
          const scroll = "scroll" in item ? item.scroll : undefined;
          return (
            <Link
              key={item.key}
              className={[styles.drawU, isCurrent ? styles.navCurrent : ""].filter(Boolean).join(" ")}
              href={item.href}
              {...(scroll !== undefined ? { scroll } : {})}
              {...(isCurrent ? { "aria-current": "page" as const } : {})}
              onClick={(e) => handleClick(item.href, scroll, e)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.lang}>
        <span className={styles.langText}>
          中 / <span>EN</span>
        </span>
        <MusicToggle />
      </div>
    </header>
  );
}
