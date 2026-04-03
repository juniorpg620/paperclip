---
name: metal
description: GPU rendering, shader work, and frame budget control for Tremor.
---

# Metal

Use when Tremor needs rendering work that ordinary views cannot carry.

## Tremor Focus

- Keep the board render path within frame budget.
- Make shaders, passes, and buffers explicit.
- Use GPU work only when it materially improves fidelity or throughput.

## Workflow

1. Identify the render bottleneck or visual need.
2. Implement the smallest GPU path that satisfies it.
3. Profile the result on target hardware and compare against the baseline.

## Guardrails

- Do not move logic into shaders when it belongs in deterministic state.
- Do not widen the GPU surface without a measurable benefit.
- Do not ship visual complexity that the target device cannot sustain.
