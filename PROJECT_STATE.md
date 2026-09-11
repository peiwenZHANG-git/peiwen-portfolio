# PROJECT_STATE - peiwen-portfolio

- Project name: peiwen-portfolio
- Repository path: `C:\Users\21781\Documents\ChatGPT\Peiwen-portfolio`
- Purpose: Create Peiwen Zhang's personal portfolio for HCI, UX research, UX engineering, and research opportunities.
- State baseline: This document records durable project state. Verify current branch, `HEAD`, remote relationship, and dirty state live when they matter.
- Maintenance rule: Read this document before significant work. Update it when durable facts change and refresh the last-updated date.

## Status definitions

- `planned`: The requirement or direction is recorded, but no approved design or implementation exists.
- `designed`: A concrete design has been approved, but implementation is incomplete.
- `implemented`: Working code exists, but required verification is incomplete.
- `verified`: Implementation exists and the recorded checks have passed.

## Current goal

Visually review Goal 1C: Opening Scene → Hero → the first confirmed Experience landmark. Stop before further implementation or a commit until the user has reviewed the captures.

## Architecture

- Next.js App Router, TypeScript, React, and Tailwind CSS; npm manages dependencies and scripts.
- The homepage is a Server Component in `app/page.tsx`; native CSS lives in `app/globals.css`.
- One continuous decorative SVG terrain connects the opening sky/grass landscape, the Hero clearing, and a symbolic learning pavilion. The pavilion is not a depiction of the actual campus.
- Native anchors navigate to the Hero and Experience. No custom client JavaScript, scroll camera, parallax, animation framework, or new dependency was added.
- The scene is static. Only navigation color transitions and native smooth scrolling are enabled when reduced motion is not requested.
- Reusable UI will live in `components/`; non-UI shared logic will live in `lib/` when needed.

## Delivery status

| Scope | Status | Evidence |
| --- | --- | --- |
| Bootstrap contracts and workflow skills | verified | Required files and source-copy hashes passed bootstrap validation on 2026-09-09; unchanged by Goal 1C. |
| Minimal Next.js application foundation | verified | Lint, typecheck, and production build passed on 2026-09-09. |
| Goal 1C opening, Hero, and first Experience landmark | implemented | Approved storyboard implemented as a static continuous landscape. Full desktop/mobile and five desktop storyboard captures are ready; user visual acceptance remains pending. |
| Responsive browser baseline | verified | Checked widths 320, 390, 500, 768, 1024, 1440, and 1920px; no horizontal overflow or clipped text containers. |
| Keyboard and reduced-motion baseline | verified | First Tab exposes the skip link; activation focuses Hero, then the Experience link focuses its target. Visible focus, reduced-motion behavior, and content/navigation without JavaScript passed browser checks. |
| Final positioning copy | planned | Current sentence is a temporary, user-authorized draft, not an approved final career or research claim. |
| Public CV entry | planned | No current public CV is available; no CV link, download, or Hero availability notice is implemented. |
| Further Experience landmarks | planned | Only Université Paris-Saclay / Human-Computer Interaction is represented; no additional organizations or roles are invented. |
| Projects, About, Playground, bilingual routing, AI Peiwen, Pixel Peiwen | planned | Outside this iteration; no implementation added. |

## Current work

- Goal 1C is ready for manual visual review. Earlier visual drafts were preserved reversibly before editing.
- Homepage hierarchy is Opening Scene → Hero → Experience. The opening viewport intentionally does not carry the full Hero content.
- The path extends beyond the first landmark without implying additional experiences.

## Known issues and constraints

- Older CV materials predate the current Paris-Saclay stage. An updated public CV is unavailable and must not be exposed.
- "Exploring how people and AI agents work together." is temporary copy held in the single `positioning` constant in `app/page.tsx`.
- Experience shows only the confirmed institution and HCI identity. Dates, titles, outcomes, and further details are not invented; "Details coming soon." is a neutral placeholder.
- There is no empty details control because verified detail content is unavailable.
- Visual style, narrative pacing, and actual-device appearance still require user review. Browser emulation is not a real-device test.
- No complex 3D, canvas, WebGL, backend, analytics, CMS, or additional animation system is in scope.

## Verification

Goal 1C checks on 2026-09-09:

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; homepage is statically prerendered.
- Build used `NEXT_TELEMETRY_DISABLED=1` for the existing host-specific cross-device rename issue in Next.js's global telemetry config.
- `git diff --check`: passed.
- Browser widths 320 / 390 / 500 / 768 / 1024 / 1440 / 1920px: passed overflow and text-container checks.
- Full desktop capture: 1440px wide, from a 1440 × 900 viewport.
- Full mobile capture: 390px wide, from a 390 × 844 viewport.
- Desktop storyboard captures: 0H, 0.55H, 1.05H, 1.75H, 2.3H; H = 900px.
- Keyboard: skip link visibility, focus transfer to Hero and Experience, and a visible 2px link focus outline passed.
- Reduced motion: native scroll behavior becomes auto, transition duration is zero, and no running animations were observed.
- JavaScript-disabled browser: identity content, the confirmed landmark, and native entry navigation remained available.
- No browser page errors were reported.
- No dependencies were installed or changed in this task.
- Manual visual approval: pending user review.

## Next steps

Review the full desktop/mobile captures and all five storyboard states. Refine only the visual issues the user identifies before considering any commit or broader homepage work.

## Last updated

2026-09-09
