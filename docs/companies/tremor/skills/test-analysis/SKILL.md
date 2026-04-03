---
name: test-analysis
description: Test result triage, flake analysis, and failure interpretation for Tremor.
---

# Test Analysis

Use when Tremor has test output that needs interpretation or cleanup.

## Tremor Focus

- Separate real regressions from flaky or environmental failures.
- Turn test output into a short, usable diagnosis.
- Keep the next action obvious for the owner of the failing area.

## Workflow

1. Classify the failure signal and the likely layer.
2. Check whether the failure is repeatable under the same inputs.
3. Summarize the cause, the confidence level, and the next verification step.

## Guardrails

- Do not rewrite a flaky test as if it were a product bug.
- Do not hide uncertainty in the diagnosis.
- Do not expand the scope beyond the observed evidence.
