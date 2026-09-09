---
name: project-delivery-check
description: Validate project work against the actual diff, repository rules, required verification, and PROJECT_STATE.md synchronization before completion.
---

# Project Delivery Check

Use this skill after implementation and before declaring work complete, proposing a final report, or committing when a commit was requested. Re-check the live result; do not rely only on the task-initialization snapshot.

## Workflow

1. Inspect the live change with Git: status, current branch, upstream relationship when configured, staged and unstaged diffs, and untracked files. Review the actual patch rather than assuming it matches the plan.
2. Re-read the current `AGENTS.md` and confirm the change respects scope, compatibility, code organization, safety, dependency, generated-file, and verification rules. Identify any uncovered property as a remaining risk instead of claiming it was checked.
3. Check the patch for accidental edits, unrelated refactors, debug output, temporary files, generated artifacts, credentials, tokens, private URLs, session material, and unintended behavior changes.
4. Run validation at the level of risk. Use the exact checks required by `AGENTS.md` and the project profile, plus focused tests when they materially increase confidence. Documentation-only work needs link, path, structure, and consistency checks; do not run irrelevant application tests merely for ceremony, and say so when a normally expected check is intentionally omitted.
5. Run `git diff --check` when Git tracks the project. Never use checkout, merge, rebase, reset, clean, or another destructive operation to make a delivery problem disappear.
6. Decide whether any durable fact in `PROJECT_STATE.md` changed: implementation, architecture, completed work, public behavior, dependencies or runtime, safety boundaries, known issues or blockers, verification baseline, current focus, or next steps. If yes, update only those facts from the actual diff and latest evidence and refresh the last-updated date. If no recorded fact changed, do not edit the file for formality.
7. Keep dynamic Git facts out of `PROJECT_STATE.md`; report branch, `HEAD`, dirty state, ahead/behind, and unpushed work separately when relevant.
8. Return exactly one result:
   - `PASS`: required checks passed and project-state synchronization was correctly applied or correctly judged unnecessary.
   - `PASS WITH MANUAL CHECK`: automated checks passed, but a named real-service, real-device, visual, deployment, or platform-specific check remains and requires explicit authorization.
   - `BLOCKED`: required evidence cannot be obtained without authorization or an external dependency.
   - `FAIL`: a required check failed, the patch violates a repository rule, or durable project state is out of sync.

Never describe a skipped prerequisite, timeout, unavailable dependency, or unknown result as a pass.
