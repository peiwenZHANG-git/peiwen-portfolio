"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";
import styles from "./world-link.module.css";

/**
 * The thread that ties the inner pages back to the desk (2026-09-24).
 *
 * Mounted once in app/layout.tsx; renders on every route except Home itself.
 *  - Snow: a few very faint flakes drifting across the page — the same snowfall seen
 *    outside Home's window, so every room feels like it's in the same winter night.
 *  - A small desk keepsake pinned in the top-left corner, one per page, matching the
 *    object on the desk that led here (ticket → Experience, red notebook → About, the
 *    clipped card → Projects). Clicking it walks back to the desk. It's a real link with
 *    a label, so it also works by keyboard / screen reader.
 *
 * 2026-09-25: the tag moved to the top-left, just under the site header. Its `top` is
 * measured from the real header (the header's height differs per page and per width).
 * Below 1000px there is no free space beside the page titles, so the element right after
 * the header gets a margin as tall as the tag — the tag gets its own row instead of
 * sitting on a heading. Between 1000 and 1499px the words fold away (CSS) and only the
 * object + arrow show until hover / focus.
 */

type Keepsake = { kind: "ticket" | "notebook" | "card"; label: string };

const KEEPSAKES: Record<string, Keepsake> = {
  "/experience": { kind: "ticket", label: "Back to the desk" },
  "/about": { kind: "notebook", label: "Back to the desk" },
  "/projects": { kind: "card", label: "Back to the desk" },
};

function makeFlakes() {
  let s = 11;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: 16 }, () => ({
    left: rand() * 100,
    size: 2 + rand() * 2.5,
    dur: 22 + rand() * 14,
    delay: -rand() * 36,
    drift: (rand() * 2 - 1) * 30,
    opacity: 0.35 + rand() * 0.35,
  }));
}
const FLAKES = makeFlakes();

function subscribeNothing() {
  return () => {};
}

export function WorldLink() {
  const pathname = usePathname() || "/";
  const { navigate } = usePageTransition();
  // client-only: avoids any server/client mismatch in the flake markup
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const tagRef = useRef<HTMLAnchorElement>(null);

  const base = "/" + (pathname.split("/")[1] ?? "");
  // only on the section pages themselves: a project case study (/projects/reso) has its
  // own "← Back to the attic" link in that corner
  const keepsake = base !== "/" && pathname.split("/").filter(Boolean).length === 1 ? KEEPSAKES[base] : undefined;

  // Where the keepsake lives in the DOM: a slot inserted right after the page's
  // <header>, so it is the next Tab stop after the header (it sits top-left, just under
  // it) instead of the very last one on the page. The slot is `display: contents` and
  // restores what the tag inherited as the last child of <body> (see .slot in the CSS),
  // and the tag is position: fixed, so where it sits in the DOM changes nothing visually.
  const [slot] = useState<HTMLElement | null>(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.className = styles.slot;
    return el;
  });
  useLayoutEffect(() => {
    if (!slot || !mounted || !keepsake) return;
    const header = document.querySelector<HTMLElement>("header");
    if (!header) return;
    header.after(slot);
    return () => slot.remove();
  }, [slot, pathname, mounted, keepsake]);

  useEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;
    const header = document.querySelector<HTMLElement>("header");
    const narrow = window.matchMedia("(max-width: 999px)");
    let spaced: HTMLElement | null = null;
    let prevMargin = "";

    // the first element that follows the header in the page flow (walking up if the
    // header is the last child of its wrapper), skipping anything that holds the tag
    function nextAfterHeader(): HTMLElement | null {
      let el: Element | null = header;
      while (el && el !== document.body) {
        let n = el.nextElementSibling;
        while (n && n.contains(tag)) n = n.nextElementSibling;
        if (n instanceof HTMLElement) return n;
        el = el.parentElement;
      }
      return null;
    }

    function release() {
      if (spaced) spaced.style.marginTop = prevMargin;
      spaced = null;
    }

    function place() {
      if (!tag) return;
      const stickyTop = header ? parseFloat(getComputedStyle(header).top) || 0 : 0;
      const headerBottom = header ? stickyTop + header.offsetHeight : 80;
      tag.style.setProperty("--kt", `${Math.round(headerBottom + 10)}px`);
      if (narrow.matches) {
        const target = nextAfterHeader();
        if (target !== spaced) {
          release();
          spaced = target;
          prevMargin = target ? target.style.marginTop : "";
        }
        if (spaced) spaced.style.marginTop = `${tag.offsetHeight + 16}px`;
      } else {
        release();
      }
    }

    place();
    const ro = new ResizeObserver(place);
    if (header) ro.observe(header);
    ro.observe(tag);
    window.addEventListener("resize", place);
    narrow.addEventListener("change", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      narrow.removeEventListener("change", place);
      release();
    };
  }, [pathname, mounted]);

  if (base === "/" || !mounted) return null;

  function goHome(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    try {
      // Home reads this once on arrival and pulls the camera back out of that object
      window.sessionStorage.setItem("peiwen-return-from", base.slice(1));
    } catch {
      /* storage blocked: Home just appears normally */
    }
    navigate("/");
  }

  return (
    <>
      <div className={styles.snow} aria-hidden="true">
        {FLAKES.map((f, i) => (
          <span
            key={i}
            style={
              {
                left: `${f.left}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                opacity: f.opacity,
                animationDuration: `${f.dur}s`,
                animationDelay: `${f.delay}s`,
                "--drift": `${f.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {keepsake &&
        slot &&
        createPortal(
        <Link ref={tagRef} href="/" className={`${styles.keepsake} ${styles[keepsake.kind]}`} onClick={goHome} aria-label={keepsake.label} lang="en">
          <span className={styles.object} aria-hidden="true">
            {keepsake.kind === "ticket" && <Ticket />}
            {keepsake.kind === "notebook" && <Notebook />}
            {keepsake.kind === "card" && <Card />}
          </span>
          <span className={styles.caption} aria-hidden="true">
            <span className={styles.arrow}>&larr;</span>
            <span className={styles.words}>back to the desk</span>
          </span>
        </Link>,
          slot,
        )}
    </>
  );
}

/* Tiny hand-drawn-feeling versions of the desk objects: soft fills, warm ink outlines,
   slightly wobbly paths — same ink colour as the rest of the site's line work. */

function Ticket() {
  return (
    <svg viewBox="0 0 96 44" width="96" height="44">
      <path
        d="M4 6 L90 3 C91 9 88 12 92 14 C88 17 91 21 90 26 C87 30 91 34 91 40 L6 42 C5 36 8 33 4 30 C7 26 3 22 5 18 C8 14 4 10 4 6 Z"
        fill="#f7efe1"
        stroke="#8c7b69"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M10 10 L85 8 L86 36 L11 37 Z" fill="none" stroke="#b8a792" strokeWidth="0.8" strokeDasharray="2.5 2.5" />
      <path d="M62 19 l14 -4 l2 2 l-9 5 l3 6 l-2 1 l-4 -5 l-5 2 l-1 3 l-1.5 .5 l0 -4 l-3 -2 l1 -1 l3 1 l4 -2 z" fill="#8a8f98" />
    </svg>
  );
}

function Notebook() {
  return (
    <svg viewBox="0 0 64 74" width="64" height="74">
      <rect x="10" y="6" width="48" height="62" rx="3" fill="#5d6b63" transform="rotate(2 34 37)" />
      <rect x="7" y="4" width="48" height="62" rx="3" fill="#8a5a55" stroke="#5e3a38" strokeWidth="1.2" />
      {[10, 18, 26, 34, 42, 50, 58].map((y) => (
        <circle key={y} cx="7" cy={y} r="2.6" fill="none" stroke="#7a5a3a" strokeWidth="1.2" />
      ))}
      <path d="M45 3 L45 67" stroke="#6b4a33" strokeWidth="2.2" />
      <path d="M31 45 C31 38 29 33 26 30 M31 40 C34 36 37 34 38 31 M30 35 C27 33 25 30 25 27" stroke="#f1e6d6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Card() {
  return (
    <svg viewBox="0 0 90 56" width="90" height="56">
      <path d="M4 12 L86 8 L88 52 L6 54 Z" fill="#f7efe1" stroke="#8c7b69" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="38" y="2" width="14" height="10" rx="2" fill="#a9894f" stroke="#6f5530" strokeWidth="1" />
      <path d="M41 3 C41 -2 49 -2 49 3" stroke="#6f5530" strokeWidth="1.2" fill="none" />
      <path d="M70 44 L70 22 M70 26 C66 24 65 21 66 19 M70 30 C74 28 75 25 74 23 M70 34 C66 32 65 30 66 28" stroke="#6f7d82" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M16 26 L48 25 M16 34 L40 33.5" stroke="#b8a792" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
