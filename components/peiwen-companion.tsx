"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/page-transition";
import { bodyFont, handFont } from "@/app/home-fonts";
import { L, useLang } from "@/components/lang";
import {
  COMPANION_ANSWERS,
  COMPANION_EMAIL,
  COMPANION_FREEFORM,
  COMPANION_GREETING,
  COMPANION_GREETING_ZH,
  COMPANION_PSST,
  companionPageLine,
  matchCompanionAnswer,
  type CompanionAction,
  type CompanionPageLine,
} from "@/lib/companion";
import styles from "./peiwen-companion.module.css";

/**
 * "Ask little Peiwen" (2026-09-25, phase 1 — preset questions, no AI yet).
 *
 * A small Peiwen stands in the bottom-right corner of every page. Click her → a paper
 * speech bubble opens above her head with a greeting and a few questions; she answers
 * in first person. "Ask me anything…" matches a typed question to the closest answer
 * locally (lib/companion.ts, no AI and no server — Peiwen only wants her to talk about
 * Peiwen and this site); anything else gets a gentle "I only know about me and this
 * little world" with a few questions to try.
 *
 * Art (2026-09-25, user-approved): the flower-fairy Peiwen — daisy crown, pink tulle,
 * small see-through wings, star wand — hovering with a soft warm glow. Cut out of the
 * user-supplied sheet by scripts/prepare-fairy-sprites.py.
 *
 * On Home she only appears once the room is lit and the opening's fairy guide
 * (components/fairy-guide.tsx) has flown down into this corner: she reads
 * `data-home-phase` and `data-guide` on Home's <main>.
 */

type View =
  | { kind: "menu" }
  | { kind: "answer"; id: string; typed?: string }
  | { kind: "free"; question: string };

const HINT_KEY = "peiwen-companion-hint";
const LINE_KEY = "peiwen-companion-line:";
// set the first time she's opened in a visit: from then on the "Ask me" tag is put away
const OPENED_KEY = "peiwen-companion-opened";

function subscribeNever() {
  return () => {};
}
function readNeverOpened() {
  try {
    return !window.sessionStorage.getItem(OPENED_KEY);
  } catch {
    return true;
  }
}

/** 2026-10-07: visitors didn't realise she answers questions. Her page lines now carry
    one real question they can tap straight away, picked to suit the page. */
function sampleQuestionFor(pathname: string): string {
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname === "/experience") return "experience";
  return "looking";
}
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
  // what she says to herself on arriving at a page (its own guide line, or a first
  // "psst… ask me!"); tied to the page it was said on
  const [hint, setHint] = useState<{ path: string; line: CompanionPageLine } | null>(null);
  // the little "Ask me ✎" paper tag beside her, until she's first opened this visit
  const [openedNow, setOpenedNow] = useState(false);
  const neverOpened = useSyncExternalStore(subscribeNever, readNeverOpened, () => false);
  const tagged = neverOpened && !openedNow;
  const lang = useLang();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const bubbleId = useId();
  // Answers move focus into the bubble (to "other questions" etc.) so keyboard users
  // land in the right place. For mouse/touch users that same focus used to light up
  // the red focus ring, which looked like a bug; data-pointer hides the ring until
  // the next key press (see .bubble[data-pointer] in the CSS).
  const pointerRef = useRef(false);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  function markOpened() {
    setOpenedNow(true);
    try {
      window.sessionStorage.setItem(OPENED_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  // On arriving at a page she says one short line to herself: how this page works
  // (lib/companion.ts, companionPageLine), once per page per visit. Pages without a
  // line get a single "psst… ask me!" per visit instead. The "seen" mark is written
  // when the line actually shows, so React's double-run of effects in dev can't eat it.
  useEffect(() => {
    if (!ready) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const line = companionPageLine(pathname, touch);
    const key = line ? LINE_KEY + pathname : HINT_KEY;
    try {
      if (window.sessionStorage.getItem(key)) return;
    } catch {
      return;
    }
    const shown = line ?? COMPANION_PSST;
    const a = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      setHint({ path: pathname, line: shown });
    }, 1400);
    // page guide lines stay 20s (Peiwen's call): long enough to read and try it out;
    // the "psst" (now with a question to tap) 12s
    const b = window.setTimeout(() => setHint(null), 1400 + (line ? 20000 : 12000));
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [ready, pathname]);

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
      const bubble = bubbleRef.current;
      if (!bubble) return;
      if (pointerRef.current) bubble.dataset.pointer = "";
      else delete bubble.dataset.pointer;
      const first = bubble.querySelector<HTMLElement>("[data-autofocus]");
      first?.focus({ preventScroll: true });
    });
  }

  // any key press means the visitor is (now) on the keyboard: show focus rings again
  useEffect(() => {
    function onKeyDown() {
      pointerRef.current = false;
      if (bubbleRef.current) delete bubbleRef.current.dataset.pointer;
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);

  function toggle() {
    setHint(null);
    if (open) {
      close(false);
      return;
    }
    markOpened();
    setView({ kind: "menu" });
    setThinking(false);
    setOpenOn(pathname);
    focusBubble();
  }

  /** the question chip in her page hint: open her straight onto that answer */
  function askFromHint(id: string) {
    setHint(null);
    markOpened();
    setOpenOn(pathname);
    show({ kind: "answer", id });
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
    const hit = matchCompanionAnswer(q);
    show(hit ? { kind: "answer", id: hit.id, typed: q } : { kind: "free", question: q });
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
  const asked = view.kind === "answer" ? view.typed : view.kind === "free" ? view.question : null;
  const askedFallback = view.kind === "answer" ? answer : null;
  const lines = view.kind === "answer" ? (answer?.answer ?? []) : view.kind === "free" ? COMPANION_FREEFORM.answer : [];
  const linesZh = view.kind === "answer" ? (answer?.answerZh ?? []) : view.kind === "free" ? COMPANION_FREEFORM.answerZh : [];
  const sample = COMPANION_ANSWERS.find((a) => a.id === sampleQuestionFor(pathname));
  // a shorter wording for the hint, where the full question is long
  const sampleLabel =
    sample?.id === "looking" ? { en: "What role are you looking for?", zh: "你在找什么工作？" } : sample ? { en: sample.question, zh: sample.questionZh } : null;
  const hintShowing = !!hint && hint.path === pathname && !open;
  const actions: CompanionAction[] =
    view.kind === "answer" ? (answer?.actions ?? []) : view.kind === "free" ? COMPANION_FREEFORM.actions : [];

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${open ? styles.isOpen : ""} ${handFont.variable} ${bodyFont.variable}`}
      onPointerDown={() => {
        pointerRef.current = true;
      }}
    >
      {open && (
        <div
          ref={bubbleRef}
          id={bubbleId}
          className={styles.bubble}
          role="dialog"
          aria-modal="false"
          aria-label={lang === "zh" ? "问问小佩文" : "Ask little Peiwen"}
        >
          <div className={styles.bubbleHead}>
            <p className={styles.greeting}>
              <L en={COMPANION_GREETING} zh={COMPANION_GREETING_ZH} />
            </p>
            <button type="button" className={styles.close} onClick={() => close(true)} aria-label={lang === "zh" ? "关闭" : "Close"}>
              &times;
            </button>
          </div>

          <div className={styles.body} aria-live="polite">
            {view.kind === "menu" ? (
              <ul className={styles.chips} aria-label={lang === "zh" ? "可以问的问题" : "Things you can ask"}>
                {COMPANION_ANSWERS.filter((a) => !a.hidden).map((a, i) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      className={styles.chip}
                      onClick={() => show({ kind: "answer", id: a.id })}
                      data-autofocus={i === 0 ? "" : undefined}
                    >
                      <L en={a.question} zh={a.questionZh} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.answer}>
                {asked ? (
                  <p className={styles.asked}>&ldquo;{asked}&rdquo;</p>
                ) : (
                  askedFallback && (
                    <p className={styles.asked}>
                      &ldquo;<L en={askedFallback.question} zh={askedFallback.questionZh} />&rdquo;
                    </p>
                  )
                )}
                {thinking ? (
                  <p className={styles.thinking} aria-label={lang === "zh" ? "小佩文在思考" : "Little Peiwen is thinking"}>
                    <span />
                    <span />
                    <span />
                  </p>
                ) : (
                  <>
                    {lines.map((line, i) => (
                      <p key={i} className={`${styles.line} ${line === COMPANION_EMAIL ? styles.email : ""}`}>
                        {line === COMPANION_EMAIL ? line : <L en={line} zh={linesZh[i] ?? line} />}
                      </p>
                    ))}
                    {actions.length > 0 && (
                      <div className={styles.actions}>
                        {actions.map((act) =>
                          act.kind === "copy-email" ? (
                            <button key="copy" type="button" className={styles.action} onClick={copyEmail}>
                              {copied === "ok" ? <L en="copied ✓" zh="已复制 ✓" /> : <L en={act.label} zh={act.labelZh} />}
                            </button>
                          ) : act.kind === "download" ? (
                            <a key={act.href} href={act.href} download={act.filename} className={styles.action}>
                              <L en={act.label} zh={act.labelZh} />
                            </a>
                          ) : act.kind === "ask" ? (
                            <button
                              key={`ask-${act.id}`}
                              type="button"
                              className={styles.action}
                              onClick={() => show({ kind: "answer", id: act.id })}
                            >
                              <L en={act.label} zh={act.labelZh} />
                            </button>
                          ) : /^https?:/.test(act.href) ? (
                            <a key={act.href} href={act.href} className={styles.action} target="_blank" rel="noopener noreferrer">
                              <L en={act.label} zh={act.labelZh} />
                            </a>
                          ) : (
                            <a
                              key={act.href}
                              href={act.href}
                              className={styles.action}
                              onClick={(e) => follow(e, act.href)}
                            >
                              <L en={act.label} zh={act.labelZh} />
                            </a>
                          ),
                        )}
                      </div>
                    )}
                    {copied === "manual" && <p className={`${styles.line} ${styles.email}`}>{COMPANION_EMAIL}</p>}
                    <button type="button" className={styles.back} onClick={backToMenu} data-autofocus="">
                      <L en={<>&larr; other questions</>} zh={<>&larr; 换个问题</>} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <form className={styles.ask} onSubmit={submit}>
            <label className={styles.srOnly} htmlFor={`${bubbleId}-ask`}>
              <L en="Ask me anything" zh="问我点什么吧" />
            </label>
            <input
              id={`${bubbleId}-ask`}
              className={styles.input}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={lang === "zh" ? "问我点什么吧…" : "Ask me anything…"}
              autoComplete="off"
              maxLength={200}
            />
            <button type="submit" className={styles.send} aria-label={lang === "zh" ? "发送" : "Ask"} disabled={!draft.trim()}>
              &rarr;
            </button>
          </form>
        </div>
      )}

      {hint && hint.path === pathname && !open && (
        <div className={styles.hint}>
          <p className={styles.hintText} aria-hidden="true">
            <L en={hint.line.en} zh={hint.line.zh} />
          </p>
          {sample && (
            <button type="button" className={styles.hintAsk} onClick={() => askFromHint(sample.id)}>
              <L en={sampleLabel?.en ?? sample.question} zh={sampleLabel?.zh ?? sample.questionZh} /> &rarr;
            </button>
          )}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? bubbleId : undefined}
        aria-label={
          lang === "zh"
            ? open
              ? "关闭小佩文的提问"
              : "问问小佩文"
            : open
              ? "Close little Peiwen’s questions"
              : "Ask little Peiwen a question"
        }
      >
        <span className={styles.float} aria-hidden="true">
          <span className={styles.aura} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sprite} src="/assets/companion/fairy-hover.webp" alt="" width={199} height={300} draggable={false} />
        </span>
        {/* one cue at a time: while she's saying her line, the tag waits */}
        {tagged && !open && !hintShowing && (
          <span className={styles.tag} aria-hidden="true">
            <L en="Ask me ✎" zh="问我吧 ✎" />
          </span>
        )}
      </button>
    </div>
  );
}
