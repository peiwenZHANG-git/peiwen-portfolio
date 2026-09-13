// Run with Node 22+: node --experimental-strip-types scripts/check-journey.mjs
import assert from "node:assert/strict";
import {
  MILESTONES, TRANSITIONS, PROGRESS_MIN, PROGRESS_MAX, MAX_PROGRESS_LEAD,
  getMilestone, getNearestMilestone, getCrossedMilestone, getProgressTarget,
  getMilestonePhase, getJourneyState, getSlowdownWeight, getFraming,
  sampleTransition, sampleNextLandmarkReveal,
} from "../lib/journey.ts";

let checks = 0;
function equal(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
  checks += 1;
}
function close(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 1e-12, `${label}: ${actual} != ${expected}`);
  checks += 1;
}
const epsilon = 1e-8;

equal(MILESTONES.map(({ id }) => id), ["paris-saclay", "cuc"], "registry order");
equal(new Set(MILESTONES.map(({ id }) => id)).size, MILESTONES.length, "unique IDs");
equal(getMilestone("unknown"), undefined, "unknown review ID");
for (const milestone of MILESTONES) {
  const { center, approachRadius: approach, activeRadius: active, slowdownRadius: slow } = milestone.progress;
  equal(getNearestMilestone(center).id, milestone.id, "nearest center");
  equal(PROGRESS_MIN < center - approach && center + approach < PROGRESS_MAX, true, "in journey bounds");
  equal(0 < active && active < slow && slow < approach, true, "nested windows");
  equal(getMilestonePhase(milestone, center - approach - epsilon), "distant", "before approach");
  equal(getMilestonePhase(milestone, center - approach + epsilon), "approaching", "approach enter");
  equal(getMilestonePhase(milestone, center + approach - epsilon), "approaching", "approach inside exit");
  equal(getMilestonePhase(milestone, center + approach + epsilon), "passed", "approach exit");
  equal(getMilestonePhase(milestone, center - active - epsilon), "approaching", "before active");
  equal(getMilestonePhase(milestone, center - active + epsilon), "active", "active enter");
  equal(getMilestonePhase(milestone, center + active - epsilon), "active", "active inside exit");
  equal(getMilestonePhase(milestone, center + active + epsilon), "approaching", "active exit without retention");
  for (const direction of [-1, 1]) {
    const before = center - direction * 0.12;
    const after = center + direction * 0.12;
    equal(getCrossedMilestone(before, after)?.id, milestone.id, "directional crossing");
    equal(getJourneyState(after, before), { milestoneId: milestone.id, phase: "active" }, "fast crossing captured");
    const arrival = { milestoneId: milestone.id, phase: "active" };
    const held = center + direction * 0.08;
    equal(getJourneyState(held, center, arrival), arrival, "active retained outside entry radius");
    equal(getJourneyState(center + direction * (approach + epsilon), held, arrival).phase,
      direction > 0 ? "passed" : "distant", "hysteresis releases both directions");
    close(getProgressTarget(before, before, direction * 10), center + direction * active / 2, "bounded crossing target");
    equal(getSlowdownWeight(center + direction * (slow - epsilon)), 1, "slowdown inside");
    equal(getSlowdownWeight(center + direction * (slow + epsilon)), 0, "slowdown outside");
  }
}
equal(getCrossedMilestone(0.02, 0.98)?.id, "paris-saclay", "first forward crossing wins");
equal(getCrossedMilestone(0.98, 0.02)?.id, "cuc", "first reverse crossing wins");
equal(getCrossedMilestone(0.24, 0.24), undefined, "stationary is not crossing");
equal(getFraming(MILESTONES[0], false)?.landmarkLateral, -3.15, "desktop anchor unchanged");
equal(getFraming(MILESTONES[0], true)?.cameraLateralBias, 0.34, "mobile camera unchanged");
equal(getFraming(MILESTONES[1], true), null, "CUC framing not invented");
equal(Object.values(MILESTONES[1].narration).every((value) => value === null), true, "CUC copy absent");

for (const transition of TRANSITIONS) {
  const from = getMilestone(transition.from);
  const to = getMilestone(transition.to);
  assert.ok(from && to, "valid transition references");
  equal(from.progress.center < to.progress.center, true, "ordered transition");
  const [start, end] = transition.range;
  close(start, from.progress.center + from.progress.approachRadius, "no gap after Saclay zone");
  close(end, to.progress.center - to.progress.approachRadius, "no gap before CUC zone");
  equal(start < end, true, "non-overlapping milestone windows");
  equal(start <= transition.nextLandmarkRevealRange[0] && transition.nextLandmarkRevealRange[1] <= end, true, "reveal inside transition");
  // Descending samples prove reverse travel needs no clock or one-shot state.
  for (const weight of [1, 0.75, 0.5, 0.25, 0]) {
    close(sampleTransition(start + weight * (end - start), transition), weight, "transition sample");
    const [revealStart, revealEnd] = transition.nextLandmarkRevealRange;
    close(sampleNextLandmarkReveal(revealStart + weight * (revealEnd - revealStart), transition), weight, "reveal sample");
  }
  equal(sampleTransition(PROGRESS_MIN, transition), 0, "Saclay stable");
  equal(sampleTransition(PROGRESS_MAX, transition), 1, "CUC stable");
  equal(sampleNextLandmarkReveal(PROGRESS_MIN, transition), 0, "before reveal");
  equal(sampleNextLandmarkReveal(PROGRESS_MAX, transition), 1, "after reveal");
}

// Frozen 3A.1 reference formula, independent of the new query functions.
function oldTarget(progress, target, delta) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let next = clamp(target + clamp(delta, -0.24, 0.24), Math.max(0.015, progress - 0.24), Math.min(0.985, progress + 0.24));
  if (progress < 0.24 && next >= 0.24) next = Math.min(next, 0.24 + 0.055 / 2);
  else if (progress > 0.24 && next <= 0.24) next = Math.max(next, 0.24 - 0.055 / 2);
  return next;
}
for (let progress = 0.015; progress <= 0.37; progress += 0.005) {
  for (const lead of [-0.24, 0, 0.24]) {
    for (const delta of [-10, -0.01, 0, 0.01, 10]) {
      close(getProgressTarget(progress, progress + lead, delta), oldTarget(progress, progress + lead, delta), "Saclay input parity");
    }
  }
}
for (const progress of [PROGRESS_MIN, 0.1, 0.24, 0.44, 0.64, 0.85, PROGRESS_MAX]) {
  for (const delta of [-100, -0.1, 0, 0.1, 100]) {
    const target = getProgressTarget(progress, progress, delta);
    equal(target >= PROGRESS_MIN && target <= PROGRESS_MAX, true, "global bounds");
    equal(Math.abs(target - progress) <= MAX_PROGRESS_LEAD + epsilon, true, "lead limit");
  }
}

// The same zero-delta target protection used each runtime frame must settle and allow departure.
for (const milestone of MILESTONES) {
  for (const direction of [-1, 1]) {
    let progress = milestone.progress.center - direction * 0.12;
    let target = getProgressTarget(progress, progress, direction * 10);
    let state = getJourneyState(progress);
    for (let frame = 0; frame < 480; frame += 1) {
      target = getProgressTarget(progress, target, 0);
      const previous = progress;
      const damping = getSlowdownWeight(progress) ? 2.8 : 4;
      progress = target + (progress - target) * Math.exp(-damping / 60);
      state = getJourneyState(progress, previous, state);
    }
    equal(state, { milestoneId: milestone.id, phase: "active" }, "coasting retains arrival");
    const departure = getProgressTarget(progress, target, direction * 10);
    equal(direction * (departure - milestone.progress.center) > milestone.progress.approachRadius, true, "next input permits departure");
  }
}
console.log(`PASS: ${checks} journey assertions (boundaries, bidirectional crossing/retention, transition/reveal, registry, 3A.1 input parity).`);
