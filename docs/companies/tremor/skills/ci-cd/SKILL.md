---
name: ci-cd
description: Build, test, and release automation for Tremor.
---

# CI CD

Use when Tremor needs a reliable build or release pipeline.

## Purpose

- Turn the codebase into a repeatable pipeline.
- Catch broken builds early.
- Keep release steps visible and reproducible.

## When To Use

- Build automation.
- Release checks.
- Test orchestration and pipeline repair.

## When Not To Use

- Product design.
- Manual issue tracking.
- One-off lab checks.

## Inputs

- Build commands and environments.
- Test expectations.
- Release constraints.

## Outputs

- A green or failed pipeline state.
- A fix path for the failure.
- A release checkpoint.

## Verification

- The pipeline is repeatable.
- Failures are actionable.
- Release gates are explicit.
