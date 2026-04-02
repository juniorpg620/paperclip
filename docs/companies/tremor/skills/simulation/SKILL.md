---
name: simulation
description: Deterministic simulation and replay for Tremor.
---

# Simulation

Use when Tremor needs a replayable model of play, load, or failure.

## Purpose

- Make complex behavior testable without a live user in the loop.
- Reproduce bugs from a known input and a known seed.
- Give QA and platform owners a safe place to experiment.

## When To Use

- Replayable playthroughs.
- Deterministic stress or soak scenarios.
- Bugs that need a controlled environment.

## When Not To Use

- Pure UI styling.
- A real-device issue that needs hardware testing.
- Work that only needs a single manual reproduction.

## Inputs

- A seed, trace, or replay input.
- The behavior or invariant under test.
- The expected observable output.

## Outputs

- A reproducible simulation run.
- The exact point where behavior diverges.
- Notes that help QA or platform reproduce it.

## Verification

- The same input produces the same output.
- The run is stable enough to compare across versions.
- Deviations are easy to explain.
