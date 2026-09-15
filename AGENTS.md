# AGENTS.md

## Scope

These instructions apply to the entire `peiwen-portfolio` repository. The repository is authoritative for current project contracts; chat history and prior reports are background only.

## Project workflow and state

- Read `PROJECT_STATE.md` before significant development work.
- Use `.agents/skills/project-task-init/SKILL.md` before significant repository-changing tasks and `.agents/skills/project-delivery-check/SKILL.md` before completion.
- Update `PROJECT_STATE.md` when durable facts change, including implementation, architecture, dependencies, verification, known constraints, current focus, or next steps.
- Keep planned, designed, implemented, and verified work explicitly separate. Base updates on the actual diff and current verification evidence.
- Do not store volatile Git facts such as branch, `HEAD`, or dirty state in `PROJECT_STATE.md`; inspect them live.

## Stack and organization

- Use TypeScript, Next.js App Router, React, and Tailwind CSS.
- Keep routes and route-specific UI in `app/`, reusable UI in `components/`, and non-UI shared logic in `lib/`.
- Prefer Server Components. Add `"use client"` only when browser APIs or client-side interactivity require it.
- Keep components focused and colocate route-specific code; do not add abstractions or dependencies without a current need.

## User experience

- Build mobile-first responsive layouts and verify both narrow and wide viewports.
- Use semantic HTML, keyboard-accessible interactions, visible focus states, descriptive alternative text, and sufficient color contrast.
- Respect reduced-motion preferences when animation is introduced.
- Protect Core Web Vitals: avoid unnecessary client JavaScript, layout shifts, oversized assets, and unoptimized fonts or images.
- Store source-controlled assets in `public/`, use descriptive filenames, optimize media before committing, and document attribution when required.

## Validation

- Run `npm run lint`, `npm run typecheck`, and `npm run build` for application or configuration changes.
- Check responsive behavior and accessibility when user-facing layout or interaction changes.
- Run `git diff --check` before delivery.
- Treat skipped, unavailable, timed-out, or unknown checks as unverified, not passed.

## Git safety

- Inspect live Git status before editing and protect unrelated staged, unstaged, and untracked work.
- Do not reset, clean, checkout-overwrite, implicitly stash, force push, rewrite history, or delete unrelated files.
- Stage only named task files. Do not use broad staging commands.
- Commit or push only when explicitly requested, after reviewing the actual diff and verification results.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
