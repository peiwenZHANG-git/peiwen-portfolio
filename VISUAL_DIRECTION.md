# Visual Direction

## Site-wide style standard — STYLE_GUIDE.md (approved 2026-09-15)

`STYLE_GUIDE.md` is the approved acceptance standard for every page and every new asset.
It is merged here in summary; the file itself remains authoritative. English scope only.
**It does not override the Home freeze stated in the next section, which is reproduced verbatim
and unchanged.** Home is the thing referenced, never the thing modified.

**"Home" means the Static Master** (`app/home-master.tsx` + `public/home-master/master.png`),
reviewable at `/?static-reconstruction=1` and `/?peiwen-phase1=1`. Those two routes are also the
pixel-invariance baseline. `HomeHub`, which `/` renders by default, is the earlier implementation:
it is neither the standard nor touched in this pass.

- **One sentence:** fine graphite/ink linework, very thin transparent watercolor, large areas of
  warm ivory paper. No frame — edges dissolve into the paper. If it reads louder, busier, brighter
  or more real than Home, it fails.
- **Palette** (STYLE_GUIDE §2): values that exist in Master code come from `home-master.module.css`;
  illustration-internal values stay as `master.png` samples. All variables use the `--pw-*`
  namespace. `--pw-paper #F7F3E9`, `--pw-ink #3B3837`, `--pw-ink-soft #837D78`,
  `--pw-ink-faint #76716C`, `--pw-accent #D74B3C`, plus sage / dust-blue / straw / butter /
  rose-brown from sampling. **Do not redefine `--paper` / `--ink` / `--muted` in
  `app/globals.css :root`** — those belong to the old Experience prototype and overriding them
  would corrupt `/experience`. Saturation ceiling ~35%; the accent colour marks current state only.
- **Type** (STYLE_GUIDE §6): three tiers — handwriting **Patrick Hand** (`next/font/google`,
  weight 400), body **Nunito** 400/600, eyebrow Nunito 600 uppercase `letter-spacing: .18em`.
  No serif anywhere, no text glow/stroke/shadow, no handwriting for paragraphs over two lines.
- **Shell** (STYLE_GUIDE §7): one shared Header for every page, templated on **Master's** header
  (`.logo` / `.tagline` / `.navigation` / `.language`), not HomeHub's; extraction must leave Master
  pixel-identical. Page numbers are `01 / 02` with the denominator read from real chapter data
  (`STORYBOOK_SCENES.length`). Monochrome line icons only. No cards, panels, glass or HUD overlays.
- **Illustration** (STYLE_GUIDE §3–§5, §8): visible linework and visible paper, ≥40% whitespace,
  flat light, no glow/bloom/specular/cast shadows, no cut-out or leafy borders, no decorative text
  beyond landmarks. Peiwen has exactly one identity — the Home one.
- **Experience filter** (STYLE_GUIDE §11, measured 2026-09-15 on the real runtime plates,
  HSV-saturation mean): Home reference 0.1189 (lower illustration band). Saclay raw 0.1191 already
  matches it, so **Saclay uses `saturate(1.00)`** plus a slight warm shift and a weakened paper
  multiply — its problem is hue, not saturation. **CUC keeps `saturate(.50)`** (measured 0.2578);
  reaching 0.13–0.15 would need `.19`, which greys out autumn. **0.13–0.15 is the post-repaint
  end goal, not this pass's filter target.**

Scope limits carried over from the guide: it unifies style, type and interface shell only. It does
not change information architecture, Hero spatial logic, Experience interaction, or the approved
Peiwen character. Chinese-language typography is deferred until the English pass is complete.

## Active — Peiwen's Little World Home Hub

**2026-09-15 freeze:** Static Master has passed human approval. Scene, typography and Idle
Peiwen anchor/scale are frozen. Current Phase 1 is ONLY original-pixel Peiwen walking a
restrained 54px left and returning, plus the smallest origin clean plate. Review at
`/?peiwen-phase1=1`; no other dynamic state or layout changes are authorized. Older
pending-static-approval and split-crop descriptions below are superseded.

The active approach is **Master Plate + Minimal Dynamic Overlays**, superseding the split-layer
attempt below. Keep the full 1536×1024 target composition. Cover baked text with original-paper
patches and render real DOM text. Static approval comes first; only then add local Peiwen/clean
background, window, door/light or foreground transition overlays and regional Opening reveals.
Do not independently extract/reposition the landscape, house, tree or dense plants.

### Static target reconstruction — pending manual approval

The supplied 1536×1024 Home image is the sole visual truth for the current asset rebuild. The
review route `/?static-reconstruction=1` uses deterministic pixel crops from
`design-assets/home-v2/home-visual-target.png`; header and central copy remain DOM. It is a static
checkpoint only. Do not continue into interaction-layer production, mobile adaptation, or old-asset
cleanup until the static composition is approved.

Home is a quiet warm-paper world entrance: left road for Experience, Peiwen at the center for About,
and the warm-window house on the right for Projects. The composition stays sparse and hand-drawn;
preview states wake one destination at a time without large signs, cards, cursor tricks or free movement.

Opening uses a short layered reveal. The 2026-09-14 reference correction supersedes the old
identity-disappears rule: Idle retains “Peiwen Zhang / A small world of curiosity.” above the sky
prompt “Where would you like to go?”. The world occupies the lower half, with restrained foreground
plants, existing house/fence art, and Peiwen centered at 50% (Preview 42% / 58% on desktop and mobile).
Preview dims the Hero identity and uses road/house-adjacent handwritten annotations without CTA verbs.
Peiwen moves in discrete steps, not with pointer coordinates. Mobile uses swipe/tap;
reduced motion uses a short fade. Visual approval is still required for scale, spacing and color balance.
The reference is a composition benchmark, not a runtime background. Existing assets do not provide
its full watercolor town and dense botanical detail; no new town/building or generated art was added.

## Parallel — Minimal 3D Picture-book Journey

One World, One Road, Six Chapters is the long-term direction: Peiwen walks along the existing
continuous road; seasons, light and sparse vegetation express emotional states, not geography.
The current prototype at `/?world=minimal` implements **winter night only**. No autumn transition,
six-scene implementation or new biographical content is authorized in this pass.

Preserve small Peiwen, existing movement/camera/path and generous whitespace. Use restrained pale
blue-violet, graphite lines, simple ground/sky, very faint distance, a few existing plants and sparse
fireflies. Judge static and walking comfort, depth, grounding and road/character readability — not
asset count or resemblance to the large Saclay keyframe. Mobile keeps the existing framing foundation.

Do not pursue Eiffel, campuses, real places, snowbank collage, complex biomes or full illustration
reconstruction. Existing keyframes now guide palette/atmosphere/handmade style only. No new image
generation, complex shader, PBR, dynamic shadows or dependency is needed.

Old 3C and `/storybook` stay recoverable; the text below is historical and no longer the active plan.
Stop for visual review before committing, adding autumn or switching the default homepage.

## Historical — Storybook Journey

**A continuous-feeling illustrated journey composed of discrete storybook scenes.**

Each milestone is a complete, static-frame-first illustration. Continuity comes from input, progress,
gentle framing and transitions, eventually Peiwen continuity — not a continuous 3D map.
Atmosphere supports Peiwen's English-first HCI × AI Agents portfolio and readable confirmed facts.

Planned: Intro → Saclay → transition → CUC → transition → Japan → Tantan → Huashun → Yundao →
Projects bridge. Pass 4A implements only Saclay → transition → CUC in /storybook.
The original / remains available until approval; it is not the active visual target.

## Abandoned — continuous 2.5D spatial biome world

Not a technical impossibility: continuity costs, too many intermediate drawings and cutout/sticker
compositions undermined static-frame-first artwork. Old 3C roads, snowbanks, spatial campus cutouts and
Eiffel placements are preserved, not repaired. Do not continue P1 spatial-environment integration.
The long path remains a narrative motif, not a physically continuous map/camera-coordinate requirement.

## Approved targets / temporary review plates

- design-assets/keyframes/experience/paris-saclay-approved.png: winter night, blue-violet sky,
  snow, moon, warm campus windows/lamps, distant Eiffel and winter foreground framing.
- design-assets/keyframes/experience/cuc-approved.png: autumn sunset, pink/gold sky, ginkgo,
  leaves, clocktower, name stone and city memory.

Approved visual targets, not generic moodboards. Pass 4A uses the unchanged PNGs via Next Image as
**temporary review plates**, NOT production backgrounds: Peiwen, headline, hints and signs are baked in.
No extra character/headline, cutout, background reconstruction, AI fill or source modification.

## POC composition and handoff

- Full-viewport cover, configurable desktop/mobile object-position.
- Stable push-in at most 1→1.02, no independent idle motion.
- Saclay 0.015–0.345; transition 0.345–0.535; CUC 0.535–0.985.
- Progress t yields visual contributions 1-t / t; scales 1.02→1.04 and 0.98→1.
  Opaque-base compositing prevents a background flash. Reverse retraces exactly.
- Reduced motion: no push-in/parallax/ambient, immediate midpoint handoff.
- Optional midground/foreground/ambient fields are contract slots, not implemented systems.
- DOM narration remains accessible through details/skip link without another large headline.
- CUC career fields remain null. Only the existing confirmed Saclay facts are exposed.

## Deliberately unresolved

Baked character/title differences ghost during crossfade. This is not finished character continuity
or the final snow-to-leaf artistic transition. Later options: clean plates plus shared Peiwen OR
baked stable scenes plus shared walking bridge. Neither is chosen or implemented by Pass 4A.

Mobile 390×844 uses controlled landscape cropping, with some baked content clipped. This is a
functional architecture check, NOT final mobile composition. Baked sideways hints are stale;
the review's real controls are vertical journey progress only.

No new art, clean plates, shader dissolve, particles, later chapters, Hub or Project House.
Stop for POC review before Pass 4B or switching the default.

## Preservation / originality

All old source and runtime art remains in design-assets/ and public/assets/. Birds, butterflies,
fireflies and dandelions remain global reusable sources, not a new ambient system in this pass.
Do not fabricate biographical facts, publish an outdated CV or finalize temporary copy.

ITom (https://github.com/ITomPoland/portfolio-itom) is a technical reference only. Study MIT code under
its license; do not reuse artwork, textures, branding, copy, room designs, project content or composition.
