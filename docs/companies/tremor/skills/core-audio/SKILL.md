---
name: core-audio
description: Audio timing, mixing, and perceptual polish for Tremor.
---

# Core Audio

Use when Tremor needs to shape sound, timing, or the perceptual quality of the play surface.

## Purpose

- Make the product feel physically grounded.
- Keep audio timing aligned with the play loop.
- Preserve signal quality when the system is under load.

## When To Use

- Audio playback or mixing that affects the player experience.
- Timing-sensitive signal analysis.
- Perceptual tuning tied to the board interaction loop.

## When Not To Use

- Pure visual rendering work.
- Non-sensory business logic.
- A change that only needs a product decision.

## Inputs

- The intended perceptual effect.
- Timing and latency constraints.
- Real-device or real-signal measurements.

## Outputs

- A tuned audio path.
- A measurable timing budget.
- Notes on the tradeoff that was chosen.

## Verification

- The result sounds correct on real hardware.
- Latency stays within budget.
- The implementation remains deterministic enough for QA.
