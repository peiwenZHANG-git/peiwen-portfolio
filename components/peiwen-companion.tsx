"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";
import { bodyFont, handFont } from "@/app/home-fonts";
import {
  COMPANION_ANSWERS,
  COMPANION_EMAIL,
  COMPANION_FREEFORM,
  COMPANION_GREETING,
  type CompanionAction,
} from "@/lib/companion";
import styles from "./peiwen-companion.module.css";

/**
 * "Ask little Peiwen" (2026-09-25, phase 1 — preset questions, no AI yet).
 *
 * A small Peiwen stands in the bottom-right corner of every page. Click her → a paper
 * speech bubble opens above her head with a greeting and a few questions; she answers
 * in first person. "Ask me anything…" is already there, but in phase 1 a free question
 * gets an honest "I can't chat yet" + a way to email the real Peiwen. Phase 2 (a real
 * AI conversation, still first person) will plug into the same bubble.
 *
 * Art (2026-09-25, user-approved): the flower-fairy Peiwen — daisy crown, pink tulle,
 * small see-through wings, star wand — hovering with a soft warm glow. Cut out of the
 * user-supplied sheet by scripts/prepare-fairy-sprites.py.
 *
 * On Home she only appears once the room is lit and the opening's fairy guide
 * (components/fairy-guide.tsx) has flown down into this corner: she reads
 * `data-home-phase` and `data-guide` on Home's <main>.
 */

type View = { kind: "menu" } | { kind: "answer"; id: string } | { kind: "free"; question: string };

const HINT_KEY = "peiwen-companion-hint";
const THINK_MS = 550;

function subscribeBody(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-home-phase", "data-guide"], childList: true });
  return () => mo.disconnect();
}
function readHomeReady() {
  const main = document.querySelector("[data-home-phase]");
  // not on Home (or Home not mounted yet): she's allowed out
  if (!main) return window.location.pathname !== "/";
  return main.getAttribute("data-home-phase") === "lit" && main.getAttribute("data-guide") !== "active";
}
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function readReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function PeiwenCompanion() {
  const pathname = usePathname() || "/";
  const { navigate } = usePageTransition();
  const ready = useSyncExternalStore(subscribeBody, readHomeReady, () => false);
  const reduced = useSyncExternalStore(subscribeMotion, readReducedMotion, () => false);

  // the bubble belongs to the page it was opened on: navigating away closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [view, setView] = useState<View>({ kind: "menu" });
  const [thinking, setThinking] = useState(false);
  const [copied, setCopied] = useState<"ok" | "manual" | null>(null);
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const bubbleId = useId();

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  // one quiet "psst" per session, a moment after she first appears
  useEffect(() => {
    if (!ready) return;
    try {
      if (window.sessionStorage.getItem(HINT_KEY)) return;
      window.sessionStorage.setItem(HINT_KEY, "1");
    } catch {
      return;
    }
    const a = window.setTimeout(() => setHint(true), 2400);
    const b = window.setTimeout(() => setHint(false), 8400);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [ready]);

  // while open: Escape closes, a click anywhere else closes
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    }
    function onDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  });

  function focusBubble() {
    // after React paints the new view
    window.requestAnimationFrame(() => {
      const first = bubbleRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      first?.focus({ preventScroll: true });
    });
  }

  function toggle() {
    setHint(false);
    if (open) {
      close(false);
      return;
    }
    setView({ kind: "menu" });
    setThinking(false);
    setOpenOn(pathname);
    focusBubble();
  }

  function close(returnFocus: boolean) {
    setOpenOn(null);
    setThinking(false);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  }

  function show(next: View) {
    setView(next);
    setCopied(null);
    if (reduced) {
      setThinking(false);
      focusBubble();
      return;
    }
    setThinking(true);
    later(() => {
      setThinking(false);
      focusBubble();
    }, THINK_MS);
  }

  function backToMenu() {
    setView({ kind: "menu" });
    setCopied(null);
    focusBubble();
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    setDraft("");
    show({ kind: "free", question: q });
  }

  async function copyEmail() {
    const ok = await copyText(COMPANION_EMAIL);
    setCopied(ok ? "ok" : "manual");
    later(() => setCopied(null), ok ? 2400 : 6000);
  }

  function follow(e: MouseEvent<HTMLAnchorElement>, href: string) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    close(false);
    if (href !== pathname) navigate(href);
  }

  if (!ready) return null;

  const answer = view.kind === "answer" ? COMPANION_ANSWERS.find((a) => a.id === view.id) : null;
  const asked = view.kind === "answer" ? answer?.question : view.kind === "free" ? view.question : null;
  const lines = view.kind === "answer" ? (answer?.answer ?? []) : view.kind === "free" ? COMPANION_FREEFORM.answer : [];
  const actions: CompanionAction[] =
    view.kind === "answer" ? (answer?.actions ?? []) : view.kind === "free" ? COMPANION_FREEFORM.actions : [];

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${open ? styles.isOpen : ""} ${handFont.variable} ${bodyFont.variable}`}
    >
      {open && (
        <div
          ref={bubbleRef}
          id={bubbleId}
          className={styles.bubble}
          role="dialog"
          aria-modal="false"
          aria-label="Ask little Peiwen"
        >
          <div className={styles.bubbleHead}>
            <p className={styles.greeting}>{COMPANION_GREETING}</p>
            <button type="button" className={styles.close} onClick={() => close(true)} aria-label="Close">
              &times;
            </button>
          </div>

          <div className={styles.body} aria-live="polite">
            {view.kind === "menu" ? (
              <ul className={styles.chips} aria-label="Things you can ask">
                {COMPANION_ANSWERS.map((a, i) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className={styles.chip}
                      onClick={() => show({ kind: "answer", id: a.id })}
                      data-autofocus={i === 0 ? "" : undefined}
                    >
                      {a.question}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.answer}>
                {asked && <p className={styles.asked}>&ldquo;{asked}&rdquo;</p>}
                {thinking ? (
                  <p className={styles.thinking} aria-label="Little Peiwen is thinking">
                    <span />
                    <span />
                    <span />
                  </p>
                ) : (
                  <>
                    {lines.map((line, i) => (
                      <p key={i} className={`${styles.line} ${line === COMPANION_EMAIL ? styles.email : ""}`}>
                        {line}
                      </p>
                    ))}
                    {actions.length > 0 && (
                      <div className={styles.actions}>
                        {actions.map((act) =>
                          act.kind === "copy-email" ? (
                            <button key="copy" type="button" className={styles.action} onClick={copyEmail}>
                              {copied === "ok" ? "copied ✓" : act.label}
                            </button>
                          ) : (
                            <a
                              key={act.href}
                              href={act.href}
                              className={styles.action}
                              onClick={(e) => follow(e, act.href)}
                            >
                              {act.label}
                            </a>
                          ),
                        )}
                      </div>
                    )}
                    {copied === "manual" && <p className={`${styles.line} ${styles.email}`}>{COMPANION_EMAIL}</p>}
                    <button type="button" className={styles.back} onClick={backToMenu} data-autofocus="">
                      &larr; other questions
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <form className={styles.ask} onSubmit={submit}>
            <label className={styles.srOnly} htmlFor={`${bubbleId}-ask`}>
              Ask me anything
            </label>
            <input
              id={`${bubbleId}-ask`}
              className={styles.input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask me anything…"
              autoComplete="off"
              maxLength={200}
            />
            <button type="submit" className={styles.send} aria-label="Ask" disabled={!draft.trim()}>
              &rarr;
            </button>
          </form>
        </div>
      )}

      {hint && !open && (
        <p className={styles.hint} aria-hidden="true">
          psst&hellip; ask me!
        </p>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? bubbleId : undefined}
        aria-label={open ? "Close little Peiwen’s questions" : "Ask little Peiwen a question"}
      >
        <span className={styles.float} aria-hidden="true">
          <span className={styles.aura} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sprite} src="/assets/companion/fairy-hover.webp" alt="" width={199} height={300} draggable={false} />
        </span>
      </button>
    </div>
  );
}
