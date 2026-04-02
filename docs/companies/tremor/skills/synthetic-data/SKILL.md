---
name: synthetic-data
description: Controlled data generation for Tremor tests and analysis.
---

# Synthetic Data

Use when Tremor needs a reproducible dataset that does not come from production data.

## Tremor Focus

- Produce data that exercises a known edge case or pattern.
- Keep the generation recipe readable and reproducible.
- Use synthetic data to unlock tests, simulations, or training loops.

## Workflow

1. Define the scenario the dataset must represent.
2. Generate the minimum data needed to exercise that scenario.
3. Verify the synthetic data still exposes the intended behavior.

## Guardrails

- Do not make the dataset broader than the test needs.
- Do not lose the generation recipe or assumptions.
- Do not let synthetic data stand in for production validation.
