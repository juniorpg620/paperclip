---
name: latency-benchmarking
description: End-to-end latency measurement and timing budgets for Tremor.
---

# Latency Benchmarking

Use when Tremor needs to measure time between input, transport, and visible or tactile output.

## Tremor Focus

- Measure input-to-response delay on real devices.
- Track timing budgets across the board, sync, render, and feedback path.
- Compare the measured result against the target budget, not intuition.

## Workflow

1. Define the path that needs a timing budget.
2. Instrument the path with a repeatable harness.
3. Record the measured budget and the acceptable threshold.

## Guardrails

- Do not use latency numbers without stating the test conditions.
- Do not mix timing measurement with unrelated correctness checks.
- Do not accept a budget that was not measured on the real target path.
