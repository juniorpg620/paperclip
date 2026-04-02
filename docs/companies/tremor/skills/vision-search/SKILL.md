---
name: vision-search
description: Visual lookup, frame retrieval, and image similarity search for Tremor.
---

# Vision Search

Use when Tremor needs to find or compare visual artifacts.

## Tremor Focus

- Find matching frames, calibration captures, or board snapshots.
- Compare visual states across time or devices.
- Use search to reduce manual inspection work.

## Workflow

1. Define the visual query and the reference set.
2. Run a bounded search over the known captures or assets.
3. Verify the candidate matches before treating them as equivalent.

## Guardrails

- Do not confuse similarity with correctness.
- Do not use visual search as a substitute for calibration.
- Do not lose provenance for the reference images.
