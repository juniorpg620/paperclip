---
name: vision
description: Frame interpretation, calibration, and board-state detection for Tremor.
---

# Vision

Use when Tremor needs to understand what the camera sees.

## Tremor Focus

- Detect boards, markers, tokens, and other visual state from frames.
- Keep calibration and coordinate transforms explicit.
- Prefer repeatable frame analysis over hand-tuned assumptions.

## Workflow

1. Identify the frame source and the visual state to extract.
2. Calibrate the transform or detection path against real captures.
3. Verify that extracted state is stable under the expected lighting and pose range.

## Guardrails

- Do not confuse detection with rendering.
- Do not encode logic in an opaque vision pipeline without traceable outputs.
- Do not skip calibration just because the demo looks correct once.
