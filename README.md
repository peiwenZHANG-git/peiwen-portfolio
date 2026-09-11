# Peiwen Zhang Portfolio

An English-first, illustrated spatial portfolio for Peiwen Zhang, focused on HCI × AI Agents, UX research, and UX engineering.

The current prototype lets visitors walk with Peiwen along a constrained Experience path. It includes one confirmed landmark: Université Paris-Saclay / Human-Computer Interaction. The visual composition is still under review.

## Start here

- `CLAUDE_HANDOFF.md` — continuation brief and strict task boundary.
- `PROJECT_STATE.md` — durable implementation and verification state.
- `VISUAL_DIRECTION.md` — approved direction and open visual decisions.
- `ASSET_INDEX.md` — source sheets, runtime derivatives, and usage rules.
- `AGENTS.md` — repository workflow and engineering rules.

## Development

```powershell
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```powershell
npm run lint
npm run typecheck
$env:NEXT_TELEMETRY_DISABLED='1'; npm run build
git diff --check
```

The external ITom portfolio repository is a technical architecture reference only: <https://github.com/ITomPoland/portfolio-itom>. Study licensed code patterns where useful; do not reuse its artwork, textures, branding, copy, rooms, project content, or visual composition.
