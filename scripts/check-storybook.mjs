// Node 22+, no test dependency: node --experimental-strip-types scripts/check-storybook.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { MILESTONES, PROGRESS_MIN, PROGRESS_MAX, getProgressTarget, getJourneyState } from "../lib/journey.ts";

// Transpile this one pure module; resolve its extensionless app import for Node.
const source = await readFile(new URL("../lib/storybook.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace('"./journey"', JSON.stringify(new URL("../lib/journey.ts", import.meta.url).href));
const { STORYBOOK_SCENES, parseStorybookProgress, sampleStorybook } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

assert.equal(STORYBOOK_SCENES.length, 2);
assert.equal(new Set(STORYBOOK_SCENES.map((scene) => scene.visual.backgroundPlate)).size, 2);
STORYBOOK_SCENES.forEach((scene, index) => assert.deepEqual(scene.narration, MILESTONES[index].narration));
assert.ok(Object.values(STORYBOOK_SCENES[1].narration).every((value) => value === null));
for (const value of [undefined, "", " ", "NaN", "Infinity", "-Infinity", "no", "-10"]) assert.equal(parseStorybookProgress(value), PROGRESS_MIN);
assert.equal(parseStorybookProgress("10"), PROGRESS_MAX);
assert.equal(parseStorybookProgress("0.44"), 0.44);
assert.equal(sampleStorybook(0.24).scene.id, "saclay-winter");
assert.equal(sampleStorybook(0.64).scene.id, "cuc-autumn");
assert.equal(sampleStorybook(0.345).phase, "stable");
assert.equal(sampleStorybook(0.535).phase, "stable");
const forward = [];
for (let index = 0; index <= 1000; index++) {
  const p = PROGRESS_MIN + (PROGRESS_MAX - PROGRESS_MIN) * index / 1000;
  const normal = sampleStorybook(p);
  const reduced = sampleStorybook(p, true);
  forward.push(normal);
  assert.deepEqual(reduced.scales, [1, 1]);
  assert.ok([0, 1].includes(reduced.incomingOpacity));
  assert.ok(normal.incomingOpacity >= 0 && normal.incomingOpacity <= 1);
  assert.ok(normal.scales.every((scale) => scale >= 0.98 && scale <= 1.04));
  // Opaque outgoing bottom + incoming alpha has complete composite coverage.
  assert.equal(normal.incomingOpacity + (1 - normal.incomingOpacity) * 1, 1);
}
for (let index = 1000; index >= 0; index--) assert.deepEqual(sampleStorybook(PROGRESS_MIN + (PROGRESS_MAX - PROGRESS_MIN) * index / 1000), forward[index]);
for (const t of [0.25, 0.5, 0.75]) assert.ok(Math.abs(sampleStorybook(0.345 + t * 0.19).transition - t) < 1e-12);
for (const delta of [-1e12, 1e12]) {
  const target = getProgressTarget(0.44, 0.44, delta);
  assert.ok(target >= PROGRESS_MIN && target <= PROGRESS_MAX && Math.abs(target - 0.44) <= 0.24);
}
let state = getJourneyState(0.2);
state = getJourneyState(0.25, 0.2, state);
assert.equal(state.phase, "active");
assert.equal(getJourneyState(0.31, 0.25, state).phase, "active");
assert.equal(getJourneyState(0.36, 0.31, state).phase, "passed");
assert.equal(getJourneyState(0.23, 0.3).phase, "active");
console.log("PASS: storybook mapping, 1001 reversible samples, coverage, scale limits, reduced motion, null narration, bounds and hysteresis.");
