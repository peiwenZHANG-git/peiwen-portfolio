import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { L } from "@/components/lang";
import { handFont } from "@/app/home-fonts";
import styles from "./not-found.module.css";

/**
 * Custom 404 (Next's file convention: shown for any unmatched route, and whenever a
 * route calls notFound()). Replaces the default plain Next.js error screen with
 * something that at least looks like the rest of the site — same paper tone as the
 * rotate-guard card, a small compass doodle (travel motif, fits "path = Experience")
 * drawn in the same restrained single-stroke style as the other small icons in this
 * codebase (rotate-guard's phone, the header's branch mark), not a new illustrated
 * scene or anything touching Peiwen's character.
 *
 * `handFont` (Patrick Hand, from app/home-fonts.ts) is applied here the same way
 * components/rotate-guard.tsx and components/peiwen-companion.tsx already do — this
 * page isn't scoped under any route's own font loader, so it borrows Home's.
 */
export default function NotFound() {
  return (
    <div className={`${styles.shell} ${handFont.variable}`}>
      <SiteHeader />
      <main className={styles.main}>
        <svg
          className={styles.compass}
          width="120"
          height="90"
          viewBox="0 0 120 90"
          fill="none"
          stroke="#7d8566"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="46" cy="45" r="28" />
          <path d="M46 45 58 30" />
          <path d="M46 45 38 56" />
          <path d="M80 20c8 6 14 16 12 28" strokeDasharray="3 6" />
          <path d="M96 44l4 6-7 2" />
        </svg>
        <h1 className={styles.title}>
          <L en="This page wandered off" zh="这一页走丢了" />
        </h1>
        <p className={styles.text}>
          <L
            en="There's nothing here — the link may be old, or it never led anywhere at all."
            zh="这里什么都没有——链接可能过期了，或者本来就没通向哪里。"
          />
        </p>
        <Link href="/" className={styles.home}>
          <L en="← Back home" zh="← 回首页" />
        </Link>
      </main>
    </div>
  );
}
