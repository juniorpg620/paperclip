---
name: qa-automation
description: Deterministic regression harnesses and failure discovery for Tremor.
---

# Qa Automation

Use when Tremor needs a repeatable way to catch regressions before they reach the studio.

## Purpose

- Turn repeated manual checks into cheap, repeatable automation.
- Catch failures where they are easiest to reproduce.
- Make the proof of correctness visible to the team.

## When To Use

- Regression testing.
- Hardware-in-the-loop checks.
- Smoke tests for the current vertical slice.

## When Not To Use

- Pure exploration with no stable expectation.
- One-off debugging that does not need automation.
- A test that cannot be run again cheaply.

## Inputs

- The failure mode or confidence gap.
- The system surface that needs coverage.
- The observable signal that proves success or failure.

## Outputs

- A repeatable harness.
- A stable signal for pass/fail.
- A short note on what the harness does not cover.

## Verification

- The harness fails when the bug is present.
- The harness is cheap enough to rerun.
- The test result is legible without extra interpretation.
