# Peiwen Zhang Portfolio

An English-first, illustrated portfolio for Peiwen Zhang, focused on HCI × AI Agents, UX research, and UX engineering.

The default route is Peiwen's Little World Home Hub. The preserved walking Experience prototype is available at `/experience`; both visual compositions remain under review.

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

## License

© Peiwen Zhang. All rights reserved. Code and artwork may not be reused without permission.
