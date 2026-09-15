import { MILESTONES, PROGRESS_MIN, PROGRESS_MAX, TRANSITIONS, sampleTransition } from "./journey";
import type { Milestone } from "./journey";

export type StorybookScene = {
  id: string;
  milestoneId: string;
  progress: { enter: number; active: number; exit: number };
  framing: { desktop: string; mobile: string };
  visual: {
    backgroundPlate: "paris-saclay-approved" | "cuc-approved";
    optionalMidground?: string;
    optionalForeground?: string;
  };
  ambient: Partial<Record<"snow" | "leaves" | "petals" | "fireflies" | "water", boolean>>;
  narration: Milestone["narration"];
  transitionOut: string | null;
};

// Temporary review plates, NOT production backgrounds: both contain baked Peiwen,
// title and UI. Optional layers/ambient are data slots only; no renderer is built for them.
export const STORYBOOK_SCENES: readonly StorybookScene[] = MILESTONES.map((milestone, index) => ({
  id: index === 0 ? "saclay-winter" : "cuc-autumn",
  milestoneId: milestone.id,
  progress: {
    enter: index === 0 ? PROGRESS_MIN : TRANSITIONS[0].range[1],
    active: milestone.progress.center,
    exit: index === 0 ? TRANSITIONS[0].range[0] : PROGRESS_MAX,
  },
  framing: { desktop: "50% 18%", mobile: index === 0 ? "50% 50%" : "58% 50%" },
  visual: { backgroundPlate: index === 0 ? "paris-saclay-approved" : "cuc-approved" },
  ambient: {},
  narration: milestone.narration,
  transitionOut: index === 0 ? TRANSITIONS[0].id : null,
}));

export function parseStorybookProgress(value: string | undefined) {
  const parsed = value?.trim() ? Number(value) : PROGRESS_MIN;
  return Number.isFinite(parsed) ? Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, parsed)) : PROGRESS_MIN;
}

export function sampleStorybook(progress: number, reducedMotion = false) {
  const p = parseStorybookProgress(String(progress));
  const transition = sampleTransition(p);
  const current = transition < 0.5 ? 0 : 1;
  const scene = STORYBOOK_SCENES[current];
  const stableProgress = Math.max(0, Math.min(1, (p - scene.progress.enter) / (scene.progress.exit - scene.progress.enter)));
  return {
    scene,
    transition,
    phase: transition > 0 && transition < 1 ? "transition" : "stable",
    // Outgoing visual contribution is 1 - incomingOpacity. Keep its DOM opacity 1
    // beneath the incoming plate so compositing never exposes the page background.
    incomingOpacity: reducedMotion ? Number(transition >= 0.5) : transition,
    scales: reducedMotion ? [1, 1] : [
      transition === 0 ? 1 + stableProgress * 0.02 : 1.02 + transition * 0.02,
      transition === 1 ? 1 + stableProgress * 0.02 : 0.98 + transition * 0.02,
    ],
  };
}
