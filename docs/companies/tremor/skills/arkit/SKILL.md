---
name: arkit
description: World tracking, anchors, and spatial calibration for Tremor.
---

# Arkit

Use when Tremor needs stable spatial understanding on Apple hardware.

## Tremor Focus

- Track device pose, world space, and anchors reliably.
- Map physical surfaces into a reusable spatial frame.
- Keep AR session assumptions visible and testable.

## Workflow

1. Define the spatial problem, not just the UI result.
2. Validate tracking, relocalization, and anchor stability on real devices.
3. Measure drift, jitter, and recovery behavior in the target environment.

## Guardrails

- Do not use ARKit as a substitute for calibration discipline.
- Do not assume one environment generalizes to every room.
- Do not hide tracking loss behind cosmetic interpolation.
