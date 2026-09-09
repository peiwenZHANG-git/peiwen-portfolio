---
name: project-task-init
description: Initialize repository-changing project work from PROJECT_STATE.md, AGENTS.md, and live Git state before implementation.
---

# Project Task Initialization

Use this skill before implementation that changes code, configuration, architecture, dependencies, public behavior, tests, documentation contracts, or release state. Its purpose is to restore project context and make safety constraints explicit before editing.

## Workflow

1. Resolve the project root from the active workspace or explicit target directory. Confirm `.project-bootstrap.json`, `PROJECT_STATE.md`, and `AGENTS.md` exist when the project uses this bootstrap contract.
2. Read `PROJECT_STATE.md` first. Treat it as the durable context snapshot, not as evidence of current Git status.
3. Read `AGENTS.md` next. Apply its repository-wide scope, compatibility, safety, code organization, dependency, verification, and documentation rules.
4. Check Git in real time before deciding how to proceed:
   - `git status --short --branch`
   - current branch and `HEAD`
   - relationship to the configured upstream or `origin/main` when one exists
   - staged, unstaged, and untracked changes
   Fetch only when a remote is configured and latest remote state is needed. Fetch must never checkout, merge, rebase, reset, or clean.
5. Treat every existing staged, unstaged, and untracked change as protected user or prior-task work unless the current task explicitly owns it. Do not reset, clean, checkout-overwrite, implicitly stash, force push, or delete those changes.
6. Extract only constraints that affect this task: public interfaces, architecture, data and migration rules, security boundaries, dependencies, verification commands, generated-file policy, and known blockers. Stop when the request conflicts with the project contract or requires approval that has not been given.
7. Choose planning depth from risk. A small, local, reversible change needs only target scope, key constraints, and verification. A multi-file, architectural, data, security, dependency, release, permission, or hard-to-reverse change needs steps, dependencies, risks, acceptance checks, and a rollback approach before edits.
8. Report one readiness result before implementation:
   - `READY`: live facts are verified and implementation can proceed.
   - `READY WITH CONSTRAINTS`: implementation can proceed only within named repository or user boundaries.
   - `BLOCKED`: state cannot be verified, required approval is missing, or the request conflicts with a safety or compatibility rule.

Do not infer current branch, dirty state, implementation status, test results, or completion progress from chat memory or an old report when live project facts matter.
