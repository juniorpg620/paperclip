---
name: deterministic-systems
description: Reproducible state machines, replay, and time-sensitive logic for Tremor.
---

# Deterministic Systems

Use when correctness depends on the same outcome across runs, devices, or replays.

## Purpose

- Keep the authoritative state model replayable.
- Make timing-sensitive behavior measurable instead of anecdotal.
- Prevent hidden nondeterminism from entering the board state.

## When To Use

- State-machine design.
- Replay or snapshot logic.
- Any feature where order, time, or seed affects the result.

## When Not To Use

- Pure presentation work.
- One-off manual debugging.
- Work that does not need reproducibility.

## Inputs

- State transition rules.
- Seed, clock, or ordering assumptions.
- Expected outputs for a replay or test case.

## Outputs

- A deterministic transformation or invariant.
- A replayable test fixture.
- A visible explanation of what is and is not deterministic.

## Verification

- Re-running the same input yields the same output.
- The test explains the source of any remaining nondeterminism.
- Replay data is stable enough for QA and simulation.
