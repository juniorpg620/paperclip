---
name: hardware-testing
description: Real-device validation and lab hygiene for Tremor.
---

# Hardware Testing

Use when Tremor needs to validate behavior on actual devices, not just in theory.

## Purpose

- Confirm the system behaves on the hardware the studio actually owns.
- Catch thermal, battery, and sensor issues that simulators miss.
- Keep the device farm and lab state legible.

## When To Use

- Device-specific validation.
- Lab or device farm checks.
- Thermal, battery, or sensor-sensitive features.

## When Not To Use

- Purely simulated behavior.
- A software-only issue with no hardware dependency.
- Product strategy.

## Inputs

- The device or hardware class under test.
- The failure mode or performance target.
- The measurement the team cares about.

## Outputs

- A real-device validation result.
- Lab notes that other roles can use.
- A clear next step if the hardware fails.

## Verification

- The check runs on the intended device class.
- Thermal and timing effects are recorded.
- The result is usable by QA and ops.
