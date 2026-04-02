---
name: serialization
description: Stable data formats, snapshots, and wire compatibility for Tremor.
---

# Serialization

Use when Tremor data needs to move between memory, disk, or devices.

## Purpose

- Keep data formats stable and inspectable.
- Make snapshots and wire payloads reproducible.
- Reduce accidental compatibility breaks.

## When To Use

- State snapshots.
- Network payloads.
- Persisted or exported structured data.

## When Not To Use

- UI layout.
- One-off ad hoc strings.
- Purely internal calculations.

## Inputs

- The data model.
- Compatibility expectations.
- Any size or latency constraints.

## Outputs

- A stable encoding or decoding path.
- Compatibility notes.
- Test coverage for the format.

## Verification

- Round-trip behavior is stable.
- Old data still decodes as expected.
- The format change is documented.
