# Peiwen dynamic overlay Phase 1

The Static Master was approved/frozen by the user. Runtime derivatives are isolated in
`public/peiwen-phase1/`; nothing is written into `public/home-master/`.

`frozen-idle-baseline.png` is the unmodified 1536×1024 browser capture taken before Phase 1
implementation, including the approved DOM typography. It is test evidence, not runtime art.

- `peiwen-original.png`: master RGB pixels, alpha silhouette, 120×230 crop at (800,608).
  Runtime clips torso and two legs from the SAME original-pixel sprite. No redesign,
  scaling, mirroring, or generated walking pose is used. Three subtle foot strides are
  a limited 2D rig of the back-facing pose, not a new directional animation sheet.
- `origin-clean-source.png`: selected built-in imagegen edit, generated from a 320×320
  master crop at (704,560). This large candidate is NOT mounted. Resize to 320×320,
  extract (96,48,120,230), mask only the original silhouette + 3px edge/contact shadow.
  All generated pixels outside that small patch are discarded.
- The earlier whole-scene removal candidate had a local seam and was rejected. The
  generated character-extraction candidate reinterpreted the drawing and was rejected.
- Runtime origin is (800,608); left endpoint is (-54,+8) relative to origin; scale is 1.
  Ground contact sits around y825→833. Return ends at exact original anchor, then removes
  the local overlay in 120ms, revealing the unchanged master.
- Preparation: `node scripts/prepare-peiwen-phase1.mjs`. It verifies frozen asset/CSS hashes.
  Browser check: `node scripts/check-peiwen-phase1.mjs` with Playwright available on NODE_PATH.
- Human approval still required: local background continuity, original identity in motion,
  foot contact, and seamless handoff. Do not treat pixel equality in Idle as art approval.

## Final selected inpaint prompt (built-in imagegen)

Use case: precise-object-edit. This is a 320x320 local crop from a frozen watercolor
illustration, edit target. Remove ONLY the girl and her contact shadow. Reconstruct the
exact continuation of the pale blue mountains behind the upper hair, gray sage distant
shrubs behind lower hair, pale sage grassy hillside behind coat/legs, cream footpath
behind boots. Very important retain EXACT pre-existing horizon boundaries, diagonal
hillside contours, plant stems, road edges at same positions. Grass should match
neighboring fine watercolor grain and color; no featureless cream/white blob. Keep all
pixels OUTSIDE the girl's silhouette unchanged. Don't smooth or repaint the surroundings
or change color grading. No new decorative plants. Same square crop, no border, no text.
This will be pasted behind the removed girl's silhouette, so local edge continuity is critical.
