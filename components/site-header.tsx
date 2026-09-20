import Link from "next/link";
import styles from "./site-header.module.css";

/**
 * The site header: logo (branch icon + name + role line), primary nav and the
 * language toggle. Ported 1:1 from experience-v2/experience-prototype-v2.html via
 * app/experience/experience-page.tsx, which used to own this markup directly.
 *
 * Shared by every route that shows the full site chrome (currently /experience and
 * /about) so there is exactly one copy to keep in sync. Route-specific bits (the skip
 * link target, the "Skip to content" href) stay in each route's own page component,
 * since those differ per route.
 */

const NAV_ITEMS = [
  { key: "home", href: "/", label: "Home" },
  { key: "experience", href: "/experience", label: "Experience" },
  { key: "projects", href: "/#projects", label: "Projects", scroll: false },
  { key: "playground", href: "/#playground", label: "Playground", scroll: false },
  { key: "about", href: "/about", label: "About" },
] as const;

export type SiteHeaderCurrent = (typeof NAV_ITEMS)[number]["key"];

export function SiteHeader({ current }: { current?: SiteHeaderCurrent }) {
  return (
    <header className={styles.siteHeader}>
      <Link className={styles.brand} href="/" aria-label="Peiwen Zhang home">
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
          return (
            <Link
              key={item.key}
              className={[styles.drawU, isCurrent ? styles.navCurrent : ""].filter(Boolean).join(" ")}
              href={item.href}
              {...("scroll" in item ? { scroll: item.scroll } : {})}
              {...(isCurrent ? { "aria-current": "page" as const } : {})}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.lang}>
        中 / <span>EN</span>
      </div>
    </header>
  );
}
