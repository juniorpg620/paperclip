---
name: signal-processing
description: Filtered signals, transforms, and measurable sensory data for Tremor.
---

# Signal Processing

Use when Tremor needs to transform or interpret a signal with care.

## Purpose

- Turn raw sensor or audio data into something useful.
- Keep transforms reproducible.
- Support the sensory and verification stack.

## When To Use

- Filtering or feature extraction.
- Sensor transforms.
- Signal-level analysis for board or audio behavior.

## When Not To Use

- UI work.
- Strategy or planning.
- One-off guesswork.

## Inputs

- Raw data.
- Expected signal characteristics.
- The downstream consumer.

## Outputs

- A transform or interpretation.
- A known-good threshold or metric.
- Notes on the assumptions used.

## Verification

- The transform is stable.
- The result is measurable.
- The downstream role can use it directly.
