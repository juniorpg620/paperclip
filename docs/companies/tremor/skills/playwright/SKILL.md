---
name: playwright
description: Automation, simulation, testing, and failure discovery for Tremor.
---

# Playwright

Use when building a test harness, a stress loop, or a validation system that prevents regressions.

## Tremor Focus

- Turn repeated manual checks into deterministic automation.
- Prefer failure discovery that is cheap to rerun.
- Measure the system under real timing and hardware constraints.

## Workflow

1. Define the failure mode or confidence gap first.
2. Build the smallest repeatable harness that exposes it.
3. Record the signal that proves the issue is fixed.

## Guardrails

- Do not rely on ad hoc manual verification when a harness is feasible.
- Do not overfit tests to a single scenario.
- Do not merge a change without a measurable confidence gain or a documented exception.
