export type ProgressRange = readonly [number, number];
export type MilestonePhase = "distant" | "approaching" | "active" | "passed";

export type MilestoneFraming = {
  landmarkLateral: number;
  cameraEmphasisRadius: number;
  cameraLateralBias: number;
  textSide: "left" | "right";
};

export type Milestone = {
  id: string;
  biomeId: string;
  progress: {
    center: number;
    activeRadius: number;
    approachRadius: number;
    slowdownRadius: number;
  };
  narration: {
    organization: string | null;
    identity: string | null;
    period: string | null;
    summary: string | null;
    arrivalAnnouncement: string | null;
  };
  framing: {
    desktop: MilestoneFraming | null;
    mobile: MilestoneFraming | null;
  };
};

export type JourneyTransition = {
  id: string;
  from: string;
  to: string;
  range: ProgressRange;
  nextLandmarkRevealRange: ProgressRange;
};

export type JourneyState = { milestoneId: string; phase: MilestonePhase };

export const PROGRESS_MIN = 0.015;
export const PROGRESS_MAX = 0.985;
export const MAX_PROGRESS_LEAD = 0.24;

export const MILESTONES: readonly Milestone[] = [
  {
    id: "paris-saclay",
    biomeId: "saclay-winter-night",
    progress: { center: 0.24, activeRadius: 0.055, approachRadius: 0.105, slowdownRadius: 0.07 },
    narration: {
      organization: "Université Paris-Saclay",
      identity: "Human-Computer Interaction",
      period: "2025–Present",
      summary: null,
      arrivalAnnouncement: "You have reached the Université Paris-Saclay experience landmark.",
    },
    // Existing framing only. The approved winter keyframe is not implemented by this registry.
    framing: {
      desktop: { landmarkLateral: -3.15, cameraEmphasisRadius: 0.13, cameraLateralBias: 0.34, textSide: "right" },
      mobile: { landmarkLateral: -3.15, cameraEmphasisRadius: 0.13, cameraLateralBias: 0.34, textSide: "right" },
    },
  },
  {
    id: "cuc",
    biomeId: "cuc-autumn-sunset",
    progress: { center: 0.64, activeRadius: 0.055, approachRadius: 0.105, slowdownRadius: 0.07 },
    narration: { organization: null, identity: null, period: null, summary: null, arrivalAnnouncement: null },
    framing: { desktop: null, mobile: null },
  },
];

export const TRANSITIONS: readonly JourneyTransition[] = [
  {
    id: "paris-saclay-to-cuc",
    from: "paris-saclay",
    to: "cuc",
    range: [0.345, 0.535],
    nextLandmarkRevealRange: [0.41, 0.535],
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function getMilestone(id: string) {
  return MILESTONES.find((milestone) => milestone.id === id);
}

export function getNearestMilestone(progress: number) {
  return MILESTONES.reduce((nearest, milestone) =>
    Math.abs(progress - milestone.progress.center) < Math.abs(progress - nearest.progress.center)
      ? milestone : nearest,
  );
}

export function getCrossedMilestone(previous: number, next: number) {
  return next > previous
    ? MILESTONES.find(({ progress }) => previous < progress.center && next >= progress.center)
    : MILESTONES.findLast(({ progress }) => previous > progress.center && next <= progress.center);
}

// Same 3A.1 bounded target contract, selecting the first center crossed in travel order.
export function getProgressTarget(progress: number, target: number, delta: number) {
  let next = clamp(
    target + clamp(delta, -MAX_PROGRESS_LEAD, MAX_PROGRESS_LEAD),
    Math.max(PROGRESS_MIN, progress - MAX_PROGRESS_LEAD),
    Math.min(PROGRESS_MAX, progress + MAX_PROGRESS_LEAD),
  );
  const crossed = getCrossedMilestone(progress, next);
  if (crossed) {
    const { center, activeRadius } = crossed.progress;
    next = next > progress
      ? Math.min(next, center + activeRadius / 2)
      : Math.max(next, center - activeRadius / 2);
  }
  return next;
}

export function getMilestonePhase(
  milestone: Milestone,
  progress: number,
  previousProgress = progress,
  previousPhase: MilestonePhase = "distant",
): MilestonePhase {
  const { center, activeRadius, approachRadius } = milestone.progress;
  const distance = Math.abs(progress - center);
  const crossed = (previousProgress < center && progress >= center) ||
    (previousProgress > center && progress <= center);
  if (crossed || (previousPhase === "active" && distance < approachRadius) || distance < activeRadius) {
    return "active";
  }
  if (distance < approachRadius) return "approaching";
  return progress > center ? "passed" : "distant";
}

export function getJourneyState(
  progress: number,
  previousProgress = progress,
  previousState?: JourneyState,
): JourneyState {
  const retained = previousState?.phase === "active" ? getMilestone(previousState.milestoneId) : undefined;
  const milestone = getCrossedMilestone(previousProgress, progress) ??
    (retained && Math.abs(progress - retained.progress.center) < retained.progress.approachRadius
      ? retained : getNearestMilestone(progress));
  return {
    milestoneId: milestone.id,
    phase: getMilestonePhase(milestone, progress, previousProgress,
      previousState?.milestoneId === milestone.id ? previousState.phase : "distant"),
  };
}

export function getSlowdownWeight(progress: number) {
  const milestone = getNearestMilestone(progress);
  // A binary weight preserves the verified 3A.1 slowdown instead of adding new easing.
  return Math.abs(progress - milestone.progress.center) < milestone.progress.slowdownRadius ? 1 : 0;
}

export function getFraming(milestone: Milestone, mobile: boolean) {
  return mobile ? milestone.framing.mobile : milestone.framing.desktop;
}

function sampleRange(progress: number, [start, end]: ProgressRange) {
  return clamp((progress - start) / (end - start), 0, 1);
}

export function sampleTransition(progress: number, transition = TRANSITIONS[0]) {
  return sampleRange(progress, transition.range);
}

export function sampleNextLandmarkReveal(progress: number, transition = TRANSITIONS[0]) {
  return sampleRange(progress, transition.nextLandmarkRevealRange);
}
