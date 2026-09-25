"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import styles from "./fairy-guide.module.css";

/**
 * The flower-fairy Peiwen who guides the Home opening (2026-09-25).
 *
 *   sleep    she drifts in from the left, the only light in the dark room (her wand),
 *            and waits by the window: "open the window?"
 *   window   she flies over to the desk lamp and waits there, wand ready: "now the lamp?"
 *   lighting she taps the lamp — the room lights up from the bulb as before
 *   lit      she flies down to the bottom-right corner and becomes the "Ask me" little
 *            Peiwen (components/peiwen-companion.tsx), who takes over from there
 *
 * Purely decorative (aria-hidden): the window and lamp are real buttons with their own
 * labels, and a visitor who ignores her and clicks them directly gets exactly the same
 * opening. Only mounted when the opening actually plays (never for reduced motion,
 * portrait screens or returning visitors — they start on the lit room).
 *
 * Positions are stage percentages (the same coordinates as the hotspots in
 * home-desk.module.css), converted to viewport pixels at the moment she flies, so they
 * follow the cover-cropped stage at every screen size.
 */

export type GuidePhase = "sleep" | "window" | "lighting" | "lit";
type Pose = "hover" | "fly" | "tap";

// source heights at the shared export scale (see scripts/prepare-fairy-sprites.py)
const POSE_H: Record<Pose, number> = { hover: 300, fly: 256, tap: 248 };
const POSE_W: Record<Pose, number> = { hover: 199, fly: 259, tap: 219 };

/** stage-% spots she flies to */
const WINDOW_SPOT = { x: 0.365, y: 0.33 };
/** where the wand star should touch: the top of the lamp shade */
const LAMP_TOUCH = { x: 0.805, y: 0.325 };
/** tap pose, mirrored: the star sits at ~90% / 90% of the image */
const TAP_STAR = { x: 0.9, y: 0.9 };

type Props = {
  phase: GuidePhase;
  stageRef: RefObject<HTMLDivElement | null>;
  /** called once she has landed in the corner, so the companion can take over */
  onDone: () => void;
};

export function FairyGuide({ phase, stageRef, onDone }: Props) {
  const flyerRef = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<Pose>("fly");
  // which phase's line is showing ("open the window?" / "now the lamp?"); a line only
  // shows while its own phase is current, so nothing needs clearing when phases move on
  const [sayFor, setSayFor] = useState<GuidePhase | null>(null);
  const [leaving, setLeaving] = useState(false);
  // the current resting spot, in viewport px + scale, so a resize can re-place her
  const spot = useRef<{ x: number; y: number; s: number } | null>(null);
  const timers = useRef<number[]>([]);
  const doneRef = useRef(onDone);
  useLayoutEffect(() => {
    doneRef.current = onDone;
  });

  function gh() {
    const stage = stageRef.current;
    const h = stage ? stage.getBoundingClientRect().height : 700;
    // tiny and light: about a tenth of the room's height, never big on large screens
    return Math.max(56, Math.min(88, h * 0.095));
  }
  function stagePoint(px: number, py: number) {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return { x: window.innerWidth * px, y: window.innerHeight * py };
    return { x: r.left + r.width * px, y: r.top + r.height * py };
  }
  function lampSpot() {
    const t = stagePoint(LAMP_TOUCH.x, LAMP_TOUCH.y);
    const h = (POSE_H.tap / POSE_H.hover) * gh();
    const w = (POSE_W.tap / POSE_H.hover) * gh();
    // centre of the (mirrored) tap pose so that its star lands on the touch point
    return { x: t.x - (TAP_STAR.x - 0.5) * w, y: t.y - (TAP_STAR.y - 0.5) * h };
  }
  function cornerSpot() {
    // matches .root / .trigger in peiwen-companion.module.css
    const narrow = window.innerWidth <= 719;
    const h = narrow ? 68 : 112;
    const right = narrow ? 2 : Math.min(28, Math.max(10, window.innerWidth * 0.018));
    const bottom = narrow ? 4 : 8;
    const w = h * (POSE_W.hover / POSE_H.hover);
    return {
      x: window.innerWidth - right - w / 2,
      y: window.innerHeight - bottom - h / 2,
      s: h / gh(),
    };
  }

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function place(x: number, y: number, s = 1) {
    const el = flyerRef.current;
    if (!el) return;
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    spot.current = { x, y, s };
  }

  const flight = useRef<Animation | null>(null);
  /** stop any flight in progress and keep her exactly where she is right now */
  function settle() {
    const el = flyerRef.current;
    const a = flight.current;
    if (!el || !a) return;
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    a.cancel();
    flight.current = null;
    place(m.e, m.f, m.a);
  }

  /** a soft arc from where she is to (x, y). Finishes on a timer rather than on the
      animation's own finish event, so the choreography still moves on in a background
      tab (where animations are paused); a later flight picks up from wherever she is. */
  function flyTo(x: number, y: number, s: number, ms: number, done?: () => void) {
    const el = flyerRef.current;
    settle();
    const from = spot.current;
    if (!el || !from) {
      place(x, y, s);
      done?.();
      return;
    }
    const lift = Math.min(90, Math.hypot(x - from.x, y - from.y) * 0.22);
    const mx = (from.x + x) / 2;
    const my = Math.min(from.y, y) - lift;
    const t = (px: number, py: number, ps: number) => `translate(${px}px, ${py}px) scale(${ps})`;
    const anim = el.animate(
      [
        { transform: t(from.x, from.y, from.s) },
        { transform: t(mx, my, (from.s + s) / 2), offset: 0.5 },
        { transform: t(x, y, s) },
      ],
      { duration: ms, easing: "cubic-bezier(0.45, 0, 0.3, 1)", fill: "forwards" },
    );
    flight.current = anim;
    later(() => {
      if (flight.current === anim) {
        anim.cancel();
        flight.current = null;
        place(x, y, s);
      }
      done?.();
    }, ms + 30);
  }

  // set the guide's size once and on resize; keep her resting spot glued to the stage
  useLayoutEffect(() => {
    const el = flyerRef.current;
    if (!el) return;
    const size = () => el.style.setProperty("--gh", `${gh()}px`);
    size();
    const onResize = () => {
      size();
      if (flight.current) return; // mid-flight: the next step re-reads the stage anyway
      if (phase === "sleep" && spot.current) {
        const p = stagePoint(WINDOW_SPOT.x, WINDOW_SPOT.y);
        place(p.x, p.y);
      } else if ((phase === "window" || phase === "lighting") && spot.current) {
        const p = lampSpot();
        place(p.x, p.y);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // the choreography, one step per phase
  useEffect(() => {
    const list = timers.current;
    if (phase === "sleep") {
      const target = stagePoint(WINDOW_SPOT.x, WINDOW_SPOT.y);
      if (!spot.current) place(-80, target.y - 40);
      later(() => {
        flyTo(target.x, target.y, 1, 2600, () => {
          setPose("hover");
          later(() => setSayFor("sleep"), 250);
        });
      }, 500);
    } else if (phase === "window") {
      later(() => {
        setPose("fly");
        const p = lampSpot();
        flyTo(p.x, p.y, 1, 2000, () => {
          setPose("tap");
          later(() => setSayFor("window"), 200);
        });
      }, 900);
    } else if (phase === "lit") {
      later(() => {
        setPose("fly");
        const c = cornerSpot();
        flyTo(c.x, c.y, c.s, 1700, () => {
          setPose("hover");
          setLeaving(true);
          doneRef.current();
        });
      }, 250);
    }
    return () => {
      list.forEach((t) => window.clearTimeout(t));
      list.length = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div
      className={`${styles.guide} ${phase === "sleep" ? styles.inDark : ""} ${phase === "lighting" ? styles.tapping : ""} ${leaving ? styles.leaving : ""}`}
      aria-hidden="true"
    >
      <div ref={flyerRef} className={styles.flyer}>
        <div className={styles.bob}>
          <span className={styles.aura} />
          {(["hover", "fly", "tap"] as Pose[]).map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p}
              className={`${styles.pose} ${styles[p]} ${pose === p ? styles.on : ""}`}
              src={`/assets/companion/fairy-${p}.webp`}
              alt=""
              width={POSE_W[p]}
              height={POSE_H[p]}
              draggable={false}
            />
          ))}
          {sayFor === phase && phase === "sleep" && <p className={styles.say}>open the window?</p>}
          {sayFor === phase && phase === "window" && <p className={styles.say}>now the lamp?</p>}
        </div>
      </div>
    </div>
  );
}
