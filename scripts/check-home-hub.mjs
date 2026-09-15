import assert from "node:assert/strict";
import { previewFromSwipe } from "../lib/home-hub.ts";

assert.equal(previewFromSwipe(43), "IDLE");
assert.equal(previewFromSwipe(-43), "IDLE");
assert.equal(previewFromSwipe(80), "LEFT_PREVIEW");
assert.equal(previewFromSwipe(-80), "RIGHT_PREVIEW");

console.log("Home Hub checks passed.");
