---
name: git-governance
description: Branch, review, and release discipline for Tremor code changes.
---

# Git Governance

Use when Tremor is turning a change into a branch, a review, or a release decision.

## Purpose

- Keep code changes small, reviewable, and attributable.
- Preserve release safety and rollback clarity.
- Make repository hygiene part of the operating system.

## When To Use

- Creating or reviewing a PR.
- Preparing a release or hotfix.
- Choosing merge strategy, branch scope, or review requirements.

## When Not To Use

- High-level planning that belongs in strategy or roadmap-management.
- Issue triage with no code impact.
- Purely operational lab work.

## Inputs

- The branch or pull request.
- The release risk and rollback path.
- The owners who will review or approve.

## Outputs

- A merge or release decision.
- A review checklist or follow-up issue.
- A clear rollback or correction path.

## Verification

- The change is attributed to the right branch and owner.
- Review requirements are satisfied.
- Release risk is explicit before merge.
