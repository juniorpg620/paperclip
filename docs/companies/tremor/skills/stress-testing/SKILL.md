---
name: stress-testing
description: Load, endurance, and resilience testing for Tremor.
---

# Stress Testing

Use when Tremor needs to see where the system bends before it breaks.

## Purpose

- Push the system into a regime that reveals weak points.
- Observe how behavior changes under sustained pressure.
- Feed failure data back into the roadmap and QA plan.

## When To Use

- Load testing.
- Endurance or soak testing.
- A feature must survive repeated or concurrent use.

## When Not To Use

- One-off functional checks.
- Low-risk UI tweaks.
- A problem that is better solved by deterministic simulation.

## Inputs

- The pressure pattern to apply.
- The expected failure boundary.
- The metric that matters under load.

## Outputs

- A reproducible stress scenario.
- The observed failure point or margin.
- Notes about which subsystem failed first.

## Verification

- The test can be rerun with the same conditions.
- The failure mode is clearly identified.
- The result improves the roadmap or the harness.
