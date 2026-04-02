---
name: dsp
description: Digital signal processing, timing, and analysis for Tremor.
---

# DSP

Use when Tremor needs signal analysis or time-sensitive audio logic.

## Purpose

- Make signal work measurable and reproducible.
- Keep audio-timing assumptions explicit.
- Support low-latency sensory behavior.

## When To Use

- Analysis of audio timing or signal shape.
- Low-latency measurement work.
- Audio/haptic alignment tasks.

## When Not To Use

- UI layout.
- High-level planning.
- Pure documentation cleanup.

## Inputs

- The signal or timing question.
- The measurable target.
- The data source or trace.

## Outputs

- A signal analysis or filter.
- A timing budget or threshold.
- A note on uncertainty.

## Verification

- The analysis is reproducible.
- The measured effect matches the expected one.
- The output is usable by audio or haptics work.
