---
name: cplusplus
description: C++ and bridge-level systems work for Tremor.
---

# Cplusplus

Use when the implementation needs low-level memory control, interop, or deterministic performance.

## Tremor Focus

- Keep ownership and lifetime boundaries explicit.
- Use low-level code only where it materially improves the moat.
- Make Apple interop safe and predictable.

## Workflow

1. Identify the performance-sensitive boundary.
2. Minimize the bridge and isolate the unsafe region.
3. Validate correctness with timing and memory checks.

## Guardrails

- Do not widen the unsafe surface without cause.
- Do not blur ownership across language boundaries.
- Do not trade maintainability for speculative micro-optimization.
